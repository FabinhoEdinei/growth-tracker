function WorkoutSession({ workout, onBack }: { workout: Workout; onBack: () => void }) {
  const { 
    state, 
    currentExercise, 
    startWorkout, 
    completeSet,
    overallProgress 
  } = useWorkout(workout);

  // ── Idle ──
  if (state.phase === 'idle') {
    const meta = getWorkoutMeta(workout.id);
    return (
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{meta.icon}</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, marginBottom: 8 }}>{workout.name}</h2>
        <p style={{ color: T.muted, fontSize: 13, marginBottom: 40, textAlign: 'center' }}>
          {meta.description}
        </p>
        <button onClick={startWorkout} style={{
          width: '100%', padding: '18px 0', borderRadius: 16,
          background: T.gradient, border: 'none', color: '#fff',
          fontSize: 16, fontWeight: 900, letterSpacing: 2,
          cursor: 'pointer', boxShadow: `0 0 32px ${T.glow}`, marginBottom: 16,
        }}>
          COMEÇAR
        </button>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: T.muted, fontSize: 13, cursor: 'pointer',
        }}>
          ← Voltar
        </button>
      </div>
    );
  }

  // ── Descanso ──
  if (state.phase === 'rest') {
    return (
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: T.muted, fontFamily: T.mono, marginBottom: 24 }}>
          DESCANSO
        </div>
        <div style={{ fontSize: 88, fontWeight: 900, color: T.accent, fontFamily: T.mono, lineHeight: 1 }}>
          {state.restSecondsLeft ?? '--'}
        </div>
        <div style={{ color: T.muted, fontSize: 13, marginTop: 8 }}>segundos</div>
        <button onClick={completeSet} style={{
          marginTop: 48, padding: '14px 32px', borderRadius: 12,
          background: T.card, border: `1px solid ${T.border}`,
          color: T.muted, fontSize: 12, letterSpacing: 1, cursor: 'pointer',
        }}>
          PULAR DESCANSO
        </button>
      </div>
    );
  }

  if (!currentExercise) return null;

  // ✅ progresso correto vindo do hook
  const progress = (overallProgress ?? 0) / 100;

  // ✅ nome correto do state
  const currentSet = (state.currentSetIndex ?? 0) + 1;

  // ── Exercício ativo ──
  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', flexDirection: 'column', padding: '24px 20px 40px',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 0,
        }}>←</button>
        <div style={{ fontSize: 10, letterSpacing: 2, color: T.muted, fontFamily: T.mono }}>
          {workout.name}
        </div>
        <div style={{ fontSize: 11, color: T.accent, fontFamily: T.mono }}>
          {Math.round(progress * 100)}%
        </div>
      </div>

      {/* Progresso */}
      <div style={{ height: 3, background: T.card, borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: T.gradient,
          borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Exercício */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>{currentExercise.emoji}</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: T.text, letterSpacing: 1, margin: 0 }}>
          {currentExercise.name}
        </h2>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 8, fontFamily: T.mono }}>
          {currentExercise.reps} repetições
        </div>
        {'weight' in currentExercise && currentExercise.weight && (
          <div style={{ fontSize: 12, color: T.accent, marginTop: 4, fontFamily: T.mono }}>
            {currentExercise.weight as string}
          </div>
        )}
      </div>

      {/* Séries */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
        {Array.from({ length: currentExercise.sets }).map((_, i) => {
          const done    = i < (state.currentSetIndex ?? 0);
          const current = i === (state.currentSetIndex ?? 0);
          return (
            <div key={i} style={{
              width: 38, height: 38, borderRadius: 10,
              background: done ? T.gradient : T.card,
              border: `1px solid ${current ? T.accent : T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              color: done ? '#fff' : current ? T.accent : T.muted,
              boxShadow: current ? `0 0 12px ${T.glow}` : 'none',
              transition: 'all 0.2s',
            }}>
              {done ? '✓' : i + 1}
            </div>
          );
        })}
      </div>

      {/* Cues */}
      {currentExercise.cues?.length > 0 && (
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: '16px 18px', marginBottom: 32,
        }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: T.accent, fontFamily: T.mono, marginBottom: 10 }}>
            DICAS DE EXECUÇÃO
          </div>
          {currentExercise.cues.map((cue, i) => (
            <div key={i} style={{
              fontSize: 13, color: T.muted, paddingLeft: 14, marginBottom: 6, position: 'relative',
            }}>
              <span style={{ position: 'absolute', left: 0, color: T.accent, fontSize: 10, top: 2 }}>›</span>
              {cue}
            </div>
          ))}
        </div>
      )}

      {/* Botão concluir */}
      <div style={{ marginTop: 'auto' }}>
        <button onClick={completeSet} style={{
          width: '100%', padding: '20px 0', borderRadius: 16,
          background: T.gradient, border: 'none', color: '#fff',
          fontSize: 15, fontWeight: 900, letterSpacing: 2,
          cursor: 'pointer', boxShadow: `0 0 32px ${T.glow}`,
        }}>
          SÉRIE {currentSet} DE {currentExercise.sets} — CONCLUÍDA ✓
        </button>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: T.muted, fontFamily: T.mono }}>
          DESCANSO: {currentExercise.restSeconds}s após cada série
        </div>
      </div>
    </div>
  );
}