// ─────────────────────────────────────────────────────────────────────────────
// types/gym.ts — Todos os tipos do Gym Tracker
// ─────────────────────────────────────────────────────────────────────────────

export type Equipment    = 'barbell' | 'bodyweight' | 'both';
export type MuscleGroup  = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'glutes' | 'core' | 'fullbody';
export type WorkoutPhase = 'idle' | 'exercise' | 'rest' | 'finished';

// ── Estrutura estática do treino ──────────────────────────────────────────────

export interface Set {
  reps:    number;
  done:    boolean;
  timeMs?: number; // timestamp ao concluir
}

export interface Exercise {
  id:          string;
  name:        string;
  equipment:   Equipment;
  muscleGroup: MuscleGroup;
  sets:        number;
  reps:        string;      // ex: "12-15" | "45s" | "10 (cada lado)"
  restSeconds: number;
  weight?:     string;      // sugestão de carga
  cues:        string[];    // dicas de execução (máx 4)
  emoji:       string;
}

export interface WorkoutBlock {
  id:          string;
  name:        string;
  description: string;
  exercises:   Exercise[];
}

export interface Workout {
  id:           string;
  name:         string;
  totalMinutes: number;
  blocks:       WorkoutBlock[];
}

// ── Estado em runtime ─────────────────────────────────────────────────────────

export interface ExerciseProgress {
  exerciseId:    string;
  completedSets: number;
  sets:          Set[];
}

export interface WorkoutState {
  phase:                WorkoutPhase;
  currentBlockIndex:    number;
  currentExerciseIndex: number;
  currentSetIndex:      number;
  elapsedSeconds:       number;      // tempo total do treino (segundos)
  restSecondsLeft:      number;      // countdown descanso
  progress:             Record<string, ExerciseProgress>;
  startedAt:            number | null;
  finishedAt:           number | null;
}
