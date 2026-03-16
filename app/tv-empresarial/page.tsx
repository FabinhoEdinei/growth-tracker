'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/tv-empresarial/page.tsx
// TV Empresarial — Slideshow fullscreen automático
// Cards trocam a cada 8s com slide horizontal
// Pausa ao clicar · Direção ajustável · GTNewsTicker fixo na base
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { GTNewsTicker } from '@/app/components/tv/GTNewsTicker';

import MetaCard       from '@/app/components/tv/MetaCard';
import ProducaoCard   from '@/app/components/tv/ProducaoCard';
import RankingCard    from '@/app/components/tv/RankingCard';
import ComunicadoCard from '@/app/components/tv/ComunicadoCard';
import ClimaCard      from '@/app/components/tv/ClimaCard';

// ── Constantes ────────────────────────────────────────────────────────────────
const SLIDE_MS = 8000;
const TICKER_H = 44;

type Dir = 'left' | 'right';

interface Slide { id: string; label: string; icon: string; color: string; }

const SLIDES: Slide[] = [
  { id:'metas',      label:'Metas do Dia',         icon:'🎯', color:'#00ff88' },
  { id:'producao',   label:'Produção de Conteúdo', icon:'✍️', color:'#00d4ff' },
  { id:'ranking',    label:'Ranking',              icon:'🏆', color:'#ffd700' },
  { id:'comunicado', label:'Comunicado',           icon:'📢', color:'#a855f7' },
  { id:'clima',      label:'Clima',                icon:'🌤️', color:'#38bdf8' },
];

// ── Conteúdo de cada slide ────────────────────────────────────────────────────
function SlideContent({ id }: { id: string }) {
  switch (id) {
    case 'metas':      return <MetaCard />;
    case 'producao':   return <ProducaoCard />;
    case 'ranking':    return <RankingCard />;
    case 'comunicado': return <ComunicadoCard />;
    case 'clima':      return <ClimaCard />;
    default:           return null;
  }
}

// ── Barra de progresso animada ────────────────────────────────────────────────
function ProgressBar({ color, paused, slideKey }: { color: string; paused: boolean; slideKey: string }) {
  const [pct, setPct] = useState(0);
  const rafRef   = useRef<number>();
  const startRef = useRef<number>(0);
  const pausedMs = useRef<number>(0);
  const pauseAt  = useRef<number>(0);

  useEffect(() => {
    setPct(0);
    startRef.current = performance.now();
    pausedMs.current = 0;

    const tick = (now: number) => {
      if (paused) { pauseAt.current = now; rafRef.current = requestAnimationFrame(tick); return; }
      if (pauseAt.current) { pausedMs.current += now - pauseAt.current; pauseAt.current = 0; }
      const elapsed = now - startRef.current - pausedMs.current;
      const p = Math.min((elapsed / SLIDE_MS) * 100, 100);
      setPct(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideKey, paused]);

  return (
    <div style={{ height:3, background:'rgba(255,255,255,.08)', position:'relative' }}>
      <div style={{
        position:'absolute', left:0, top:0, height:'100%',
        width:`${pct}%`, background:color,
        boxShadow:`0 0 8px ${color}99`,
        transition:'none',
      }}/>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function TvEmpresarial() {
  const [cur,       setCur]       = useState(0);
  const [outgoing,  setOutgoing]  = useState<number | null>(null);
  const [dir,       setDir]       = useState<Dir>('left');
  const [paused,    setPaused]    = useState(false);
  const [busy,      setBusy]      = useState(false);
  const [showUI,    setShowUI]    = useState(true);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const uiRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = SLIDES.length;
  const slide = SLIDES[cur];

  // ── Transição ─────────────────────────────────────────────────────────────
  const goTo = useCallback((idx: number, d: Dir) => {
    if (busy || idx === cur) return;
    setBusy(true);
    setOutgoing(cur);
    setDir(d);
    setCur(idx);
    setTimeout(() => { setOutgoing(null); setBusy(false); }, 480);
  }, [busy, cur]);

  const goNext = useCallback(() => goTo((cur + 1) % total, 'left'),  [cur, total, goTo]);
  const goPrev = useCallback(() => goTo((cur - 1 + total) % total, 'right'), [cur, total, goTo]);

  // ── Auto-avanço ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (paused) return;
    timerRef.current = setInterval(goNext, SLIDE_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, goNext]);

  // ── UI timeout ────────────────────────────────────────────────────────────
  const nudgeUI = useCallback(() => {
    setShowUI(true);
    if (uiRef.current) clearTimeout(uiRef.current);
    uiRef.current = setTimeout(() => setShowUI(false), 4500);
  }, []);

  useEffect(() => { nudgeUI(); }, []);

  // ── Teclado ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      nudgeUI();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === ' ')          { e.preventDefault(); setPaused(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev, nudgeUI]);

  // Direção de animação
  const enterFrom = dir === 'left' ? '100%'  : '-100%';
  const exitTo    = dir === 'left' ? '-100%' : '100%';

  return (
    <div
      style={{ position:'fixed', inset:0, background:'#060410', overflow:'hidden', userSelect:'none' }}
      onMouseMove={nudgeUI}
      onTouchStart={nudgeUI}
    >

      {/* ════ ÁREA DE SLIDES (acima do ticker) ════ */}
      <div style={{ position:'absolute', inset:0, bottom:TICKER_H }}>

        {/* Slide saindo */}
        {outgoing !== null && (
          <div key={`out-${outgoing}`} style={{
            position:'absolute', inset:0, zIndex:1,
            animation:`gtExit 480ms cubic-bezier(.4,0,.2,1) forwards`,
            ['--gt-exit' as any]: exitTo,
          }}>
            <CardShell slide={SLIDES[outgoing]} paused={false} hideBar />
          </div>
        )}

        {/* Slide entrando — clique pausa/retoma */}
        <div key={`in-${cur}`} style={{
          position:'absolute', inset:0, zIndex:2,
          animation:`gtEnter 480ms cubic-bezier(.4,0,.2,1) forwards`,
          ['--gt-enter' as any]: enterFrom,
          cursor:'pointer',
        }}
          onClick={() => { setPaused(p => !p); nudgeUI(); }}
        >
          <CardShell slide={slide} paused={paused} />
        </div>

        {/* Overlay de pausa */}
        {paused && (
          <div style={{
            position:'absolute', inset:0, zIndex:5,
            display:'flex', alignItems:'center', justifyContent:'center',
            pointerEvents:'none',
          }}>
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'14px 28px',
              background:'rgba(0,0,0,.75)',
              border:`1.5px solid ${slide.color}`,
              borderRadius:14, backdropFilter:'blur(10px)',
              animation:'gtFade .2s ease',
            }}>
              <span style={{ fontSize:26 }}>⏸</span>
              <div>
                <div style={{ fontFamily:"'Courier New',monospace", fontSize:13, color:'#fff', fontWeight:900, letterSpacing:2 }}>PAUSADO</div>
                <div style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'rgba(255,255,255,.4)', letterSpacing:2, marginTop:3 }}>TOQUE PARA RETOMAR</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════ HUD — aparece/desaparece com inatividade ════ */}
      <div style={{
        position:'absolute', inset:0, bottom:TICKER_H,
        zIndex:10, pointerEvents:'none',
        opacity: showUI ? 1 : 0,
        transition:'opacity .7s ease',
      }}>

        {/* ── Header ── */}
        <div style={{
          position:'absolute', top:0, left:0, right:0,
          padding:'12px 16px 16px',
          background:'linear-gradient(180deg,rgba(0,0,0,.85) 0%,transparent 100%)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          pointerEvents:'auto',
        }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:16, filter:`drop-shadow(0 0 8px ${slide.color})` }}>📺</span>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, fontWeight:900, letterSpacing:3, color:'rgba(255,255,255,.85)' }}>
              GT NETWORK
            </span>
            {!paused && (
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'#ff0044', fontWeight:900, letterSpacing:2, animation:'gtBlink 1s step-end infinite' }}>● AO VIVO</span>
            )}
          </div>

          {/* Dots de navegação */}
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            {SLIDES.map((s, i) => (
              <button key={s.id} onClick={() => { goTo(i, i > cur ? 'left' : 'right'); nudgeUI(); }} style={{
                width: i===cur ? 22 : 7, height:7, borderRadius:4,
                background: i===cur ? slide.color : 'rgba(255,255,255,.2)',
                border:'none', cursor:'pointer', padding:0,
                boxShadow: i===cur ? `0 0 8px ${slide.color}` : 'none',
                transition:'all .35s',
              }}/>
            ))}
          </div>

          {/* Ações do header */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {/* ⚙️ Editar programação */}
            <Link href="/tv-empresarial/config" style={{
              fontFamily:"'Courier New',monospace",
              fontSize:9, color:'#ff8c42', textDecoration:'none',
              padding:'4px 10px',
              background:'rgba(255,140,66,.12)',
              border:'1px solid rgba(255,140,66,.35)',
              borderRadius:12, letterSpacing:1, fontWeight:700,
            }}>⚙️ EDITAR</Link>

            {/* Voltar */}
            <Link href="/" style={{
              fontFamily:"'Courier New',monospace",
              fontSize:9, color:'rgba(255,255,255,.45)', textDecoration:'none',
              padding:'4px 11px', border:'1px solid rgba(255,255,255,.14)',
              borderRadius:12, letterSpacing:1,
            }}>← VOLTAR</Link>
          </div>
        </div>

        {/* ── Setas laterais ── */}
        {(['prev','next'] as const).map(side => (
          <button key={side}
            onClick={() => { side==='prev' ? goPrev() : goNext(); nudgeUI(); }}
            style={{
              position:'absolute', top:'50%', transform:'translateY(-50%)',
              [side==='prev'?'left':'right']: 10,
              width:42, height:42, borderRadius:'50%',
              background:'rgba(0,0,0,.65)',
              border:`1px solid rgba(255,255,255,.18)`,
              color:'rgba(255,255,255,.7)', fontSize:15,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              backdropFilter:'blur(8px)', pointerEvents:'auto',
              transition:'background .2s',
              fontFamily:'monospace',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(0,0,0,.65)'; }}
          >{side==='prev' ? '◀' : '▶'}</button>
        ))}

        {/* ── Controles base ── */}
        <div style={{
          position:'absolute', bottom:8, left:0, right:0,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 14px', pointerEvents:'auto',
        }}>
          {/* Nome do card */}
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ fontSize:14 }}>{slide.icon}</span>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(255,255,255,.5)', letterSpacing:1.5, fontWeight:700 }}>
              {slide.label.toUpperCase()}
            </span>
          </div>

          {/* Direção + contador */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button
              onClick={() => setDir(d => d==='left'?'right':'left')}
              style={{
                fontFamily:"'Courier New',monospace",
                padding:'3px 9px', fontSize:8, letterSpacing:1,
                background:'rgba(0,0,0,.65)',
                border:`1px solid ${slide.color}55`,
                borderRadius:7, color:slide.color,
                cursor:'pointer', backdropFilter:'blur(8px)',
              }}
            >{dir==='left' ? '→ DIRETA' : '← ESQUERDA'}</button>

            <div style={{
              fontFamily:"'Courier New',monospace",
              padding:'3px 9px', fontSize:8, letterSpacing:1,
              background:'rgba(0,0,0,.65)',
              border:'1px solid rgba(255,255,255,.12)',
              borderRadius:7, color:'rgba(255,255,255,.4)',
            }}>{cur+1}/{total}</div>
          </div>
        </div>
      </div>

      {/* ════ TICKER ════ */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:20 }}>
        <GTNewsTicker speed={80} height={TICKER_H} controls={false} />
      </div>

      {/* ════ KEYFRAMES ════ */}
      <style>{`
        @keyframes gtEnter {
          from { transform:translateX(var(--gt-enter)); opacity:.5; }
          to   { transform:translateX(0);              opacity:1;  }
        }
        @keyframes gtExit {
          from { transform:translateX(0);             opacity:1;  }
          to   { transform:translateX(var(--gt-exit)); opacity:.3; }
        }
        @keyframes gtBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes gtFade  { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}

// ── Wrapper visual de cada slide ──────────────────────────────────────────────
function CardShell({ slide, paused, hideBar }: { slide: Slide; paused: boolean; hideBar?: boolean }) {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column' }}>
      {/* Glow de fundo */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse at 50% 35%, ${slide.color}12 0%, transparent 65%)`,
      }}/>

      {/* Conteúdo centralizado */}
      <div style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:`${56}px 24px 16px`,
        overflow:'hidden', position:'relative', zIndex:1,
      }}>
        <div style={{ width:'100%', maxWidth:560 }}>
          <SlideContent id={slide.id} />
        </div>
      </div>

      {/* Barra de progresso */}
      {!hideBar && (
        <ProgressBar color={slide.color} paused={paused} slideKey={slide.id} />
      )}
    </div>
  );
}
