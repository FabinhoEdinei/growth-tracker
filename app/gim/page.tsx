'use client';

// ─────────────────────────────────────────────────────────────────────────────
// GymTrackerPage.tsx — Orquestra todo o fluxo do treino
// ─────────────────────────────────────────────────────────────────────────────

import { useWorkout }                           from './hooks/useWorkout';
import { WORKOUT_FULLBODY_45, getTotalExercises, getTotalSets } from './data/workout';
import { WorkoutHeader, BlockBadge, ExerciseCard, RestTimer, WorkoutIdle, WorkoutFinished } from './components';

// ── Estilos globais (fontes industriais + reset) ──────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --font-display: 'Barlow Condensed', sans-serif;
    --font-mono:    'Share Tech Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0e0e0e;
    color: #f0ede8;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

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
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export default function GymTrackerPage() {
  const workout = WORKOUT_FULLBODY_45;

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
    getTotalSets,
  } = useWorkout(workout);

  const completedSets  = getTotalCompletedSets();
  const totalSets      = getTotalSets();
  const totalExercises = getTotalExercises(workout);
  const isActive       = state.phase === 'exercise' || state.phase === 'rest';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }}/>

      <div style={{ minHeight: '100vh', background: '#0e0e0e', fontFamily: 'var(--font-display)' }}>

        {/* ════════════════════════════════════════════
            TELA IDLE — antes de iniciar
        ════════════════════════════════════════════ */}
        {state.phase === 'idle' && (
          <WorkoutIdle
            totalMinutes={workout.totalMinutes}
            totalExercises={totalExercises}
            totalSets={totalSets}
            onStart={startWorkout}
          />
        )}

        {/* ════════════════════════════════════════════
            TELA FINALIZADO
        ════════════════════════════════════════════ */}
        {state.phase === 'finished' && (
          <>
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
              onReset={resetWorkout}
            />
          </>
        )}

        {/* ════════════════════════════════════════════
            TREINO ATIVO (exercise | rest)
        ════════════════════════════════════════════ */}
        {isActive && (
          <>
            {/* ── Header sticky ── */}
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

            {/* ── Faixa horizontal de blocos (scroll) ── */}
            <div style={{ overflowX: 'auto', display: 'flex', borderBottom: '1px solid #2a2a2a' }}>
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

            {/* ── Progresso do bloco atual ── */}
            {currentBlock && (
              <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #2a2a2a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 9, color: '#7a7068', letterSpacing: 2, fontFamily: 'var(--font-mono)' }}>
                    {currentBlock.name}
                  </span>
                  <span style={{ fontSize: 9, color: '#7a7068', fontFamily: 'var(--font-mono)' }}>
                    {state.currentExerciseIndex + 1}/{currentBlock.exercises.length}
                  </span>
                </div>
                {/* Barra de progresso do bloco */}
                <div style={{ height: 2, background: '#2a2a2a', borderRadius: 99, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{
                    height: '100%', borderRadius: 99, background: '#ff4520',
                    width: `${(state.currentExerciseIndex / currentBlock.exercises.length) * 100}%`,
                    transition: 'width .4s ease',
                  }}/>
                </div>
                {currentBlock.description && (
                  <div style={{ fontSize: 10, color: '#4a4540', lineHeight: 1.4 }}>
                    {currentBlock.description}
                  </div>
                )}
              </div>
            )}

            {/* ── Conteúdo principal ── */}
            <div style={{ padding: '14px 0 40px' }}>

              {/* Timer de descanso */}
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

              {/* Card do exercício ativo */}
              {state.phase === 'exercise' && currentExercise && currentProgress && (
                <div
                  className="slide-up"
                  key={`${currentExercise.id}-${state.currentSetIndex}`}
                >
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

              {/* Lista dos próximos exercícios no bloco */}
              {state.phase === 'exercise' && currentBlock && (
                (() => {
                  const upcoming = currentBlock.exercises.slice(state.currentExerciseIndex + 1);
                  if (upcoming.length === 0) return null;
                  return (
                    <div style={{ margin: '18px 16px 0' }}>
                      <div style={{ fontSize: 9, color: '#4a4540', letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                        PRÓXIMOS NESTE BLOCO
                      </div>
                      {upcoming.map((ex, i) => (
                        <div key={ex.id} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '9px 13px',
                          background: '#161616', border: '1px solid #2a2a2a',
                          borderRadius: 8, marginBottom: 6, opacity: 0.6,
                        }}>
                          <span style={{ fontSize: 17, flexShrink: 0 }}>{ex.emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f0ede8', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {ex.name}
                            </div>
                            <div style={{ fontSize: 9, color: '#4a4540', fontFamily: 'var(--font-mono)' }}>
                              {ex.sets}× {ex.reps}
                            </div>
                          </div>
                          <div style={{ fontSize: 9, color: '#7a7068', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                            #{i + state.currentExerciseIndex + 2}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}

            </div>
          </>
        )}
      </div>
    </>
  );
}
