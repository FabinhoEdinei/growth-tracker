import { Lightning, Particle, HeaderBounds } from './types';

export class LightningEffect {
  private lightnings: Lightning[] = [];
  private headerGlow: number = 0;

  createLightning(particle: Particle, headerBounds: HeaderBounds): void {
    const centerX = headerBounds.x + headerBounds.width / 2;
    const centerY = headerBounds.y + headerBounds.height / 2;
    
    const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
    const startX = centerX + Math.cos(angle) * (headerBounds.width / 2);
    const startY = centerY + Math.sin(angle) * (headerBounds.height / 2);

    const points = this.generateLightningPath(
      startX,
      startY,
      particle.x,
      particle.y
    );

    this.lightnings.push({
      startX,
      startY,
      endX: particle.x,
      endY: particle.y,
      points,
      alpha: 1,
      life: 1,
    });

    this.headerGlow = Math.min(1, this.headerGlow + 0.3);
  }

  private generateLightningPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const distance = Math.hypot(x2 - x1, y2 - y1);
    
    // Mais segmentos = mais dobras (aumentado de 8-14 para 15-25)
    const segments = 15 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let x = x1 + (x2 - x1) * t;
      let y = y1 + (y2 - y1) * t;
      
      // Offset mais agressivo (aumentado de 20 para 40)
      const offsetIntensity = 40 * (1 - Math.abs(t - 0.5) * 2);
      
      // Adiciona zigzag perpendicular
      const perpX = -(y2 - y1);
      const perpY = (x2 - x1);
      const length = Math.hypot(perpX, perpY);
      
      // Offset principal
      const mainOffset = (Math.random() - 0.5) * offsetIntensity;
      
      // Adiciona sub-branches (ramificações)
      if (i % 3 === 0 && Math.random() > 0.5) {
        const branchOffset = (Math.random() - 0.5) * offsetIntensity * 1.5;
        x += (perpX / length) * branchOffset;
        y += (perpY / length) * branchOffset;
      } else {
        x += (perpX / length) * mainOffset;
        y += (perpY / length) * mainOffset;
      }
      
      points.push({ x, y });
    }
    
    return points;
  }

  update(): void {
    for (const lightning of this.lightnings) {
      lightning.life -= 0.08;
      lightning.alpha = Math.max(0, lightning.life);
    }

    this.lightnings = this.lightnings.filter(l => l.life > 0);

    this.headerGlow *= 0.92;
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const lightning of this.lightnings) {
      if (lightning.alpha <= 0) continue;

      ctx.save();
      ctx.globalAlpha = lightning.alpha;
      
      // Raio principal (cyan) - mais grosso
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00ffff';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      lightning.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Raio secundário (magenta)
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff00ff';
      
      ctx.beginPath();
      lightning.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Core brilhante (branco)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      
      ctx.beginPath();
      lightning.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      ctx.restore();
    }
  }

  getHeaderGlow(): number {
    return this.headerGlow;
  }

  getLightnings(): Lightning[] {
    return this.lightnings;
  }
}