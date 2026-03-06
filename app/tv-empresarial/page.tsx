'use client';

import { useState, useEffect } from 'react';
import MetaCard from '@/app/components/tv/MetaCard';
import ProducaoCard from '@/app/components/tv/ProducaoCard';
import RankingCard from '@/app/components/tv/RankingCard';
import ComunicadoCard from '@/app/components/tv/ComunicadoCard';
import ClimaCard from '@/app/components/tv/ClimaCard';
import DailyReportCard from '@/app/components/tv/DailyReportCard';
import TvFooter from '@/app/components/tv/TvFooter';
import Link from 'next/link';
import { DailyReport } from '@/app/utils/daily-report-generator';

export default function TvEmpresarial() {
  const [relatorio, setRelatorio] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/daily-report');
        if (!response.ok) throw new Error('Erro ao carregar relatório');
        const data = await response.json();
        setRelatorio(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();

    // Auto-refresh a cada 5 minutos se habilitado
    const interval = autoRefresh ? setInterval(fetchRelatorio, 300000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  return (
    <main className="container flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-7xl mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            📺 TV EMPRESARIAL
          </h1>
          <p className="text-gray-400 text-sm mt-1">Dashboard em Tempo Real - Growth Tracker</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm hover:bg-blue-600/30 transition">
          ← Voltar
        </Link>
      </header>

      {/* Seção de Relatório Diário */}
      <div className="w-full max-w-7xl mb-12">
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="bg-slate-900/50 backdrop-blur rounded-3xl p-8 border border-cyan-500/20 flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-4xl mb-4 animate-spin">🔄</div>
                <p className="text-cyan-300">Carregando relatório do dia...</p>
              </div>
            </div>
          ) : error || !relatorio ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 text-center">
              <p className="text-red-300">❌ {error || 'Erro ao carregar relatório'}</p>
            </div>
          ) : (
            <DailyReportCard relatorio={relatorio} />
          )}
        </div>
      </div>

      {/* Grid de Cards Empresariais */}
      <div className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 pl-2 border-l-4 border-cyan-500">
          📊 Métricas Operacionais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          <MetaCard compact />
          <ProducaoCard />
          <RankingCard />
          <ComunicadoCard />
          <ClimaCard />
        </div>
      </div>

      {/* Footer */}
      <TvFooter />

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #0a0f1c 0%,
            #0f1322 50%,
            #0a0f1c 100%
          );
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 20% 50%,
            rgba(6, 182, 212, 0.05) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .container::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 80% 80%,
            rgba(59, 130, 246, 0.05) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        main {
          position: relative;
          z-index: 1;
        }

        header {
          animation: slideDown 0.6s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}