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
      {/* Ornamentos de canto SVG */}
      <svg className="corner-ornament top-left" viewBox="0 0 80 80" preserveAspectRatio="none">
        <path d="M0,0 L60,0 L60,8 L8,8 L8,60 L0,60 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="1"/>
        <path d="M0,0 Q20,0 20,20 Q20,40 40,40 Q60,40 60,20" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5"/>
        <path d="M0,0 Q0,20 20,20 Q40,20 40,40" fill="none" stroke="url(#goldGradient)" strokeWidth="1"/>
        <circle cx="10" cy="10" r="2" fill="url(#goldGradient)"/>
        <path d="M15,5 Q25,5 25,15" fill="none" stroke="url(#goldGradient)" strokeWidth="0.8"/>
        <path d="M5,15 Q5,25 15,25" fill="none" stroke="url(#goldGradient)" strokeWidth="0.8"/>
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="30%" stopColor="#DAA520"/>
            <stop offset="50%" stopColor="#FFD700"/>
            <stop offset="70%" stopColor="#DAA520"/>
            <stop offset="100%" stopColor="#8B7355"/>
          </linearGradient>
        </defs>
      </svg>

      <svg className="corner-ornament top-right" viewBox="0 0 80 80" preserveAspectRatio="none">
        <path d="M80,0 L20,0 L20,8 L72,8 L72,60 L80,60 Z" fill="none" stroke="url(#goldGradient2)" strokeWidth="1"/>
        <path d="M80,0 Q60,0 60,20 Q60,40 40,40 Q20,40 20,20" fill="none" stroke="url(#goldGradient2)" strokeWidth="1.5"/>
        <path d="M80,0 Q80,20 60,20 Q40,20 40,40" fill="none" stroke="url(#goldGradient2)" strokeWidth="1"/>
        <circle cx="70" cy="10" r="2" fill="url(#goldGradient2)"/>
        <path d="M65,5 Q55,5 55,15" fill="none" stroke="url(#goldGradient2)" strokeWidth="0.8"/>
        <path d="M75,15 Q75,25 65,25" fill="none" stroke="url(#goldGradient2)" strokeWidth="0.8"/>
        <defs>
          <linearGradient id="goldGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="30%" stopColor="#DAA520"/>
            <stop offset="50%" stopColor="#FFD700"/>
            <stop offset="70%" stopColor="#DAA520"/>
            <stop offset="100%" stopColor="#8B7355"/>
          </linearGradient>
        </defs>
      </svg>
      <svg className="corner-ornament bottom-left" viewBox="0 0 80 80" preserveAspectRatio="none">
        <path d="M0,80 L60,80 L60,72 L8,72 L8,20 L0,20 Z" fill="none" stroke="url(#goldGradient3)" strokeWidth="1"/>
        <path d="M0,80 Q20,80 20,60 Q20,40 40,40 Q60,40 60,60" fill="none" stroke="url(#goldGradient3)" strokeWidth="1.5"/>
        <path d="M0,80 Q0,60 20,60 Q40,60 40,40" fill="none" stroke="url(#goldGradient3)" strokeWidth="1"/>
        <circle cx="10" cy="70" r="2" fill="url(#goldGradient3)"/>
        <path d="M15,75 Q25,75 25,65" fill="none" stroke="url(#goldGradient3)" strokeWidth="0.8"/>
        <path d="M5,65 Q5,55 15,55" fill="none" stroke="url(#goldGradient3)" strokeWidth="0.8"/>
        <defs>
          <linearGradient id="goldGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="30%" stopColor="#DAA520"/>
            <stop offset="50%" stopColor="#FFD700"/>
            <stop offset="70%" stopColor="#DAA520"/>
            <stop offset="100%" stopColor="#8B7355"/>
          </linearGradient>
        </defs>
      </svg>

      <svg className="corner-ornament bottom-right" viewBox="0 0 80 80" preserveAspectRatio="none">
        <path d="M80,80 L20,80 L20,72 L72,72 L72,20 L80,20 Z" fill="none" stroke="url(#goldGradient4)" strokeWidth="1"/>
        <path d="M80,80 Q60,80 60,60 Q60,40 40,40 Q20,40 20,60" fill="none" stroke="url(#goldGradient4)" strokeWidth="1.5"/>
        <path d="M80,80 Q80,60 60,60 Q40,60 40,40" fill="none" stroke="url(#goldGradient4)" strokeWidth="1"/>
        <circle cx="70" cy="70" r="2" fill="url(#goldGradient4)"/>
        <path d="M65,75 Q55,75 55,65" fill="none" stroke="url(#goldGradient4)" strokeWidth="0.8"/>
        <path d="M75,65 Q75,55 65,55" fill="none" stroke="url(#goldGradient4)" strokeWidth="0.8"/>
        <defs>
          <linearGradient id="goldGradient4" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/>
            <stop offset="30%" stopColor="#DAA520"/>
            <stop offset="50%" stopColor="#FFD700"/>
            <stop offset="70%" stopColor="#DAA520"/>
            <stop offset="100%" stopColor="#8B7355"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Ornamento superior */}
      <div className="top-ornament">♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦</div>

      {/* Banner */}
      <div className="header-banner">
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
          overflow: hidden;
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
          width: 80px;
          height: 80px;          z-index: 10;
          filter: drop-shadow(0 0 4px rgba(218, 165, 32, 0.6));
        }

        .corner-ornament.top-left {
          top: 5px;
          left: 5px;
        }

        .corner-ornament.top-right {
          top: 5px;
          right: 5px;
          transform: scaleX(-1);
        }

        .corner-ornament.bottom-left {
          bottom: 5px;
          left: 5px;
          transform: scaleY(-1);
        }

        .corner-ornament.bottom-right {
          bottom: 5px;
          right: 5px;
          transform: scale(-1, -1);
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
          letter-spacing: 3px;          color: rgba(245, 230, 211, 0.75);
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
          line-height: 1.6;
        }

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
            width: 60px;
            height: 60px;
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
            width: 50px;
            height: 50px;
          }

          .corner-ornament.top-left,
          .corner-ornament.top-right {
            top: 3px;
          }

          .corner-ornament.bottom-left,
          .corner-ornament.bottom-right {
            bottom: 3px;
          }

          .newspaper-header::before {
            top: 12px;
            left: 12px;
            right: 12px;            bottom: 12px;
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
            width: 40px;
            height: 40px;
          }

          .newspaper-title {
            font-size: 18px;
            letter-spacing: 2px;
          }

          .header-banner {            font-size: 6px;
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