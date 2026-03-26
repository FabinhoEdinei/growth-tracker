'use client';
// app/gim/components/index.tsx
// Orquestrador principal — menu de seleção + sessão de treino

import React, { useState } from 'react';
import type { Workout } from '../types/gym';
import { WORKOUTS, getWorkoutMeta, getTotalSets, getTotalExercises } from '../data/workouts';
import { useWorkout } from '../hooks/useWorkout';
import { T } from './theme';
import { WorkoutHeader } from './WorkoutHeader';
import { BlockNav } from './BlockNav';
import { ExerciseCard } from './ExerciseCard';
import { RestTimer } from './RestTimer';
import { UpcomingList } from './UpcomingList';

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function GymTrackerPage() {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  if (activeWorkout) {
    return <WorkoutSession workout={activeWorkout} onBack={() => setActiveWorkout(null)} />;
  }
  return <WorkoutMenu onSelect={setActiveWorkout} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU
// ─────────────────────────────────────────────────────────────────────────────
function WorkoutMenu({ onSelect }: { onSelect: (w: Workout) => void }) {
  const [selectedId, setSelectedId] = useState<string>(WORKOUTS[0].id);
  const selected = WORKOUTS.find(w => w.id === selectedId) ?? WORKOUTS[0];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '28px 20px 0' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: T.muted, fontFamily: T.mono, marginBottom: 6 }}>
          GROWTH TRACKER / GIM
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: T.text, letterSpacing: 1, margin: 0, fontFamily: T.display }}>
          TREINO DO DIA
        </h1>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 6, marginBottom: 0 }}>
          Selecione o protocolo e execute
        </p>
      </div>

      {/* Carrossel */}
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
                  minWidth: 150, padding: '16px 14px', borderRadius: 16,
                  background: isActive ? T.gradient : T.card,
                  border: `1px solid ${isActive ? 'transparent' : T.border}`,
                  boxShadow: isActive ? `0 0 24px ${T.glow}` : 'none',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s ease', outline: 'none',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{meta.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: 1 }}>
                  {w.name}
                </div>
                <div style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.75)' : T.muted, marginTop: 4, fontFamily: T.mono }}>
                  {w.totalMinutes} MIN
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, padding: '20px 20px 100px', overflowY: 'auto' }}>
        <WorkoutPreview workout={selected} />
      </div>

      {/* Botão fixo */}
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
            fontFamily: T.display,
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
  const meta      = getWorkoutMeta(workout.id);
  const totalEx   = getTotalExercises(workout);
  const totalSets = getTotalSets(workout);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'DURAÇÃO',    value: `${workout.totalMinutes}min` },
          { label: 'EXERCÍCIOS', value: totalEx },
          { label: 'SÉRIES',     value: totalSets },
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {workout.blocks.map(block => (
          <div key={block.id}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: T.accent, fontFamily: T.mono, marginBottom: 10 }}>
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
                    <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{ex.sets}× {ex.reps}</div>
                  </div>
                  <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>{ex.restSeconds}s rest</div>
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
// SESSÃO
// ─────────────────────────────────────────────────────────────────────────────
function WorkoutSession({ workout, onBack }: { workout: Workout; onBack: () => void }) {
  const {
    state, currentBlock, currentExercise, overallProgress,
    nextExerciseName, startWorkout, completeSet, skipRest, skipExercise,
    resetWorkout, formatTime, getTotalCompletedSets, getTotalSets,
  } = useWorkout(workout);

  const completedSets = getTotalCompletedSets();
  const totalSets     = getTotalSets();

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
        <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, marginBottom: 8, fontFamily: T.display }}>
          {workout.name}
        </h2>
        <p style={{ color: T.muted, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
          {meta.description}
        </p>
        <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
          {[
            { v: getTotalExercises(workout), l: 'exercícios' },
            { v: totalSets, l: 'séries' },
            { v: `${workout.totalMinutes}min`, l: 'duração' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: T.accent, fontFamily: T.mono }}>{s.v}</div>
              <div style={{ fontSize: 10, color: T.muted }}>{s.l}</div>
            </div>
          ))}
        </div>
        <button onClick={startWorkout} style={{
          width: '100%', padding: '18px 0', borderRadius: 16,
          background: T.gradient, border: 'none', color: '#fff',
          fontSize: 16, fontWeight: 900, letterSpacing: 2,
          cursor: 'pointer', boxShadow: `0 0 32px ${T.glow}`, marginBottom: 16,
          fontFamily: T.display,
        }}>
          ▶ COMEÇAR
        </button>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: T.muted, fontSize: 13, cursor: 'pointer',
        }}>
          ← Voltar ao menu
        </button>
      </div>
    );
  }

  // ── Finalizado ──
  if (state.phase === 'finished') {
    return (
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🏆</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: T.text, marginBottom: 8, fontFamily: T.display }}>
          TREINO CONCLUÍDO!
        </h2>
        <p style={{ color: T.muted, fontSize: 13, marginBottom: 12 }}>{workout.name}</p>
        <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: T.accent, fontFamily: T.mono }}>
              {formatTime(state.elapsedSeconds)}
            </div>
            <div style={{ fontSize: 10, color: T.muted }}>tempo total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: T.accent, fontFamily: T.mono }}>
              {completedSets}
            </div>
            <div style={{ fontSize: 10, color: T.muted }}>séries</div>
          </div>
        </div>
        <button onClick={onBack} style={{
          width: '100%', padding: '18px 0', borderRadius: 16,
          background: T.gradient, border: 'none', color: '#fff',
          fontSize: 16, fontWeight: 900, letterSpacing: 2,
          cursor: 'pointer', boxShadow: `0 0 32px ${T.glow}`,
          fontFamily: T.display,
        }}>
          VOLTAR AO MENU
        </button>
      </div>
    );
  }

  // ── Ativo / Descanso ──
  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 40 }}>

      <WorkoutHeader
        workoutName={workout.name}
        elapsedSeconds={state.elapsedSeconds}
        totalMinutes={workout.totalMinutes}
        overallProgress={overallProgress}
        completedSets={completedSets}
        totalSets={totalSets}
        phase={state.phase}
        formatTime={formatTime}
      />

      {currentBlock && (
        <BlockNav
          blocks={workout.blocks}
          currentBlockIndex={state.currentBlockIndex}
          currentExerciseIndex={state.currentExerciseIndex}
        />
      )}

      {/* Progresso do bloco */}
      {currentBlock && (
        <div style={{ padding: '10px 16px 8px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 9, color: T.muted, letterSpacing: 2, fontFamily: T.mono }}>
              {currentBlock.name}
            </span>
            <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>
              {state.currentExerciseIndex + 1}/{currentBlock.exercises.length}
            </span>
          </div>
          <div style={{ height: 2, background: T.border, borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, background: T.accent,
              width: `${(state.currentExerciseIndex / currentBlock.exercises.length) * 100}%`,
              transition: 'width .4s ease',
            }}/>
          </div>
          {currentBlock.description && (
            <div style={{ fontSize: 10, color: T.faint, marginTop: 4 }}>{currentBlock.description}</div>
          )}
        </div>
      )}

      {/* Rest */}
      {state.phase === 'rest' && currentExercise && (
        <RestTimer
          secondsLeft={state.restSecondsLeft}
          totalSeconds={currentExercise.restSeconds}
          nextExerciseName={nextExerciseName}
          formatTime={formatTime}
          onSkip={skipRest}
        />
      )}

      {/* Exercício */}
      {state.phase === 'exercise' && currentExercise && (
        <>
          <ExerciseCard
            exercise={currentExercise as any}
            currentSetIndex={state.currentSetIndex}
            elapsedSeconds={state.elapsedSeconds}
            completedSets={completedSets}
            formatTime={formatTime}
            onCompleteSet={completeSet}
            onSkipExercise={skipExercise}
          />
          {currentBlock && (
            <UpcomingList
              exercises={currentBlock.exercises as any[]}
              currentExerciseIndex={state.currentExerciseIndex}
            />
          )}
        </>
      )}
    </div>
  );
}
