// hooks/useGrowthSync.ts
// Busca dados reais de todas as APIs do Growth Tracker
// e sincroniza com o orbitalSystem via syncFromAPI()
//
// Uso: chame uma vez na home/SoftNeuralField e esqueça —
// os orbitais se atualizam sozinhos no canvas.

'use client';

import { useEffect, useRef, useState } from 'react';
import { orbitalSystem, SyncResult } from '@/app/components/OrbitalSystem';
import type { OrbitalPayload } from '@/app/components/orbitalTypes';

// ── Tipos retornados pelas APIs ───────────────────────────────────────────────

interface EtfCoataAPIResponse {
  cota: {
    codigoCompleto: string;
    valorTotal:     number;
    status:         'disponivel' | 'vendida';
    blocos:         { tipo: string; contribuicao: number }[];
  };
  resumo: {
    postsBlog:   number;
    postsJornal: number;
    totalPosts:  number;
  };
}

interface CodeStatsAPIResponse {
  posts?: {
    titulo:   string;
    slug:     string;
    date:     string;
    category: string;
    excerpt?: string;
    tipo:     'blog' | 'jornal' | 'tv';
  }[];
  // fallback se a API retornar outro formato
  [key: string]: unknown;
}

// ── Estado público do hook ────────────────────────────────────────────────────

export interface GrowthSyncState {
  loading:   boolean;
  lastSync:  number | null;   // timestamp da última sincronização
  error:     string | null;
  syncLog:   SyncResult[];    // histórico dos últimos syncs
  snapshot:  Record<string, number>; // quantos orbitais por tipo
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGrowthSync(intervalMs = 60_000) {
  const [state, setState] = useState<GrowthSyncState>({
    loading:  true,
    lastSync: null,
    error:    null,
    syncLog:  [],
    snapshot: {},
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Busca e sincroniza ETF ────────────────────────────────────────────────
  async function syncETF(): Promise<SyncResult> {
    const res  = await fetch('/api/etf-cota', { cache: 'no-store' });
    if (!res.ok) throw new Error(`etf-cota HTTP ${res.status}`);
    const data: EtfCoataAPIResponse = await res.json();

    const cota = data?.cota;
    if (!cota?.codigoCompleto) throw new Error('etf-cota: resposta inválida');

    const payloads: OrbitalPayload[] = [{
      type:       'etf',
      label:      cota.codigoCompleto,
      codigoETF:  cota.codigoCompleto,
      valorETF:   cota.valorTotal,
      statusETF:  cota.status,
      value:      cota.valorTotal,
      priority:   1,
      note:       `${data.resumo?.postsBlog ?? 0} posts blog · ${data.resumo?.postsJornal ?? 0} jornal`,
    }];

    return orbitalSystem.syncFromAPI('etf', payloads);
  }

  // ── Busca e sincroniza Blog + Jornal + TV via /api/code-stats ────────────
  async function syncContent(): Promise<{ blog: SyncResult; jornal: SyncResult; tv: SyncResult }> {
    const res = await fetch('/api/code-stats', { cache: 'no-store' });
    if (!res.ok) throw new Error(`code-stats HTTP ${res.status}`);
    const data: CodeStatsAPIResponse = await res.json();

    const posts = Array.isArray(data?.posts) ? data.posts : [];

    // ── Blog ────────────────────────────────────────────────────────────────
    const blogPayloads: OrbitalPayload[] = posts
      .filter(p => p.tipo === 'blog')
      .slice(0, 6)                          // máx 6 orbitais blog
      .map(p => ({
        type:     'blog' as const,
        label:    p.titulo.length > 28 ? p.titulo.slice(0, 28) + '…' : p.titulo,
        slug:     p.slug,
        category: p.category,
        pubDate:  p.date,
        priority: 2 as const,
        note:     p.excerpt,
      }));

    // ── Jornal ───────────────────────────────────────────────────────────────
    const jornalPayloads: OrbitalPayload[] = posts
      .filter(p => p.tipo === 'jornal')
      .slice(0, 4)
      .map(p => ({
        type:     'jornal' as const,
        label:    p.titulo.length > 28 ? p.titulo.slice(0, 28) + '…' : p.titulo,
        slug:     p.slug,
        category: p.category,
        pubDate:  p.date,
        priority: 2 as const,
      }));

    // ── TV ───────────────────────────────────────────────────────────────────
    const tvPayloads: OrbitalPayload[] = posts
      .filter(p => p.tipo === 'tv')
      .slice(0, 3)
      .map((p, i) => ({
        type:     'tv' as const,
        label:    p.titulo.length > 28 ? p.titulo.slice(0, 28) + '…' : p.titulo,
        slug:     p.slug,
        episode:  i + 1,
        priority: 2 as const,
      }));

    const blog   = orbitalSystem.syncFromAPI('blog',   blogPayloads);
    const jornal = orbitalSystem.syncFromAPI('jornal', jornalPayloads);
    const tv     = orbitalSystem.syncFromAPI('tv',     tvPayloads);

    return { blog, jornal, tv };
  }

  // ── Fallback: se /api/code-stats não retornar posts, usa /api/etf-cota
  //    para pelo menos preencher blog/jornal com contagens ─────────────────
  async function syncContentFallback(etfResumo: EtfCoataAPIResponse['resumo']): Promise<void> {
    if (etfResumo?.postsBlog > 0) {
      // Cria um orbital genérico de blog indicando quantos posts existem
      const payload: OrbitalPayload = {
        type:     'blog',
        label:    `${etfResumo.postsBlog} posts publicados`,
        priority: 3,
        note:     'Sincronize /api/code-stats para detalhes',
      };
      orbitalSystem.syncFromAPI('blog', [payload]);
    }
    if (etfResumo?.postsJornal > 0) {
      const payload: OrbitalPayload = {
        type:     'jornal',
        label:    `${etfResumo.postsJornal} edições`,
        priority: 3,
      };
      orbitalSystem.syncFromAPI('jornal', [payload]);
    }
  }

  // ── Sincronização completa ────────────────────────────────────────────────
  async function runSync() {
    setState(prev => ({ ...prev, loading: true, error: null }));

    const log: SyncResult[] = [];

    try {
      // ETF — sempre busca primeiro (mais crítico)
      try {
        const etfResult = await syncETF();
        log.push(etfResult);
      } catch (e) {
        console.warn('[useGrowthSync] ETF sync falhou:', e);
      }

      // Conteúdo (blog/jornal/tv)
      try {
        const { blog, jornal, tv } = await syncContent();
        log.push(blog, jornal, tv);
      } catch (e) {
        console.warn('[useGrowthSync] code-stats sync falhou, tentando fallback:', e);
        // Fallback: tenta usar dados do resumo do ETF
        try {
          const etfRes = await fetch('/api/etf-cota', { cache: 'no-store' });
          if (etfRes.ok) {
            const etfData: EtfCoataAPIResponse = await etfRes.json();
            await syncContentFallback(etfData.resumo);
          }
        } catch {
          // silencia — orbitais de conteúdo ficarão vazios
        }
      }

      setState({
        loading:  false,
        lastSync: Date.now(),
        error:    null,
        syncLog:  log,
        snapshot: orbitalSystem.snapshot(),
      });

    } catch (e: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error:   e?.message ?? 'Erro desconhecido no sync',
      }));
    }
  }

  // ── Executa na montagem e a cada intervalMs ───────────────────────────────
  useEffect(() => {
    runSync();
    timerRef.current = setInterval(runSync, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  return { ...state, forceSync: runSync };
}
