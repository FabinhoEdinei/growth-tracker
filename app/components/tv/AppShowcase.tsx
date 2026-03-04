'use client';

import { motion } from 'framer-motion';

export default function AppShowcase() {
  const phoneClass =
    'relative w-40 h-80 bg-[#0A0F1C] rounded-lg shadow-2xl shadow-inner overflow-hidden flex flex-col text-white border border-white/20 ring-1 ring-white/10';

  const statusBar = (
    <div className="flex justify-between items-center text-xs px-3 py-1 bg-black/30">
      <span>10:47</span>
      <span>Grace Of T</span>
      <span>47%</span>
    </div>
  );

  return (
    <section className="mt-24">
      <h2 className="text-3xl font-bold text-white text-center mb-4 relative">
        Veja o app em ação
        <span className="block w-24 h-0.5 bg-white/20 mx-auto mt-2"></span>
      </h2>

      <div className="flex justify-center items-center gap-8 flex-wrap">
        {/* phone 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`${phoneClass} rotate-3`}
        >
          {statusBar}
          <div className="flex-1 p-3 flex flex-col justify-start bg-white/5 backdrop-blur-lg rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Metas do Dia</h3>
            <p className="text-lg font-bold">85% completo</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>Produção: 1.240</li>
              <li>Equipe Ativa: 42</li>
              <li>Crescimento: +23%</li>
            </ul>
          </div>
        </motion.div>

        {/* phone 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`${phoneClass}`}
        >
          {statusBar}
          <div className="flex-1 p-3 flex flex-col justify-start bg-white/5 backdrop-blur-lg rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Status da Produção</h3>
            <p className="text-xs mb-1">Linhas A/B/D operando</p>
            <p className="text-xs">C em manutenção</p>
          </div>
        </motion.div>

        {/* phone 3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`${phoneClass} -rotate-3`}
        >
          {statusBar}
          <div className="flex-1 p-3 flex flex-col justify-start bg-white/5 backdrop-blur-lg rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Ranking da Semana</h3>
            <p className="text-xs mb-1">+ Comunicados + Clima</p>
            <p className="text-xs">Organizacional combinado</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
