'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DailyReportCard.tsx — Painel principal do relatório diário enriquecido
// Exibe os dados reais do app: conteúdo, código, testes + botão gerar jornal
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TrendingUp, FileText, Activity, Code, Sparkles, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { DailyReport } from '@/app/utils/daily-report-generator';

interface TvReport extends DailyReport {
  tv?: {
    scoreSaude:       number;
    tendencia:        'crescendo' | 'estável' | 'atenção';
    totalConteudo:    number;
    statusApp:        string;
    ultimaAtualizacao: string;
    alertas:          string[];
    destaques:        string[];
  };
}

interface DailyReportCardProps {
  relatorio: TvReport;
}

type StatusGeracao = 'idle' | 'gerando' | 'sucesso' | 'erro';

export default function DailyReportCard({ relatorio }: DailyReportCardProps) {
  const [statusGeracao, setStatusGeracao] = useState<StatusGeracao>('idle');
  const [slugGerado, setSlugGerado] = useState<string | null>(null);
  const [personagem, setPersonagem] = useState<'fabio' | 'claudia'>('fabio');

  // ── Gerar post do jornal ────────────────────────────────────────────────────
  async function gerarPostJornal(forcar = false) {
    setStatusGeracao('gerando');
    try {
      const res = await fetch(
        `/api/tv-report?gerarJornal=true&personagem=${personagem}${forcar ? '&forcarJornal=true' : ''}`,
      );
      const data = await res.json();

      if (data.jornal?.slug) {
        setSlugGerado(data.jornal.slug);
        setStatusGeracao('sucesso');
      } else {
        setStatusGeracao('erro');
      }
    } catch {
      setStatusGeracao('erro');
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0 },
  };

  const totalConteudo = relatorio.resumo.postsJornal + relatorio.resumo.postsBlog;
  const tv = relatorio.tv;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative h-full bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-full flex flex-col">

        {/* ── Header ── */}
        <motion.div variants={itemVariants} className="mb-6 pb-5 border-b border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              📊 Relatório do Dia
            </h2>
            <span className="text-cyan-400/60 text-sm font-mono">{relatorio.data}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-cyan-300/50 text-sm">
              Dados reais do Growth Tracker — {new Date().toLocaleDateString('pt-BR')}
            </p>
            {tv && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                tv.tendencia === 'crescendo' ? 'bg-emerald-500/20 text-emerald-300' :
                tv.tendencia === 'estável'   ? 'bg-cyan-500/20 text-cyan-300' :
                'bg-amber-500/20 text-amber-300'
              }`}>
                {tv.tendencia === 'crescendo' ? '📈' : tv.tendencia === 'estável' ? '➡️' : '⚠️'} {tv.tendencia}
              </span>
            )}
          </div>
        </motion.div>

        {/* ── KPIs ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: '📰 Posts Jornal',   valor: relatorio.resumo.postsJornal,      cor: 'blue',   sub: 'publicações' },
            { label: '📝 Posts Blog',     valor: relatorio.resumo.postsBlog,        cor: 'purple', sub: 'artigos' },
            { label: '💾 Arquivos Mod.', valor: relatorio.resumo.arquivosModificados, cor: 'green', sub: 'modificados' },
            { label: '⏱️ Tempo',          valor: relatorio.resumo.duracaoTotal,      cor: 'orange', sub: 'dedicado' },
          ].map(kpi => {
            const cores: Record<string, string> = {
              blue:   'bg-blue-500/10 border-blue-500/30 text-blue-400',
              purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
              green:  'bg-green-500/10 border-green-500/30 text-green-400',
              orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
            };
            return (
              <div key={kpi.label} className={`rounded-xl p-4 border ${cores[kpi.cor]}`}>
                <div className="text-xs font-semibold opacity-80 mb-1">{kpi.label}</div>
                <div className="text-2xl font-black">{kpi.valor}</div>
                <div className="text-xs opacity-50 mt-0.5">{kpi.sub}</div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Testes ── */}
        <motion.div variants={itemVariants} className="mb-6 p-5 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-green-300 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Testes Executados
            </h3>
            <span className="text-2xl font-black text-green-400">{relatorio.testes.taxa}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Passaram ✅', valor: relatorio.testes.passou, cor: 'text-green-400' },
              { label: 'Falharam ❌', valor: relatorio.testes.falhou, cor: 'text-red-400' },
              { label: 'Total',       valor: relatorio.testes.total,  cor: 'text-cyan-400' },
            ].map(t => (
              <div key={t.label} className="text-center">
                <div className={`text-2xl font-black ${t.cor}`}>{t.valor}</div>
                <div className="text-xs text-white/40 mt-0.5">{t.label}</div>
              </div>
            ))}
          </div>
          {/* Barra de progresso dos testes */}
          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: relatorio.testes.taxa }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* ── Conteúdo publicado ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6 flex-1">
          {[
            { titulo: 'Publicações Jornal', posts: relatorio.conteudo.jornal, cor: 'blue' },
            { titulo: 'Artigos Blog',       posts: relatorio.conteudo.blog,   cor: 'purple' },
          ].map(secao => {
            const c = secao.cor === 'blue'
              ? { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', item: 'bg-blue-500/5 border-blue-400/10 hover:border-blue-400/30' }
              : { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-300', item: 'bg-purple-500/5 border-purple-400/10 hover:border-purple-400/30' };
            return (
              <div key={secao.titulo} className={`${c.bg} border ${c.border} rounded-xl p-4 flex flex-col overflow-hidden`}>
                <h4 className={`text-sm font-bold ${c.text} mb-3 flex items-center gap-2`}>
                  <FileText className="w-4 h-4" /> {secao.titulo}
                </h4>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {secao.posts.length === 0 ? (
                    <p className="text-white/25 text-xs text-center py-4">Nenhuma publicação hoje</p>
                  ) : (
                    secao.posts.slice(0, 4).map((post, i) => (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        className={`text-xs ${c.item} p-2 rounded border transition`}
                      >
                        <div className={`font-semibold ${c.text} line-clamp-2`}>{post.titulo}</div>
                        <div className="text-white/30 text-xs mt-0.5">{post.data}</div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Métricas de código ── */}
        <motion.div variants={itemVariants} className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Code className="w-4 h-4" /> Estatísticas de Código
            </h4>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Linhas', valor: `${(relatorio.metricas.linhasDeCodigo / 1000).toFixed(1)}k`, cor: 'text-cyan-400' },
              { label: 'Arquivos', valor: String(relatorio.metricas.arquivos), cor: 'text-blue-400' },
              { label: 'Tipos', valor: String(Object.keys(relatorio.metricas.arquivosPorTipo).length), cor: 'text-purple-400' },
            ].map(m => (
              <div key={m.label}>
                <div className={`text-xl font-black ${m.cor}`}>{m.valor}</div>
                <div className="text-xs text-white/40">{m.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Destaques e alertas ── */}
        {tv && (tv.destaques.length > 0 || tv.alertas.length > 0) && (
          <motion.div variants={itemVariants} className="mb-6 space-y-2">
            {tv.destaques.map((d, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-300 text-sm">{d}</span>
              </div>
            ))}
            {tv.alertas.map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-amber-300 text-sm">{a}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Gerador de post do jornal ── */}
        <motion.div variants={itemVariants} className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
          <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" />
            Gerar Post do Jornal
            <span className="text-xs font-normal text-white/40">— cria um .md com a história do dia</span>
          </h4>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Seletor de personagem */}
            <div className="flex gap-2">
              {(['fabio', 'claudia'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPersonagem(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    personagem === p
                      ? 'bg-purple-500/30 border-purple-500/60 text-purple-200'
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                  }`}
                >
                  {p === 'fabio' ? '🤠 Fabio' : '🌸 Cláudia'}
                </button>
              ))}
            </div>

            {/* Botão gerar */}
            <button
              onClick={() => gerarPostJornal(false)}
              disabled={statusGeracao === 'gerando'}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/40 rounded-xl text-white text-sm font-semibold transition-all"
            >
              {statusGeracao === 'gerando' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Gerar Agora</>
              )}
            </button>

            {/* Forçar */}
            {statusGeracao === 'sucesso' && (
              <button
                onClick={() => gerarPostJornal(true)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 text-xs transition"
              >
                Regenerar
              </button>
            )}
          </div>

          {/* Feedback */}
          {statusGeracao === 'sucesso' && slugGerado && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-green-500/15 border border-green-500/30 rounded-lg"
            >
              <p className="text-green-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Post gerado! Slug: <code className="font-mono text-green-200">{slugGerado}</code>
              </p>
              <p className="text-green-400/50 text-xs mt-1">
                Disponível em /jornal/{slugGerado}
              </p>
            </motion.div>
          )}

          {statusGeracao === 'erro' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-red-500/15 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-300 text-xs">❌ Erro ao gerar o post. Tente novamente.</p>
            </motion.div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
