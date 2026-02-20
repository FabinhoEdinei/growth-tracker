import { Particle, Lightning } from './types';
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, width, height);

    // Render lightnings
    lightningEffect.render(ctx);

    // Render particles
    for (const p of particles) {
      if (p.state === 'disintegrating') {
        this.renderDisintegration(ctx, p);
      } else {
        this.renderParticle(ctx, p);
      }
    }
  }

  private renderParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
    const color = `hsl(${p.hue}, 100%, 60%)`;
    const colorDark = `hsl(${p.hue}, 100%, 40%)`;

    // Trail
    if (p.trail.length > 0) {
      for (let i = 0; i < p.trail.length - 1; i++) {
        const t = p.trail[i];
        ctx.save();
        ctx.globalAlpha = t.alpha * 0.3;
        ctx.strokeStyle = color;
        ctx.lineWidth = p.size * 0.3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.moveTo(p.trail[i].x, p.trail[i].y);
        ctx.lineTo(p.trail[i + 1].x, p.trail[i + 1].y);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.save();

    // Glitch offset
    if (p.glitchOffset !== 0) {
      ctx.translate(p.glitchOffset, 0);
    }

    // Layer 1: Dark halo
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = colorDark;
    ctx.shadowBlur = 40;
    ctx.shadowColor = colorDark;
    drawShape(ctx, p.shape, p.x, p.y, p.size * 1.5, p.rotation, colorDark);

    // Layer 2: Bright neon
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    drawShape(ctx, p.shape, p.x, p.y, p.size, p.rotation, color);

    // Layer 3: White hot center
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    drawShape(ctx, p.shape, p.x, p.y, p.size * 0.4, p.rotation, '#ffffff');

    ctx.restore();
  }

  private renderDisintegration(ctx: CanvasRenderingContext2D, p: Particle): void {
    const progress = 1 - p.life;
    const color = `hsl(${p.hue}, 100%, 60%)`;

    // Render shadow particles
    for (const sp of p.shadowParticles) {
      ctx.save();
      ctx.globalAlpha = (1 - progress) * 0.6;
      ctx.fillStyle = color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;

      // ✅ FIX: Adicionar argumento 'color' (7º parâmetro)
      drawShape(ctx, p.shape, sp.x, sp.y, sp.size * (1 - progress), sp.rotation, color);
      ctx.restore();
    }

    // Render original particle fading
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.fillStyle = color;

    // ✅ FIX: Adicionar argumento 'color' (7º parâmetro)
    drawShape(ctx, p.shape, p.x, p.y, p.size * (1 - progress), p.rotation, color);
    ctx.restore();
  }
}