'use client';

import { useEffect, useState, useRef } from 'react';

interface Lightning {
  id: number;
  startX: number;
  points: Array<{ x: number; y: number }>;
  alpha: number;
  hue: number;
}

export const BlogHeader = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightnings, setLightnings] = useState<Lightning[]>([]);
  const nextId = useRef(0);

  // Gerar caminho zigzag do raio
  const generateLightningPath = (startX: number, startY: number): Array<{ x: number; y: number }> => {
    const points: Array<{ x: number; y: number }> = [];
    const endY = startY + 100 + Math.random() * 50; // 100-150px para baixo
    const segments = 12 + Math.floor(Math.random() * 8); // 12-20 segmentos
    
    let x = startX;
    let y = startY;
    
    points.push({ x, y });
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      y = startY + (endY - startY) * t;
      
      // Offset horizontal agressivo (zigzag)
      const offsetIntensity = 25 * (1 - Math.abs(t - 0.5) * 2);
      x += (Math.random() - 0.5) * offsetIntensity;
      
      // Ramificações aleatórias
      if (i % 3 === 0 && Math.random() > 0.6) {
        x += (Math.random() - 0.5) * offsetIntensity * 1.8;
      }
      
      points.push({ x, y });
    }
    
    return points;
  };

  // Criar novo raio
  const spawnLightning = () => {
    if (typeof window === 'undefined') return;
    
    const startX = Math.random() * window.innerWidth;
    const startY = 0;
    const hue = [180, 300, 340][Math.floor(Math.random() * 3)]; // cyan, magenta, vermelho
    
    const newLightning: Lightning = {
      id: nextId.current++,
      startX,
      points: generateLightningPath(startX, startY),
      alpha: 1,
      hue,
    };
    
    setLightnings(prev => [...prev, newLightning]);
  };

  // Loop de animação
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 180;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn raios periodicamente
    const spawnInterval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance a cada 500ms
        spawnLightning();
      }
    }, 500);

    // Update e render
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update lightnings
      setLightnings(prev => 
        prev.map(l => ({ ...l, alpha: l.alpha - 0.05 }))
           .filter(l => l.alpha > 0)
      );

      // Render lightnings
      lightnings.forEach(lightning => {
        if (lightning.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = lightning.alpha;

        // Layer 1: Glow grosso (cyan/magenta/vermelho)
        ctx.strokeStyle = `hsl(${lightning.hue}, 100%, 60%)`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${lightning.hue}, 100%, 60%)`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        lightning.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Layer 2: Core fino (branco)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';

        ctx.beginPath();
        lightning.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      clearInterval(spawnInterval);
      window.removeEventListener('resize', resize);
    };
  }, [lightnings]);

  return (
    <div className="blog-header">
      <div className="header-content">
        <span className="header-icon">📰</span>
        <h1 className="header-title">GROWTH BLOG</h1>
        <p className="header-subtitle">Neural insights • Tech stories • Evolution logs</p>
      </div>

      {/* Canvas de raios */}
      <div className="lightning-container">
        <canvas ref={canvasRef} className="lightning-canvas" />
        <div className="bottom-line"></div>
      </div>

      <style jsx>{`
        .blog-header {
          position: relative;
          padding: 60px 20px 0;
          text-align: center;
          background: linear-gradient(180deg, rgba(0,255,255,0.05), transparent);
          overflow: hidden;
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
          margin: 0 0 20px 0;
        }

        .lightning-container {
          position: relative;
          width: 100%;
          height: 180px;
          margin-top: 20px;
        }

        .lightning-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
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
          z-index: 1;
        }

        @keyframes lineGlow {
          0%, 100% { 
            opacity: 0.3; 
            box-shadow: 0 0 5px rgba(0,255,255,0.3);
          }
          50% { 
            opacity: 1; 
            box-shadow: 0 0 20px rgba(0,255,255,0.6);
          }
        }

        @media (max-width: 768px) {
          .blog-header {
            padding: 40px 15px 0;
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

          .lightning-container {
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
};