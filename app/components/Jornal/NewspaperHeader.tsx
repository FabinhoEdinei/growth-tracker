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
      {/* Ornamento superior */}
      <div className="header-ornament">
        ◈ ◈ ◈ ◈ ◈ ◈ ◈ ◈ ◈
      </div>

      {/* Título principal */}
      <h1 className="newspaper-title">
        <span className="title-decoration">⚜</span>
        <span className="title-text">GROWTH TRACKER GAZETTE</span>
        <span className="title-decoration">⚜</span>
      </h1>

      {/* Subtítulo */}
      <div className="newspaper-subtitle">
        CRÔNICAS DO OESTE DIGITAL
      </div>

      {/* Data e edição */}
      <div className="newspaper-meta">
        <span className="meta-date">{formattedDate}</span>
        <span className="meta-separator">•</span>
        <span className="meta-edition">EDIÇÃO Nº {Math.floor(Date.now() / 86400000)}</span>
        <span className="meta-separator">•</span>
        <span className="meta-price">GRATUITO</span>
      </div>

      {/* Linha decorativa */}
      <div className="header-border">
        <div className="border-line"></div>
        <div className="border-ornament">❋</div>
        <div className="border-line"></div>
      </div>

      {/* Slogan */}
      <div className="newspaper-slogan">
        "Todas as Notícias Dignas de Código e Café"
      </div>

      <style jsx>{`
        .newspaper-header {
          text-align: center;
          padding: 30px 20px;
          background: linear-gradient(
            180deg,
            #f5f0e8 0%,
            #faf8f0 50%,
            #f5f0e8 100%
          );
          border: 4px double #2a1810;
          border-bottom: 6px double #2a1810;
          margin-bottom: 30px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-ornament {
          font-size: 10px;
          color: rgba(0, 0, 0, 0.3);
          letter-spacing: 8px;
          margin-bottom: 15px;
        }

        .newspaper-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 56px;
          font-weight: 900;
          margin: 0;
          color: #2a1810;
          text-transform: uppercase;
          letter-spacing: 4px;
          line-height: 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
        }

        .title-decoration {
          font-size: 32px;
          color: #8B4513;
        }

        .newspaper-subtitle {
          font-family: 'Georgia', serif;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #8B4513;
          margin: 12px 0;
          text-transform: uppercase;
        }

        .newspaper-meta {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(0, 0, 0, 0.6);
          margin: 15px 0;
          letter-spacing: 1px;
        }

        .meta-separator {
          margin: 0 10px;
          color: rgba(0, 0, 0, 0.3);
        }

        .meta-price {
          font-weight: bold;
          color: #c41e3a;
        }

        .header-border {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 20px 0 15px;
        }

        .border-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            #2a1810,
            transparent
          );
          max-width: 300px;
        }

        .border-ornament {
          font-size: 16px;
          color: #8B4513;
        }

        .newspaper-slogan {
          font-family: 'Georgia', serif;
          font-size: 12px;
          font-style: italic;
          color: rgba(0, 0, 0, 0.5);
          letter-spacing: 1px;
        }

        /* Textura de papel vintage */
        .newspaper-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.02) 2px,
              rgba(139, 69, 19, 0.02) 4px
            );
          pointer-events: none;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .newspaper-title {
            font-size: 44px;
            gap: 15px;
          }

          .title-decoration {
            font-size: 28px;
          }

          .newspaper-subtitle {
            font-size: 12px;
            letter-spacing: 4px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .newspaper-header {
            padding: 20px 15px;
          }

          .newspaper-title {
            font-size: 32px;
            flex-direction: column;
            gap: 8px;
          }

          .title-decoration {
            font-size: 20px;
          }

          .title-text {
            font-size: 28px;
          }

          .newspaper-subtitle {
            font-size: 10px;
            letter-spacing: 3px;
          }

          .newspaper-meta {
            font-size: 9px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .meta-separator {
            display: none;
          }

          .border-line {
            max-width: 100px;
          }

          .newspaper-slogan {
            font-size: 10px;
          }
        }

        /* Mobile pequeno */
        @media (max-width: 480px) {
          .newspaper-title {
            font-size: 24px;
          }

          .title-text {
            font-size: 22px;
            letter-spacing: 2px;
          }

          .newspaper-subtitle {
            font-size: 9px;
            letter-spacing: 2px;
          }
        }
      `}</style>
    </header>
  );
};