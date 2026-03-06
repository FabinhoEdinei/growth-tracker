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
      <div className="top-ornament">• • • • • • • • • • • • •</div>

      {/* Banner */}
      <div className="header-banner">
        SISTEMA DE CRESCIMENTO DIGITAL E DISTINGUIDO
      </div>

      {/* Título */}
      <h1 className="newspaper-title">GROWTH TRACKER GAZETTE</h1>

      {/* Meta informações */}
      <div className="newspaper-meta">
        <span>CRÔNICAS DO OESTE DIGITAL</span>
        <span className="separator">—</span>
        <span>{formattedDate}</span>
        <span className="separator">—</span>
        <span className="edition">EDIÇÃO Nº {Math.floor(Date.now() / 86400000)}</span>
        <span className="separator">—</span>
        <span className="price">GRATUITO</span>
      </div>

      <style jsx>{`
        .newspaper-header {
          text-align: center;
          padding: 18px 20px;
          background: linear-gradient(
            180deg,
            #2a1810 0%,
            #1f120d 50%,
            #1a0f0a 100%
          );
          border: 2px solid #8B7355;
          position: relative;
          margin: 0 10px 20px;
          box-shadow: 
            0 4px 15px rgba(0, 0, 0, 0.4),            inset 0 1px 0 rgba(218, 165, 32, 0.1);
        }

        /* Cantos decorativos */
        .newspaper-header::before,
        .newspaper-header::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #DAA520;
          opacity: 0.5;
        }

        .newspaper-header::before {
          top: 8px;
          left: 8px;
          border-right: none;
          border-bottom: none;
        }

        .newspaper-header::after {
          top: 8px;
          right: 8px;
          border-left: none;
          border-bottom: none;
        }

        .top-ornament {
          font-size: 10px;
          color: rgba(218, 165, 32, 0.5);
          letter-spacing: 8px;
          margin-bottom: 10px;
          font-family: 'Courier New', monospace;
        }

        .header-banner {
          font-family: 'Courier New', monospace;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 2.5px;
          color: rgba(245, 230, 211, 0.7);
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .newspaper-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 32px;
          font-weight: 700;          margin: 0 0 10px 0;
          color: #f5e6d3;
          text-transform: uppercase;
          letter-spacing: 4px;
          line-height: 1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
        }

        .newspaper-meta {
          font-family: 'Courier New', monospace;
          font-size: 8px;
          color: rgba(245, 230, 211, 0.6);
          letter-spacing: 1px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
        }

        .separator {
          color: rgba(139, 115, 85, 0.6);
          font-size: 10px;
        }

        .edition {
          color: rgba(218, 165, 32, 0.8);
          font-weight: 600;
        }

        .price {
          color: #DAA520;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .newspaper-header {
            padding: 16px 15px;
            margin: 0 8px 18px;
          }

          .newspaper-title {
            font-size: 28px;
            letter-spacing: 3px;
          }

          .top-ornament {            font-size: 9px;
            letter-spacing: 6px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .newspaper-header {
            padding: 14px 12px;
            margin: 0 5px 15px;
          }

          .top-ornament {
            font-size: 8px;
            letter-spacing: 4px;
            margin-bottom: 8px;
          }

          .header-banner {
            font-size: 7px;
            letter-spacing: 1.5px;
            margin-bottom: 10px;
          }

          .newspaper-title {
            font-size: 22px;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }

          .newspaper-meta {
            font-size: 7px;
            flex-direction: column;
            gap: 4px;
          }

          .separator {
            display: none;
          }
        }

        /* Mobile pequeno */
        @media (max-width: 480px) {
          .newspaper-header {
            padding: 12px 10px;
          }

          .newspaper-title {
            font-size: 18px;
            letter-spacing: 1.5px;          }

          .header-banner {
            font-size: 6px;
          }

          .top-ornament {
            font-size: 7px;
          }
        }
      `}</style>
    </header>
  );
};