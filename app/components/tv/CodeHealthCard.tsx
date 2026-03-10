'use client';

// ─────────────────────────────────────────────────────────────────────────────
// CodeHealthCard.tsx — Saúde do código baseada nos dados reais do relatório
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { Code2, CheckCircle, XCircle, FileCode, Terminal, Activity } from 'lucide-react';
import type { DailyReport } from '@/app/utils/daily-report-generator';

interface CodeHealthCardProps {
  relatorio: DailyReport;
}

const EXT_CORES: Record<string, { bg: string; text: string; label: string }> = {
  '.tsx': { bg: 'bg-blue-500',   text: 'text-blue-300',   label: 'TypeScript React' },
  '.ts':  { bg: 'bg-cyan-500',   text: 'text-cyan-300',   label: 'TypeScript' },
  '.css': { bg: 'bg-pink-500',   text: 'text-pink-300',   label: 'CSS' },
  '.md':  { bg: 'bg-amber-500',  text: 'text-amber-300',  label: 'Markdown' },
  '.json':{ bg: 'bg-emerald-500',text: 'text-emerald-300',label: 'JSON' },
};

export default function CodeHealthCard({ relatorio }: CodeHealthCardProps) {
  const { testes, metricas, resumo } = relatorio;
  const taxaNum = parseInt(testes.taxa) || 0;

  const corTaxa = taxaNum === 100 ? '#10b981'
                : taxaNum >= 80  ? '#06b6d4'
                : taxaNum >= 60  ? '#f59e0b'
                : '#ef4444';

  const raio  = 38;
  const circ  = 2 * Math.PI * raio;
  const offset = circ - (taxaNum / 100) * circ;

  const totalTipos = Object.values(metricas.arquivosPorTipo).reduce((a, b) => a + b, 0);

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 overflow-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5"
      >
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-green-400" />
          Saúde do Código
        </h3>
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-xs font-semibold">Ao vivo</span>
        </div>
      </motion.div>

      {/* Testes + arco */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 mb-5 p-4 bg-white/5 rounded-xl border border-white/10"
      >
        {/* Arco taxa */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r={raio} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
            <motion.circle
              cx="40" cy="40" r={raio}
              fill="none"
              stroke={corTaxa}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-white leading-none">{testes.taxa}</span>
            <span className="text-white/40 text-[9px]">testes</span>
          </div>
        </div>

        {/* Detalhes */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-white/70 text-sm">Passaram</span>
            </div>
            <span className="text-green-400 font-black text-lg">{testes.passou}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-white/70 text-sm">Falharam</span>
            </div>
            <span className="text-red-400 font-black text-lg">{testes.falhou}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-white/40" />
              <span className="text-white/40 text-sm">Total</span>
            </div>
            <span className="text-white/60 font-bold">{testes.total}</span>
          </div>
        </div>
      </motion.div>

      {/* Métricas de linhas */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-3 gap-2 mb-4"
      >
        {[
          { label: 'Linhas', valor: `${(metricas.linhasDeCodigo / 1000).toFixed(1)}k`, cor: 'text-cyan-400' },
          { label: 'Arquivos', valor: String(metricas.arquivos), cor: 'text-blue-400' },
          { label: 'Modificados', valor: String(resumo.arquivosModificados), cor: 'text-amber-400' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="bg-white/5 rounded-xl p-3 text-center border border-white/10"
          >
            <div className={`text-xl font-black ${m.cor}`}>{m.valor}</div>
            <div className="text-white/40 text-[10px] mt-0.5">{m.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Distribuição por tipo */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-3">
          <FileCode className="w-4 h-4 text-white/40" />
          <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Tipos de arquivo</span>
        </div>
        <div className="space-y-2">
          {Object.entries(metricas.arquivosPorTipo)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([ext, qtd], i) => {
              const pct  = Math.round((qtd / totalTipos) * 100);
              const cfg  = EXT_CORES[ext] ?? { bg: 'bg-slate-500', text: 'text-slate-300', label: ext };
              return (
                <motion.div
                  key={ext}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-2"
                >
                  <span className={`text-[10px] font-mono ${cfg.text} w-10 text-right`}>{ext}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${cfg.bg}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.08 }}
                    />
                  </div>
                  <div className="flex items-center gap-1 w-12 justify-end">
                    <span className="text-white/50 text-[10px]">{qtd}</span>
                    <span className="text-white/25 text-[9px]">({pct}%)</span>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Status geral */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className={`mt-4 p-3 rounded-xl border text-center text-xs font-semibold ${
          taxaNum === 100
            ? 'bg-green-500/10 border-green-500/30 text-green-300'
            : taxaNum >= 80
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}
      >
        {taxaNum === 100 ? '✅ Código em perfeita saúde!'
          : taxaNum >= 80 ? `⚡ ${testes.falhou} teste(s) para corrigir`
          : `⚠️ Atenção: ${testes.falhou} falha(s) detectada(s)`}
      </motion.div>
    </div>
  );
}
