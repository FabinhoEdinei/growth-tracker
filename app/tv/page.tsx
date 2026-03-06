import { RoteiroGenerator } from '../utils/roteiro-generator';
import { TVPlayer } from './components/TVPlayer';
import Link from 'next/link';

export default function TVPage() {
  const generator = new RoteiroGenerator();
  const roteiro = generator.gerarRoteiroDoDia();

  return (
    <div className="tv-page">
      {/* Header Compacto */}
      <header className="tv-header">
        <div className="tv-logo">
          <span className="logo-icon">📺</span>
          <div className="logo-text">
            <h1>TV EMPRESARIAL</h1>
            <p>Growth Tracker Broadcasting</p>
          </div>
        </div>

        <Link href="/" className="back-btn">
          ← Home
        </Link>
      </header>

      {/* Player Principal - FOCO AUTOMÁTICO */}
      <section className="tv-main">
        <TVPlayer roteiro={roteiro} autoFocus />
      </section>

      {/* Grade de Programação - Abaixo */}
      <section className="tv-schedule">
        <h2 className="schedule-title">
          📋 ROTEIRO DE HOJE
          <span className="edition-badge">Edição #{roteiro.edicao}</span>
        </h2>

        <div className="schedule-grid">
          {roteiro.segmentos.map((segmento, index) => (
            <div
              key={segmento.id}
              className={`schedule-item ${segmento.tipo}`}
            >
              <div className="schedule-time">{segmento.horario}</div>
              <div className="schedule-info">
                <span className="schedule-tipo">
                  {segmento.tipo === 'abertura' && '🎬 ABERTURA'}
                  {segmento.tipo === 'historia' && '📖 HISTÓRIA'}
                  {segmento.tipo === 'publicidade' && '✨ INTERVALO'}
                  {segmento.tipo === 'encerramento' && '👋 ENCERRAMENTO'}
                </span>
                <h3 className="schedule-name">{segmento.titulo}</h3>
                {segmento.personagem && (
                  <span className="schedule-host">
                    {segmento.personagem === 'fabio' ? '🤠 Fabio' : '🌸 Cláudia'}
                  </span>
                )}
              </div>
              <div className="schedule-duration">{segmento.duracao} min</div>
            </div>
          ))}
        </div>

        {/* Estatísticas */}
        <div className="tv-stats">
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <div className="stat-info">
              <span className="stat-value">{roteiro.duracao_total}</span>
              <span className="stat-label">minutos</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎬</span>
            <div className="stat-info">
              <span className="stat-value">{roteiro.segmentos.length}</span>
              <span className="stat-label">segmentos</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <div className="stat-info">
              <span className="stat-value">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
              <span className="stat-label">hoje</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .tv-page {
          min-height: 100vh;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(26, 10, 15, 1),
            rgba(10, 5, 8, 1)
          );
          padding-bottom: 60px;
        }

        /* Header */
        .tv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: linear-gradient(
            180deg,
            rgba(42, 24, 30, 0.9),
            rgba(26, 10, 15, 0.7)
          );
          border-bottom: 3px solid rgba(255, 0, 102, 0.3);
        }

        .tv-logo {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-icon {
          font-size: 36px;
          filter: drop-shadow(0 0 10px rgba(255, 0, 102, 0.6));
          animation: tvPulse 2s infinite;
        }

        @keyframes tvPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .logo-text h1 {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 3px;
          margin: 0;
          background: linear-gradient(135deg, #ff0066, #cc0052);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-text p {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(255, 102, 153, 0.6);
          margin: 3px 0 0 0;
          letter-spacing: 2px;
        }

        .back-btn {
          padding: 8px 20px;
          background: transparent;
          border: 2px solid rgba(255, 0, 102, 0.4);
          border-radius: 8px;
          color: #ff0066;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1.5px;
          transition: all 0.3s;
        }

        .back-btn:hover {
          border-color: #ff0066;
          background: rgba(255, 0, 102, 0.1);
          transform: translateX(-4px);
        }

        /* Main Player */
        .tv-main {
          padding: 40px 20px;
        }

        /* Schedule */
        .tv-schedule {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .schedule-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #ff3377;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .edition-badge {
          font-size: 14px;
          padding: 4px 12px;
          background: rgba(255, 0, 102, 0.2);
          border: 1px solid rgba(255, 0, 102, 0.4);
          border-radius: 20px;
          font-family: 'Courier New', monospace;
        }

        .schedule-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
        }

        .schedule-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(42, 24, 30, 0.6);
          border: 2px solid rgba(255, 0, 102, 0.2);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .schedule-item:hover {
          background: rgba(42, 24, 30, 0.8);
          border-color: rgba(255, 0, 102, 0.4);
          transform: translateX(4px);
        }

        .schedule-item.historia {
          border-left: 4px solid #ff0066;
        }

        .schedule-item.abertura {
          border-left: 4px solid #00ff88;
        }

        .schedule-item.publicidade {
          border-left: 4px solid #ffaa00;
        }

        .schedule-item.encerramento {
          border-left: 4px solid #00d4ff;
        }

        .schedule-time {
          font-family: 'Courier New', monospace;
          font-size: 20px;
          font-weight: bold;
          color: #ff3377;
          min-width: 70px;
        }

        .schedule-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .schedule-tipo {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(255, 102, 153, 0.7);
          letter-spacing: 1.5px;
        }

        .schedule-name {
          font-family: 'Georgia', serif;
          font-size: 16px;
          color: rgba(255, 230, 240, 0.95);
          margin: 0;
        }

        .schedule-host {
          font-size: 12px;
          color: rgba(255, 102, 153, 0.6);
        }

        .schedule-duration {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: rgba(255, 102, 153, 0.5);
          min-width: 60px;
          text-align: right;
        }

        /* Stats */
        .tv-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: rgba(42, 24, 30, 0.6);
          border: 2px solid rgba(255, 0, 102, 0.2);
          border-radius: 12px;
        }

        .stat-icon {
          font-size: 28px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #ff3377;
        }

        .stat-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(255, 102, 153, 0.6);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .tv-header {
            padding: 15px 20px;
          }

          .logo-text h1 {
            font-size: 18px;
          }

          .tv-main {
            padding: 20px 10px;
          }

          .schedule-title {
            font-size: 24px;
            flex-direction: column;
            align-items: flex-start;
          }

          .schedule-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .schedule-duration {
            text-align: left;
          }

          .tv-stats {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}