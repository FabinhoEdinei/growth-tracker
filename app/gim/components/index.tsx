'use client';

import React, { useState } from 'react';
import type { Workout } from '../types/gym';
import { WORKOUTS, getWorkoutMeta, getTotalSets, getTotalExercises } from '../data/workouts';
import { useWorkout } from '../hooks/useWorkout';

// ─────────────────────────────────────────────────────────────────────────────
// TEMA
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg:      '#080808',
  card:    '#111111',
  border:  '#2a2a2a',
  accent:  '#ff4520',
  glow:    'rgba(255,69,32,0.35)',
  text:    '#f0ede8',
  muted:   '#7a7068',
  mono:    'var(--font-mono, "JetBrains Mono", monospace)',
  gradient:'linear-gradient(135deg, #ff4520 0%, #ff7a00 100%)',
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function GymTrackerPage() {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  if (activeWorkout) {
    return (
      <WorkoutSession
        workout={activeWorkout}
        onBack={() => setActiveWorkout(null)}
      />
    );
  }

  return <WorkoutMenu onSelect={setActiveWorkout} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU — Seleção do treino do dia
// ─────────────────────────────────────────────────────────────────────────────
function WorkoutMenu({ onSelect }: { onSelect: (w: Workout) => void }) {
  const [selectedId, setSelectedId] = useState<string>(WORKOUTS[0].id);
  const selected = WORKOUTS.find(w => w.id === selectedId) ?? WORKOUTS[0];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{ padding: '28px 20px 0' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: T.muted, fontFamily: T.mono, marginBottom: 6 }}>
          GROWTH TRACKER / GIM
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: T.text, letterSpacing: 1, margin: 0 }}>
          TREINO DO DIA
        </h1>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 6, marginBottom: 0 }}>
          Selecione o protocolo e execute
        </p>
      </div>

      {/* ── Carrossel ── */}
      <div style={{ overflowX: 'auto', padding: '24px 0 0' }}>
        <div style={{ display: 'flex', gap: 12, padding: '0 20px 8px', minWidth: 'max-content' }}>
          {WORKOUTS.map(w => {
            const meta = getWorkoutMeta(w.id);
            const isActive = w.id === selectedId;
            return (
              <button
                key={w.id}
                onClick={() => setSelectedId(w.id)}
                style={{
                  minWidth: 150,
                  padding: '16px 14px',
                  borderRadius: 16,
                  background: isActive ? T.gradient : T.card,
                  border: `1px solid ${isActive ? 'transparent' : T.border}`,
                  boxShadow: isActive ? `0 0 24px ${T.glow}` : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{meta.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: 1 }}>
                  {w.name}
                </div>
                <div style={{
                  fontSize: 10,
                  color: isActive ? 'rgba(255,255,255,0.75)' : T.muted,
                  marginTop: 4,
                  fontFamily: T.mono,
                }}>
                  {w.totalMinutes} MIN
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ flex: 1, padding: '20px 20px 100px', overflowY: 'auto' }}>
        <WorkoutPreview workout={selected} />
      </div>

      {/* ── Botão fixo ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 32px',
        background: `linear-gradient(to top, ${T.bg} 70%, transparent)`,
      }}>
        <button
          onClick={() => onSelect(selected)}
          style={{
            width: '100%', padding: '18px 0', borderRadius: 16,
            background: T.gradient, border: 'none', color: '#fff',
            fontSize: 16, fontWeight: 900, letterSpacing: 2,
            cursor: 'pointer', boxShadow: `0 0 32px ${T.glow}`,
          }}
        >
          INICIAR TREINO
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW
// ─────────────────────────────────────────────────────────────────────────────
function WorkoutPreview({ workout }: { workout: Workout }) {
  const meta = getWorkoutMeta(workout.id);
  const totalEx   = getTotalExercises(workout);
  const totalSets = getTotalSets(workout);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'DURAÇÃO',     value: `${workout.totalMinutes}min` },
          { label: 'EXERCÍCIOS',  value: totalEx },
          { label: 'SÉRIES',      value: totalSets },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, padding: '14px 12px', borderRadius: 12,
            background: T.card, border: `1px solid ${T.border}`, textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.accent, fontFamily: T.mono }}>
              {s.value}
            </div>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1, marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>{meta.description}</p>

      {/* Blocos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {workout.blocks.map(block => (
          <div key={block.id}>
            <div style={{
              fontSize: 10, letterSpacing: 2, color: T.accent,
              fontFamily: T.mono, marginBottom: 10,
            }}>
              {block.name}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {block.exercises.map(ex => (
                <div key={ex.id} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: T.card, border: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 22 }}>{ex.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>{ex.name}</div>
                    <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>
                      {ex.sets}× {ex.reps}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>
                    {ex.restSeconds}s rest
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSÃO — Execução
// ─────────────────────────────────────────────────────────────────────────────
function WorkoutSession({ workout, onBack }: { workout: Workout; onBack: () => void }) {
  const { state, currentExercise, startWorkout, completeSet } = useWorkout(workout);

  // ── Idle ──
  if (state.phase === 'idle') {
    const meta = getWorkoutMeta(workout.id);
    return (
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{meta.icon}</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, marginBottom: 8 }}>{workout.name}</h2>
        <p style={{ color: T.muted, fontSize: 13, marginBottom: 40, textAlign: 'center' }}>
          {meta.description}
        </p>
        <button onClick={startWorkout} style={{
          width: '100%', padding: '18px 0', borderRadius: 16,
          background: T.gradient, border: 'none', color: '#fff',
          fontSize: 16, fontWeight: 900, letterSpacing: 2,
          cursor: 'pointer', boxShadow: `0 0 32px ${T.glow}`, marginBottom: 16,
        }}>
          COMEÇAR
        </button>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: T.muted, fontSize: 13, cursor: 'pointer',
        }}>
          ← Voltar
        </button>
      </div>
    );
  }

  // ── Descanso ──
  if (state.phase === 'rest') {
    return (
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: T.muted, fontFamily: T.mono, marginBottom: 24 }}>
          DESCANSO
        </div>
        <div style={{ fontSize: 88, fontWeight: 900, color: T.accent, fontFamily: T.mono, lineHeight: 1 }}>
          {state.restSecondsLeft ?? '--'}
        </div>
        <div style={{ color: T.muted, fontSize: 13, marginTop: 8 }}>segundos</div>
        <button onClick={completeSet} style={{
          marginTop: 48, padding: '14px 32px', borderRadius: 12,
          background: T.card, border: `1px solid ${T.border}`,
          color: T.muted, fontSize: 12, letterSpacing: 1, cursor: 'pointer',
        }}>
          PULAR DESCANSO
        </button>
      </div>
    );
  }

  if (!currentExercise) return null;

// cálculo corrigido
const totalSets = getTotalSets(workout);
const progress  = (state.currentSet ?? 0) / Math.max(totalSets, 1);

const currentSet = (state.currentSet ?? 0) + 1;

  // ── Exercício ativo ──
  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', flexDirection: 'column', padding: '24px 20px 40px',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 0,
        }}>←</button>
        <div style={{ fontSize: 10, letterSpacing: 2, color: T.muted, fontFamily: T.mono }}>
          {workout.name}
        </div>
        <div style={{ fontSize: 11, color: T.accent, fontFamily: T.mono }}>
          {Math.round(progress * 100)}%
        </div>
      </div>

      {/* Progresso */}
      <div style={{ height: 3, background: T.card, borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${progress * 100}%`,
          background: T.gradient, borderRadius: 2, transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Exercício */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>{currentExercise.emoji}</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: T.text, letterSpacing: 1, margin: 0 }}>
          {currentExercise.name}
        </h2>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 8, fontFamily: T.mono }}>
          {currentExercise.reps} repetições
        </div>
        {'weight' in currentExercise && currentExercise.weight && (
          <div style={{ fontSize: 12, color: T.accent, marginTop: 4, fontFamily: T.mono }}>
            {currentExercise.weight as string}
          </div>
        )}
      </div>

      {/* Séries */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
        {Array.from({ length: currentExercise.sets }).map((_, i) => {
          const done    = i < (state.currentSet ?? 0);
          const current = i === (state.currentSet ?? 0);
          return (
            <div key={i} style={{
              width: 38, height: 38, borderRadius: 10,
              background: done ? T.gradient : T.card,
              border: `1px solid ${current ? T.accent : T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              color: done ? '#fff' : current ? T.accent : T.muted,
              boxShadow: current ? `0 0 12px ${T.glow}` : 'none',
              transition: 'all 0.2s',
            }}>
              {done ? '✓' : i + 1}
            </div>
          );
        })}
      </div>

      {/* Cues */}
      {currentExercise.cues?.length > 0 && (
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: '16px 18px', marginBottom: 32,
        }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: T.accent, fontFamily: T.mono, marginBottom: 10 }}>
            DICAS DE EXECUÇÃO
          </div>
          {currentExercise.cues.map((cue, i) => (
            <div key={i} style={{
              fontSize: 13, color: T.muted, paddingLeft: 14, marginBottom: 6, position: 'relative',
            }}>
              <span style={{ position: 'absolute', left: 0, color: T.accent, fontSize: 10, top: 2 }}>›</span>
              {cue}
            </div>
          ))}
        </div>
      )}

      {/* Botão concluir */}
      <div style={{ marginTop: 'auto' }}>
        <button onClick={completeSet} style={{
          width: '100%', padding: '20px 0', borderRadius: 16,
          background: T.gradient, border: 'none', color: '#fff',
          fontSize: 15, fontWeight: 900, letterSpacing: 2,
          cursor: 'pointer', boxShadow: `0 0 32px ${T.glow}`,
        }}>
          SÉRIE {currentSet} DE {currentExercise.sets} — CONCLUÍDA ✓
        </button>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: T.muted, fontFamily: T.mono }}>
          DESCANSO: {currentExercise.restSeconds}s após cada série
        </div>
      </div>
    </div>
  );
}
