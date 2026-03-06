'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './testes.css';

interface TestResult {
  route: string;
  status: 'success' | 'error' | 'pending';
  statusCode?: number;
  time?: number;
  error?: string;
}

interface CodeStats {
  totalFiles: number;
  totalLines: number;
  byExtension: Record<string, { files: number; lines: number }>;
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
  const [codeStats, setCodeStats] = useState<CodeStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    // Carregar stats de código ao montar
    fetchCodeStats();
  }, []);

  const fetchCodeStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch('/api/code-stats');
      if (response.ok) {
        const data = await response.json();
        setCodeStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar stats de código:', error);
    } finally {
      setLoadingStats(false);
    }
  };

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

      <div className="code-stats-section">
        <div className="stats-header">
          <h2>📊 Estatísticas de Código</h2>
          <button 
            onClick={fetchCodeStats} 
            disabled={loadingStats}
            className="refresh-button"
            title="Atualizar contagem"
          >
            {loadingStats ? '⏳ Carregando...' : '🔄 Atualizar'}
          </button>
        </div>

        {codeStats ? (
          <div className="stats-content">
            <div className="stats-summary">
              <div className="stat-box">
                <span className="stat-label">Arquivos</span>
                <span className="stat-value">{codeStats.totalFiles}</span>
              </div>
              <div className="stat-box highlight">
                <span className="stat-label">Linhas de Código</span>
                <span className="stat-value">{codeStats.totalLines.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="stats-by-extension">
              <h3>Por Extensão</h3>
              <div className="extension-grid">
                {Object.entries(codeStats.byExtension).map(([ext, data]) => (
                  <div key={ext} className="extension-card">
                    <div className="ext-name">{ext}</div>
                    <div className="ext-files">{data.files} arquivo{data.files > 1 ? 's' : ''}</div>
                    <div className="ext-lines">{data.lines.toLocaleString('pt-BR')} linhas</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="stats-loading">
            <span>⏳ Carregando estatísticas...</span>
          </div>
        )}
      </div>
    </div>
  );
}
