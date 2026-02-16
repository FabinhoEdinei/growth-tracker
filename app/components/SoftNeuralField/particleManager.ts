import { Particle, Zone, HeaderBounds } from './types';
import { cyberpunkHues, shapes, generateParticleData, getZoneFromPosition, zoneColors } from './particleUtils';
import { handleCollisions, updateDisintegration } from './physicsEngine';
import { LightningEffect } from './lightningEffect';

type DeviceTier = 'low' | 'medium' | 'high';

export class ParticleManager {
  private particles: Particle[] = [];
  private canvasWidth: number = 0;
  private lastUpdateTime: number = 0;
  private lightningEffect: LightningEffect = new LightningEffect();
  private deviceTier: DeviceTier = 'medium';

  private detectDeviceTier(): DeviceTier {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile || cores <= 2 || memory <= 2) return 'low';
    if (cores <= 4 || memory <= 4) return 'medium';
    return 'high';
  }

  initialize(count: number, width: number, height: number): void {
    this.canvasWidth = width;
    this.lastUpdateTime = Date.now();
    this.deviceTier = this.detectDeviceTier();
    
    const adjustedCount = Math.min(
      count,
      this.deviceTier === 'low' ? 20 :
      this.deviceTier === 'medium' ? 35 : 50
    );
    
    console.log(`Device Tier: ${this.deviceTier}, Particles: ${adjustedCount}`);
    
    this.particles = Array.from({ length: adjustedCount }, () => {
      const size = 4 + Math.random() * 4;
      const x = Math.random() * width;
      const currentZone = getZoneFromPosition(x, width);
      
      return {
        x,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2.0,
        vy: (Math.random() - 0.5) * 2.0,
        size: size,
        hue: cyberpunkHues[Math.floor(Math.random() * cyberpunkHues.length)],
        life: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        trail: [],
        glitchOffset: 0,
        mass: size * size,
        data: generateParticleData(),
        currentZone: currentZone,
        state: 'normal',
        disintegrationTimer: 0,
        shadowParticles: [],
        originalVelocity: { vx: 0, vy: 0 },
        attractionForce: { x: 0, y: 0 },
      };
    });
  }

  update(width: number, height: number, headerBounds: HeaderBounds | null): void {
    this.canvasWidth = width;
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;
    
    for (const p of this.particles) {
      this.updateParticle(p, width, height, deltaTime, headerBounds);
    }
    
    handleCollisions(this.particles);
    this.lightningEffect.update();
  }

  private updateParticle(
    p: Particle,
    width: number,
    height: number,
    deltaTime: number,
    headerBounds: HeaderBounds | null
  ): void {
    if (p.state === 'disintegrating') {
      updateDisintegration(p, deltaTime);
      return;
    }

    if (headerBounds && p.state === 'normal') {
      const centerX = headerBounds.x + headerBounds.width / 2;
      const centerY = headerBounds.y + headerBounds.height / 2;
      const dx = centerX - p.x;
      const dy = centerY - p.y;
      const distance = Math.hypot(dx, dy);
      
      const attractionRadius = this.deviceTier === 'low' ? 150 : 200;
      
      if (distance < attractionRadius) {
        const attractionStrength = 0.15 * (1 - distance / attractionRadius);
        const angle = Math.atan2(dy, dx);
        
        p.attractionForce.x = Math.cos(angle) * attractionStrength;
        p.attractionForce.y = Math.sin(angle) * attractionStrength;
        
        const lightningChance = this.deviceTier === 'low' ? 0.02 : 0.05;
        
        if (distance < 100 && Math.random() < lightningChance) {
          this.lightningEffect.createLightning(p, headerBounds);
          p.state = 'attracted';
          
          p.vx = dx / distance * 5;
          p.vy = dy / distance * 5;
        }
      } else {
        p.attractionForce.x *= 0.9;
        p.attractionForce.y *= 0.9;
      }

      if (p.state === 'attracted' && distance < 30) {
        p.life = 0;
      }
    }
    
    if (p.state === 'normal') {
      p.trail.push({ x: p.x, y: p.y, alpha: 1 });
      
      const maxTrail = this.deviceTier === 'low' ? 10 : 20;
      if (p.trail.length > maxTrail) p.trail.shift();
      
      p.trail.forEach((t, i) => {
        t.alpha = Math.pow((i + 1) / p.trail.length, 2) * 0.8;
      });
    }

    p.vx += p.attractionForce.x;
    p.vy += p.attractionForce.y;
    
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;

    const newZone = getZoneFromPosition(p.x, width);
    if (newZone !== p.currentZone) {
      p.currentZone = newZone;
      this.transitionZoneColor(p, newZone);
    }

    if (Math.random() < 0.02) {
      p.glitchOffset = (Math.random() - 0.5) * 10;
    } else {
      p.glitchOffset *= 0.8;
    }

    p.vx += (Math.random() - 0.5) * 0.04;
    p.vy += (Math.random() - 0.5) * 0.04;

    const maxSpeed = 2.2;
    const speed = Math.hypot(p.vx, p.vy);
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed;
      p.vy = (p.vy / speed) * maxSpeed;
    }

    if (p.x < -30) p.x = width + 30;
    if (p.x > width + 30) p.x = -30;
    if (p.y < -30) p.y = height + 30;
    if (p.y > height + 30) p.y = -30;

    p.life -= 0.0005;
    if (p.life <= 0) {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.life = 1;
      p.trail = [];
      p.hue = cyberpunkHues[Math.floor(Math.random() * cyberpunkHues.length)];
      p.data = generateParticleData();
      p.currentZone = getZoneFromPosition(p.x, width);
      p.state = 'normal';
      p.attractionForce = { x: 0, y: 0 };
    }
  }

  private transitionZoneColor(p: Particle, zone: Zone): void {
    const colors = zoneColors[zone];
    const targetHue = colors[Math.floor(Math.random() * colors.length)];
    const hueDiff = targetHue - p.hue;
    p.hue += hueDiff * 0.3;
  }

  findClosestParticle(x: number, y: number, maxDistance: number = 50): Particle | null {
    let closestParticle: Particle | null = null;
    let minDistance = Infinity;

    for (const p of this.particles) {
      if (p.state !== 'normal') continue;
      
      const distance = Math.hypot(p.x - x, p.y - y);
      if (distance < minDistance && distance < maxDistance) {
        minDistance = distance;
        closestParticle = p;
      }
    }

    return closestParticle;
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  getLightningEffect(): LightningEffect {
    return this.lightningEffect;
  }
  
  getDeviceTier(): DeviceTier {
    return this.deviceTier;
  }
}