'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/manga/RPGDialogBox.tsx
// Caixa de diálogo estilo RPG Nintendo — typewriter, avatar, auto-avanço
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface RPGDialogo {
  personagem:  string;           // Nome exibido
  fala:        string;           // Texto da fala
  avatar?:     string;           // Caminho da imagem do avatar
  cor?:        string;           // Cor do nome do personagem
  autoMs?:     number;           // Se definido, avança automaticamente em Xms após typewriter
  pagina?:     number;           // Índice da página onde aparece (0-based)
  posicao?:    'base' | 'topo'; // Posição na tela (padrão: base)
}

export interface RPGScript {
  dialogos: RPGDialogo[];
}

interface RPGDialogBoxProps {
  script:       RPGScript | null;
  paginaAtual:  number;
  dark:         boolean;
  onPageChange?: (idx: number) => void; // callback para mudar de página
}

// ── Cores padrão por personagem ───────────────────────────────────────────────
const PALETA: Record<string, string> = {
  narrador:  '#a0a0b0',
  fabinho:   '#00d4ff',
  fabio:     '#00d4ff',
  vilao:     '#ff4d6d',
  aliado:    '#00ff88',
  sistema:   '#ffd700',
  misterioso:'#c084fc',
};

function corPersonagem(nome: string, cor?: string): string {
  if (cor) return cor;
  const key = nome.toLowerCase().replace(/\s+/g, '');
  return PALETA[key] ?? '#ffffff';
}

// ═════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═════════════════════════════════════════════════════════════════════════════
export default function RPGDialogBox({
  script, paginaAtual, dark, onPageChange,
}: RPGDialogBoxProps) {
  // Filtra diálogos da página atual
  const dialogosDaPagina = script?.dialogos.filter(
    d => (d.pagina ?? 0) === paginaAtual
  ) ?? [];

  const [idx,        setIdx]        = useState(0);
  const [texto,      setTexto]      = useState('');
  const [completo,   setCompleto]   = useState(false);
  const [visivel,    setVisivel]    = useState(false);
  const [skipAnim,   setSkipAnim]   = useState(false);

  const timerRef   = useRef<ReturnType<typeof setTimeout>|null>(null);
  const autoRef    = useRef<ReturnType<typeof setTimeout>|null>(null);
  const indexRef   = useRef(0); // índice da letra atual no typewriter

  const dialogo = dialogosDaPagina[idx] ?? null;

  // Reset ao mudar de página
  useEffect(() => {
    setIdx(0);
    setTexto('');
    setCompleto(false);
    setSkipAnim(false);
    setVisivel(dialogosDaPagina.length > 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual]);

  // Typewriter
  useEffect(() => {
    if (!dialogo || !visivel) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (autoRef.current)  clearTimeout(autoRef.current);

    setTexto('');
    setCompleto(false);
    indexRef.current = 0;

    if (skipAnim) {
      setTexto(dialogo.fala);
      setCompleto(true);
      setSkipAnim(false);
      agendarAuto(dialogo);
      return;
    }

    const velocidade = dialogo.fala.length > 80 ? 18 : 24; // ms por letra

    const digitar = () => {
      indexRef.current++;
      const parcial = dialogo.fala.slice(0, indexRef.current);
      setTexto(parcial);

      if (indexRef.current >= dialogo.fala.length) {
        setCompleto(true);
        agendarAuto(dialogo);
      } else {
        timerRef.current = setTimeout(digitar, velocidade);
      }
    };

    timerRef.current = setTimeout(digitar, velocidade);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoRef.current)  clearTimeout(autoRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, visivel, dialogo?.fala]);

  function agendarAuto(d: RPGDialogo) {
    if (!d.autoMs) return;
    autoRef.current = setTimeout(() => avancar(), d.autoMs);
  }

  const avancar = useCallback(() => {
    if (!dialogo) return;

    // Se typewriter não terminou — mostrar tudo primeiro
    if (!completo) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setTexto(dialogo.fala);
      setCompleto(true);
      setSkipAnim(true);
      agendarAuto(dialogo);
      return;
    }

    if (autoRef.current) clearTimeout(autoRef.current);

    const proximo = idx + 1;
    if (proximo < dialogosDaPagina.length) {
      setIdx(proximo);
      setCompleto(false);
      setSkipAnim(false);
    } else {
      // Acabou os diálogos desta página
      setVisivel(false);
      // Avança para próxima página se callback fornecido
      if (onPageChange) {
        setTimeout(() => onPageChange(paginaAtual + 1), 400);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogo, completo, idx, dialogosDaPagina.length, paginaAtual, onPageChange]);

  if (!visivel || !dialogo) return null;

  const cor      = corPersonagem(dialogo.personagem, dialogo.cor);
  const posicao  = dialogo.posicao ?? 'base';
  const temAvatar = !!dialogo.avatar;

  // ── Estilo da caixa ──────────────────────────────────────────────────────
  const caixaBg    = dark
    ? 'linear-gradient(135deg, rgba(8,6,20,0.97), rgba(16,10,36,0.97))'
    : 'linear-gradient(135deg, rgba(240,239,248,0.97), rgba(220,218,240,0.97))';
  const bordaCor   = `${cor}60`;
  const textoCor   = dark ? 'rgba(255,255,255,0.92)' : 'rgba(20,20,30,0.92)';
  const subtextCor = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';

  return (
    <div
      style={{
        position:    'absolute',
        [posicao === 'base' ? 'bottom' : 'top']: 0,
        left: 0, right: 0,
        zIndex: 30,
        padding: '0 12px 12px',
        animation: 'rpgSlideUp .25s cubic-bezier(.34,1.56,.64,1)',
        pointerEvents: 'auto',
      }}
      onClick={avancar}
    >
      {/* Nome do personagem — badge acima da caixa */}
      <div style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           6,
        marginBottom:  -1,
        marginLeft:    temAvatar ? 70 : 12,
        padding:       '4px 14px 6px',
        background:    dark ? `${cor}22` : `${cor}18`,
        border:        `1px solid ${cor}55`,
        borderBottom:  'none',
        borderRadius:  '10px 10px 0 0',
        position:      'relative',
        zIndex:        1,
      }}>
        <span style={{
          fontFamily:    "'Courier New', monospace",
          fontSize:      11,
          fontWeight:    900,
          color:         cor,
          letterSpacing: 1.5,
          textShadow:    `0 0 10px ${cor}88`,
        }}>
          {dialogo.personagem.toUpperCase()}
        </span>
      </div>

      {/* Caixa principal */}
      <div style={{
        display:      'flex',
        alignItems:   'flex-start',
        gap:          12,
        background:   caixaBg,
        border:       `1.5px solid ${bordaCor}`,
        borderRadius: temAvatar ? '0 14px 14px 14px' : 14,
        padding:      '14px 16px',
        boxShadow:    `0 0 30px ${cor}18, 0 8px 32px rgba(0,0,0,0.6)`,
        backdropFilter: 'blur(16px)',
        minHeight:    80,
        position:     'relative',
        overflow:     'hidden',
      }}>

        {/* Scanline sutil */}
        <div style={{
          position:     'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)',
          borderRadius: 'inherit',
        }}/>

        {/* Brilho de canto */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${cor}40, transparent)`,
          pointerEvents: 'none',
        }}/>

        {/* Avatar */}
        {temAvatar && (
          <div style={{
            width:        56, height: 56,
            borderRadius: 10,
            border:       `2px solid ${cor}66`,
            overflow:     'hidden',
            flexShrink:   0,
            background:   dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)',
            boxShadow:    `0 0 12px ${cor}44`,
            position:     'relative',
          }}>
            <Image src={dialogo.avatar!} alt={dialogo.personagem} fill style={{ objectFit:'cover' }} />
          </div>
        )}

        {/* Texto */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin:      0,
            fontSize:    14,
            lineHeight:  1.65,
            color:       textoCor,
            fontFamily:  "'Courier New', monospace",
            letterSpacing: 0.3,
            whiteSpace:  'pre-wrap',
            wordBreak:   'break-word',
          }}>
            {texto}
            {/* Cursor piscante enquanto digita */}
            {!completo && (
              <span style={{ animation:'rpgCursor .6s step-end infinite', color:cor, marginLeft:1 }}>▋</span>
            )}
          </p>
        </div>

        {/* Indicador "toque para continuar" */}
        {completo && dialogosDaPagina.length > 0 && (
          <div style={{
            position:  'absolute', bottom: 8, right: 12,
            display:   'flex', alignItems: 'center', gap: 4,
            animation: 'rpgBounce .8s ease-in-out infinite',
          }}>
            <span style={{ fontSize:10, color: subtextCor, fontFamily:"'Courier New',monospace", letterSpacing:1 }}>
              {idx < dialogosDaPagina.length - 1 ? 'CONTINUAR' : 'PRÓX. PÁGINA'}
            </span>
            <span style={{ color:cor, fontSize:12 }}>▼</span>
          </div>
        )}

        {/* Índice de diálogos */}
        {dialogosDaPagina.length > 1 && (
          <div style={{
            position:   'absolute', top: 8, right: 10,
            fontFamily: "'Courier New',monospace",
            fontSize:   9, color: subtextCor, letterSpacing:1,
          }}>
            {idx + 1}/{dialogosDaPagina.length}
          </div>
        )}
      </div>

      {/* Auto-progresso bar */}
      {completo && dialogo.autoMs && (
        <div style={{ height:2, background:'rgba(255,255,255,.08)', marginTop:3, borderRadius:1, overflow:'hidden' }}>
          <div style={{
            height:'100%', background:`${cor}88`,
            animation:`rpgAutoBar ${dialogo.autoMs}ms linear forwards`,
          }}/>
        </div>
      )}

      <style>{`
        @keyframes rpgSlideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rpgCursor    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes rpgBounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(3px)} }
        @keyframes rpgAutoBar   { from{width:0%} to{width:100%} }
      `}</style>
    </div>
  );
}
