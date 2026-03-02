'use client';

import { PageShell } from '../components/shared/PageShell';
import { ModuleCard } from '../components/shared/ModuleCard';
import { useState } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  moodLabel: string;
  title: string;
  content: string;
  tags: string[];
}

const ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: '2026-03-02',
    mood: '4',
    moodLabel: 'Otimo',
    title: 'Dia produtivo',
    content: 'Completei todos os treinos e avancei no projeto do portfolio. Sinto que estou no caminho certo.',
    tags: ['produtividade', 'treino', 'codigo'],
  },
  {
    id: '2',
    date: '2026-03-01',
    mood: '3',
    moodLabel: 'Bom',
    title: 'Comeco de mes',
    content: 'Revisao das metas do mes anterior. Ajustes no plano financeiro. Leitura de 30 paginas.',
    tags: ['planejamento', 'leitura'],
  },
  {
    id: '3',
    date: '2026-02-28',
    mood: '2',
    moodLabel: 'Neutro',
    title: 'Dia de descanso',
    content: 'Descanso ativo. Caminhada leve e reflexao sobre proximos passos.',
    tags: ['descanso', 'reflexao'],
  },
];

const MOOD_COLORS: Record<string, string> = {
  '5': '#00ff88',
  '4': '#00d4ff',
  '3': '#ffaa00',
  '2': '#ff6b9d',
  '1': '#ff0066',
};

const MOOD_BARS = [
  { level: '5', label: 'Incrivel', count: 4 },
  { level: '4', label: 'Otimo', count: 8 },
  { level: '3', label: 'Bom', count: 12 },
  { level: '2', label: 'Neutro', count: 5 },
  { level: '1', label: 'Dificil', count: 2 },
];

export default function JornalPage() {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const maxCount = Math.max(...MOOD_BARS.map((m) => m.count));

  return (
    <PageShell
      title="Jornal"
      subtitle="Registre pensamentos, humor e evolucao diaria"
      accentColor="#a855f7"
      accentHue={270}
    >
      {/* Mood Overview */}
      <ModuleCard
        title="Humor do Mes"
        description="Distribuicao do seu humor nos ultimos 30 dias."
        icon="#"
        accentColor="#a855f7"
      >
        <div className="mood-chart">
          {MOOD_BARS.map((bar) => (
            <div key={bar.level} className="mood-row">
              <span className="mood-label" style={{ color: MOOD_COLORS[bar.level] }}>
                {bar.label}
              </span>
              <div className="mood-bar-track">
                <div
                  className="mood-bar-fill"
                  style={{
                    width: `${(bar.count / maxCount) * 100}%`,
                    background: `linear-gradient(90deg, ${MOOD_COLORS[bar.level]}, ${MOOD_COLORS[bar.level]}66)`,
                  }}
                />
              </div>
              <span className="mood-count">{bar.count}</span>
            </div>
          ))}
        </div>
      </ModuleCard>

      {/* Entries */}
      <h2 className="section-title">Entradas Recentes</h2>
      <div className="entries-grid">
        {ENTRIES.map((entry) => (
          <div
            key={entry.id}
            className={`entry-card ${selectedEntry === entry.id ? 'expanded' : ''}`}
            onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
          >
            <div className="entry-header">
              <div className="entry-date-mood">
                <span className="entry-date">
                  {new Date(entry.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
                <span
                  className="entry-mood-badge"
                  style={{
                    color: MOOD_COLORS[entry.mood],
                    borderColor: MOOD_COLORS[entry.mood],
                  }}
                >
                  {entry.moodLabel}
                </span>
              </div>
              <h3 className="entry-title">{entry.title}</h3>
            </div>

            {selectedEntry === entry.id && (
              <div className="entry-body">
                <p className="entry-content">{entry.content}</p>
                <div className="entry-tags">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="entry-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="coming-soon">
        <span className="coming-soon-badge">EM BREVE</span>
        <p className="coming-soon-text">
          Escrita diaria com IA, analise de padroes de humor e exportacao de relatorios.
        </p>
      </div>

      <style jsx>{`
        .mood-chart {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mood-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mood-label {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          width: 60px;
          text-align: right;
          letter-spacing: 1px;
        }

        .mood-bar-track {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          overflow: hidden;
        }

        .mood-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mood-count {
          font-family: 'Orbitron', monospace;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          width: 24px;
          text-align: center;
        }

        .section-title {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: rgba(168, 85, 247, 0.8);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin: 40px 0 20px;
        }

        .entries-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }

        .entry-card {
          background: linear-gradient(135deg, rgba(10, 26, 40, 0.95), rgba(45, 20, 61, 0.15));
          border: 1.5px solid rgba(168, 85, 247, 0.25);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .entry-card:hover {
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 8px 30px rgba(168, 85, 247, 0.15);
        }

        .entry-card.expanded {
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 12px 40px rgba(168, 85, 247, 0.2);
        }

        .entry-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .entry-date-mood {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .entry-date {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
        }

        .entry-mood-badge {
          font-size: 9px;
          padding: 3px 10px;
          border: 1px solid;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .entry-title {
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .entry-body {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(168, 85, 247, 0.15);
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .entry-content {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .entry-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .entry-tag {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(168, 85, 247, 0.7);
          padding: 4px 10px;
          background: rgba(168, 85, 247, 0.1);
          border-radius: 6px;
          letter-spacing: 1px;
        }

        .coming-soon {
          text-align: center;
          padding: 40px;
          border: 1.5px dashed rgba(168, 85, 247, 0.25);
          border-radius: 16px;
          background: rgba(168, 85, 247, 0.03);
        }

        .coming-soon-badge {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #a855f7;
          letter-spacing: 3px;
          padding: 4px 16px;
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 12px;
        }

        .coming-soon-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .entry-card {
            padding: 18px;
          }

          .entry-title {
            font-size: 16px;
          }
        }
      `}</style>
    </PageShell>
  );
}
