'use client';

import { useEffect, useRef, useState } from 'react';

interface NeuralHeaderProps {
  onBoundsUpdate: (bounds: { x: number; y: number; width: number; height: number }) => void;
  glow: number;
}

export const NeuralHeader: React.FC<NeuralHeaderProps> = ({ onBoundsUpdate, glow }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateBounds = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        onBoundsUpdate({
          x: rect.left,
          y: isVisible ? rect.top : -200, // Move pra fora quando escondido
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateBounds();
    
    const resizeObserver = new ResizeObserver(updateBounds);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }
    
    window.addEventListener('resize', updateBounds);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateBounds);
    };
  }, [onBoundsUpdate, isVisible]);

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="header-toggle"
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          top: isVisible ? '15px' : '15px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 16px',
          background: 'rgba(0,255,255,0.15)',
          border: '1px solid rgba(0,255,255,0.4)',
          borderRadius: '8px',
          color: '#00ffff',
          fontFamily: 'Courier New, monospace',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          letterSpacing: '1px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,255,255,0.25)';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,255,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,255,255,0.15)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isVisible ? '▲ ESCONDER' : '▼ MOSTRAR'}
      </button>

      {/* Header */}
      <div 
        ref={headerRef}
        className={`neural-header ${isVisible ? 'visible' : 'hidden'}`}
        style={{
          '--glow-intensity': Math.min(glow * 2, 1),
        } as React.CSSProperties}
      >
        <div className="header-container">
          {/* Cantos tech menores */}
          <div className="tech-corner top-left-corner"></div>
          <div className="tech-corner top-right-corner"></div>
          <div className="tech-corner bottom-left-corner"></div>
          <div className="tech-corner bottom-right-corner"></div>
          
          {/* Conteúdo central compacto */}
          <div className="header-content">
            <div className="status-indicators">
              <span className="indicator active"></span>
              <span className="indicator"></span>
              <span className="indicator"></span>
            </div>
            
            <h1 className="title">Growth Tracker</h1>
            <p className="subtitle">track • grow • evolve</p>
            
            <a href="/blog" className="blog-button">
              📰 Blog
            </a>
            
            <div className="tech-details">
              <span className="detail-item">SYNC: ACTIVE</span>
              <span className="detail-separator">●</span>
              <span className="detail-item">PWR: {Math.floor(glow * 100)}%</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .neural-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            pointer-events: none;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .neural-header.hidden {
            transform: translateY(-100%);
          }

          .neural-header.visible {
            transform: translateY(0);
          }

          .header-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            padding: 15px 35px;
            background: linear-gradient(
              135deg,
              rgba(5, 5, 25, 0.95),
              rgba(15, 5, 35, 0.95)
            );
            backdrop-filter: blur(15px);
            border-radius: 35px;
            box-shadow: 
              0 0 30px rgba(0, 255, 255, calc(0.2 + var(--glow-intensity) * 0.4)),
              0 5px 25px rgba(0, 0, 0, 0.5);
            border: 1.5px solid rgba(0, 255, 255, calc(0.2 + var(--glow-intensity) * 0.3));
          }

          .tech-corner {
            position: absolute;
            width: 25px;
            height: 25px;
            border: 1.5px solid;
            clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
          }

          .top-left-corner {
            top: -3px;
            left: -3px;
            border-color: rgba(0, 255, 255, calc(0.5 + var(--glow-intensity)));
            box-shadow: -3px -3px 12px rgba(0, 255, 255, calc(0.3 + var(--glow-intensity)));
          }

          .top-right-corner {
            top: -3px;
            right: -3px;
            border-color: rgba(255, 0, 255, calc(0.5 + var(--glow-intensity)));
            box-shadow: 3px -3px 12px rgba(255, 0, 255, calc(0.3 + var(--glow-intensity)));
          }

          .bottom-left-corner {
            bottom: -3px;
            left: -3px;
            border-color: rgba(0, 255, 136, calc(0.5 + var(--glow-intensity)));
            box-shadow: -3px 3px 12px rgba(0, 255, 136, calc(0.3 + var(--glow-intensity)));
          }

          .bottom-right-corner {
            bottom: -3px;
            right: -3px;
            border-color: rgba(255, 170, 0, calc(0.5 + var(--glow-intensity)));
            box-shadow: 3px 3px 12px rgba(255, 170, 0, calc(0.3 + var(--glow-intensity)));
          }

          .header-content {
            text-align: center;
            position: relative;
            z-index: 2;
          }

          .status-indicators {
            display: flex;
            justify-content: center;
            gap: 6px;
            margin-bottom: 8px;
          }

          .indicator {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(100, 100, 120, 0.3);
            border: 1px solid rgba(100, 100, 120, 0.5);
          }

          .indicator.active {
            background: rgba(0, 255, 255, 0.8);
            border-color: rgba(0, 255, 255, 1);
            box-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
            animation: indicatorPulse 2s ease-in-out infinite;
          }

          @keyframes indicatorPulse {
            0%, 100% { box-shadow: 0 0 8px rgba(0, 255, 255, 0.8); }
            50% { box-shadow: 0 0 15px rgba(0, 255, 255, 1); }
          }

          .title {
            font-family: 'Orbitron', monospace;
            font-size: 32px;
            font-weight: 900;
            background: linear-gradient(135deg, #00ffff, #ff00ff, #00ffff);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 25px rgba(0, 255, 255, calc(0.4 + var(--glow-intensity)));
            animation: titleGradient 3s ease infinite;
            margin: 0;
            letter-spacing: 4px;
          }

          @keyframes titleGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .subtitle {
            font-family: 'Courier New', monospace;
            font-size: 9px;
            color: rgba(0, 255, 255, 0.6);
            margin-top: 5px;
            letter-spacing: 3px;
          }

          .blog-button {
            display: inline-block;
            margin-top: 8px;
            padding: 6px 16px;
            background: rgba(255, 0, 102, 0.15);
            border: 1px solid rgba(255, 0, 102, 0.4);
            border-radius: 5px;
            color: #ff0066;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            letter-spacing: 1.5px;
            text-decoration: none;
            transition: all 0.3s;
            cursor: pointer;
            pointer-events: auto;
          }

          .blog-button:hover {
            background: rgba(255, 0, 102, 0.3);
            box-shadow: 0 0 15px rgba(255, 0, 102, 0.4);
            transform: scale(1.05);
          }

          .tech-details {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            font-family: 'Courier New', monospace;
            font-size: 8px;
            color: rgba(0, 255, 136, 0.7);
            letter-spacing: 1.5px;
          }

          .detail-item {
            padding: 3px 8px;
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 3px;
          }

          .detail-separator {
            color: rgba(255, 0, 255, calc(0.5 + var(--glow-intensity) * 0.3));
            animation: separatorPulse 1.5s ease-in-out infinite;
          }

          @keyframes separatorPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }

          @media (max-width: 768px) {
            .header-container {
              padding: 12px 25px;
              border-radius: 28px;
            }

            .title {
              font-size: 24px;
              letter-spacing: 2px;
            }

            .subtitle {
              font-size: 8px;
              letter-spacing: 2px;
            }

            .tech-corner {
              width: 20px;
              height: 20px;
            }
          }
        `}</style>
      </div>
    </>
  );
};