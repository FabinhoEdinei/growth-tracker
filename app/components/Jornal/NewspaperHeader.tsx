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
    <header className="vintage-header">
      {/* Ornamento superior */}
      <div className="top-ornament">
        ❦ ❦ ❦ ❦ ❦ ❦ ❦ ❦ ❦
      </div>

      {/* Faixa superior escura */}
      <div className="header-top-band">
        <span className="top-left">SISTEMA DE CRESCIMENTO</span>
        <span className="top-right">DIGITAL E DISTINGUIDO</span>
      </div>

      {/* Faixa central clara com título */}
      <div className="header-main-band">
        <span className="main-decoration-left">➤</span>
        <h1 className="main-title">GROWTH TRACKER GAZETTE</h1>
        <span className="main-decoration-right">➤</span>
      </div>

      {/* Faixa inferior escura */}
      <div className="header-bottom-band">
        <span className="bottom-text">
          CRÔNICAS DO OESTE DIGITAL • {formattedDate} • EDIÇÃO Nº {Math.floor(Date.now() / 86400000)} • GRATUITO
        </span>
      </div>

      {/* Linha decorativa inferior */}
      <div className="bottom-ornament">
        ◈ ◈ ◈  ◈ ◈ ◈  ◈
      </div>

      <style jsx>{`
        .vintage-header {
          text-align: center;
          padding: 25px 20px;
          background: #f5f0e8;
          border: 3px double #2a1810;
          margin-bottom: 30px;          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .top-ornament {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.4);
          letter-spacing: 10px;
          margin-bottom: 10px;
        }

        /* Faixa superior escura */
        .header-top-band {
          background: #2a1810;
          color: #f5f0e8;
          padding: 6px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Georgia', serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: 2px solid #1a0f0a;
        }

        /* Faixa central clara */
        .header-main-band {
          background: #faf8f0;
          padding: 20px 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          border-left: 3px solid #2a1810;
          border-right: 3px solid #2a1810;
          position: relative;
        }

        .main-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 48px;
          font-weight: 900;
          margin: 0;
          color: #2a1810;
          text-transform: uppercase;
          letter-spacing: 6px;
          line-height: 1;
          text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
        }
        .main-decoration-left,
        .main-decoration-right {
          font-size: 24px;
          color: #8B4513;
          opacity: 0.7;
        }

        /* Faixa inferior escura */
        .header-bottom-band {
          background: #2a1810;
          color: #f5f0e8;
          padding: 10px 15px;
          font-family: 'Georgia', serif;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: 2px solid #1a0f0a;
          border-top: none;
        }

        .bottom-text {
          display: block;
        }

        .bottom-ornament {
          font-size: 10px;
          color: rgba(0, 0, 0, 0.3);
          letter-spacing: 8px;
          margin-top: 10px;
        }

        /* Textura de papel */
        .vintage-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.03) 2px,
              rgba(139, 69, 19, 0.03) 4px
            );
          pointer-events: none;
          opacity: 0.5;
        }

        /* Tablet */        @media (max-width: 1024px) {
          .main-title {
            font-size: 36px;
            letter-spacing: 4px;
          }

          .header-top-band,
          .header-bottom-band {
            font-size: 9px;
            padding: 5px 10px;
          }

          .header-main-band {
            padding: 15px 20px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .vintage-header {
            padding: 15px 10px;
          }

          .header-top-band {
            flex-direction: column;
            gap: 4px;
            padding: 8px;
          }

          .main-title {
            font-size: 24px;
            letter-spacing: 3px;
          }

          .header-main-band {
            padding: 15px;
            gap: 10px;
          }

          .main-decoration-left,
          .main-decoration-right {
            font-size: 16px;
          }

          .header-bottom-band {
            font-size: 8px;
            letter-spacing: 1px;
            padding: 8px;
          }
          .top-ornament,
          .bottom-ornament {
            font-size: 8px;
            letter-spacing: 5px;
          }
        }

        /* Mobile pequeno */
        @media (max-width: 480px) {
          .main-title {
            font-size: 18px;
            letter-spacing: 2px;
          }

          .header-top-band {
            font-size: 8px;
          }

          .header-bottom-band {
            font-size: 7px;
          }
        }
      `}</style>
    </header>
  );
};