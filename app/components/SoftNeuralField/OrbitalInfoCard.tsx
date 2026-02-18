'use client';

// OrbitalInfoCard.tsx
// Card leve que aparece ao clicar em um hexágono orbital

import { OrbitalParticle, ORBITAL_COLORS } from './orbitalTypes';

interface Props {
  particle: OrbitalParticle | null;
  onClose: () => void;
  onToggleDone?: (id: string) => void;
}

const PRIORITY_LABEL = ['', '● ALTA', '◐ MÉDIA', '○ BAIXA'];

export const OrbitalInfoCard: React.FC<Props> = ({
  particle, onClose, onToggleDone,
}) => {
  if (!particle) return null;

  const { primary, glow } = ORBITAL_COLORS[particle.payload.type];
  const { payload } = particle;

  const safeX = Math.min(
    particle.x + 20,
    (typeof window !== 'undefined' ? window.innerWidth : 400) - 240
  );
  const safeY = Math.min(
    particle.y - 20,
    (typeof window !== 'undefined' ? window.innerHeight : 600) - 220
  );

  const TYPE_LABEL: Record<string, string> = {
    agenda:   '◈ AGENDA',
    financas: '◆ FINANÇAS',
    saude:    '✦ SAÚDE',
    meta:     '★ META',
  };

  const dueLabel = payload.dueAt
    ? new Date(payload.dueAt).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div
      className="card"
      style={{
        left: safeX,
        top: safeY,
        borderColor: `${primary}66`,
        boxShadow: `0 0 30px ${glow}, 0 0 60px rgba(0,0,0,0.8)`,
      }}
    >
      {/* Topo */}
      <div className="card-top" style={{ borderBottomColor: `${primary}44` }}>
        <span className="card-type" style={{ color: primary }}>
          {TYPE_LABEL[payload.type]}
        </span>
        <button className="card-close" onClick={onClose}>×</button>
      </div>

      {/* Label */}
      <p className="card-label">{payload.label}</p>

      {/* Dados */}
      <div className="card-data">
        {payload.value !== undefined && payload.value > 0 && (
          <div className="data-row">
            <span className="data-key">VALOR</span>
            <span className="data-val" style={{ color: '#ffaa00' }}>
              R$ {payload.value.toFixed(2)}
            </span>
          </div>
        )}
        {payload.priority && (
          <div className="data-row">
            <span className="data-key">PRIOR</span>
            <span className="data-val" style={{ color: primary }}>
              {PRIORITY_LABEL[payload.priority]}
            </span>
          </div>
        )}
        {dueLabel && (
          <div className="data-row">
            <span className="data-key">VENCE</span>
            <span className="data-val">{dueLabel}</span>
          </div>
        )}
        {payload.note && (
          <div className="data-row">
            <span className="data-key">NOTA</span>
            <span className="data-val">{payload.note}</span>
          </div>
        )}
      </div>

      {/* Toggle done (agenda/saude/meta) */}
      {payload.done !== undefined && onToggleDone && (
        <button
          className="done-btn"
          style={{
            borderColor: payload.done ? '#00ff88' : `${primary}66`,
            color: payload.done ? '#00ff88' : primary,
            background: payload.done
              ? 'rgba(0,255,136,0.1)'
              : `${primary}11`,
          }}
          onClick={() => onToggleDone(particle.id)}
        >
          {payload.done ? '✓ CONCLUÍDO' : '○ MARCAR FEITO'}
        </button>
      )}

      <style jsx>{`
        .card {
          position: fixed;
          z-index: 300;
          width: 220px;
          background: rgba(4, 4, 20, 0.97);
          border: 1px solid;
          border-radius: 10px;
          font-family: 'Courier New', monospace;
          overflow: hidden;
          pointer-events: auto;
          animation: popIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 12px;
          border-bottom: 1px solid;
        }

        .card-type {
          font-size: 9px;
          letter-spacing: 2px;
          font-weight: bold;
        }

        .card-close {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.35);
          font-size: 16px;
          cursor: pointer;
          line-height: 1;
          transition: color 0.2s;
        }

        .card-close:hover { color: #ff0066; }

        .card-label {
          font-size: 13px;
          color: rgba(255,255,255,0.9);
          padding: 10px 12px 6px;
          margin: 0;
          line-height: 1.3;
        }

        .card-data {
          padding: 0 12px 10px;
        }

        .data-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .data-key {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
        }

        .data-val {
          font-size: 9px;
          color: rgba(255,255,255,0.75);
          max-width: 130px;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .done-btn {
          display: block;
          width: calc(100% - 24px);
          margin: 0 12px 12px;
          padding: 8px;
          border: 1px solid;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 2px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .done-btn:hover {
          filter: brightness(1.3);
        }
      `}</style>
    </div>
  );
};
