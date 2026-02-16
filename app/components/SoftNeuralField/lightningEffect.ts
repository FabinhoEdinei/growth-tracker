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

    this.headerGlow = Math.min(1, this.headerGlow + 0.4);
  }

  private generateLightningPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const segments = 8 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      
      const offset = (Math.random() - 0.5) * 20 * (1 - Math.abs(t - 0.5) * 2);
      const perpX = -(y2 - y1);
      const perpY = (x2 - x1);
      const length = Math.hypot(perpX, perpY);
      
      points.push({
        x: x + (perpX / length) * offset,
        y: y + (perpY / length) * offset,
      });
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
      
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ffff';
      
      ctx.beginPath();
      lightning.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#ff00ff';
      
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