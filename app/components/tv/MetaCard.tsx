'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Users, Zap, Award, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MetaCard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const metas = [
    { 
      label: 'Meta Diária', 
      value: '85%', 
      subvalue: 'atingida',
      icon: Target, 
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      progress: 85,
      trend: '+12%'
    },
    { 
      label: 'Produção', 
      value: '1.240', 
      subvalue: 'unidades',
      icon: Zap, 
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      progress: 72,
      trend: '+8%'
    },
    { 
      label: 'Equipe Ativa', 
      value: '42', 
      subvalue: 'colaboradores',
      icon: Users, 
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      progress: 100,
      trend: '+3'
    },
    { 
      label: 'Crescimento',       value: '+23%', 
      subvalue: 'vs mês anterior',
      icon: TrendingUp, 
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      progress: 23,
      trend: '↑'
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white tracking-tight">
              Metas do Dia
            </h3>
            <p className="text-white/50 text-lg">
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-white/80 text-lg font-medium">Tempo Real</span>
        </div>
      </motion.div>

      {/* Grid de Metas */}
      <div className="grid grid-cols-2 gap-6 flex-1 relative z-10">        {metas.map((meta, i) => (
          <motion.div
            key={meta.label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`${meta.bgColor} rounded-2xl p-6 border ${meta.borderColor} backdrop-blur-sm group transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.color} shadow-lg`}>
                <meta.icon className="w-6 h-6 text-white" />
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="px-3 py-1 bg-white/10 rounded-full"
              >
                <span className="text-white/90 text-sm font-semibold">{meta.trend}</span>
              </motion.div>
            </div>
            
            <div className="mb-2">
              <p className="text-white/60 text-lg mb-1">{meta.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white tracking-tight">
                  {meta.value}
                </span>
                <span className="text-white/50 text-xl">{meta.subvalue}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full bg-gradient-to-r ${meta.color} relative`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(meta.progress, 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <span className="text-white/40 text-sm">Progresso</span>
              <span className="text-white font-semibold">{meta.progress}%</span>
            </div>
          </motion.div>        ))}
      </div>

      {/* Weekly Goal Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="mt-6 relative z-10"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-emerald-500/20 border border-emerald-500/30 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-emerald-400 text-2xl font-bold">
                  Meta Semanal 92% Completa!
                </p>
                <p className="text-white/60 text-lg">
                  Excelente desempenho! Mantenha o ritmo 🚀
                </p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 px-6 py-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 font-semibold text-lg">On Track</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-6 grid grid-cols-3 gap-4 relative z-10"
      >
        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/40 text-sm mb-1">Produtividade</p>
          <p className="text-2xl font-bold text-white">94%</p>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/40 text-sm mb-1">Eficiência</p>
          <p className="text-2xl font-bold text-emerald-400">Alta</p>        </div>
        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/40 text-sm mb-1">Tempo Restante</p>
          <p className="text-2xl font-bold text-amber-400">4h 23m</p>
        </div>
      </motion.div>
    </div>
  );
}