// components/tv/ProducaoCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Factory, Package, Clock, AlertTriangle } from 'lucide-react';

export default function ProducaoCard() {
  const linhas = [
    { id: 1, nome: 'Linha A', status: 'operando', eficiencia: 94, cor: 'green' },
    { id: 2, nome: 'Linha B', status: 'operando', eficiencia: 87, cor: 'green' },
    { id: 3, nome: 'Linha C', status: 'manutenção', eficiencia: 0, cor: 'yellow' },
    { id: 4, nome: 'Linha D', status: 'operando', eficiencia: 91, cor: 'green' },
  ];

  const getStatusColor = (cor: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
    };
    return colors[cor] || 'bg-gray-500';
  };

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Factory className="w-6 h-6 text-blue-400" />
          Status da Produção
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-400 text-sm">Tempo Real</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20"
        >
          <Package className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-3xl font-bold text-white">4.832</div>
          <div className="text-white/60 text-sm">Unidades hoje</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20"
        >
          <Clock className="w-8 h-8 text-purple-400 mb-2" />
          <div className="text-3xl font-bold text-white">6h 42m</div>
          <div className="text-white/60 text-sm">Tempo operacional</div>
        </motion.div>
      </div>

      <div className="space-y-3 flex-1">
        {linhas.map((linha, i) => (
          <motion.div
            key={linha.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(linha.cor)} ${linha.status === 'operando' ? 'animate-pulse' : ''}`} />
              <span className="text-white font-medium">{linha.nome}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                linha.status === 'operando' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {linha.status}
              </span>
            </div>
            {linha.eficiencia > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${getStatusColor(linha.cor)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${linha.eficiencia}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="text-white/60 text-sm w-10">{linha.eficiencia}%</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 flex items-center gap-2 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20"
      >
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <span className="text-yellow-400 text-sm">Manutenção preventiva agendada: 14:00</span>
      </motion.div>
    </div>
  );
}
