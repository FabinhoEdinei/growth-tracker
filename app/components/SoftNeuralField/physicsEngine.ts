import { Particle, ShadowParticle } from './types';

const CELL_SIZE = 50;

class SpatialHash {
  private grid: Map<string, Particle[]> = new Map();

  clear(): void {
    this.grid.clear();
  }

  insert(particle: Particle): void {
    const cellX = Math.floor(particle.x / CELL_SIZE);
    const cellY = Math.floor(particle.y / CELL_SIZE);
    const key = `${cellX},${cellY}`;

    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(particle);
  }

  getNearby(particle: Particle): Particle[] {
    const cellX = Math.floor(particle.x / CELL_SIZE);
    const cellY = Math.floor(particle.y / CELL_SIZE);
    const nearby: Particle[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        if (this.grid.has(key)) {
          nearby.push(...this.grid.get(key)!);
        }
      }
    }

    return nearby;
  }
}

const spatialHash = new SpatialHash();

export const handleCollisions = (particles: Particle[]): void => {
  spatialHash.clear();
  
  for (const particle of particles) {
    if (particle.state === 'normal') {
      spatialHash.insert(particle);
    }
  }

  const checked = new Set<string>();

  for (const p1 of particles) {
    if (p1.state !== 'normal') continue;

    const nearby = spatialHash.getNearby(p1);

    for (const p2 of nearby) {
      if (p1 === p2 || p2.state !== 'normal') continue;

      const pairKey = p1.data.id < p2.data.id 
        ? `${p1.data.id}-${p2.data.id}`
        : `${p2.data.id}-${p1.data.id}`;

      if (checked.has(pairKey)) continue;
      checked.add(pairKey);

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.hypot(dx, dy);
      const minDist = p1.size + p2.size;

      if (distance < minDist && distance > 0) {
        const isVerticalCollision = Math.abs(p1.vy) > Math.abs(p1.vx) * 1.5 &&
                                   p1.y < p2.y;

        if (isVerticalCollision && p1.state === 'normal' && p2.state === 'normal') {
          p2.state = 'disintegrating';
          p2.disintegrationTimer = 0;
          p2.originalVelocity = { vx: p2.vx, vy: p2.vy };
          p2.shadowParticles = [];
        } else {
          resolveCollision(p1, p2, dx, dy, distance, minDist);
        }
      }
    }
  }
};

const resolveCollision = (
  p1: Particle,
  p2: Particle,
  dx: number,
  dy: number,
  distance: number,
  minDist: number
): void => {
  const nx = dx / distance;
  const ny = dy / distance;

  const dvx = p2.vx - p1.vx;
  const dvy = p2.vy - p1.vy;
  const dotProduct = dvx * nx + dvy * ny;

  if (dotProduct > 0) return;

  const restitution = 0.8;
  const impulse = (2 * dotProduct) / (p1.mass + p2.mass);

  p1.vx += impulse * p2.mass * nx * restitution;
  p1.vy += impulse * p2.mass * ny * restitution;
  p2.vx -= impulse * p1.mass * nx * restitution;
  p2.vy -= impulse * p1.mass * ny * restitution;

  const overlap = minDist - distance;
  const separationX = (overlap / 2) * nx;
  const separationY = (overlap / 2) * ny;

  p1.x -= separationX;
  p1.y -= separationY;
  p2.x += separationX;
  p2.y += separationY;
};

export const updateDisintegration = (particle: Particle, deltaTime: number): void => {
  if (particle.state !== 'disintegrating') return;

  particle.disintegrationTimer += deltaTime;

  if (particle.disintegrationTimer < 3000) {
    // Create shadow particles if not exist
    if (particle.shadowParticles.length === 0) {
      const numShadows = 20 + Math.floor(Math.random() * 15);
      for (let i = 0; i < numShadows; i++) {
        const angle = (Math.PI * 2 * i) / numShadows;
        const speed = 0.5 + Math.random() * 1.5;
        particle.shadowParticles.push({
          x: particle.x,
          y: particle.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: particle.size * (0.3 + Math.random() * 0.4),
          rotation: Math.random() * Math.PI * 2,
          alpha: 1,
          life: 1,
        });
      }
    }

    // Update shadow particles
    for (const shadow of particle.shadowParticles) {
      shadow.x += shadow.vx;
      shadow.y += shadow.vy;
      shadow.vx *= 0.98;
      shadow.vy *= 0.98;
      shadow.rotation += 0.05;
      shadow.alpha = Math.max(0, shadow.life);
      shadow.life -= 0.015;
    }

    // Remove dead shadow particles
    particle.shadowParticles = particle.shadowParticles.filter(s => s.life > 0);

    // Fade out
    particle.life = 1 - (particle.disintegrationTimer / 3000);
  } else {
    // Reintegration phase
    const reintegrationProgress = (particle.disintegrationTimer - 3000) / 1500;
    
    if (reintegrationProgress >= 1) {
      // Complete reintegration
      particle.state = 'normal';
      particle.disintegrationTimer = 0;
      particle.shadowParticles = [];
      particle.life = 1;
      
      // Reverse direction with 2x speed
      particle.vx = -particle.originalVelocity.vx * 2;
      particle.vy = -particle.originalVelocity.vy * 2;
    } else {
      // Pull shadow particles back
      for (const shadow of particle.shadowParticles) {
        const dx = particle.x - shadow.x;
        const dy = particle.y - shadow.y;
        shadow.vx += dx * 0.02;
        shadow.vy += dy * 0.02;
        shadow.x += shadow.vx;
        shadow.y += shadow.vy;
        shadow.rotation += 0.1;
      }
      
      particle.life = reintegrationProgress;
    }
  }
};