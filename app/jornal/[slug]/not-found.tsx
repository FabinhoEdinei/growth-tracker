import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="ornamental-corners">
          <span className="corner tl">✦</span>
          <span className="corner tr">✦</span>
          <span className="corner bl">✦</span>
          <span className="corner br">✦</span>
        </div>

        <h1 className="error-code">404</h1>
        
        <div className="divider">
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        <h2 className="error-title">História Não Encontrada</h2>
        
        <p className="error-message">
          Esta página do jornal parece ter sido perdida nas planícies digitais...
        </p>

        <div className="nav-buttons">
          <Link href="/" className="vintage-btn">
            <span className="btn-icon">🏠</span>
            <span>Voltar ao Início</span>
          </Link>

          <Link href="/jornal" className="vintage-btn primary">
            <span className="btn-icon">📰</span>
            <span>Ver Todas as Histórias</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(42, 24, 16, 1),
            rgba(10, 10, 8, 1)
          );
          padding: 20px;
        }

        .not-found-card {
          max-width: 600px;
          background: linear-gradient(
            135deg,
            rgba(245, 235, 220, 0.95),
            rgba(240, 230, 215, 0.95)
          );
          padding: 60px 40px;
          border: 4px double #6b5344;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          text-align: center;
          position: relative;
        }

        .ornamental-corners {
          position: absolute;
          inset: 15px;
          pointer-events: none;
        }

        .corner {
          position: absolute;
          font-size: 24px;
          color: #8B7355;
          opacity: 0.6;
        }

        .corner.tl { top: 0; left: 0; }
        .corner.tr { top: 0; right: 0; }
        .corner.bl { bottom: 0; left: 0; }
        .corner.br { bottom: 0; right: 0; }

        .error-code {
          font-family: 'Playfair Display', serif;
          font-size: 120px;
          font-weight: 900;
          margin: 0;
          color: #8B7355;
          text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
        }

        .divider {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 20px 0;
          font-size: 16px;
          color: #8B7355;
        }

        .error-title {
          font-family: 'Georgia', serif;
          font-size: 32px;
          margin: 20px 0;
          color: #2a1810;
        }

        .error-message {
          font-family: 'Georgia', serif;
          font-size: 16px;
          font-style: italic;
          color: #5a4a3a;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .nav-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .vintage-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #5a4a3a, #3a2a1a);
          border: 2px solid #8B7355;
          border-radius: 8px;
          color: #f5e6d3;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 1.5px;
          transition: all 0.3s;
        }

        .vintage-btn.primary {
          background: linear-gradient(135deg, #8B7355, #6b5344);
          border-color: #DAA520;
        }

        .vintage-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(218, 165, 32, 0.3);
        }

        .btn-icon {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .not-found-card {
            padding: 40px 20px;
          }

          .error-code {
            font-size: 80px;
          }

          .error-title {
            font-size: 24px;
          }

          .nav-buttons {
            flex-direction: column;
          }

          .vintage-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}