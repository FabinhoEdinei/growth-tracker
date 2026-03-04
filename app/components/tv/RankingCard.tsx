// components/tv/RankingCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, TrendingDown } from 'lucide-react';

export default function RankingCard() {
  const colaboradores = [
    { pos: 1, nome: 'Ana Silva', setor: 'Vendas', pontos: 2847, variacao: '+12%', destaque: true },
    { pos: 2, nome: 'Carlos Mendes', setor: 'Produção', pontos: 2654, variacao: '+8%', destaque: false },
    { pos: 3, nome: 'Mariana Costa', setor: 'Vendas', pontos: 2598, variacao: '+15%', destaque: false },
    { pos: 4, nome: 'João Pereira', setor: 'Logística', pontos: 2341, variacao: '-3%', destaque: false },
    { pos: 5, nome: 'Fernanda Lima', setor: 'Produção', pontos: 2289, variacao: '+5%', destaque: false },
  ];

  const getPosicaoIcon = (pos: number) => {
    if (pos === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (pos === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (pos === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="w-6 h-6 flex items-center justify-center text-white/40 font-bold">{pos}</span>;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-white/10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-purple-400" />
          Ranking da Semana
        </h3>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white/60 text-sm">Top Performers</span>
        </div>
      </motion.div>

      <div className="space-y-3 flex-1">
        {colaboradores.map((colab, i) => (
          <motion.div
            key={colab.pos}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-xl border ${
              colab.destaque 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                : 'bg-white/5 border-white/5'
            }`}
          >
            <div className="flex-shrink-0">
              {getPosicaoIcon(colab.pos)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{colab.nome}</span>
                {colab.destaque && (
                  <span className="px-2 py-0.5 text-xs bg-purple-500 text-white rounded-full">
                    Líder
                  </span>
                )}
              </div>
              <span className="text-white/50 text-sm">{colab.setor}</span>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-white">{colab.pontos.toLocaleString()}</div>
              <div className={`flex items-center gap-1 text-sm ${
                colab.variacao.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {colab.variacao.startsWith('+') ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {colab.variacao}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 text-center"
      >
        <p className="text-purple-400 text-sm">
          🏆 Prêmio do mês: Viagem para equipe vencedora!
        </p>
      </motion.div>
    </div>
  );
}
