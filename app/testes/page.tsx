'use client';

import { useState } from 'react';
import Link from 'next/link';
import './testes.css';

interface TestResult {
  route: string;
  status: 'success' | 'error' | 'pending';
  statusCode?: number;
  time?: number;
  error?: string;
}

const routes = [
  { name: 'Página Inicial', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Metas', path: '/metas' },
  { name: 'Hábitos', path: '/habitos' },
  { name: 'Configurações', path: '/configuracoes' },
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
    <div className="testes-container">
      <Link href="/" className="back-link">
        ← Voltar
      </Link>

      <div className="testes-header">
        <h1>🧪 Sistema de Testes</h1>
        <p>Verificação automática de rotas e funcionalidades</p>
      </div>

      <div className="testes-controls">
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`run-button ${isRunning ? 'running' : ''}`}
        >
          {isRunning ? `Executando ${currentTest}/${routes.length}...` : 'Executar Testes'}
        </button>

        {results.length > 0 && (
          <div className="summary">
            <span className="success-count">
              ✅ {results.filter((r) => r.status === 'success').length}
            </span>
            <span className="error-count">
              ❌ {results.filter((r) => r.status === 'error').length}
            </span>
            <span className="total-count">
              Total: {results.length}/{routes.length}
            </span>
          </div>
        )}
      </div>

      <div className="results-container">
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
              <div className="result-detail">
                <span className="detail-label">Status Code:</span>
                <span className="detail-value">{result.statusCode}</span>
              </div>
            )}

            {result.error && (
              <div className="result-detail error">
                <span className="detail-label">Erro:</span>
                <span className="detail-value">{result.error}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
