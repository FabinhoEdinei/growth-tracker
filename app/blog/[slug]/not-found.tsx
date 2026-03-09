import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Post não encontrado</h2>
      <p>Este post não existe ou foi removido.</p>
      <Link href="/blog" className="back-link">
        ← Voltar ao Blog
      </Link>

      <style jsx>{`
        .not-found {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(26, 20, 30, 1),
            rgba(10, 8, 15, 1)
          );
          color: #00ff88;
          text-align: center;
          padding: 40px 20px;
        }

        h1 {
          font-size: 120px;
          margin: 0;
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
        }

        h2 {
          font-size: 32px;
          margin: 20px 0;
          font-family: 'Georgia', serif;
        }

        p {
          font-size: 16px;
          color: rgba(200, 200, 220, 0.7);
          margin-bottom: 40px;
        }

        .back-link {
          padding: 12px 24px;
          background: transparent;
          border: 2px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          color: #00ff88;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: bold;
          transition: all 0.3s;
        }

        .back-link:hover {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
        }
      `}</style>
    </div>
  );
}