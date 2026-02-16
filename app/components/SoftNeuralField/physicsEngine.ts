import { Particle, ShadowParticle } from './types';

class SpatialHash {
  private cellSize: number = 50;
  private grid: Map<string, Particle[]> = new Map();
  
  clear(): void {
    this.grid.clear();
  }
  
  insert(particle: Particle): void {
    const cellX = Math.floor(particle.x / this.cellSize);
    const cellY = Math.floor(particle.y / this.cellSize);
    const key = `${cellX},${cellY}`;
    
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(particle);
  }
  
  getNearby(particle: Particle): Particle[] {
    const cellX = Math.floor(particle.x / this.cellSize);
    const cellY = Math.floor(particle.y / this.cellSize);
    const nearby: Particle[] = [];
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        const cell = this.grid.get(key);
        if (cell) nearby.push(...cell);
      }
    }
    
    return nearby;
  }
}

export const handleCollisions = (particles: Particle[]): void => {
  const spatialHash = new SpatialHash();
  
  for (const p of particles) {
    if (p.state === 'normal') {
      spatialHash.insert(p);
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
        const isVerticalCollision = Math.abs(p1.vy) > Math.abs(p1.vx) || Math.abs(p2.vy) > Math.abs(p2.vx);
        const p1FromTop = p1.y < p2.y && p1.vy > 0;
        const p2FromTop = p2.y < p1.y && p2.vy > 0;
        
        if (isVerticalCollision && (p1FromTop || p2FromTop)) {
          const particleFromTop = p1FromTop ? p1 : p2;
          const particleFromBottom = p1FromTop ? p2 : p1;
          
          triggerDisintegration(particleFromBottom);
        } else {
          resolveCollision(p1, p2, dx, dy, distance, minDist);
        }
      }
    }
  }
};

const triggerDisintegration = (particle: Particle): void => {
  particle.state = 'disintegrating';
  particle.disintegrationTimer = 3000;
  
  particle.originalVelocity = { vx: particle.vx, vy: particle.vy };
  
  particle.vx = 0;
  particle.vy = 0;
  
  particle.shadowParticles = [];
  const shadowCount = 20 + Math.floor(Math.random() * 15);
  
  for (let i = 0; i < shadowCount; i++) {
    const angle = (Math.PI * 2 * i) / shadowCount + Math.random() * 0.5;
    const speed = 1 + Math.random() * 3;
    
    particle.shadowParticles.push({
      x: particle.x,
      y: particle.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: particle.size * (0.1 + Math.random() * 0.3),
      alpha: 1,
      life: 1,
    });
  }
};

export const updateDisintegration = (particle: Particle, deltaTime: number): void => {
  if (particle.state === 'disintegrating') {
    particle.disintegrationTimer -= deltaTime;
    
    for (const shadow of particle.shadowParticles) {
      shadow.x += shadow.vx;
      shadow.y += shadow.vy;
      shadow.vx *= 0.98;
      shadow.vy *= 0.98;
      shadow.life -= 0.015;
      shadow.alpha = Math.max(0, shadow.life);
    }
    
    particle.shadowParticles = particle.shadowParticles.filter(s => s.life > 0);
    
    if (particle.disintegrationTimer <= 0) {
      particle.state = 'normal';
      
      particle.vx = -particle.originalVelocity.vx * 2;
      particle.vy = -particle.originalVelocity.vy * 2;
      
      const randomAngle = (Math.random() - 0.5) * Math.PI / 4;
      const speed = Math.hypot(particle.vx, particle.vy);
      const currentAngle = Math.atan2(particle.vy, particle.vx);
      const newAngle = currentAngle + randomAngle;
      
      particle.vx = Math.cos(newAngle) * speed;
      particle.vy = Math.sin(newAngle) * speed;
      
      particle.shadowParticles = [];
      particle.glitchOffset = 15;
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
  
  const overlap = minDist - distance;
  const separationX = (overlap / 2) * nx;
  const separationY = (overlap / 2) * ny;
  
  p1.x -= separationX;
  p1.y -= separationY;
  p2.x += separationX;
  p2.y += separationY;
  
  const dvx = p2.vx - p1.vx;
  const dvy = p2.vy - p1.vy;
  const dotProduct = dvx * nx + dvy * ny;
  
  if (dotProduct < 0) return;
  
  const totalMass = p1.mass + p2.mass;
  const impulse = (2 * dotProduct) / totalMass;
  const restitution = 0.8;
  
  p1.vx += impulse * p2.mass * nx * restitution;
  p1.vy += impulse * p2.mass * ny * restitution;
  p2.vx -= impulse * p1.mass * nx * restitution;
  p2.vy -= impulse * p1.mass * ny * restitution;
  
  const avgRotSpeed = (p1.rotationSpeed + p2.rotationSpeed) / 2;
  p1.rotationSpeed = avgRotSpeed + (Math.random() - 0.5) * 0.05;
  p2.rotationSpeed = avgRotSpeed + (Math.random() - 0.5) * 0.05;
};