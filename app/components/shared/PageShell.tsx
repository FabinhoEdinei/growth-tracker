'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Lightning {
  id: number;
  points: Array<{ x: number; y: number }>;
  alpha: number;
  hue: number;
}

interface PageShellProps {
  title: string;
  subtitle?: string;
  accentColor: string;
  accentHue: number;
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  subtitle,
  accentColor,
  accentHue,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightningsRef = useRef<Lightning[]>([]);
  const animationFrameRef = useRef<number>();
  const spawnIntervalRef = useRef<NodeJS.Timeout>();

  const generateLightningPath = (startX: number): Array<{ x: number; y: number }> => {
    const points: Array<{ x: number; y: number }> = [];
    const startY = 0;
    const endY = 60 + Math.random() * 20;
    const segments = 8 + Math.floor(Math.random() * 4);
    let x = startX;
    let y = startY;
    points.push({ x, y });
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      y = startY + (endY - startY) * t;
      const offsetIntensity = 15 * (1 - Math.abs(t - 0.5) * 2);
      x += (Math.random() - 0.5) * offsetIntensity;
      points.push({ x, y });
    }
    return points;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 80;
    };
    resize();
    window.addEventListener('resize', resize);

    spawnIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.3) {
        const startX = Math.random() * canvas.width;
        lightningsRef.current.push({
          id: Date.now() + Math.random(),
          points: generateLightningPath(startX),
          alpha: 1,
          hue: accentHue + (Math.random() - 0.5) * 40,
        });
      }
    }, 250);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lightningsRef.current = lightningsRef.current
        .map(l => ({ ...l, alpha: l.alpha - 0.08 }))
        .filter(l => l.alpha > 0);

      lightningsRef.current.forEach(lightning => {
        ctx.save();
        ctx.globalAlpha = lightning.alpha;
        ctx.strokeStyle = `hsl(${lightning.hue}, 100%, 60%)`;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsl(${lightning.hue}, 100%, 60%)`;
        ctx.lineCap = 'round';
        ctx.beginPath();
        lightning.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        lightning.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [accentHue]);

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="shell-header">
        <div className="top-bar">
          <Link href="/" className="back-btn">
            {'<-'} Voltar
          </Link>
          <h1 className="page-title">{title}</h1>
        </div>
        <canvas ref={canvasRef} className="lightning-canvas" />
      </header>

      {/* Subtitle */}
      {subtitle && (
        <div className="subtitle-bar">
          <span className="subtitle-text">{subtitle}</span>
          <div className="subtitle-line" />
        </div>
      )}

      {/* Content */}
      <main className="shell-content">{children}</main>

      <style jsx>{`
        .page-shell {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, rgba(10, 10, 30, 1), rgba(0, 0, 0, 1));
          font-family: 'Inter', sans-serif;
        }

        .shell-header {
          position: relative;
          background: linear-gradient(180deg, ${accentColor}08, transparent);
          border-bottom: 1px solid ${accentColor}26;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          position: relative;
          z-index: 2;
        }

        .back-btn {
          padding: 8px 16px;
          background: ${accentColor}1a;
          border: 1px solid ${accentColor}4d;
          border-radius: 6px;
          color: ${accentColor};
          font-family: 'Courier New', monospace;
          font-size: 12px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: ${accentColor}33;
          box-shadow: 0 0 15px ${accentColor}4d;
        }

        .page-title {
          font-family: 'Orbitron', monospace;
          font-size: 20px;
          font-weight: 900;
          background: linear-gradient(135deg, ${accentColor}, #ff00ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: 3px;
        }

        .lightning-canvas {
          position: absolute;
          top: 50px;
          left: 0;
          width: 100%;
          height: 80px;
          pointer-events: none;
          z-index: 1;
        }

        .subtitle-bar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 20px 0;
        }

        .subtitle-text {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: ${accentColor}99;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .subtitle-line {
          height: 2px;
          width: 80px;
          margin-top: 8px;
          background: linear-gradient(90deg, ${accentColor}, transparent);
          animation: expandLine 1s ease-out;
        }

        @keyframes expandLine {
          from { width: 0; }
          to { width: 80px; }
        }

        .shell-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }

        @media (max-width: 768px) {
          .top-bar {
            padding: 12px 15px;
          }

          .page-title {
            font-size: 16px;
            letter-spacing: 2px;
          }

          .back-btn {
            font-size: 11px;
            padding: 6px 12px;
          }

          .shell-content {
            padding: 24px 15px 60px;
          }
        }
      `}</style>
    </div>
  );
};
