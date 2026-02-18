'use client';

import { orbitalSystem, INITIAL_ORBITAL_PAYLOADS } from './OrbitalSystem';
import { OrbitalInfoCard } from './OrbitalInfoCard';
import { OrbitalParticle } from './orbitalTypes';
import { useEffect, useRef, useState, useCallback } from 'react';
// ... demais imports ...

export default function SoftNeuralField({ ... }) {
  // ... refs existentes ...
  
  const [headerBounds, setHeaderBounds] = useState<HeaderBounds | null>(null);
  const [headerGlow, setHeaderGlow] = useState(0);
  const [modalInfo, setModalInfo] = useState<ModalInfo>({ ... });
  const [agendaState, setAgendaState] = useState({ ... });
  
  // ← NOVO 3.2.2: Estado para orbital selecionado
  const [selectedOrbital, setSelectedOrbital] = useState<OrbitalParticle | null>(null);

  // ... handleHeaderBoundsUpdate ...

  // ← NOVO 3.2.5: Click handler com prioridade para orbitais
  const handleCanvasClick = (event: MouseEvent) => {
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

    // ... resto do código existente para partículas ...
  };

  // ... handleCloseModal, handleCloseAgenda ...

  useEffect(() => {
    // ... setup inicial ...
    
    particleManager.current.initialize(particleCount, canvas.width, canvas.height);
    
    // ← NOVO 3.2.3: Inicializa sistema orbital
    orbitalSystem.init(INITIAL_ORBITAL_PAYLOADS);
        // ... deviceTier, animate definition ...
    
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
          
          // ← NOVO 3.2.4: Update e render orbital
          if (headerBounds) {
            orbitalSystem.setHeaderBounds(headerBounds);
            orbitalSystem.update();
            orbitalSystem.render(ctx);
          }
          
          setHeaderGlow(lightningEffect.getHeaderGlow());
        }
      }
      requestAnimationFrame(animate);
    };
    
    // ... cleanup ...
  }, [particleCount, fps, headerBounds]);

  return (
    <>
      <canvas ref={canvasRef} className={`fixed inset-0 w-full h-full z-0 cursor-crosshair ${styles.field}`} />
      
      <NeuralHeader onBoundsUpdate={handleHeaderBoundsUpdate} glow={headerGlow} />

      <AgendaModule
        visible={agendaState.visible}
        onClose={handleCloseAgenda}
        positionX={agendaState.x}
        positionY={agendaState.y}
      />
      
      <ParticleModal modalInfo={modalInfo} onClose={handleCloseModal} />
      
      {/* ← NOVO 3.2.6: Card do orbital */}      <OrbitalInfoCard
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