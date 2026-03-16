'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/tv-empresarial/page.tsx
// TV Empresarial — Slideshow fullscreen automático
// ✅ Conectado ao useTvConfig — lê slides do localStorage
// Cards trocam a cada 8s · Pausa ao clicar · Direção ajustável
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { GTNewsTicker } from '@/app/components/tv/GTNewsTicker';

// Cards builtin
import MetaCard       from '@/app/components/tv/MetaCard';
import ProducaoCard   from '@/app/components/tv/ProducaoCard';
import RankingCard    from '@/app/components/tv/RankingCard';
import ComunicadoCard from '@/app/components/tv/ComunicadoCard';
import ClimaCard      from '@/app/components/tv/ClimaCard';

// ✅ Hook de configuração — fonte única da verdade
import { useTvConfig, type SlideConfig } from '@/hooks/useTvConfig';

// ── Constantes ────────────────────────────────────────────────────────────────
const SLIDE_MS = 8000;
const TICKER_H = 44;

type Dir = 'left' | 'right';

// ─────────────────────────────────────────────────────────────────────────────
// SlideContent — renderiza qualquer tipo de slide
// ─────────────────────────────────────────────────────────────────────────────
function SlideContent({ slide }: { slide: SlideConfig }) {
  // ── Builtin ───────────────────────────────────────────────────────────────
  if (slide.type === 'builtin') {
    switch (slide.id) {
      case 'metas':      return <MetaCard />;
      case 'producao':   return <ProducaoCard />;
      case 'ranking':    return <RankingCard />;
      case 'comunicado': return <ComunicadoCard />;
      case 'clima':      return <ClimaCard />;
      default:           return null;
    }
  }

  // ── Blog / Jornal — lista de posts selecionados ───────────────────────────
  if (slide.type === 'blog' || slide.type === 'jornal') {
    const slugs = slide.selectedSlugs ?? [];
    const cor   = slide.color;
    return (
      <div style={{ width:'100%' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <span style={{ fontSize:28 }}>{slide.icon}</span>
          <div>
            <h2 style={{ margin:0, fontSize:22, fontWeight:900, color:'#fff' }}>{slide.label}</h2>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2, letterSpacing:1 }}>
              {slide.type === 'blog' ? 'BLOG · GROWTH TRACKER' : 'JORNAL · EDIÇÕES'}
            </div>
          </div>
        </div>

        {slugs.length === 0 ? (
          <div style={{ color:'rgba(255,255,255,.3)', fontSize:13, fontStyle:'italic', padding:'20px 0' }}>
            Nenhum post selecionado — edite no ⚙️ editor
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {slugs.map((slug, i) => (
              <div key={slug} style={{
                padding:'12px 16px',
                background:'rgba(255,255,255,.04)',
                border:`1px solid ${cor}25`,
                borderLeft:`3px solid ${cor}`,
                borderRadius:10,
                animation:`gtFade .3s ${i*0.08}s ease backwards`,
              }}>
                <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.85)', marginBottom:3 }}>
                  {slug.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase())}
                </div>
                <div style={{ fontSize:10, color:`${cor}99`, letterSpacing:1 }}>
                  {slide.type.toUpperCase()} · {slug}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Custom — conteúdo livre ───────────────────────────────────────────────
  if (slide.type === 'custom') {
    const d = slide.custom;
    if (!d) return null;
    return (
      <div style={{ width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>{slide.icon}</div>
        {d.subtitulo && (
          <div style={{ fontSize:11, color:slide.color, letterSpacing:3, marginBottom:8, fontFamily:"'Courier New',monospace", fontWeight:700 }}>
            {d.subtitulo.toUpperCase()}
          </div>
        )}
        <h2 style={{ margin:'0 0 20px', fontSize:clamp(20, 32), fontWeight:900, color:'#fff', lineHeight:1.2 }}>
          {d.titulo}
        </h2>
        {d.corpo && (
          <p style={{ fontSize:14, color:'rgba(255,255,255,.7)', lineHeight:1.7, maxWidth:480, margin:'0 auto 20px', whiteSpace:'pre-wrap' }}>
            {d.corpo}
          </p>
        )}
        {d.rodape && (
          <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:1.5, fontFamily:"'Courier New',monospace" }}>
            {d.rodape}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Utilitário simples de clamp para font-size
function clamp(min: number, max: number) {
  return `clamp(${min}px, 4vw, ${max}px)` as unknown as number;
}

// ─────────────────────────────────────────────────────────────────────────────
// ProgressBar
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({ color, paused, slideKey }: { color: string; paused: boolean; slideKey: string }) {
  const [pct,    setPct]    = useState(0);
  const rafRef   = useRef<number>();
  const startRef = useRef<number>(0);
  const pausedMs = useRef<number>(0);
  const pauseAt  = useRef<number>(0);

  useEffect(() => {
    setPct(0);
    startRef.current = performance.now();
    pausedMs.current = 0;
    pauseAt.current  = 0;

    const tick = (now: number) => {
      if (paused) {
        if (!pauseAt.current) pauseAt.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (pauseAt.current) {
        pausedMs.current += now - pauseAt.current;
        pauseAt.current = 0;
      }
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
    <div style={{ height:3, background:'rgba(255,255,255,.08)', position:'relative', flexShrink:0 }}>
      <div style={{
        position:'absolute', left:0, top:0, height:'100%',
        width:`${pct}%`, background:color,
        boxShadow:`0 0 8px ${color}99`,
        transition:'none',
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CardShell — wrapper visual de cada slide
// ─────────────────────────────────────────────────────────────────────────────
function CardShell({ slide, paused, hideBar }: { slide: SlideConfig; paused: boolean; hideBar?: boolean }) {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column' }}>
      {/* Glow */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse at 50% 35%, ${slide.color}12 0%, transparent 65%)`,
      }}/>

      {/* Conteúdo */}
      <div style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:'56px 24px 16px',
        overflow:'hidden', position:'relative', zIndex:1,
      }}>
        <div style={{ width:'100%', maxWidth:560 }}>
          <SlideContent slide={slide} />
        </div>
      </div>

      {/* Barra de progresso */}
      {!hideBar && (
        <ProgressBar color={slide.color} paused={paused} slideKey={slide.id} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading screen enquanto localStorage carrega
// ─────────────────────────────────────────────────────────────────────────────
function TvLoading() {
  return (
    <div style={{
      position:'fixed', inset:0, background:'#060410',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16,
    }}>
      <span style={{ fontSize:48, animation:'gtFade 1s ease-in-out infinite alternate' }}>📺</span>
      <div style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:3 }}>
        CARREGANDO PROGRAMAÇÃO...
      </div>
      <style>{`@keyframes gtFade{from{opacity:.3}to{opacity:1}}`}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export default function TvEmpresarial() {
  // ✅ Fonte única da verdade — vem do localStorage via useTvConfig
  const { activeSlides, loaded } = useTvConfig();

  const [cur,      setCur]      = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [dir,      setDir]      = useState<Dir>('left');
  const [paused,   setPaused]   = useState(false);
  const [busy,     setBusy]     = useState(false);
  const [showUI,   setShowUI]   = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const uiRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Garante que cur nunca ultrapasse o total de slides disponíveis
  const total = activeSlides.length;
  const safeCur = total > 0 ? cur % total : 0;
  const slide   = activeSlides[safeCur];

  // Reseta cur quando slides mudam (ex: volta do editor)
  useEffect(() => {
    if (total > 0 && cur >= total) setCur(0);
  }, [total, cur]);

  // ── Transição ─────────────────────────────────────────────────────────────
  const goTo = useCallback((idx: number, d: Dir) => {
    if (busy || idx === safeCur || total === 0) return;
    setBusy(true);
    setOutgoing(safeCur);
    setDir(d);
    setCur(idx);
    setTimeout(() => { setOutgoing(null); setBusy(false); }, 480);
  }, [busy, safeCur, total]);

  const goNext = useCallback(() => goTo((safeCur + 1) % total, 'left'),           [safeCur, total, goTo]);
  const goPrev = useCallback(() => goTo((safeCur - 1 + total) % total, 'right'),  [safeCur, total, goTo]);

  // ── Auto-avanço ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (paused || total === 0) return;
    timerRef.current = setInterval(goNext, SLIDE_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, goNext, total]);

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

  // ── Aguarda localStorage carregar — mas nunca trava para sempre ─────────
  // Se loaded=true mas total=0 (todos desativados), mostra aviso em vez de spinner
  if (!loaded) return <TvLoading />;
  if (total === 0) return (
    <div style={{ position:'fixed', inset:0, background:'#060410', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <span style={{ fontSize:48 }}>📺</span>
      <div style={{ fontFamily:"'Courier New',monospace", fontSize:13, color:'rgba(255,255,255,.5)', letterSpacing:2, textAlign:'center' }}>
        NENHUM SLIDE ATIVO
      </div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:8 }}>
        Ative pelo menos um slide no editor
      </div>
      <Link href="/tv-empresarial/config" style={{ padding:'8px 20px', background:'rgba(255,140,66,.15)', border:'1px solid rgba(255,140,66,.4)', borderRadius:10, color:'#ff8c42', fontSize:11, textDecoration:'none', fontFamily:"'Courier New',monospace", letterSpacing:1 }}>
        ⚙️ ABRIR EDITOR
      </Link>
      <style>{`@keyframes gtFade{from{opacity:.3}to{opacity:1}}`}</style>
    </div>
  );

  const enterFrom = dir === 'left' ? '100%'  : '-100%';
  const exitTo    = dir === 'left' ? '-100%' : '100%';

  return (
    <div
      style={{ position:'fixed', inset:0, background:'#060410', overflow:'hidden', userSelect:'none' }}
      onMouseMove={nudgeUI}
      onTouchStart={nudgeUI}
    >

      {/* ════ ÁREA DE SLIDES ════ */}
      <div style={{ position:'absolute', inset:0, bottom:TICKER_H }}>

        {/* Slide saindo */}
        {outgoing !== null && activeSlides[outgoing] && (
          <div key={`out-${outgoing}`} style={{
            position:'absolute', inset:0, zIndex:1,
            animation:`gtExit 480ms cubic-bezier(.4,0,.2,1) forwards`,
            ['--gt-exit' as any]: exitTo,
          }}>
            <CardShell slide={activeSlides[outgoing]} paused={false} hideBar />
          </div>
        )}

        {/* Slide entrando */}
        <div key={`in-${safeCur}`} style={{
          position:'absolute', inset:0, zIndex:2,
          animation:`gtEnter 480ms cubic-bezier(.4,0,.2,1) forwards`,
          ['--gt-enter' as any]: enterFrom,
          cursor:'pointer',
        }}
          onClick={() => { setPaused(p => !p); nudgeUI(); }}
        >
          <CardShell slide={slide} paused={paused} />
        </div>

        {/* Overlay pausa */}
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
              animation:'gtFadeIn .2s ease',
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

      {/* ════ HUD ════ */}
      <div style={{
        position:'absolute', inset:0, bottom:TICKER_H,
        zIndex:10, pointerEvents:'none',
        opacity: showUI ? 1 : 0,
        transition:'opacity .7s ease',
      }}>
        {/* Header */}
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

          {/* Dots — um por slide ativo */}
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            {activeSlides.map((s, i) => (
              <button key={s.id} onClick={() => { goTo(i, i > safeCur ? 'left' : 'right'); nudgeUI(); }} style={{
                width: i===safeCur ? 22 : 7, height:7, borderRadius:4,
                background: i===safeCur ? slide.color : 'rgba(255,255,255,.2)',
                border:'none', cursor:'pointer', padding:0,
                boxShadow: i===safeCur ? `0 0 8px ${slide.color}` : 'none',
                transition:'all .35s',
              }}/>
            ))}
          </div>

          {/* Ações */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Link href="/tv-empresarial/config" style={{
              fontFamily:"'Courier New',monospace",
              fontSize:9, color:'#ff8c42', textDecoration:'none',
              padding:'4px 10px',
              background:'rgba(255,140,66,.12)',
              border:'1px solid rgba(255,140,66,.35)',
              borderRadius:12, letterSpacing:1, fontWeight:700,
            }}>⚙️ EDITAR</Link>

            <Link href="/" style={{
              fontFamily:"'Courier New',monospace",
              fontSize:9, color:'rgba(255,255,255,.45)', textDecoration:'none',
              padding:'4px 11px', border:'1px solid rgba(255,255,255,.14)',
              borderRadius:12, letterSpacing:1,
            }}>← VOLTAR</Link>
          </div>
        </div>

        {/* Setas laterais */}
        {(['prev','next'] as const).map(side => (
          <button key={side}
            onClick={() => { side==='prev' ? goPrev() : goNext(); nudgeUI(); }}
            style={{
              position:'absolute', top:'50%', transform:'translateY(-50%)',
              [side==='prev'?'left':'right']: 10,
              width:42, height:42, borderRadius:'50%',
              background:'rgba(0,0,0,.65)',
              border:'1px solid rgba(255,255,255,.18)',
              color:'rgba(255,255,255,.7)', fontSize:15,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              backdropFilter:'blur(8px)', pointerEvents:'auto',
              transition:'background .2s', fontFamily:'monospace',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(0,0,0,.65)'; }}
          >{side==='prev' ? '◀' : '▶'}</button>
        ))}

        {/* Barra inferior */}
        <div style={{
          position:'absolute', bottom:8, left:0, right:0,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 14px', pointerEvents:'auto',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ fontSize:14 }}>{slide.icon}</span>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(255,255,255,.5)', letterSpacing:1.5, fontWeight:700 }}>
              {slide.label.toUpperCase()}
            </span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button onClick={() => setDir(d => d==='left'?'right':'left')} style={{
              fontFamily:"'Courier New',monospace",
              padding:'3px 9px', fontSize:8, letterSpacing:1,
              background:'rgba(0,0,0,.65)',
              border:`1px solid ${slide.color}55`,
              borderRadius:7, color:slide.color,
              cursor:'pointer', backdropFilter:'blur(8px)',
            }}>{dir==='left' ? '→ DIREITA' : '← ESQUERDA'}</button>

            <div style={{
              fontFamily:"'Courier New',monospace",
              padding:'3px 9px', fontSize:8, letterSpacing:1,
              background:'rgba(0,0,0,.65)',
              border:'1px solid rgba(255,255,255,.12)',
              borderRadius:7, color:'rgba(255,255,255,.4)',
            }}>{safeCur+1}/{total}</div>
          </div>
        </div>
      </div>

      {/* ════ TICKER ════ */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:20 }}>
        <GTNewsTicker speed={80} height={TICKER_H} controls={false} />
      </div>

      <style>{`
        @keyframes gtEnter  { from{transform:translateX(var(--gt-enter));opacity:.5} to{transform:translateX(0);opacity:1} }
        @keyframes gtExit   { from{transform:translateX(0);opacity:1} to{transform:translateX(var(--gt-exit));opacity:.3} }
        @keyframes gtBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes gtFadeIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes gtFade   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
