// components/tv/ClimaCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Smile, Meh, Frown, TrendingUp, Users, Heart } from 'lucide-react';

export default function ClimaCard() {
  const sentimentos = [
    { emoji: '😄', label: 'Excelente', valor: 45, cor: 'bg-green-500' },
    { emoji: '🙂', label: 'Bom', valor: 35, cor: 'bg-blue-500' },
    { emoji: '😐', label: 'Neutro', valor: 15, cor: 'bg-yellow-500' },
    { emoji: '😕', label: 'Ruim', valor: 5, cor: 'bg-red-500' },
  ];

  const metricas = [
    { label: 'NPS Interno', valor: '72', icone: TrendingUp, cor: 'text-green-400' },
    { label: 'Participação', valor: '89%', icone: Users, cor: 'text-blue-400' },
    { label: 'Satisfação', valor: '4.2/5', icone: Heart, cor: 'text-pink-400' },
  ];

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Smile className="w-6 h-6 text-pink-400" />
          Clima Organizacional
        </h3>
        <span className="text-white/40 text-sm">Atualizado hoje</span>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {metricas.map((metrica, i) => (
          <motion.div
            key={metrica.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-3 bg-white/5 rounded-xl border border-white/5"
          >
            <metrica.icone className={`w-6 h-6 ${metrica.cor} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-white">{metrica.valor}</div>
            <div className="text-white/50 text-xs">{metrica.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex-1">
        <h4 className="text-white/60 text-sm mb-4">Distribuição de sentimentos</h4>
        <div className="space-y-3">
          {sentimentos.map((sent, i) => (
            <motion.div
              key={sent.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">{sent.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-white/80 text-sm">{sent.label}</span>
                  <span className="text-white/60 text-sm">{sent.valor}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${sent.cor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${sent.valor}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 p-4 bg-pink-500/10 rounded-xl border border-pink-500/20"
      >
        <p className="text-pink-400 text-sm text-center">
          � Dica: Reconheça um colega hoje! A gratidão aumenta o engajamento.
        </p>
      </motion.div>
    </div>
  );
}
