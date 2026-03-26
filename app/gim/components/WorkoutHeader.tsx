'use client';
// app/gim/components/WorkoutHeader.tsx
// Header sticky com nome do treino, progresso geral, timer e contagem de séries

import React from 'react';
import { T } from './theme';

interface Props {
  workoutName:     string;
  elapsedSeconds:  number;
  totalMinutes:    number;
  completedSets:   number;
  totalSets:       number;
  overallProgress: number; // 0-100
  phase:           string;
  formatTime:      (s: number) => string;
}

export function WorkoutHeader({
  workoutName, elapsedSeconds, totalMinutes,
  completedSets, totalSets, overallProgress, phase, formatTime,
}: Props) {
  const pct = Math.min(overallProgress, 100);

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: `${T.bgDeep}ee`,
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${T.border}`,
      padding: '12px 16px 10px',
    }}>
      {/* Linha 1: nome + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: T.muted, fontFamily: T.mono, marginBottom: 2 }}>
            GYM TRACKER
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: T.text, letterSpacing: 1, fontFamily: T.display }}>
            {workoutName}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Timer */}
          <div style={{
            padding: '4px 10px', borderRadius: 8,
            background: T.card, border: `1px solid ${T.border}`,
            fontSize: 13, color: T.accent, fontFamily: T.mono, fontWeight: 700,
          }}>
            {formatTime(elapsedSeconds)}
          </div>

          {/* Badge ativo */}
          {phase === 'exercise' && (
            <div style={{
              padding: '4px 10px', borderRadius: 8,
              background: 'rgba(255,69,32,0.12)', border: `1px solid ${T.borderHot}`,
              fontSize: 10, color: T.accent, fontFamily: T.mono, letterSpacing: 1,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: T.accent,
                boxShadow: `0 0 6px ${T.accent}`,
                display: 'inline-block',
              }}/>
              ATIVO
            </div>
          )}
        </div>
      </div>

      {/* Linha 2: progresso */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Círculo de progresso mini */}
        <svg width={32} height={32} style={{ flexShrink: 0 }}>
          <circle cx={16} cy={16} r={12} fill="none" stroke={T.border} strokeWidth={2.5}/>
          <circle
            cx={16} cy={16} r={12} fill="none"
            stroke={T.accent} strokeWidth={2.5}
            strokeDasharray={`${2 * Math.PI * 12}`}
            strokeDashoffset={`${2 * Math.PI * 12 * (1 - pct / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 16 16)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          <text x={16} y={20} textAnchor="middle" fill={T.text} fontSize={8} fontFamily={T.mono}>
            {pct}%
          </text>
        </svg>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 5 }}>
            <span style={{ color: T.text, fontWeight: 700 }}>{completedSets}</span>
            <span style={{ color: T.muted }}>/{totalSets} séries concluídas</span>
          </div>
          <div style={{ height: 3, background: T.border, borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: T.gradient,
              width: `${pct}%`,
              transition: 'width 0.5s ease',
            }}/>
          </div>
        </div>
      </div>
    </div>
  );
}
