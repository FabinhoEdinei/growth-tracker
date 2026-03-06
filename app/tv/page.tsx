import { RoteiroGenerator } from '../utils/roteiro-generator';
import { TVScreen } from './components/TVScreen';
import Link from 'next/link';

export default function TVPage() {
  const generator = new RoteiroGenerator();
  const roteiro = generator.gerarRoteiroDoDia();

  return (
    <div className="tv-page">
      {/* Tela de TV */}
      <TVScreen roteiro={roteiro} />

      {/* Programação do Dia */}
      <div className="programacao-wrapper">
        <h2 className="programacao-title">
          📺 PROGRAMAÇÃO DE HOJE
        </h2>

        <div className="programacao-grid">
          {roteiro.segmentos.map((segmento) => (
            <div key={segmento.id} className="segmento-card">
              <div className="segmento-horario">{segmento.horario}</div>
              <div className="segmento-info">
                <h3 className="segmento-titulo">{segmento.titulo}</h3>
                <span className="segmento-duracao">{segmento.duracao} min</span>
              </div>
              <div className={`segmento-tipo ${segmento.tipo}`}>
                {segmento.tipo === 'abertura' && '🎬'}
                {segmento.tipo === 'historia' && '📖'}
                {segmento.tipo === 'publicidade' && '✨'}
                {segmento.tipo === 'encerramento' && '👋'}
              </div>
            </div>
          ))}
        </div>

        <div className="tv-stats">
          <div className="stat">
            <span className="stat-label">Edição:</span>
            <span className="stat-value">Nº {roteiro.edicao}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Duração Total:</span>
            <span className="stat-value">{roteiro.duracao_total} min</span>
          </div>
          <div className="stat">
            <span className="stat-label">Segmentos:</span>
            <span className="stat-value">{roteiro.segmentos.length}</span>
          </div>
        </div>

        <Link href="/" className="back-btn">
          ← Voltar ao Growth Tracker
        </Link>
      </div>

      <style jsx>{`
        .tv-page {
          min-height: 100vh;
          background: radial-gradient(
            circle at 50% 50%,
            #1a1410,
            #0a0a08
          );
          padding: 40px 20px;
        }

        .programacao-wrapper {
          max-width: 1200px;
          margin: 40px auto 0;
          background: rgba(42, 24, 16, 0.8);
          border: 3px solid #8B7355;
          border-radius: 16px;
          padding: 40px;
        }

        .programacao-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          text-align: center;
          color: #DAA520;
          margin-bottom: 30px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .programacao-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 30px;
        }

        .segmento-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(245, 235, 220, 0.05);
          border: 2px solid rgba(139, 115, 85, 0.3);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .segmento-card:hover {
          background: rgba(245, 235, 220, 0.1);
          border-color: rgba(218, 165, 32, 0.5);
          transform: translateX(4px);
        }

        .segmento-horario {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #DAA520;
          min-width: 80px;
        }

        .segmento-info {
          flex: 1;
        }

        .segmento-titulo {
          font-family: 'Georgia', serif;
          font-size: 18px;
          color: #f5e6d3;
          margin: 0 0 5px 0;
        }

        .segmento-duracao {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: rgba(245, 230, 211, 0.6);
        }

        .segmento-tipo {
          font-size: 28px;
          min-width: 40px;
          text-align: center;
        }

        .tv-stats {
          display: flex;
          justify-content: space-around;
          gap: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .stat-label {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(245, 230, 211, 0.6);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: bold;
          color: #DAA520;
        }

        .back-btn {
          display: block;
          text-align: center;
          padding: 12px 24px;
          background: transparent;
          border: 2px solid #8B7355;
          border-radius: 8px;
          color: #DAA520;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 1.5px;
          transition: all 0.3s;
        }

        .back-btn:hover {
          border-color: #DAA520;
          background: rgba(218, 165, 32, 0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .programacao-wrapper {
            padding: 20px;
          }

          .programacao-title {
            font-size: 28px;
          }

          .segmento-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .tv-stats {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}