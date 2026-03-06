'use client';

import { motion } from 'framer-motion';
import { TrendingUp, FileText, Activity, Code } from 'lucide-react';
import { DailyReport } from '@/app/utils/daily-report-generator';

interface DailyReportCardProps {
  relatorio: DailyReport;
}

export default function DailyReportCard({ relatorio }: DailyReportCardProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 pb-6 border-b border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              📊 Relatório do Dia
            </h2>
            <span className="text-cyan-400/70 text-sm font-mono">{relatorio.data}</span>
          </div>
          <p className="text-cyan-300/60 text-sm">
            Resumo de atividades e publicações de {new Date().toLocaleDateString('pt-BR')}
          </p>
        </motion.div>

        {/* KPIs Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
          {/* Posts Jornal */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm font-semibold">📰 Posts Jornal</span>
              <span className="text-2xl font-bold text-blue-400">{relatorio.resumo.postsJornal}</span>
            </div>
            <div className="text-xs text-blue-300/60">publicações do dia</div>
          </div>

          {/* Posts Blog */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 text-sm font-semibold">📝 Posts Blog</span>
              <span className="text-2xl font-bold text-purple-400">{relatorio.resumo.postsBlog}</span>
            </div>
            <div className="text-xs text-purple-300/60">artigos publicados</div>
          </div>

          {/* Arquivos Modificados */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 text-sm font-semibold">💾 Arquivos</span>
              <span className="text-2xl font-bold text-green-400">
                {relatorio.resumo.arquivosModificados}
              </span>
            </div>
            <div className="text-xs text-green-300/60">modificados</div>
          </div>

          {/* Duração */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-300 text-sm font-semibold">⏱️ Tempo</span>
              <span className="text-lg font-bold text-orange-400">{relatorio.resumo.duracaoTotal}</span>
            </div>
            <div className="text-xs text-orange-300/60">dedicado</div>
          </div>
        </motion.div>

        {/* Testes */}
        <motion.div variants={itemVariants} className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-green-300 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Testes Executados
            </h3>
            <span className="text-2xl font-bold text-green-400">{relatorio.testes.taxa}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{relatorio.testes.passou}</div>
              <div className="text-xs text-green-300/60">Passaram ✅</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{relatorio.testes.falhou}</div>
              <div className="text-xs text-red-300/60">Falharam ❌</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{relatorio.testes.total}</div>
              <div className="text-xs text-cyan-300/60">Total</div>
            </div>
          </div>
        </motion.div>

        {/* Conteúdo Publicado */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8 flex-1">
          {/* Jornal */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 overflow-hidden flex flex-col">
            <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Publicações Jornal
            </h4>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {relatorio.conteudo.jornal.slice(0, 3).map((post, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="text-xs bg-blue-500/5 p-2 rounded border border-blue-400/10 hover:border-blue-400/30 transition"
                >
                  <div className="font-semibold text-blue-300 line-clamp-2">{post.titulo}</div>
                  <div className="text-blue-300/50 text-xs mt-1">{post.data}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Blog */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 overflow-hidden flex flex-col">
            <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Artigos Blog
            </h4>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {relatorio.conteudo.blog.slice(0, 3).map((post, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="text-xs bg-purple-500/5 p-2 rounded border border-purple-400/10 hover:border-purple-400/30 transition"
                >
                  <div className="font-semibold text-purple-300 line-clamp-2">{post.titulo}</div>
                  <div className="text-purple-300/50 text-xs mt-1">{post.data}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Métricas de Código */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Estatísticas de Código
            </h4>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-lg font-bold text-cyan-400">
                {(relatorio.metricas.linhasDeCodigo / 1000).toFixed(1)}k
              </div>
              <div className="text-xs text-cyan-300/60">Linhas de código</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">{relatorio.metricas.arquivos}</div>
              <div className="text-xs text-blue-300/60">Arquivos</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">
                {Object.keys(relatorio.metricas.arquivosPorTipo).length}
              </div>
              <div className="text-xs text-purple-300/60">Tipos de arquivo</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
