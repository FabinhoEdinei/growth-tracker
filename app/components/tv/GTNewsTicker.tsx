'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════

type NewsCategory = 'blog' | 'jornal' | 'etf' | 'meta' | 'financas' | 'breaking';

interface NewsItem {
  id:        string;
  category:  NewsCategory;
  label:     string;   // prefixo ex: "BLOG" "ETF" "MERCADO"
  text:      string;
  timestamp: number;
  urgent?:   boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CORES E ÍCONES POR CATEGORIA
// ═══════════════════════════════════════════════════════════════════════════

const CAT: Record<NewsCategory, { color: string; bg: string; icon: string; label: string }> = {
  blog:      { color: '#00d4ff', bg: 'rgba(0,212,255,0.15)',    icon: '📝', label: 'BLOG'     },
  jornal:    { color: '#ff8c42', bg: 'rgba(255,140,66,0.15)',   icon: '📰', label: 'JORNAL'   },
  etf:       { color: '#ffd700', bg: 'rgba(255,215,0,0.15)',    icon: '🔮', label: 'TOKEN ETF' },
  meta:      { color: '#cc00ff', bg: 'rgba(204,0,255,0.15)',    icon: '🎯', label: 'META'     },
  financas:  { color: '#00ff88', bg: 'rgba(0,255,136,0.15)',    icon: '💰', label: 'MERCADO'  },
  breaking:  { color: '#ff0044', bg: 'rgba(255,0,68,0.20)',     icon: '🔴', label: 'BREAKING' },
};

// ═══════════════════════════════════════════════════════════════════════════
// FALLBACK — notícias locais enquanto API carrega
// ═══════════════════════════════════════════════════════════════════════════

const FALLBACK_NEWS: NewsItem[] = [
  { id:'f1', category:'breaking', label:'BREAKING', text:'Growth Tracker ao vivo — sistema inicializando transmissão global', timestamp: Date.now(), urgent: true },
  { id:'f2', category:'etf',      label:'TOKEN ETF', text:'Sistema de tokenização GT-Chain ativo — aguardando novos blocos', timestamp: Date.now() },
  { id:'f3', category:'blog',     label:'BLOG',      text:'Conectando ao repositório de posts — carregando programação', timestamp: Date.now() },
  { id:'f4', category:'jornal',   label:'JORNAL',    text:'Edições do jornal sendo indexadas pelo sistema neural', timestamp: Date.now() },
  { id:'f5', category:'meta',     label:'META',      text:'Módulo de metas e agenda sincronizando com base orbital', timestamp: Date.now() },
  { id:'f6', category:'financas', label:'MERCADO',   text:'Indicadores financeiros carregando — monitoramento ativo', timestamp: Date.now() },
];

// ═══════════════════════════════════════════════════════════════════════════
// HOOK — busca dados reais das APIs
// ═══════════════════════════════════════════════════════════════════════════

function useNewsData(refreshMs = 120_000) {
  const [items,   setItems]   = useState<NewsItem[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);
  const [live,    setLive]    = useState(false);

  const fetch_news = useCallback(async () => {
    const news: NewsItem[] = [];

    // ── ETF ────────────────────────────────────────────────────────────────
    try {
      const res  = await fetch('/api/etf-cota', { cache: 'no-store' });
      const data = await res.json();
      const cota = data?.cota;
      if (cota?.codigoCompleto) {
        news.push({
          id:        `etf-${cota.codigoCompleto}`,
          category:  'etf',
          label:     'TOKEN ETF',
          text:      `Nova cota emitida ${cota.codigoCompleto} · valor R$ ${(cota.valorTotal ?? 3600).toLocaleString('pt-BR')} · status ${cota.status === 'disponivel' ? 'DISPONÍVEL' : 'VENDIDA'}`,
          timestamp: Date.now(),
          urgent:    cota.status === 'disponivel',
        });
        // Resumo de posts
        const r = data?.resumo;
        if (r) {
          news.push({
            id:       'etf-resumo',
            category: 'financas',
            label:    'MERCADO',
            text:     `Portfólio de conteúdo · ${r.postsBlog ?? 0} posts no blog · ${r.postsJornal ?? 0} edições no jornal · ${r.totalPosts ?? 0} ativos totais`,
            timestamp: Date.now(),
          });
        }
      }
    } catch { /* silencia */ }

    // ── Code Stats (blog / jornal / tv) ────────────────────────────────────
    try {
      const res  = await fetch('/api/code-stats', { cache: 'no-store' });
      const data = await res.json();
      const posts = Array.isArray(data?.posts) ? data.posts : [];

      // Blog — últimos 4
      posts
        .filter((p: any) => p.tipo === 'blog')
        .slice(0, 4)
        .forEach((p: any) => {
          news.push({
            id:       `blog-${p.slug}`,
            category: 'blog',
            label:    'BLOG',
            text:     `${p.titulo}${p.category ? ` · ${p.category}` : ''}${p.date ? ` · ${new Date(p.date).toLocaleDateString('pt-BR')}` : ''}`,
            timestamp: p.date ? new Date(p.date).getTime() : Date.now(),
          });
        });

      // Jornal — últimas 3
      posts
        .filter((p: any) => p.tipo === 'jornal')
        .slice(0, 3)
        .forEach((p: any) => {
          news.push({
            id:       `jornal-${p.slug}`,
            category: 'jornal',
            label:    'JORNAL',
            text:     `${p.titulo}${p.category ? ` · Editoria: ${p.category}` : ''}`,
            timestamp: p.date ? new Date(p.date).getTime() : Date.now(),
          });
        });
    } catch { /* silencia */ }

    // ── Daily report ───────────────────────────────────────────────────────
    try {
      const res  = await fetch('/api/daily-report', { cache: 'no-store' });
      const data = await res.json();
      if (data?.summary || data?.headline) {
        news.push({
          id:       'daily-' + Date.now(),
          category: 'breaking',
          label:    'BREAKING',
          text:     data.headline ?? data.summary ?? 'Relatório diário disponível',
          timestamp: Date.now(),
          urgent:   true,
        });
      }
    } catch { /* silencia */ }

    if (news.length > 0) {
      // Ordena: urgent primeiro, depois por timestamp desc
      news.sort((a, b) => {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return  1;
        return b.timestamp - a.timestamp;
      });
      setItems(news);
      setLive(true);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetch_news();
    const timer = setInterval(fetch_news, refreshMs);
    return () => clearInterval(timer);
  }, [fetch_news, refreshMs]);

  return { items, loading, live };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL — GTNewsTicker
// ═══════════════════════════════════════════════════════════════════════════

interface GTNewsTickerProps {
  /** Velocidade em px/s — padrão 80 */
  speed?:    number;
  /** Altura da faixa em px — padrão 44 */
  height?:   number;
  /** Mostrar controles play/pause */
  controls?: boolean;
  /** Callback quando item clicado */
  onItemClick?: (item: NewsItem) => void;
}

export function GTNewsTicker({
  speed    = 80,
  height   = 44,
  controls = true,
  onItemClick,
}: GTNewsTickerProps) {
  const { items, loading, live } = useNewsData();

  const trackRef    = useRef<HTMLDivElement>(null);
  const animRef     = useRef<number>();
  const posRef      = useRef(0);          // posição X atual em px
  const pausedRef   = useRef(false);
  const lastTimeRef = useRef<number>(0);

  const [paused,      setPaused]      = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackWidth,  setTrackWidth]  = useState(0);

  // Mede a largura total da faixa de notícias
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setTrackWidth(el.scrollWidth));
    obs.observe(el);
    setTrackWidth(el.scrollWidth);
    return () => obs.disconnect();
  }, [items]);

  // Atualiza qual item está mais visível (para destaque)
  const updateActiveIndex = useCallback((pos: number) => {
    if (!trackRef.current) return;
    const children = Array.from(trackRef.current.children) as HTMLElement[];
    const mid      = window.innerWidth / 2;
    let   closest  = 0;
    let   minDist  = Infinity;
    children.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist   = Math.abs(center - mid);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  }, []);

  // Loop de animação
  useEffect(() => {
    if (!trackWidth) return;

    const animate = (time: number) => {
      if (!pausedRef.current) {
        const dt = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
        posRef.current -= speed * dt;

        // Reseta quando a faixa passa completamente
        if (Math.abs(posRef.current) >= trackWidth / 2) {
          posRef.current = 0;
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${posRef.current}px)`;
          updateActiveIndex(posRef.current);
        }
      }
      lastTimeRef.current = time;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [trackWidth, speed, updateActiveIndex]);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(p => !p);
  };

  // Duplica os items para loop contínuo sem salto
  const loopItems = [...items, ...items];

  const now = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <div style={{
      position:   'relative',
      width:      '100%',
      height:     height,
      background: 'linear-gradient(90deg, rgba(4,2,12,0.97) 0%, rgba(8,4,20,0.97) 50%, rgba(4,2,12,0.97) 100%)',
      borderTop:    '1px solid rgba(0,212,255,0.3)',
      borderBottom: '1px solid rgba(0,212,255,0.15)',
      overflow:   'hidden',
      display:    'flex',
      alignItems: 'center',
      userSelect: 'none',
      boxShadow:  '0 -4px 30px rgba(0,212,255,0.08), 0 4px 30px rgba(0,212,255,0.05)',
    }}>

      {/* ── Gradiente esquerda (fade) ── */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 160, zIndex: 3, pointerEvents: 'none',
        background: 'linear-gradient(90deg, rgba(4,2,12,1) 0%, rgba(4,2,12,0.85) 60%, transparent 100%)',
      }} />

      {/* ── Logo / cabeçalho fixo ── */}
      <div style={{
        position:   'absolute', left: 0, top: 0, bottom: 0,
        zIndex:     4,
        display:    'flex', alignItems: 'center', gap: 8,
        padding:    '0 14px',
        background: 'linear-gradient(135deg, rgba(255,0,68,0.9), rgba(180,0,50,0.9))',
        borderRight: '2px solid rgba(255,0,68,0.6)',
        minWidth:   90,
      }}>
        <span style={{ fontSize: 9, animation: live ? 'gtBlink 1s step-end infinite' : 'none' }}>🔴</span>
        <span style={{
          fontFamily:    "'Courier New', monospace",
          fontSize:      10, fontWeight: 900,
          letterSpacing: 2, color: '#fff',
          textShadow:    '0 0 10px rgba(255,100,100,0.8)',
        }}>
          {live ? 'AO VIVO' : 'GT-TV'}
        </span>
      </div>

      {/* ── Faixa de notícias ── */}
      <div style={{ flex: 1, overflow: 'hidden', marginLeft: 90, marginRight: controls ? 120 : 60 }}>
        <div
          ref={trackRef}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        0,
            whiteSpace: 'nowrap',
            willChange: 'transform',
          }}
        >
          {loopItems.map((item, i) => {
            const cat      = CAT[item.category];
            const isActive = i % items.length === activeIndex % items.length;

            return (
              <div
                key={`${item.id}-${i}`}
                onClick={() => onItemClick?.(item)}
                style={{
                  display:    'inline-flex',
                  alignItems: 'center',
                  gap:        8,
                  padding:    '0 20px',
                  height:     height,
                  cursor:     onItemClick ? 'pointer' : 'default',
                  transition: 'opacity 0.3s',
                  opacity:    isActive ? 1 : 0.65,
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Categoria badge */}
                <span style={{
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           4,
                  padding:       '2px 8px',
                  background:    cat.bg,
                  border:        `1px solid ${cat.color}55`,
                  borderRadius:  4,
                  fontFamily:    "'Courier New', monospace",
                  fontSize:      9,
                  fontWeight:    900,
                  letterSpacing: 1.5,
                  color:         cat.color,
                  textShadow:    `0 0 8px ${cat.color}`,
                  flexShrink:    0,
                  animation:     item.urgent && isActive ? 'gtPulseLabel 0.8s ease-in-out infinite' : 'none',
                }}>
                  {cat.icon} {cat.label}
                </span>

                {/* Separador */}
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, flexShrink: 0 }}>◆</span>

                {/* Texto */}
                <span style={{
                  fontFamily:    "'Courier New', monospace",
                  fontSize:      11,
                  letterSpacing: 0.8,
                  color:         item.urgent && isActive
                    ? cat.color
                    : 'rgba(255,255,255,0.82)',
                  textShadow:    item.urgent && isActive
                    ? `0 0 12px ${cat.color}88`
                    : 'none',
                  fontWeight:    item.urgent ? 700 : 400,
                }}>
                  {item.text}
                </span>

                {/* Separador de item */}
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 16, margin: '0 8px', flexShrink: 0 }}>
                  ·
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Gradiente direita (fade) ── */}
      <div style={{
        position: 'absolute', right: controls ? 116 : 56, top: 0, bottom: 0,
        width: 80, zIndex: 3, pointerEvents: 'none',
        background: 'linear-gradient(270deg, rgba(4,2,12,1) 0%, transparent 100%)',
      }} />

      {/* ── Relógio + controles ── */}
      <div style={{
        position:   'absolute', right: 0, top: 0, bottom: 0,
        zIndex:     4,
        display:    'flex', alignItems: 'center', gap: 6,
        padding:    '0 12px',
        background: 'rgba(4,2,12,0.95)',
        borderLeft: '1px solid rgba(0,212,255,0.2)',
      }}>
        {/* Relógio */}
        <ClockDisplay />

        {controls && (
          <button
            onClick={togglePause}
            title={paused ? 'Retomar' : 'Pausar'}
            style={{
              width:      28, height: 28,
              display:    'flex', alignItems: 'center', justifyContent: 'center',
              background: paused ? 'rgba(0,255,136,0.15)' : 'rgba(0,212,255,0.1)',
              border:     `1px solid ${paused ? 'rgba(0,255,136,0.4)' : 'rgba(0,212,255,0.3)'}`,
              borderRadius: 6,
              color:      paused ? '#00ff88' : '#00d4ff',
              fontSize:   11, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {paused ? '▶' : '⏸'}
          </button>
        )}

        {/* Indicador live/loading */}
        <div style={{
          width:      6, height: 6, borderRadius: '50%',
          background: loading ? '#ffaa00' : live ? '#00ff88' : '#4b5563',
          boxShadow:  loading
            ? '0 0 6px #ffaa00'
            : live
              ? '0 0 6px #00ff88'
              : 'none',
          animation:  live ? 'gtBlink 2s ease-in-out infinite' : 'none',
          flexShrink: 0,
        }} />
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes gtBlink {
          0%,100% { opacity:1; }
          50%      { opacity:.3; }
        }
        @keyframes gtPulseLabel {
          0%,100% { box-shadow: 0 0 0 rgba(255,0,68,0); }
          50%     { box-shadow: 0 0 12px rgba(255,0,68,0.6); }
        }
      `}</style>
    </div>
  );
}

// ── Relógio que atualiza a cada segundo ───────────────────────────────────────
function ClockDisplay() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(
      new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
    );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <span style={{
      fontFamily:    "'Courier New', monospace",
      fontSize:      10, fontWeight: 700,
      letterSpacing: 1.5,
      color:         'rgba(0,212,255,0.7)',
      minWidth:      58, textAlign: 'center',
    }}>
      {time}
    </span>
  );
}
