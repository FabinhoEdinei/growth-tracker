// components/tv/TvFooter.tsx
'use client';

import { motion } from 'framer-motion';
import { Play, Tv, ArrowRight, CheckCircle } from 'lucide-react';
import AppShowcase from './AppShowcase';

export default function TvFooter() {
  const beneficios = [
    'Setup em 48 horas',
    'Integração com seus sistemas',
    'Suporte técnico 24/7',
    'Relatórios de engajamento',
  ];

  return (
    <footer className="relative bg-[#0A0F1C] border-t border-white/10 py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Pronto para transformar sua{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                comunicação interna
              </span>?
            </h2>
            
            <p className="text-white/60 text-lg mb-8">
              Junte-se a mais de 500 empresas que já revolucionaram a forma de se comunicar com suas equipes.
            </p>

            <ul className="space-y-3 mb-8">
              {beneficios.map((beneficio, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {beneficio}
                </motion.li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-full font-semibold text-lg flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
            >
              Começar agora <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mb-6 relative z-10"
              >
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Assista a demo</h3>
              <p className="text-white/60 relative z-10">Veja como funciona em 2 minutos</p>
            </div>
          </motion.div>
        </div>

        {/* app showcase phones */}
        <AppShowcase />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <Tv className="w-6 h-6 text-purple-400" />
            <span className="text-white font-bold">TV Empresarial</span>
          </div>
          
          <p className="text-white/40 text-sm">
            © 2024 TV Empresarial. Todos os direitos reservados.
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Termos</a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacidade</a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Contato</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
