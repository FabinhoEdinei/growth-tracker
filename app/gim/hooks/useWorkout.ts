'use client';

// ─────────────────────────────────────────────────────────────────────────────
// hooks/useWorkout.ts — Toda a lógica de estado e timer do treino
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Workout, WorkoutState, ExerciseProgress } from '../types/gym';

// ── Inicialização ─────────────────────────────────────────────────────────────

function buildInitialProgress(workout: Workout): Record<string, ExerciseProgress> {
  const progress: Record<string, ExerciseProgress> = {};
  for (const block of workout.blocks) {
    for (const ex of block.exercises) {
      progress[ex.id] = {
        exerciseId:    ex.id,
        completedSets: 0,
        sets: Array.from({ length: ex.sets }, () => ({ reps: 0, done: false })),
      };
    }
  }
  return progress;
}

function buildIdleState(workout: Workout): WorkoutState {
  return {
    phase:                'idle',
    currentBlockIndex:    0,
    currentExerciseIndex: 0,
    currentSetIndex:      0,
    elapsedSeconds:       0,
    restSecondsLeft:      0,
    progress:             buildInitialProgress(workout),
    startedAt:            null,
    finishedAt:           null,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useWorkout(workout: Workout) {
  const [state, setState] = useState<WorkoutState>(() => buildIdleState(workout));

  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  // ── Derivações de contexto atual ─────────────────────────────────────────

  const currentBlock    = workout.blocks[state.currentBlockIndex] ?? null;
  const currentExercise = currentBlock?.exercises[state.currentExerciseIndex] ?? null;
  const currentProgress = currentExercise ? state.progress[currentExercise.id] : null;

  const isLastSet      = currentExercise ? state.currentSetIndex >= currentExercise.sets - 1 : false;
  const isLastExercise = currentBlock    ? state.currentExerciseIndex >= currentBlock.exercises.length - 1 : false;
  const isLastBlock    = state.currentBlockIndex >= workout.blocks.length - 1;

  // ── Timer ─────────────────────────────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.phase === 'rest') {
          const next = prev.restSecondsLeft - 1;
          if (next <= 0) return { ...prev, phase: 'exercise', restSecondsLeft: 0 };
          return { ...prev, restSecondsLeft: next };
        }
        if (prev.phase === 'exercise') {
          elapsedRef.current += 1;
          return { ...prev, elapsedSeconds: elapsedRef.current };
        }
        return prev;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  // ── Função interna: avança para próximo set / exercício / bloco ───────────

  function advance(
    prev: WorkoutState,
    progress: Record<string, ExerciseProgress>,
  ): WorkoutState {
    const block = workout.blocks[prev.currentBlockIndex];
    const ex    = block.exercises[prev.currentExerciseIndex];

    // Próxima série do mesmo exercício
    if (prev.currentSetIndex < ex.sets - 1) {
      return { ...prev, progress, phase: 'exercise', currentSetIndex: prev.currentSetIndex + 1, restSecondsLeft: 0 };
    }
    // Próximo exercício no mesmo bloco
    if (prev.currentExerciseIndex < block.exercises.length - 1) {
      return { ...prev, progress, phase: 'exercise', currentExerciseIndex: prev.currentExerciseIndex + 1, currentSetIndex: 0, restSecondsLeft: 0 };
    }
    // Próximo bloco
    if (prev.currentBlockIndex < workout.blocks.length - 1) {
      return { ...prev, progress, phase: 'exercise', currentBlockIndex: prev.currentBlockIndex + 1, currentExerciseIndex: 0, currentSetIndex: 0, restSecondsLeft: 0 };
    }
    // Fim do treino
    stopTimer();
    return { ...prev, progress, phase: 'finished', finishedAt: Date.now() };
  }

  // ── Ações públicas ────────────────────────────────────────────────────────

  /** Inicia o treino */
  const startWorkout = useCallback(() => {
    elapsedRef.current = 0;
    setState(prev => ({ ...prev, phase: 'exercise', startedAt: Date.now(), elapsedSeconds: 0 }));
    startTimer();
  }, [startTimer]);

  /** Completa a série atual e decide: descanso, próximo set ou próximo exercício */
  const completeSet = useCallback(() => {
    setState(prev => {
      if (!currentExercise) return prev;

      // Marca a série como concluída
      const updatedSets = [...prev.progress[currentExercise.id].sets];
      updatedSets[prev.currentSetIndex] = { ...updatedSets[prev.currentSetIndex], done: true, timeMs: Date.now() };

      const updatedProgress: Record<string, ExerciseProgress> = {
        ...prev.progress,
        [currentExercise.id]: {
          ...prev.progress[currentExercise.id],
          completedSets: prev.progress[currentExercise.id].completedSets + 1,
          sets: updatedSets,
        },
      };

      // Último set do último exercício do último bloco → termina
      if (isLastSet && isLastExercise && isLastBlock) {
        stopTimer();
        return { ...prev, progress: updatedProgress, phase: 'finished', finishedAt: Date.now() };
      }

      // Tem descanso configurado → entra em fase de rest
      if (currentExercise.restSeconds > 0) {
        return { ...prev, progress: updatedProgress, phase: 'rest', restSecondsLeft: currentExercise.restSeconds };
      }

      // Sem descanso → avança direto
      return advance(prev, updatedProgress);
    });
  }, [currentExercise, isLastSet, isLastExercise, isLastBlock, stopTimer]);

  /** Pula o descanso atual, avança para próximo set/exercício */
  const skipRest = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'rest') return prev;
      return advance(prev, prev.progress);
    });
  }, []);

  /** Pula o exercício atual inteiro (avança para o próximo) */
  const skipExercise = useCallback(() => {
    setState(prev => {
      if (prev.phase === 'idle' || prev.phase === 'finished') return prev;
      return advance(prev, prev.progress);
    });
  }, []);

  /** Reinicia o treino do zero */
  const resetWorkout = useCallback(() => {
    stopTimer();
    elapsedRef.current = 0;
    setState(buildIdleState(workout));
  }, [workout, stopTimer]);

  // ── Utilitários ───────────────────────────────────────────────────────────

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getTotalCompletedSets = (): number =>
    Object.values(state.progress).reduce((sum, p) => sum + p.completedSets, 0);

  const getTotalSets = (): number =>
    workout.blocks.flatMap(b => b.exercises).reduce((sum, ex) => sum + ex.sets, 0);

  const overallProgress = Math.round((getTotalCompletedSets() / Math.max(getTotalSets(), 1)) * 100);

  // ── Próximo exercício (para exibir no descanso) ───────────────────────────

  const nextExerciseName = (() => {
    if (!currentBlock || !currentExercise) return undefined;
    if (!isLastSet) return currentExercise.name;
    const nextInBlock = currentBlock.exercises[state.currentExerciseIndex + 1];
    if (nextInBlock) return nextInBlock.name;
    return workout.blocks[state.currentBlockIndex + 1]?.exercises[0]?.name;
  })();

  return {
    state,
    currentBlock,
    currentExercise,
    currentProgress,
    isLastSet,
    overallProgress,
    nextExerciseName,
    // ações
    startWorkout,
    completeSet,
    skipRest,
    skipExercise,
    resetWorkout,
    // utilitários
    formatTime,
    getTotalCompletedSets,
    getTotalSets,
  };
}
