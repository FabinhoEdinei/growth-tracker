// ─────────────────────────────────────────────────────────────────────────────
// data/workouts.ts — Catálogo central de todos os treinos
// ─────────────────────────────────────────────────────────────────────────────

import type { Workout } from '../types/gym';
import { WORKOUT_FULLBODY_45 } from './fullbody';
import { WORKOUT_ABS_10, WORKOUT_ABS_FINISHER, WORKOUT_ABS_PRO } from './abs';

export const WORKOUT_META: Record<string, { icon: string; description: string }> = {
  'fullbody-45-dumbbell': { icon: '🏋️', description: 'Treino completo com halteres' },
  'abs-express-10':       { icon: '🔥', description: 'Core rápido, sem equipamento' },
  'abs-finisher-15':      { icon: '💥', description: 'Estabilidade + abdômen inferior' },
  'abs-pro-20':           { icon: '⚡', description: 'Alta tensão e controle total' },
};

export const WORKOUTS: Workout[] = [
  WORKOUT_FULLBODY_45,
  WORKOUT_ABS_10,
  WORKOUT_ABS_FINISHER,
  WORKOUT_ABS_PRO,
];

export function getWorkoutMeta(id: string) {
  return WORKOUT_META[id] ?? { icon: '💪', description: '' };
}

export function getTotalSets(workout: Workout): number {
  return workout.blocks
    .flatMap(b => b.exercises)
    .reduce((acc, ex) => acc + ex.sets, 0);
}

export function getTotalExercises(workout: Workout): number {
  return workout.blocks.flatMap(b => b.exercises).length;
}
