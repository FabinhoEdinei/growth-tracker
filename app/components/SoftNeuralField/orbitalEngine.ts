// orbitalEngine.ts
// Motor de órbita elíptica — rota invisível ao redor do header
// Completamente isolado das partículas normais

import { OrbitalParticle, OrbitalPayload, OrbitalDataType, ORBITAL_COLORS } from './orbitalTypes';
import { HeaderBounds } from './types';

// ─── Constantes da órbita (melhoradas) ───────────────────────────────
const BASE_RADIUS    = 180;   // px do centro do header (aumentado)
const RADIUS_SPREAD  = 45;    // variação entre partículas (mais espaçamento)
const BASE_SPEED     = 0.005; // rad/frame (um pouco mais lento para suavidade)
const SPEED_SPREAD   = 0.004; // variação de velocidade (mais dinâmico)
const HEX_SIZE       = 12;    // tamanho do hexágono (aumentado para visibilidade)
const HEX_ROT_SPEED  = 0.015; // rotação mais suave

// Offset de velocidade por tipo — todos os 8 tipos mapeados
// Ajustado para movimento mais orgânico e variado
const SPEED_OFFSET: Record<OrbitalDataType, number> = {
  agenda:    SPEED_SPREAD * 0.15,    // naves - movimento moderado
  financas:  SPEED_SPREAD * 0.65,    // naves - dinâmico
  saude:    -SPEED_SPREAD * 0.20,    // planetas - rotação inversa suave
  meta:      SPEED_SPREAD * 0.85,    // naves - mais rápido (ambição)
  etf:       SPEED_SPREAD * 0.10,    // planetas - majestoso e lento
  blog:     -SPEED_SPREAD * 0.35,    // planetas - rotação inversa
  tv:        SPEED_SPREAD * 0.55,    // naves - broadcast dinâmico
  jornal:   -SPEED_SPREAD * 0.15,    // planetas - constante
};

// ─── Criação ─────────────────────────────────────────────────────────

// Tipos que renderizam como planetas (outros como naves)
const PLANET_TYPES: OrbitalDataType[] = ['saude', 'etf', 'blog', 'jornal'];

export const createOrbitalParticle = (
  payload: OrbitalPayload,
  index: number,
  total: number
): OrbitalParticle => {
  const colors      = ORBITAL_COLORS[payload.type];
  const startAngle  = (Math.PI * 2 * index) / (total || 1);
  const speedOffset = SPEED_OFFSET[payload.type] ?? 0;
  const isPlanet    = PLANET_TYPES.includes(payload.type);

  // Variação de raio baseada no tipo (planetas um pouco mais distantes)
  const radiusVariation = isPlanet 
    ? RADIUS_SPREAD * 0.8 
    : RADIUS_SPREAD * ((index % 4) / 4);
  
  // Tamanho ligeiramente maior para planetas
  const sizeMultiplier = isPlanet ? 1.15 : 1.0;

  // Inclinação orbital variada para efeito 3D
  const tiltVariation = 0.3 + (index % 5) * 0.08;

  return {
    id: `ORB-${payload.type.toUpperCase()}-${index}-${Date.now().toString(36)}`,
    angle:        startAngle + (Math.random() * 0.3), // Pequena variação inicial
    angularSpeed: BASE_SPEED + speedOffset + (Math.random() * 0.001), // Micro-variação
    orbitRadius:  BASE_RADIUS + radiusVariation,
    orbitTilt:    tiltVariation,
    x: 0,
    y: 0,
    size:          HEX_SIZE * sizeMultiplier,
    rotation:      startAngle,
    rotationSpeed: isPlanet ? HEX_ROT_SPEED * 0.5 : HEX_ROT_SPEED, // Planetas giram mais devagar
    hue:           colors.hue,
    pulsePhase:    startAngle + (index * 0.5), // Defasagem no pulso
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
