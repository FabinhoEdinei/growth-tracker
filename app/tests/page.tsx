'use client'

import { useState } from 'react'

export default function TestsPage() {
  const [output, setOutput] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)

  const runTests = async () => {
    setLoading(true)
    setOutput(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/run-tests')
      const data = await res.json()
      setOutput(data.output)
      setSuccess(data.success)
    } catch (err) {
      setOutput('Erro ao conectar com a API: ' + (err as Error).message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: '#e0e0e0', 
      padding: '2rem',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ 
        fontSize: '1.5rem', 
        marginBottom: '1rem', 
        color: '#7dd3fc' 
      }}>
        Testes Automatizados - Growth Tracker
      </h1>

      <button
        onClick={runTests}
        disabled={loading}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: loading ? '#334155' : '#0ea5e9',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.9rem',
          fontFamily: 'monospace',
          marginBottom: '1rem',
        }}
      >
        {loading ? 'Executando testes...' : 'Executar Testes'}
      </button>

      {success !== null && (
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          backgroundColor: success ? '#052e16' : '#450a0a',
          border: `1px solid ${success ? '#16a34a' : '#dc2626'}`,
          color: success ? '#4ade80' : '#f87171',
          fontWeight: 'bold',
        }}>
          {success ? 'Todos os testes passaram!' : 'Alguns testes falharam.'}
        </div>
      )}

      {output && (
        <pre style={{
          backgroundColor: '#111827',
          padding: '1rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          fontSize: '0.8rem',
          lineHeight: '1.5',
          maxHeight: '70vh',
          border: '1px solid #1e293b',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {output}
        </pre>
      )}
    </div>
  )
}
