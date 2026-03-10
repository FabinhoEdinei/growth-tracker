'use client';

// ─────────────────────────────────────────────────────────────────────────────
// JornalBlogFeedCard.tsx — Feed ao vivo das publicações do jornal e blog
// ─────────────────────────────────────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Newspaper, BookOpen, ExternalLink, Clock } from 'lucide-react';
import type { DailyReport } from '@/app/utils/daily-report-generator';

interface JornalBlogFeedCardProps {
  relatorio: DailyReport;
}

type Aba = 'jornal' | 'blog';

export default function JornalBlogFeedCard({ relatorio }: JornalBlogFeedCardProps) {
  const [aba, setAba] = useState<Aba>('jornal');

  const posts = aba === 'jornal' ? relatorio.conteudo.jornal : relatorio.conteudo.blog;
  const totalJornal = relatorio.conteudo.jornal.length;
  const totalBlog   = relatorio.conteudo.blog.length;

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 overflow-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-400" />
          Publicações do App
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-xs">Ao vivo</span>
        </div>
      </motion.div>

      {/* Abas */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'jornal' as Aba, label: 'Jornal', total: totalJornal, icone: Newspaper, cor: 'blue' },
          { key: 'blog'   as Aba, label: 'Blog',   total: totalBlog,   icone: BookOpen,  cor: 'purple' },
        ].map(tab => {
          const ativo = aba === tab.key;
          const Icon  = tab.icone;
          const cores = {
            blue:   { ativo: 'bg-blue-500/20 border-blue-500/50 text-blue-300',   inativo: 'bg-white/5 border-white/10 text-white/40 hover:text-white/70' },
            purple: { ativo: 'bg-purple-500/20 border-purple-500/50 text-purple-300', inativo: 'bg-white/5 border-white/10 text-white/40 hover:text-white/70' },
          };
          return (
            <button
              key={tab.key}
              onClick={() => setAba(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${ativo ? cores[tab.cor].ativo : cores[tab.cor].inativo}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${ativo ? 'bg-white/20' : 'bg-white/5'}`}>
                {tab.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence mode="wait">
          {posts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-32 text-white/30"
            >
              <span className="text-3xl mb-2">{aba === 'jornal' ? '📰' : '📝'}</span>
              <span className="text-sm">Nenhuma publicação ainda hoje</span>
            </motion.div>
          ) : (
            <motion.div
              key={aba}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {posts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    aba === 'jornal'
                      ? 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10'
                      : 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">{aba === 'jornal' ? '📰' : '📝'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className={`text-sm font-semibold leading-tight line-clamp-2 ${
                          aba === 'jornal' ? 'text-blue-200' : 'text-purple-200'
                        }`}>
                          {post.titulo}
                        </h4>
                        <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/50 flex-shrink-0 mt-0.5 transition-colors" />
                      </div>
                      {post.excerpt && (
                        <p className="text-white/40 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock className="w-3 h-3 text-white/25" />
                        <span className="text-white/30 text-[10px]">{post.data}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Totalizador */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-white/10"
      >
        <div className="text-center">
          <span className="text-blue-400 text-xl font-black">{totalJornal}</span>
          <p className="text-white/40 text-xs">no Jornal</p>
        </div>
        <div className="text-center">
          <span className="text-purple-400 text-xl font-black">{totalBlog}</span>
          <p className="text-white/40 text-xs">no Blog</p>
        </div>
      </motion.div>
    </div>
  );
}
