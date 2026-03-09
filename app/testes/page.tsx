'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type RouteStatus = 'idle' | 'running' | 'pass' | 'fail' | 'warn' | 'skip';

interface RouteTest {
  id: string;
  label: string;
  path: string;
  method?: string;
  expectedStatus?: number; // se não informado, qualquer 2xx passa
  expectRedirect?: boolean;
  tags: string[];
}

interface TestResult {
  id: string;
  label: string;
  path: string;
  tags: string[];
  status: RouteStatus;
  httpCode?: number;
  expectedCode?: number;
  latencyMs?: number;
  retries: number;
  headers?: Record<string, string>;
  errorSnippet?: string; // primeiros 300 chars do body em caso de erro
  redirectTo?: string;
  timestamp: number;
}

interface LogLine {
  t: number;
  text: string;
  kind: 'info' | 'pass' | 'fail' | 'warn' | 'head';
}

// ─── Rotas a testar ───────────────────────────────────────────────────────────

const ROUTE_TESTS: RouteTest[] = [
  // Páginas
  { id: 'home',      label: 'Home',           path: '/',                expectedStatus: 200, tags: ['page'] },
  { id: 'dashboard', label: 'Dashboard',      path: '/dashboard',       expectedStatus: 200, tags: ['page'] },
  { id: 'blog',      label: 'Blog (listagem)',path: '/blog',            expectedStatus: 200, tags: ['page'] },
  { id: 'jornal',    label: 'Jornal',         path: '/jornal',          expectedStatus: 200, tags: ['page'] },
  { id: 'tv',        label: 'TV Empresarial', path: '/tv-empresarial',  expectedStatus: 200, tags: ['page'] },
  { id: 'testes',    label: 'Testes (self)',  path: '/testes',          expectedStatus: 200, tags: ['page'] },
  // APIs
  { id: 'api-code',  label: 'API /code-stats',path: '/api/code-stats',  expectedStatus: 200, method: 'GET', tags: ['api'] },
  // 404 esperado (valida que a página de erro existe e retorna 404 correto)
  { id: 'slug-404',  label: 'Blog slug inexistente', path: '/blog/__teste_404__', expectedStatus: 404, tags: ['page', '404'] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RETRY_LIMIT = 2;
const TIMEOUT_MS  = 8000;

async function probeRoute(test: RouteTest): Promise<Omit<TestResult, 'timestamp'>> {
  let lastError = '';
  let retries   = 0;

  for (let attempt = 0; attempt <= RETRY_LIMIT; attempt++) {
    const t0 = Date.now();
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

      const res = await fetch(test.path, {
        method: test.method || 'GET',
        redirect: 'manual',
        cache: 'no-store',
        signal: ctrl.signal,
      });
      clearTimeout(timer);

      const latencyMs = Date.now() - t0;
      const code       = res.status;
      const expected   = test.expectedStatus;

      // Captura headers relevantes
      const headers: Record<string, string> = {};
      ['content-type', 'cache-control', 'x-powered-by', 'location', 'x-deny-reason'].forEach(h => {
        const v = res.headers.get(h);
        if (v) headers[h] = v;
      });

      const redirectTo = headers['location'];

      // Captura snippet do body só em casos de erro
      let errorSnippet: string | undefined;
      if (code >= 400) {
        try {
          const text = await res.text();
          // Remove tags HTML, pega texto puro
          errorSnippet = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
        } catch { /* ignore */ }
      }

      // Determina pass/fail/warn
      let status: RouteStatus;
      if (expected !== undefined) {
        status = code === expected ? 'pass' : 'fail';
      } else if (code >= 200 && code < 300) {
        status = 'pass';
      } else if (code >= 300 && code < 400) {
        status = 'warn';
      } else {
        status = 'fail';
      }

      return {
        id: test.id, label: test.label, path: test.path, tags: test.tags,
        status, httpCode: code, expectedCode: expected,
        latencyMs, retries, headers, errorSnippet, redirectTo,
      };

    } catch (e: any) {
      lastError = e?.name === 'AbortError' ? `Timeout (>${TIMEOUT_MS}ms)` : String(e?.message ?? e);
      retries   = attempt;
      if (attempt < RETRY_LIMIT) await new Promise(r => setTimeout(r, 500));
    }
  }

  return {
    id: test.id, label: test.label, path: test.path, tags: test.tags,
    status: 'fail', retries,
    errorSnippet: lastError,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Badge({ status }: { status: RouteStatus }) {
  const map: Record<RouteStatus, [string, string]> = {
    idle:    ['#1e2235', '#4b5563'],
    running: ['#0c1a2e', '#60a5fa'],
    pass:    ['#052e16', '#4ade80'],
    fail:    ['#2d0a0a', '#f87171'],
    warn:    ['#1c1700', '#fbbf24'],
    skip:    ['#1a1a1a', '#6b7280'],
  };
  const labels: Record<RouteStatus, string> = {
    idle: '—', running: 'RUN', pass: 'PASS', fail: 'FAIL', warn: 'WARN', skip: 'SKIP',
  };
  const [bg, fg] = map[status];
  return (
    <span style={{
      background: bg, color: fg, border: `1px solid ${fg}44`,
      borderRadius: 5, padding: '2px 9px',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 11, fontWeight: 700, letterSpacing: 1,
      display: 'inline-block', minWidth: 46, textAlign: 'center',
    }}>
      {labels[status]}
    </span>
  );
}

function HttpCode({ code, expected }: { code?: number; expected?: number }) {
  if (!code) return null;
  const match    = expected === undefined || code === expected;
  const color    = match ? '#4ade80' : '#f87171';
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
      color, fontWeight: 700,
    }}>
      {code}{expected !== undefined && code !== expected && (
        <span style={{ color: '#6b7280', fontWeight: 400 }}> (esperado {expected})</span>
      )}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TestesPage() {
  const [results,   setResults]   = useState<TestResult[]>([]);
  const [log,       setLog]       = useState<LogLine[]>([]);
  const [running,   setRunning]   = useState(false);
  const [progress,  setProgress]  = useState({ current: 0, total: 0 });
  const [expanded,  setExpanded]  = useState<string | null>(null);
  const [filter,    setFilter]    = useState<'all' | 'fail' | 'pass' | 'warn'>('all');
  const logRef = useRef<HTMLDivElement>(null);

  const pushLog = useCallback((text: string, kind: LogLine['kind'] = 'info') => {
    const line: LogLine = { t: Date.now(), text, kind };
    setLog(prev => {
      const next = [...prev, line];
      setTimeout(() => logRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 30);
      return next;
    });
  }, []);

  const runAll = async () => {
    setRunning(true);
    setResults([]);
    setLog([]);
    setProgress({ current: 0, total: ROUTE_TESTS.length });

    pushLog('══════════════════════════════════════', 'head');
    pushLog(` GROWTH TRACKER — ROUTE TEST SUITE`, 'head');
    pushLog(` ${new Date().toLocaleString('pt-BR')}`, 'head');
    pushLog('══════════════════════════════════════', 'head');
    pushLog(`${ROUTE_TESTS.length} testes enfileirados`, 'info');
    pushLog('', 'info');

    const session: TestResult[] = [];

    for (let i = 0; i < ROUTE_TESTS.length; i++) {
      const test = ROUTE_TESTS[i];
      setProgress({ current: i + 1, total: ROUTE_TESTS.length });

      // Marca como running
      const pending: TestResult = {
        ...test, status: 'running', retries: 0, timestamp: Date.now(),
        expectedCode: test.expectedStatus,
      };
      setResults(prev => {
        const exists = prev.find(r => r.id === test.id);
        return exists ? prev.map(r => r.id === test.id ? pending : r) : [...prev, pending];
      });

      pushLog(`→ [${i + 1}/${ROUTE_TESTS.length}] ${test.label} (${test.path})`, 'info');

      const raw    = await probeRoute(test);
      const result: TestResult = { ...raw, timestamp: Date.now() };

      session.push(result);
      setResults(prev => prev.map(r => r.id === result.id ? result : r));

      if (result.status === 'pass') {
        pushLog(`  ✓ PASS ${result.httpCode} — ${result.latencyMs}ms${result.retries ? ` (retry ×${result.retries})` : ''}`, 'pass');
      } else if (result.status === 'warn') {
        pushLog(`  ⚠ WARN ${result.httpCode}${result.redirectTo ? ` → ${result.redirectTo}` : ''}`, 'warn');
      } else {
        pushLog(`  ✗ FAIL ${result.httpCode ?? 'NETWORK'} (esperado ${result.expectedCode ?? '2xx'})`, 'fail');
        if (result.errorSnippet) {
          pushLog(`    └ ${result.errorSnippet.slice(0, 120)}`, 'fail');
        }
      }
    }

    // Sumário
    const passed  = session.filter(r => r.status === 'pass').length;
    const failed  = session.filter(r => r.status === 'fail').length;
    const warned  = session.filter(r => r.status === 'warn').length;
    const avgMs   = Math.round(session.reduce((s, r) => s + (r.latencyMs ?? 0), 0) / session.length);

    pushLog('', 'info');
    pushLog('──────────────────────────────────────', 'head');
    pushLog(` ✓ ${passed} passed   ✗ ${failed} failed   ⚠ ${warned} warn`, failed > 0 ? 'fail' : 'pass');
    pushLog(` latência média: ${avgMs}ms`, 'info');
    pushLog('──────────────────────────────────────', 'head');

    setRunning(false);
  };

  const shown = results.filter(r =>
    filter === 'all' ? true :
    filter === 'fail' ? r.status === 'fail' :
    filter === 'pass' ? r.status === 'pass' :
    r.status === 'warn'
  );

  const passed  = results.filter(r => r.status === 'pass').length;
  const failed  = results.filter(r => r.status === 'fail').length;
  const warned  = results.filter(r => r.status === 'warn').length;
  const pct     = results.length > 0 ? Math.round((passed / results.length) * 100) : null;

  const S = {
    page: {
      minHeight: '100vh', background: '#080b12',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: '#e2e8f0',
      display: 'grid', gridTemplateColumns: '1fr',
    } as React.CSSProperties,
    wrap: {
      maxWidth: 820, margin: '0 auto', padding: '32px 20px',
    } as React.CSSProperties,
    topBar: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 32,
    } as React.CSSProperties,
    title: {
      margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: -0.5,
      display: 'flex', alignItems: 'center', gap: 10,
    } as React.CSSProperties,
    back: {
      color: '#4b5563', fontSize: 13, textDecoration: 'none',
      padding: '6px 14px', border: '1px solid #1e2235', borderRadius: 8,
    } as React.CSSProperties,
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Top bar */}
        <div style={S.topBar}>
          <h1 style={S.title}>
            <span style={{ fontSize: 18 }}>🛰️</span> Route Test Suite
          </h1>
          <Link href="/" style={S.back}>← Voltar</Link>
        </div>

        {/* Scoreboard */}
        {results.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10, marginBottom: 20,
          }}>
            {[
              { label: 'Passed',  val: passed,  color: '#4ade80' },
              { label: 'Failed',  val: failed,  color: '#f87171' },
              { label: 'Warned',  val: warned,  color: '#fbbf24' },
              { label: 'Taxa',    val: pct !== null ? `${pct}%` : '—', color: pct === 100 ? '#4ade80' : pct !== null && pct < 70 ? '#f87171' : '#fbbf24' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#0d1117', border: '1px solid #1e2235',
                borderRadius: 10, padding: '14px 18px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'monospace' }}>{s.val}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {running && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              height: 3, background: '#1e2235', borderRadius: 99, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                width: `${(progress.current / progress.total) * 100}%`,
                transition: 'width .3s ease',
              }} />
            </div>
            <div style={{ fontSize: 12, color: '#4b5563', marginTop: 6, fontFamily: 'monospace' }}>
              {progress.current}/{progress.total} — testando rotas...
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <button
            onClick={runAll}
            disabled={running}
            style={{
              background: running ? '#1e2235' : 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: running ? '#4b5563' : '#fff',
              border: 'none', borderRadius: 10,
              padding: '11px 24px', fontWeight: 700, fontSize: 14,
              cursor: running ? 'not-allowed' : 'pointer',
              letterSpacing: 0.3,
            }}
          >
            {running ? `⏳ Executando ${progress.current}/${progress.total}...` : '▶ Executar Todos os Testes'}
          </button>

          {results.length > 0 && (['all', 'pass', 'fail', 'warn'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? '#1e2235' : 'transparent',
              color: filter === f ? '#e2e8f0' : '#4b5563',
              border: `1px solid ${filter === f ? '#374151' : '#1e2235'}`,
              borderRadius: 8, padding: '8px 16px', fontSize: 12,
              cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}>
              {f === 'all' ? `Todos (${results.length})` :
               f === 'pass' ? `✓ ${passed}` :
               f === 'fail' ? `✗ ${failed}` : `⚠ ${warned}`}
            </button>
          ))}
        </div>

        {/* Results list */}
        {shown.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {shown.map(r => (
              <div
                key={r.id}
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                style={{
                  background: '#0d1117',
                  border: `1px solid ${r.status === 'fail' ? '#f8717133' : r.status === 'pass' ? '#4ade8022' : r.status === 'warn' ? '#fbbf2422' : '#1e2235'}`,
                  borderRadius: 10, padding: '14px 18px',
                  cursor: 'pointer', transition: 'border .15s',
                }}
              >
                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <Badge status={r.status} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#4b5563', marginTop: 1 }}>{r.path}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    <HttpCode code={r.httpCode} expected={r.expectedCode} />
                    {r.latencyMs !== undefined && (
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: r.latencyMs > 2000 ? '#fbbf24' : '#6b7280' }}>
                        {r.latencyMs}ms
                      </span>
                    )}
                    {r.retries > 0 && (
                      <span style={{ fontSize: 11, color: '#fbbf24' }}>retry ×{r.retries}</span>
                    )}
                    <span style={{ color: '#374151', fontSize: 12 }}>{expanded === r.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === r.id && (
                  <div style={{
                    marginTop: 14, paddingTop: 14,
                    borderTop: '1px solid #1e2235',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.tags.map(t => (
                        <span key={t} style={{
                          background: '#1e2235', color: '#6b7280',
                          borderRadius: 4, padding: '2px 8px', fontSize: 11,
                          fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 0.8,
                        }}>{t}</span>
                      ))}
                    </div>

                    {/* Headers */}
                    {r.headers && Object.keys(r.headers).length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Headers</div>
                        {Object.entries(r.headers).map(([k, v]) => (
                          <div key={k} style={{ fontFamily: 'monospace', fontSize: 12, color: '#9ca3af' }}>
                            <span style={{ color: '#6366f1' }}>{k}:</span> {v}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Redirect */}
                    {r.redirectTo && (
                      <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        <span style={{ color: '#fbbf24' }}>→ Redireciona para: </span>
                        <span style={{ color: '#e2e8f0' }}>{r.redirectTo}</span>
                      </div>
                    )}

                    {/* Error body snippet */}
                    {r.errorSnippet && (
                      <div>
                        <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Resposta / Erro</div>
                        <div style={{
                          background: '#140a0a', border: '1px solid #f8717122',
                          borderRadius: 6, padding: '10px 12px',
                          fontFamily: 'monospace', fontSize: 12, color: '#fca5a5',
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          maxHeight: 120, overflowY: 'auto',
                        }}>
                          {r.errorSnippet}
                        </div>
                      </div>
                    )}

                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>
                      {new Date(r.timestamp).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {results.length === 0 && !running && (
          <div style={{
            background: '#0d1117', border: '1px dashed #1e2235',
            borderRadius: 12, padding: '48px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Nenhum teste executado</div>
            <div style={{ color: '#4b5563', fontSize: 13 }}>
              Clique em <strong style={{ color: '#6366f1' }}>▶ Executar</strong> para verificar todas as rotas
            </div>
          </div>
        )}

        {/* Terminal log */}
        {log.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              fontSize: 11, color: '#4b5563', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 8,
            }}>Log de execução</div>
            <div
              ref={logRef}
              style={{
                background: '#050709', border: '1px solid #1e2235',
                borderRadius: 10, padding: '14px 16px',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 12, lineHeight: 1.7,
                maxHeight: 300, overflowY: 'auto',
              }}
            >
              {log.map((l, i) => (
                <div key={i} style={{
                  color: l.kind === 'pass' ? '#4ade80' :
                         l.kind === 'fail' ? '#f87171' :
                         l.kind === 'warn' ? '#fbbf24' :
                         l.kind === 'head' ? '#6366f1' : '#6b7280',
                }}>
                  {l.text || '\u00a0'}
                </div>
              ))}
              {running && (
                <div style={{ color: '#60a5fa', animation: 'pulse 1s infinite' }}>▌</div>
              )}
            </div>
          </div>
        )}

        {/* Add routes hint */}
        <div style={{
          marginTop: 28, padding: '12px 16px',
          background: '#0d1117', border: '1px solid #1e2235',
          borderRadius: 8, fontSize: 12, color: '#4b5563',
        }}>
          💡 Para adicionar rotas, edite o array <code style={{ color: '#6366f1', background: '#12162a', padding: '1px 6px', borderRadius: 4 }}>ROUTE_TESTS</code> no topo deste arquivo.
          Cada teste aceita <code style={{ color: '#6366f1', background: '#12162a', padding: '1px 6px', borderRadius: 4 }}>expectedStatus</code> para validar o código HTTP exato.
        </div>

      </div>
    </div>
  );
}
