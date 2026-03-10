'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Workout, WorkoutState, WorkoutPhase, ExerciseProgress } from '../types/gym';

// ─── Estado inicial ───────────────────────────────────────────────────────────

function buildInitialProgress(workout: Workout): Record<string, ExerciseProgress> {
  const progress: Record<string, ExerciseProgress> = {};
  for (const block of workout.blocks) {
    for (const exercise of block.exercises) {
      progress[exercise.id] = {
        exerciseId: exercise.id,
        completedSets: 0,
        sets: Array.from({ length: exercise.sets }, () => ({
          reps: 0,
          done: false,
        })),
      };
    }
  }
  return progress;
}

const INITIAL_STATE: WorkoutState = {
  phase: 'idle',
  currentBlockIndex: 0,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  elapsedSeconds: 0,
  restSecondsLeft: 0,
  progress: {},
  startedAt: null,
  finishedAt: null,
};

// ─── Hook principal ───────────────────────────────────────────────────────────

export function useWorkout(workout: Workout) {
  const [state, setState] = useState<WorkoutState>({
    ...INITIAL_STATE,
    progress: buildInitialProgress(workout),
  });

  const elapsedRef = useRef(0);
  const restRef    = useRef(0);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Helpers de navegação ─────────────────────────────────────────────────

  const currentBlock    = workout.blocks[state.currentBlockIndex];
  const currentExercise = currentBlock?.exercises[state.currentExerciseIndex] ?? null;
  const currentProgress = currentExercise
    ? state.progress[currentExercise.id]
    : null;

  const isLastSet = currentExercise
    ? state.currentSetIndex >= currentExercise.sets - 1
    : false;

  const isLastExercise = currentBlock
    ? state.currentExerciseIndex >= currentBlock.exercises.length - 1
    : false;

  const isLastBlock = state.currentBlockIndex >= workout.blocks.length - 1;

  // ── Tick do timer ────────────────────────────────────────────────────────

  const startTick = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setState(prev => {
        // Fase de descanso: countdown
        if (prev.phase === 'rest') {
          const newRest = prev.restSecondsLeft - 1;
          restRef.current = newRest;

          if (newRest <= 0) {
            // Descanso acabou → volta para exercício
            return { ...prev, phase: 'exercise', restSecondsLeft: 0 };
          }
          return { ...prev, restSecondsLeft: newRest };
        }

        // Fase de exercício / aquecimento: só conta tempo total
        if (prev.phase === 'exercise' || prev.phase === 'warmup') {
          elapsedRef.current += 1;
          return { ...prev, elapsedSeconds: elapsedRef.current };
        }

        return prev;
      });
    }, 1000);
  }, []);

  const stopTick = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => stopTick();
  }, [stopTick]);

  // ── Ações públicas ───────────────────────────────────────────────────────

  /** Inicia o treino */
  const startWorkout = useCallback(() => {
    elapsedRef.current = 0;
    setState(prev => ({
      ...prev,
      phase: 'exercise',
      startedAt: Date.now(),
      elapsedSeconds: 0,
    }));
    startTick();
  }, [startTick]);

  /** Marca a série atual como concluída e avança */
  const completeSet = useCallback(() => {
    setState(prev => {
      if (!currentExercise) return prev;

      // Marca a série como feita
      const updatedSets = [...prev.progress[currentExercise.id].sets];
      updatedSets[prev.currentSetIndex] = {
        ...updatedSets[prev.currentSetIndex],
        done: true,
        timeMs: Date.now(),
      };

      const updatedProgress: Record<string, ExerciseProgress> = {
        ...prev.progress,
        [currentExercise.id]: {
          ...prev.progress[currentExercise.id],
          completedSets: prev.progress[currentExercise.id].completedSets + 1,
          sets: updatedSets,
        },
      };

      // Última série do último exercício do último bloco → fim
      if (isLastSet && isLastExercise && isLastBlock) {
        stopTick();
        return {
          ...prev,
          progress: updatedProgress,
          phase: 'finished',
          finishedAt: Date.now(),
        };
      }

      // Tem descanso → fase de rest
      const rest = currentExercise.restSeconds;
      if (rest > 0) {
        restRef.current = rest;
        return {
          ...prev,
          progress: updatedProgress,
          phase: 'rest',
          restSecondsLeft: rest,
        };
      }

      // Sem descanso → avança direto
      return advance(prev, updatedProgress);
    });
  }, [currentExercise, isLastSet, isLastExercise, isLastBlock, stopTick]);

  /** Pula o descanso atual */
  const skipRest = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'rest') return prev;
      return advance(prev, prev.progress);
    });
  }, []);

  /** Reinicia o treino */
  const resetWorkout = useCallback(() => {
    stopTick();
    elapsedRef.current = 0;
    restRef.current = 0;
    setState({
      ...INITIAL_STATE,
      progress: buildInitialProgress(workout),
    });
  }, [workout, stopTick]);

  // ── Função interna de avanço ─────────────────────────────────────────────

  function advance(
    prev: WorkoutState,
    updatedProgress: Record<string, ExerciseProgress>,
  ): WorkoutState {
    const block    = workout.blocks[prev.currentBlockIndex];
    const exercise = block.exercises[prev.currentExerciseIndex];

    // Ainda tem séries no exercício atual
    if (prev.currentSetIndex < exercise.sets - 1) {
      return {
        ...prev,
        progress: updatedProgress,
        phase: 'exercise',
        currentSetIndex: prev.currentSetIndex + 1,
        restSecondsLeft: 0,
      };
    }

    // Ainda tem exercícios no bloco atual
    if (prev.currentExerciseIndex < block.exercises.length - 1) {
      return {
        ...prev,
        progress: updatedProgress,
        phase: 'exercise',
        currentExerciseIndex: prev.currentExerciseIndex + 1,
        currentSetIndex: 0,
        restSecondsLeft: 0,
      };
    }

    // Próximo bloco
    if (prev.currentBlockIndex < workout.blocks.length - 1) {
      return {
        ...prev,
        progress: updatedProgress,
        phase: 'exercise',
        currentBlockIndex: prev.currentBlockIndex + 1,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        restSecondsLeft: 0,
      };
    }

    // Acabou
    stopTick();
    return {
      ...prev,
      progress: updatedProgress,
      phase: 'finished',
      finishedAt: Date.now(),
    };
  }

  // ── Utilitários de formatação ─────────────────────────────────────────────

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function getTotalCompletedSets(): number {
    return Object.values(state.progress).reduce(
      (sum, p) => sum + p.completedSets, 0,
    );
  }

  function getTotalSets(): number {
    return workout.blocks
      .flatMap(b => b.exercises)
      .reduce((sum, ex) => sum + ex.sets, 0);
  }

  const overallProgress = getTotalSets() > 0
    ? Math.round((getTotalCompletedSets() / getTotalSets()) * 100)
    : 0;

  return {
    // Estado
    state,
    currentBlock,
    currentExercise,
    currentProgress,
    isLastSet,
    isLastExercise,
    isLastBlock,
    overallProgress,

    // Ações
    startWorkout,
    completeSet,
    skipRest,
    resetWorkout,

    // Formatação
    formatTime,
    getTotalCompletedSets,
    getTotalSets,
  };
}
