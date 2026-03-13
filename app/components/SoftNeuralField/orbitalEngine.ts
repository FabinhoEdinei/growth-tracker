// orbitalEngine.ts
// Motor de órbita elíptica — rota invisível ao redor do header
// Completamente isolado das partículas normais

import { OrbitalParticle, OrbitalPayload, OrbitalDataType, ORBITAL_COLORS } from './orbitalTypes';
import { HeaderBounds } from './types';

// ─── Constantes da órbita ────────────────────────────────────────────
const BASE_RADIUS    = 160;   // px do centro do header
const RADIUS_SPREAD  = 30;    // variação entre partículas
const BASE_SPEED     = 0.006; // rad/frame (lento e suave)
const SPEED_SPREAD   = 0.003; // variação de velocidade
const HEX_SIZE       = 8;     // tamanho do hexágono
const HEX_ROT_SPEED  = 0.02;  // rotação do hexágono

// Offset de velocidade por tipo — todos os 8 tipos mapeados
const SPEED_OFFSET: Record<OrbitalDataType, number> = {
  agenda:   0,
  financas:  SPEED_SPREAD * 0.50,
  saude:    -SPEED_SPREAD * 0.30,
  meta:      SPEED_SPREAD * 1.00,
  etf:       SPEED_SPREAD * 0.25,   // ouro — gira devagar, majestoso
  blog:      SPEED_SPREAD * 0.75,   // ciano — um pouco mais rápido
  tv:       -SPEED_SPREAD * 0.50,   // roxo — sentido levemente oposto
  jornal:    SPEED_SPREAD * 0.10,   // âmbar — quase constante
};

// ─── Criação ─────────────────────────────────────────────────────────

export const createOrbitalParticle = (
  payload: OrbitalPayload,
  index: number,
  total: number
): OrbitalParticle => {
  const colors      = ORBITAL_COLORS[payload.type];
  const startAngle  = (Math.PI * 2 * index) / (total || 1);
  const speedOffset = SPEED_OFFSET[payload.type] ?? 0;

  return {
    id: `ORB-${payload.type.toUpperCase()}-${index}-${Date.now().toString(36)}`,
    angle:        startAngle,
    angularSpeed: BASE_SPEED + speedOffset,
    orbitRadius:  BASE_RADIUS + (index % 3) * (RADIUS_SPREAD / 3),
    orbitTilt:    0.35,
    x: 0,
    y: 0,
    size:          HEX_SIZE,
    rotation:      startAngle,
    rotationSpeed: HEX_ROT_SPEED,
    hue:           colors.hue,
    pulsePhase:    startAngle,
    payload,
    highlighted: false,
  };
};

// ─── Update ──────────────────────────────────────────────────────────

export const updateOrbital = (
  p: OrbitalParticle,
  headerBounds: HeaderBounds
): void => {
  const cx = headerBounds.x + headerBounds.width  / 2;
  const cy = headerBounds.y + headerBounds.height / 2;

  p.angle += p.angularSpeed;
  if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

  p.x = cx + p.orbitRadius * Math.cos(p.angle);
  p.y = cy + p.orbitRadius * p.orbitTilt * Math.sin(p.angle);

  p.rotation   += p.rotationSpeed;
  p.pulsePhase += 0.04;
};

// ─── Hit test ────────────────────────────────────────────────────────

export const orbitalHitTest = (
  particles: OrbitalParticle[],
  mx: number,
  my: number,
  radius = 20
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
