'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './testes.css';

interface TestResult {
  id: string;
  name: string;
  category: 'pages' | 'api' | 'components' | 'performance';
  status: 'success' | 'error' | 'pending' | 'warning';
  statusCode?: number;
  time?: number;
  error?: string;
  details?: string;
  metrics?: {
    responseTime: number;
    contentLength?: number;
  };
}

interface TestSession {
  timestamp: number;
  totalTests: number;
  passed: number;
  failed: number;
  avgTime: number;
}

interface CodeStats {
  totalFiles: number;
  totalLines: number;
  byExtension: Record<string, { files: number; lines: number }>;
}

interface TestCategory {
  name: string;
  category: 'pages' | 'api' | 'components' | 'performance';
  tests: Array<{ id: string; name: string; path: string; method?: string }>;
}

const testCategories: TestCategory[] = [
  {
    name: '📄 Páginas',
    category: 'pages',
    tests: [
      { id: 'home', name: 'Página Inicial', path: '/' },
      { id: 'dashboard', name: 'Dashboard', path: '/dashboard' },
      { id: 'blog', name: 'Blog', path: '/blog' },
      { id: 'jornal', name: 'Jornal', path: '/jornal' },
      { id: 'tv', name: 'TV Empresarial', path: '/tv-empresarial' },
    ],
  },
  {
    name: '🔌 APIs',
    category: 'api',
    tests: [
      { id: 'code-stats', name: 'Code Stats API', path: '/api/code-stats', method: 'GET' },
    ],
  },
  {
    name: '⚡ Performance',
    category: 'performance',
    tests: [
      { id: 'paint', name: 'First Paint', path: '/' },
      { id: 'contentful', name: 'First Contentful Paint', path: '/' },
    ],
  },
];

export default function TestesPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [codeStats, setCodeStats] = useState<CodeStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [testHistory, setTestHistory] = useState<TestSession[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'pages' | 'api' | 'components' | 'performance' | 'all'>('all');
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  useEffect(() => {
    fetchCodeStats();
    loadTestHistory();
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

  const loadTestHistory = () => {
    try {
      const history = localStorage.getItem('testHistory');
      if (history) {
        setTestHistory(JSON.parse(history).slice(0, 5)); // Últimas 5 sessões
      }
    } catch {
      // Ignorar erros ao carregar histórico
    }
  };

  const saveTestSession = (totalTests: number, passed: number, failed: number, avgTime: number) => {
    const session: TestSession = {
      timestamp: Date.now(),
      totalTests,
      passed,
      failed,
      avgTime,
    };

    const history = [session, ...testHistory].slice(0, 5);
    setTestHistory(history);
    localStorage.setItem('testHistory', JSON.stringify(history));
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setCurrentTest(0);

    const allTests = testCategories
      .filter((cat) => selectedCategory === 'all' || cat.category === selectedCategory)
      .flatMap((cat) => cat.tests);

    setTotalTests(allTests.length);

    const testResults: TestResult[] = [];
    let totalTime = 0;

    for (let i = 0; i < allTests.length; i++) {
      const test = allTests[i];
      const category =
        testCategories.find((cat) => cat.tests.find((t) => t.id === test.id))?.category || 'pages';

      setCurrentTest(i + 1);

      const startTime = Date.now();

      try {
        const response = await fetch(test.path, { method: test.method || 'GET' });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        totalTime += responseTime;

        const contentLength = response.headers.get('content-length');

        testResults.push({
          id: test.id,
          name: test.name,
          category: category as 'pages' | 'api' | 'components' | 'performance',
          status: response.ok ? 'success' : response.status === 404 ? 'error' : 'warning',
          statusCode: response.status,
          time: responseTime,
          metrics: {
            responseTime,
            contentLength: contentLength ? parseInt(contentLength) : undefined,
          },
        });
      } catch (error) {
        testResults.push({
          id: test.id,
          name: test.name,
          category: category as 'pages' | 'api' | 'components' | 'performance',
          status: 'error',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setResults(testResults);

    const passed = testResults.filter((r) => r.status === 'success').length;
    const failed = testResults.filter((r) => r.status !== 'success').length;
    const avgTime = Math.round(totalTime / allTests.length);

    saveTestSession(allTests.length, passed, failed, avgTime);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusLabel = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'Sucesso';
      case 'error':
        return 'Erro';
      case 'warning':
        return 'Aviso';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return '#00ff88';
      case 'error':
        return '#ff0066';
      case 'warning':
        return '#ffaa00';
      case 'pending':
        return '#0099ff';
      default:
        return '#666';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pages':
        return '#00ff64';
      case 'api':
        return '#0096ff';
      case 'components':
        return '#ff00c8';
      case 'performance':
        return '#ffaa00';
      default:
        return '#666';
    }
  };

  const filteredResults = results.filter(
    (r) => selectedCategory === 'all' || r.category === selectedCategory,
  );

  const stats = {
    total: results.length,
    success: results.filter((r) => r.status === 'success').length,
    error: results.filter((r) => r.status === 'error').length,
    warning: results.filter((r) => r.status === 'warning').length,
    avgTime: Math.round(
      results.reduce((sum, r) => sum + (r.time || 0), 0) / (results.length || 1),
    ),
  };

  const successRate = results.length > 0 ? Math.round((stats.success / results.length) * 100) : 0;

  return (
    <div className="testes-page">
      <aside className="testes-sidebar">
        <div className="sidebar-header">
          <h2>🧪 Testes</h2>
          <Link href="/" className="close-sidebar">
            ✕
          </Link>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            📋 Todos
          </button>
          {testCategories.map((cat) => (
            <button
              key={cat.category}
              className={`nav-item ${selectedCategory === cat.category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.category)}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Sistema de testes automáticos para verificação de rotas e performance</p>
        </div>
      </aside>

      <main className="testes-main">
        <div className="testes-header">
          <div>
            <h1>🧪 Sistema de Testes</h1>
            <p>Verificação automática de rotas e funcionalidades da aplicação</p>
          </div>
          <Link href="/" className="back-link">
            ← Voltar
          </Link>
        </div>

        {results.length > 0 && (
          <div className="stats-grid">
            <div className="stat-item success">
              <span className="stat-icon">✅</span>
              <div className="stat-content">
                <span className="stat-label">Sucessos</span>
                <span className="stat-value">{stats.success}</span>
              </div>
            </div>
            <div className="stat-item error">
              <span className="stat-icon">❌</span>
              <div className="stat-content">
                <span className="stat-label">Erros</span>
                <span className="stat-value">{stats.error}</span>
              </div>
            </div>
            <div className="stat-item warning">
              <span className="stat-icon">⚠️</span>
              <div className="stat-content">
                <span className="stat-label">Avisos</span>
                <span className="stat-value">{stats.warning}</span>
              </div>
            </div>
            <div className="stat-item time">
              <span className="stat-icon">⏱️</span>
              <div className="stat-content">
                <span className="stat-label">Tempo Médio</span>
                <span className="stat-value">{stats.avgTime}ms</span>
              </div>
            </div>
            <div className="stat-item rate">
              <span className="stat-icon">📊</span>
              <div className="stat-content">
                <span className="stat-label">Taxa Sucesso</span>
                <span className="stat-value">{successRate}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="testes-controls">
          <button
            onClick={runTests}
            disabled={isRunning}
            className={`run-button ${isRunning ? 'running' : ''}`}
          >
            {isRunning
              ? `⏳ Executando ${currentTest}/${totalTests}...`
              : '▶️ Executar Testes'}
          </button>
        </div>

        <div className="results-container">
          {results.length === 0 && !isRunning && (
            <div className="empty-state">
              <span className="empty-icon">🔬</span>
              <h3>Nenhum teste executado</h3>
              <p>Clique em &quot;Executar Testes&quot; para iniciar a verificação</p>
            </div>
          )}

          {isRunning && results.length === 0 && (
            <div className="loading-state">
              <span className="loading-spinner">🔄</span>
              <h3>Executando testes...</h3>
              <p>Teste {currentTest} de {totalTests}</p>
            </div>
          )}

          {filteredResults.length > 0 && (
            <div className="results-list">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className={`result-card result-${result.status}`}
                  onClick={() =>
                    setExpandedResult(expandedResult === result.id ? null : result.id)
                  }
                >
                  <div className="result-header">
                    <div className="result-title">
                      <span className="result-icon">{getStatusIcon(result.status)}</span>
                      <div className="result-info">
                        <h4>{result.name}</h4>
                        <span className="result-category" style={{ color: getCategoryColor(result.category) }}>
                          {result.category === 'pages' && '📄 Página'}
                          {result.category === 'api' && '🔌 API'}
                          {result.category === 'components' && '⚙️ Componente'}
                          {result.category === 'performance' && '⚡ Performance'}
                        </span>
                      </div>
                    </div>
                    <div className="result-meta">
                      {result.time && (
                        <span className="result-time">
                          ⏱️ {result.time}ms
                        </span>
                      )}
                      <span className="result-status">{getStatusLabel(result.status)}</span>
                    </div>
                  </div>

                  {expandedResult === result.id && (
                    <div className="result-details">
                      {result.statusCode && (
                        <div className="detail-row">
                          <span className="detail-label">Status HTTP:</span>
                          <span className="detail-value">{result.statusCode}</span>
                        </div>
                      )}
                      {result.metrics?.contentLength && (
                        <div className="detail-row">
                          <span className="detail-label">Tamanho:</span>
                          <span className="detail-value">
                            {(result.metrics.contentLength / 1024).toFixed(2)} KB
                          </span>
                        </div>
                      )}
                      {result.error && (
                        <div className="detail-row error">
                          <span className="detail-label">Erro:</span>
                          <span className="detail-value">{result.error}</span>
                        </div>
                      )}
                      {result.details && (
                        <div className="detail-row">
                          <span className="detail-label">Detalhes:</span>
                          <span className="detail-value">{result.details}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {testHistory.length > 0 && (
          <div className="history-section">
            <h3>📜 Histórico de Testes</h3>
            <div className="history-grid">
              {testHistory.map((session, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-time">
                    {new Date(session.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                  <div className="history-stats">
                    <span className="history-stat pass">✅ {session.passed}</span>
                    <span className="history-stat fail">❌ {session.failed}</span>
                    <span className="history-stat time">⏱️ {session.avgTime}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
      </main>
    </div>
  );
}
