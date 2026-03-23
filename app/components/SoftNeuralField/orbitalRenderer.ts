// orbitalRenderer.ts
// Renderiza os hexágonos orbitais — visualmente distintos das partículas normais
// Versão melhorada com planetas e naves mais detalhados

import { OrbitalParticle, ORBITAL_COLORS, OrbitalDataType } from './orbitalTypes';
import { alienShips, alienPlanets } from './alienShips';

// ─── Cache para SVGs ─────────────────────────────────────────────────
const svgCache = new Map<string, HTMLImageElement>();

function svgToDataURL(svg: string, color: string): string {
  const coloredSVG = svg.replace(/currentColor/g, color);
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(coloredSVG)));
}

function getCachedImage(key: string, svg: string, color: string): HTMLImageElement | null {
  const cacheKey = `${key}-${color}`;
  if (!svgCache.has(cacheKey)) {
    const img = new Image();
    img.src = svgToDataURL(svg, color);
    svgCache.set(cacheKey, img);
  }
  const img = svgCache.get(cacheKey);
  return img && img.complete ? img : null;
}

// ─── Hexágono (fallback) ─────────────────────────────────────────────

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

// ─── Mapeamento de tipo para visual ──────────────────────────────────

type ShipName = keyof typeof alienShips;
type PlanetName = keyof typeof alienPlanets;

const TYPE_TO_SHIP: Partial<Record<OrbitalDataType, ShipName>> = {
  agenda:   'heartOfGold',
  financas: 'magrathea',
  meta:     'zaphod',
  tv:       'slartibartfast',
};

const TYPE_TO_PLANET: Partial<Record<OrbitalDataType, PlanetName>> = {
  saude:  'terra',
  etf:    'gasGiant',
  blog:   'crystal',
  jornal: 'oceanic',
};

// ─── Render individual ───────────────────────────────────────────────

export const renderOrbitalParticle = (
  ctx: CanvasRenderingContext2D,
  p: OrbitalParticle
): void => {
  const { primary, glow } = ORBITAL_COLORS[p.payload.type];

  // Pulso de tamanho suave
  const pulse = 1 + Math.sin(p.pulsePhase) * 0.15;
  const baseSize = p.size * 1.8; // Aumentado para melhor visibilidade
  const size = baseSize * pulse;

  ctx.save();

  // ── Aura externa (glow atmosférico) ──
  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
  gradient.addColorStop(0, glow);
  gradient.addColorStop(0.5, glow.replace('0.6', '0.2').replace('0.65', '0.2').replace('0.7', '0.2'));
  gradient.addColorStop(1, 'transparent');
  
  ctx.globalAlpha = p.highlighted ? 0.6 : 0.35;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
  ctx.fill();

  // ── Trilha orbital (rastro de luz) ──
  if (p.highlighted) {
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = glow;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const trailAngle = p.angle - (i * 0.05);
      const trailX = p.x + Math.cos(trailAngle) * (i * 2);
      const trailY = p.y + Math.sin(trailAngle) * (i * 1.5);
      if (i === 0) ctx.moveTo(trailX, trailY);
      else ctx.lineTo(trailX, trailY);
    }
    ctx.stroke();
  }

  // ── Determinar se é nave ou planeta ──
  const shipName = TYPE_TO_SHIP[p.payload.type];
  const planetName = TYPE_TO_PLANET[p.payload.type];
  
  let rendered = false;

  if (shipName) {
    // Renderizar nave espacial
    const img = getCachedImage(`ship-${shipName}`, alienShips[shipName], primary);
    if (img) {
      ctx.globalAlpha = p.highlighted ? 1 : 0.85;
      ctx.shadowBlur = p.highlighted ? 25 : 15;
      ctx.shadowColor = glow;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.drawImage(img, -size, -size, size * 2, size * 2);
      rendered = true;
    }
  } else if (planetName) {
    // Renderizar planeta
    const img = getCachedImage(`planet-${planetName}`, alienPlanets[planetName], primary);
    if (img) {
      ctx.globalAlpha = p.highlighted ? 1 : 0.85;
      ctx.shadowBlur = p.highlighted ? 30 : 18;
      ctx.shadowColor = glow;
      // Planetas não rotacionam tão rápido
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * 0.3);
      ctx.drawImage(img, -size, -size, size * 2, size * 2);
      rendered = true;
    }
  }

  ctx.restore();

  // ── Fallback para hexágono se SVG não carregar ──
  if (!rendered) {
    ctx.save();
    
    // Halo exterior
    ctx.globalAlpha = p.highlighted ? 0.25 : 0.12;
    ctx.shadowBlur = 30;
    ctx.shadowColor = glow;
    ctx.fillStyle = glow;
    drawHexagon(ctx, p.x, p.y, size * 2.5, p.rotation);
    ctx.fill();

    // Borda hexagonal
    ctx.globalAlpha = p.highlighted ? 0.9 : 0.7;
    ctx.strokeStyle = primary;
    ctx.lineWidth = p.highlighted ? 2.5 : 1.8;
    ctx.shadowBlur = p.highlighted ? 22 : 14;
    ctx.shadowColor = primary;
    drawHexagon(ctx, p.x, p.y, size, p.rotation);
    ctx.stroke();

    // Núcleo preenchido
    ctx.globalAlpha = p.highlighted ? 0.55 : 0.3;
    ctx.fillStyle = primary;
    ctx.shadowBlur = 10;
    drawHexagon(ctx, p.x, p.y, size * 0.55, p.rotation);
    ctx.fill();

    // Ícone de tipo (centro)
    const icons: Record<string, string> = {
      agenda:   '◈',
      financas: '◆',
      saude:    '✦',
      meta:     '★',
      etf:      '◉',
      blog:     '◇',
      tv:       '◎',
      jornal:   '◐',
    };
    ctx.globalAlpha = p.highlighted ? 0.95 : 0.75;
    ctx.fillStyle = primary;
    ctx.font = `bold ${size * 0.9}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 8;
    ctx.fillText(icons[p.payload.type] || '○', p.x, p.y);

    ctx.restore();
  }

  // ── Indicador de highlight (anel externo pulsante) ──
  if (p.highlighted) {
    ctx.save();
    const ringPulse = 1 + Math.sin(p.pulsePhase * 2) * 0.1;
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = primary;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = glow;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, size * 2.2 * ringPulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
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
