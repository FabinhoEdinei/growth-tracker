'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/index.tsx — Todos os componentes do Gym Tracker
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import type { Exercise, WorkoutBlock, WorkoutState, ExerciseProgress } from '../types/gym';

// ── Tema ──────────────────────────────────────────────────────────────────────

const T = {
  bg:       '#0e0e0e',
  surface:  '#161616',
  elevated: '#1e1e1e',
  card:     '#222222',
  border:   '#2a2a2a',
  accent:   '#ff4520',   // laranja-ferrugem
  gold:     '#e8b84b',   // dourado sujo
  text:     '#f0ede8',
  muted:    '#7a7068',
  dim:      '#4a4540',
  success:  '#4caf72',
  rest:     '#3d6bff',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// WorkoutHeader — sticky com nome + barra de progresso + stats
// ─────────────────────────────────────────────────────────────────────────────

interface WorkoutHeaderProps {
  workoutName:     string;
  elapsedSeconds:  number;
  totalMinutes:    number;
  overallProgress: number;
  completedSets:   number;
  totalSets:       number;
  phase:           WorkoutState['phase'];
  formatTime:      (s: number) => string;
}

export function WorkoutHeader({
  workoutName, elapsedSeconds, totalMinutes,
  overallProgress, completedSets, totalSets, phase, formatTime,
}: WorkoutHeaderProps) {
  const timeProgress = Math.min((elapsedSeconds / (totalMinutes * 60)) * 100, 100);

  return (
    <header style={{
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      padding: '14px 18px 10px',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Linha 1: nome + badge de status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: T.muted, fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
            GYM TRACKER
          </div>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 900, letterSpacing: 1, color: T.text, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {workoutName}
          </h1>
        </div>

        {phase !== 'idle' && phase !== 'finished' && (
          <div style={{
            fontSize: 9, letterSpacing: 2,
            color: phase === 'rest' ? T.rest : T.success,
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            border: `1px solid currentColor`,
            borderRadius: 4, opacity: 0.9,
          }}>
            {phase === 'rest' ? '⏸ DESCANSO' : '▶ ATIVO'}
          </div>
        )}
      </div>

      {/* Barra de tempo */}
      <div style={{ height: 2, background: T.border, borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: `linear-gradient(90deg, ${T.accent}, ${T.gold})`,
          width: `${timeProgress}%`,
          transition: 'width 1s linear',
        }}/>
      </div>

      {/* Linha 2: progresso circular + séries */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Anel de progresso */}
        <div style={{ position: 'relative', width: 30, height: 30, flexShrink: 0 }}>
          <svg width="30" height="30" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="15" cy="15" r="12" fill="none" stroke={T.border} strokeWidth="3"/>
            <circle
              cx="15" cy="15" r="12" fill="none"
              stroke={T.accent} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 12}
              strokeDashoffset={2 * Math.PI * 12 * (1 - overallProgress / 100)}
              style={{ transition: 'stroke-dashoffset .5s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 7, color: T.accent, fontFamily: 'var(--font-mono)', fontWeight: 700,
          }}>
            {overallProgress}%
          </div>
        </div>

        <span style={{ fontSize: 11, color: T.muted, fontFamily: 'var(--font-mono)' }}>
          {completedSets}/{totalSets} séries concluídas
        </span>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BlockBadge — chip de bloco para a faixa de navegação horizontal
// ─────────────────────────────────────────────────────────────────────────────

interface BlockBadgeProps {
  block:       WorkoutBlock;
  isActive:    boolean;
  isCompleted: boolean;
  index:       number;
}

export function BlockBadge({ block, isActive, isCompleted, index }: BlockBadgeProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 16px',
      background: isActive ? `${T.accent}12` : isCompleted ? `${T.success}08` : T.surface,
      borderLeft:   `3px solid ${isActive ? T.accent : isCompleted ? T.success : T.border}`,
      borderBottom: `1px solid ${T.border}`,
      transition: 'background .3s',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 4, flexShrink: 0,
        background: isActive ? T.accent : isCompleted ? T.success : T.elevated,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 900,
        color: (isActive || isCompleted) ? '#000' : T.muted,
        fontFamily: 'var(--font-mono)',
      }}>
        {isCompleted ? '✓' : String.fromCharCode(65 + index)}
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? T.text : T.muted, letterSpacing: 1, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
          {block.name}
        </div>
        <div style={{ fontSize: 9, color: T.dim }}>
          {block.exercises.length} exercícios
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CyclicDots — 4 bolinhas que acendem em sequência a cada série,
//              zeram ao completar 4 e exibem o contador de ciclos
// ─────────────────────────────────────────────────────────────────────────────

interface CyclicDotsProps {
  totalDone: number; // total de séries concluídas no treino inteiro
}

function CyclicDots({ totalDone }: CyclicDotsProps) {
  const lit    = totalDone % 4;   // quantas bolinhas acesas (0-3; 0 = acabou de zerar)
  const cycles = Math.floor(totalDone / 4); // ciclos completos

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2, 3].map(i => {
          const isLit = i < lit;
          return (
            <div key={i} style={{
              width: 13, height: 13, borderRadius: '50%',
              background:  isLit ? `radial-gradient(circle at 35% 35%, #7fff9a, ${T.success})` : T.surface,
              border:      `2px solid ${isLit ? T.success : T.border}`,
              boxShadow:   isLit ? `0 0 7px ${T.success}90` : 'none',
              transition:  'all .25s ease',
            }}/>
          );
        })}
      </div>
      {cycles > 0 && (
        <span style={{ fontSize: 9, color: T.success, fontFamily: 'var(--font-mono)', letterSpacing: 1, opacity: 0.8 }}>
          ×{cycles}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExerciseCard — card principal do exercício ativo
//   • Timer do treino + CyclicDots acima das séries
//   • 4 quadradinhos de série com estado visual
//   • Botão "Pular Exercício" após 4 séries acumuladas
// ─────────────────────────────────────────────────────────────────────────────

interface ExerciseCardProps {
  exercise:           Exercise;
  progress:           ExerciseProgress;
  currentSetIndex:    number;
  phase:              WorkoutState['phase'];
  elapsedSeconds:     number;
  totalCompletedSets: number;
  formatTime:         (s: number) => string;
  onCompleteSet:      () => void;
  onSkipExercise:     () => void;
}

export function ExerciseCard({
  exercise, progress, currentSetIndex, phase,
  elapsedSeconds, totalCompletedSets,
  formatTime, onCompleteSet, onSkipExercise,
}: ExerciseCardProps) {
  const isResting = phase === 'rest';
  // Botão "pular" aparece após 4 séries acumuladas no treino inteiro
  const canSkip   = totalCompletedSets >= 4;

  const equipLabel =
    exercise.equipment === 'barbell'    ? '🏋️ HALTERE' :
    exercise.equipment === 'bodyweight' ? '🤸 CORPO LIVRE' : '🏋️🤸 MISTO';

  return (
    <div style={{
      background:  T.elevated,
      border:      `1px solid ${isResting ? T.rest + '44' : T.accent + '33'}`,
      borderRadius: 12,
      overflow:    'hidden',
      margin:      '0 16px',
      boxShadow:   `0 4px 24px ${isResting ? T.rest : T.accent}14`,
      transition:  'border-color .3s, box-shadow .3s',
    }}>

      {/* ── 1. Cabeçalho: emoji + nome + reps/carga ── */}
      <div style={{
        background:   `linear-gradient(135deg, ${T.surface} 0%, ${T.elevated} 100%)`,
        padding:      '16px 18px 12px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Emoji + tipo + nome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>{exercise.emoji}</span>
            <div>
              <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 3 }}>
                {equipLabel} · {exercise.muscleGroup.toUpperCase()}
              </div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: T.text, letterSpacing: 0.4, fontFamily: 'var(--font-display)', lineHeight: 1.15 }}>
                {exercise.name}
              </h2>
            </div>
          </div>
          {/* Reps + carga */}
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.accent, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {exercise.reps}
            </div>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>REPS</div>
            {exercise.weight && (
              <div style={{ fontSize: 11, color: T.gold, fontFamily: 'var(--font-mono)', marginTop: 3 }}>
                {exercise.weight}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Timer + CyclicDots (acima das séries, conforme pedido) ── */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        padding:      '11px 18px',
        borderBottom: `1px solid ${T.border}`,
        background:   `${T.surface}99`,
      }}>
        {/* Timer */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{
            fontSize: 26, fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            color:     isResting ? T.rest : T.accent,
            letterSpacing: 2, lineHeight: 1,
            transition: 'color .3s',
          }}>
            {formatTime(elapsedSeconds)}
          </span>
          <span style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>TREINO</span>
        </div>

        {/* 4 bolinhas cíclicas */}
        <CyclicDots totalDone={totalCompletedSets} />
      </div>

      {/* ── 3. Séries — quadradinhos de progresso ── */}
      <div style={{ padding: '12px 18px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 9 }}>
          SÉRIES
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: exercise.sets }, (_, i) => {
            const isDone   = progress.sets[i]?.done ?? false;
            const isActive = i === currentSetIndex && !isResting;
            return (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: 8,
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                background: isDone   ? `${T.success}20`
                          : isActive ? `${T.accent}20`
                          : T.surface,
                border:    `2px solid ${isDone ? T.success : isActive ? T.accent : T.border}`,
                transform:  isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all .25s ease',
              }}>
                <span style={{
                  fontSize: isDone ? 18 : 13,
                  color:    isDone ? T.success : isActive ? T.accent : T.dim,
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

      {/* ── 4. Dicas de execução ── */}
      <div style={{ padding: '11px 18px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
          EXECUÇÃO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {exercise.cues.map((cue, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: T.accent, fontSize: 10, marginTop: 1, flexShrink: 0 }}>▸</span>
              <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{cue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Ações ── */}
      {!isResting && (
        <div style={{ padding: '13px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>

          {/* Botão principal: completar série */}
          <button
            onClick={onCompleteSet}
            style={{
              width: '100%', padding: '15px',
              background:   `linear-gradient(135deg, ${T.accent} 0%, #c82800 100%)`,
              border:       'none', borderRadius: 10,
              color:        '#fff', fontSize: 14, fontWeight: 900,
              letterSpacing: 2, fontFamily: 'var(--font-display)',
              cursor:       'pointer',
              boxShadow:    `0 4px 18px ${T.accent}44`,
              transition:   'transform .1s, box-shadow .15s',
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; e.currentTarget.style.boxShadow = `0 2px 8px ${T.accent}44`; }}
            onMouseUp={e =>   { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = `0 4px 18px ${T.accent}44`; }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onTouchEnd={e =>   { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ✓ SÉRIE {currentSetIndex + 1} CONCLUÍDA
          </button>

          {/* Botão secundário: pular exercício — aparece após 4 séries globais */}
          {canSkip && (
            <button
              onClick={onSkipExercise}
              style={{
                width:         '100%',
                padding:       '10px',
                background:    'transparent',
                border:        `1px solid ${T.border}`,
                borderRadius:  8,
                color:         T.dim,
                fontSize:      10,
                fontWeight:    700,
                letterSpacing: 2,
                fontFamily:    'var(--font-mono)',
                cursor:        'pointer',
                transition:    'border-color .2s, color .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.muted; e.currentTarget.style.color = T.muted; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.dim; }}
            >
              ⏭ &nbsp; PULAR EXERCÍCIO
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RestTimer — countdown de descanso com anel SVG animado
// ─────────────────────────────────────────────────────────────────────────────

interface RestTimerProps {
  secondsLeft:      number;
  totalSeconds:     number;
  nextExerciseName?: string;
  formatTime:       (s: number) => string;
  onSkip:           () => void;
}

export function RestTimer({ secondsLeft, totalSeconds, nextExerciseName, formatTime, onSkip }: RestTimerProps) {
  const pct      = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const R        = 50;
  const circ     = 2 * Math.PI * R;
  const offset   = circ - (pct / 100) * circ;
  const isUrgent = secondsLeft <= 5;

  return (
    <div style={{
      margin:      '0 16px',
      background:  `${T.rest}0e`,
      border:      `1px solid ${T.rest}44`,
      borderRadius: 12,
      padding:     '26px 18px',
      textAlign:   'center',
    }}>
      <div style={{ fontSize: 9, color: T.rest, letterSpacing: 3, fontFamily: 'var(--font-mono)', marginBottom: 18, opacity: 0.85 }}>
        ⏸ &nbsp; DESCANSO ATIVO
      </div>

      {/* Anel */}
      <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto 18px' }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={R} fill="none" stroke={T.border} strokeWidth="6"/>
          <circle
            cx="65" cy="65" r={R}
            fill="none"
            stroke={isUrgent ? T.accent : T.rest}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 38, fontWeight: 900, fontFamily: 'var(--font-mono)', color: isUrgent ? T.accent : T.rest, lineHeight: 1, transition: 'color .3s' }}>
            {secondsLeft}
          </span>
          <span style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>seg</span>
        </div>
      </div>

      {nextExerciseName && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>PRÓXIMO</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: 'var(--font-display)' }}>{nextExerciseName}</div>
        </div>
      )}

      <button
        onClick={onSkip}
        style={{
          padding:      '11px 30px',
          background:   'transparent',
          border:       `1px solid ${T.rest}66`,
          borderRadius: 8, color: T.rest,
          fontSize: 10, fontWeight: 700, letterSpacing: 2,
          fontFamily: 'var(--font-mono)', cursor: 'pointer',
        }}
      >
        PULAR DESCANSO ▶
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkoutIdle — tela de boas-vindas antes de iniciar
// ─────────────────────────────────────────────────────────────────────────────

interface WorkoutIdleProps {
  totalMinutes:    number;
  totalExercises:  number;
  totalSets:       number;
  onStart:         () => void;
}

export function WorkoutIdle({ totalMinutes, totalExercises, totalSets, onStart }: WorkoutIdleProps) {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Ícone */}
      <div style={{
        width: 90, height: 90, borderRadius: 22,
        background:  `linear-gradient(135deg, ${T.accent}20, ${T.gold}12)`,
        border:      `1px solid ${T.accent}44`,
        display:     'flex', alignItems: 'center', justifyContent: 'center',
        margin:      '0 auto 26px',
        fontSize:    42,
        boxShadow:   `0 8px 36px ${T.accent}20`,
      }}>
        🏋️
      </div>

      <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 900, color: T.text, fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
        FULL BODY 45 MIN
      </h2>
      <p style={{ margin: '0 0 30px', fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
        Halteres + Corpo Livre • Alta Intensidade
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 36 }}>
        {[
          { icon: '⏱', value: totalMinutes, label: 'MINUTOS' },
          { icon: '💪', value: totalExercises, label: 'EXERCÍCIOS' },
          { icon: '🔁', value: totalSets, label: 'SÉRIES' },
        ].map(s => (
          <div key={s.label} style={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 8px' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: T.accent, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: 8, color: T.muted, letterSpacing: 2, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{
          width:        '100%', padding: '18px',
          background:   `linear-gradient(135deg, ${T.accent} 0%, #c02800 100%)`,
          border:       'none', borderRadius: 12,
          color:        '#fff', fontSize: 16, fontWeight: 900,
          letterSpacing: 3, fontFamily: 'var(--font-display)',
          cursor:       'pointer',
          boxShadow:    `0 6px 30px ${T.accent}44`,
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={e =>   (e.currentTarget.style.transform = 'scale(1)')}
        onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.98)')}
        onTouchEnd={e =>   (e.currentTarget.style.transform = 'scale(1)')}
      >
        ▶ &nbsp; INICIAR TREINO
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkoutFinished — tela de conclusão com stats
// ─────────────────────────────────────────────────────────────────────────────

interface WorkoutFinishedProps {
  elapsedSeconds: number;
  completedSets:  number;
  formatTime:     (s: number) => string;
  onReset:        () => void;
}

export function WorkoutFinished({ elapsedSeconds, completedSets, formatTime, onReset }: WorkoutFinishedProps) {
  return (
    <div style={{ padding: '48px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
      <h2 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900, color: T.gold, fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
        TREINO CONCLUÍDO
      </h2>
      <p style={{ margin: '0 0 36px', fontSize: 13, color: T.muted }}>
        Você destruiu esse treino. Recupere-se bem.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
        {[
          { icon: '⏱', value: formatTime(elapsedSeconds), label: 'TEMPO TOTAL' },
          { icon: '✅', value: String(completedSets),     label: 'SÉRIES FEITAS' },
        ].map(s => (
          <div key={s.label} style={{ background: T.elevated, border: `1px solid ${T.gold}33`, borderRadius: 12, padding: '20px 12px' }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: T.gold, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: 8, color: T.muted, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        style={{
          width: '100%', padding: '16px',
          background: T.elevated, border: `1px solid ${T.border}`,
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
