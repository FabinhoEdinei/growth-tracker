'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/manga/page.tsx
// Leitor Webmanga — tela cheia por página, swipe mobile, capítulos
// Mesma arquitetura da TV: fullscreen, HUD que some, barra de progresso
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef, TouchEvent as RTouch } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface MangaPage     { index: number; src: string; }
interface MangaCapitulo {
  id: string; numero: number; titulo: string;
  cover: string; total: number; pages: MangaPage[];
}

// ── Constantes ─────────────────────────────────────────────────────────────────
const SWIPE_THRESHOLD = 50; // px mínimos para considerar swipe

// ─────────────────────────────────────────────────────────────────────────────
// Hook de dados — busca da API
// ─────────────────────────────────────────────────────────────────────────────
function useMangaData() {
  const [capitulos, setCapitulos] = useState<MangaCapitulo[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/manga')
      .then(r => r.json())
      .then(d => {
        if (d.erro) throw new Error(d.erro);
        setCapitulos(d.capitulos ?? []);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  return { capitulos, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// Barra de progresso (mesma lógica da TV, sem auto-avanço)
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,.1)', position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${pct}%`, background: color,
        boxShadow: `0 0 8px ${color}`,
        transition: 'width .3s ease',
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tela de seleção de capítulos
// ─────────────────────────────────────────────────────────────────────────────
function CapituloSelector({
  capitulos, dark, onSelect,
}: {
  capitulos: MangaCapitulo[];
  dark: boolean;
  onSelect: (cap: MangaCapitulo) => void;
}) {
  const bg   = dark ? '#0a0a0f' : '#f0eff5';
  const card = dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)';
  const txt  = dark ? '#fff' : '#111';
  const sub  = dark ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)';

  return (
    <div style={{ minHeight:'100vh', background:bg, padding:'0 0 60px' }}>
      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:10, background: dark?'rgba(10,10,15,.95)':'rgba(240,239,245,.95)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${dark?'rgba(255,255,255,.07)':'rgba(0,0,0,.07)'}`, padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:20 }}>📖</span>
          <span style={{ fontSize:14, fontWeight:900, letterSpacing:2, color:txt, fontFamily:"'Courier New',monospace" }}>MANGA READER</span>
        </div>
        <Link href="/" style={{ fontSize:11, color:sub, textDecoration:'none', padding:'4px 12px', border:`1px solid ${dark?'rgba(255,255,255,.1)':'rgba(0,0,0,.12)'}`, borderRadius:12 }}>← Voltar</Link>
      </div>

      <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 16px' }}>
        <div style={{ fontSize:11, color:sub, letterSpacing:2, marginBottom:16, fontFamily:"'Courier New',monospace" }}>
          {capitulos.length} CAPÍTULO{capitulos.length !== 1 ? 'S' : ''}
        </div>

        {capitulos.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📂</div>
            <div style={{ fontSize:13, color:sub, lineHeight:1.7 }}>
              Nenhum capítulo encontrado.<br/>
              Crie a pasta <code style={{ background:dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)', padding:'2px 6px', borderRadius:4 }}>public/manga/cap-01/</code><br/>
              e adicione imagens .jpg/.png dentro.
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {capitulos.map((cap, i) => (
              <button key={cap.id} onClick={() => onSelect(cap)} style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'14px 16px',
                background: card,
                border:`1px solid ${dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)'}`,
                borderRadius:14, cursor:'pointer', textAlign:'left',
                transition:'all .2s',
                animation:`fadeUp .4s ${i*0.06}s ease backwards`,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateX(4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform=''; }}
              >
                {/* Cover thumb */}
                <div style={{ width:52, height:72, borderRadius:8, overflow:'hidden', background:dark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)', flexShrink:0, position:'relative' }}>
                  {cap.cover ? (
                    <Image src={cap.cover} alt={cap.titulo} fill style={{ objectFit:'cover' }} />
                  ) : (
                    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📄</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:txt, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {cap.titulo}
                  </div>
                  <div style={{ fontSize:11, color:sub }}>
                    {cap.total} página{cap.total !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Seta */}
                <span style={{ fontSize:16, color:sub }}>›</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEITOR — tela cheia, uma página por vez
// ─────────────────────────────────────────────────────────────────────────────
function MangaReader({
  cap, dark, onBack, onToggleDark,
}: {
  cap: MangaCapitulo;
  dark: boolean;
  onBack: () => void;
  onToggleDark: () => void;
}) {
  const [page,    setPage]    = useState(0);
  const [showUI,  setShowUI]  = useState(true);
  const [animate, setAnimate] = useState<'left'|'right'|null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const uiTimer   = useRef<ReturnType<typeof setTimeout>|null>(null);
  const touchStart= useRef<{x:number;y:number}|null>(null);

  const total = cap.pages.length;
  const pct   = total > 1 ? (page / (total - 1)) * 100 : 0;

  // ── UI timeout ──────────────────────────────────────────────────────────────
  const nudgeUI = useCallback(() => {
    setShowUI(true);
    if (uiTimer.current) clearTimeout(uiTimer.current);
    uiTimer.current = setTimeout(() => setShowUI(false), 4000);
  }, []);

  useEffect(() => { nudgeUI(); }, []);

  // ── Navegação ───────────────────────────────────────────────────────────────
  const goTo = useCallback((idx: number, dir: 'left'|'right') => {
    if (idx < 0 || idx >= total) return;
    setAnimate(dir);
    setTimeout(() => { setPage(idx); setAnimate(null); }, 220);
  }, [total]);

  const goNext = useCallback(() => goTo(page + 1, 'left'),  [page, goTo]);
  const goPrev = useCallback(() => goTo(page - 1, 'right'), [page, goTo]);

  // ── Teclado ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      nudgeUI();
      if (e.key==='ArrowRight'||e.key==='ArrowDown') goNext();
      if (e.key==='ArrowLeft' ||e.key==='ArrowUp')   goPrev();
      if (e.key==='Escape') onBack();
      if (e.key==='f') toggleFullscreen();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev, nudgeUI, onBack]);

  // ── Swipe ───────────────────────────────────────────────────────────────────
  const onTouchStart = (e: RTouch<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: RTouch<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const t   = e.changedTouches[0];
    const dx  = t.clientX - touchStart.current.x;
    const dy  = Math.abs(t.clientY - touchStart.current.y);
    touchStart.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD || dy > Math.abs(dx)) return;
    nudgeUI();
    dx < 0 ? goNext() : goPrev();
  };

  // ── Fullscreen ──────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(()=>{});
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  // ── Click na metade esquerda/direita da tela ─────────────────────────────────
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    nudgeUI();
    // Ignora clique em botões do HUD
    if ((e.target as HTMLElement).closest('[data-hud]')) return;
    const x = e.clientX / window.innerWidth;
    x < 0.4 ? goPrev() : x > 0.6 ? goNext() : null;
  };

  const currentPage = cap.pages[page];
  const bg = dark ? '#080810' : '#e8e7ef';

  const enterFrom = animate==='left'  ? '60px' : animate==='right' ? '-60px' : '0';
  const opacity   = animate ? 0 : 1;

  return (
    <div
      style={{ position:'fixed', inset:0, background:bg, overflow:'hidden', userSelect:'none', cursor:'pointer' }}
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseMove={nudgeUI}
    >
      {/* ── Imagem da página ── */}
      <div style={{
        position:'absolute', inset:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding: showUI ? '50px 0 50px' : '0',
        transition:'padding .3s ease',
      }}>
        {currentPage && (
          <div style={{
            position:'relative',
            width:'100%', height:'100%',
            transform:`translateX(${enterFrom})`,
            opacity,
            transition: animate ? 'none' : 'transform .22s ease, opacity .22s ease',
          }}>
            <Image
              key={currentPage.src}
              src={currentPage.src}
              alt={`Página ${page + 1}`}
              fill
              style={{ objectFit:'contain' }}
              priority
            />
          </div>
        )}
      </div>

      {/* ── Zonas de toque (visual discreto) ── */}
      {showUI && (
        <>
          <div style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'15%', height:'40%', display:'flex', alignItems:'center', justifyContent:'center', opacity: page > 0 ? 0.5 : 0.15, pointerEvents:'none' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16 }}>◀</div>
          </div>
          <div style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', width:'15%', height:'40%', display:'flex', alignItems:'center', justifyContent:'center', opacity: page < total-1 ? 0.5 : 0.15, pointerEvents:'none' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16 }}>▶</div>
          </div>
        </>
      )}

      {/* ── HUD — aparece/desaparece ── */}
      <div
        data-hud="true"
        style={{ position:'absolute', inset:0, pointerEvents:'none', opacity: showUI?1:0, transition:'opacity .5s ease', zIndex:10 }}
      >
        {/* Header */}
        <div style={{
          position:'absolute', top:0, left:0, right:0,
          padding:'10px 16px',
          background: dark
            ? 'linear-gradient(180deg,rgba(0,0,0,.85) 0%,transparent 100%)'
            : 'linear-gradient(180deg,rgba(0,0,0,.6) 0%,transparent 100%)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          pointerEvents:'auto',
        }}>
          {/* Voltar */}
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(0,0,0,.5)', border:'1px solid rgba(255,255,255,.15)', borderRadius:20, padding:'5px 12px', color:'#fff', fontSize:11, cursor:'pointer', backdropFilter:'blur(8px)', fontFamily:"'Courier New',monospace", letterSpacing:1 }}>
            ← CAPÍTULOS
          </button>

          {/* Título */}
          <div style={{ fontSize:11, color:'rgba(255,255,255,.85)', fontFamily:"'Courier New',monospace", fontWeight:700, letterSpacing:1.5, textAlign:'center', textShadow:'0 1px 4px rgba(0,0,0,.8)' }}>
            {cap.titulo}
          </div>

          {/* Ações */}
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={onToggleDark} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(0,0,0,.5)', border:'1px solid rgba(255,255,255,.15)', color:'#fff', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
              {dark ? '☀️' : '🌙'}
            </button>
            <button onClick={toggleFullscreen} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(0,0,0,.5)', border:'1px solid rgba(255,255,255,.15)', color:'#fff', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
              {fullscreen ? '⊡' : '⛶'}
            </button>
          </div>
        </div>

        {/* Barra de progresso */}
        <div style={{ position:'absolute', top:0, left:0, right:0 }}>
          <ProgressBar pct={pct} color='#ff6b9d' />
        </div>

        {/* Footer — contador de páginas + thumbnails de navegação */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          padding:'10px 16px 14px',
          background: dark
            ? 'linear-gradient(0deg,rgba(0,0,0,.85) 0%,transparent 100%)'
            : 'linear-gradient(0deg,rgba(0,0,0,.6) 0%,transparent 100%)',
          display:'flex', flexDirection:'column', gap:8,
          pointerEvents:'auto',
        }}>
          {/* Miniaturas das páginas */}
          <div style={{ display:'flex', gap:4, overflowX:'auto', paddingBottom:2, scrollbarWidth:'none' }}>
            {cap.pages.map((p, i) => (
              <button key={p.src} onClick={() => goTo(i, i > page ? 'left' : 'right')} style={{
                width:28, height:40, flexShrink:0, borderRadius:4, overflow:'hidden',
                border:`2px solid ${i===page?'#ff6b9d':'transparent'}`,
                background:'rgba(255,255,255,.1)', cursor:'pointer', padding:0,
                boxShadow: i===page ? '0 0 8px #ff6b9d' : 'none',
                transition:'all .2s', position:'relative',
              }}>
                <Image src={p.src} alt={`p${i+1}`} fill style={{ objectFit:'cover' }}/>
              </button>
            ))}
          </div>

          {/* Contador */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(255,255,255,.7)', letterSpacing:2, textShadow:'0 1px 4px rgba(0,0,0,.8)' }}>
              {page + 1} / {total}
            </span>
          </div>
        </div>
      </div>

      {/* Fim do capítulo */}
      {page === total - 1 && !animate && (
        <div style={{ position:'absolute', inset:0, zIndex:20, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', background:'rgba(0,0,0,.01)' }}>
          <div style={{ padding:'20px 32px', background: dark?'rgba(0,0,0,.85)':'rgba(255,255,255,.9)', border:'1.5px solid #ff6b9d', borderRadius:16, backdropFilter:'blur(12px)', textAlign:'center', pointerEvents:'auto', animation:'popIn .4s cubic-bezier(.34,1.56,.64,1)' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🎉</div>
            <div style={{ fontSize:13, fontWeight:900, color: dark?'#fff':'#111', marginBottom:4, fontFamily:"'Courier New',monospace", letterSpacing:1 }}>FIM DO CAPÍTULO</div>
            <div style={{ fontSize:11, color:'rgba(128,128,128,.8)', marginBottom:14 }}>{cap.titulo}</div>
            <button onClick={onBack} style={{ padding:'8px 20px', background:'linear-gradient(135deg,#ff6b9d,#a855f7)', border:'none', borderRadius:20, color:'#fff', fontSize:11, cursor:'pointer', fontWeight:700, letterSpacing:1 }}>
              VER CAPÍTULOS
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export default function MangaPage() {
  const { capitulos, loading, error } = useMangaData();
  const [capAtivo, setCapAtivo] = useState<MangaCapitulo | null>(null);
  const [dark,     setDark]     = useState(true);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#080810', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ fontSize:40, animation:'spin 1s linear infinite', display:'inline-block' }}>📖</div>
      <div style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:2 }}>CARREGANDO...</div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Erro ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{ minHeight:'100vh', background:'#080810', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, padding:20 }}>
      <div style={{ fontSize:32 }}>⚠️</div>
      <div style={{ color:'#ff8c42', fontFamily:"'Courier New',monospace", fontSize:12, textAlign:'center' }}>{error}</div>
      <Link href="/" style={{ color:'rgba(255,255,255,.4)', fontSize:11, textDecoration:'none' }}>← Voltar</Link>
    </div>
  );

  // ── Leitor ─────────────────────────────────────────────────────────────────
  if (capAtivo) return (
    <MangaReader
      cap={capAtivo}
      dark={dark}
      onBack={() => setCapAtivo(null)}
      onToggleDark={() => setDark(d => !d)}
    />
  );

  // ── Seletor de capítulos ───────────────────────────────────────────────────
  return (
    <CapituloSelector
      capitulos={capitulos}
      dark={dark}
      onSelect={cap => setCapAtivo(cap)}
    />
  );
}
