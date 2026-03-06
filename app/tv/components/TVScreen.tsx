'use client';

import { useState, useEffect } from 'react';
import { RoteiroTV } from '@/app/utils/roteiro-generator';
import { marked } from 'marked';

interface TVScreenProps {
  roteiro: RoteiroTV;
}

export const TVScreen: React.FC<TVScreenProps> = ({ roteiro }) => {
  const [segmentoAtual, setSegmentoAtual] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(0);

  const segmento = roteiro.segmentos[segmentoAtual];
  const progresso = (segmentoAtual / roteiro.segmentos.length) * 100;

  // Auto-play (opcional)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTempo((prev) => {
        if (prev >= segmento.duracao * 60) {
          // Próximo segmento
          if (segmentoAtual < roteiro.segmentos.length - 1) {
            setSegmentoAtual((prev) => prev + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, segmentoAtual, segmento, roteiro.segmentos.length]);

  const proximo = () => {
    if (segmentoAtual < roteiro.segmentos.length - 1) {
      setSegmentoAtual((prev) => prev + 1);
      setTempo(0);
    }
  };

  const anterior = () => {
    if (segmentoAtual > 0) {
      setSegmentoAtual((prev) => prev - 1);
      setTempo(0);
    }
  };

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg.toString().padStart(2, '0')}`;
  };

  return (
    <div className="tv-screen">
      {/* Moldura da TV */}
      <div className="tv-frame">
        {/* Tela */}
        <div className="tv-display">
          {/* Conteúdo do segmento */}
          <div className="tv-content">
            <div className="content-header">
              <span className="content-tipo">{segmento.tipo.toUpperCase()}</span>
              <span className="content-horario">{segmento.horario}</span>
            </div>

            <h1 className="content-titulo">{segmento.titulo}</h1>

            <div
              className="content-texto"
              dangerouslySetInnerHTML={{ __html: marked(segmento.conteudo) }}
            />
          </div>

          {/* Barra de progresso */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progresso}%` }} />
          </div>
        </div>

        {/* Controles */}
        <div className="tv-controls">
          <button onClick={anterior} disabled={segmentoAtual === 0}>
            ⏮ Anterior
          </button>

          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸ Pausar' : '▶ Play'}
          </button>

          <button
            onClick={proximo}
            disabled={segmentoAtual === roteiro.segmentos.length - 1}
          >
            Próximo ⏭
          </button>

          <div className="tv-timer">
            {formatarTempo(tempo)} / {segmento.duracao}:00
          </div>
        </div>

        {/* Info do segmento */}
        <div className="tv-info">
          Segmento {segmentoAtual + 1} de {roteiro.segmentos.length}
        </div>
      </div>

      <style jsx>{`
        .tv-screen {
          max-width: 1000px;
          margin: 0 auto;
        }

        .tv-frame {
          background: linear-gradient(135deg, #3a2a1a, #2a1a10);
          border: 8px solid #1a1410;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.8),
            inset 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .tv-display {
          background: #0a0a08;
          border: 4px solid #2a1a10;
          border-radius: 16px;
          padding: 40px;
          min-height: 500px;
          position: relative;
          overflow: hidden;
        }

        .tv-content {
          color: #f5e6d3;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
        }

        .content-tipo {
          color: #DAA520;
          font-weight: bold;
        }

        .content-horario {
          color: rgba(245, 230, 211, 0.6);
        }

        .content-titulo {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #DAA520;
          margin-bottom: 20px;
        }

        .content-texto {
          font-family: 'Georgia', serif;
          font-size: 16px;
          line-height: 1.8;
          color: rgba(245, 230, 211, 0.9);
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(139, 115, 85, 0.3);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #DAA520, #FFD700);
          transition: width 0.3s;
        }

        .tv-controls {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: center;
          align-items: center;
        }

        .tv-controls button {
          padding: 10px 20px;
          background: rgba(218, 165, 32, 0.2);
          border: 2px solid #8B7355;
          border-radius: 8px;
          color: #DAA520;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tv-controls button:hover:not(:disabled) {
          background: rgba(218, 165, 32, 0.3);
          border-color: #DAA520;
        }

        .tv-controls button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .tv-timer {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #DAA520;
          margin-left: 20px;
        }

        .tv-info {
          text-align: center;
          margin-top: 15px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(245, 230, 211, 0.5);
        }

        @media (max-width: 768px) {
          .tv-display {
            padding: 20px;
            min-height: 400px;
          }

          .content-titulo {
            font-size: 24px;
          }

          .content-texto {
            font-size: 14px;
          }

          .tv-controls {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};