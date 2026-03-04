'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, Zap, Award, Activity, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MetaCard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dados simulados
  const metas = [
    { 
      label: 'Meta Diária', 
      value: '85%', 
      subvalue: 'atingida',
      icon: Target, 
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500/10 to-emerald-600/5',
      borderColor: 'border-emerald-200',
      progress: 85,
      trend: '+12%',
      trendColor: 'text-emerald-600'
    },
    { 
      label: 'Produção', 
      value: '1.240', 
      subvalue: 'unidades',
      icon: Zap, 
      color: 'text-amber-600',
      bgGradient: 'from-amber-500/10 to-amber-600/5',
      borderColor: 'border-amber-200',
      progress: 72,
      trend: '+8%',
      trendColor: 'text-amber-600'
    },
    { 
      label: 'Equipe Ativa', 
      value: '42', 
      subvalue: 'colaboradores',
      icon: Users, 
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      borderColor: 'border-blue-200',
      progress: 100,
      trend: '+3',      trendColor: 'text-blue-600'
    },
    { 
      label: 'Crescimento', 
      value: '+23%', 
      subvalue: 'vs mês anterior',
      icon: TrendingUp, 
      color: 'text-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/5',
      borderColor: 'border-purple-200',
      progress: 23,
      trend: '↑',
      trendColor: 'text-purple-600'
    },
  ];

  // Configurações de animação para o efeito de "construção"
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay entre cada item aparecer
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-8 font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/80 overflow-hidden relative"
      >
        {/* Efeito de brilho superior (Porcelana Shine) */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

        {/* Header */}        <div className="p-6 md:p-10 border-b border-slate-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <motion.div variants={itemVariants} className="flex items-center gap-5">
            <div className="p-4 bg-white rounded-2xl shadow-lg shadow-emerald-500/10 border border-emerald-100">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                Metas do Dia
              </h3>
              <div className="flex items-center gap-2 mt-1 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span className="font-medium text-lg capitalize">
                  {currentTime.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: '2-digit', 
                    month: 'long'
                  })}
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 self-start md:self-auto">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-slate-700 font-bold tracking-wide uppercase text-sm">Tempo Real</span>
          </motion.div>
        </div>

        {/* Grid de Metas - Responsivo (1 col mobile, 2 col desktop) */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {metas.map((meta) => (
            <motion.div
              key={meta.label}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-3xl p-6 border bg-gradient-to-br ${meta.bgGradient} ${meta.borderColor} shadow-sm hover:shadow-md transition-all duration-300 group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                  <meta.icon className={`w-6 h-6 ${meta.color}`} />
                </div>
                <div className={`px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-slate-100 shadow-sm`}>
                  <span className={`text-sm font-bold ${meta.trendColor}`}>{meta.trend}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-1">{meta.label}</p>                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-slate-800 tracking-tighter">
                    {meta.value}
                  </span>
                  <span className="text-slate-400 font-medium text-lg">{meta.subvalue}</span>
                </div>
              </div>

              {/* Barra de Progresso Estilo "Clean" */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Progresso</span>
                  <span>{meta.progress}%</span>
                </div>
                <div className="h-3 bg-slate-100/80 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div 
                    className={`h-full rounded-full bg-gradient-to-r ${meta.color.replace('text', 'from').replace('600', '500')} to-${meta.color.replace('text', '').replace('-600', '')}-400 relative`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(meta.progress, 100)}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-white/30" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner Semanal */}
        <motion.div 
          variants={itemVariants}
          className="p-6 md:p-10 pt-0 relative z-10"
        >
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Círculo decorativo de fundo */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/20 text-white">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-slate-800 text-xl font-bold">
                  Meta Semanal 92% Completa!
                </p>
                <p className="text-slate-500 font-medium mt-1">
                  Desempenho excepcional. Mantenha o ritmo! 🚀
                </p>
              </div>            </div>
            
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-xl border border-emerald-100 relative z-10">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">On Track</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Stats - Oculto em mobile muito pequeno se necessário, mas aqui mantido adaptável */}
        <motion.div 
          variants={itemVariants}
          className="px-6 md:px-10 pb-10 pt-2 grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10"
        >
          {[
            { label: 'Produtividade', value: '94%', color: 'text-slate-800' },
            { label: 'Eficiência', value: 'Alta', color: 'text-emerald-600' },
            { label: 'Tempo Restante', value: '4h 23m', color: 'text-amber-600' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center md:text-left p-4 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}