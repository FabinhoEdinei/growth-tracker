'use client';
// app/gim/components/RestTimer.tsx
// Tela de descanso com countdown circular animado

import React from 'react';
import { T } from './theme';

interface Props {
  secondsLeft:      number;
  totalSeconds:     number;
  nextExerciseName?: string;
  onSkip:           () => void;
  formatTime:       (s: number) => string;
}

export function RestTimer({ secondsLeft, totalSeconds, nextExerciseName, onSkip, formatTime }: Props) {
  const pct     = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const radius  = 64;
  const circ    = 2 * Math.PI * radius;
  const offset  = circ * (1 - pct);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
    }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: T.muted, fontFamily: T.mono, marginBottom: 32 }}>
        DESCANSO
      </div>

      {/* Círculo animado */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <svg width={160} height={160}>
          {/* Track */}
          <circle cx={80} cy={80} r={radius} fill="none" stroke={T.border} strokeWidth={4}/>
          {/* Progress */}
          <circle
            cx={80} cy={80} r={radius} fill="none"
            stroke={T.accent} strokeWidth={4}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        {/* Número no centro */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 48, fontWeight: 900, color: T.text,
            fontFamily: T.mono, lineHeight: 1,
          }}>
            {secondsLeft}
          </div>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1 }}>seg</div>
        </div>
      </div>

      {/* Próximo exercício */}
      {nextExerciseName && (
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: '10px 20px',
          marginBottom: 32, textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, fontFamily: T.mono, marginBottom: 4 }}>
            PRÓXIMO
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
            {nextExerciseName}
          </div>
        </div>
      )}

      <button
        onClick={onSkip}
        style={{
          padding: '12px 32px', borderRadius: 12,
          background: T.card, border: `1px solid ${T.border}`,
          color: T.muted, fontSize: 12, letterSpacing: 1,
          cursor: 'pointer', fontFamily: T.mono,
        }}
      >
        PULAR DESCANSO →
      </button>
    </div>
  );
}
