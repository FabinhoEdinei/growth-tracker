'use client';

// particleInfoPanel.tsx
// Painel leve que mostra dados de uma partícula clicada

import { ParticleMemory } from './particleData';
import { getProsperityScore, getTrendVector } from './trajectoryMath';

interface Props {
  memory: ParticleMemory | null;
  x: number;
  y: number;
  onClose: () => void;
  onAssign: (id: string, type: string) => void;
}

const TYPE_META = {
  vazio:    { color: '#00ffff', icon: '○', label: 'LIVRE' },
  agenda:   { color: '#ff0066', icon: '◈', label: 'AGENDA' },
  financas: { color: '#ffaa00', icon: '◆', label: 'FINANÇAS' },
  saude:    { color: '#00ff88', icon: '✦', label: 'SAÚDE' },
  meta:     { color: '#ff00ff', icon: '★', label: 'META' },
} as const;

const PRIORITY_LABEL = { 1: '● ALTA', 2: '◐ MÉDIA', 3: '○ BAIXA' };

export const ParticleInfoPanel: React.FC<Props> = ({
  memory, x, y, onClose, onAssign
}) => {
  if (!memory) return null;

  const score = getProsperityScore(memory);
  const trend = getTrendVector(memory.trajectory);
  const meta  = TYPE_META[memory.payload.type];
  const speed = Math.hypot(trend.dx, trend.dy).toFixed(2);
  const safeX = Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 400) - 300);
  const safeY = Math.min(y, (typeof window !== 'undefined' ? window.innerHeight : 600) - 380);

  return (
    <div
      className="panel"
      style={{ left: safeX, top: safeY }}
    >
      {/* Topo */}
      <div className="panel-top" style={{ borderBottomColor: meta.color }}>
        <div className="panel-id" style={{ color: meta.color }}>
          {meta.icon} {memory.payload.id}
        </div>
        <div className="panel-type" style={{ color: meta.color }}>
          {meta.label}
        </div>
        <button className="panel-close" onClick={onClose}>×</button>
      </div>

      {/* Stats físicos */}
      <div className="stats-row">
        <div className="stat">
          <span className="stat-label">VIDA</span>
          <span className="stat-val">{memory.age}f</span>
        </div>
        <div className="stat">
          <span className="stat-label">DIST</span>
          <span className="stat-val">{Math.floor(memory.distanceTraveled)}px</span>
        </div>
        <div className="stat">
          <span className="stat-label">SPEED</span>
          <span className="stat-val">{speed}</span>
        </div>
        <div className="stat">
          <span className="stat-label">COL</span>
          <span className="stat-val">{memory.collisions}</span>
        </div>
      </div>

      {/* Zonas visitadas */}
      <div className="zones-row">
        {['alpha', 'beta', 'gamma'].map(z => (
          <span
            key={z}
            className="zone-chip"
            style={{
              opacity: memory.zonesVisited.has(z) ? 1 : 0.2,
              borderColor:
                z === 'alpha' ? '#ff0066' :
                z === 'beta'  ? '#00ff88' : '#ffaa00',
              color:
                z === 'alpha' ? '#ff0066' :
                z === 'beta'  ? '#00ff88' : '#ffaa00',
            }}
          >
            {z.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Prosperidade */}
      <div className="prosperity">
        <div className="pros-header">
          <span className="pros-label">PROSPERIDADE</span>
          <span className="pros-val" style={{ color: meta.color }}>{score}/100</span>
        </div>
        <div className="pros-bar-bg">
          <div
            className="pros-bar-fill"
            style={{
              width: `${score}%`,
              background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
              boxShadow: `0 0 8px ${meta.color}`,
            }}
          />
        </div>
      </div>

      {/* Payload de dados */}
      {memory.payload.type !== 'vazio' && (
        <div className="payload-section">
          {memory.payload.label && (
            <div className="payload-row">
              <span className="pl-key">LABEL</span>
              <span className="pl-val">{memory.payload.label}</span>
            </div>
          )}
          {memory.payload.value !== undefined && (
            <div className="payload-row">
              <span className="pl-key">VALOR</span>
              <span className="pl-val" style={{ color: '#ffaa00' }}>
                R$ {memory.payload.value.toFixed(2)}
              </span>
            </div>
          )}
          {memory.payload.priority && (
            <div className="payload-row">
              <span className="pl-key">PRIOR</span>
              <span className="pl-val">{PRIORITY_LABEL[memory.payload.priority]}</span>
            </div>
          )}
          {memory.payload.dueAt && (
            <div className="payload-row">
              <span className="pl-key">VENCE</span>
              <span className="pl-val">
                {new Date(memory.payload.dueAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
          {memory.payload.done !== undefined && (
            <div className="payload-row">
              <span className="pl-key">STATUS</span>
              <span className="pl-val" style={{ color: memory.payload.done ? '#00ff88' : '#ff0066' }}>
                {memory.payload.done ? '✓ FEITO' : '○ PENDENTE'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Assign type buttons */}
      <div className="assign-row">
        {Object.entries(TYPE_META).map(([key, val]) => (
          <button
            key={key}
            className="assign-btn"
            style={{
              borderColor: memory.payload.type === key ? val.color : 'rgba(255,255,255,0.1)',
              color: memory.payload.type === key ? val.color : 'rgba(255,255,255,0.3)',
              background: memory.payload.type === key ? `${val.color}22` : 'transparent',
            }}
            onClick={() => onAssign(memory.payload.id, key)}
          >
            {val.icon}
          </button>
        ))}
      </div>

      <style jsx>{`
        .panel {
          position: fixed;
          z-index: 200;
          width: 280px;
          background: rgba(4, 4, 20, 0.97);
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: 10px;
          font-family: 'Courier New', monospace;
          box-shadow: 0 0 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,255,255,0.1);
          overflow: hidden;
          animation: fadeIn 0.2s ease;
          pointer-events: auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .panel-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid;
          background: rgba(255,255,255,0.03);
        }

        .panel-id {
          font-size: 9px;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .panel-type {
          font-size: 9px;
          letter-spacing: 2px;
          opacity: 0.8;
        }

        .panel-close {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 18px;
          cursor: pointer;
          line-height: 1;
          padding: 0 2px;
          transition: color 0.2s;
        }

        .panel-close:hover { color: #ff0066; }

        .stats-row {
          display: flex;
          padding: 10px 12px;
          gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .stat {
          flex: 1;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 7px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
          margin-bottom: 2px;
        }

        .stat-val {
          font-size: 10px;
          color: rgba(255,255,255,0.8);
          font-weight: bold;
        }

        .zones-row {
          display: flex;
          gap: 6px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .zone-chip {
          flex: 1;
          text-align: center;
          font-size: 8px;
          padding: 3px 6px;
          border: 1px solid;
          border-radius: 4px;
          letter-spacing: 1px;
          transition: opacity 0.3s;
        }

        .prosperity {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .pros-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .pros-label {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
        }

        .pros-val {
          font-size: 9px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .pros-bar-bg {
          height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
          overflow: hidden;
        }

        .pros-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .payload-section {
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .payload-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .pl-key {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
        }

        .pl-val {
          font-size: 9px;
          color: rgba(255,255,255,0.8);
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .assign-row {
          display: flex;
          gap: 4px;
          padding: 8px 12px;
        }

        .assign-btn {
          flex: 1;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          border: 1px solid;
        }

        .assign-btn:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};
