// ─── Tipos do Gym Tracker ────────────────────────────────────────────────────

export type Equipment = 'barbell' | 'bodyweight' | 'both';
export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'legs' | 'glutes' | 'core' | 'fullbody';

export type WorkoutPhase = 'idle' | 'warmup' | 'exercise' | 'rest' | 'finished';

export interface Set {
  reps: number;
  weight?: string; // ex: "12-15kg" ou "corporal"
  done: boolean;
  timeMs?: number; // tempo real gasto na série (registrado ao completar)
}

export interface Exercise {
  id: string;
  name: string;
  equipment: Equipment;
  muscleGroup: MuscleGroup;
  sets: number;           // número de séries
  reps: string;           // ex: "12-15" ou "30s"
  restSeconds: number;    // descanso entre séries (segundos)
  weight?: string;        // sugestão de carga
  cues: string[];         // dicas de execução
  emoji: string;
}

export interface WorkoutBlock {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

export interface Workout {
  id: string;
  name: string;
  totalMinutes: number;
  blocks: WorkoutBlock[];
}

// ── Estado em runtime ────────────────────────────────────────────────────────

export interface ExerciseProgress {
  exerciseId: string;
  completedSets: number;
  sets: Set[];
}

export interface WorkoutState {
  phase: WorkoutPhase;
  currentBlockIndex: number;
  currentExerciseIndex: number;
  currentSetIndex: number;
  elapsedSeconds: number;       // tempo total do treino
  restSecondsLeft: number;      // countdown do descanso
  progress: Record<string, ExerciseProgress>;
  startedAt: number | null;     // timestamp
  finishedAt: number | null;
}
