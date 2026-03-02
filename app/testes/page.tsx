'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TestResult {
  route: string;
  status: 'pending' | 'success' | 'error';
  statusCode?: number;
  time?: number;
  error?: string;
}

const routes = [
  { path: '/', name: 'Home' },
  { path: '/blog', name: 'Blog Lista' },
  { path: '/blog/historia-growth-tracker', name: 'Post Exemplo' },
  { path: '/dashboard-algas', name: 'Dashboard Algas' },
];

export default function TestesPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setCurrentTest(0);

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      setCurrentTest(i + 1);

      const startTime = Date.now();
      
      try {
        const response = await fetch(route.path, { method: 'HEAD' });
        const endTime = Date.now();

        setResults((prev) => [
          ...prev,
          {
            route: route.name,
            status: response.ok ? 'success' : 'error',
            statusCode: response.status,
            time: endTime - startTime,
          },
        ]);
      } catch (error) {
        setResults((prev) => [
          ...prev,
          {
            route: route.name,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        ]);
      }

      // Aguardar 500ms entre testes
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return '#00ff88';
      case 'error':
        return '#ff0066';
      case 'pending':
        return '#ffaa00';
      default:
        return '#666';
    }
  };

  return (
    <div className="testes-page">
      <div className="container">
        <Link href="/" className="back-button">
          ← Voltar
        </Link>

        <div className="header">
          <h1 className="title">🧪 Sistema de Testes</h1>
          <p className="subtitle">Verificação automática de rotas e funcionalidades</p>
        </div>

        <div className="test-controls">
          <button
            className="run-tests-btn"
            onClick={runTests}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <span className="spinner">⚡</span>
                Testando... ({currentTest}/{routes.length})
              </>
            ) : (
              <>▶️ Executar Testes</>
            )}
          </button>

          {results.length > 0 && (
            <div className="summary">
              <span className="summary-item success">
                ✅ {results.filter((r) => r.status === 'success').length}
              </span>
              <span className="summary-item error">
                ❌ {results.filter((r) => r.status === 'error').length}
              </span>
              <span className="summary-item total">
                Total: {results.length}/{routes.length}
              </span>
            </div>
          )}
        </div>

        <div className="results">
          {results.length === 0 && !isRunning && (
            <div className="empty-state">
              <span className="empty-icon">🔬</span>
              <p>Clique em &quot;Executar Testes&quot; para iniciar</p>

            </div>
          )}

          {results.map((result, index) => (
            <div
              key={index}
              className="result-card"
              style={{
                borderColor: getStatusColor(result.status),
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="result-header">
                <span className="result-icon">{getStatusIcon(result.status)}</span>
                <span className="result-route">{result.route}</span>
                {result.time && (
                  <span className="result-time">{result.time}ms</span>
                )}
              </div>

              {result.statusCode && (
                <div className="result-details">
                  <span className="detail-label">Status Code:</span>
                  <span className="detail-value">{result.statusCode}</span>
                </div>
              )}

              {result.error && (
                <div className="result-error">
                  <span className="error-label">Erro:</span>
                  <span className="error-message">{result.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .testes-page {
          min-height: 100vh;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(10, 10, 30, 1),
            rgba(0, 0, 0, 1)
          );
          padding: 40px 20px;
          color: white;
          font-family: 'Courier New', monospace;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        .back-button {
          display: inline-block;
          margin-bottom: 20px;
          padding: 8px 16px;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 8px;
          color: #00ffff;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.3s;
        }

        .back-button:hover {
          background: rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .title {
          font-size: 42px;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #00ffff, #ff00ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 1px;
        }

        .test-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .run-tests-btn {
          padding: 16px 40px;
          background: linear-gradient(135deg, #00ff88, #00d4ff);
          border: none;
          border-radius: 12px;
          color: #000;
          font-family: 'Courier New', monospace;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .run-tests-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
        }

        .run-tests-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .summary {
          display: flex;
          gap: 20px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .summary-item {
          font-size: 13px;
          font-weight: bold;
        }

        .summary-item.success {
          color: #00ff88;
        }

        .summary-item.error {
          color: #ff0066;
        }

        .summary-item.total {
          color: rgba(255, 255, 255, 0.7);
        }

        .results {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.4);
        }

        .empty-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 20px;
          opacity: 0.3;
        }

        .result-card {
          padding: 20px;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid;
          border-radius: 12px;
          animation: slideIn 0.3s ease-out backwards;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .result-icon {
          font-size: 20px;
        }

        .result-route {
          flex: 1;
          font-size: 16px;
          font-weight: bold;
        }

        .result-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .result-details {
          display: flex;
          gap: 10px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.5);
        }

        .result-error {
          margin-top: 10px;
          padding: 10px;
          background: rgba(255, 0, 102, 0.1);
          border-left: 3px solid #ff0066;
          font-size: 12px;
        }

        .error-label {
          display: block;
          color: #ff0066;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .error-message {
          color: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 768px) {
          .title {
            font-size: 32px;
          }

          .run-tests-btn {
            padding: 14px 32px;
            font-size: 14px;
          }

          .summary {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}