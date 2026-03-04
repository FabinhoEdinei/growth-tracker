// components/tv/MetaCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, Zap } from 'lucide-react';

export default function MetaCard() {
  const metas = [
    { label: 'Meta Diária', value: '85%', icon: Target, color: 'text-green-400', progress: 85 },
    { label: 'Produção', value: '1.240', icon: Zap, color: 'text-yellow-400', progress: 72 },
    { label: 'Equipe', value: '42', icon: Users, color: 'text-blue-400', progress: 100 },
    { label: 'Crescimento', value: '+23%', icon: TrendingUp, color: 'text-purple-400', progress: 23 },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-white/10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-green-400" />
          Metas do Dia
        </h3>
        <span className="text-white/40 text-sm">{new Date().toLocaleDateString('pt-BR')}</span>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {metas.map((meta, i) => (
          <motion.div
            key={meta.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <meta.icon className={`w-5 h-5 ${meta.color}`} />
              <span className="text-white/60 text-sm">{meta.label}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{meta.value}</div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${meta.color.replace('text', 'bg')}`}
                initial={{ width: 0 }}
                animate={{ width: `${meta.progress}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20"
      >
        <p className="text-green-400 text-sm font-medium text-center">
          🎉 Meta semanal 92% completa! Continue assim!
        </p>
      </motion.div>
    </div>
  );
}
