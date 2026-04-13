'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/components/manga/MangaReturnButton.tsx
//
// Botão flutuante "← Voltar ao Manga" que aparece em qualquer página
// quando o leitor saiu do manga via link de diálogo RPG.
//
// USO — importe na página do blog (ou no layout):
//   import MangaReturnButton from '@/app/components/manga/MangaReturnButton';
//   // No JSX:
//   <MangaReturnButton />
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MANGA_RETURN_KEY, type MangaReturnData } from './RPGDialogBox';

// Progresso expira após 2 horas
const EXPIRY_MS = 2 * 60 * 60 * 1000;

export default function MangaReturnButton() {
  const router = useRouter();
  const [dados,    setDados]    = useState<MangaReturnData | null>(null);
  const [visivel,  setVisivel]  = useState(false);
  const [saindo,   setSaindo]   = useState(false);

  // Lê o localStorage apenas no cliente
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MANGA_RETURN_KEY);
      if (!raw) return;
      const d: MangaReturnData = JSON.parse(raw);
      // Verifica expiração
      if (Date.now() - d.savedAt > EXPIRY_MS) {
        localStorage.removeItem(MANGA_RETURN_KEY);
        return;
      }
      setDados(d);
      // Pequeno delay para animar a entrada
      setTimeout(() => setVisivel(true), 400);
    } catch {
      // Silencia erros de parse / localStorage bloqueado
    }
  }, []);

  if (!dados) return null;

  const handleVoltar = () => {
    setSaindo(true);
    // Navega para /manga — a página lê o localStorage e restaura a posição
    setTimeout(() => router.push('/manga'), 250);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaindo(true);
    setTimeout(() => {
      localStorage.removeItem(MANGA_RETURN_KEY);
      setDados(null);
    }, 250);
  };

  return (
    <div
      style={{
        position:   'fixed',
        bottom:     24,
        right:      20,
        zIndex:     9999,
        display:    'flex',
        alignItems: 'center',
        gap:        6,
        opacity:    visivel && !saindo ? 1 : 0,
        transform:  visivel && !saindo ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
        transition: 'opacity .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1)',
        pointerEvents: visivel && !saindo ? 'auto' : 'none',
      }}
    >
      {/* Botão principal */}
      <button
        onClick={handleVoltar}
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            8,
          padding:        '9px 16px',
          background:     'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.08))',
          border:         '1.5px solid rgba(0,212,255,0.55)',
          borderRadius:   20,
          backdropFilter: 'blur(16px)',
          cursor:         'pointer',
          boxShadow:      '0 0 20px rgba(0,212,255,0.2), 0 4px 20px rgba(0,0,0,0.5)',
          animation:      'mgkPulse 3s ease-in-out infinite',
        }}
      >
        {/* Ícone manga */}
        <span style={{ fontSize: 15 }}>📖</span>

        {/* Textos */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <span style={{
            fontFamily:    "'Courier New', monospace",
            fontSize:      9,
            fontWeight:    900,
            color:         'rgba(0,212,255,0.7)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            lineHeight:    1,
          }}>
            CONTINUAR LENDO
          </span>
          <span style={{
            fontFamily:    "'Courier New', monospace",
            fontSize:      11,
            fontWeight:    700,
            color:         '#00d4ff',
            letterSpacing: 0.5,
            lineHeight:    1,
            textShadow:    '0 0 10px rgba(0,212,255,0.6)',
          }}>
            ← Voltar ao Manga
          </span>
        </div>

        {/* Indicador de página */}
        <div style={{
          padding:       '2px 7px',
          background:    'rgba(0,212,255,0.15)',
          border:        '1px solid rgba(0,212,255,0.35)',
          borderRadius:  8,
          fontFamily:    "'Courier New', monospace",
          fontSize:      9,
          color:         'rgba(0,212,255,0.8)',
          letterSpacing: 1,
          whiteSpace:    'nowrap',
        }}>
          PG {dados.paginaIdx + 1}
        </div>
      </button>

      {/* Botão fechar */}
      <button
        onClick={handleDismiss}
        title="Dispensar"
        style={{
          width:          24,
          height:         24,
          borderRadius:   '50%',
          background:     'rgba(0,0,0,0.6)',
          border:         '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          color:          'rgba(255,255,255,0.5)',
          fontSize:       10,
          padding:        0,
          flexShrink:     0,
        }}
      >
        ✕
      </button>

      <style>{`
        @keyframes mgkPulse {
          0%,100% { box-shadow: 0 0 20px rgba(0,212,255,0.2), 0 4px 20px rgba(0,0,0,0.5); }
          50%     { box-shadow: 0 0 30px rgba(0,212,255,0.4), 0 4px 24px rgba(0,0,0,0.6); }
        }
      `}</style>
    </div>
  );
}
