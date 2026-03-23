// app/components/Jornal/NewspaperHeader.tsx
// Server Component — lê cookie no servidor para tradução correta

import Link from 'next/link';
import { getT } from '@/hooks/useTranslation';
import type { Messages } from '@/messages/translations';

interface NewspaperHeaderProps {
  paginaAtual?:  number;
  totalPaginas?: number;
  totalPosts?:   number;
}

export async function NewspaperHeader({
  paginaAtual  = 1,
  totalPaginas = 1,
  totalPosts   = 0,
}: NewspaperHeaderProps) {
  const t = await getT();

  const temAnterior = paginaAtual > 1;
  const temProxima  = paginaAtual < totalPaginas;
  const mostraNave  = totalPaginas > 1;

  const btn: React.CSSProperties = {
    fontFamily:"'Courier New',monospace", fontSize:10, fontWeight:900,
    textDecoration:'none', padding:'7px 13px',
    border:'1.5px solid rgba(200,168,75,0.55)', borderRadius:4,
    background:'rgba(200,168,75,0.1)', letterSpacing:1.5, color:'#c8a84b',
    display:'inline-flex', alignItems:'center', gap:5, whiteSpace:'nowrap' as const,
  };
  const btnFade: React.CSSProperties = { ...btn, color:'rgba(200,168,75,0.5)', border:'1.5px solid rgba(200,168,75,0.2)', background:'transparent' };

  return (
    <header className="newspaper-header">
      {/* Ornamentos SVG */}
      <svg className="corner-ornament top-left" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glTL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/><stop offset="50%" stopColor="#DAA520"/><stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
        </defs>
        <path d="M0,30 L0,0 L30,0" fill="none" stroke="url(#glTL)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M0,20 L0,0 L20,0" fill="none" stroke="url(#glTL)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <circle cx="8" cy="8" r="2" fill="url(#glTL)"/>
        <circle cx="25" cy="5" r="1" fill="url(#glTL)"/>
        <circle cx="5" cy="25" r="1" fill="url(#glTL)"/>
      </svg>
      <svg className="corner-ornament top-right" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glTR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/><stop offset="50%" stopColor="#DAA520"/><stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
        </defs>
        <path d="M70,0 L100,0 L100,30" fill="none" stroke="url(#glTR)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M80,0 L100,0 L100,20" fill="none" stroke="url(#glTR)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <circle cx="92" cy="8" r="2" fill="url(#glTR)"/>
      </svg>
      <svg className="corner-ornament bottom-left" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glBL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/><stop offset="50%" stopColor="#DAA520"/><stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
        </defs>
        <path d="M0,70 L0,100 L30,100" fill="none" stroke="url(#glBL)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="8" cy="92" r="2" fill="url(#glBL)"/>
      </svg>
      <svg className="corner-ornament bottom-right" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glBR" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/><stop offset="50%" stopColor="#DAA520"/><stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
        </defs>
        <path d="M70,100 L100,100 L100,70" fill="none" stroke="url(#glBR)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="92" cy="92" r="2" fill="url(#glBR)"/>
      </svg>

      {/* ── Título ── */}
      <h1 className="newspaper-title">{t.jornal.titulo}</h1>

      {/* ── Meta ── */}
      <div className="newspaper-meta">
        <span>{t.jornal.subtitulo}</span>
        <span>{new Date().toLocaleDateString(t.datas.locale, { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
        <span className="edition">{t.jornal.edicaoNum} {Math.floor(Date.now()/86400000)}</span>
      </div>

      {/* ── Navegação / Gratuito ── */}
      {mostraNave ? (
        <div className="nav-bar">
          {temAnterior
            ? <Link href={paginaAtual===2?'/jornal':`/jornal?pagina=${paginaAtual-1}`} style={btn}>{t.comum.anterior}</Link>
            : <Link href="/" style={btnFade}>{t.comum.home}</Link>
          }
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flex:1 }}>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:7, color:'rgba(200,168,75,.55)', letterSpacing:1.5 }}>
              ◆ {t.comum.pagina} {paginaAtual}/{totalPaginas} · {totalPosts} {t.jornal.arquivo} ◆
            </span>
            <div style={{ display:'flex', gap:4, alignItems:'center' }}>
              {Array.from({ length:totalPaginas },(_,i)=>i+1).map(p=>(
                <Link key={p} href={p===1?'/jornal':`/jornal?pagina=${p}`} style={{ width:p===paginaAtual?18:7, height:7, borderRadius:4, background:p===paginaAtual?'#c8a84b':'rgba(200,168,75,.25)', display:'block', transition:'all .3s', boxShadow:p===paginaAtual?'0 0 6px rgba(200,168,75,.5)':'none' }}/>
              ))}
            </div>
          </div>
          {temProxima
            ? <Link href={`/jornal?pagina=${paginaAtual+1}`} style={btn}>{t.comum.proximo}</Link>
            : <Link href="/" style={btnFade}>{t.comum.home}</Link>
          }
        </div>
      ) : (
        <div className="nav-bar nav-bar--gratuito">
          <Link href="/" style={btnFade}>{t.comum.home}</Link>
          <span className="price">{t.comum.gratuito}</span>
          <span style={{ opacity:0, ...btnFade }}>—</span>
        </div>
      )}

      <div className="bottom-ornament">♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦</div>

      <style jsx>{`
        .newspaper-header{text-align:center;padding:12px 30px;background:linear-gradient(180deg,#2a1810 0%,#1f120d 50%,#1a0f0a 100%);border:2px solid #8B7355;position:relative;margin:0 10px 0;box-shadow:0 4px 20px rgba(0,0,0,.5),inset 0 1px 0 rgba(218,165,32,.15);overflow:visible;}
        .newspaper-header::before{content:'';position:absolute;top:15px;left:15px;right:15px;bottom:15px;border:1px solid rgba(218,165,32,.4);pointer-events:none;}
        .corner-ornament{position:absolute;width:100px;height:100px;z-index:10;}
        .corner-ornament.top-left{top:0;left:0;filter:drop-shadow(0 0 6px rgba(218,165,32,.8));}
        .corner-ornament.top-right{top:0;right:0;filter:drop-shadow(0 0 6px rgba(218,165,32,.8));}
        .corner-ornament.bottom-left{bottom:0;left:0;filter:drop-shadow(0 0 6px rgba(218,165,32,.8));}
        .corner-ornament.bottom-right{bottom:0;right:0;filter:drop-shadow(0 0 6px rgba(218,165,32,.8));}
        .newspaper-title{font-family:'Playfair Display','Georgia',serif;font-size:28px;font-weight:700;padding:3px;margin:8px 0;color:#f5e6d3;text-transform:uppercase;letter-spacing:4px;line-height:1.1;text-shadow:2px 2px 6px rgba(0,0,0,.7);}
        .newspaper-meta{font-family:'Courier New',monospace;font-size:8px;color:rgba(245,230,211,.7);letter-spacing:1.5px;display:flex;flex-direction:column;align-items:center;gap:4px;margin-top:10px;line-height:1.5;}
        .edition{color:rgba(218,165,32,.9);font-weight:700;}
        .price{color:#DAA520;font-weight:700;letter-spacing:2px;font-family:'Courier New',monospace;font-size:9px;}
        .nav-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;padding:6px 4px;border-top:1px solid rgba(200,168,75,.25);}
        .nav-bar--gratuito{justify-content:center;gap:20px;}
        .bottom-ornament{font-size:10px;color:rgba(218,165,32,.6);letter-spacing:10px;margin-top:10px;font-family:'Courier New',monospace;}
        @media(max-width:768px){.newspaper-header{padding:10px 18px;margin:0 5px 0;}.corner-ornament{width:60px;height:60px;}.newspaper-title{font-size:18px;letter-spacing:2px;margin:6px 0;}.newspaper-meta{font-size:7px;margin-top:8px;gap:3px;}.bottom-ornament{font-size:8px;letter-spacing:6px;margin-top:8px;}.nav-bar{gap:5px;}}
        @media(max-width:480px){.newspaper-header{padding:8px 12px;}.corner-ornament{width:48px;height:48px;}.newspaper-title{font-size:15px;letter-spacing:1.5px;}.bottom-ornament{font-size:7px;letter-spacing:5px;}}
      `}</style>
    </header>
  );
}
