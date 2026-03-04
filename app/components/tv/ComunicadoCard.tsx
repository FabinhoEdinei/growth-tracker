// components/tv/ComunicadoCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Megaphone, Bell, Calendar, ArrowRight } from 'lucide-react';

export default function ComunicadoCard() {
  const comunicados = [
    { 
      tipo: 'urgente', 
      titulo: 'Alteração no horário de almoço', 
      data: 'Hoje', 
      cor: 'red',
      icone: Bell
    },
    { 
      tipo: 'novidade', 
      titulo: 'Novo benefício: Gympass', 
      data: 'Ontem', 
      cor: 'green',
      icone: Megaphone
    },
    { 
      tipo: 'evento', 
      titulo: 'Festa de fim de ano - 20/12', 
      data: '2 dias atrás', 
      cor: 'purple',
      icone: Calendar
    },
  ];

  const getColorClasses = (cor: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
      green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
    };
    return colors[cor] || colors.purple;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-white/10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-orange-400" />
          Comunicados
        </h3>
        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">
          3 novos
        </span>
      </motion.div>

      <div className="space-y-4 flex-1">
        {comunicados.map((com, i) => {
          const colors = getColorClasses(com.cor);
          const Icone = com.icone;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`p-4 rounded-xl border ${colors.bg} ${colors.border} cursor-pointer group hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${colors.text}`}>
                  <Icone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
                      {com.tipo}
                    </span>
                    <span className="text-white/30 text-xs">• {com.data}</span>
                  </div>
                  <h4 className="text-white font-medium group-hover:text-orange-400 transition-colors">
                    {com.titulo}
                  </h4>
                </div>
                <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 w-full py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
      >
        Ver todos os comunicados
      </motion.button>
    </div>
  );
}
