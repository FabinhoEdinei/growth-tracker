'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/tv-empresarial/page.tsx
// TV Empresarial — Dashboard com dados reais do Growth Tracker
// + GTNewsTicker (faixa breaking news ao vivo na base)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';

import MetaCard        from '@/app/components/tv/MetaCard';
import ProducaoCard    from '@/app/components/tv/ProducaoCard';
import RankingCard     from '@/app/components/tv/RankingCard';
import ComunicadoCard  from '@/app/components/tv/ComunicadoCard';
import ClimaCard       from '@/app/components/tv/ClimaCard';
import TvFooter        from '@/app/components/tv/TvFooter';
import DailyReportCard    from '@/app/components/tv/DailyReportCard';
import AppGrowthCard      from '@/app/components/tv/AppGrowthCard';
import JornalBlogFeedCard from '@/app/components/tv/JornalBlogFeedCard';
import CodeHealthCard     from '@/app/components/tv/CodeHealthCard';

// 🆕 Faixa de notícias ao vivo
import { GTNewsTicker } from '@/app/components/GTNewsTicker';

import type { DailyReport } from '@/app/utils/daily-report-generator';

// ── Tipos ─────────────────────────────────────────────────────────────────────
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
interface NewsItem {
  id: string; category: string; label: string;
  text: string; timestamp: number; urgent?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TvEmpresarial() {
  const [data,        setData]        = useState<ApiResponse | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [ultimaSync,  setUltimaSync]  = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  // Ticker
  const [tickerSpeed, setTickerSpeed] = useState(80);
  const [tickerOn,    setTickerOn]    = useState(true);
  const [lastNews,    setLastNews]    = useState<NewsItem | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchDados = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else          setLoading(true);
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

  useEffect(() => {
    fetchDados();
    if (!autoRefresh) return;
    const id = setInterval(() => fetchDados(), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchDados]);

  const relatorio = data?.relatorio ?? null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="tv-root">

      {/* Glows de fundo */}
      <div className="tv-bg-glow glow-cyan"   aria-hidden />
      <div className="tv-bg-glow glow-blue"   aria-hidden />
      <div className="tv-bg-glow glow-purple" aria-hidden />

      {/* ── Conteúdo — padding-bottom reserva espaço para o ticker fixo ── */}
      <div className="tv-content">

        {/* ════ HEADER ════ */}
        <header className="tv-header">
          <div>
            <h1 className="tv-title">📺 TV EMPRESARIAL</h1>
            <p className="tv-subtitle">
              Dashboard Inteligente · Growth Tracker ·{' '}
              <span className="tv-subtitle-data">
                {new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long' })}
              </span>
            </p>

            {/* Último destaque clicado no ticker */}
            {lastNews && (
              <div className="tv-last-news">
                <span className="tv-dot">●</span>
                <span className="tv-last-text">{lastNews.text}</span>
              </div>
            )}
          </div>

          <div className="tv-header-actions">
            {ultimaSync && (
              <div className="tv-sync-badge">
                <Clock className="tv-sync-icon" />
                <span>{ultimaSync.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}</span>
              </div>
            )}

            {/* Controles do ticker */}
            <div className="tv-ticker-controls">
              <span className="tv-ticker-label">TICKER</span>
              <button
                onClick={() => setTickerOn(v => !v)}
                className={`tv-tck-btn ${tickerOn ? 'on' : 'off'}`}
                title={tickerOn ? 'Pausar' : 'Retomar'}
              >{tickerOn ? '⏸' : '▶'}</button>
              {[40, 80, 140].map(v => (
                <button
                  key={v}
                  onClick={() => setTickerSpeed(v)}
                  className={`tv-tck-speed ${tickerSpeed===v ? 'active' : ''}`}
                >
                  {v===40 ? '1×' : v===80 ? '2×' : '3×'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setAutoRefresh(v => !v)}
              className={`tv-btn-toggle ${autoRefresh ? 'tv-btn-toggle--on' : 'tv-btn-toggle--off'}`}
            >
              {autoRefresh ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{autoRefresh ? 'Live' : 'Pausado'}</span>
            </button>

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

        {/* ════ SEÇÃO 1 ════ */}
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
              <button onClick={() => fetchDados(true)} className="tv-btn-retry">Tentar novamente</button>
            </div>
          ) : (
            <div className="tv-grid-app">
              <div className="tv-col-main"><DailyReportCard relatorio={relatorio} /></div>
              <div className="tv-col-side">
                <AppGrowthCard      relatorio={relatorio} />
                <JornalBlogFeedCard relatorio={relatorio} />
                <CodeHealthCard     relatorio={relatorio} />
              </div>
            </div>
          )}
        </section>

        {/* ════ SEÇÃO 2 ════ */}
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

        <TvFooter />
      </div>

      {/* ════ 🆕 TICKER FIXO NA BASE ════ */}
      <div className="tv-ticker-wrapper">
        <GTNewsTicker
          speed={tickerOn ? tickerSpeed : 0}
          height={44}
          controls={false}
          onItemClick={item => setLastNews(item as NewsItem)}
        />
      </div>

      {/* ── Estilos ─────────────────────────────────────────────────────── */}
      <style jsx>{`
        .tv-root {
          min-height: 100vh;
          background: #080d1a;
          color: #f0f4ff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
          padding-bottom: 44px; /* reserva para o ticker */
        }

        .tv-bg-glow {
          position:fixed; border-radius:50%; pointer-events:none;
          filter:blur(120px); opacity:0.06; z-index:0;
        }
        .glow-cyan   { width:700px;height:700px;background:#06b6d4;top:-200px;left:-200px; }
        .glow-blue   { width:600px;height:600px;background:#3b82f6;bottom:0;right:-150px; }
        .glow-purple { width:500px;height:500px;background:#a855f7;top:40%;left:40%; }

        .tv-content {
          position:relative; z-index:1;
          max-width:1400px; margin:0 auto;
          padding:36px 20px 60px;
          display:flex; flex-direction:column; gap:48px;
        }

        /* Header */
        .tv-header {
          display:flex; align-items:flex-start;
          justify-content:space-between; gap:20px; flex-wrap:wrap;
          animation:slideDown .5s ease-out;
        }
        @keyframes slideDown {
          from{opacity:0;transform:translateY(-16px)}
          to{opacity:1;transform:translateY(0)}
        }
        .tv-title {
          font-size:clamp(1.6rem,4vw,2.8rem); font-weight:900;
          background:linear-gradient(135deg,#22d3ee,#60a5fa,#a78bfa);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; line-height:1.1; margin:0 0 6px;
        }
        .tv-subtitle { font-size:.85rem; color:rgba(255,255,255,.4); margin:0; }
        .tv-subtitle-data { color:rgba(255,255,255,.6); font-weight:500; }

        /* Último destaque */
        .tv-last-news {
          display:flex; align-items:center; gap:6px;
          margin-top:8px; padding:5px 10px;
          background:rgba(255,0,68,.08); border:1px solid rgba(255,0,68,.2);
          border-radius:6px; max-width:480px;
          animation:fadeIn .4s ease;
        }
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .tv-dot  { font-size:8px; color:#ff0044; animation:blink 1s step-end infinite; flex-shrink:0; }
        .tv-last-text {
          font-size:11px; color:rgba(255,255,255,.6);
          font-family:'Courier New',monospace; letter-spacing:.5px;
          line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

        /* Header actions */
        .tv-header-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

        /* Controles do ticker */
        .tv-ticker-controls {
          display:flex; align-items:center; gap:4px; padding:4px 10px;
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08);
          border-radius:8px;
        }
        .tv-ticker-label {
          font-size:8px; color:rgba(255,255,255,.3);
          letter-spacing:1.5px; font-family:'Courier New',monospace; margin-right:3px;
        }
        .tv-tck-btn {
          width:22px; height:22px; display:flex; align-items:center; justify-content:center;
          border-radius:5px; border:1px solid; font-size:9px; cursor:pointer; transition:all .2s;
        }
        .tv-tck-btn.on  { background:rgba(0,212,255,.12); border-color:rgba(0,212,255,.35); color:#00d4ff; }
        .tv-tck-btn.off { background:rgba(255,255,255,.04); border-color:rgba(255,255,255,.1); color:rgba(255,255,255,.4); }
        .tv-tck-speed {
          padding:2px 6px; font-size:9px; font-family:'Courier New',monospace;
          border-radius:4px; border:1px solid rgba(255,255,255,.1);
          background:transparent; color:rgba(255,255,255,.3); cursor:pointer; transition:all .2s;
        }
        .tv-tck-speed.active {
          background:rgba(168,85,247,.2); border-color:rgba(168,85,247,.5); color:#c084fc;
        }

        /* Sync badge */
        .tv-sync-badge {
          display:flex; align-items:center; gap:5px; font-size:.75rem;
          color:rgba(255,255,255,.35); padding:6px 10px;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px;
        }
        .tv-sync-icon { width:12px; height:12px; }

        /* Botões */
        .tv-btn-toggle {
          display:flex; align-items:center; gap:6px; padding:7px 14px;
          border-radius:8px; font-size:.78rem; font-weight:600; border:1px solid; cursor:pointer; transition:all .2s;
        }
        .tv-btn-toggle--on  { background:rgba(6,182,212,.1);border-color:rgba(6,182,212,.4);color:#22d3ee; }
        .tv-btn-toggle--off { background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1);color:rgba(255,255,255,.35); }
        .tv-btn-refresh {
          display:flex; align-items:center; justify-content:center;
          width:36px; height:36px;
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
          border-radius:8px; color:rgba(255,255,255,.5); cursor:pointer; transition:all .2s;
        }
        .tv-btn-refresh:hover:not(:disabled) { background:rgba(255,255,255,.1); color:#fff; }
        .tv-btn-refresh:disabled { opacity:.4; cursor:not-allowed; }
        .tv-btn-back {
          padding:7px 16px; background:rgba(59,130,246,.1);
          border:1px solid rgba(59,130,246,.3); border-radius:8px;
          color:#93c5fd; font-size:.8rem; text-decoration:none; transition:all .2s;
        }
        .tv-btn-back:hover { background:rgba(59,130,246,.2); color:#bfdbfe; }

        /* Seções */
        .tv-section { display:flex; flex-direction:column; gap:20px; }
        .tv-section-title {
          display:flex; align-items:center; gap:12px;
          font-size:1.15rem; font-weight:700; color:rgba(255,255,255,.85); margin:0;
        }
        .tv-section-bar {
          width:4px; height:20px;
          background:linear-gradient(180deg,#22d3ee,#3b82f6);
          border-radius:99px; display:inline-block;
        }

        /* Grids */
        .tv-grid-app { display:grid; grid-template-columns:1fr 380px; gap:20px; align-items:start; }
        .tv-col-main { min-width:0; }
        .tv-col-side { display:flex; flex-direction:column; gap:16px; }
        .tv-grid-ops {
          display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
          gap:16px; align-items:stretch;
        }

        /* Loading / Error */
        .tv-loading {
          background:rgba(255,255,255,.03); border:1px solid rgba(6,182,212,.15);
          border-radius:24px; padding:60px 40px; text-align:center;
          color:rgba(6,182,212,.7); display:flex; flex-direction:column; align-items:center; gap:12px;
        }
        .tv-loading-spinner { font-size:2.5rem; animation:spin 1s linear infinite; }
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .tv-error {
          background:rgba(239,68,68,.06); border:1px solid rgba(239,68,68,.2);
          border-radius:20px; padding:40px; text-align:center; color:#fca5a5;
          display:flex; flex-direction:column; align-items:center; gap:14px;
        }
        .tv-btn-retry {
          padding:8px 20px; background:rgba(239,68,68,.15);
          border:1px solid rgba(239,68,68,.3); border-radius:8px;
          color:#fca5a5; cursor:pointer; font-size:.85rem; transition:all .2s;
        }
        .tv-btn-retry:hover { background:rgba(239,68,68,.25); }

        /* 🆕 Ticker fixo na base */
        .tv-ticker-wrapper {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 50;
        }

        /* Responsivo */
        @media(max-width:1024px) {
          .tv-grid-app { grid-template-columns:1fr; }
          .tv-col-side { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }
        }
        @media(max-width:640px) {
          .tv-content { padding:20px 12px 40px; gap:32px; }
          .tv-col-side { display:flex; }
          .tv-ticker-controls { display:none; }
        }
      `}</style>
    </main>
  );
}
