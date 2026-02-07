// src/app/home/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const {  session, status } = useSession();
  const router = useRouter();

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-cyan-300">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-300 p-4 pb-20">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-orbitron text-cyan-300 mb-2">
          growth-tracker
        </h1>
        <p className="text-cyan-200">Sua jornada épica de força</p>
      </div>

      {/* Avatar / Saudação */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-2xl">
          🧙‍♂️
        </div>
        <h2 className="text-xl font-orbitron mt-3">
          Olá, {session.user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-cyan-200 text-sm mt-1">Nível 7 • 1.240 XP</p>
      </div>

      {/* Cards de Ação */}
      <div className="space-y-4">
        <Link href="/profile" className="block">
          <div className="arise-card p-4 flex items-center gap-4 hover:bg-purple-900/40 transition-colors">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="font-orbitron">Meu Perfil</h3>
              <p className="text-sm text-cyan-200">RM, medidas e configurações</p>
            </div>
          </div>
        </Link>

        <Link href="/trainings/a" className="block">
          <div className="arise-card p-4 flex items-center gap-4 hover:bg-purple-900/40 transition-colors">
            <span className="text-2xl">🏋️‍♂️</span>
            <div>
              <h3 className="font-orbitron">Treino A</h3>
              <p className="text-sm text-cyan-200">Powerlifting - Modo Manual</p>
            </div>
          </div>
        </Link>

        <Link href="/trainings/live" className="block">
          <div className="arise-card p-4 flex items-center gap-4 hover:bg-purple-900/40 transition-colors">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-orbitron">Modo Live</h3>
              <p className="text-sm text-cyan-200">Treine com seu treinador IA</p>
            </div>
          </div>
        </Link>

        <Link href="/status" className="block">
          <div className="arise-card p-4 flex items-center gap-4 hover:bg-purple-900/40 transition-colors">
            <span className="text-2xl">📈</span>
            <div>
              <h3 className="font-orbitron">Meu Progresso</h3>
              <p className="text-sm text-cyan-200">Gráficos de força e volume</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Rodapé motivacional */}
      <div className="mt-12 text-center text-cyan-200 text-sm">
        <p>“A força não vem do que você pode fazer. Vem do que você já superou.”</p>
        <p className="mt-2 font-orbitron text-cyan-300">— Tale of Arise</p>
      </div>
    </div>
  );
}