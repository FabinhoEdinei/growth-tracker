'use client';

import { PageShell } from '../components/shared/PageShell';
import { ModuleCard } from '../components/shared/ModuleCard';
import { useState } from 'react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  done: boolean;
}

interface Workout {
  day: string;
  name: string;
  exercises: Exercise[];
  color: string;
}

const WEEKLY_PLAN: Workout[] = [
  {
    day: 'Segunda',
    name: 'Peito + Triceps',
    color: '#ff0066',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: '10-12', weight: '60kg', done: true },
      { name: 'Crucifixo', sets: 3, reps: '12-15', weight: '14kg', done: true },
      { name: 'Triceps Corda', sets: 4, reps: '12', weight: '25kg', done: false },
      { name: 'Flexao', sets: 3, reps: '15', weight: 'Corpo', done: false },
    ],
  },
  {
    day: 'Terca',
    name: 'Costas + Biceps',
    color: '#00d4ff',
    exercises: [
      { name: 'Puxada Frontal', sets: 4, reps: '10-12', weight: '50kg', done: false },
      { name: 'Remada Curvada', sets: 4, reps: '10', weight: '40kg', done: false },
      { name: 'Rosca Direta', sets: 3, reps: '12', weight: '16kg', done: false },
      { name: 'Rosca Martelo', sets: 3, reps: '12', weight: '14kg', done: false },
    ],
  },
  {
    day: 'Quarta',
    name: 'Pernas',
    color: '#00ff88',
    exercises: [
      { name: 'Agachamento', sets: 4, reps: '10', weight: '80kg', done: false },
      { name: 'Leg Press', sets: 4, reps: '12', weight: '120kg', done: false },
      { name: 'Extensora', sets: 3, reps: '15', weight: '40kg', done: false },
      { name: 'Panturrilha', sets: 4, reps: '20', weight: '60kg', done: false },
    ],
  },
];

const BODY_STATS = [
  { label: 'PESO', value: '75.5', unit: 'kg', color: '#00d4ff' },
  { label: 'GORDURA', value: '14.2', unit: '%', color: '#ff0066' },
  { label: 'MASSA', value: '34.8', unit: 'kg', color: '#00ff88' },
  { label: 'IMC', value: '23.1', unit: '', color: '#ffaa00' },
];

export default function GimPage() {
  const [workouts, setWorkouts] = useState<Workout[]>(WEEKLY_PLAN);

  const toggleExercise = (workoutIdx: number, exerciseIdx: number) => {
    setWorkouts((prev) =>
      prev.map((w, wi) =>
        wi === workoutIdx
          ? {
              ...w,
              exercises: w.exercises.map((e, ei) =>
                ei === exerciseIdx ? { ...e, done: !e.done } : e
              ),
            }
          : w
      )
    );
  };

  return (
    <PageShell
      title="Gim Tracker"
      subtitle="Acompanhe seus treinos e evolucao fisica"
      accentColor="#00d4ff"
      accentHue={195}
    >
      {/* Body Stats */}
      <div className="body-stats">
        {BODY_STATS.map((stat) => (
          <div key={stat.label} className="body-stat-card">
            <span className="body-stat-label">{stat.label}</span>
            <div className="body-stat-value-row">
              <span className="body-stat-value" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="body-stat-unit">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Workouts */}
      <div className="workouts-grid">
        {workouts.map((workout, wi) => {
          const doneCount = workout.exercises.filter((e) => e.done).length;
          const total = workout.exercises.length;
          const pct = Math.round((doneCount / total) * 100);

          return (
            <ModuleCard
              key={workout.day}
              title={`${workout.day} - ${workout.name}`}
              description={`${doneCount}/${total} exercicios completos`}
              icon={pct === 100 ? '*' : pct > 0 ? '+' : '.'}
              accentColor={workout.color}
              badge={pct === 100 ? 'DONE' : `${pct}%`}
            >
              <div className="workout-progress-bar">
                <div
                  className="workout-progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${workout.color}, ${workout.color}66)`,
                  }}
                />
              </div>
              <div className="exercises-list">
                {workout.exercises.map((ex, ei) => (
                  <div
                    key={ei}
                    className={`exercise-item ${ex.done ? 'done' : ''}`}
                    onClick={() => toggleExercise(wi, ei)}
                  >
                    <button
                      className="exercise-check"
                      style={{
                        borderColor: workout.color,
                        background: ex.done ? workout.color : 'transparent',
                      }}
                    >
                      {ex.done && (
                        <span style={{ color: '#000', fontSize: '10px', fontWeight: 'bold' }}>
                          {'V'}
                        </span>
                      )}
                    </button>
                    <div className="exercise-info">
                      <span className="exercise-name">{ex.name}</span>
                      <span className="exercise-detail">
                        {ex.sets}x{ex.reps} | {ex.weight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ModuleCard>
          );
        })}
      </div>

      <style jsx>{`
        .body-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .body-stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .body-stat-card:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .body-stat-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 2px;
          display: block;
          margin-bottom: 8px;
        }

        .body-stat-value-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
        }

        .body-stat-value {
          font-family: 'Orbitron', monospace;
          font-size: 26px;
          font-weight: 700;
        }

        .body-stat-unit {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }

        .workouts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .workout-progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .workout-progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .exercises-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .exercise-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .exercise-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .exercise-item.done {
          opacity: 0.5;
        }

        .exercise-item.done .exercise-name {
          text-decoration: line-through;
        }

        .exercise-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .exercise-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .exercise-name {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-family: 'Courier New', monospace;
        }

        .exercise-detail {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.35);
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .body-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .body-stat-value {
            font-size: 20px;
          }

          .workouts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageShell>
  );
}
