 'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number; // cor ciano/azul suave
  life: number; // vida restante (0–1)
}

export default function SoftNeuralField({
  particleCount = 60,
  fps = 24,
}: {
  particleCount?: number;
  fps?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const lastRenderTime = useRef<number>(0);
  const frameInterval = useRef(1000 / fps); // ex: ~41.66ms para 24 FPS

  // Inicializa partículas suaves
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.7;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx,
        vy,
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.3,
        hue: 180 + Math.random() * 40, // ciano → azul claro
        life: 1,      };
    });
  };

  // Atualiza partículas (suave, sem colisão pesada)
  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Movimento suave com leve turbulência
      p.x += p.vx;
      p.y += p.vy;

      // Leve deriva (simula campo de força suave)
      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;

      // Limita velocidade
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) {
        p.vx = (p.vx / speed) * 1.2;
        p.vy = (p.vy / speed) * 1.2;
      }

      // Reaparece suavemente nas bordas
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Efeito de desvanecimento suave
      p.life -= 0.001;
      if (p.life <= 0) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.life = 1;
      }
    }
  };

  // Renderiza com transparência suave
  const render = () => {
    const canvas = canvasRef.current;    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fundo escuro translúcido (efeito de camada)
    ctx.fillStyle = 'rgba(3, 5, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha partículas
    const particles = particlesRef.current;
    for (const p of particles) {
      const alpha = p.alpha * p.life;
      if (alpha <= 0) continue;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${alpha})`;
      
      // Círculo suave
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  };

  // Loop controlado por FPS
  const animate = (timestamp: number) => {
    if (timestamp - lastRenderTime.current >= frameInterval.current) {
      lastRenderTime.current = timestamp;
      update();
      render();
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  // Setup inicial
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);    initParticles();
    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'radial-gradient(circle at center, #000410 0%, #000000 100%)' }}
    />
  );
}                                                                                                                                                                                                                                                                                                                                                                                                                                                    }