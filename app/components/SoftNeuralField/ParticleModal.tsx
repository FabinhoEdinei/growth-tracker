'use client';

import { useEffect, useState } from 'react';
import { ModalInfo } from './types';

interface ParticleModalProps {
  modalInfo: ModalInfo;
  onClose: () => void;
}

export const ParticleModal: React.FC<ParticleModalProps> = ({ modalInfo, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (modalInfo.visible) {
      // Pequeno delay para animação suave
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [modalInfo.visible]);

  if (!modalInfo.visible || !modalInfo.data) return null;

  const zoneColors: Record<string, string> = {
    alpha: '#ff0066',
    beta: '#00ff88',
    gamma: '#ffaa00',
  };

  const zoneColor = zoneColors[modalInfo.zone] || '#00ffff';

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className={`modal-overlay ${isAnimating ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Modal fullscreen */}
      <div className={`modal-fullscreen ${isAnimating ? 'open' : ''}`}>
        {/* Header do modal */}
        <div className="modal-header" style={{ borderColor: zoneColor }}>
          <div className="header-left">
            <span className="particle-id" style={{ color: zoneColor }}>
              {modalInfo.data.id}
            </span>
            <span className="particle-type">{modalInfo.data.type.toUpperCase()}</span>
          </div>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="modal-content">
          {/* Zona atual */}
          <div className="info-section">
            <div className="section-label">ZONA ATUAL:</div>
            <div 
              className="section-value zone-badge" 
              style={{ 
                color: zoneColor,
                borderColor: zoneColor,
                boxShadow: `0 0 15px ${zoneColor}44`
              }}
            >
              {modalInfo.zone.toUpperCase()}
            </div>
          </div>

          {/* Referência da zona */}
          <div className="info-section ref-section">
            <div className="section-label">REFERÊNCIA ZONA {modalInfo.zone.toUpperCase()}:</div>
            <div className="ref-code">
              REF-{modalInfo.zone.charAt(0).toUpperCase()}-{modalInfo.data.id.split('-')[1]}
            </div>
          </div>

          {/* ID da partícula */}
          <div className="info-section">
            <div className="section-label">Partícula</div>
            <div className="particle-full-id">{modalInfo.data.id}</div>
          </div>

          {/* Sistema de rastreamento */}
          <div className="info-section">
            <div className="section-label">Sistema de rastreamento neural</div>
            <div className="system-info">{modalInfo.data.id}</div>
          </div>

          {/* Classe */}
          <div className="info-section">
            <div className="section-label">Classe:</div>
            <div className="class-badge" style={{ color: zoneColor }}>
              {modalInfo.zone.toUpperCase()}
            </div>
          </div>

          {/* Estatísticas da partícula */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-label">Tipo</div>
              <div className="stat-value">{modalInfo.data.type}</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-label">Zona</div>
              <div className="stat-value">{modalInfo.zone}</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-label">Status</div>
              <div className="stat-value">Ativo</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔮</div>
              <div className="stat-label">Energia</div>
              <div className="stat-value">{Math.floor(Math.random() * 100)}%</div>
            </div>
          </div>

          {/* Dados técnicos */}
          <div className="tech-section">
            <div className="tech-title">DADOS TÉCNICOS</div>
            <div className="tech-grid">
              <div className="tech-item">
                <span className="tech-key">HASH:</span>
                <span className="tech-value" style={{ color: zoneColor }}>
                  {modalInfo.data.id.substring(0, 16)}...
                </span>
              </div>
              <div className="tech-item">
                <span className="tech-key">PROTOCOLO:</span>
                <span className="tech-value">NEURAL-X2</span>
              </div>
              <div className="tech-item">
                <span className="tech-key">FREQUÊNCIA:</span>
                <span className="tech-value">528 Hz</span>
              </div>
              <div className="tech-item">
                <span className="tech-key">TIMESTAMP:</span>
                <span className="tech-value">{Date.now()}</span>
              </div>
            </div>
          </div>

          {/* Histórico de movimento */}
          <div className="history-section">
            <div className="history-title">TRAJETÓRIA RECENTE</div>
            <div className="history-timeline">
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: '#00ffff' }} />
                <div className="timeline-content">
                  <div className="timeline-time">11:30:45</div>
                  <div className="timeline-text">Entrada na zona BETA</div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: '#ff00ff' }} />
                <div className="timeline-content">
                  <div className="timeline-time">11:29:32</div>
                  <div className="timeline-text">Colisão detectada (Setor C4)</div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: '#ffaa00' }} />
                <div className="timeline-content">
                  <div className="timeline-time">11:28:15</div>
                  <div className="timeline-text">Transição ALPHA → BETA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Espaço final para scroll */}
          <div style={{ height: '40px' }} />
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0);
          backdrop-filter: blur(0px);
          z-index: 900;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .modal-overlay.visible {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          pointer-events: auto;
        }

        .modal-fullscreen {
          position: fixed;
          top: 140px; /* Abaixo do header */
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(5, 5, 25, 0.98),
            rgba(10, 5, 30, 0.98)
          );
          backdrop-filter: blur(20px);
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-bottom: none;
          z-index: 950;
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 -10px 40px rgba(0, 255, 255, 0.2),
            0 -5px 20px rgba(0, 0, 0, 0.8);
        }

        .modal-fullscreen.open {
          transform: translateY(0);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 2px solid;
          background: rgba(0, 0, 0, 0.3);
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .particle-id {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .particle-type {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 3px;
        }

        .close-button {
          width: 40px;
          height: 40px;
          background: rgba(255, 0, 102, 0.2);
          border: 1px solid rgba(255, 0, 102, 0.5);
          border-radius: 50%;
          color: #ff0066;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 0, 102, 0.4);
          box-shadow: 0 0 20px rgba(255, 0, 102, 0.5);
          transform: rotate(90deg);
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          font-family: 'Courier New', monospace;
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.5);
        }

        .info-section {
          margin-bottom: 24px;
          animation: fadeSlideIn 0.5s ease-out backwards;
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .section-value {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 1px;
        }

        .zone-badge {
          display: inline-block;
          padding: 8px 16px;
          border: 2px solid;
          border-radius: 8px;
          font-weight: bold;
          letter-spacing: 3px;
        }

        .ref-section {
          background: rgba(0, 0, 0, 0.5);
          padding: 16px;
          border-radius: 10px;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .ref-code {
          font-size: 14px;
          color: #00ffff;
          letter-spacing: 2px;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .particle-full-id,
        .system-info {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 1px;
          word-break: break-all;
        }

        .class-badge {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin: 24px 0;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s;
        }

        .stat-card:hover {
          border-color: rgba(0, 255, 255, 0.5);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 16px;
          color: #00ffff;
          font-weight: bold;
          text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
        }

        .tech-section {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 0, 255, 0.3);
          border-radius: 10px;
          padding: 16px;
          margin: 24px 0;
        }

        .tech-title {
          font-size: 11px;
          color: #ff00ff;
          letter-spacing: 2px;
          margin-bottom: 12px;
          font-weight: bold;
        }

        .tech-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tech-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tech-item:last-child {
          border-bottom: none;
        }

        .tech-key {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 1px;
        }

        .tech-value {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
          letter-spacing: 1px;
        }

        .history-section {
          margin-top: 24px;
        }

        .history-title {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 2px;
          margin-bottom: 16px;
          font-weight: bold;
        }

        .history-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-item {
          display: flex;
          gap: 12px;
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 6px;
          top: 24px;
          bottom: -16px;
          width: 2px;
          background: linear-gradient(
            180deg,
            rgba(0, 255, 255, 0.3),
            transparent
          );
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
          box-shadow: 0 0 10px currentColor;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-time {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 4px;
        }

        .timeline-text {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .modal-fullscreen {
            top: 120px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .modal-header {
            padding: 16px;
          }

          .modal-content {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
};