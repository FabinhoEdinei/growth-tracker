'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './SoftNeuralField.module.css';
import { ModalInfo, HeaderBounds } from './types';
import { ParticleManager } from './particleManager';
import { ParticleRenderer } from './particleRenderer';
import { ParticleModal } from './ParticleModal';
import { NeuralHeader } from './NeuralHeader';
import { AgendaModule } from './AgendaModule';
import { orbitalSystem, INITIAL_ORBITAL_PAYLOADS } from './OrbitalSystem';
import { OrbitalInfoCard } from './OrbitalInfoCard';
import type { OrbitalParticle } from './orbitalTypes';

export default function SoftNeuralField({
  particleCount = 50,
  fps = 24,
}: {
  particleCount?: number;
  fps?: number;
}) {
  console.log('[SoftNeuralField] render start');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleManager = useRef(new ParticleManager());
  const particleRenderer = useRef(new ParticleRenderer());
  const animationRef = useRef<number>();
  
  const [headerBounds, setHeaderBounds] = useState<HeaderBounds | null>(null);
  const [headerGlow, setHeaderGlow] = useState(0);
  
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
    zone: 'alpha',
  });

  const [agendaState, setAgendaState] = useState({
    visible: false,
    x: 20,
    y: 200,
  });

  const [selectedOrbital, setSelectedOrbital] = useState<OrbitalParticle | null>(null);

  const handleHeaderBoundsUpdate = useCallback((bounds: HeaderBounds) => {
    setHeaderBounds(bounds);
  }, []);

  const handleCanvasClick = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Testa orbital primeiro
    const orbitalHit = orbitalSystem.handleClick(x, y);
    if (orbitalHit) {
      setSelectedOrbital(orbitalHit);
      return;
    }

    const closestParticle = particleManager.current.findClosestParticle(x, y, 50);

    if (closestParticle) {
      if (closestParticle.currentZone === 'alpha') {
        setAgendaState({
          visible: true,
          x: event.clientX,
          y: event.clientY,
        });
        return;
      }

      setModalInfo({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        data: closestParticle.data,
        zone: closestParticle.currentZone,
      });
    }
  }, []);

  const handleCloseModal = () => {
    setModalInfo({ ...modalInfo, visible: false });
  };

  const handleCloseAgenda = () => {
    setAgendaState(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    console.log('[SoftNeuralField] useEffect start');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    // debounce resize to avoid spamming layout changes
    let resizeTimeout: number | null = null;
    const doResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const resize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(doResize, 100);
    };
    doResize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', handleCanvasClick);

    particleManager.current.initialize(particleCount, canvas.width, canvas.height);
    
    // Inicializa sistema orbital
    orbitalSystem.init(INITIAL_ORBITAL_PAYLOADS);

    // initial tier may be decided by hardware, will be updated dynamically
    let deviceTier = particleManager.current.getDeviceTier();
    particleManager.current.setDeviceTier(deviceTier);

    let lastTime = 0;
    const interval = 1000 / fps;
    let frameCount = 0;

    // tracking recent frame durations to compute FPS
    let frameTimes: number[] = [];
    let lastTierCheck = 0;

    // respect reduced motion preference
    let shouldAnimate = true;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shouldAnimate = false;
    }

    const animate = (time: number) => {
      frameCount++;

      const dt = time - lastTime;
      if (dt > 0) {
        frameTimes.push(dt);
        if (frameTimes.length > 60) frameTimes.shift();
      }

      // every two seconds recompute tier
      if (time - lastTierCheck > 2000 && frameTimes.length) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fpsMeasured = 1000 / avg;
        let newTier: typeof deviceTier = 'high';
        if (fpsMeasured < 25) newTier = 'low';
        else if (fpsMeasured < 45) newTier = 'medium';

        if (newTier !== deviceTier) {
          deviceTier = newTier;
          particleManager.current.setDeviceTier(newTier);
          // reinitialize if tier drops, to reduce particle count
          particleManager.current.initialize(particleCount, canvas.width, canvas.height);
        }
        lastTierCheck = time;
      }

      const skipFrames = deviceTier === 'low' ? 2 : 1;

      if (frameCount % skipFrames === 0) {
        if (time - lastTime >= interval) {
          lastTime = time;
          particleManager.current.update(canvas.width, canvas.height, headerBounds);
          
          const lightningEffect = particleManager.current.getLightningEffect();
          particleRenderer.current.render(
            ctx,
            particleManager.current.getParticles(),
            canvas.width,
            canvas.height,
            lightningEffect
          );
          
          // Update e render orbital
          if (headerBounds) {
            orbitalSystem.setHeaderBounds(headerBounds);
            orbitalSystem.update();
            orbitalSystem.render(ctx);
          }
          
          setHeaderGlow(lightningEffect.getHeaderGlow());
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    if (shouldAnimate) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleCanvasClick);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [particleCount, fps, headerBounds, handleCanvasClick]);

  return (
    <>
    <canvas
  ref={canvasRef}
  role="img"
  aria-label="Campo neural animado interativo"
  className={`fixed inset-0 w-full h-full z-0 cursor-crosshair ${styles.field}`}
/>
      
      <NeuralHeader onBoundsUpdate={handleHeaderBoundsUpdate} glow={headerGlow} />

      <AgendaModule
        visible={agendaState.visible}
        onClose={handleCloseAgenda}
        positionX={agendaState.x}
        positionY={agendaState.y}
      />
      
      <ParticleModal modalInfo={modalInfo} onClose={handleCloseModal} />
      
      <OrbitalInfoCard
        particle={selectedOrbital}
        onClose={() => setSelectedOrbital(null)}
        onToggleDone={(id) => {
          const p = orbitalSystem.getAll().find(p => p.id === id);
          if (p) {
            orbitalSystem.updatePayload(id, { done: !p.payload.done });
          }
        }}
      />
    </>
  );
}