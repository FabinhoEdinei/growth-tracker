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
    
    // Cria o objeto particle
    const particle: Particle = {
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
    
    // ← NOVO: Registra a partícula no store com status inicial 'vazio'
    particleStore.register(particle.data.id, 'vazio');
    
    return particle;
  });
}