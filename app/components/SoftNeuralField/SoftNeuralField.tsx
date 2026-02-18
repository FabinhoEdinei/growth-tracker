'use client';

import { orbitalSystem, INITIAL_ORBITAL_PAYLOADS } from './OrbitalSystem';
import { OrbitalInfoCard } from './OrbitalInfoCard';
import { OrbitalParticle } from './orbitalTypes';
import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './SoftNeuralField.module.css';
import { ModalInfo, HeaderBounds } from './types';
import { ParticleManager } from './particleManager';
import { ParticleRenderer } from './particleRenderer';
import { ParticleModal } from './ParticleModal';
import { NeuralHeader } from './NeuralHeader';
import { AgendaModule } from './AgendaModule'; // ← NOVO

export default function SoftNeuralField({
  particleCount = 50,
  fps = 24,
}: {
  particleCount?: number;
  fps?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleManager = useRef(new ParticleManager());
  const particleRenderer = useRef(new ParticleRenderer());
  
  const [headerBounds, setHeaderBounds] = useState<HeaderBounds | null>(null);
  const [headerGlow, setHeaderGlow] = useState(0);
  
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
    zone: 'alpha',
  });

  // ← NOVO: Estado da agenda
  const [agendaState, setAgendaState] = useState({
    visible: false,
    x: 20,
    y: 200,
  });

  const handleHeaderBoundsUpdate = useCallback((bounds: HeaderBounds) => {
    setHeaderBounds(bounds);
  }, []);

  const handleCanvasClick = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const closestParticle = particleManager.current.findClosestParticle(x, y, 50);

    if (closestParticle) {
      // ← NOVO: Abre agenda se partícula está na zona Alpha
      if (closestParticle.currentZone === 'alpha') {
        setAgendaState({
          visible: true,
          x: event.clientX,
          y: event.clientY,
        });
        return; // ← Não abre modal de partícula se zona Alpha
      }

      setModalInfo({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        data: closestParticle.data,
        zone: closestParticle.currentZone,
      });
    }
  };

  const handleCloseModal = () => {
    setModalInfo({ ...modalInfo, visible: false });
  };

  // ← NOVO
  const handleCloseAgenda = () => {
    setAgendaState(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', handleCanvasClick as any);

    particleManager.current.initialize(particleCount, canvas.width, canvas.height);

    const deviceTier = particleManager.current.getDeviceTier();
    let lastTime = 0;
    const interval = 1000 / fps;
    let frameCount = 0;
    const skipFrames = deviceTier === 'low' ? 2 : 1;

    const animate = (time: number) => {
      frameCount++;
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
          
          setHeaderGlow(lightningEffect.getHeaderGlow());
        }
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleCanvasClick as any);
    };
  }, [particleCount, fps, headerBounds]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 w-full h-full z-0 cursor-crosshair ${styles.field}`}
      />
      
      <NeuralHeader onBoundsUpdate={handleHeaderBoundsUpdate} glow={headerGlow} />

      {/* ← NOVO: Agenda abre ao clicar em partícula Alpha */}
      <AgendaModule
        visible={agendaState.visible}
        onClose={handleCloseAgenda}
        positionX={agendaState.x}
        positionY={agendaState.y}
      />
      
      {/* Modal normal para zonas Beta e Gamma */}
      <ParticleModal modalInfo={modalInfo} onClose={handleCloseModal} />
    </>
  );
}