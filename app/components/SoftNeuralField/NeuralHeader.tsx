'use client';

import { useEffect, useRef } from 'react';

interface NeuralHeaderProps {
  onBoundsUpdate: (bounds: { x: number; y: number; width: number; height: number }) => void;
  glow: number;
}

export const NeuralHeader: React.FC<NeuralHeaderProps> = ({ onBoundsUpdate, glow }) => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        onBoundsUpdate({
          x: rect.left,
          y: rect.top,
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
  }, [onBoundsUpdate]);

  return (
    <div 
      ref={headerRef}
      className="neural-header"
      style={{
        '--glow-intensity': Math.min(glow * 2, 1),
      } as React.CSSProperties}
    >
      <div className="header-container">
        {/* Bordas superiores curvadas (estilo alças PS5) */}
        <div className="top-handle left-handle"></div>
        <div className="top-handle right-handle"></div>
        
        {/* Laterais ergonômicas */}
        <div className="side-grip left-grip"></div>
        <div className="side-grip right-grip"></div>
        
        {/* Cantos tech */}
        <div className="tech-corner top-left-corner"></div>
        <div className="tech-corner top-right-corner"></div>
        <div className="tech-corner bottom-left-corner"></div>
        <div className="tech-corner bottom-right-corner"></div>
        
        {/* Linhas de energia */}
        <div className="energy-line top-line"></div>
        <div className="energy-line bottom-line"></div>
        <div className="energy-line left-line"></div>
        <div className="energy-line right-line"></div>
        
        {/* Raios laterais estendidos */}
        <div className="extended-wing left-extended"></div>
        <div className="extended-wing right-extended"></div>
        
        {/* Conteúdo central */}
        <div className="header-content">
          <div className="status-indicators">
            <span className="indicator active"></span>
            <span className="indicator"></span>
            <span className="indicator"></span>
          </div>
          
          <h1 className="title">Growth Tracker</h1>
          <p className="subtitle">track • grow • evolve</p>
          
          {/* Botão do Blog */}
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
          z-index: 10;
          padding: 15px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          pointer-events: none;
        }

        .header-container {
          position: relative;
          width: 100%;
          max-width: 800px;
          padding: 25px 50px;
          background: linear-gradient(
            135deg,
            rgba(5, 5, 25, 0.95),
            rgba(15, 5, 35, 0.95),
            rgba(25, 10, 45, 0.95)
          );
          backdrop-filter: blur(15px);
          border-radius: 50px;
          box-shadow: 
            0 0 40px rgba(0, 255, 255, calc(0.2 + var(--glow-intensity) * 0.6)),
            inset 0 0 60px rgba(0, 255, 255, calc(0.05 + var(--glow-intensity) * 0.15)),
            0 0 80px rgba(255, 0, 255, calc(0.15 + var(--glow-intensity) * 0.5)),
            0 10px 40px rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(0, 255, 255, calc(0.2 + var(--glow-intensity) * 0.4));
          transition: all 0.3s ease;
        }

        /* Alças superiores estilo PS5 */
        .top-handle {
          position: absolute;
          top: -15px;
          width: 150px;
          height: 30px;
          background: linear-gradient(
            180deg,
            rgba(0, 255, 255, calc(0.3 + var(--glow-intensity) * 0.4)),
            transparent
          );
          border-radius: 50% 50% 0 0;
          filter: blur(2px);
        }

        .left-handle {
          left: 80px;
          transform: rotate(-5deg);
        }

        .right-handle {
          right: 80px;
          transform: rotate(5deg);
        }

        /* Grips laterais ergonômicos */
        .side-grip {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 60%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(0, 255, 255, calc(0.4 + var(--glow-intensity) * 0.3)),
            rgba(255, 0, 255, calc(0.3 + var(--glow-intensity) * 0.3)),
            transparent
          );
          border-radius: 20px;
          filter: blur(1px);
        }

        .left-grip {
          left: -4px;
        }

        .right-grip {
          right: -4px;
        }

        /* Cantos tech hexagonais */
        .tech-corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 2px solid;
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }

        .top-left-corner {
          top: -5px;
          left: -5px;
          border-color: rgba(0, 255, 255, calc(0.6 + var(--glow-intensity)));
          box-shadow: 
            -5px -5px 20px rgba(0, 255, 255, calc(0.4 + var(--glow-intensity))),
            inset 0 0 15px rgba(0, 255, 255, calc(0.3 + var(--glow-intensity)));
        }

        .top-right-corner {
          top: -5px;
          right: -5px;
          border-color: rgba(255, 0, 255, calc(0.6 + var(--glow-intensity)));
          box-shadow: 
            5px -5px 20px rgba(255, 0, 255, calc(0.4 + var(--glow-intensity))),
            inset 0 0 15px rgba(255, 0, 255, calc(0.3 + var(--glow-intensity)));
        }

        .bottom-left-corner {
          bottom: -5px;
          left: -5px;
          border-color: rgba(0, 255, 136, calc(0.6 + var(--glow-intensity)));
          box-shadow: 
            -5px 5px 20px rgba(0, 255, 136, calc(0.4 + var(--glow-intensity))),
            inset 0 0 15px rgba(0, 255, 136, calc(0.3 + var(--glow-intensity)));
        }

        .bottom-right-corner {
          bottom: -5px;
          right: -5px;
          border-color: rgba(255, 170, 0, calc(0.6 + var(--glow-intensity)));
          box-shadow: 
            5px 5px 20px rgba(255, 170, 0, calc(0.4 + var(--glow-intensity))),
            inset 0 0 15px rgba(255, 170, 0, calc(0.3 + var(--glow-intensity)));
        }

        /* Linhas de energia */
        .energy-line {
          position: absolute;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 255, calc(0.6 + var(--glow-intensity) * 0.4)),
            rgba(255, 0, 255, calc(0.4 + var(--glow-intensity) * 0.4)),
            transparent
          );
          animation: energyFlow 2s ease-in-out infinite;
        }

        .top-line {
          top: 0;
          left: 10%;
          right: 10%;
          height: 2px;
          border-radius: 2px;
        }

        .bottom-line {
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 2px;
          border-radius: 2px;
          animation-delay: 1s;
        }

        .left-line {
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 2px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(0, 255, 255, calc(0.6 + var(--glow-intensity) * 0.4)),
            transparent
          );
          animation-delay: 0.5s;
        }

        .right-line {
          right: 0;
          top: 20%;
          bottom: 20%;
          width: 2px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255, 0, 255, calc(0.6 + var(--glow-intensity) * 0.4)),
            transparent
          );
          animation-delay: 1.5s;
        }

        @keyframes energyFlow {
          0%, 100% {
            opacity: 0.3;
            filter: brightness(1);
          }
          50% {
            opacity: 1;
            filter: brightness(1.5);
          }
        }

        /* Raios estendidos (mais longos) */
        .extended-wing {
          position: absolute;
          top: 50%;
          width: 250px;
          height: 3px;
          transform: translateY(-50%);
          filter: blur(2px);
          opacity: calc(0.6 + var(--glow-intensity) * 0.4);
        }

        .left-extended {
          left: -250px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 255, 0.4),
            rgba(0, 255, 255, calc(0.8 + var(--glow-intensity) * 0.2)),
            rgba(255, 0, 255, calc(0.6 + var(--glow-intensity) * 0.3))
          );
          box-shadow: 
            0 0 20px rgba(0, 255, 255, calc(0.6 + var(--glow-intensity))),
            0 0 40px rgba(0, 255, 255, calc(0.3 + var(--glow-intensity)));
          animation: wingPulse 3s ease-in-out infinite;
        }

        .right-extended {
          right: -250px;
          background: linear-gradient(
            270deg,
            transparent,
            rgba(255, 0, 255, 0.4),
            rgba(255, 0, 255, calc(0.8 + var(--glow-intensity) * 0.2)),
            rgba(0, 255, 255, calc(0.6 + var(--glow-intensity) * 0.3))
          );
          box-shadow: 
            0 0 20px rgba(255, 0, 255, calc(0.6 + var(--glow-intensity))),
            0 0 40px rgba(255, 0, 255, calc(0.3 + var(--glow-intensity)));
          animation: wingPulse 3s ease-in-out infinite reverse;
        }

        @keyframes wingPulse {
          0%, 100% {
            width: 250px;
            opacity: 0.6;
          }
          50% {
            width: 280px;
            opacity: 1;
          }
        }

        /* Conteúdo */
        .header-content {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .status-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(100, 100, 120, 0.3);
          border: 1px solid rgba(100, 100, 120, 0.5);
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: rgba(0, 255, 255, 0.8);
          border-color: rgba(0, 255, 255, 1);
          box-shadow: 
            0 0 10px rgba(0, 255, 255, 0.8),
            inset 0 0 5px rgba(0, 255, 255, 0.6);
          animation: indicatorPulse 2s ease-in-out infinite;
        }

        @keyframes indicatorPulse {
          0%, 100% {
            box-shadow: 
              0 0 10px rgba(0, 255, 255, 0.8),
              inset 0 0 5px rgba(0, 255, 255, 0.6);
          }
          50% {
            box-shadow: 
              0 0 20px rgba(0, 255, 255, 1),
              inset 0 0 10px rgba(0, 255, 255, 0.8);
          }
        }

        .title {
          font-family: 'Orbitron', 'Courier New', monospace;
          font-size: 52px;
          font-weight: 900;
          background: linear-gradient(
            135deg,
            #00ffff,
            #ff00ff,
            #00ffff,
            #ffaa00
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 
            0 0 40px rgba(0, 255, 255, calc(0.6 + var(--glow-intensity))),
            0 0 80px rgba(255, 0, 255, calc(0.4 + var(--glow-intensity)));
          animation: titleGradient 4s ease infinite;
          margin: 0;
          letter-spacing: 6px;
          filter: brightness(calc(1 + var(--glow-intensity) * 0.5));
          position: relative;
        }

        @keyframes titleGradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .subtitle {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(0, 255, 255, 0.7);
          margin-top: 8px;
          letter-spacing: 4px;
          text-transform: lowercase;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        /* Botão do Blog */
        .blog-button {
          display: inline-block;
          margin-top: 12px;
          padding: 8px 20px;
          background: rgba(255, 0, 102, 0.15);
          border: 1px solid rgba(255, 0, 102, 0.4);
          border-radius: 6px;
          color: #ff0066;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-decoration: none;
          transition: all 0.3s;
          cursor: pointer;
          pointer-events: auto;
        }

        .blog-button:hover {
          background: rgba(255, 0, 102, 0.3);
          box-shadow: 0 0 20px rgba(255, 0, 102, 0.4);
          transform: scale(1.05);
        }

        .tech-details {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(0, 255, 136, 0.8);
          letter-spacing: 2px;
        }

        .detail-item {
          padding: 4px 10px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 4px;
          text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
        }

        .detail-separator {
          color: rgba(255, 0, 255, calc(0.6 + var(--glow-intensity) * 0.4));
          animation: separatorPulse 1.5s ease-in-out infinite;
        }

        @keyframes separatorPulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .neural-header {
            padding: 10px;
          }

          .header-container {
            padding: 20px 30px;
            border-radius: 35px;
          }

          .title {
            font-size: 32px;
            letter-spacing: 3px;
          }

          .subtitle {
            font-size: 9px;
            letter-spacing: 2px;
          }

          .blog-button {
            margin-top: 10px;
            padding: 6px 16px;
            font-size: 10px;
          }

          .tech-details {
            font-size: 8px;
            gap: 8px;
          }

          .top-handle {
            width: 100px;
            height: 20px;
          }

          .left-handle {
            left: 40px;
          }

          .right-handle {
            right: 40px;
          }

          .extended-wing {
            width: 150px;
          }

          .left-extended {
            left: -150px;
          }

          .right-extended {
            right: -150px;
          }

          .tech-corner {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
};