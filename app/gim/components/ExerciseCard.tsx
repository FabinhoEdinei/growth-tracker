'use client';
// app/gim/components/ExerciseCard.tsx
// Card principal do exercício ativo durante a sessão

import React from 'react';
import { T } from './theme';

interface Exercise {
  id:          string;
  name:        string;
  emoji:       string;
  equipment:   string;
  muscleGroup: string;
  sets:        number;
  reps:        string;
  restSeconds: number;
  cues?:       string[];
  weight?:     string;
}

interface Props {
  exercise:        Exercise;
  currentSetIndex: number;
  elapsedSeconds:  number;
  completedSets:   number;
  formatTime:      (s: number) => string;
  onCompleteSet:   () => void;
  onSkipExercise:  () => void;
}

export function ExerciseCard({
  exercise, currentSetIndex, elapsedSeconds,
  completedSets, formatTime, onCompleteSet, onSkipExercise,
}: Props) {
  return (
    <div style={{ padding: '12px 16px 32px' }}>

      {/* Card principal */}
      <div style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: '20px 18px',
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow de fundo sutil */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 120, height: 120, borderRadius: '50%',
          background: T.glow, filter: 'blur(40px)',
          pointerEvents: 'none',
        }}/>

        {/* Linha 1: equipamento + grupo muscular */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[exercise.equipment, exercise.muscleGroup].map(tag => (
            <div key={tag} style={{
              padding: '3px 8px', borderRadius: 6,
              background: T.bgDeep, border: `1px solid ${T.border}`,
              fontSize: 9, color: T.muted, letterSpacing: 1,
              fontFamily: T.mono, textTransform: 'uppercase',
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Emoji + nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, flexShrink: 0,
            background: T.bgDeep, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>
            {exercise.emoji}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.text, fontFamily: T.display, lineHeight: 1.1 }}>
              {exercise.name}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: T.accent, fontFamily: T.mono }}>
                  {exercise.reps}
                </div>
                <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>REPS</div>
              </div>
              {exercise.weight && (
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: T.accentB, fontFamily: T.mono }}>
                    {exercise.weight}
                  </div>
                  <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>CARGA</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timer + séries na mesma linha */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: T.text, fontFamily: T.mono, lineHeight: 1 }}>
              {formatTime(elapsedSeconds)}
            </div>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>TREINO</div>
          </div>

          {/* Dots de séries */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {Array.from({ length: exercise.sets }).map((_, i) => {
              const done    = i < currentSetIndex;
              const current = i === currentSetIndex;
              return (
                <div key={i} style={{
                  width: current ? 14 : 10,
                  height: current ? 14 : 10,
                  borderRadius: '50%',
                  background: done ? T.success : current ? T.accent : T.border,
                  boxShadow: current ? `0 0 8px ${T.accent}` : 'none',
                  transition: 'all 0.2s',
                }}/>
              );
            })}
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, marginLeft: 4 }}>
              ×{exercise.sets}
            </div>
          </div>
        </div>

        {/* Séries quadradas */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: T.muted, fontFamily: T.mono, marginBottom: 8 }}>
            SÉRIES
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {Array.from({ length: exercise.sets }).map((_, i) => {
              const done    = i < currentSetIndex;
              const current = i === currentSetIndex;
              return (
                <div key={i} style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: done ? T.successBg : current ? 'rgba(255,69,32,0.1)' : T.bgDeep,
                  border: `1px solid ${done ? T.success : current ? T.accent : T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 900,
                  color: done ? T.success : current ? T.accent : T.faint,
                  boxShadow: current ? `0 0 12px rgba(255,69,32,0.3)` : 'none',
                  transition: 'all 0.25s',
                }}>
                  {done ? '✓' : i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cues */}
      {exercise.cues && exercise.cues.length > 0 && (
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: '14px 16px', marginBottom: 12,
        }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: T.accent, fontFamily: T.mono, marginBottom: 10 }}>
            EXECUÇÃO
          </div>
          {exercise.cues.map((cue, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, marginBottom: 7,
            }}>
              <span style={{ color: T.accent, fontSize: 11, marginTop: 1, flexShrink: 0 }}>›</span>
              <span style={{ fontSize: 13, color: T.textDim, lineHeight: 1.4 }}>{cue}</span>
            </div>
          ))}
        </div>
      )}

      {/* Botões */}
      <button
        onClick={onCompleteSet}
        style={{
          width: '100%', padding: '18px 0', borderRadius: 16,
          background: T.gradient, border: 'none', color: '#fff',
          fontSize: 15, fontWeight: 900, letterSpacing: 2,
          cursor: 'pointer', boxShadow: `0 4px 24px ${T.glow}`,
          marginBottom: 10, fontFamily: T.display,
        }}
      >
        ✓ SÉRIE {currentSetIndex + 1} CONCLUÍDA
      </button>

      <button
        onClick={onSkipExercise}
        style={{
          width: '100%', padding: '12px 0', borderRadius: 12,
          background: 'none', border: 'none', color: T.muted,
          fontSize: 12, cursor: 'pointer', letterSpacing: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontFamily: T.mono,
        }}
      >
        <span style={{ fontSize: 14 }}>⏭</span> PULAR EXERCÍCIO
      </button>
    </div>
  );
}
