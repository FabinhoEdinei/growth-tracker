'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/gim/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import type { Workout } from './types/gym';
import { WORKOUTS, getWorkoutMeta, getTotalSets, getTotalExercises } from './data/workouts';
import { useWorkout } from './hooks/useWorkout';
import {
  WorkoutHeader,
  BlockBadge,
  ExerciseCard,
  RestTimer,
  WorkoutIdle,
  WorkoutFinished,
} from './components';

// ─────────────────────────────────────────────────────────────────────────────
// TEMA
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg:       '#0e0e0e',
  card:     '#161616',
  border:   '#2a2a2a',
  accent:   '#ff4520',
  glow:     'rgba(255,69,32,0.35)',
  text:     '#f0ede8',
  muted:    '#7a7068',
  faint:    '#4a4540',
  gradient: 'linear-gradient(135deg, #ff4520 0%, #ff7a00 100%)',
  mono:     'var(--font-mono)',
  display:  'var(--font-display)',
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Share+Tech+Mono&display=swap');
  :root {
    --font-display: 'Barlow Condensed', sans-serif;
    --font-mono:    'Share Tech Mono', monospace;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0e0e0e; color: #f0ede8; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: #161616; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 99px; }
  * { -webkit-tap-highlight-color: transparent; }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .slide-up { animation: slideUp .3s ease-out forwards; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — entry point
// ─────────────────────────────────────────────────────────────────────────────
export default function GimPage() {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      {activeWorkout
        ? <WorkoutSession workout={activeWorkout} onBack={() => setActiveWorkout(null)} />
        : <WorkoutMenu onSelect={setActiveWorkout} />
      }
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU — seleção do treino do dia
// ─────────────────────────────────────────────────────────────────────────────
function WorkoutMenu({ onSelect }: { onSelect: (w: Workout) => void }) {
  const [selectedId, setSelectedId] = useState<string>(WORKOUTS[0].id);
  const selected = WORKOUTS.find(w => w.id === selectedId) ?? WORKOUTS[0];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', fontFamily: T.display }}>

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
                  fontFamily: T.display,
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
// PREVIEW — detalhes antes de iniciar
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
// SESSÃO — execução do treino (mantém todos os componentes existentes)
// ─────────────────────────────────────────────────────────────────────────────
function WorkoutSession({ workout, onBack }: { workout: Workout; onBack: () => void }) {
  const {
    state,
    currentBlock,
    currentExercise,
    currentProgress,
    overallProgress,
    nextExerciseName,
    startWorkout,
    completeSet,
    skipRest,
    skipExercise,
    resetWorkout,
    formatTime,
    getTotalCompletedSets,
    getTotalSets: getTotal,
  } = useWorkout(workout);

  const completedSets  = getTotalCompletedSets();
  const totalSets      = getTotal();
  const totalExercises = getTotalExercises(workout);
  const isActive       = state.phase === 'exercise' || state.phase === 'rest';

  // ── Idle ──
  if (state.phase === 'idle') {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.display }}>
        <WorkoutIdle
          totalMinutes={workout.totalMinutes}
          totalExercises={totalExercises}
          totalSets={totalSets}
          onStart={startWorkout}
        />
        <div style={{ padding: '0 20px 32px', marginTop: -16 }}>
          <button
            onClick={onBack}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12,
              background: 'none', border: `1px solid ${T.border}`,
              color: T.muted, fontSize: 13, cursor: 'pointer',
              fontFamily: T.display, letterSpacing: 1,
            }}
          >
            ← VOLTAR
          </button>
        </div>
      </div>
    );
  }

  // ── Finalizado ──
  if (state.phase === 'finished') {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.display }}>
        <WorkoutHeader
          workoutName={workout.name}
          elapsedSeconds={state.elapsedSeconds}
          totalMinutes={workout.totalMinutes}
          overallProgress={100}
          completedSets={completedSets}
          totalSets={totalSets}
          phase={state.phase}
          formatTime={formatTime}
        />
        <WorkoutFinished
          elapsedSeconds={state.elapsedSeconds}
          completedSets={completedSets}
          formatTime={formatTime}
          onReset={onBack}
        />
      </div>
    );
  }

  // ── Ativo ──
  if (!isActive) return null;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.display }}>

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

      {/* Blocos scroll horizontal */}
      <div style={{ overflowX: 'auto', display: 'flex', borderBottom: `1px solid ${T.border}` }}>
        {workout.blocks.map((block, i) => (
          <div key={block.id} style={{ minWidth: 180 }}>
            <BlockBadge
              block={block}
              isActive={i === state.currentBlockIndex}
              isCompleted={i < state.currentBlockIndex}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* Progresso do bloco */}
      {currentBlock && (
        <div style={{ padding: '12px 16px 8px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 9, color: T.muted, letterSpacing: 2, fontFamily: T.mono }}>
              {currentBlock.name}
            </span>
            <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>
              {state.currentExerciseIndex + 1}/{currentBlock.exercises.length}
            </span>
          </div>
          <div style={{ height: 2, background: T.border, borderRadius: 99, overflow: 'hidden', marginBottom: 5 }}>
            <div style={{
              height: '100%', borderRadius: 99, background: T.accent,
              width: `${(state.currentExerciseIndex / currentBlock.exercises.length) * 100}%`,
              transition: 'width .4s ease',
            }} />
          </div>
          {currentBlock.description && (
            <div style={{ fontSize: 10, color: T.faint, lineHeight: 1.4 }}>
              {currentBlock.description}
            </div>
          )}
        </div>
      )}

      {/* Conteúdo */}
      <div style={{ padding: '14px 0 40px' }}>

        {state.phase === 'rest' && currentExercise && (
          <div className="slide-up">
            <RestTimer
              secondsLeft={state.restSecondsLeft}
              totalSeconds={currentExercise.restSeconds}
              nextExerciseName={nextExerciseName}
              formatTime={formatTime}
              onSkip={skipRest}
            />
          </div>
        )}

        {state.phase === 'exercise' && currentExercise && currentProgress && (
          <div className="slide-up" key={`${currentExercise.id}-${state.currentSetIndex}`}>
            <ExerciseCard
              exercise={currentExercise}
              progress={currentProgress}
              currentSetIndex={state.currentSetIndex}
              phase={state.phase}
              elapsedSeconds={state.elapsedSeconds}
              totalCompletedSets={completedSets}
              formatTime={formatTime}
              onCompleteSet={completeSet}
              onSkipExercise={skipExercise}
            />
          </div>
        )}

        {/* Próximos no bloco */}
        {state.phase === 'exercise' && currentBlock && (() => {
          const upcoming = currentBlock.exercises.slice(state.currentExerciseIndex + 1);
          if (upcoming.length === 0) return null;
          return (
            <div style={{ margin: '18px 16px 0' }}>
              <div style={{ fontSize: 9, color: T.faint, letterSpacing: 2, fontFamily: T.mono, marginBottom: 8 }}>
                PRÓXIMOS NESTE BLOCO
              </div>
              {upcoming.map((ex, i) => (
                <div key={ex.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 13px',
                  background: T.card, border: `1px solid ${T.border}`,
                  borderRadius: 8, marginBottom: 6, opacity: 0.6,
                }}>
                  <span style={{ fontSize: 17 }}>{ex.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ex.name}
                    </div>
                    <div style={{ fontSize: 9, color: T.faint, fontFamily: T.mono }}>
                      {ex.sets}× {ex.reps}
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>
                    #{i + state.currentExerciseIndex + 2}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
