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
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Filigrana elaborada */}
        <path d="M5,50 C5,50 15,45 25,45 C35,45 40,40 40,30 C40,20 35,15 25,15 C15,15 10,20 10,25" 
              fill="none" stroke="url(#goldGradientTL)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10,25 C10,25 15,20 25,20 C30,20 35,25 35,30 C35,35 30,40 25,40 C20,40 15,35 15,30" 
              fill="none" stroke="url(#goldGradientTL)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M25,40 C25,40 25,50 20,55 C15,60 10,60 10,60" 
              fill="none" stroke="url(#goldGradientTL)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M30,35 C30,35 35,35 40,30 C45,25 50,20 50,15" 
              fill="none" stroke="url(#goldGradientTL)" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M35,25 C35,25 40,20 45,18 C50,16 55,15 55,15" 
              fill="none" stroke="url(#goldGradientTL)" strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="25" cy="30" r="2" fill="url(#goldGradientTL)" filter="url(#glowTL)"/>
        <circle cx="15" cy="40" r="1.5" fill="url(#goldGradientTL)"/>
        <circle cx="35" cy="20" r="1" fill="url(#goldGradientTL)"/>
      </svg>

      {/* Ornamentos de canto SVG - Top Right */}
      <svg className="corner-ornament top-right" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>          <linearGradient id="goldGradientTR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="25%" stopColor="#FFD700"/>
            <stop offset="50%" stopColor="#DAA520"/>
            <stop offset="75%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
          <filter id="glowTR">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M95,50 C95,50 85,45 75,45 C65,45 60,40 60,30 C60,20 65,15 75,15 C85,15 90,20 90,25" 
              fill="none" stroke="url(#goldGradientTR)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M90,25 C90,25 85,20 75,20 C70,20 65,25 65,30 C65,35 70,40 75,40 C80,40 85,35 85,30" 
              fill="none" stroke="url(#goldGradientTR)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M75,40 C75,40 75,50 80,55 C85,60 90,60 90,60" 
              fill="none" stroke="url(#goldGradientTR)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M70,35 C70,35 65,35 60,30 C55,25 50,20 50,15" 
              fill="none" stroke="url(#goldGradientTR)" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M65,25 C65,25 60,20 55,18 C50,16 45,15 45,15" 
              fill="none" stroke="url(#goldGradientTR)" strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="75" cy="30" r="2" fill="url(#goldGradientTR)" filter="url(#glowTR)"/>
        <circle cx="85" cy="40" r="1.5" fill="url(#goldGradientTR)"/>
        <circle cx="65" cy="20" r="1" fill="url(#goldGradientTR)"/>
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
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M5,50 C5,50 15,55 25,55 C35,55 40,60 40,70 C40,80 35,85 25,85 C15,85 10,80 10,75" 
              fill="none" stroke="url(#goldGradientBL)" strokeWidth="1.5" strokeLinecap="round"/>        <path d="M10,75 C10,75 15,80 25,80 C30,80 35,75 35,70 C35,65 30,60 25,60 C20,60 15,65 15,70" 
              fill="none" stroke="url(#goldGradientBL)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M25,60 C25,60 25,50 20,45 C15,40 10,40 10,40" 
              fill="none" stroke="url(#goldGradientBL)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M30,65 C30,65 35,65 40,70 C45,75 50,80 50,85" 
              fill="none" stroke="url(#goldGradientBL)" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M35,75 C35,75 40,80 45,82 C50,84 55,85 55,85" 
              fill="none" stroke="url(#goldGradientBL)" strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="25" cy="70" r="2" fill="url(#goldGradientBL)" filter="url(#glowBL)"/>
        <circle cx="15" cy="60" r="1.5" fill="url(#goldGradientBL)"/>
        <circle cx="35" cy="80" r="1" fill="url(#goldGradientBL)"/>
      </svg>

      {/* Ornamentos de canto SVG - Bottom Right */}
      <svg className="corner-ornament bottom-right" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="goldGradientBR" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="25%" stopColor="#FFD700"/>
            <stop offset="50%" stopColor="#DAA520"/>
            <stop offset="75%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
          <filter id="glowBR">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M95,50 C95,50 85,55 75,55 C65,55 60,60 60,70 C60,80 65,85 75,85 C85,85 90,80 90,75" 
              fill="none" stroke="url(#goldGradientBR)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M90,75 C90,75 85,80 75,80 C70,80 65,75 65,70 C65,65 70,60 75,60 C80,60 85,65 85,70" 
              fill="none" stroke="url(#goldGradientBR)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M75,60 C75,60 75,50 80,45 C85,40 90,40 90,40" 
              fill="none" stroke="url(#goldGradientBR)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M70,65 C70,65 65,65 60,70 C55,75 50,80 50,85" 
              fill="none" stroke="url(#goldGradientBR)" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M65,75 C65,75 60,80 55,82 C50,84 45,85 45,85" 
              fill="none" stroke="url(#goldGradientBR)" strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="75" cy="70" r="2" fill="url(#goldGradientBR)" filter="url(#glowBR)"/>
        <circle cx="85" cy="60" r="1.5" fill="url(#goldGradientBR)"/>
        <circle cx="65" cy="80" r="1" fill="url(#goldGradientBR)"/>
      </svg>

      {/* Ornamento superior */}
      <div className="top-ornament">♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦</div>

      {/* Banner */}      <div className="header-banner">
        SISTEMA DE CRESCIMENTO DIGITAL E DISTINGUIDO
      </div>

      {/* Triângulo decorativo */}
      <div className="title-arrow-down">▼</div>

      {/* Título */}
      <h1 className="newspaper-title">GROWTH TRACKER GAZETTE</h1>

      {/* Triângulo decorativo */}
      <div className="title-arrow-up">▲</div>

      {/* Meta informações */}
      <div className="newspaper-meta">
        <span>CRÔNICAS DO OESTE DIGITAL</span>
        <span>{formattedDate}</span>
        <span className="edition">EDIÇÃO Nº. {Math.floor(Date.now() / 86400000)}</span>
        <span className="price">GRATUITO</span>
      </div>

      {/* Ornamento inferior */}
      <div className="bottom-ornament">♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦</div>

      <style jsx>{`
        .newspaper-header {
          text-align: center;
          padding: 25px 30px;
          background: linear-gradient(
            180deg,
            #2a1810 0%,
            #1f120d 50%,
            #1a0f0a 100%
          );
          border: 2px solid #8B7355;
          position: relative;
          margin: 0 10px 25px;
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
          right: 15px;          bottom: 15px;
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

        .top-ornament {
          font-size: 12px;
          color: rgba(218, 165, 32, 0.6);
          letter-spacing: 12px;
          margin-bottom: 15px;
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 8px rgba(218, 165, 32, 0.4);
        }
        .bottom-ornament {
          font-size: 12px;
          color: rgba(218, 165, 32, 0.6);
          letter-spacing: 12px;
          margin-top: 15px;
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 8px rgba(218, 165, 32, 0.4);
        }

        .header-banner {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 3px;
          color: rgba(245, 230, 211, 0.75);
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .title-arrow-down,
        .title-arrow-up {
          font-size: 10px;
          color: rgba(218, 165, 32, 0.7);
          margin: 5px 0;
          text-shadow: 0 0 6px rgba(218, 165, 32, 0.5);
        }

        .newspaper-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 34px;
          font-weight: 700;
          margin: 10px 0;
          color: #f5e6d3;
          text-transform: uppercase;
          letter-spacing: 5px;
          line-height: 1.1;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
        }

        .newspaper-meta {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(245, 230, 211, 0.7);
          letter-spacing: 1.5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-top: 15px;
          line-height: 1.6;        }

        .edition {
          color: rgba(218, 165, 32, 0.9);
          font-weight: 700;
        }

        .price {
          color: #DAA520;
          font-weight: 700;
          letter-spacing: 2px;
          text-shadow: 0 0 8px rgba(218, 165, 32, 0.5);
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .newspaper-header {
            padding: 22px 25px;
            margin: 0 8px 22px;
          }

          .corner-ornament {
            width: 80px;
            height: 80px;
          }

          .newspaper-title {
            font-size: 28px;
            letter-spacing: 4px;
          }

          .top-ornament,
          .bottom-ornament {
            font-size: 10px;
            letter-spacing: 10px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .newspaper-header {
            padding: 20px 18px;
            margin: 0 5px 20px;
          }

          .corner-ornament {
            width: 60px;
            height: 60px;
          }
          .top-ornament,
          .bottom-ornament {
            font-size: 9px;
            letter-spacing: 8px;
            margin: 10px 0;
          }

          .header-banner {
            font-size: 7px;
            letter-spacing: 2px;
          }

          .newspaper-title {
            font-size: 22px;
            letter-spacing: 3px;
            margin: 8px 0;
          }

          .title-arrow-down,
          .title-arrow-up {
            font-size: 8px;
            margin: 3px 0;
          }

          .newspaper-meta {
            font-size: 8px;
            margin-top: 12px;
          }
        }

        /* Mobile pequeno */
        @media (max-width: 480px) {
          .newspaper-header {
            padding: 18px 15px;
          }

          .corner-ornament {
            width: 50px;
            height: 50px;
          }

          .newspaper-title {
            font-size: 18px;
            letter-spacing: 2px;
          }

          .header-banner {
            font-size: 6px;
          }
          .top-ornament,
          .bottom-ornament {
            font-size: 8px;
            letter-spacing: 6px;
          }
        }
      `}</style>
    </header>
  );
};