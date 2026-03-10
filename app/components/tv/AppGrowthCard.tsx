'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AppGrowthCard.tsx — Crescimento real do app baseado nos dados do relatório
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, Newspaper, Code2, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import type { DailyReport } from '@/app/utils/daily-report-generator';

interface TvReport extends DailyReport {
  tv: {
    scoreSaude:       number;
    tendencia:        'crescendo' | 'estável' | 'atenção';
    totalConteudo:    number;
    statusApp:        string;
    ultimaAtualizacao: string;
    alertas:          string[];
    destaques:        string[];
  };
}

interface AppGrowthCardProps {
  relatorio: TvReport;
}

const TENDENCIA_CONFIG = {
  crescendo: { cor: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: '📈 Crescendo', icone: TrendingUp },
  estável:   { cor: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    label: '➡️ Estável',   icone: TrendingUp },
  atenção:   { cor: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   label: '⚠️ Atenção',  icone: AlertCircle },
};

export default function AppGrowthCard({ relatorio }: AppGrowthCardProps) {
  const tv  = relatorio.tv;
  const cfg = TENDENCIA_CONFIG[tv.tendencia];
  const TrendIcon = cfg.icone;

  // Score de saúde visual (arco SVG)
  const raio    = 42;
  const circ    = 2 * Math.PI * raio;
  const offset  = circ - (tv.scoreSaude / 100) * circ;
  const corScore = tv.scoreSaude >= 80 ? '#10b981' : tv.scoreSaude >= 60 ? '#06b6d4' : '#f59e0b';

  const kpis = [
    {
      icone: Newspaper,
      label: 'Posts Jornal',
      valor: relatorio.resumo.postsJornal,
      cor: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icone: BookOpen,
      label: 'Posts Blog',
      valor: relatorio.resumo.postsBlog,
      cor: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icone: Code2,
      label: 'Arquivos',
      valor: relatorio.metricas.arquivos,
      cor: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      icone: Zap,
      label: 'Modificados',
      valor: relatorio.resumo.arquivosModificados,
      cor: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 overflow-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5"
      >
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Crescimento do App
          </h3>
          <p className="text-white/40 text-xs mt-0.5">{relatorio.data}</p>
        </div>

        {/* Badge tendência */}
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.border} border ${cfg.cor}`}>
          {cfg.label}
        </div>
      </motion.div>

      {/* Score de saúde + KPIs */}
      <div className="flex gap-4 mb-5">

        {/* Arco de score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0 flex flex-col items-center justify-center"
        >
          <div className="relative w-24 h-24">
            <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="48" cy="48" r={raio} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
              <motion.circle
                cx="48" cy="48" r={raio}
                fill="none"
                stroke={corScore}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white leading-none">{tv.scoreSaude}</span>
              <span className="text-white/40 text-[9px] tracking-widest mt-0.5">SAÚDE</span>
            </div>
          </div>
          <span className="text-white/40 text-[10px] mt-1 text-center">Score geral</span>
        </motion.div>

        {/* KPIs 2×2 */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icone;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i + 0.3 }}
                className={`${kpi.bg} border ${kpi.border} rounded-xl p-3 flex flex-col gap-1`}
              >
                <Icon className={`w-4 h-4 ${kpi.cor}`} />
                <span className={`text-xl font-black ${kpi.cor}`}>{kpi.valor}</span>
                <span className="text-white/40 text-[10px] leading-tight">{kpi.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Linhas de código */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5"/> Linhas de Código
          </span>
          <span className="text-cyan-400 font-black text-lg">
            {(relatorio.metricas.linhasDeCodigo / 1000).toFixed(1)}k
          </span>
        </div>
        {/* Barras por tipo de arquivo */}
        <div className="space-y-1.5">
          {Object.entries(relatorio.metricas.arquivosPorTipo)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([ext, qtd], i) => {
              const total = Object.values(relatorio.metricas.arquivosPorTipo).reduce((a, b) => a + b, 0);
              const pct   = Math.round((qtd / total) * 100);
              const cores = ['bg-cyan-500', 'bg-purple-500', 'bg-blue-500', 'bg-emerald-500'];
              return (
                <div key={ext} className="flex items-center gap-2">
                  <span className="text-white/40 text-[10px] w-8 text-right font-mono">{ext}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${cores[i]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    />
                  </div>
                  <span className="text-white/40 text-[10px] w-5">{qtd}</span>
                </div>
              );
            })}
        </div>
      </motion.div>

      {/* Destaques */}
      {tv.destaques.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-3 space-y-1.5"
        >
          {tv.destaques.map((d, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-emerald-300 text-xs">{d}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Alertas */}
      {tv.alertas.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-1.5 mt-auto"
        >
          {tv.alertas.map((a, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-amber-300 text-xs">{a}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
