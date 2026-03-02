'use client';

import { PageShell } from '../components/shared/PageShell';
import { ModuleCard } from '../components/shared/ModuleCard';
import { useState } from 'react';

interface Meta {
  id: string;
  title: string;
  category: string;
  progress: number;
  target: string;
  deadline: string;
  color: string;
}

const INITIAL_METAS: Meta[] = [
  {
    id: '1',
    title: 'Correr 100km no mes',
    category: 'Saude',
    progress: 68,
    target: '100 km',
    deadline: '2026-03-31',
    color: '#00ff88',
  },
  {
    id: '2',
    title: 'Ler 4 livros',
    category: 'Conhecimento',
    progress: 50,
    target: '4 livros',
    deadline: '2026-03-31',
    color: '#00d4ff',
  },
  {
    id: '3',
    title: 'Economia de R$2.000',
    category: 'Financas',
    progress: 85,
    target: 'R$ 2.000',
    deadline: '2026-03-31',
    color: '#ffaa00',
  },
  {
    id: '4',
    title: 'Publicar 8 artigos',
    category: 'Criacao',
    progress: 37,
    target: '8 artigos',
    deadline: '2026-03-31',
    color: '#ff00ff',
  },
  {
    id: '5',
    title: 'Meditar 20 dias',
    category: 'Mente',
    progress: 60,
    target: '20 dias',
    deadline: '2026-03-31',
    color: '#a855f7',
  },
];

export default function MetasPage() {
  const [metas] = useState<Meta[]>(INITIAL_METAS);
  const [filter, setFilter] = useState<string>('Todas');

  const categories = ['Todas', ...new Set(metas.map((m) => m.category))];
  const filtered = filter === 'Todas' ? metas : metas.filter((m) => m.category === filter);
  const avgProgress = Math.round(metas.reduce((acc, m) => acc + m.progress, 0) / metas.length);

  return (
    <PageShell
      title="Metas"
      subtitle="Defina, acompanhe e conquiste seus objetivos"
      accentColor="#ff00ff"
      accentHue={300}
    >
      {/* Overview */}
      <div className="overview-row">
        <div className="overview-card">
          <span className="overview-label">METAS ATIVAS</span>
          <span className="overview-value" style={{ color: '#ff00ff' }}>
            {metas.length}
          </span>
        </div>
        <div className="overview-card">
          <span className="overview-label">PROGRESSO MEDIO</span>
          <span className="overview-value" style={{ color: '#00ff88' }}>
            {avgProgress}%
          </span>
        </div>
        <div className="overview-card">
          <span className="overview-label">COMPLETADAS</span>
          <span className="overview-value" style={{ color: '#00d4ff' }}>
            {metas.filter((m) => m.progress >= 100).length}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <span className="filter-label">CATEGORIA:</span>
        <div className="filter-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Meta Cards */}
      <div className="metas-grid">
        {filtered.map((meta) => (
          <ModuleCard
            key={meta.id}
            title={meta.title}
            description={`Categoria: ${meta.category} | Objetivo: ${meta.target}`}
            icon={meta.progress >= 80 ? '~' : meta.progress >= 50 ? '+' : '.'}
            accentColor={meta.color}
          >
            <div className="meta-progress-section">
              <div className="meta-progress-header">
                <span className="meta-deadline">
                  Prazo: {new Date(meta.deadline).toLocaleDateString('pt-BR')}
                </span>
                <span className="meta-percent" style={{ color: meta.color }}>
                  {meta.progress}%
                </span>
              </div>
              <div className="meta-bar">
                <div
                  className="meta-fill"
                  style={{
                    width: `${meta.progress}%`,
                    background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)`,
                    boxShadow: `0 0 10px ${meta.color}80`,
                  }}
                />
              </div>
            </div>
          </ModuleCard>
        ))}
      </div>

      <style jsx>{`
        .overview-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .overview-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .overview-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 2px;
          display: block;
          margin-bottom: 8px;
        }

        .overview-value {
          font-family: 'Orbitron', monospace;
          font-size: 32px;
          font-weight: 700;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 0, 255, 0.15);
          flex-wrap: wrap;
        }

        .filter-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(255, 0, 255, 0.6);
          letter-spacing: 2px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          background: rgba(255, 0, 255, 0.05);
          border: 1px solid rgba(255, 0, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-btn:hover {
          background: rgba(255, 0, 255, 0.1);
          border-color: rgba(255, 0, 255, 0.4);
          color: rgba(255, 255, 255, 0.9);
        }

        .filter-btn.active {
          background: rgba(255, 0, 255, 0.2);
          border-color: rgba(255, 0, 255, 0.6);
          color: #ff00ff;
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
        }

        .metas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .meta-progress-section {
          margin-top: 4px;
        }

        .meta-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .meta-deadline {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          font-family: 'Courier New', monospace;
        }

        .meta-percent {
          font-size: 14px;
          font-family: 'Orbitron', monospace;
          font-weight: bold;
        }

        .meta-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          overflow: hidden;
        }

        .meta-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @media (max-width: 768px) {
          .overview-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .overview-value {
            font-size: 24px;
          }

          .metas-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageShell>
  );
}
