'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/tv-empresarial/page.tsx
// TV Empresarial — Dashboard com dados reais do Growth Tracker
// Consome /api/tv-report (enriquecido) e exibe crescimento real do app
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';

// Cards existentes (inalterados)
import MetaCard        from '@/app/components/tv/MetaCard';
import ProducaoCard    from '@/app/components/tv/ProducaoCard';
import RankingCard     from '@/app/components/tv/RankingCard';
import ComunicadoCard  from '@/app/components/tv/ComunicadoCard';
import ClimaCard       from '@/app/components/tv/ClimaCard';
import TvFooter        from '@/app/components/tv/TvFooter';

// Cards novos / atualizados com dados reais
import DailyReportCard    from '@/app/components/tv/DailyReportCard';
import AppGrowthCard      from '@/app/components/tv/AppGrowthCard';
import JornalBlogFeedCard from '@/app/components/tv/JornalBlogFeedCard';
import CodeHealthCard     from '@/app/components/tv/CodeHealthCard';

import type { DailyReport } from '@/app/utils/daily-report-generator';

// ── Tipo enriquecido retornado pela nova rota /api/tv-report ──────────────────

interface TvReport extends DailyReport {
  tv: {
    scoreSaude:        number;
    tendencia:         'crescendo' | 'estável' | 'atenção';
    totalConteudo:     number;
    statusApp:         string;
    ultimaAtualizacao: string;
    alertas:           string[];
    destaques:         string[];
  };
}

interface ApiResponse {
  relatorio: TvReport;
  jornal:    null | { gerado: boolean; slug?: string; motivo?: string };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function TvEmpresarial() {
  const [data,        setData]        = useState<ApiResponse | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [ultimaSync,  setUltimaSync]  = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  // ── Buscar dados da API enriquecida ──────────────────────────────────────

  const fetchDados = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else          setLoading(true);

      // Usa a nova rota /api/tv-report (não gera jornal automaticamente)
      const res = await fetch('/api/tv-report');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json: ApiResponse = await res.json();
      setData(json);
      setError(null);
      setUltimaSync(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ── Montagem + auto-refresh a cada 5 min ─────────────────────────────────

  useEffect(() => {
    fetchDados();
    if (!autoRefresh) return;
    const id = setInterval(() => fetchDados(), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchDados]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const relatorio = data?.relatorio ?? null;

  return (
    <main className="tv-root">

      {/* ── Fundo animado ──────────────────────────────────────────────────── */}
      <div className="tv-bg-glow glow-cyan"  aria-hidden />
      <div className="tv-bg-glow glow-blue"  aria-hidden />
      <div className="tv-bg-glow glow-purple" aria-hidden />

      <div className="tv-content">

        {/* ════════════════════════════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════════════════════════════ */}
        <header className="tv-header">
          <div>
            <h1 className="tv-title">📺 TV EMPRESARIAL</h1>
            <p className="tv-subtitle">
              Dashboard Inteligente · Growth Tracker ·{' '}
              <span className="tv-subtitle-data">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </span>
            </p>
          </div>

          <div className="tv-header-actions">
            {/* Status de sync */}
            {ultimaSync && (
              <div className="tv-sync-badge">
                <Clock className="tv-sync-icon" />
                <span>
                  {ultimaSync.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}

            {/* Toggle auto-refresh */}
            <button
              onClick={() => setAutoRefresh(v => !v)}
              className={`tv-btn-toggle ${autoRefresh ? 'tv-btn-toggle--on' : 'tv-btn-toggle--off'}`}
              title={autoRefresh ? 'Auto-refresh ativo' : 'Auto-refresh pausado'}
            >
              {autoRefresh ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{autoRefresh ? 'Live' : 'Pausado'}</span>
            </button>

            {/* Refresh manual */}
            <button
              onClick={() => fetchDados(true)}
              disabled={refreshing}
              className="tv-btn-refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <Link href="/" className="tv-btn-back">← Voltar</Link>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════════════
            SEÇÃO 1 — DADOS REAIS DO APP
            DailyReportCard ocupa coluna grande + AppGrowthCard ao lado
        ════════════════════════════════════════════════════════════════════ */}
        <section className="tv-section">
          <h2 className="tv-section-title">
            <span className="tv-section-bar" />
            📡 Atividade Real do App
          </h2>

          {loading ? (
            <div className="tv-loading">
              <div className="tv-loading-spinner">🔄</div>
              <p>Carregando dados do Growth Tracker...</p>
            </div>
          ) : error || !relatorio ? (
            <div className="tv-error">
              <p>❌ {error || 'Erro ao carregar relatório'}</p>
              <button onClick={() => fetchDados(true)} className="tv-btn-retry">
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="tv-grid-app">
              {/* Coluna principal: relatório completo com gerador de jornal */}
              <div className="tv-col-main">
                <DailyReportCard relatorio={relatorio} />
              </div>

              {/* Coluna lateral: cards de crescimento + feed + código */}
              <div className="tv-col-side">
                <AppGrowthCard      relatorio={relatorio} />
                <JornalBlogFeedCard relatorio={relatorio} />
                <CodeHealthCard     relatorio={relatorio} />
              </div>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SEÇÃO 2 — MÉTRICAS OPERACIONAIS
            Cards fixos da empresa (sem API dinâmica)
        ════════════════════════════════════════════════════════════════════ */}
        <section className="tv-section">
          <h2 className="tv-section-title">
            <span className="tv-section-bar" />
            📊 Métricas Operacionais
          </h2>

          <div className="tv-grid-ops">
            <MetaCard compact />
            <ProducaoCard />
            <RankingCard />
            <ComunicadoCard />
            <ClimaCard />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════════════════════════ */}
        <TvFooter />

      </div>

      {/* ── Estilos escopados ────────────────────────────────────────────────── */}
      <style jsx>{`
        /* ── Root ─────────────────────────────────────────────────────────── */
        .tv-root {
          min-height: 100vh;
          background: #080d1a;
          color: #f0f4ff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Background glows ─────────────────────────────────────────────── */
        .tv-bg-glow {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(120px);
          opacity: 0.06;
          z-index: 0;
        }
        .glow-cyan   { width: 700px; height: 700px; background: #06b6d4; top: -200px; left: -200px; }
        .glow-blue   { width: 600px; height: 600px; background: #3b82f6; bottom: 0; right: -150px; }
        .glow-purple { width: 500px; height: 500px; background: #a855f7; top: 40%; left: 40%; }

        /* ── Conteúdo ─────────────────────────────────────────────────────── */
        .tv-content {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 36px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* ── Header ───────────────────────────────────────────────────────── */
        .tv-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          animation: slideDown 0.5s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .tv-title {
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 900;
          background: linear-gradient(135deg, #22d3ee, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          margin: 0 0 6px;
        }

        .tv-subtitle {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }
        .tv-subtitle-data {
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }

        .tv-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tv-sync-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          padding: 6px 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
        }
        .tv-sync-icon { width: 12px; height: 12px; }

        .tv-btn-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          border: 1px solid;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tv-btn-toggle--on {
          background: rgba(6,182,212,0.1);
          border-color: rgba(6,182,212,0.4);
          color: #22d3ee;
        }
        .tv-btn-toggle--off {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.35);
        }

        .tv-btn-refresh {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.2s;
        }
        .tv-btn-refresh:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .tv-btn-refresh:disabled { opacity: 0.4; cursor: not-allowed; }

        .tv-btn-back {
          padding: 7px 16px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.3);
          border-radius: 8px;
          color: #93c5fd;
          font-size: 0.8rem;
          text-decoration: none;
          transition: all 0.2s;
        }
        .tv-btn-back:hover {
          background: rgba(59,130,246,0.2);
          color: #bfdbfe;
        }

        /* ── Seção ────────────────────────────────────────────────────────── */
        .tv-section { display: flex; flex-direction: column; gap: 20px; }

        .tv-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.15rem;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          margin: 0;
        }

        .tv-section-bar {
          width: 4px;
          height: 20px;
          background: linear-gradient(180deg, #22d3ee, #3b82f6);
          border-radius: 99px;
          display: inline-block;
        }

        /* ── Grid: dados reais do app ──────────────────────────────────────── */
        .tv-grid-app {
          display: grid;
          grid-template-columns: 1fr 380px;
          grid-template-rows: auto;
          gap: 20px;
          align-items: start;
        }

        .tv-col-main { min-width: 0; }

        .tv-col-side {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Grid: métricas operacionais ──────────────────────────────────── */
        .tv-grid-ops {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          align-items: stretch;
        }

        /* ── Loading / Error ──────────────────────────────────────────────── */
        .tv-loading {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(6,182,212,0.15);
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          color: rgba(6,182,212,0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .tv-loading-spinner {
          font-size: 2.5rem;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .tv-error {
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          color: #fca5a5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .tv-btn-retry {
          padding: 8px 20px;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 8px;
          color: #fca5a5;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .tv-btn-retry:hover { background: rgba(239,68,68,0.25); }

        /* ── Responsivo ───────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .tv-grid-app {
            grid-template-columns: 1fr;
          }
          .tv-col-side {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .tv-content { padding: 20px 12px 40px; gap: 32px; }
          .tv-col-side { display: flex; }
        }
      `}</style>
    </main>
  );
}
