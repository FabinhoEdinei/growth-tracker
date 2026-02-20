'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Lightning {
  id: number;
  points: Array<{ x: number; y: number }>;
  alpha: number;
  hue: number;
}

export const BlogHeader = () => {
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
      if (Math.random() > 0.2) {
        const startX = Math.random() * canvas.width;
        const hue = [180, 300, 340][Math.floor(Math.random() * 3)];
        
        lightningsRef.current.push({
          id: Date.now() + Math.random(),
          points: generateLightningPath(startX),
          alpha: 1,
          hue,
        });
      }
    }, 200);

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
  }, []);

  return (
    <div className="compact-header">
      <div className="top-bar">
        <Link href="/" className="back-btn">
          ↩️ Voltar
        </Link>
        <h1 className="blog-title">Growth Tracker Blog</h1>
      </div>
      
      <canvas ref={canvasRef} className="lightning-canvas" />

      <style jsx>{`
        .compact-header {
          position: relative;
          background: linear-gradient(180deg, rgba(0,255,255,0.03), transparent);
          border-bottom: 1px solid rgba(0,255,255,0.15);
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
          background: rgba(0,255,255,0.1);
          border: 1px solid rgba(0,255,255,0.3);
          border-radius: 6px;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(0,255,255,0.2);
          box-shadow: 0 0 15px rgba(0,255,255,0.3);
        }

        .blog-title {
          font-family: 'Orbitron', monospace;
          font-size: 20px;
          font-weight: 900;
          background: linear-gradient(135deg, #00ffff, #ff00ff);
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

        @media (max-width: 768px) {
          .top-bar {
            padding: 12px 15px;
          }

          .blog-title {
            font-size: 16px;
            letter-spacing: 2px;
          }

          .back-btn {
            font-size: 11px;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  );
};