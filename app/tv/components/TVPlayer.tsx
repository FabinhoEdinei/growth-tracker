'use client';

import { useState, useEffect, useRef } from 'react';
import { RoteiroTV } from '@/app/utils/roteiro-generator';
import { marked } from 'marked';

interface TVPlayerProps {
  roteiro: RoteiroTV;
  autoFocus?: boolean;
}

export const TVPlayer: React.FC<TVPlayerProps> = ({ roteiro, autoFocus = false }) => {
  const [segmentoAtual, setSegmentoAtual] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const segmento = roteiro.segmentos[segmentoAtual];
  const progresso = ((segmentoAtual + 1) / roteiro.segmentos.length) * 100;

  // Auto-scroll para o player ao carregar
  useEffect(() => {
    if (autoFocus && playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [autoFocus]);

  const proximo = () => {
    if (segmentoAtual < roteiro.segmentos.length - 1) {
      setSegmentoAtual((prev) => prev + 1);
    }
  };

  const anterior = () => {
    if (segmentoAtual > 0) {
      setSegmentoAtual((prev) => prev - 1);
    }
  };

  const irPara = (index: number) => {
    setSegmentoAtual(index);
  };

  return (
    <div className="tv-player" ref={playerRef}>
      {/* Moldura da TV */}
      <div className="tv-frame">
        {/* Indicador LIVE */}
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">AO VIVO</span>
        </div>

        {/* Tela Principal */}
        <div className="tv-screen">
          {/* Conteúdo */}
          <div className="screen-content">
            <div className="content-meta">
              <span className="content-tipo">{segmento.tipo.toUpperCase()}</span>
              <span className="content-horario">📅 {segmento.horario}</span>
            </div>

            <h1 className="content-titulo">{segmento.titulo}</h1>

            {segmento.personagem && (
              <div className="content-host">
                {segmento.personagem === 'fabio' ? '🤠 com Fabio' : '🌸 com Cláudia'}
              </div>
            )}

            <div
              className="content-body"
              dangerouslySetInnerHTML={{ __html: marked(segmento.conteudo) }}
            />
          </div>

          {/* Barra de Progresso */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progresso}%` }} />
            <div className="progress-text">
              {segmentoAtual + 1} / {roteiro.segmentos.length}
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="tv-controls">
          <button
            onClick={anterior}
            disabled={segmentoAtual === 0}
            className="control-btn"
          >
            ⏮ Anterior
          </button>

          <div className="segment-selector">
            {roteiro.segmentos.map((_, index) => (
              <button
                key={index}
                onClick={() => irPara(index)}
                className={`segment-dot ${index === segmentoAtual ? 'active' : ''}`}
                title={`Segmento ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={proximo}
            disabled={segmentoAtual === roteiro.segmentos.length - 1}
            className="control-btn"
          >
            Próximo ⏭
          </button>
        </div>
      </div>

      <style jsx>{`
        .tv-player {
          max-width: 1100px;
          margin: 0 auto;
          scroll-margin-top: 100px;
        }

        .tv-frame {
          background: linear-gradient(135deg, #2a1a1e, #1a0a0f);
          border: 10px solid #0a0508;
          border-radius: 28px;
          padding: 25px;
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.9),
            inset 0 2px 15px rgba(0, 0, 0, 0.6);
          position: relative;
        }

        .live-indicator {
          position: absolute;
          top: 35px;
          right: 35px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(255, 0, 0, 0.2);
          border: 2px solid #ff0000;
          border-radius: 20px;
          z-index: 10;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #ff0000;
          border-radius: 50%;
          animation: livePulse 1.5s infinite;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .live-text {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: bold;
          color: #ff3333;
          letter-spacing: 1.5px;
        }

        .tv-screen {
          background: linear-gradient(180deg, #0f0508, #050203);
          border: 5px solid #1a0a0f;
          border-radius: 20px;
          padding: 50px;
          min-height: 550px;
          position: relative;
          overflow: hidden;
        }

        .screen-content {
          color: #ffe6f0;
          position: relative;
          z-index: 2;
        }

        .content-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
        }

        .content-tipo {
          padding: 4px 12px;
          background: rgba(255, 0, 102, 0.2);
          border: 1px solid rgba(255, 0, 102, 0.4);
          border-radius: 12px;
          color: #ff3377;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .content-horario {
          color: rgba(255, 102, 153, 0.6);
        }

        .content-titulo {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          color: #ff3377;
          margin: 0 0 15px 0;
          text-shadow: 0 0 20px rgba(255, 51, 119, 0.4);
        }

        .content-host {
          font-family: 'Georgia', serif;
          font-size: 14px;
          color: rgba(255, 102, 153, 0.7);
          margin-bottom: 25px;
        }

        .content-body {
          font-family: 'Georgia', serif;
          font-size: 17px;
          line-height: 1.9;
          color: rgba(255, 230, 240, 0.9);
        }

        .content-body :global(h1),
        .content-body :global(h2),
        .content-body :global(h3) {
          color: #ff6699;
          margin-top: 30px;
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: rgba(42, 24, 30, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, #ff0066, #ff3377);
          transition: width 0.4s;
          box-shadow: 0 0 15px rgba(255, 0, 102, 0.6);
        }

        .progress-text {
          position: relative;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(255, 102, 153, 0.8);
          background: rgba(10, 5, 8, 0.9);
          padding: 2px 8px;
          border-radius: 8px;
          z-index: 2;
        }

        .tv-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 25px;
          padding: 0 10px;
        }

        .control-btn {
          padding: 10px 20px;
          background: rgba(255, 0, 102, 0.15);
          border: 2px solid rgba(255, 0, 102, 0.4);
          border-radius: 10px;
          color: #ff3377;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .control-btn:hover:not(:disabled) {
          background: rgba(255, 0, 102, 0.25);
          border-color: #ff0066;
          transform: scale(1.05);
        }

        .control-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .segment-selector {
          display: flex;
          gap: 8px;
        }

        .segment-dot {
          width: 12px;
          height: 12px;
          background: rgba(255, 0, 102, 0.3);
          border: 2px solid rgba(255, 0, 102, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }

        .segment-dot:hover {
          background: rgba(255, 0, 102, 0.5);
          transform: scale(1.2);
        }

        .segment-dot.active {
          background: #ff0066;
          border-color: #ff3377;
          box-shadow: 0 0 12px rgba(255, 0, 102, 0.8);
        }

        @media (max-width: 768px) {
          .tv-frame {
            padding: 15px;
            border-radius: 20px;
          }

          .tv-screen {
            padding: 25px 20px;
            min-height: 450px;
          }

          .content-titulo {
            font-size: 28px;
          }

          .content-body {
            font-size: 15px;
          }

          .tv-controls {
            flex-direction: column;
            gap: 15px;
          }

          .segment-selector {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
};