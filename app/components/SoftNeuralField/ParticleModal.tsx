import React from 'react';
import { ModalInfo } from './types';

interface ParticleModalProps {
  modalInfo: ModalInfo;
  onClose: () => void;
}

export const ParticleModal: React.FC<ParticleModalProps> = ({ modalInfo, onClose }) => {
  if (!modalInfo.visible || !modalInfo.data) return null;

  return (
    <div
      className="fixed z-50 pointer-events-auto"
      style={{
        left: `${Math.min(modalInfo.x, window.innerWidth - 320)}px`,
        top: `${Math.min(modalInfo.y, window.innerHeight - 280)}px`,
      }}
    >
      <div className="particle-modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-header">
          <div className="modal-id">{modalInfo.data.id}</div>
          <div className="modal-code">{modalInfo.data.code}</div>
        </div>

        <div className="modal-zone">
          ZONA ATUAL: <span className={`zone-${modalInfo.zone}`}>{modalInfo.zone.toUpperCase()}</span>
        </div>

        <div className="modal-reference">
          <div className="ref-label">REFERÊNCIA ZONA {modalInfo.zone.toUpperCase()}:</div>
          <div className="ref-value">
            {modalInfo.data.references[modalInfo.zone]}
          </div>
        </div>

        <div className="modal-content">
          <h3>{modalInfo.data.content.title}</h3>
          <p>{modalInfo.data.content.description}</p>
          <div className="modal-meta">{modalInfo.data.content.metadata}</div>
        </div>

        <div className="modal-all-refs">
          <div className="ref-section">TODAS AS REFERÊNCIAS:</div>
          <div className="ref-item">
            <span className="ref-alpha">α</span> 
            <span className="ref-code">{modalInfo.data.references.alpha}</span>
            {modalInfo.zone === 'alpha' && <span className="active-badge">ATIVA</span>}
          </div>
          <div className="ref-item">
            <span className="ref-beta">β</span> 
            <span className="ref-code">{modalInfo.data.references.beta}</span>
            {modalInfo.zone === 'beta' && <span className="active-badge">ATIVA</span>}
          </div>
          <div className="ref-item">
            <span className="ref-gamma">γ</span> 
            <span className="ref-code">{modalInfo.data.references.gamma}</span>
            {modalInfo.zone === 'gamma' && <span className="active-badge">ATIVA</span>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .particle-modal {
          background: linear-gradient(135deg, rgba(10, 10, 30, 0.95), rgba(20, 10, 40, 0.95));
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 8px;
          padding: 20px;
          width: 320px;
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.5),
                      inset 0 0 20px rgba(0, 255, 255, 0.1);
          font-family: 'Courier New', monospace;
          color: #00ffff;
          position: relative;
          animation: modalAppear 0.3s ease-out;
        }

        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 0, 100, 0.2);
          border: 1px solid #ff0066;
          color: #ff0066;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: rgba(255, 0, 100, 0.4);
          box-shadow: 0 0 10px #ff0066;
        }

        .modal-header {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
        }

        .modal-id {
          font-size: 11px;
          color: #00ff88;
          letter-spacing: 1px;
        }

        .modal-code {
          font-size: 18px;
          font-weight: bold;
          color: #00ffff;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
          margin-top: 4px;
        }

        .modal-zone {
          background: rgba(0, 0, 0, 0.4);
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 12px;
          border-left: 3px solid #ff00ff;
        }

        .zone-alpha { color: #ff0066; font-weight: bold; }
        .zone-beta { color: #00ff88; font-weight: bold; }
        .zone-gamma { color: #ffaa00; font-weight: bold; }

        .modal-reference {
          background: rgba(0, 255, 255, 0.1);
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          border: 1px solid rgba(0, 255, 255, 0.3);
        }

        .ref-label {
          font-size: 10px;
          color: #00ff88;
          margin-bottom: 6px;
          font-weight: bold;
        }

        .ref-value {
          font-size: 14px;
          color: #fff;
          font-weight: bold;
          letter-spacing: 0.5px;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }

        .modal-content {
          margin-bottom: 15px;
        }

        .modal-content h3 {
          font-size: 14px;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .modal-content p {
          font-size: 11px;
          color: #aaa;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .modal-meta {
          font-size: 10px;
          color: #00ff88;
          padding: 4px 8px;
          background: rgba(0, 255, 136, 0.1);
          border-radius: 3px;
          display: inline-block;
        }

        .modal-all-refs {
          border-top: 1px solid rgba(0, 255, 255, 0.2);
          padding-top: 12px;
        }

        .ref-section {
          font-size: 9px;
          color: #666;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .ref-item {
          font-size: 10px;
          color: #888;
          margin: 6px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px;
          border-radius: 3px;
          transition: background 0.2s;
        }

        .ref-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .ref-code {
          flex: 1;
        }

        .active-badge {
          font-size: 8px;
          padding: 2px 6px;
          background: rgba(0, 255, 0, 0.2);
          color: #0f0;
          border: 1px solid #0f0;
          border-radius: 3px;
          font-weight: bold;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .ref-alpha,
        .ref-beta,
        .ref-gamma {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 3px;
          text-align: center;
          line-height: 20px;
          font-weight: bold;
          font-size: 13px;
          flex-shrink: 0;
        }

        .ref-alpha {
          background: rgba(255, 0, 102, 0.2);
          color: #ff0066;
          border: 1px solid #ff0066;
        }

        .ref-beta {
          background: rgba(0, 255, 136, 0.2);
          color: #00ff88;
          border: 1px solid #00ff88;
        }

        .ref-gamma {
          background: rgba(255, 170, 0, 0.2);
          color: #ffaa00;
          border: 1px solid #ffaa00;
        }
      `}</style>
    </div>
  );
};