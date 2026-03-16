// hooks/useTvConfig.ts
// Gerencia toda a configuração da TV Empresarial no localStorage
// Persiste entre sessões, sem servidor

'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type SlideType = 'builtin' | 'blog' | 'jornal' | 'custom';

export interface RankingEntry {
  nome:       string;
  setor:      string;
  pontos:     number;
  variacao:   number; // % positivo ou negativo
  lider?:     boolean;
}

export interface LinhaProducao {
  nome:   string;
  status: 'operando' | 'manutenção' | 'parado';
  pct?:   number;
}

export interface Comunicado {
  tipo:   'URGENTE' | 'NOVIDADE' | 'EVENTO' | 'AVISO';
  titulo: string;
  quando: string;
}

export interface SlideConfig {
  id:       string;
  type:     SlideType;
  label:    string;
  icon:     string;
  color:    string;
  active:   boolean;
  order:    number;

  // ── Dados editáveis por tipo ────────────────────────────────────────────

  // builtin: producao
  producao?: {
    unidadesHoje:     number;
    tempoOperacional: string;
    linhas:           LinhaProducao[];
    alerta?:          string;
  };

  // builtin: ranking
  ranking?: {
    titulo:   string;
    subtitulo: string;
    premio?:  string;
    entries:  RankingEntry[];
  };

  // builtin: comunicado
  comunicado?: {
    items: Comunicado[];
  };

  // builtin: clima
  clima?: {
    cidade:      string;
    temperatura: number;
    condicao:    string;
    umidade:     number;
    vento:       number;
  };

  // builtin: metas
  metas?: {
    items: { texto: string; feito: boolean }[];
  };

  // blog / jornal — slugs selecionados
  selectedSlugs?: string[];

  // custom — campos livres
  custom?: {
    titulo:   string;
    subtitulo?: string;
    corpo:    string;    // texto livre
    rodape?:  string;
    bgColor?: string;
  };
}

// ── Configuração padrão ───────────────────────────────────────────────────────

export const DEFAULT_SLIDES: SlideConfig[] = [
  {
    id: 'metas', type: 'builtin', label: 'Metas do Dia',
    icon: '🎯', color: '#00ff88', active: true, order: 0,
    metas: {
      items: [
        { texto: 'Publicar post semanal', feito: false },
        { texto: 'Atualizar dashboard', feito: false },
        { texto: 'Revisar métricas', feito: true },
      ],
    },
  },
  {
    id: 'producao', type: 'builtin', label: 'Produção de Conteúdo',
    icon: '✍️', color: '#00d4ff', active: true, order: 1,
    producao: {
      unidadesHoje:     4832,
      tempoOperacional: '6h 42m',
      alerta:           'Manutenção preventiva agendada: 14:00',
      linhas: [
        { nome: 'Linha A', status: 'operando',    pct: 94 },
        { nome: 'Linha B', status: 'operando',    pct: 87 },
        { nome: 'Linha C', status: 'manutenção'          },
        { nome: 'Linha D', status: 'operando',    pct: 91 },
      ],
    },
  },
  {
    id: 'ranking', type: 'builtin', label: 'Ranking',
    icon: '🏆', color: '#ffd700', active: true, order: 2,
    ranking: {
      titulo:    'Ranking da Semana',
      subtitulo: 'Top Performers',
      premio:    'Prêmio do mês: Viagem para equipe vencedora!',
      entries: [
        { nome: 'Ana Silva',     setor: 'Vendas',    pontos: 2847, variacao: 12, lider: true },
        { nome: 'Carlos Mendes', setor: 'Produção',  pontos: 2654, variacao: 8  },
        { nome: 'Mariana Costa', setor: 'Vendas',    pontos: 2598, variacao: 15 },
        { nome: 'João Pereira',  setor: 'Logística', pontos: 2341, variacao: -3 },
        { nome: 'Fernanda Lima', setor: 'Produção',  pontos: 2289, variacao: 5  },
      ],
    },
  },
  {
    id: 'comunicado', type: 'builtin', label: 'Comunicados',
    icon: '📢', color: '#a855f7', active: true, order: 3,
    comunicado: {
      items: [
        { tipo: 'URGENTE',  titulo: 'Alteração no horário de almoço',  quando: 'Hoje'         },
        { tipo: 'NOVIDADE', titulo: 'Novo benefício: Gympass',          quando: 'Ontem'        },
        { tipo: 'EVENTO',   titulo: 'Festa de fim de ano - 20/12',      quando: '2 dias atrás' },
      ],
    },
  },
  {
    id: 'clima', type: 'builtin', label: 'Clima',
    icon: '🌤️', color: '#38bdf8', active: true, order: 4,
    clima: {
      cidade:      'São Paulo',
      temperatura: 24,
      condicao:    'Parcialmente nublado',
      umidade:     68,
      vento:       14,
    },
  },
];

// ── Chave do localStorage ─────────────────────────────────────────────────────
const LS_KEY = 'gt_tv_config_v2';

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTvConfig() {
  const [slides,  setSlides]  = useState<SlideConfig[]>(DEFAULT_SLIDES);
  const [loaded,  setLoaded]  = useState(false);

  // Carrega do localStorage na montagem
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved: SlideConfig[] = JSON.parse(raw);
        // Merge: preserva defaults para campos não salvos
        setSlides(saved);
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  // Salva sempre que muda
  const save = useCallback((next: SlideConfig[]) => {
    setSlides(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  // ── Operações ─────────────────────────────────────────────────────────────

  const updateSlide = useCallback((id: string, patch: Partial<SlideConfig>) => {
    setSlides(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...patch } : s);
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const toggleActive = useCallback((id: string) => {
    setSlides(prev => {
      const next = prev.map(s => s.id === id ? { ...s, active: !s.active } : s);
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reorder = useCallback((fromIdx: number, toIdx: number) => {
    setSlides(prev => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      const reindexed = next.map((s, i) => ({ ...s, order: i }));
      try { localStorage.setItem(LS_KEY, JSON.stringify(reindexed)); } catch {}
      return reindexed;
    });
  }, []);

  const addSlide = useCallback((slide: SlideConfig) => {
    setSlides(prev => {
      const next = [...prev, { ...slide, order: prev.length }];
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const removeSlide = useCallback((id: string) => {
    setSlides(prev => {
      const next = prev.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }));
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    save(DEFAULT_SLIDES);
  }, [save]);

  const activeSlides = slides
    .filter(s => s.active)
    .sort((a, b) => a.order - b.order);

  return {
    slides, activeSlides, loaded,
    updateSlide, toggleActive, reorder,
    addSlide, removeSlide, reset,
  };
}
