// orbitalEngine.ts
// Motor de órbita elíptica — rota invisível ao redor do header
// Completamente isolado das partículas normais

import { OrbitalParticle, OrbitalPayload, ORBITAL_COLORS } from './orbitalTypes';
import { HeaderBounds } from './types';

// ─── Constantes da órbita ────────────────────────────────────────────
const BASE_RADIUS    = 160;  // px do centro do header
const RADIUS_SPREAD  = 30;   // variação entre partículas
const BASE_SPEED     = 0.006; // rad/frame (lento e suave)
const SPEED_SPREAD   = 0.003; // variação de velocidade
const HEX_SIZE       = 8;    // tamanho do hexágono
const HEX_ROT_SPEED  = 0.02; // rotação do hexágono

// ─── Criação ─────────────────────────────────────────────────────────

export const createOrbitalParticle = (
  payload: OrbitalPayload,
  index: number,
  total: number
): OrbitalParticle => {
  const colors = ORBITAL_COLORS[payload.type];

  // Distribui ângulos uniformemente na órbita
  const startAngle = (Math.PI * 2 * index) / total;

  // Cada tipo tem velocidade ligeiramente diferente
  const speedOffset = {
    agenda:   0,
    financas: SPEED_SPREAD * 0.5,
    saude:   -SPEED_SPREAD * 0.3,
    meta:     SPEED_SPREAD,
  }[payload.type] ?? 0;

  return {
    id: `ORB-${payload.type.toUpperCase()}-${index}-${Date.now().toString(36)}`,
    angle: startAngle,
    angularSpeed: BASE_SPEED + speedOffset,
    orbitRadius: BASE_RADIUS + (index % 3) * (RADIUS_SPREAD / 3),
    orbitTilt: 0.35,        // elipse: 1 = círculo, <1 = oval
    x: 0,
    y: 0,
    size: HEX_SIZE,
    rotation: startAngle,
    rotationSpeed: HEX_ROT_SPEED,
    hue: colors.hue,
    pulsePhase: startAngle, // fase diferente para cada uma
    payload,
    highlighted: false,
  };
};

// ─── Update ──────────────────────────────────────────────────────────

export const updateOrbital = (
  p: OrbitalParticle,
  headerBounds: HeaderBounds
): void => {
  // Centro do header
  const cx = headerBounds.x + headerBounds.width  / 2;
  const cy = headerBounds.y + headerBounds.height / 2;

  // Avança na órbita
  p.angle += p.angularSpeed;
  if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

  // Posição elíptica:
  // x = cx + r * cos(angle)
  // y = cy + r * tilt * sin(angle)
  p.x = cx + p.orbitRadius * Math.cos(p.angle);
  p.y = cy + p.orbitRadius * p.orbitTilt * Math.sin(p.angle);

  // Rotação própria do hexágono
  p.rotation += p.rotationSpeed;

  // Fase de pulso
  p.pulsePhase += 0.04;
};

// ─── Hit test (clique) ───────────────────────────────────────────────

export const orbitalHitTest = (
  particles: OrbitalParticle[],
  mx: number,
  my: number,
  radius: number = 20
): OrbitalParticle | null => {
  let closest: OrbitalParticle | null = null;
  let minDist = Infinity;

  for (const p of particles) {
    const d = Math.hypot(p.x - mx, p.y - my);
    if (d < radius && d < minDist) {
      minDist = d;
      closest = p;
    }
  }
  return closest;
};
