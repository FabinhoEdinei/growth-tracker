// ─────────────────────────────────────────────────────────────────────────────
// data/abs.ts — Treinos de Core / Abdômen
// ─────────────────────────────────────────────────────────────────────────────

import type { Workout } from '../types/gym';

// ── ABS EXPRESS (10min) ───────────────────────────────────────────────────────
export const WORKOUT_ABS_10: Workout = {
  id:           'abs-express-10',
  name:         'ABS EXPRESS',
  totalMinutes: 10,
  blocks: [
    {
      id:          'abs-express-block',
      name:        'CORE EXPRESS',
      description: 'Sequência rápida de abdômen — sem equipamento',
      exercises: [
        {
          id: 'plank-abs10', name: 'Prancha Isométrica',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 2, reps: '45s', restSeconds: 20, emoji: '🧱',
          cues: [
            'Contraia abdômen e glúteo forte',
            'Corpo em linha reta',
            'Respire sob tensão',
          ],
        },
        {
          id: 'bicycle-abs10', name: 'Bicicleta no Solo',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 2, reps: '20 (cada lado)', restSeconds: 20, emoji: '🚴',
          cues: [
            'Gire o tronco, não só os braços',
            'Movimento controlado',
            'Cotovelo encontra o joelho',
          ],
        },
        {
          id: 'leg-raise-abs10', name: 'Elevação de Pernas',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 2, reps: '12-15', restSeconds: 25, emoji: '🦵',
          cues: [
            'Suba controlado, desça em 3 segundos',
            'Lombar colada no chão',
            'Evite embalo',
          ],
        },
      ],
    },
  ],
};

// ── CORE INTENSO (15min) ──────────────────────────────────────────────────────
export const WORKOUT_ABS_FINISHER: Workout = {
  id:           'abs-finisher-15',
  name:         'CORE INTENSO',
  totalMinutes: 15,
  blocks: [
    {
      id:          'abs-finisher-block',
      name:        'CORE INTENSO',
      description: 'Estabilidade + abdômen inferior + resistência',
      exercises: [
        {
          id: 'dead-bug', name: 'Dead Bug',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 3, reps: '10 (cada lado)', restSeconds: 25, emoji: '🐞',
          cues: [
            'Lombar colada no chão o tempo todo',
            'Movimento lento e controlado',
            'Braço e perna opostos descem juntos',
            'Não perca a tensão do core',
          ],
        },
        {
          id: 'leg-raise-finisher', name: 'Elevação de Pernas',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 3, reps: '12-15', restSeconds: 30, emoji: '🦵',
          cues: [
            'Suba controlado, desça em 3 segundos',
            'Lombar colada no chão',
            'Evite embalo',
            'Foque no abdômen inferior',
          ],
        },
        {
          id: 'plank-finisher', name: 'Prancha Isométrica',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 2, reps: '45s', restSeconds: 20, emoji: '🧱',
          cues: [
            'Contraia abdômen e glúteo forte',
            'Corpo em linha reta',
            'Respire sob tensão',
          ],
        },
        {
          id: 'bicycle-finisher', name: 'Bicicleta no Solo',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 2, reps: '20 (cada lado)', restSeconds: 20, emoji: '🚴',
          cues: [
            'Gire o tronco, não só os braços',
            'Movimento controlado',
            'Cotovelo encontra o joelho',
          ],
        },
      ],
    },
  ],
};

// ── CORE PROTOCOL (20min) ─────────────────────────────────────────────────────
export const WORKOUT_ABS_PRO: Workout = {
  id:           'abs-pro-20',
  name:         'CORE PROTOCOL',
  totalMinutes: 20,
  blocks: [
    {
      id:          'abs-pro-block',
      name:        'CORE PROTOCOL',
      description: 'Treino avançado de core — alta tensão e controle',
      exercises: [
        {
          id: 'hollow-hold', name: 'Hollow Body Hold',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 3, reps: '30-40s', restSeconds: 20, emoji: '🔥',
          cues: [
            'Lombar colada no chão SEMPRE',
            'Braços e pernas estendidos',
            'Quanto mais baixo, mais difícil',
            'Tremendo = certo',
          ],
        },
        {
          id: 'leg-raise-pro', name: 'Elevação de Pernas',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 3, reps: '12-15', restSeconds: 25, emoji: '🦵',
          cues: [
            'Suba controlado',
            'Desça em 3-4 segundos',
            'Sem tirar a lombar do chão',
            'Zero embalo',
          ],
        },
        {
          id: 'dead-bug-pro', name: 'Dead Bug',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 2, reps: '12 (cada lado)', restSeconds: 20, emoji: '🐞',
          cues: [
            'Controle total',
            'Movimento lento',
            'Core sempre ativo',
          ],
        },
        {
          id: 'bicycle-pro', name: 'Bicicleta no Solo',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 2, reps: '25 (cada lado)', restSeconds: 15, emoji: '🚴',
          cues: [
            'Gire o tronco',
            'Movimento lento',
            'Sem pressa = mais difícil',
          ],
        },
      ],
    },
  ],
};
