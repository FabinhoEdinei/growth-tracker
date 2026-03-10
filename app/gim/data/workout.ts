// ─────────────────────────────────────────────────────────────────────────────
// data/workout.ts — Treino Full Body 45min (Halteres + Corpo Livre)
// ─────────────────────────────────────────────────────────────────────────────

import type { Workout } from '../types/gym';

export const WORKOUT_FULLBODY_45: Workout = {
  id:           'fullbody-45-dumbbell',
  name:         'FULL BODY 45MIN',
  totalMinutes: 45,
  blocks: [

    // ── AQUECIMENTO (5min) ────────────────────────────────────────────────────
    {
      id:          'warmup',
      name:        'AQUECIMENTO',
      description: '5 min para ativar articulações e elevar a frequência cardíaca',
      exercises: [
        {
          id: 'jumping-jacks', name: 'Jumping Jacks',
          equipment: 'bodyweight', muscleGroup: 'fullbody',
          sets: 1, reps: '30s', restSeconds: 15, emoji: '⚡',
          cues: ['Mantenha o core ativado', 'Aterrisse suavemente nos calcanhares', 'Ritmo constante e controlado'],
        },
        {
          id: 'arm-circles', name: 'Rotação de Ombros',
          equipment: 'bodyweight', muscleGroup: 'shoulders',
          sets: 1, reps: '20 (cada dir.)', restSeconds: 10, emoji: '🔄',
          cues: ['10 para frente, 10 para trás', 'Amplitude máxima do movimento', 'Respire de forma constante'],
        },
        {
          id: 'hip-circles', name: 'Rotação de Quadril',
          equipment: 'bodyweight', muscleGroup: 'glutes',
          sets: 1, reps: '10 (cada dir.)', restSeconds: 10, emoji: '🌀',
          cues: ['Mãos na cintura', 'Círculos amplos e lentos', 'Solte a tensão lombar'],
        },
        {
          id: 'squat-warmup', name: 'Agachamento Livre',
          equipment: 'bodyweight', muscleGroup: 'legs',
          sets: 1, reps: '15', restSeconds: 20, emoji: '🏋️',
          cues: ['Pés na largura dos ombros', 'Joelhos acompanham os dedos', 'Desça até 90° ou além'],
        },
      ],
    },

    // ── BLOCO A: PEITO + TRÍCEPS (10min) ─────────────────────────────────────
    {
      id:          'block-a',
      name:        'BLOCO A — PEITO + TRÍCEPS',
      description: 'Empurrar horizontal e vertical • 3 séries cada',
      exercises: [
        {
          id: 'dumbbell-press', name: 'Supino com Halteres',
          equipment: 'barbell', muscleGroup: 'chest',
          sets: 3, reps: '12-15', restSeconds: 45, weight: '10-16kg cada', emoji: '💪',
          cues: ['Escápulas retraídas e deprimidas no banco', 'Cotovelos a 45° do tronco', 'Suba explosivo, desça controlado (2s)', 'Toque os halteres no topo sem travar'],
        },
        {
          id: 'push-up', name: 'Flexão de Braço',
          equipment: 'bodyweight', muscleGroup: 'chest',
          sets: 3, reps: '10-15', restSeconds: 40, emoji: '⬇️',
          cues: ['Corpo rígido do calcanhar à cabeça', 'Mãos ligeiramente mais largas que ombros', 'Peito toca o chão — amplitude total', 'Expire na subida'],
        },
        {
          id: 'tricep-kickback', name: 'Tríceps Coice',
          equipment: 'barbell', muscleGroup: 'triceps',
          sets: 3, reps: '12', restSeconds: 40, weight: '6-10kg cada', emoji: '🔧',
          cues: ['Tronco paralelo ao chão', 'Cotovelo fixo — só o antebraço se move', 'Estenda completamente no topo', 'Faça 1s de pausa na extensão'],
        },
      ],
    },

    // ── BLOCO B: COSTAS + BÍCEPS (10min) ─────────────────────────────────────
    {
      id:          'block-b',
      name:        'BLOCO B — COSTAS + BÍCEPS',
      description: 'Puxar horizontal e rosca • 3 séries cada',
      exercises: [
        {
          id: 'bent-row', name: 'Remada Curvada',
          equipment: 'barbell', muscleGroup: 'back',
          sets: 3, reps: '12', restSeconds: 45, weight: '12-20kg cada', emoji: '🚣',
          cues: ['Quadril dobrado a 45°, coluna neutra', 'Puxe os cotovelos para trás e para cima', 'Escápulas se aproximam no topo', 'Desça controlado — não deixe cair'],
        },
        {
          id: 'renegade-row', name: 'Remada Renegade',
          equipment: 'both', muscleGroup: 'back',
          sets: 3, reps: '8 (cada lado)', restSeconds: 50, weight: '8-12kg cada', emoji: '🤸',
          cues: ['Posição de prancha sobre os halteres', 'Core ultra-contraído — não gire o quadril', 'Puxe o halter até o quadril', 'Alterne os lados com controle'],
        },
        {
          id: 'bicep-curl', name: 'Rosca Bíceps Alternada',
          equipment: 'barbell', muscleGroup: 'biceps',
          sets: 3, reps: '12 (cada)', restSeconds: 40, weight: '8-14kg cada', emoji: '💪',
          cues: ['Cotovelos colados ao tronco', 'Supine o punho ao subir', 'Desça sem jogar — 2-3 segundos', 'Extensão total na posição baixa'],
        },
      ],
    },

    // ── BLOCO C: PERNAS + GLÚTEOS (10min) ────────────────────────────────────
    {
      id:          'block-c',
      name:        'BLOCO C — PERNAS + GLÚTEOS',
      description: 'Força de membros inferiores • 3 séries cada',
      exercises: [
        {
          id: 'goblet-squat', name: 'Agachamento Goblet',
          equipment: 'barbell', muscleGroup: 'legs',
          sets: 3, reps: '15', restSeconds: 45, weight: '12-20kg', emoji: '🏆',
          cues: ['Halter na vertical contra o peito', 'Cotovelos empurram os joelhos para fora', 'Desça abaixo dos 90° se possível', 'Empurre o chão ao subir'],
        },
        {
          id: 'romanian-deadlift', name: 'Terra Romeno',
          equipment: 'barbell', muscleGroup: 'glutes',
          sets: 3, reps: '12', restSeconds: 50, weight: '14-22kg cada', emoji: '⚙️',
          cues: ['Joelhos levemente dobrados — não agacha', 'Halteres raspam as pernas', 'Sinta o alongamento dos isquiotibiais', 'Quadril vai para trás — não a barriga'],
        },
        {
          id: 'reverse-lunge', name: 'Avanço Reverso',
          equipment: 'barbell', muscleGroup: 'legs',
          sets: 3, reps: '10 (cada perna)', restSeconds: 45, weight: '8-12kg cada', emoji: '🦵',
          cues: ['Passo largo para trás', 'Joelho da frente não passa a ponta do pé', 'Tronco ereto durante todo o movimento', 'Empurre o chão para subir'],
        },
      ],
    },

    // ── BLOCO D: OMBROS + CORE (8min) ────────────────────────────────────────
    {
      id:          'block-d',
      name:        'BLOCO D — OMBROS + CORE',
      description: 'Estabilidade e força funcional • 3 séries cada',
      exercises: [
        {
          id: 'shoulder-press', name: 'Desenvolvimento',
          equipment: 'barbell', muscleGroup: 'shoulders',
          sets: 3, reps: '12', restSeconds: 40, weight: '8-14kg cada', emoji: '🎯',
          cues: ['Sentado ou em pé — core contraído', 'Cotovelos a 90° na posição inicial', 'Empurre acima da cabeça sem trancar', 'Não arqueie a lombar'],
        },
        {
          id: 'plank', name: 'Prancha Isométrica',
          equipment: 'bodyweight', muscleGroup: 'core',
          sets: 3, reps: '45s', restSeconds: 30, emoji: '🧱',
          cues: ['Cotovelos abaixo dos ombros', 'Quadril na linha do corpo', 'Aperte glúteo e core simultaneamente', 'Respire — não prenda o ar'],
        },
        {
          id: 'russian-twist', name: 'Russian Twist',
          equipment: 'barbell', muscleGroup: 'core',
          sets: 3, reps: '20 (total)', restSeconds: 30, weight: '4-8kg', emoji: '🌪️',
          cues: ['Pés levantados ou no chão para facilitar', 'Gire o tronco — não só os braços', 'Toque o halter lateralmente no chão', 'Core sempre contraído'],
        },
      ],
    },

    // ── FINALIZAÇÃO (2min) ────────────────────────────────────────────────────
    {
      id:          'cooldown',
      name:        'FINALIZAÇÃO',
      description: 'Alongamentos e desaceleração do organismo',
      exercises: [
        {
          id: 'child-pose', name: 'Postura da Criança',
          equipment: 'bodyweight', muscleGroup: 'back',
          sets: 1, reps: '45s', restSeconds: 10, emoji: '🧘',
          cues: ['Joelhos afastados', 'Braços estendidos à frente', 'Respire fundo e solte a tensão'],
        },
        {
          id: 'hip-flexor', name: 'Alongamento do Quadril',
          equipment: 'bodyweight', muscleGroup: 'glutes',
          sets: 1, reps: '30s cada', restSeconds: 10, emoji: '🦵',
          cues: ['Joelho no chão, avanço à frente', 'Empurre quadril para frente', 'Sinta o alongamento na frente da coxa'],
        },
        {
          id: 'chest-stretch', name: 'Abertura de Peito',
          equipment: 'bodyweight', muscleGroup: 'chest',
          sets: 1, reps: '30s', restSeconds: 0, emoji: '🤲',
          cues: ['Braços abertos para os lados', 'Cabeça para trás suavemente', 'Respire expandindo o peito'],
        },
      ],
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getTotalSets(workout: Workout): number {
  return workout.blocks.flatMap(b => b.exercises).reduce((acc, ex) => acc + ex.sets, 0);
}

export function getTotalExercises(workout: Workout): number {
  return workout.blocks.flatMap(b => b.exercises).length;
}
