'use client';

export const NewspaperHeader = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="newspaper-header">
      {/* Ornamentos de canto SVG - Top Left */}
      <svg className="corner-ornament top-left" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="goldGradientTL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="25%" stopColor="#FFD700"/>
            <stop offset="50%" stopColor="#DAA520"/>
            <stop offset="75%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
          <filter id="glowTL">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M0,30 L0,0 L30,0" fill="none" stroke="url(#goldGradientTL)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M0,20 L0,0 L20,0" fill="none" stroke="url(#goldGradientTL)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M5,35 Q15,35 35,15 Q35,5 35,5" fill="none" stroke="url(#goldGradientTL)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M10,40 Q25,40 40,25 Q40,10 40,10" fill="none" stroke="url(#goldGradientTL)" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
        <circle cx="8" cy="8" r="2" fill="url(#goldGradientTL)" filter="url(#glowTL)"/>
        <circle cx="25" cy="5" r="1" fill="url(#goldGradientTL)"/>
        <circle cx="5" cy="25" r="1" fill="url(#goldGradientTL)"/>
      </svg>

      {/* Ornamentos de canto SVG - Top Right */}
      <svg className="corner-ornament top-right" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="goldGradientTR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="25%" stopColor="#FFD700"/>
            <stop offset="50%" stopColor="#DAA520"/>
            <stop offset="75%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>          <filter id="glowTR">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M70,0 L100,0 L100,30" fill="none" stroke="url(#goldGradientTR)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M80,0 L100,0 L100,20" fill="none" stroke="url(#goldGradientTR)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M65,5 Q65,15 85,35 Q95,35 95,35" fill="none" stroke="url(#goldGradientTR)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M60,10 Q60,25 75,40 Q90,40 90,40" fill="none" stroke="url(#goldGradientTR)" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
        <circle cx="92" cy="8" r="2" fill="url(#goldGradientTR)" filter="url(#glowTR)"/>
        <circle cx="75" cy="5" r="1" fill="url(#goldGradientTR)"/>
        <circle cx="95" cy="25" r="1" fill="url(#goldGradientTR)"/>
      </svg>

      {/* Ornamentos de canto SVG - Bottom Left */}
      <svg className="corner-ornament bottom-left" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="goldGradientBL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="25%" stopColor="#FFD700"/>
            <stop offset="50%" stopColor="#DAA520"/>
            <stop offset="75%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
          <filter id="glowBL">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M0,70 L0,100 L30,100" fill="none" stroke="url(#goldGradientBL)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M0,80 L0,100 L20,100" fill="none" stroke="url(#goldGradientBL)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M5,65 Q15,65 35,85 Q35,95 35,95" fill="none" stroke="url(#goldGradientBL)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M10,60 Q25,60 40,75 Q40,90 40,90" fill="none" stroke="url(#goldGradientBL)" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
        <circle cx="8" cy="92" r="2" fill="url(#goldGradientBL)" filter="url(#glowBL)"/>
        <circle cx="25" cy="95" r="1" fill="url(#goldGradientBL)"/>
        <circle cx="5" cy="75" r="1" fill="url(#goldGradientBL)"/>
      </svg>

      {/* Ornamentos de canto SVG - Bottom Right */}
      <svg className="corner-ornament bottom-right" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="goldGradientBR" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="25%" stopColor="#FFD700"/>            <stop offset="50%" stopColor="#DAA520"/>
            <stop offset="75%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
          <filter id="glowBR">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M70,100 L100,100 L100,70" fill="none" stroke="url(#goldGradientBR)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M80,100 L100,100 L100,80" fill="none" stroke="url(#goldGradientBR)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M65,95 Q65,85 85,65 Q95,65 95,65" fill="none" stroke="url(#goldGradientBR)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M60,90 Q60,75 75,60 Q90,60 90,60" fill="none" stroke="url(#goldGradientBR)" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
        <circle cx="92" cy="92" r="2" fill="url(#goldGradientBR)" filter="url(#glowBR)"/>
        <circle cx="75" cy="95" r="1" fill="url(#goldGradientBR)"/>
        <circle cx="95" cy="75" r="1" fill="url(#goldGradientBR)"/>
      </svg>

      {/* Título */}
      <h1 className="newspaper-title">GROWTH TRACKER GAZETTE</h1>

      {/* Meta informações */}
      <div className="newspaper-meta">
        <span>CRÔNICAS DO SUL DIGITAL</span>
        <span>{formattedDate}</span>
        <span className="edition">EDIÇÃO Nº. {Math.floor(Date.now() / 86400000)}      {temAnterior
        ? <Link href={paginaAtual===2?'/jornal':`/jornal?pagina=${paginaAtual-1}`} style={btn}>◀ ANTERIOR</Link>
        : <Link href="/" style={btnHome}>⌂ HOME</Link>
      }

      {/* Centro — info + dots */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
        <span style={{ fontFamily:"'Courier New',monospace", fontSize:7, color:'rgba(200,168,75,0.55)', letterSpacing:2 }}>
          ◆ PÁG. {paginaAtual}/{totalPaginas} · {totalPosts} EDIÇÕES ◆
        </span>
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          {Array.from({ length: totalPaginas }, (_, i) => i+1).map(p => (
            <Link key={p} href={p===1?'/jornal':`/jornal?pagina=${p}`} style={{
              width:      p===paginaAtual ? 20 : 7,
              height:     7, borderRadius:4,
              background: p===paginaAtual ? '#c8a84b' : 'rgba(200,168,75,0.25)',
              display:    'block', transition:'all .3s',
              boxShadow:  p===paginaAtual ? '0 0 6px rgba(200,168,75,0.5)' : 'none',
            }}/>
          ))}
        </div>
      </div>

      </div>

      {/* Ornamento inferior */}
      <div className="bottom-ornament">♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦</div>

      <style jsx>{`
        .newspaper-header {
          text-align: center;
          padding: 12px 30px;
          background: linear-gradient(
            180deg,
            #2a1810 0%,
            #1f120d 50%,
            #1a0f0a 100%
          );          border: 2px solid #8B7355;
          position: relative;
          margin: 0 10px 20px;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(218, 165, 32, 0.15);
          overflow: visible;
        }

        /* Bordas internas douradas */
        .newspaper-header::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 15px;
          right: 15px;
          bottom: 15px;
          border: 1px solid rgba(218, 165, 32, 0.4);
          pointer-events: none;
        }

        /* Ornamentos de canto */
        .corner-ornament {
          position: absolute;
          width: 100px;
          height: 100px;
          z-index: 10;
        }

        .corner-ornament.top-left {
          top: 0px;
          left: 0px;
          filter: drop-shadow(0 0 6px rgba(218, 165, 32, 0.8)) 
                   drop-shadow(0 0 12px rgba(255, 215, 0, 0.4));
        }

        .corner-ornament.top-right {
          top: 0px;
          right: 0px;
          filter: drop-shadow(0 0 6px rgba(218, 165, 32, 0.8)) 
                   drop-shadow(0 0 12px rgba(255, 215, 0, 0.4));
        }

        .corner-ornament.bottom-left {
          bottom: 0px;
          left: 0px;
          filter: drop-shadow(0 0 6px rgba(218, 165, 32, 0.8)) 
                   drop-shadow(0 0 12px rgba(255, 215, 0, 0.4));
        }
        .corner-ornament.bottom-right {
          bottom: 0px;
          right: 0px;
          filter: drop-shadow(0 0 6px rgba(218, 165, 32, 0.8)) 
                   drop-shadow(0 0 12px rgba(255, 215, 0, 0.4));
        }

        .header-banner {
          font-family: 'Courier New', monospace;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 3px;
          color: rgba(245, 230, 211, 0.75);
          margin-bottom: 8px;
          margin-top: 5px;
          text-transform: uppercase;
        }

        .newspaper-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 28px;
          font-weight: 700;
          padding: 3px;
          margin: 8px 0;
          color: #f5e6d3;
          text-transform: uppercase;
          letter-spacing: 4px;
          line-height: 1.1;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
        }

        .newspaper-meta {
          font-family: 'Courier New', monospace;
          font-size: 8px;
          color: rgba(245, 230, 211, 0.7);
          letter-spacing: 1.5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-top: 10px;
          line-height: 1.5;
        }

        .edition {
          color: rgba(218, 165, 32, 0.9);
          font-weight: 700;
        }

        .price {
          color: #DAA520;          font-weight: 700;
          letter-spacing: 2px;
          text-shadow: 0 0 8px rgba(218, 165, 32, 0.5);
        }

        .bottom-ornament {
          font-size: 10px;
          color: rgba(218, 165, 32, 0.6);
          letter-spacing: 10px;
          margin-top: 12px;
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 8px rgba(218, 165, 32, 0.4);
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .newspaper-header {
            padding: 10px 25px;
            margin: 0 8px 18px;
          }

          .corner-ornament {
            width: 80px;
            height: 80px;
          }

          .newspaper-title {
            font-size: 24px;
            letter-spacing: 3px;
          }

          .bottom-ornament {
            font-size: 9px;
            letter-spacing: 8px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .newspaper-header {
            padding: 10px 18px;
            margin: 0 5px 15px;
          }

          .corner-ornament {
            width: 60px;
            height: 60px;
          }

          .newspaper-title {
            font-size: 18px;
            letter-spacing: 2px;
            margin: 6px 0;
          }

          .newspaper-meta {
            font-size: 7px;
            margin-top: 8px;
            gap: 3px;
          }

          .bottom-ornament {
            font-size: 8px;
            letter-spacing: 6px;
            margin-top: 10px;
          }
        }

        /* Mobile pequeno */
        @media (max-width: 480px) {
          .newspaper-header {
            padding: 8px 15px;
          }

          .corner-ornament {
            width: 50px;
            height: 50px;
          }

          .newspaper-title {
            font-size: 16px;
            letter-spacing: 1.5px;
          }

          .header-banner {
            font-size: 5px;
          }

          .bottom-ornament {
            font-size: 7px;
            letter-spacing: 5px;
          }
        }
      `}</style>    </header>
  );
};