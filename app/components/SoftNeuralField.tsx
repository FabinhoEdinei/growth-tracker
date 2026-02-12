'use client';

import { useEffect, useRef } from 'react';
import styles from './SoftNeuralField.module.css';

type ShapeType = 'circle' | 'square' | 'triangle' | 'hexagon' | 'diamond' | 'star';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
  shape: ShapeType;
  rotation: number;
  rotationSpeed: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
  glitchOffset: number;
  mass: number; // Para física de colisão
}

export default function SoftNeuralField({
  particleCount = 50,
  fps = 24,
}: {
  particleCount?: number;
  fps?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  // Paleta cyberpunk: cyan, magenta, roxo profundo, verde neon
  const cyberpunkHues = [180, 280, 320, 140, 200, 300];

  // Função para detectar e resolver colisões
  const handleCollisions = () => {
    const parts = particles.current;
    
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const p1 = parts[i];
        const p2 = parts[j];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.hypot(dx, dy);
        const minDist = p1.size + p2.size;
        
        // Colisão detectada
        if (distance < minDist && distance > 0) {
          // Vetor normal da colisão
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Separa as partículas
          const overlap = minDist - distance;
          const separationX = (overlap / 2) * nx;
          const separationY = (overlap / 2) * ny;
          
          p1.x -= separationX;
          p1.y -= separationY;
          p2.x += separationX;
          p2.y += separationY;
          
          // Velocidade relativa
          const dvx = p2.vx - p1.vx;
          const dvy = p2.vy - p1.vy;
          const dotProduct = dvx * nx + dvy * ny;
          
          // Não resolve se já estão se afastando
          if (dotProduct < 0) continue;
          
          // Colisão elástica com massa
          const totalMass = p1.mass + p2.mass;
          const impulse = (2 * dotProduct) / totalMass;
          
          // Atualiza velocidades (com elasticidade de 0.8 para mais suavidade)
          const restitution = 0.8;
          p1.vx += impulse * p2.mass * nx * restitution;
          p1.vy += impulse * p2.mass * ny * restitution;
          p2.vx -= impulse * p1.mass * nx * restitution;
          p2.vy -= impulse * p1.mass * ny * restitution;
          
          // Transferência de rotação no impacto
          const avgRotSpeed = (p1.rotationSpeed + p2.rotationSpeed) / 2;
          p1.rotationSpeed = avgRotSpeed + (Math.random() - 0.5) * 0.05;
          p2.rotationSpeed = avgRotSpeed + (Math.random() - 0.5) * 0.05;
        }
      }
    }
  };

  // Função para desenhar diferentes formas
  const drawShape = (
    ctx: CanvasRenderingContext2D,
    shape: ShapeType,
    x: number,
    y: number,
    size: number,
    rotation: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    switch (shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'square':
        ctx.fillRect(-size, -size, size * 2, size * 2);
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, size);
        ctx.lineTo(-size, size);
        ctx.closePath();
        ctx.fill();
        break;

      case 'hexagon':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.6, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        break;

      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const outerRadius = size;
          const innerRadius = size * 0.4;
          
          const x1 = Math.cos(angle) * outerRadius;
          const y1 = Math.sin(angle) * outerRadius;
          const x2 = Math.cos(angle + Math.PI / 5) * innerRadius;
          const y2 = Math.sin(angle + Math.PI / 5) * innerRadius;
          
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  };

  // Inicializa partículas
  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'hexagon', 'diamond', 'star'];

    particles.current = Array.from({ length: particleCount }, () => {
      // Tamanho entre 4px (vogal minúscula) e 8px (número "0")
      const size = 4 + Math.random() * 4;
      
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2.0,
        vy: (Math.random() - 0.5) * 2.0,
        size: size,
        hue: cyberpunkHues[Math.floor(Math.random() * cyberpunkHues.length)],
        life: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        trail: [],
        glitchOffset: 0,
        mass: size * size, // Massa proporcional à área
      };
    });
  };

  // Atualiza partículas
  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    for (const p of particles.current) {
      // Adiciona posição atual ao rastro
      p.trail.push({ x: p.x, y: p.y, alpha: 1 });
      
      // Limita tamanho do rastro (mais longo para efeito manga)
      if (p.trail.length > 20) {
        p.trail.shift();
      }

      // Diminui alpha do rastro (fade mais agressivo)
      p.trail.forEach((t, i) => {
        t.alpha = Math.pow((i + 1) / p.trail.length, 2) * 0.8;
      });

      // Movimento suave
      p.x += p.vx;
      p.y += p.vy;

      // Rotação
      p.rotation += p.rotationSpeed;

      // Efeito glitch ocasional (estilo cyberpunk)
      if (Math.random() < 0.02) {
        p.glitchOffset = (Math.random() - 0.5) * 10;
      } else {
        p.glitchOffset *= 0.8;
      }

      // Leve turbulência
      p.vx += (Math.random() - 0.5) * 0.04;
      p.vy += (Math.random() - 0.5) * 0.04;

      // Limita velocidade
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 2.2) {
        p.vx = (p.vx / speed) * 2.2;
        p.vy = (p.vy / speed) * 2.2;
      }

      // Reaparece nas bordas
      if (p.x < -30) p.x = w + 30;
      if (p.x > w + 30) p.x = -30;
      if (p.y < -30) p.y = h + 30;
      if (p.y > h + 30) p.y = -30;

      // Renova partícula
      p.life -= 0.0005;
      if (p.life <= 0) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.life = 1;
        p.trail = [];
        p.hue = cyberpunkHues[Math.floor(Math.random() * cyberpunkHues.length)];
      }
    }

    // Processa colisões após atualizar todas as posições
    handleCollisions();
  };

  // Renderiza partículas
  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Fade escuro ao invés de limpar completamente (efeito motion blur)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const p of particles.current) {
      const alpha = 0.7 * p.life;
      if (alpha <= 0) continue;

      // Cores cyberpunk: saturação alta, luminosidade baixa para dark
      const color = `hsl(${p.hue}, 100%, 50%)`;
      const colorDark = `hsl(${p.hue}, 90%, 35%)`;

      // Desenha rastro com degradê forte (estilo manga speed lines)
      for (let i = 0; i < p.trail.length; i++) {
        const t = p.trail[i];
        const trailSize = p.size * (0.2 + (i / p.trail.length) * 0.8);
        
        ctx.save();
        ctx.globalAlpha = t.alpha * alpha * 0.5;
        
        // Sombra dark no rastro
        ctx.shadowBlur = 15;
        ctx.shadowColor = colorDark;
        ctx.fillStyle = colorDark;
        
        drawShape(ctx, p.shape, t.x, t.y, trailSize * 0.5, p.rotation);
        
        ctx.restore();
      }

      // Efeito glitch: offset cromático RGB
      if (Math.abs(p.glitchOffset) > 0.5) {
        // Canal vermelho
        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = '#ff0066';
        drawShape(ctx, p.shape, p.x + p.glitchOffset, p.y, p.size, p.rotation);
        ctx.restore();

        // Canal azul
        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = '#00ffff';
        drawShape(ctx, p.shape, p.x - p.glitchOffset, p.y, p.size, p.rotation);
        ctx.restore();
      }

      // Desenha forma principal com borda neon intensa
      ctx.save();
      ctx.globalAlpha = alpha;
      
      // Brilho externo intenso (halo)
      ctx.shadowBlur = 40;
      ctx.shadowColor = color;
      ctx.fillStyle = colorDark;
      
      drawShape(ctx, p.shape, p.x, p.y, p.size, p.rotation);
      
      // Núcleo super brilhante (estilo neon sign)
      ctx.shadowBlur = 20;
      ctx.fillStyle = color;
      
      drawShape(ctx, p.shape, p.x, p.y, p.size * 0.5, p.rotation);
      
      // Ponto central white-hot
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      
      drawShape(ctx, p.shape, p.x, p.y, p.size * 0.2, p.rotation);
      
      ctx.restore();
    }
  };

  // Loop animado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ajusta tamanho
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Inicia
    init();
    let lastTime = 0;
    const interval = 1000 / fps;

    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        lastTime = time;
        update();
        render();
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => window.removeEventListener('resize', resize);
  }, [particleCount, fps]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${styles.field}`}
    />
  );
}