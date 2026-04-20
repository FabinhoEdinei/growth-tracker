'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/components/manga/RPGDialogBox.tsx
// Caixa RPG estilo Nintendo — avatar real, botão partícula orbital
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface RPGDialogo {
  personagem: string;
  fala:       string;
  avatar?:    string;
  cor?:       string;
  autoMs?:    number;
  pagina?:    number;
  posicao?:   'base' | 'topo';
  link?:      string;
  linkLabel?: string;
}

export interface RPGScript {
  dialogos: RPGDialogo[];
}

interface Props {
  script:        RPGScript | null;
  paginaAtual:   number;
  dark:          boolean;
  capId?:        string;   // ← NOVO: id do capítulo para salvar progresso
  onPageChange?: (idx: number) => void;
}

// ── Paleta por personagem ─────────────────────────────────────────────────────
const PALETA: Record<string, string> = {
  narrador:   '#a0a0b0',
  fabinho:    '#00d4ff',
  fabio:      '#00d4ff',
  vilao:      '#ff4d6d',
  aliado:     '#00ff88',
  sistema:    '#ffd700',
  misterioso: '#c084fc',
};

function corDo(nome: string, cor?: string): string {
  if (cor) return cor;
  const k = nome.toLowerCase().replace(/\s+/g, '');
  return PALETA[k] ?? '#e0e0ff';
}

// ── Iniciais como fallback de avatar ──────────────────────────────────────────
function AvatarFallback({ nome, cor, size }: { nome: string; cor: string; size: number }) {
  const iniciais = nome.slice(0, 2).toUpperCase();
  return (
    <div style={{
      width:          size, height: size,
      borderRadius:   10,
      background:     `linear-gradient(135deg, ${cor}33, ${cor}11)`,
      border:         `2px solid ${cor}66`,
      display:        'flex', alignItems: 'center', justifyContent: 'center',
      fontSize:       size * 0.35,
      fontWeight:     900,
      color:          cor,
      fontFamily:     "'Courier New', monospace",
      textShadow:     `0 0 10px ${cor}`,
      letterSpacing:  1,
      flexShrink:     0,
    }}>
      {iniciais}
    </div>
  );
}

// ── Avatar com fallback automático ────────────────────────────────────────────
function Avatar({ src, nome, cor, size = 62 }: { src?: string; nome: string; cor: string; size?: number }) {
  const [erro,     setErro]     = useState(false);
  const [carregou, setCarregou] = useState(false);

  useEffect(() => { setErro(false); setCarregou(false); }, [src]);

  if (!src || erro) return <AvatarFallback nome={nome} cor={cor} size={size} />;

  return (
    <div style={{
      width:         size, height: size,
      borderRadius:  12,
      overflow:      'hidden',
      border:        `2px solid ${cor}88`,
      boxShadow:     `0 0 16px ${cor}55, 0 0 4px ${cor}33`,
      flexShrink:    0,
      position:      'relative',
      background:    `linear-gradient(135deg, ${cor}18, rgba(0,0,0,0.5))`,
    }}>
      {!carregou && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <AvatarFallback nome={nome} cor={cor} size={size - 4} />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={nome}
        onLoad={()  => setCarregou(true)}
        onError={() => { setErro(true); }}
        style={{
          position:       'absolute', inset: 0,
          width:          '100%', height: '100%',
          objectFit:      'cover',
          objectPosition: 'top center',
          display:        carregou ? 'block' : 'none',
        }}
      />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1, background:`linear-gradient(135deg, ${cor}28 0%, transparent 55%)`, borderRadius:'inherit' }}/>
    </div>
  );
}

// ── Botão partícula orbital ───────────────────────────────────────────────────
function ParticleButton({ cor, label, onClick }: { cor: string; label: string; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>();
  const phaseRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width  = 44;
    const H = canvas.height = 44;
    const cx = W / 2, cy = H / 2;

    const draw = () => {
      phaseRef.current += 0.05;
      const p = phaseRef.current;
      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
      grad.addColorStop(0,   cor + 'ff');
      grad.addColorStop(0.4, cor + '88');
      grad.addColorStop(1,   cor + '00');
      ctx.beginPath();
      ctx.arc(cx, cy, 14 + Math.sin(p * 1.5) * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 4 + Math.sin(p * 2) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.strokeStyle = cor + '44';
      ctx.lineWidth   = 1;
      ctx.stroke();

      const ox = cx + Math.cos(p) * 16;
      const oy = cy + Math.sin(p) * 16;
      ctx.beginPath();
      ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = cor;
      ctx.fill();

      const ox2 = cx + Math.cos(p * 0.7 + Math.PI) * 16;
      const oy2 = cy + Math.sin(p * 0.7 + Math.PI) * 16;
      ctx.beginPath();
      ctx.arc(ox2, oy2, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = cor + 'aa';
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [cor]);

  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      title={label}
      style={{
        background:    'none',
        border:        'none',
        padding:       0,
        cursor:        'pointer',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           2,
        flexShrink:    0,
      }}
    >
      <canvas ref={canvasRef} style={{ width: 44, height: 44, display: 'block' }} />
      <span style={{
        fontFamily:    "'Courier New', monospace",
        fontSize:      7,
        color:         cor + 'aa',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
      }}>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chave usada no localStorage
// ─────────────────────────────────────────────────────────────────────────────
export const MANGA_RETURN_KEY = 'manga_return_progress';

export interface MangaReturnData {
  capId:       string;
  paginaIdx:   number;
  dialogoIdx:  number;
  savedAt:     number; // timestamp
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export default function RPGDialogBox({ script, paginaAtual, dark, capId, onPageChange }: Props) {
  const dialogosDaPagina = script?.dialogos.filter(d => (d.pagina ?? 0) === paginaAtual) ?? [];

  const [idx,      setIdx]      = useState(0);
  const [texto,    setTexto]    = useState('');
  const [completo, setCompleto] = useState(false);
  const [visivel,  setVisivel]  = useState(false);

  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const letterRef = useRef(0);

  const dialogo = dialogosDaPagina[idx] ?? null;

  // Reset ao mudar de página
  useEffect(() => {
    setIdx(0); setTexto(''); setCompleto(false);
    setVisivel(dialogosDaPagina.length > 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual, script]);

  // Typewriter
  useEffect(() => {
    if (!dialogo || !visivel) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (autoRef.current)  clearTimeout(autoRef.current);
    setTexto(''); setCompleto(false); letterRef.current = 0;

    const vel = dialogo.fala.length > 100 ? 16 : 22;

    const digitar = () => {
      letterRef.current++;
      setTexto(dialogo.fala.slice(0, letterRef.current));
      if (letterRef.current >= dialogo.fala.length) {
        setCompleto(true);
        if (dialogo.autoMs) autoRef.current = setTimeout(avancar, dialogo.autoMs);
      } else {
        timerRef.current = setTimeout(digitar, vel);
      }
    };
    timerRef.current = setTimeout(digitar, vel);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoRef.current)  clearTimeout(autoRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, visivel]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const avancar = useCallback(() => {
    if (!dialogo) return;
    if (!completo) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoRef.current)  clearTimeout(autoRef.current);
      setTexto(dialogo.fala);
      setCompleto(true);
      if (dialogo.autoMs) autoRef.current = setTimeout(avancar, dialogo.autoMs);
      return;
    }
    if (autoRef.current) clearTimeout(autoRef.current);
    const prox = idx + 1;
    if (prox < dialogosDaPagina.length) {
      setIdx(prox); setCompleto(false);
    } else {
      setVisivel(false);
      onPageChange?.(paginaAtual + 1);
    }
  }, [dialogo, completo, idx, dialogosDaPagina.length, paginaAtual, onPageChange]);

  // ── Salva progresso antes de navegar pro link ─────────────────────────────
  const salvarProgresso = useCallback(() => {
    if (!capId) return;
    const data: MangaReturnData = {
      capId,
      paginaIdx:  paginaAtual,
      dialogoIdx: idx,
      savedAt:    Date.now(),
    };
    try {
      localStorage.setItem(MANGA_RETURN_KEY, JSON.stringify(data));
    } catch {
      // localStorage indisponível (SSR ou privado) — silencia
    }
  }, [capId, paginaAtual, idx]);

  if (!visivel || !dialogo) return null;

  const cor     = corDo(dialogo.personagem, dialogo.cor);
  const isBase  = (dialogo.posicao ?? 'base') === 'base';
  const bgCaixa = dark
    ? 'linear-gradient(135deg,rgba(6,4,18,0.96),rgba(12,8,30,0.96))'
    : 'linear-gradient(135deg,rgba(238,237,250,0.97),rgba(218,216,242,0.97))';
  const txCor   = dark ? 'rgba(240,238,255,0.93)' : 'rgba(16,14,32,0.93)';
  const subCor  = dark ? 'rgba(255,255,255,0.28)'  : 'rgba(0,0,0,0.28)';
  const isUlt   = idx === dialogosDaPagina.length - 1;

  return (
    <div
      style={{
        position:  'absolute',
        [isBase ? 'bottom' : 'top']: 0,
        left: 0, right: 0, zIndex: 30,
        padding:   '0 10px 10px',
        animation: 'rpgUp .28s cubic-bezier(.34,1.56,.64,1)',
      }}
      onClick={avancar}
    >
      {/* ── Badge nome ── */}
      <div style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           5,
        marginBottom:  -1,
        marginLeft:    dialogo.avatar ? 76 : 14,
        padding:       '4px 14px 6px',
        background:    `${cor}18`,
        borderTop:     `1.5px solid ${cor}55`,
        borderLeft:    `1.5px solid ${cor}55`,
        borderRight:   `1.5px solid ${cor}55`,
        borderRadius:  '10px 10px 0 0',
        position:      'relative', zIndex: 1,
      }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:cor, boxShadow:`0 0 6px ${cor}`, animation:'rpgPulse 2s ease-in-out infinite', flexShrink:0 }}/>
        <span style={{ fontFamily:"'Courier New',monospace", fontSize:11, fontWeight:900, color:cor, letterSpacing:2, textShadow:`0 0 10px ${cor}88` }}>
          {dialogo.personagem.toUpperCase()}
        </span>
        {dialogosDaPagina.length > 1 && (
          <span style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:subCor, marginLeft:4 }}>
            {idx+1}/{dialogosDaPagina.length}
          </span>
        )}

        {/* ── Botão de link — salva progresso antes de navegar ── */}
        {dialogo.link && (
          <Link
            href={dialogo.link}
            onClick={e => { e.stopPropagation(); salvarProgresso(); }}
            style={{
              marginLeft:    6,
              padding:       '2px 8px',
              background:    `${cor}25`,
              border:        `1px solid ${cor}70`,
              borderRadius:  6,
              fontFamily:    "'Courier New',monospace",
              fontSize:      8,
              fontWeight:    900,
              color:         cor,
              textDecoration:'none',
              letterSpacing: 1,
              whiteSpace:    'nowrap' as const,
              display:       'inline-flex',
              alignItems:    'center',
              gap:           3,
              textShadow:    `0 0 6px ${cor}66`,
              boxShadow:     `0 0 8px ${cor}22`,
              animation:     'rpgPulse 2s ease-in-out infinite',
            }}
          >
            📎 {dialogo.linkLabel ?? 'VER →'}
          </Link>
        )}
      </div>

      {/* ── Caixa ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        gap:            12,
        background:     bgCaixa,
        border:         `1.5px solid ${cor}50`,
        borderRadius:   dialogo.avatar ? '0 14px 14px 14px' : 14,
        padding:        '12px 14px',
        boxShadow:      `0 0 28px ${cor}18, 0 8px 40px rgba(0,0,0,0.65)`,
        backdropFilter: 'blur(18px)',
        minHeight:      72,
        position:       'relative',
        overflow:       'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 4px)', borderRadius:'inherit' }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${cor}50,transparent)`, pointerEvents:'none' }}/>

        <Avatar src={dialogo.avatar} nome={dialogo.personagem} cor={cor} size={58} />

        <div style={{ flex:1, minWidth:0 }}>
          <p style={{
            margin:        0,
            fontSize:      13,
            lineHeight:    1.7,
            color:         txCor,
            fontFamily:    "'Courier New',monospace",
            letterSpacing: 0.4,
            whiteSpace:    'pre-wrap',
            wordBreak:     'break-word',
          }}>
            {texto}
            {!completo && (
              <span style={{ animation:'rpgBlink .55s step-end infinite', color:cor }}>▋</span>
            )}
          </p>
        </div>

        {completo && (
          <ParticleButton
            cor={cor}
            label={isUlt ? 'PRÓX.' : 'OK'}
            onClick={avancar}
          />
        )}
      </div>

      {completo && dialogo.autoMs && (
        <div style={{ height:2, background:'rgba(255,255,255,.06)', borderRadius:1, overflow:'hidden', marginTop:3 }}>
          <div style={{ height:'100%', background:`${cor}77`, animation:`rpgAuto ${dialogo.autoMs}ms linear forwards` }}/>
        </div>
      )}

      <style>{`
        @keyframes rpgUp     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rpgBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes rpgPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes rpgAuto   { from{width:0%} to{width:100%} }
      `}</style>
    </div>
  );
}
