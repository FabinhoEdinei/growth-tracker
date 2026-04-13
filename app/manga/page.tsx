'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/manga/page.tsx
// Leitor Webmanga com sistema RPG de diálogos
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TouchEvent as RTouch } from 'react';
import Link  from 'next/link';
import Image from 'next/image';
import RPGDialogBox, { type RPGScript, MANGA_RETURN_KEY, type MangaReturnData } from '@/app/components/manga/RPGDialogBox';

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface MangaPage     { index: number; src: string; }
interface MangaCapitulo {
  id: string; numero: number; titulo: string;
  cover: string; total: number; pages: MangaPage[];
}

const SWIPE_THRESHOLD = 50;

// ─────────────────────────────────────────────────────────────────────────────
// Hook: dados da API
// ─────────────────────────────────────────────────────────────────────────────
function useMangaData() {
  const [capitulos, setCapitulos] = useState<MangaCapitulo[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/manga')
      .then(r => r.json())
      .then(d => { setCapitulos(d.capitulos ?? []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);
  return { capitulos, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook: script RPG do capítulo
// ─────────────────────────────────────────────────────────────────────────────
function useRPGScript(capId: string | null) {
  const [script,  setScript]  = useState<RPGScript | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!capId) { setScript(null); return; }
    setLoading(true);
    fetch(`/manga/${capId}/dialogos.json`)
      .then(r => { if (!r.ok) throw new Error('sem diálogos'); return r.json(); })
      .then(d  => { setScript(d); setLoading(false); })
      .catch(() => { setScript(null); setLoading(false); });
  }, [capId]);
  return { script, loadingScript: loading };
}

// ─────────────────────────────────────────────────────────────────────────────
// ProgressBar
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height:3, background:'rgba(255,255,255,.1)', position:'relative' }}>
      <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${pct}%`, background:color, boxShadow:`0 0 8px ${color}`, transition:'width .3s ease' }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Seletor de capítulos
// ─────────────────────────────────────────────────────────────────────────────
function CapituloSelector({ capitulos, dark, onSelect }: {
  capitulos: MangaCapitulo[]; dark: boolean; onSelect: (c: MangaCapitulo) => void;
}) {
  const bg  = dark ? '#0a0a0f' : '#f0eff5';
  const txt = dark ? '#fff'    : '#111';
  const sub = dark ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)';
  const cd  = dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)';

  return (
    <div style={{ minHeight:'100vh', background:bg, paddingBottom:60 }}>
      <div style={{ position:'sticky', top:0, zIndex:10, background:dark?'rgba(10,10,15,.95)':'rgba(240,239,245,.95)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${dark?'rgba(255,255,255,.07)':'rgba(0,0,0,.07)'}`, padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:20 }}>📖</span>
          <span style={{ fontSize:14, fontWeight:900, letterSpacing:2, color:txt, fontFamily:"'Courier New',monospace" }}>MANGA READER</span>
        </div>
        <Link href="/" style={{ fontSize:11, color:sub, textDecoration:'none', padding:'4px 12px', border:`1px solid ${dark?'rgba(255,255,255,.1)':'rgba(0,0,0,.12)'}`, borderRadius:12 }}>← Voltar</Link>
      </div>

      <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 16px' }}>
        <div style={{ fontSize:11, color:sub, letterSpacing:2, marginBottom:16, fontFamily:"'Courier New',monospace" }}>{capitulos.length} CAPÍTULO{capitulos.length!==1?'S':''}</div>

        {capitulos.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📂</div>
            <div style={{ fontSize:13, color:sub, lineHeight:1.7 }}>
              Crie a pasta <code style={{ background:dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)', padding:'2px 6px', borderRadius:4 }}>public/manga/cap-01/</code> e adicione imagens .jpg/.png dentro.
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {capitulos.map((cap, i) => (
              <button key={cap.id} onClick={()=>onSelect(cap)} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:cd, border:`1px solid ${dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)'}`, borderRadius:14, cursor:'pointer', textAlign:'left', transition:'transform .2s', animation:`fadeUp .4s ${i*.06}s ease backwards` }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateX(4px)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';}}
              >
                <div style={{ width:52, height:72, borderRadius:8, overflow:'hidden', background:dark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)', flexShrink:0, position:'relative' }}>
                  {cap.cover ? <Image src={cap.cover} alt={cap.titulo} fill style={{objectFit:'cover'}}/> : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>📄</div>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:txt, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cap.titulo}</div>
                  <div style={{ fontSize:11, color:sub }}>{cap.total} página{cap.total!==1?'s':''}</div>
                </div>
                <span style={{ fontSize:16, color:sub }}>›</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEITOR PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
function MangaReader({ cap, dark, onBack, onToggleDark, paginaInicial = 0 }: {
  cap: MangaCapitulo; dark: boolean; onBack: ()=>void; onToggleDark: ()=>void;
  paginaInicial?: number; // ← NOVO
}) {
  const [page,       setPage]       = useState(paginaInicial); // ← usa paginaInicial
  const [showUI,     setShowUI]     = useState(true);
  const [dir,        setDir]        = useState<'left'|'right'>('left');
  const [animating,  setAnimating]  = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const { script } = useRPGScript(cap.id);
  const [dialogAtivo, setDialogAtivo] = useState(true);

  const uiRef    = useRef<ReturnType<typeof setTimeout>|null>(null);
  const touchRef = useRef<{x:number;y:number}|null>(null);
  const total    = cap.pages.length;
  const pct      = total > 1 ? (page/(total-1))*100 : 0;

  const temDialogo = (pg: number) =>
    (script?.dialogos ?? []).some(d => (d.pagina ?? 0) === pg);

  useEffect(() => { setDialogAtivo(true); }, [page]);

  const nudgeUI = useCallback(() => {
    setShowUI(true);
    if (uiRef.current) clearTimeout(uiRef.current);
    uiRef.current = setTimeout(() => setShowUI(false), 4500);
  }, []);
  useEffect(() => { nudgeUI(); }, []);

  const goTo = useCallback((idx: number, d: 'left'|'right') => {
    if (idx < 0 || idx >= total || animating) return;
    setAnimating(true);
    setDir(d);
    setTimeout(() => { setPage(idx); setAnimating(false); setDialogAtivo(true); }, 220);
  }, [total, animating]);

  const goNext = useCallback(() => goTo(page+1,'left'),  [page,goTo]);
  const goPrev = useCallback(() => goTo(page-1,'right'), [page,goTo]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (dialogAtivo && temDialogo(page) && (e.key===' '||e.key==='Enter')) return;
      nudgeUI();
      if (e.key==='ArrowRight'||e.key==='ArrowDown') goNext();
      if (e.key==='ArrowLeft' ||e.key==='ArrowUp')   goPrev();
      if (e.key==='Escape') onBack();
      if (e.key==='f') toggleFS();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev, nudgeUI, onBack, dialogAtivo, page]);

  const onTS = (e: RTouch<HTMLDivElement>) => {
    const t = e.touches[0];
    touchRef.current = { x:t.clientX, y:t.clientY };
  };
  const onTE = (e: RTouch<HTMLDivElement>) => {
    if (!touchRef.current) return;
    const t  = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = Math.abs(t.clientY - touchRef.current.y);
    touchRef.current = null;
    if (dialogAtivo && temDialogo(page)) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD || dy > Math.abs(dx)) return;
    nudgeUI();
    dx < 0 ? goNext() : goPrev();
  };

  const toggleFS = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(()=>{});
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-hud]')) return;
    if ((e.target as HTMLElement).closest('[data-rpg]')) return;
    nudgeUI();
    if (dialogAtivo && temDialogo(page)) return;
    const x = e.clientX / window.innerWidth;
    if (x < 0.35) goPrev();
    else if (x > 0.65) goNext();
  };

  const handleDialogEnd = useCallback((nextPage: number) => {
    setDialogAtivo(false);
    if (nextPage < total) goTo(nextPage, 'left');
  }, [goTo, total]);

  const currentPage = cap.pages[page];
  const bg = dark ? '#080810' : '#e8e7ef';
  const translateX = animating ? (dir==='left'?'-8%':'8%') : '0';

  return (
    <div
      style={{ position:'fixed', inset:0, background:bg, overflow:'hidden', userSelect:'none' }}
      onClick={handleClick}
      onTouchStart={onTS}
      onTouchEnd={onTE}
      onMouseMove={nudgeUI}
    >
      {/* ── Imagem ── */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding: showUI?'50px 0 56px':'0', transition:'padding .3s ease' }}>
        {currentPage && (
          <div style={{ position:'relative', width:'100%', height:'100%', transform:`translateX(${translateX})`, opacity: animating ? 0.5 : 1, transition:'transform .22s ease, opacity .22s ease' }}>
            <Image key={currentPage.src} src={currentPage.src} alt={`Página ${page+1}`} fill style={{objectFit:'contain'}} priority/>
          </div>
        )}
      </div>

      {/* ── Zonas de toque ── */}
      {showUI && !temDialogo(page) && (
        <>
          <div style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'12%', height:'40%', display:'flex', alignItems:'center', justifyContent:'center', opacity:page>0?.5:.15, pointerEvents:'none' }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14 }}>◀</div>
          </div>
          <div style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', width:'12%', height:'40%', display:'flex', alignItems:'center', justifyContent:'center', opacity:page<total-1?.5:.15, pointerEvents:'none' }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14 }}>▶</div>
          </div>
        </>
      )}

      {/* ── RPG Dialog Box ── */}
      {dialogAtivo && script && (
        <div data-rpg="true">
          <RPGDialogBox
            script={script}
            paginaAtual={page}
            dark={dark}
            capId={cap.id}
            onPageChange={handleDialogEnd}
          />
        </div>
      )}

      {/* ── HUD ── */}
      <div data-hud="true" style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:showUI?1:0, transition:'opacity .5s ease', zIndex:10 }}>

        <div style={{ position:'absolute', top:0, left:0, right:0 }}>
          <ProgressBar pct={pct} color='#ff6b9d'/>
        </div>

        <div style={{ position:'absolute', top:0, left:0, right:0, padding:'8px 14px 12px', background:'linear-gradient(180deg,rgba(0,0,0,.8) 0%,transparent 100%)', display:'flex', alignItems:'center', justifyContent:'space-between', pointerEvents:'auto' }}>
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,.55)', border:'1px solid rgba(255,255,255,.15)', borderRadius:20, padding:'5px 12px', color:'#fff', fontSize:10, cursor:'pointer', backdropFilter:'blur(8px)', fontFamily:"'Courier New',monospace", letterSpacing:1 }}>
            ← CAPÍTULOS
          </button>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.85)', fontFamily:"'Courier New',monospace", fontWeight:700, letterSpacing:1.5, textShadow:'0 1px 4px rgba(0,0,0,.8)' }}>{cap.titulo}</div>
          <div style={{ display:'flex', gap:5 }}>
            {script && (
              <button onClick={()=>setDialogAtivo(d=>!d)} title="Diálogos RPG" style={{ width:30, height:30, borderRadius:'50%', background: dialogAtivo?'rgba(255,107,157,.3)':'rgba(0,0,0,.5)', border:`1px solid ${dialogAtivo?'rgba(255,107,157,.5)':'rgba(255,255,255,.15)'}`, color:'#fff', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
                💬
              </button>
            )}
            <button onClick={onToggleDark} style={{ width:30, height:30, borderRadius:'50%', background:'rgba(0,0,0,.5)', border:'1px solid rgba(255,255,255,.15)', color:'#fff', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
              {dark?'☀️':'🌙'}
            </button>
            <button onClick={toggleFS} style={{ width:30, height:30, borderRadius:'50%', background:'rgba(0,0,0,.5)', border:'1px solid rgba(255,255,255,.15)', color:'#fff', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
              {fullscreen?'⊡':'⛶'}
            </button>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'8px 14px 12px', background:'linear-gradient(0deg,rgba(0,0,0,.8) 0%,transparent 100%)', display:'flex', flexDirection:'column', gap:6, pointerEvents:'auto' }}>
          <div style={{ display:'flex', gap:3, overflowX:'auto', scrollbarWidth:'none' }}>
            {cap.pages.map((p,i) => (
              <button key={p.src} onClick={()=>goTo(i,i>page?'left':'right')} style={{ width:26, height:38, flexShrink:0, borderRadius:4, overflow:'hidden', border:`2px solid ${i===page?'#ff6b9d':'transparent'}`, background:'rgba(255,255,255,.1)', cursor:'pointer', padding:0, boxShadow:i===page?'0 0 8px #ff6b9d':'none', transition:'all .2s', position:'relative' }}>
                <Image src={p.src} alt={`p${i+1}`} fill style={{objectFit:'cover'}}/>
                {temDialogo(i) && <div style={{ position:'absolute', top:1, right:1, width:5, height:5, borderRadius:'50%', background:'#ff6b9d', boxShadow:'0 0 4px #ff6b9d' }}/>}
              </button>
            ))}
          </div>
          <div style={{ textAlign:'center' }}>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(255,255,255,.65)', letterSpacing:2, textShadow:'0 1px 4px rgba(0,0,0,.8)' }}>
              {page+1} / {total}
              {temDialogo(page) && <span style={{ marginLeft:8, color:'#ff6b9d', fontSize:9 }}>💬 RPG</span>}
            </span>
          </div>
        </div>
      </div>

      {/* ── Fim do capítulo ── */}
      {page===total-1 && !animating && !dialogAtivo && (
        <div style={{ position:'absolute', inset:0, zIndex:20, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <div style={{ padding:'20px 32px', background:dark?'rgba(0,0,0,.88)':'rgba(255,255,255,.92)', border:'1.5px solid #ff6b9d', borderRadius:16, backdropFilter:'blur(12px)', textAlign:'center', pointerEvents:'auto', animation:'popIn .4s cubic-bezier(.34,1.56,.64,1)' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🎉</div>
            <div style={{ fontSize:13, fontWeight:900, color:dark?'#fff':'#111', marginBottom:4, fontFamily:"'Courier New',monospace", letterSpacing:1 }}>FIM DO CAPÍTULO</div>
            <div style={{ fontSize:11, color:'rgba(128,128,128,.8)', marginBottom:14 }}>{cap.titulo}</div>
            <button onClick={onBack} style={{ padding:'8px 20px', background:'linear-gradient(135deg,#ff6b9d,#a855f7)', border:'none', borderRadius:20, color:'#fff', fontSize:11, cursor:'pointer', fontWeight:700, letterSpacing:1 }}>VER CAPÍTULOS</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar{display:none;}
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function MangaPage() {
  const { capitulos, loading, error } = useMangaData();
  const [capAtivo,      setCapAtivo]      = useState<MangaCapitulo|null>(null);
  const [dark,          setDark]          = useState(true);
  const [paginaInicial, setPaginaInicial] = useState(0); // ← NOVO

  // Restaura progresso salvo (ex: voltou do blog)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MANGA_RETURN_KEY);
      if (!raw || !capitulos.length) return;
      const d: MangaReturnData = JSON.parse(raw);
      const cap = capitulos.find(c => c.id === d.capId);
      if (!cap) return;
      localStorage.removeItem(MANGA_RETURN_KEY); // limpa após restaurar
      setPaginaInicial(d.paginaIdx);
      setCapAtivo(cap);
    } catch {
      // silencia
    }
  }, [capitulos]);

  // Ao selecionar manualmente, sempre começa na pg 0
  const handleSelect = (c: MangaCapitulo) => {
    setPaginaInicial(0);
    setCapAtivo(c);
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#080810', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ fontSize:40, animation:'spin 1s linear infinite', display:'inline-block' }}>📖</div>
      <div style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:2 }}>CARREGANDO...</div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:'100vh', background:'#080810', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, padding:20 }}>
      <div style={{ fontSize:32 }}>⚠️</div>
      <div style={{ color:'#ff8c42', fontFamily:"'Courier New',monospace", fontSize:12, textAlign:'center' }}>{error}</div>
      <Link href="/" style={{ color:'rgba(255,255,255,.4)', fontSize:11, textDecoration:'none' }}>← Voltar</Link>
    </div>
  );

  if (capAtivo) return (
    <MangaReader
      cap={capAtivo}
      dark={dark}
      paginaInicial={paginaInicial}
      onBack={()=>setCapAtivo(null)}
      onToggleDark={()=>setDark(d=>!d)}
    />
  );

  return <CapituloSelector capitulos={capitulos} dark={dark} onSelect={handleSelect}/>;
}
