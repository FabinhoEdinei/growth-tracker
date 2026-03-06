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
      {/* Ornamento superior minimalista */}
      <div className="header-ornament">
        ◈ ◈ ◈ ◈ ◈ ◈ ◈ ◈ ◈
      </div>

      {/* Bandeira superior */}
      <div className="header-banner">
        SISTEMA DE CRESCIMENTO DIGITAL E DISTINGUIDO
      </div>

      {/* Título principal compacto */}
      <h1 className="newspaper-title">
        <span className="title-decoration">▸</span>
        <span className="title-text">GROWTH TRACKER GAZETTE</span>
        <span className="title-decoration">◂</span>
      </h1>

      {/* Meta informações compactas */}
      <div className="newspaper-meta">
        <span className="meta-item">CRÔNICAS DO OESTE DIGITAL</span>
        <span className="meta-separator">•</span>
        <span className="meta-item">{formattedDate}</span>
        <span className="meta-separator">•</span>
        <span className="meta-edition">EDIÇÃO Nº {Math.floor(Date.now() / 86400000)}</span>
        <span className="meta-separator">•</span>
        <span className="meta-price">GRATUITO</span>
      </div>

      {/* Linha decorativa minimalista */}
      <div className="header-border">
        <div className="border-ornament">◆ ◆ ◆ ◆ ◆ ◆ ◆</div>
      </div>

      <style jsx>{`
        .newspaper-header {
          text-align: center;
          padding: 20px 15px;
          background: linear-gradient(
            180deg,
            #2a1810 0%,
            #1a1410 100%
          );
          border: 3px double #8B7355;
          margin-bottom: 25px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .header-ornament {
          font-size: 8px;
          color: rgba(218, 165, 32, 0.4);
          letter-spacing: 6px;
          margin-bottom: 8px;
        }

        .header-banner {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          font-weight: bold;
          letter-spacing: 3px;
          color: rgba(245, 230, 211, 0.6);
          background: rgba(139, 115, 85, 0.2);
          padding: 5px 15px;
          border-top: 1px solid rgba(139, 115, 85, 0.3);
          border-bottom: 1px solid rgba(139, 115, 85, 0.3);
          margin: 0 auto 12px;
          max-width: fit-content;
        }

        .newspaper-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 38px;
          font-weight: 900;
          margin: 0;
          color: #f5e6d3;
          text-transform: uppercase;
          letter-spacing: 3px;
          line-height: 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .title-decoration {
          font-size: 24px;
          color: #DAA520;
          filter: drop-shadow(0 0 8px rgba(218, 165, 32, 0.5));
        }

        .newspaper-meta {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(245, 230, 211, 0.5);
          margin: 12px 0 8px;
          letter-spacing: 1px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .meta-item {
          color: rgba(245, 230, 211, 0.6);
        }

        .meta-separator {
          color: rgba(218, 165, 32, 0.4);
        }

        .meta-edition {
          color: rgba(218, 165, 32, 0.7);
        }

        .meta-price {
          font-weight: bold;
          color: #DAA520;
        }

        .header-border {
          margin-top: 12px;
        }

        .border-ornament {
          font-size: 10px;
          color: rgba(139, 115, 85, 0.5);
          letter-spacing: 8px;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .newspaper-header {
            padding: 18px 12px;
          }

          .newspaper-title {
            font-size: 32px;
            gap: 12px;
          }

          .title-decoration {
            font-size: 20px;
          }

          .header-banner {
            font-size: 8px;
            letter-spacing: 2px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .newspaper-header {
            padding: 15px 10px;
          }

          .header-banner {
            font-size: 7px;
            letter-spacing: 1px;
            padding: 4px 10px;
          }

          .newspaper-title {
            font-size: 24px;
            flex-direction: column;
            gap: 6px;
          }

          .title-decoration {
            font-size: 16px;
            transform: rotate(90deg);
          }

          .title-text {
            font-size: 22px;
            letter-spacing: 2px;
          }

          .newspaper-meta {
            font-size: 8px;
            flex-direction: column;
            gap: 4px;
          }

          .meta-separator {
            display: none;
          }

          .header-ornament,
          .border-ornament {
            font-size: 7px;
            letter-spacing: 4px;
          }
        }

        /* Mobile pequeno */
        @media (max-width: 480px) {
          .newspaper-title {
            font-size: 20px;
          }

          .title-text {
            font-size: 18px;
            letter-spacing: 1px;
          }

          .header-banner {
            font-size: 6px;
          }
        }
      `}</style>
    </header>
  );
};