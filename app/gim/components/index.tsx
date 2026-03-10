'use client';

import React from 'react';
import type { Exercise, WorkoutBlock, WorkoutState, ExerciseProgress } from '../types/gym';

// ─── Constantes de tema ───────────────────────────────────────────────────────

const T = {
  bg:        '#0e0e0e',
  surface:   '#161616',
  elevated:  '#1e1e1e',
  border:    '#2a2a2a',
  borderHot: '#ff4520',
  accent:    '#ff4520',  // laranja-ferrugem (ferro)
  accentAlt: '#e8b84b',  // dourado sujo
  text:      '#f0ede8',
  textMuted: '#7a7068',
  textDim:   '#4a4540',
  success:   '#4caf72',
  rest:      '#3d6bff',
} as const;

// ── Tipografia: fonte industrial ─────────────────────────────────────────────
// Injetada via style tag no componente raiz

// ─── WorkoutHeader ───────────────────────────────────────────────────────────

interface WorkoutHeaderProps {
  workoutName: string;
  elapsedSeconds: number;
  totalMinutes: number;
  overallProgress: number;
  completedSets: number;
  totalSets: number;
  phase: WorkoutState['phase'];
  formatTime: (s: number) => string;
}

export function WorkoutHeader({
  workoutName, elapsedSeconds, totalMinutes,
  overallProgress, completedSets, totalSets,
  phase, formatTime,
}: WorkoutHeaderProps) {
  const targetSeconds = totalMinutes * 60;
  const timeProgress  = Math.min((elapsedSeconds / targetSeconds) * 100, 100);

  return (
    <header style={{
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      padding: '16px 20px 12px',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Nome + tempo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: T.textMuted, fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
            GYM TRACKER
          </div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900, letterSpacing: 1, color: T.text, fontFamily: 'var(--font-display)' }}>
            {workoutName}
          </h1>
        </div>

        {/* Timer principal */}
        <div style={{
          background: phase === 'rest' ? `${T.rest}22` : `${T.accent}18`,
          border: `1px solid ${phase === 'rest' ? T.rest : T.accent}44`,
          borderRadius: 8, padding: '8px 14px', textAlign: 'center',
        }}>
          <div style={{
            fontSize: 26, fontWeight: 900, fontFamily: 'var(--font-mono)',
            color: phase === 'rest' ? T.rest : T.accent,
            lineHeight: 1, letterSpacing: 2,
          }}>
            {formatTime(elapsedSeconds)}
          </div>
          <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 1, marginTop: 2 }}>
            META {totalMinutes}MIN
          </div>
        </div>
      </div>

      {/* Barra de progresso tempo */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ height: 3, background: T.border, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${T.accent}, ${T.accentAlt})`,
            width: `${timeProgress}%`,
            transition: 'width 1s linear',
          }}/>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 99,
            background: `conic-gradient(${T.accent} ${overallProgress * 3.6}deg, ${T.border} 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 99, background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, color: T.accent, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {overallProgress}%
              </span>
            </div>
          </div>
          <span style={{ fontSize: 11, color: T.textMuted, fontFamily: 'var(--font-mono)' }}>
            {completedSets}/{totalSets} séries
          </span>
        </div>

        {phase !== 'idle' && phase !== 'finished' && (
          <div style={{
            marginLeft: 'auto', fontSize: 9, letterSpacing: 2,
            color: phase === 'rest' ? T.rest : T.success,
            fontFamily: 'var(--font-mono)',
            padding: '3px 8px', border: `1px solid currentColor`,
            borderRadius: 4, opacity: 0.85,
          }}>
            {phase === 'rest' ? '⏸ DESCANSO' : '▶ ATIVO'}
          </div>
        )}
      </div>
    </header>
  );
}

// ─── BlockBadge ──────────────────────────────────────────────────────────────

interface BlockBadgeProps {
  block: WorkoutBlock;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

export function BlockBadge({ block, isActive, isCompleted, index }: BlockBadgeProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 16px',
      background: isActive ? `${T.accent}12` : isCompleted ? `${T.success}08` : T.surface,
      borderLeft: `3px solid ${isActive ? T.accent : isCompleted ? T.success : T.border}`,
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 4,
        background: isActive ? T.accent : isCompleted ? T.success : T.elevated,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 900, color: isActive || isCompleted ? '#000' : T.textMuted,
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
      }}>
        {isCompleted ? '✓' : String.fromCharCode(65 + index)}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? T.text : T.textMuted, letterSpacing: 1, fontFamily: 'var(--font-display)' }}>
          {block.name}
        </div>
        <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>
          {block.exercises.length} exercícios
        </div>
      </div>
    </div>
  );
}

// ─── ExerciseCard ─────────────────────────────────────────────────────────────

interface ExerciseCardProps {
  exercise: Exercise;
  progress: ExerciseProgress;
  currentSetIndex: number;
  phase: WorkoutState['phase'];
  onCompleteSet: () => void;
}

export function ExerciseCard({
  exercise, progress, currentSetIndex, phase, onCompleteSet,
}: ExerciseCardProps) {
  const isResting = phase === 'rest';

  return (
    <div style={{
      background: T.elevated,
      border: `1px solid ${isResting ? T.rest + '44' : T.accent + '33'}`,
      borderRadius: 12,
      overflow: 'hidden',
      margin: '0 16px',
      boxShadow: `0 4px 24px ${isResting ? T.rest : T.accent}12`,
      transition: 'border-color .3s, box-shadow .3s',
    }}>

      {/* Cabeçalho do exercício */}
      <div style={{
        background: `linear-gradient(135deg, ${T.surface} 0%, ${T.elevated} 100%)`,
        padding: '18px 20px 14px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>{exercise.emoji}</span>
              <div>
                <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
                  {exercise.equipment === 'barbell' ? '🏋️ HALTERE' : exercise.equipment === 'bodyweight' ? '🤸 CORPO LIVRE' : '🏋️🤸 MISTO'}
                  {' · '}
                  {exercise.muscleGroup.toUpperCase()}
                </div>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: T.text, letterSpacing: 0.5, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                  {exercise.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Info reps/carga */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.accent, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {exercise.reps}
            </div>
            <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 1 }}>REPS</div>
            {exercise.weight && (
              <div style={{ fontSize: 11, color: T.accentAlt, fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                {exercise.weight}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Séries */}
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
          SÉRIES
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: exercise.sets }, (_, i) => {
            const isDone    = progress.sets[i]?.done;
            const isActive  = i === currentSetIndex && !isResting;
            const isFuture  = i > currentSetIndex;
            return (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: 8,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: isDone
                  ? `${T.success}22`
                  : isActive
                  ? `${T.accent}22`
                  : T.surface,
                border: `2px solid ${isDone ? T.success : isActive ? T.accent : T.border}`,
                transition: 'all .25s',
                transform: isActive ? 'scale(1.12)' : 'scale(1)',
              }}>
                <span style={{
                  fontSize: isDone ? 16 : 13,
                  color: isDone ? T.success : isActive ? T.accent : T.textDim,
                  fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>
                  {isDone ? '✓' : i + 1}
                </span>
                {isActive && !isDone && (
                  <span style={{ fontSize: 7, color: T.accent, letterSpacing: 1 }}>ATI</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dicas de execução */}
      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
          EXECUÇÃO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {exercise.cues.map((cue, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: T.accent, fontSize: 10, marginTop: 1, flexShrink: 0 }}>▸</span>
              <span style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{cue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de completar série */}
      {!isResting && (
        <div style={{ padding: '16px 20px' }}>
          <button
            onClick={onCompleteSet}
            style={{
              width: '100%', padding: '16px',
              background: `linear-gradient(135deg, ${T.accent} 0%, #d03010 100%)`,
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 14, fontWeight: 900,
              letterSpacing: 2, fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${T.accent}44`,
              transition: 'transform .1s, box-shadow .1s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ✓ SÉRIE {currentSetIndex + 1} CONCLUÍDA
          </button>
        </div>
      )}
    </div>
  );
}

// ─── RestTimer ───────────────────────────────────────────────────────────────

interface RestTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  onSkip: () => void;
  formatTime: (s: number) => string;
  nextExerciseName?: string;
}

export function RestTimer({ secondsLeft, totalSeconds, onSkip, formatTime, nextExerciseName }: RestTimerProps) {
  const progress  = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const radius    = 52;
  const circ      = 2 * Math.PI * radius;
  const dashOffset = circ - (progress / 100) * circ;
  const isUrgent  = secondsLeft <= 5;

  return (
    <div style={{
      margin: '0 16px',
      background: `${T.rest}10`,
      border: `1px solid ${T.rest}44`,
      borderRadius: 12,
      padding: '28px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 9, color: T.rest, letterSpacing: 3, fontFamily: 'var(--font-mono)', marginBottom: 20, opacity: 0.8 }}>
        ⏸ &nbsp; DESCANSO ATIVO
      </div>

      {/* Anel de progresso */}
      <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto 20px' }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="65" cy="65" r={radius} fill="none" stroke={T.border} strokeWidth="6"/>
          {/* Progress */}
          <circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke={isUrgent ? T.accent : T.rest}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s' }}
          />
        </svg>
        {/* Número central */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 36, fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            color: isUrgent ? T.accent : T.rest,
            lineHeight: 1,
            transition: 'color .3s',
          }}>
            {secondsLeft}
          </span>
          <span style={{ fontSize: 10, color: T.textMuted, letterSpacing: 1 }}>seg</span>
        </div>
      </div>

      {nextExerciseName && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
            PRÓXIMO
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: 'var(--font-display)' }}>
            {nextExerciseName}
          </div>
        </div>
      )}

      <button
        onClick={onSkip}
        style={{
          padding: '12px 32px',
          background: 'transparent',
          border: `1px solid ${T.rest}66`,
          borderRadius: 8, color: T.rest,
          fontSize: 11, fontWeight: 700, letterSpacing: 2,
          fontFamily: 'var(--font-mono)', cursor: 'pointer',
          transition: 'background .2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = `${T.rest}18`)}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        PULAR DESCANSO ▶
      </button>
    </div>
  );
}

// ─── WorkoutIdle (tela de início) ─────────────────────────────────────────────

interface WorkoutIdleProps {
  totalMinutes: number;
  totalExercises: number;
  totalSets: number;
  onStart: () => void;
}

export function WorkoutIdle({ totalMinutes, totalExercises, totalSets, onStart }: WorkoutIdleProps) {
  return (
    <div style={{ padding: '32px 20px', textAlign: 'center' }}>
      {/* Logo / ícone */}
      <div style={{
        width: 88, height: 88, borderRadius: 20,
        background: `linear-gradient(135deg, ${T.accent}22, ${T.accentAlt}11)`,
        border: `1px solid ${T.accent}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
        fontSize: 40,
        boxShadow: `0 8px 32px ${T.accent}18`,
      }}>
        🏋️
      </div>

      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: T.text, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
        FULL BODY 45 MIN
      </h2>
      <p style={{ margin: '0 0 28px', fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
        Halteres + Corpo Livre • Alta Intensidade
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'MINUTOS', value: totalMinutes, icon: '⏱' },
          { label: 'EXERCÍCIOS', value: totalExercises, icon: '💪' },
          { label: 'SÉRIES', value: totalSets, icon: '🔁' },
        ].map(s => (
          <div key={s.label} style={{
            background: T.elevated, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: '14px 8px',
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.accent, fontFamily: 'var(--font-mono)' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 8, color: T.textMuted, letterSpacing: 2, marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{
          width: '100%', padding: '18px',
          background: `linear-gradient(135deg, ${T.accent} 0%, #c02800 100%)`,
          border: 'none', borderRadius: 12,
          color: '#fff', fontSize: 16, fontWeight: 900,
          letterSpacing: 3, fontFamily: 'var(--font-display)',
          cursor: 'pointer',
          boxShadow: `0 6px 28px ${T.accent}44`,
          transition: 'transform .1s',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.98)')}
        onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        ▶ &nbsp; INICIAR TREINO
      </button>
    </div>
  );
}

// ─── WorkoutFinished ──────────────────────────────────────────────────────────

interface WorkoutFinishedProps {
  elapsedSeconds: number;
  totalSets: number;
  formatTime: (s: number) => string;
  onReset: () => void;
}

export function WorkoutFinished({ elapsedSeconds, totalSets, formatTime, onReset }: WorkoutFinishedProps) {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
      <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 900, color: T.accentAlt, fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
        TREINO CONCLUÍDO
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: 13, color: T.textMuted }}>
        Você destruiu esse treino. Recupere-se bem.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'TEMPO TOTAL', value: formatTime(elapsedSeconds), icon: '⏱' },
          { label: 'SÉRIES FEITAS', value: String(totalSets), icon: '✅' },
        ].map(s => (
          <div key={s.label} style={{
            background: T.elevated, border: `1px solid ${T.accentAlt}33`,
            borderRadius: 12, padding: '20px 12px',
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: T.accentAlt, fontFamily: 'var(--font-mono)' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 8, color: T.textMuted, letterSpacing: 2, marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        style={{
          width: '100%', padding: '16px',
          background: T.elevated,
          border: `1px solid ${T.border}`,
          borderRadius: 12, color: T.text,
          fontSize: 13, fontWeight: 700, letterSpacing: 2,
          fontFamily: 'var(--font-display)', cursor: 'pointer',
        }}
      >
        🔄 &nbsp; NOVO TREINO
      </button>
    </div>
  );
}
