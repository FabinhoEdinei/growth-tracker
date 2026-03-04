'use client';

import { useRouter } from 'next/navigation';

export default function JornalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="text-6xl mb-8">📰</div>
        <h1 className="text-4xl font-mono mb-4">Jornal</h1>
        <p className="text-xl mb-8">Notícias e atualizações do sistema</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-mono rounded-lg transition-colors"
        >
          ← Voltar à Tela Principal
        </button>
      </div>
    </div>
  );
}