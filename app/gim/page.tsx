'use client';

import { useWorkout } from './hooks/useWorkout';
import { WORKOUT_FULLBODY_45, getTotalExercises, getTotalSets } from './data/workout';
import {
  WorkoutHeader,
  BlockBadge,
  ExerciseCard,
  RestTimer,
  WorkoutIdle,
  WorkoutFinished,
} from './components';

// ─── Estilos globais + fontes industriais ────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --font-display: 'Barlow Condensed', sans-serif;
    --font-mono:    'Share Tech Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0e0e0e;
    color: #f0ede8;
    -webkit-font-smoothing: antialiased;
  }

  /* Scrollbar discreta */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #161616; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 99px; }

  /* Tap highlight off no mobile */
  * { -webkit-tap-highlight-color: transparent; }

  /* Animação entrada do card */
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .slide-up { animation: slideUp .35s ease-out forwards; }

  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(255,69,32,.4); }
    70%  { box-shadow: 0 0 0 10px rgba(255,69,32,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,69,32,0); }
  }
  .pulse { animation: pulse-ring 1.8s ease-out infinite; }
`;

// ─── Página principal ─────────────────────────────────────────────────────────

export default function GymTrackerPage() {
  const workout = WORKOUT_FULLBODY_45;

  const {
    state,
    currentBlock,
    currentExercise,
    currentProgress,
    isLastSet,
    overallProgress,
    startWorkout,
    completeSet,
    skipRest,
    resetWorkout,
    formatTime,
    getTotalCompletedSets,
  } = useWorkout(workout);

  const totalExercises = getTotalExercises(workout);
  const totalSets      = getTotalSets(workout);

  // Próximo exercício (para mostrar no descanso)
  const nextExercise = (() => {
    if (!currentBlock || !currentExercise) return undefined;
    const exIdx = state.currentExerciseIndex;
    const blIdx = state.currentBlockIndex;

    if (!isLastSet) return currentExercise.name; // próxima série do mesmo

    const nextInBlock = currentBlock.exercises[exIdx + 1];
    if (nextInBlock) return nextInBlock.name;

    const nextBlock = workout.blocks[blIdx + 1];
    if (nextBlock) return nextBlock.exercises[0]?.name;

    return undefined;
  })();

  return (
    <>
      {/* Injeção de estilos globais */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }}/>

      <div style={{
        minHeight: '100vh',
        background: '#0e0e0e',
        fontFamily: 'var(--font-display)',
      }}>

        {/* ── TELA IDLE ─────────────────────────────────────────────── */}
        {state.phase === 'idle' && (
          <WorkoutIdle
            totalMinutes={workout.totalMinutes}
            totalExercises={totalExercises}
            totalSets={totalSets}
            onStart={startWorkout}
          />
        )}

        {/* ── TELA FINALIZADO ───────────────────────────────────────── */}
        {state.phase === 'finished' && (
          <>
            <WorkoutHeader
              workoutName={workout.name}
              elapsedSeconds={state.elapsedSeconds}
              totalMinutes={workout.totalMinutes}
              overallProgress={100}
              completedSets={getTotalCompletedSets()}
              totalSets={totalSets}
              phase={state.phase}
              formatTime={formatTime}
            />
            <WorkoutFinished
              elapsedSeconds={state.elapsedSeconds}
              totalSets={getTotalCompletedSets()}
              formatTime={formatTime}
              onReset={resetWorkout}
            />
          </>
        )}

        {/* ── TREINO ATIVO ──────────────────────────────────────────── */}
        {(state.phase === 'exercise' || state.phase === 'rest' || state.phase === 'warmup') && (
          <>
            {/* Header sticky */}
            <WorkoutHeader
              workoutName={workout.name}
              elapsedSeconds={state.elapsedSeconds}
              totalMinutes={workout.totalMinutes}
              overallProgress={overallProgress}
              completedSets={getTotalCompletedSets()}
              totalSets={totalSets}
              phase={state.phase}
              formatTime={formatTime}
            />

            {/* ── Lista de blocos (navegação visual) */}
            <div style={{
              overflowX: 'auto', display: 'flex',
              borderBottom: '1px solid #2a2a2a',
            }}>
              {workout.blocks.map((block, i) => {
                const isActive    = i === state.currentBlockIndex;
                const isCompleted = i < state.currentBlockIndex;
                return (
                  <div key={block.id} style={{ minWidth: 180 }}>
                    <BlockBadge
                      block={block}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      index={i}
                    />
                  </div>
                );
              })}
            </div>

            {/* ── Progresso do bloco atual */}
            {currentBlock && (
              <div style={{
                padding: '14px 16px 10px',
                borderBottom: '1px solid #2a2a2a',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: 10, color: '#7a7068', letterSpacing: 2, fontFamily: 'var(--font-mono)' }}>
                    {currentBlock.name}
                  </span>
                  <span style={{ fontSize: 10, color: '#7a7068', fontFamily: 'var(--font-mono)' }}>
                    {state.currentExerciseIndex + 1}/{currentBlock.exercises.length}
                  </span>
                </div>
                <div style={{ height: 2, background: '#2a2a2a', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    background: '#ff4520',
                    width: `${((state.currentExerciseIndex) / currentBlock.exercises.length) * 100}%`,
                    transition: 'width .4s ease',
                  }}/>
                </div>
                {currentBlock.description && (
                  <div style={{ fontSize: 11, color: '#4a4540', marginTop: 6, lineHeight: 1.4 }}>
                    {currentBlock.description}
                  </div>
                )}
              </div>
            )}

            {/* ── Conteúdo principal: exercício ou descanso */}
            <div style={{ padding: '16px 0 32px' }}>

              {/* Timer de descanso */}
              {state.phase === 'rest' && currentExercise && (
                <div className="slide-up">
                  <RestTimer
                    secondsLeft={state.restSecondsLeft}
                    totalSeconds={currentExercise.restSeconds}
                    onSkip={skipRest}
                    formatTime={formatTime}
                    nextExerciseName={nextExercise}
                  />
                </div>
              )}

              {/* Card do exercício ativo */}
              {state.phase === 'exercise' && currentExercise && currentProgress && (
                <div className="slide-up" key={`${currentExercise.id}-${state.currentSetIndex}`}>
                  <ExerciseCard
                    exercise={currentExercise}
                    progress={currentProgress}
                    currentSetIndex={state.currentSetIndex}
                    phase={state.phase}
                    onCompleteSet={completeSet}
                  />
                </div>
              )}

              {/* Lista dos próximos exercícios do bloco */}
              {currentBlock && state.phase === 'exercise' && (
                <div style={{ margin: '20px 16px 0' }}>
                  <div style={{ fontSize: 9, color: '#4a4540', letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
                    PRÓXIMOS NESTE BLOCO
                  </div>
                  {currentBlock.exercises
                    .slice(state.currentExerciseIndex + 1)
                    .map((ex, i) => (
                      <div key={ex.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px',
                        background: '#161616',
                        border: '1px solid #2a2a2a',
                        borderRadius: 8,
                        marginBottom: 6,
                        opacity: 0.65,
                      }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{ex.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#f0ede8', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ex.name}
                          </div>
                          <div style={{ fontSize: 10, color: '#4a4540', fontFamily: 'var(--font-mono)' }}>
                            {ex.sets}× {ex.reps}
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: '#7a7068', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                          #{i + state.currentExerciseIndex + 2}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
