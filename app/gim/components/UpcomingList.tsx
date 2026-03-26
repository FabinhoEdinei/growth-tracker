'use client';
// app/gim/components/UpcomingList.tsx
// Lista de próximos exercícios no bloco atual

import React from 'react';
import { T } from './theme';

interface Exercise {
  id:    string;
  name:  string;
  emoji: string;
  sets:  number;
  reps:  string;
}

interface Props {
  exercises:            Exercise[];
  currentExerciseIndex: number;
}

export function UpcomingList({ exercises, currentExerciseIndex }: Props) {
  const upcoming = exercises.slice(currentExerciseIndex + 1);
  if (upcoming.length === 0) return null;

  return (
    <div style={{ margin: '0 16px 24px' }}>
      <div style={{ fontSize: 9, color: T.faint, letterSpacing: 2, fontFamily: T.mono, marginBottom: 8 }}>
        PRÓXIMOS NESTE BLOCO
      </div>
      {upcoming.map((ex, i) => (
        <div key={ex.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '9px 13px',
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 10, marginBottom: 6,
          opacity: Math.max(0.3, 0.7 - i * 0.15),
        }}>
          <span style={{ fontSize: 18 }}>{ex.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: T.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {ex.name}
            </div>
            <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>
              {ex.sets}× {ex.reps}
            </div>
          </div>
          <div style={{ fontSize: 9, color: T.faint, fontFamily: T.mono }}>
            #{i + currentExerciseIndex + 2}
          </div>
        </div>
      ))}
    </div>
  );
}
