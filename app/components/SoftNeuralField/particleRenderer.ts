import { Particle } from './types';
import { drawShape } from './shapeRenderer';
import { LightningEffect } from './lightningEffect';

export class ParticleRenderer {
  render(
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    width: number,
    height: number,
    lightningEffect: LightningEffect
  ): void {
    // Motion blur
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, width, height);

    // Renderiza raios primeiro (atrás das partículas)
    lightningEffect.render(ctx);

    for (const p of particles) {
      if (p.state === 'disintegrating') {
        this.renderDisintegrating(ctx, p);
      } else {
        this.renderParticle(ctx, p);
      }
    }
  }

  private renderDisintegrating(ctx: CanvasRenderingContext2D, p: Particle): void {
    const progress = 1 - (p.disintegrationTimer / 3000);
    
    for (const shadow of p.shadowParticles) {
      ctx.save();
      ctx.globalAlpha = shadow.alpha * 0.7;
      
      const color = `hsl(${p.hue}, 100%, 50%)`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      
      ctx.beginPath();
      ctx.arc(shadow.x, shadow.y, shadow.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    if (progress < 0.5) {
      ctx.save();
      const pulseAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
      ctx.globalAlpha = pulseAlpha;
      
      const color = `hsl(${p.hue}, 100%, 50%)`;
      ctx.shadowBlur = 40;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      
      drawShape(ctx, p.shape, p.x, p.y, p.size * (1 - progress), p.rotation);
      ctx.restore();
    }
  }

  private renderParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
    const alpha = 0.7 * p.life;
    if (alpha <= 0) return;

    const color = `hsl(${p.hue}, 100%, 50%)`;
    const colorDark = `hsl(${p.hue}, 90%, 35%)`;

    this.renderTrail(ctx, p, alpha, colorDark);

    if (Math.abs(p.glitchOffset) > 0.5) {
      this.renderGlitch(ctx, p, alpha);
    }

    this.renderMainParticle(ctx, p, alpha, color, colorDark);
  }

  private renderTrail(ctx: CanvasRenderingContext2D, p: Particle, alpha: number, colorDark: string): void {
    for (let i = 0; i < p.trail.length; i++) {
      const t = p.trail[i];
      const trailSize = p.size * (0.2 + (i / p.trail.length) * 0.8);
      
      ctx.save();
      ctx.globalAlpha = t.alpha * alpha * 0.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = colorDark;
      ctx.fillStyle = colorDark;
      drawShape(ctx, p.shape, t.x, t.y, trailSize * 0.5, p.rotation);
      ctx.restore();
    }
  }

  private renderGlitch(ctx: CanvasRenderingContext2D, p: Particle, alpha: number): void {
    ctx.save();
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = '#ff0066';
    drawShape(ctx, p.shape, p.x + p.glitchOffset, p.y, p.size, p.rotation);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = '#00ffff';
    drawShape(ctx, p.shape, p.x - p.glitchOffset, p.y, p.size, p.rotation);
    ctx.restore();
  }

  private renderMainParticle(
    ctx: CanvasRenderingContext2D,
    p: Particle,
    alpha: number,
    color: string,
    colorDark: string
  ): void {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    ctx.shadowBlur = 40;
    ctx.shadowColor = color;
    ctx.fillStyle = colorDark;
    drawShape(ctx, p.shape, p.x, p.y, p.size, p.rotation);
    
    ctx.shadowBlur = 20;
    ctx.fillStyle = color;
    drawShape(ctx, p.shape, p.x, p.y, p.size * 0.5, p.rotation);
    
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    drawShape(ctx, p.shape, p.x, p.y, p.size * 0.2, p.rotation);
    
    ctx.restore();
  }
}