'use client';

export const BlogHeader = () => {
  return (
    <div className="blog-header">
      <div className="header-content">
        <span className="header-icon">📰</span>
        <h1 className="header-title">GROWTH BLOG</h1>
        <p className="header-subtitle">Neural insights • Tech stories • Evolution logs</p>
      </div>

      <style jsx>{`
        .blog-header {
          position: relative;
          padding: 60px 20px 40px;
          text-align: center;
          border-bottom: 2px solid rgba(0,255,255,0.2);
          background: linear-gradient(180deg, rgba(0,255,255,0.05), transparent);
        }

        .header-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .header-title {
          font-family: 'Orbitron', monospace;
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #00ffff, #ff00ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 10px 0;
          letter-spacing: 6px;
          text-shadow: 0 0 30px rgba(0,255,255,0.3);
        }

        .header-subtitle {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 3px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .blog-header {
            padding: 40px 15px 30px;
          }

          .header-icon {
            font-size: 36px;
          }

          .header-title {
            font-size: 28px;
            letter-spacing: 3px;
          }

          .header-subtitle {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};