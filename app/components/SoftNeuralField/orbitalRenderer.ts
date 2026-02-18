// orbitalRenderer.ts
// Renderiza os hexágonos orbitais — visualmente distintos das partículas normais

import { OrbitalParticle, ORBITAL_COLORS } from './orbitalTypes';

// ─── Hexágono ────────────────────────────────────────────────────────

const drawHexagon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
): void => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + rotation;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else         ctx.lineTo(px, py);
  }
  ctx.closePath();
};

// ─── Render individual ───────────────────────────────────────────────

export const renderOrbitalParticle = (
  ctx: CanvasRenderingContext2D,
  p: OrbitalParticle
): void => {
  const { primary, glow } = ORBITAL_COLORS[p.payload.type];

  // Pulso de tamanho suave
  const pulse = 1 + Math.sin(p.pulsePhase) * 0.12;
  const size  = p.size * pulse;

  ctx.save();

  // ── Halo exterior (glow orbital) ──
  ctx.globalAlpha = p.highlighted ? 0.25 : 0.1;
  ctx.shadowBlur  = 30;
  ctx.shadowColor = glow;
  ctx.fillStyle   = glow;
  drawHexagon(ctx, p.x, p.y, size * 2.5, p.rotation);
  ctx.fill();

  // ── Borda hexagonal ──
  ctx.globalAlpha = p.highlighted ? 0.9 : 0.65;
  ctx.strokeStyle = primary;
  ctx.lineWidth   = p.highlighted ? 2 : 1.5;
  ctx.shadowBlur  = p.highlighted ? 20 : 12;
  ctx.shadowColor = primary;
  ctx.fillStyle   = 'transparent';
  drawHexagon(ctx, p.x, p.y, size, p.rotation);
  ctx.stroke();

  // ── Núcleo preenchido ──
  ctx.globalAlpha = p.highlighted ? 0.5 : 0.25;
  ctx.fillStyle   = primary;
  ctx.shadowBlur  = 8;
  drawHexagon(ctx, p.x, p.y, size * 0.5, p.rotation);
  ctx.fill();

  // ── Ícone de tipo (centro) ──
  const icons: Record<string, string> = {
    agenda:   '◈',
    financas: '◆',
    saude:    '✦',
    meta:     '★',
  };
  ctx.globalAlpha  = p.highlighted ? 0.95 : 0.7;
  ctx.fillStyle    = primary;
  ctx.font         = `${size * 0.85}px monospace`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur   = 6;
  ctx.fillText(icons[p.payload.type] || '○', p.x, p.y);

  ctx.restore();
};

// ─── Render de todos ─────────────────────────────────────────────────

export const renderAllOrbitals = (
  ctx: CanvasRenderingContext2D,
  particles: OrbitalParticle[]
): void => {
  // Ordena: highlighted por último (acima de tudo)
  const sorted = [...particles].sort((a, b) =>
    Number(a.highlighted) - Number(b.highlighted)
  );
  for (const p of sorted) {
    renderOrbitalParticle(ctx, p);
  }
};

// ─── Rota invisível (debug opcional) ─────────────────────────────────
// Chame apenas em dev se quiser ver a elipse

export const renderOrbitPath = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  tilt: number
): void => {
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth   = 1;
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2; a += 0.05) {
    const x = cx + radius * Math.cos(a);
    const y = cy + radius * tilt * Math.sin(a);
    if (a === 0) ctx.moveTo(x, y);
    else         ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
};
