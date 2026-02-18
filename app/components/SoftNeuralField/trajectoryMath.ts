// trajectoryMath.ts
// Matemática que governa e "prospera" as partículas

import { TrajectoryPoint, ParticleMemory } from './particleData';

const MAX_TRAJECTORY = 60; // Guarda últimos 60 pontos

// Grava posição na trajetória
export const recordPosition = (
  memory: ParticleMemory,
  x: number, y: number,
  vx: number, vy: number
): void => {
  const last = memory.trajectory[memory.trajectory.length - 1];

  // Calcula distância percorrida desde último ponto
  if (last) {
    const dx = x - last.x;
    const dy = y - last.y;
    memory.distanceTraveled += Math.hypot(dx, dy);
  }

  memory.trajectory.push({ x, y, t: Date.now(), vx, vy });

  // Mantém tamanho máximo (circular buffer)
  if (memory.trajectory.length > MAX_TRAJECTORY) {
    memory.trajectory.shift();
  }

  // Atualiza energia cinética: E = ½mv²
  const speed = Math.hypot(vx, vy);
  memory.energy = 0.5 * speed * speed;
  memory.age++;
};

// Calcula vetor de tendência (para onde a partícula "quer" ir)
export const getTrendVector = (
  trajectory: TrajectoryPoint[]
): { dx: number; dy: number } => {
  if (trajectory.length < 2) return { dx: 0, dy: 0 };

  const recent = trajectory.slice(-10);
  let dx = 0, dy = 0;

  for (let i = 1; i < recent.length; i++) {
    dx += recent[i].x - recent[i - 1].x;
    dy += recent[i].y - recent[i - 1].y;
  }

  const n = recent.length - 1;
  return { dx: dx / n, dy: dy / n };
};

// Score de "prosperidade" da partícula (0-100)
// Baseado em: velocidade, colisões, distância, zonas visitadas
export const getProsperityScore = (memory: ParticleMemory): number => {
  const speedScore    = Math.min(memory.energy * 20, 30);       // max 30pts
  const distanceScore = Math.min(memory.distanceTraveled / 50, 30); // max 30pts
  const zoneScore     = Math.min(memory.zonesVisited.size * 10, 20); // max 20pts
  const collisionScore = Math.min(memory.collisions * 5, 20);   // max 20pts

  return Math.floor(speedScore + distanceScore + zoneScore + collisionScore);
};

// Prevê próxima posição usando média das últimas velocidades
export const predictNextPosition = (
  trajectory: TrajectoryPoint[],
  steps: number = 5
): { x: number; y: number } | null => {
  if (trajectory.length < 3) return null;

  const recent = trajectory.slice(-5);
  const avgVx = recent.reduce((s, p) => s + p.vx, 0) / recent.length;
  const avgVy = recent.reduce((s, p) => s + p.vy, 0) / recent.length;
  const last = recent[recent.length - 1];

  return {
    x: last.x + avgVx * steps,
    y: last.y + avgVy * steps,
  };
};

// Calcula "massa de dados" — quanto a partícula carrega
export const getDataMass = (memory: ParticleMemory): number => {
  const base = 1;
  const payloadWeight =
    memory.payload.type === 'vazio' ? 0 :
    memory.payload.type === 'agenda' ? 1.2 :
    memory.payload.type === 'financas' ? 1.5 :
    memory.payload.type === 'saude' ? 1.3 : 1.1;

  return base * payloadWeight;
};
