// src/app/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-cyan-300 flex flex-col items-center justify-center p-4">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-orbitron text-cyan-300 mb-2 tracking-wide">
          growth-tracker
        </h1>
        <p className="text-cyan-200 max-w-md">
          Sua jornada épica de força começa aqui — inspirado por<span className="text-purple-400">FabioEdinei</span>.
        </p>
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button
          onClick={() => signIn('google')}
          className="btn-arise px-6 py-3 flex items-center justify-center gap-2 min-w-[180px]"
        >
          <span>Entrar com Google</span>
        </button>
        <Link href="/home" className="btn-arise px-6 py-3 border border-gray-700 text-center min-w-[180px]">
          Ver Academia
        </Link>
      </div>

      {/* Rodapé motivacional */}
      <div className="text-center text-cyan-200 text-sm max-w-md">
        <p>“A força não vem do que você pode fazer. Vem do que você já superou.”</p>
        <p className="mt-2 font-orbitron text-cyan-300">— Tale of Arise</p>
      </div>
    </div>
  );
}