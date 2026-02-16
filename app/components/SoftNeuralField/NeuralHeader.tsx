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
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [onBoundsUpdate]);

  return (
    <div 
      ref={headerRef}
      className="neural-header"
      style={{
        '--glow-intensity': Math.min(glow * 2, 1),
      } as React.CSSProperties}
    >
      <div className="header-frame">
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-left"></div>
        <div className="corner bottom-right"></div>
        
        <div className="wing left-wing"></div>
        <div className="wing right-wing"></div>
        
        <div className="header-content">
          <h1 className="title">Funcionando</h1>
          <p className="subtitle">neural growth system online</p>
        </div>
      </div>

      <style jsx>{`
        .neural-header {
          position: relative;
          z-index: 10;
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }

        .header-frame {
          position: relative;
          padding: 40px 80px;
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            rgba(10, 10, 40, 0.8),
            rgba(30, 10, 50, 0.8)
          );
          backdrop-filter: blur(10px);
          box-shadow: 
            0 0 30px rgba(0, 255, 255, calc(0.3 + var(--glow-intensity) * 0.5)),
            inset 0 0 40px rgba(0, 255, 255, calc(0.1 + var(--glow-intensity) * 0.2)),
            0 0 60px rgba(255, 0, 255, calc(0.2 + var(--glow-intensity) * 0.4));
          transition: box-shadow 0.3s ease;
        }

        .corner {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid #00ffff;
        }

        .top-left {
          top: -2px;
          left: -2px;
          border-right: none;
          border-bottom: none;
          box-shadow: -3px -3px 10px rgba(0, 255, 255, calc(0.5 + var(--glow-intensity)));
        }

        .top-right {
          top: -2px;
          right: -2px;
          border-left: none;
          border-bottom: none;
          box-shadow: 3px -3px 10px rgba(0, 255, 255, calc(0.5 + var(--glow-intensity)));
        }

        .bottom-left {
          bottom: -2px;
          left: -2px;
          border-right: none;
          border-top: none;
          box-shadow: -3px 3px 10px rgba(0, 255, 255, calc(0.5 + var(--glow-intensity)));
        }

        .bottom-right {
          bottom: -2px;
          right: -2px;
          border-left: none;
          border-top: none;
          box-shadow: 3px 3px 10px rgba(0, 255, 255, calc(0.5 + var(--glow-intensity)));
        }

        .wing {
          position: absolute;
          top: 50%;
          width: 100px;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 255, 0.8),
            rgba(255, 0, 255, 0.6)
          );
          transform: translateY(-50%);
          filter: blur(1px);
        }

        .left-wing {
          left: -100px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 255, calc(0.6 + var(--glow-intensity) * 0.3)),
            rgba(255, 0, 255, calc(0.4 + var(--glow-intensity) * 0.3))
          );
          box-shadow: 0 0 15px rgba(0, 255, 255, calc(0.5 + var(--glow-intensity)));
        }

        .right-wing {
          right: -100px;
          background: linear-gradient(
            270deg,
            transparent,
            rgba(0, 255, 255, calc(0.6 + var(--glow-intensity) * 0.3)),
            rgba(255, 0, 255, calc(0.4 + var(--glow-intensity) * 0.3))
          );
          box-shadow: 0 0 15px rgba(0, 255, 255, calc(0.5 + var(--glow-intensity)));
        }

        .header-content {
          text-align: center;
        }

        .title {
          font-family: 'Orbitron', 'Courier New', monospace;
          font-size: 64px;
          font-weight: 700;
          background: linear-gradient(
            135deg,
            #00ffff,
            #ff00ff,
            #00ffff
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 
            0 0 30px rgba(0, 255, 255, calc(0.6 + var(--glow-intensity))),
            0 0 60px rgba(255, 0, 255, calc(0.4 + var(--glow-intensity)));
          animation: gradientShift 3s ease infinite;
          margin: 0;
          letter-spacing: 4px;
          filter: brightness(calc(1 + var(--glow-intensity) * 0.5));
        }

        .subtitle {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: rgba(0, 255, 255, 0.7);
          margin-top: 10px;
          letter-spacing: 3px;
          text-transform: lowercase;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @media (max-width: 768px) {
          .header-frame {
            padding: 30px 40px;
          }

          .title {
            font-size: 40px;
          }

          .subtitle {
            font-size: 11px;
          }

          .wing {
            width: 60px;
          }

          .left-wing {
            left: -60px;
          }

          .right-wing {
            right: -60px;
          }
        }
      `}</style>
    </div>
  );
};