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
import { useGrowthSync } from '../../../hooks/useGrowthSync';

// ── Indicador de sync (canto inferior direito) ────────────────────────────────
function SyncIndicator({
  loading, lastSync, error, snapshot,
}: {
  loading: boolean;
  lastSync: number | null;
  error: string | null;
  snapshot: Record<string, number>;
}) {
  const total = Object.values(snapshot).reduce((a, b) => a + b, 0);
  const timeStr = lastSync
    ? new Date(lastSync).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px',
      background: 'rgba(8,6,20,0.75)',
      border: `1px solid ${error ? 'rgba(255,77,109,0.4)' : loading ? 'rgba(0,212,255,0.3)' : 'rgba(0,255,136,0.3)'}`,
      borderRadius: 20,
      backdropFilter: 'blur(8px)',
      fontFamily: "'Courier New', monospace",
      fontSize: 10,
      color: error ? '#ff4d6d' : loading ? '#00d4ff' : '#00ff88',
      letterSpacing: 1,
      pointerEvents: 'none',
      transition: 'border-color 0.4s, color 0.4s',
    }}>
      {/* Bolinha pulsante */}
      <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: error ? '#ff4d6d' : loading ? '#00d4ff' : '#00ff88',
        animation: loading ? 'gtPulse 0.8s ease-in-out infinite' : 'none',
        flexShrink: 0,
      }} />

      {loading && <span>SYNC…</span>}
      {!loading && error && <span>ERR</span>}
      {!loading && !error && (
        <span>{total} orbitais · {timeStr}</span>
      )}

      <style>{`
        @keyframes gtPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(1.4); }
        }
      `}</style>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function SoftNeuralField({
  particleCount = 50,
  fps = 24,
}: {
  particleCount?: number;
  fps?: number;
}) {
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const particleManager  = useRef(new ParticleManager());
  const particleRenderer = useRef(new ParticleRenderer());
  const animationRef     = useRef<number>();

  const [headerBounds, setHeaderBounds] = useState<HeaderBounds | null>(null);
  const [headerGlow,   setHeaderGlow]   = useState(0);

  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    visible: false, x: 0, y: 0, data: null, zone: 'alpha',
  });

  const [agendaState, setAgendaState] = useState({
    visible: false, x: 20, y: 200,
  });

  const [selectedOrbital, setSelectedOrbital] = useState<OrbitalParticle | null>(null);

  // ── Hook de sincronização — alimenta orbitais com dados reais ─────────────
  const { loading, lastSync, error, snapshot } = useGrowthSync(60_000);

  const handleHeaderBoundsUpdate = useCallback((bounds: HeaderBounds) => {
    setHeaderBounds(bounds);
  }, []);

  const handleCanvasClick = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x    = event.clientX - rect.left;
    const y    = event.clientY - rect.top;

    const orbitalHit = orbitalSystem.handleClick(x, y);
    if (orbitalHit) {
      setSelectedOrbital(orbitalHit);
      return;
    }

    const closestParticle = particleManager.current.findClosestParticle(x, y, 50);
    if (closestParticle) {
      if (closestParticle.currentZone === 'alpha') {
        setAgendaState({ visible: true, x: event.clientX, y: event.clientY });
        return;
      }
      setModalInfo({
        visible: true, x: event.clientX, y: event.clientY,
        data: closestParticle.data, zone: closestParticle.currentZone,
      });
    }
  }, []);

  const handleCloseModal  = () => setModalInfo(prev => ({ ...prev, visible: false }));
  const handleCloseAgenda = () => setAgendaState(prev => ({ ...prev, visible: false }));

  // ── Loop de animação ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let resizeTimeout: number | null = null;
    const doResize = () => {
      canvas.width  = window.innerWidth;
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

    // Inicia orbitais com dados fixos — o hook substituirá pelos dados reais
    orbitalSystem.init(INITIAL_ORBITAL_PAYLOADS);

    let deviceTier  = particleManager.current.getDeviceTier();
    let lastTime    = 0;
    let frameTimes: number[] = [];
    let lastTierCheck = 0;
    let frameCount  = 0;
    const interval  = 1000 / fps;

    const shouldAnimate =
      !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

    const animate = (time: number) => {
      frameCount++;
      const dt = time - lastTime;
      if (dt > 0) { frameTimes.push(dt); if (frameTimes.length > 60) frameTimes.shift(); }

      if (time - lastTierCheck > 2000 && frameTimes.length) {
        const avg         = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fpsMeasured = 1000 / avg;
        const newTier: typeof deviceTier =
          fpsMeasured < 25 ? 'low' : fpsMeasured < 45 ? 'medium' : 'high';

        if (newTier !== deviceTier) {
          deviceTier = newTier;
          particleManager.current.setDeviceTier(newTier);
          particleManager.current.initialize(particleCount, canvas.width, canvas.height);
        }
        lastTierCheck = time;
      }

      const skipFrames = deviceTier === 'low' ? 2 : 1;
      if (frameCount % skipFrames === 0 && time - lastTime >= interval) {
        lastTime = time;

        particleManager.current.update(canvas.width, canvas.height, headerBounds);
        const lightningEffect = particleManager.current.getLightningEffect();

        particleRenderer.current.render(
          ctx,
          particleManager.current.getParticles(),
          canvas.width, canvas.height,
          lightningEffect
        );

        if (headerBounds) {
          orbitalSystem.setHeaderBounds(headerBounds);
          orbitalSystem.update();
          orbitalSystem.render(ctx);
        }

        setHeaderGlow(lightningEffect.getHeaderGlow());
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (shouldAnimate) animationRef.current = requestAnimationFrame(animate);

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
          if (p) orbitalSystem.updatePayload(id, { done: !p.payload.done });
        }}
      />

      {/* Indicador de sincronização — discreto, canto inferior direito */}
      <SyncIndicator
        loading={loading}
        lastSync={lastSync}
        error={error}
        snapshot={snapshot}
      />
    </>
  );
}
