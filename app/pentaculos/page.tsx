'use client';

import { PageShell } from '../components/shared/PageShell';
import { ModuleCard } from '../components/shared/ModuleCard';
import { useEffect, useRef } from 'react';

interface LifeArea {
  name: string;
  score: number;
  color: string;
  description: string;
}

const LIFE_AREAS: LifeArea[] = [
  { name: 'Saude', score: 8, color: '#00ff88', description: 'Exercicio, alimentacao, sono e vitalidade' },
  { name: 'Carreira', score: 7, color: '#00d4ff', description: 'Trabalho, projetos e crescimento profissional' },
  { name: 'Financas', score: 6, color: '#ffaa00', description: 'Renda, economia, investimentos e seguranca' },
  { name: 'Relacionamentos', score: 7, color: '#ff6b9d', description: 'Familia, amigos e conexoes significativas' },
  { name: 'Mente', score: 8, color: '#a855f7', description: 'Aprendizado, leitura, meditacao e clareza' },
  { name: 'Espiritualidade', score: 5, color: '#3b82f6', description: 'Proposito, gratidao e conexao interior' },
  { name: 'Lazer', score: 6, color: '#ff00ff', description: 'Hobbies, viagens e momentos de prazer' },
  { name: 'Contribuicao', score: 4, color: '#00ffff', description: 'Impacto social, voluntariado e legado' },
];

export default function PentaculosPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(400, window.innerWidth - 60);
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const maxRadius = size * 0.38;
    const n = LIFE_AREAS.length;

    // Draw grid circles
    for (let ring = 1; ring <= 10; ring++) {
      const r = (ring / 10) * maxRadius;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = ring === 5 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = ring === 10 ? 1.5 : 0.5;
      ctx.stroke();
    }

    // Draw axis lines
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const ex = cx + Math.cos(angle) * maxRadius;
      const ey = cy + Math.sin(angle) * maxRadius;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Labels
      const labelR = maxRadius + 20;
      const lx = cx + Math.cos(angle) * labelR;
      const ly = cy + Math.sin(angle) * labelR;
      ctx.save();
      ctx.font = '10px "Courier New", monospace';
      ctx.fillStyle = LIFE_AREAS[i].color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(LIFE_AREAS[i].name, lx, ly);
      ctx.restore();
    }

    // Draw filled polygon
    ctx.beginPath();
    LIFE_AREAS.forEach((area, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (area.score / 10) * maxRadius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points
    LIFE_AREAS.forEach((area, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (area.score / 10) * maxRadius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = area.color;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Score
      ctx.save();
      ctx.font = 'bold 11px "Orbitron", monospace';
      ctx.fillStyle = area.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const scoreAngle = angle;
      const sr = r + 14;
      const sx = cx + Math.cos(scoreAngle) * sr;
      const sy = cy + Math.sin(scoreAngle) * sr;
      ctx.fillText(String(area.score), sx, sy);
      ctx.restore();
    });
  }, []);

  const avgScore = (LIFE_AREAS.reduce((a, b) => a + b.score, 0) / LIFE_AREAS.length).toFixed(1);

  return (
    <PageShell
      title="Pentaculos"
      subtitle="Roda da vida - equilibrio entre todas as areas"
      accentColor="#3b82f6"
      accentHue={220}
    >
      {/* Score Overview */}
      <div className="score-overview">
        <div className="score-main">
          <span className="score-label">PONTUACAO GERAL</span>
          <span className="score-value">{avgScore}</span>
          <span className="score-max">/ 10</span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="chart-container">
        <canvas ref={canvasRef} className="radar-canvas" />
      </div>

      {/* Area Details */}
      <h2 className="section-title">Areas da Vida</h2>
      <div className="areas-grid">
        {LIFE_AREAS.map((area) => (
          <ModuleCard
            key={area.name}
            title={area.name}
            description={area.description}
            icon={area.score >= 8 ? '*' : area.score >= 5 ? '+' : '.'}
            accentColor={area.color}
            badge={`${area.score}/10`}
          >
            <div className="area-bar-container">
              <div className="area-bar">
                <div
                  className="area-fill"
                  style={{
                    width: `${area.score * 10}%`,
                    background: `linear-gradient(90deg, ${area.color}, ${area.color}66)`,
                    boxShadow: `0 0 10px ${area.color}40`,
                  }}
                />
              </div>
              <div className="area-ticks">
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="area-tick" />
                ))}
              </div>
            </div>
          </ModuleCard>
        ))}
      </div>

      <style jsx>{`
        .score-overview {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .score-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 24px 48px;
        }

        .score-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 3px;
        }

        .score-value {
          font-family: 'Orbitron', monospace;
          font-size: 48px;
          font-weight: 900;
          color: #3b82f6;
          text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        }

        .score-max {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.3);
        }

        .chart-container {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .radar-canvas {
          max-width: 100%;
        }

        .section-title {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: rgba(59, 130, 246, 0.8);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .areas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .area-bar-container {
          position: relative;
        }

        .area-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          overflow: hidden;
        }

        .area-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .area-ticks {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
        }

        .area-tick {
          width: 1px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .score-value {
            font-size: 36px;
          }

          .areas-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageShell>
  );
}
