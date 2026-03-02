'use client';

import { PageShell } from '../components/shared/PageShell';
import { ModuleCard } from '../components/shared/ModuleCard';
import { useState, useEffect } from 'react';

const STATS = [
  { label: 'STREAK', value: '12', unit: 'dias', color: '#00d4ff' },
  { label: 'TAREFAS', value: '87', unit: '%', color: '#00ff88' },
  { label: 'FOCO', value: '4.2', unit: 'h/dia', color: '#ff00ff' },
  { label: 'NIVEL', value: '23', unit: 'xp', color: '#ffaa00' },
];

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell
      title="Dashboard"
      subtitle="Painel de controle do seu crescimento"
      accentColor="#00d4ff"
      accentHue={195}
    >
      {/* Clock */}
      <div className="clock-section">
        <span className="clock-label">HORA LOCAL</span>
        <span className="clock-value">{currentTime}</span>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <div className="stat-value-row">
              <span className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="stat-unit">{stat.unit}</span>
            </div>
            <div
              className="stat-bar"
              style={{
                background: `linear-gradient(90deg, ${stat.color}, transparent)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Module Cards */}
      <div className="modules-grid">
        <ModuleCard
          title="Atividade Recente"
          description="Suas ultimas acoes e marcos alcancados na jornada de crescimento."
          icon="{'</>'}>"
          accentColor="#00d4ff"
        >
          <div className="activity-list">
            {['Treino HIIT completado', 'Meta semanal atingida', 'Novo artigo publicado'].map(
              (item, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-dot" />
                  <span className="activity-text">{item}</span>
                  <span className="activity-time">{i + 1}h atras</span>
                </div>
              )
            )}
          </div>
        </ModuleCard>

        <ModuleCard
          title="Progresso Semanal"
          description="Visualize sua evolucao ao longo da semana atual."
          icon="{'[=]'}"
          accentColor="#00ff88"
        >
          <div className="week-progress">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day, i) => (
              <div key={day} className="day-bar-wrapper">
                <div
                  className="day-bar"
                  style={{
                    height: `${20 + Math.random() * 60}%`,
                    background:
                      i <= new Date().getDay() - 1
                        ? 'linear-gradient(180deg, #00ff88, #00ff8833)'
                        : 'rgba(255,255,255,0.05)',
                  }}
                />
                <span className="day-label">{day}</span>
              </div>
            ))}
          </div>
        </ModuleCard>

        <ModuleCard
          title="Objetivos Ativos"
          description="Metas em andamento que exigem sua atencao."
          icon="{'(!)'}>"
          accentColor="#ff00ff"
          badge="3"
        >
          <div className="objectives-list">
            {[
              { name: 'Correr 5km em 25min', progress: 72 },
              { name: 'Ler 2 livros/mes', progress: 50 },
              { name: 'Portfolio atualizado', progress: 90 },
            ].map((obj, i) => (
              <div key={i} className="objective-item">
                <div className="objective-header">
                  <span className="objective-name">{obj.name}</span>
                  <span className="objective-percent">{obj.progress}%</span>
                </div>
                <div className="objective-bar">
                  <div
                    className="objective-fill"
                    style={{ width: `${obj.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ModuleCard>
      </div>

      <style jsx>{`
        .clock-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .clock-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(0, 212, 255, 0.5);
          letter-spacing: 2px;
        }

        .clock-value {
          font-family: 'Orbitron', monospace;
          font-size: 24px;
          color: #00d4ff;
          letter-spacing: 3px;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
          font-variant-numeric: tabular-nums;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 2px;
          display: block;
          margin-bottom: 8px;
        }

        .stat-value-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 12px;
        }

        .stat-value {
          font-family: 'Orbitron', monospace;
          font-size: 28px;
          font-weight: 700;
        }

        .stat-unit {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }

        .stat-bar {
          height: 2px;
          border-radius: 2px;
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .activity-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00d4ff;
          box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
          flex-shrink: 0;
        }

        .activity-text {
          flex: 1;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Courier New', monospace;
        }

        .activity-time {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.3);
          font-family: 'Courier New', monospace;
        }

        .week-progress {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 100px;
          gap: 8px;
        }

        .day-bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
          gap: 6px;
        }

        .day-bar {
          width: 100%;
          border-radius: 4px 4px 0 0;
          min-height: 4px;
          transition: height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .day-label {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.4);
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        .objectives-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .objective-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .objective-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .objective-name {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Courier New', monospace;
        }

        .objective-percent {
          font-size: 11px;
          color: #ff00ff;
          font-family: 'Orbitron', monospace;
          font-weight: bold;
        }

        .objective-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }

        .objective-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff00ff, #ff00ff88);
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .stat-value {
            font-size: 22px;
          }

          .modules-grid {
            grid-template-columns: 1fr;
          }

          .clock-value {
            font-size: 18px;
          }
        }
      `}</style>
    </PageShell>
  );
}
