'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GTNewsTicker }     from '@/app/components/tv/GTNewsTicker';
import { useChannelConfig } from '@/hooks/useChannelConfig';
import type { Canal, CanalId, CanalSlide } from '@/hooks/useChannelConfig';

const SLIDE_MS = 8000;
const TICKER_H = 44;
type Dir = 'left' | 'right';

// ── Seletor lateral de canais ─────────────────────────────────────────────────
function ChannelSelector({ canais, canalAtivo, onSelect, visible }: {
  canais: Canal[]; canalAtivo: CanalId;
  onSelect: (id: CanalId) => void; visible: boolean;
}) {
  return (
    <div style={{
      position:'absolute', left:0, top:0, bottom:TICKER_H,
      width: visible ? 72 : 0,
      zIndex:15, overflow:'hidden',
      transition:'width .35s cubic-bezier(.4,0,.2,1)',
      background:'linear-gradient(180deg,rgba(0,0,0,.93),rgba(4,2,12,.93))',
      backdropFilter:'blur(12px)',
      borderRight:'1px solid rgba(255,255,255,.07)',
      display:'flex', flexDirection:'column', alignItems:'center',
      paddingTop:12, gap:6,
    }}>
      {canais.filter(c=>c.ativo).map(c => {
        const act = c.id === canalAtivo;
        return (
          <button key={c.id} onClick={()=>onSelect(c.id)} title={c.nome} style={{
            width:52, height:52, borderRadius:12,
            border:`1.5px solid ${act?c.cor:'rgba(255,255,255,.1)'}`,
            background: act?`${c.cor}22`:'rgba(255,255,255,.04)',
            cursor:'pointer', display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', gap:2, flexShrink:0,
            boxShadow: act?`0 0 14px ${c.cor}55`:'none', transition:'all .2s',
          }}>
            <span style={{ fontSize:18 }}>{c.icone}</span>
            <span style={{ fontSize:7, fontWeight:900, color:act?c.cor:'rgba(255,255,255,.4)', fontFamily:"'Courier New',monospace", letterSpacing:.5 }}>{c.sigla}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Slide padrão (texto) ──────────────────────────────────────────────────────
function SlideContent({ canal, slide }: { canal: Canal; slide: CanalSlide }) {
  // Redireciona para o render de imagem manga
  if (slide.tipo === 'manga' && slide.src) {
    return <SlideContentManga slide={slide} canal={canal} />;
  }

  const d = slide.custom;
  if (!d) return (
    <div style={{ textAlign:'center', color:'rgba(255,255,255,.4)', fontFamily:"'Courier New',monospace", fontSize:12 }}>
      {slide.icon} {slide.label}
    </div>
  );

  // Aplicar estilos de borda se definidos
  const borderStyle = slide.borderStyle ? `${slide.borderWidth || 1}px ${slide.borderStyle} ${slide.borderColor || canal.cor}88` : 'none';
  const borderRadius = slide.borderRadius || 0;

  return (
    <div style={{
      width:'100%', textAlign:'center', padding:'0 8px',
      border: borderStyle,
      borderRadius: borderRadius,
      background: slide.borderStyle ? 'rgba(255,255,255,.02)' : 'transparent',
      boxShadow: slide.borderStyle ? `0 0 20px ${slide.borderColor || canal.cor}22` : 'none',
    }}>
      <div style={{ fontSize:42, marginBottom:14, filter:`drop-shadow(0 0 16px ${canal.cor}88)`, animation:'chFloat 3s ease-in-out infinite' }}>{slide.icon}</div>
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'3px 12px', marginBottom:12, background:`${canal.cor}18`, border:`1px solid ${canal.cor}44`, borderRadius:20, fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:900, color:canal.cor, letterSpacing:2, textShadow:`0 0 8px ${canal.cor}88` }}>
        {canal.icone} {canal.sigla} · {canal.nome.toUpperCase()}
      </div>
      <h2 style={{ margin:'0 0 14px', fontFamily:"-apple-system,sans-serif", fontSize:'clamp(18px,4vw,26px)', fontWeight:900, color:'#fff', lineHeight:1.2, textShadow:`0 0 20px ${canal.cor}44` }}>{d.titulo}</h2>
      <p style={{ margin:'0 auto 16px', maxWidth:480, fontFamily:"-apple-system,sans-serif", fontSize:13, color:'rgba(255,255,255,.7)', lineHeight:1.7 }}>{d.corpo}</p>
      {d.rodape && <div style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:`${canal.cor}88`, letterSpacing:2, textTransform:'uppercase' }}>{d.rodape}</div>}
    </div>
  );
}

// ── Slide de imagem — canal Manga ─────────────────────────────────────────────
function SlideContentManga({ slide, canal }: { slide: CanalSlide; canal: Canal }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Badge do canal */}
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 12px',
        background: `${canal.cor}18`,
        border: `1px solid ${canal.cor}44`,
        borderRadius: 20,
        fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 900,
        color: canal.cor, letterSpacing: 2,
        textShadow: `0 0 8px ${canal.cor}88`,
        pointerEvents: 'none',
      }}>
        {canal.icone} {canal.sigla} · {slide.label.toUpperCase()}
      </div>

      {/* Imagem full-fit */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Image
          src={slide.src!}
          alt={slide.label}
          fill
          style={{ objectFit: 'contain' }}
          priority
          sizes="100vw"
        />
      </div>

      {/* Vinheta nas bordas */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 55%, ${canal.corBg.includes('1a0010') ? '#1a0010' : '#000'}88 100%)`,
        pointerEvents: 'none', zIndex: 1,
      }}/>
    </div>
  );
}

// ── Barra de progresso ────────────────────────────────────────────────────────
function ProgressBar({ color, paused, uid }: { color:string; paused:boolean; uid:string }) {
  const [pct,setPct]=useState(0);
  const r=useRef<number>(); const st=useRef(0); const pm=useRef(0); const pa=useRef(0);
  useEffect(()=>{
    setPct(0); st.current=performance.now(); pm.current=0; pa.current=0;
    const tick=(now:number)=>{
      if(paused){if(!pa.current)pa.current=now;r.current=requestAnimationFrame(tick);return;}
      if(pa.current){pm.current+=now-pa.current;pa.current=0;}
      const p=Math.min(((now-st.current-pm.current)/SLIDE_MS)*100,100);
      setPct(p); if(p<100)r.current=requestAnimationFrame(tick);
    };
    r.current=requestAnimationFrame(tick);
    return()=>{if(r.current)cancelAnimationFrame(r.current);};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[uid,paused]);
  return (
    <div style={{height:3,background:'rgba(255,255,255,.08)',flexShrink:0}}>
      <div style={{height:'100%',width:`${pct}%`,background:color,boxShadow:`0 0 8px ${color}99`,transition:'none'}}/>
    </div>
  );
}

// ── Hook: carrega páginas do manga e injeta no canal ─────────────────────────
function useMangaLoader(
  canalAtivo: CanalId,
  injectMangaSlides: (slides: CanalSlide[]) => void,
) {
  const loaded = useRef(false);

  useEffect(() => {
    if (canalAtivo !== 'manga' || loaded.current) return;
    loaded.current = true;

    fetch('/api/manga-tv')
      .then(r => r.json())
      .then(({ pages }: { pages: { index: number; src: string; label: string }[] }) => {
        if (!pages?.length) return;
        const slides: CanalSlide[] = pages.map((p, i) => ({
          id:     `manga-p${p.index}`,
          label:  p.label,
          icon:   '📄',
          active: true,
          order:  i,
          tipo:   'manga' as const,
          src:    p.src,
        }));
        injectMangaSlides(slides);
      })
      .catch(err => console.error('[GT Manga TV] erro ao carregar páginas:', err));
  }, [canalAtivo, injectMangaSlides]);
}

// ═════════════════════════════════════════════════════════════════════════════
export default function TvEmpresarial() {
  const {
    canais, canal, canalAtivo, loaded,
    setCanalAtivo, injectMangaSlides,
  } = useChannelConfig();

  const [cur,        setCur]        = useState(0);
  const [outgoing,   setOutgoing]   = useState<number|null>(null);
  const [dir,        setDir]        = useState<Dir>('left');
  const [paused,     setPaused]     = useState(false);
  const [busy,       setBusy]       = useState(false);
  const [showUI,     setShowUI]     = useState(true);
  const [showCanais, setShowCanais] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const uiRef    = useRef<ReturnType<typeof setTimeout>|null>(null);

  // Carrega páginas do manga quando o canal for selecionado
  useMangaLoader(canalAtivo, injectMangaSlides);

  const slides  = canal.slides.filter(s=>s.active).sort((a,b)=>a.order-b.order);
  const total   = slides.length;
  const safeCur = total>0 ? cur%total : 0;

  useEffect(()=>{ setCur(0); setOutgoing(null); },[canalAtivo]);
  useEffect(()=>{ if(total>0&&cur>=total)setCur(0); },[total,cur]);

  const goTo=useCallback((idx:number,d:Dir)=>{
    if(busy||idx===safeCur||total===0)return;
    setBusy(true);setOutgoing(safeCur);setDir(d);setCur(idx);
    setTimeout(()=>{setOutgoing(null);setBusy(false);},480);
  },[busy,safeCur,total]);

  const goNext=useCallback(()=>goTo((safeCur+1)%total,'left'),[safeCur,total,goTo]);
  const goPrev=useCallback(()=>goTo((safeCur-1+total)%total,'right'),[safeCur,total,goTo]);

  useEffect(()=>{
    if(timerRef.current)clearInterval(timerRef.current);
    if(paused||total===0)return;
    timerRef.current=setInterval(goNext,SLIDE_MS);
    return()=>{if(timerRef.current)clearInterval(timerRef.current);};
  },[paused,goNext,total,canalAtivo]);

  const nudgeUI=useCallback(()=>{
    setShowUI(true);
    if(uiRef.current)clearTimeout(uiRef.current);
    uiRef.current=setTimeout(()=>setShowUI(false),4500);
  },[]);
  useEffect(()=>{nudgeUI();},[]);

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{
      nudgeUI();
      if(e.key==='ArrowRight')goNext();
      if(e.key==='ArrowLeft')goPrev();
      if(e.key===' '){e.preventDefault();setPaused(p=>!p);}
      if(e.key==='c')setShowCanais(v=>!v);
    };
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[goNext,goPrev,nudgeUI]);

  if(!loaded) return(
    <div style={{position:'fixed',inset:0,background:'#060410',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <span style={{fontSize:48,animation:'chFloat 1s ease-in-out infinite alternate'}}>📺</span>
      <div style={{fontFamily:"'Courier New',monospace",fontSize:11,color:'rgba(255,255,255,.4)',letterSpacing:3}}>CARREGANDO CANAIS...</div>
      <style>{`@keyframes chFloat{from{opacity:.3}to{opacity:1}}`}</style>
    </div>
  );

  const isMangaChannel = canalAtivo === 'manga';
  const enterFrom = dir==='left'?'100%':'-100%';
  const exitTo    = dir==='left'?'-100%':'100%';
  const offset    = showCanais ? 72 : 0;

  return(
    <div style={{position:'fixed',inset:0,background:canal.corBg,overflow:'hidden',userSelect:'none'}} onMouseMove={nudgeUI} onTouchStart={nudgeUI}>

      {/* Glow do canal */}
      <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 30% 40%, ${canal.cor}0a 0%,transparent 60%)`,pointerEvents:'none'}}/>

      {/* Seletor lateral */}
      <ChannelSelector canais={canais} canalAtivo={canalAtivo} onSelect={(id:CanalId)=>{setCanalAtivo(id);nudgeUI();setShowCanais(false);}} visible={showCanais}/>

      {/* Área de slides */}
      <div style={{position:'absolute',top:0,bottom:TICKER_H,left:offset,right:0,transition:'left .35s cubic-bezier(.4,0,.2,1)'}}>

        {outgoing!==null&&slides[outgoing]&&(
          <div key={`out-${outgoing}`} style={{position:'absolute',inset:0,zIndex:1,animation:`gtExit 480ms cubic-bezier(.4,0,.2,1) forwards`,['--gt-exit' as any]:exitTo}}>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column'}}>
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding: isMangaChannel ? '48px 0 8px' : '56px 24px 16px',position:'relative'}}>
                <SlideContent canal={canal} slide={slides[outgoing]}/>
              </div>
            </div>
          </div>
        )}

        <div key={`in-${safeCur}-${canalAtivo}`} style={{position:'absolute',inset:0,zIndex:2,animation:`gtEnter 480ms cubic-bezier(.4,0,.2,1) forwards`,['--gt-enter' as any]:enterFrom,cursor:'pointer'}}
          onClick={()=>{setPaused(p=>!p);nudgeUI();}}>
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column'}}>
            <div style={{
              flex:1,
              display:'flex',alignItems:'center',justifyContent:'center',
              padding: isMangaChannel ? '48px 0 8px' : '56px 24px 16px',
              overflow:'hidden', position:'relative', zIndex:1,
            }}>
              <SlideContent canal={canal} slide={slides[safeCur]}/>
            </div>
            <ProgressBar color={canal.cor} paused={paused} uid={`${canalAtivo}-${safeCur}`}/>
          </div>
        </div>

        {paused&&(
          <div style={{position:'absolute',inset:0,zIndex:5,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 28px',background:'rgba(0,0,0,.78)',border:`1.5px solid ${canal.cor}`,borderRadius:14,backdropFilter:'blur(10px)',animation:'gtFadeIn .2s ease'}}>
              <span style={{fontSize:26}}>⏸</span>
              <div>
                <div style={{fontFamily:"'Courier New',monospace",fontSize:13,color:'#fff',fontWeight:900,letterSpacing:2}}>PAUSADO</div>
                <div style={{fontFamily:"'Courier New',monospace",fontSize:8,color:'rgba(255,255,255,.4)',letterSpacing:2,marginTop:3}}>TOQUE PARA RETOMAR</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HUD */}
      <div style={{position:'absolute',inset:0,bottom:TICKER_H,left:offset,right:0,zIndex:10,pointerEvents:'none',opacity:showUI?1:0,transition:'opacity .7s ease,left .35s'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,padding:'10px 14px 14px',background:'linear-gradient(180deg,rgba(0,0,0,.85) 0%,transparent 100%)',display:'flex',alignItems:'center',justifyContent:'space-between',pointerEvents:'auto'}}>

          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button onClick={()=>{setShowCanais(v=>!v);nudgeUI();}} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 10px',background:showCanais?`${canal.cor}22`:'rgba(0,0,0,.55)',border:`1px solid ${showCanais?canal.cor:'rgba(255,255,255,.18)'}`,borderRadius:10,color:showCanais?canal.cor:'rgba(255,255,255,.7)',fontSize:11,cursor:'pointer',backdropFilter:'blur(8px)',fontFamily:"'Courier New',monospace",letterSpacing:1,transition:'all .2s'}}>
              {canal.icone} {canal.sigla} <span style={{fontSize:8,opacity:.6}}>▼</span>
            </button>
            <span style={{fontFamily:"'Courier New',monospace",fontSize:9,fontWeight:900,letterSpacing:2,color:canal.cor,textShadow:`0 0 8px ${canal.cor}`}}>GT NETWORK</span>
            {!paused&&<span style={{fontFamily:"'Courier New',monospace",fontSize:7,color:'#ff0044',fontWeight:900,letterSpacing:2,animation:'gtBlink 1s step-end infinite'}}>● AO VIVO</span>}
          </div>

          {/* Dots de navegação — ocultos no manga (muitas páginas) */}
          {!isMangaChannel && (
            <div style={{display:'flex',alignItems:'center',gap:4}}>
              {slides.map((_,i)=>(
                <button key={i} onClick={()=>{goTo(i,i>safeCur?'left':'right');nudgeUI();}} style={{width:i===safeCur?18:6,height:6,borderRadius:3,background:i===safeCur?canal.cor:'rgba(255,255,255,.2)',border:'none',cursor:'pointer',padding:0,boxShadow:i===safeCur?`0 0 6px ${canal.cor}`:'none',transition:'all .35s'}}/>
              ))}
            </div>
          )}

          {/* Contador de páginas para o canal manga */}
          {isMangaChannel && total > 0 && (
            <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:canal.cor,letterSpacing:2,fontWeight:900,textShadow:`0 0 8px ${canal.cor}88`}}>
              {safeCur + 1} / {total}
            </div>
          )}

          <div style={{display:'flex',gap:5}}>
            <Link href="/tv-empresarial/canais" style={{fontFamily:"'Courier New',monospace",fontSize:8,color:'rgba(255,255,255,.5)',textDecoration:'none',padding:'4px 9px',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,letterSpacing:1}}>⚙️ CANAIS</Link>
            <Link href="/tv-empresarial/config" style={{fontFamily:"'Courier New',monospace",fontSize:8,color:canal.cor,textDecoration:'none',padding:'4px 9px',background:`${canal.cor}12`,border:`1px solid ${canal.cor}35`,borderRadius:10,letterSpacing:1}}>✏️ EDITAR</Link>
            <Link href="/" style={{fontFamily:"'Courier New',monospace",fontSize:8,color:'rgba(255,255,255,.4)',textDecoration:'none',padding:'4px 9px',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,letterSpacing:1}}>← VOLTAR</Link>
          </div>
        </div>

        {(['prev','next'] as const).map(side=>(
          <button key={side} onClick={()=>{side==='prev'?goPrev():goNext();nudgeUI();}}
            style={{position:'absolute',top:'50%',transform:'translateY(-50%)',[side==='prev'?'left':'right']:10,width:40,height:40,borderRadius:'50%',background:'rgba(0,0,0,.65)',border:'1px solid rgba(255,255,255,.18)',color:'rgba(255,255,255,.7)',fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(8px)',pointerEvents:'auto',transition:'background .2s',fontFamily:'monospace'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.18)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,0,0,.65)';}}
          >{side==='prev'?'◀':'▶'}</button>
        ))}

        <div style={{position:'absolute',bottom:8,left:0,right:0,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px',pointerEvents:'auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:12}}>{slides[safeCur]?.icon}</span>
            <span style={{fontFamily:"'Courier New',monospace",fontSize:8,color:'rgba(255,255,255,.5)',letterSpacing:1.5,fontWeight:700}}>{slides[safeCur]?.label?.toUpperCase()}</span>
          </div>
          {!isMangaChannel && (
            <div style={{fontFamily:"'Courier New',monospace",fontSize:8,background:'rgba(0,0,0,.65)',border:'1px solid rgba(255,255,255,.12)',borderRadius:7,padding:'3px 9px',color:'rgba(255,255,255,.4)',letterSpacing:1}}>{safeCur+1}/{total}</div>
          )}
        </div>
      </div>

      {/* Ticker */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:20}}>
        <GTNewsTicker speed={80} height={TICKER_H} controls={false}/>
      </div>

      <style>{`
        @keyframes gtEnter  {from{transform:translateX(var(--gt-enter));opacity:.5}to{transform:translateX(0);opacity:1}}
        @keyframes gtExit   {from{transform:translateX(0);opacity:1}to{transform:translateX(var(--gt-exit));opacity:.3}}
        @keyframes gtBlink  {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes gtFadeIn {from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes chFloat  {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      `}</style>
    </div>
  );
}
