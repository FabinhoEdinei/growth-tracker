'use client';

import { useEffect, useState } from 'react';

export const BlogHeader = () => {
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    hue: number;
  }>>([]);

  useEffect(() => {
    // Criar 10 mini-partículas
    const newParticles = Array.from({ length: 10 }, () => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
      y: 0,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * 0.3 + 0.2,
      size: 2 + Math.random() * 3,
      hue: [180, 300, 340][Math.floor(Math.random() * 3)],
    }));
    
    setParticles(newParticles);

    // Animar partículas
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.01, // gravidade
      })).filter(p => p.y < 100)); // remove partículas que saíram
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="blog-header">
      <div className="header-content">
        <span className="header-icon">📰</span>
        <h1 className="header-title">GROWTH BLOG</h1>
        <p className="header-subtitle">Neural insights • Tech stories • Evolution logs</p>
      </div>

      {/* Linha inferior com partículas caindo */}
      <div className="header-bottom">
        <div className="bottom-line"></div>
        <svg className="particles-svg" width="100%" height="80">
          {particles.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill={`hsl(${p.hue}, 100%, 60%)`}
              opacity="0.6"
              filter={`blur(${p.size * 0.5}px)`}
            />
          ))}
        </svg>
      </div>

      <style jsx>{`
        .blog-header {
          position: relative;
          padding: 60px 20px 20px;
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

        .header-bottom {
          position: relative;
          height: 80px;
          margin-top: 20px;
        }

        .bottom-line {
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0,255,255,0.6),
            rgba(255,0,255,0.4),
            transparent
          );
          animation: lineGlow 2s ease-in-out infinite;
        }

        @keyframes lineGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .particles-svg {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
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