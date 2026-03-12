'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Eye, EyeOff, Download, ShoppingCart,
  RefreshCw, Loader2, CheckCircle, Lock, Unlock,
  TrendingUp, FileText, Newspaper, Tv2, Star
} from 'lucide-react';
import type { CotaETF, BlocoETF } from '@/lib/etf-cota-engine';
import { gerarCertificadoHTML, venderCota } from '@/lib/etf-cota-engine';

// ─────────────────────────────────────────────────────────────────────────────
// Pentáculo SVG animado
// ─────────────────────────────────────────────────────────────────────────────

function PentaculoSVG({ size = 300, glow = false }: { size?: number; glow?: boolean }) {
  const cx = size / 2, cy = size / 2;
  const r1 = size * 0.45, r2 = size * 0.35, r3 = size * 0.18;

  // Pontas do pentáculo
  const pontos = Array.from({ length: 5 }, (_, i) => {
    const ang = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return [cx + r1 * Math.cos(ang), cy + r1 * Math.sin(ang)];
  });

  // Estrela de 5 pontas (ligando pontos alternados)
  const estrela = [0,2,4,1,3,0].map(i => pontos[i]);
  const estrelaPts = estrela.map(p => p.join(',')).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
      xmlns="http://www.w3.org/2000/svg">
      {glow && (
        <defs>
          <filter id="pGlow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="pGlowSoft">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      )}

      {/* Círculos concêntricos */}
      {[r1, r2, r3].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          stroke={i === 0 ? 'rgba(168,85,247,0.35)' : 'rgba(0,255,136,0.2)'}
          strokeWidth={i === 0 ? 1 : 0.75}
          filter={glow ? 'url(#pGlowSoft)' : undefined}/>
      ))}

      {/* Círculo externo tracejado */}
      <circle cx={cx} cy={cy} r={r1 * 1.08}
        stroke="rgba(168,85,247,0.15)" strokeWidth={0.5} strokeDasharray="4 6"/>

      {/* Estrela pentáculo */}
      <polyline points={estrelaPts}
        stroke="rgba(0,255,136,0.5)" strokeWidth={1}
        filter={glow ? 'url(#pGlow)' : undefined}/>

      {/* Pontos nas vértices */}
      {pontos.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3}
          fill={i === 0 ? '#00ff88' : i % 2 === 0 ? '#a855f7' : '#00d4ff'}
          filter={glow ? 'url(#pGlow)' : undefined}/>
      ))}

      {/* Linhas internas (conectando vértices adjacentes) */}
      {pontos.map(([x, y], i) => {
        const [nx, ny] = pontos[(i + 1) % 5];
        return <line key={i} x1={x} y1={y} x2={nx} y2={ny}
          stroke="rgba(168,85,247,0.2)" strokeWidth={0.5}/>;
      })}

      {/* Centro */}
      <circle cx={cx} cy={cy} r={5} fill="rgba(0,255,136,0.3)"
        stroke="rgba(0,255,136,0.6)" strokeWidth={0.75}
        filter={glow ? 'url(#pGlow)' : undefined}/>

      {/* Runas decorativas nos quadrantes */}
      {['✦','⬡','◈','⬟','✧'].map((rune, i) => {
        const ang = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const rx = cx + r2 * 0.62 * Math.cos(ang);
        const ry = cy + r2 * 0.62 * Math.sin(ang);
        return (
          <text key={i} x={rx} y={ry + 4} textAnchor="middle"
            fontSize={size * 0.04} fill="rgba(168,85,247,0.3)"
            fontFamily="monospace">{rune}</text>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card de bloco ETF
// ─────────────────────────────────────────────────────────────────────────────

const BLOCO_CONFIG = {
  blog:   { icon: FileText,  cor: '#00ff88', label: 'Blog',           peso: '40%' },
  jornal: { icon: Newspaper, cor: '#a855f7', label: 'Jornal',         peso: '35%' },
  tv:     { icon: Tv2,       cor: '#00d4ff', label: 'TV Empresarial', peso: '25%' },
};

function BlocoCard({ bloco, codigoVisivel }: { bloco: BlocoETF; codigoVisivel: boolean }) {
  const cfg = BLOCO_CONFIG[bloco.tipo];
  const Icon = cfg.icon;
  const cor = cfg.cor;

  return (
    <div style={{
      background: `rgba(${cor === '#00ff88' ? '0,255,136' : cor === '#a855f7' ? '168,85,247' : '0,212,255'}, 0.05)`,
      border: `1px solid ${cor}25`,
      borderRadius: 16, padding: '20px 18px',
      transition: 'all 0.3s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${cor}50`;
      e.currentTarget.style.boxShadow = `0 8px 32px ${cor}15`;
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = `${cor}25`;
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Header do bloco */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Icon size={18} style={{ color:cor, filter:`drop-shadow(0 0 4px ${cor})` }}/>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontFamily:'Courier New,monospace' }}>
            {cfg.label}
          </span>
        </div>
        <span style={{ fontSize:11, background:`${cor}20`, color:cor,
          padding:'2px 8px', borderRadius:20, fontFamily:'Courier New,monospace' }}>
          {cfg.peso}
        </span>
      </div>

      {/* Código oculto/visível */}
      <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:'12px 14px', marginBottom:12 }}>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:4 }}>
          CÓDIGO DO BLOCO
        </div>
        <div style={{ fontSize:16, fontFamily:'Courier New,monospace', letterSpacing:2,
          color: codigoVisivel ? cor : 'transparent',
          textShadow: codigoVisivel ? `0 0 12px ${cor}80` : 'none',
          background: codigoVisivel ? 'none' : `${cor}30`,
          borderRadius: codigoVisivel ? 0 : 4,
          padding: codigoVisivel ? 0 : '2px 4px',
          transition:'all 0.4s',
          userSelect: codigoVisivel ? 'text' : 'none',
        }}>
          {codigoVisivel ? bloco.codigo : '••••••'}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginBottom:2 }}>POSTS</div>
          <div style={{ fontSize:18, fontWeight:700, color, fontFamily:'Courier New,monospace' }}>
            {bloco.posts.length}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginBottom:2 }}>CONTRIBUIÇÃO</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontFamily:'Courier New,monospace' }}>
            R$ {bloco.contribuicao.toLocaleString('pt-BR', {minimumFractionDigits:2})}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal de compra / registro de dono
// ─────────────────────────────────────────────────────────────────────────────

function ModalCompra({ cota, onConfirmar, onFechar }: {
  cota: CotaETF;
  onConfirmar: (dono: string, empresa: string) => void;
  onFechar: () => void;
}) {
  const [nome,    setNome]    = useState('');
  const [empresa, setEmpresa] = useState('');

  const inputStyle: React.CSSProperties = {
    width:'100%', background:'rgba(0,0,0,0.4)',
    border:'1px solid rgba(0,255,136,0.2)', borderRadius:8,
    color:'#f0ede8', fontFamily:"'Courier New',monospace", fontSize:14,
    padding:'10px 14px', outline:'none', boxSizing:'border-box',
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{
        width:'100%', maxWidth:420,
        background:'linear-gradient(160deg, #1a0f2e, #0f0820)',
        border:'1px solid rgba(168,85,247,0.4)', borderRadius:20, padding:32,
        animation:'fadeInUp 0.3s ease-out',
      }}>
        {/* Cantos */}
        {[['top:12px','left:12px','borderWidth:2px 0 0 2px'],
          ['top:12px','right:12px','borderWidth:2px 2px 0 0'],
          ['bottom:12px','left:12px','borderWidth:0 0 2px 2px'],
          ['bottom:12px','right:12px','borderWidth:0 2px 2px 0']].map((c, i) => (
          <div key={i} style={{ position:'absolute', width:20, height:20,
            borderColor:'rgba(168,85,247,0.4)', borderStyle:'solid',
            ...Object.fromEntries(c.map(s => s.split(':'))) }}/>
        ))}

        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🔮</div>
          <h2 style={{ fontFamily:"'Courier New',monospace", fontSize:18,
            color:'#a855f7', marginBottom:4 }}>Registrar Titular</h2>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', lineHeight:1.5 }}>
            A cota será vinculada ao nome informado e um certificado será gerado para download.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
          <div>
            <label style={{ fontSize:10, color:'rgba(168,85,247,0.5)', letterSpacing:2,
              display:'block', marginBottom:6 }}>NOME DO TITULAR *</label>
            <input value={nome} onChange={e => setNome(e.target.value)}
              placeholder="Nome completo ou apelido"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.5)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(0,255,136,0.2)'; }}/>
          </div>
          <div>
            <label style={{ fontSize:10, color:'rgba(168,85,247,0.5)', letterSpacing:2,
              display:'block', marginBottom:6 }}>EMPRESA / ORGANIZAÇÃO (opcional)</label>
            <input value={empresa} onChange={e => setEmpresa(e.target.value)}
              placeholder="Nome da empresa ou projeto"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.5)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(0,255,136,0.2)'; }}/>
          </div>
        </div>

        {/* Preview do código transformado */}
        {nome && (
          <div style={{ marginBottom:20, padding:'12px 14px',
            background:'rgba(168,85,247,0.06)', border:'1px solid rgba(168,85,247,0.2)',
            borderRadius:8, fontSize:11, color:'rgba(168,85,247,0.7)',
            fontFamily:"'Courier New',monospace", textAlign:'center' }}>
            A cota será registrada em:<br/>
            <span style={{ color:'#a855f7', fontSize:14, fontWeight:700 }}>
              {nome.toUpperCase()}
            </span>
          </div>
        )}

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onFechar} style={{
            flex:1, padding:'12px', background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
            color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer',
            fontFamily:"'Courier New',monospace" }}>
            Cancelar
          </button>
          <button onClick={() => nome.trim() && onConfirmar(nome.trim(), empresa.trim())}
            disabled={!nome.trim()}
            style={{
              flex:2, padding:'12px',
              background: nome.trim() ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${nome.trim() ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius:10,
              color: nome.trim() ? '#a855f7' : 'rgba(255,255,255,0.3)',
              fontSize:13, cursor: nome.trim() ? 'pointer' : 'not-allowed',
              fontFamily:"'Courier New',monospace",
              display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Download size={14}/> Gerar Certificado
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────────────────────────────────────

export default function PentaculosPage() {
  const [cota,          setCota]          = useState<CotaETF | null>(null);
  const [resumo,        setResumo]        = useState<{postsBlog:number;postsJornal:number} | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [codigoVisivel, setCodigoVisivel] = useState(false);
  const [modalAberto,   setModalAberto]   = useState(false);
  const [cotaFinal,     setCotaFinal]     = useState<CotaETF | null>(null);
  const [baixando,      setBaixando]      = useState(false);
  const [sucesso,       setSucesso]       = useState(false);
  const [rotacao,       setRotacao]       = useState(0);
  const rafRef = useRef<number>(0);

  // Animação de rotação do pentáculo
  useEffect(() => {
    let angle = 0;
    const animar = () => {
      angle += 0.1;
      setRotacao(angle);
      rafRef.current = requestAnimationFrame(animar);
    };
    rafRef.current = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Busca cota da API
  useEffect(() => { fetchCota(); }, []);

  async function fetchCota() {
    setLoading(true);
    try {
      const res = await fetch('/api/etf-cota');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCota(data.cota);
      setResumo(data.resumo);
    } catch {
      // fallback: gera cota vazia para demo
      setCota(null);
    } finally {
      setLoading(false);
    }
  }

  function handleComprar(dono: string, empresa: string) {
    if (!cota) return;
    setBaixando(true);
    const cotaVendida = venderCota(cota, dono, empresa || undefined);
    setCotaFinal(cotaVendida);
    setModalAberto(false);

    // Gera e baixa o certificado HTML
    const html = gerarCertificadoHTML(cotaVendida);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `certificado-cota-${cotaVendida.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setBaixando(false);
    setSucesso(true);
    setTimeout(() => setSucesso(false), 4000);
  }

  const cotaAtiva = cotaFinal ?? cota;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #1a0832 0%, #0a0514 40%, #000 100%)',
      color: '#f0ede8',
      fontFamily: "'Courier New', monospace",
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Background ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        {/* Glow central roxo */}
        <div style={{ position:'absolute', top:'15%', left:'50%', transform:'translateX(-50%)',
          width:600, height:600, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          animation:'pulse 6s ease-in-out infinite' }}/>
        {/* Glow verde */}
        <div style={{ position:'absolute', bottom:'20%', right:'10%',
          width:400, height:400, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)',
          animation:'pulse 8s ease-in-out infinite reverse' }}/>
        {/* Grade hexagonal sutil */}
        <div style={{ position:'absolute', inset:0, opacity:0.02,
          backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 17.3 L60 34.7 L30 52 L0 34.7 L0 17.3 Z' fill='none' stroke='%23a855f7' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize:'60px 52px' }}/>
      </div>

      {/* ── Header ── */}
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
        background:'rgba(5,2,12,0.85)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(168,85,247,0.15)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 20px' }}>
        <Link href="/" style={{ textDecoration:'none' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px',
            background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.2)',
            borderRadius:30, color:'#a855f7', fontSize:13, cursor:'pointer',
            transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.08)'; }}>
            <ArrowLeft size={15}/><span>Voltar</span>
          </div>
        </Link>

        <span style={{ fontSize:12, color:'rgba(168,85,247,0.5)', letterSpacing:3 }}>
          ✦ PENTÁCULOS ✦
        </span>

        <button onClick={fetchCota} style={{ display:'flex', alignItems:'center', gap:6,
          padding:'8px 14px', background:'rgba(168,85,247,0.08)',
          border:'1px solid rgba(168,85,247,0.2)', borderRadius:20,
          color:'#a855f7', fontSize:12, cursor:'pointer' }}>
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}/>
          Recalcular
        </button>
      </div>

      {/* ── Toast sucesso ── */}
      {sucesso && (
        <div style={{ position:'fixed', bottom:30, left:'50%', transform:'translateX(-50%)',
          zIndex:999, display:'flex', alignItems:'center', gap:8,
          padding:'12px 24px', background:'rgba(168,85,247,0.15)',
          border:'1px solid rgba(168,85,247,0.4)', borderRadius:30,
          color:'#a855f7', fontSize:14, backdropFilter:'blur(12px)',
          animation:'fadeInUp 0.3s ease-out' }}>
          <CheckCircle size={16}/> Certificado gerado e baixado com sucesso!
        </div>
      )}

      {/* ── Conteúdo ── */}
      <div style={{ position:'relative', zIndex:10,
        maxWidth:680, margin:'0 auto', padding:'80px 20px 60px' }}>

        {/* ══ HERO: Pentáculo central ══ */}
        <div style={{ textAlign:'center', marginBottom:40, animation:'fadeInDown 0.8s ease-out' }}>
          <div style={{ display:'inline-block', transform:`rotate(${rotacao}deg)`,
            filter:'drop-shadow(0 0 30px rgba(168,85,247,0.3))', marginBottom:8 }}>
            <PentaculoSVG size={180} glow/>
          </div>

          <h1 style={{ fontSize:30, fontWeight:900, letterSpacing:3, margin:'0 0 6px',
            background:'linear-gradient(135deg, #a855f7, #00d4ff, #00ff88)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            GROWTH TRACKER ETF
          </h1>
          <p style={{ fontSize:12, color:'rgba(168,85,247,0.5)', letterSpacing:2, marginBottom:6 }}>
            ATIVO COMPOSTO DIGITAL · SÉRIE {new Date().getFullYear()}
          </p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', maxWidth:440, margin:'0 auto' }}>
            Cada cota representa a soma do conteúdo original produzido no sistema —
            blog, jornal e TV empresarial — convertido em código único e irrepetível.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:50, color:'rgba(168,85,247,0.5)' }}>
            <Loader2 size={36} style={{ animation:'spin 1s linear infinite', margin:'0 auto 12px' }}/>
            <p>Calculando cota a partir dos posts...</p>
          </div>
        )}

        {cotaAtiva && !loading && (
          <>
            {/* ══ CÓDIGO PRINCIPAL DA COTA ══ */}
            <div style={{ marginBottom:24, padding:24,
              background:'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(0,255,136,0.05))',
              border:'1px solid rgba(168,85,247,0.3)', borderRadius:20,
              animation:'fadeInUp 0.6s ease-out 0.1s both' }}>

              {/* Status */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%',
                    background: cotaAtiva.status === 'vendida' ? '#a855f7' : '#00ff88',
                    boxShadow: `0 0 8px ${cotaAtiva.status === 'vendida' ? '#a855f7' : '#00ff88'}`,
                    animation:'pulse 2s ease-in-out infinite' }}/>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>
                    {cotaAtiva.status === 'vendida' ? 'TRANSFERIDA' : 'DISPONÍVEL'}
                  </span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  {cotaAtiva.status === 'vendida' ? <Lock size={13} style={{ color:'#a855f7' }}/> : <Unlock size={13} style={{ color:'#00ff88' }}/>}
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>v{cotaAtiva.versao}</span>
                </div>
              </div>

              {/* Código oculto */}
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:11, color:'rgba(168,85,247,0.5)', letterSpacing:3, marginBottom:10 }}>
                  CÓDIGO DA COTA
                </div>
                <div style={{
                  fontSize: codigoVisivel ? 15 : 18,
                  fontFamily:"'Courier New',monospace",
                  letterSpacing: codigoVisivel ? 2 : 6,
                  color: codigoVisivel ? '#00ff88' : 'rgba(255,255,255,0.15)',
                  textShadow: codigoVisivel ? '0 0 20px rgba(0,255,136,0.5)' : 'none',
                  transition:'all 0.5s',
                  marginBottom:16,
                  wordBreak:'break-all',
                  padding: codigoVisivel ? 0 : '8px 0',
                  background: codigoVisivel ? 'none' : 'rgba(255,255,255,0.03)',
                  borderRadius:8,
                  userSelect: codigoVisivel ? 'text' : 'none',
                }}>
                  {codigoVisivel ? cotaAtiva.codigoCompleto : '•••••••••••••••••••••••••••••'}
                </div>

                <button onClick={() => setCodigoVisivel(v => !v)} style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'8px 20px', background:'rgba(168,85,247,0.1)',
                  border:'1px solid rgba(168,85,247,0.3)', borderRadius:20,
                  color:'#a855f7', fontSize:12, cursor:'pointer',
                  transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.1)'; }}>
                  {codigoVisivel ? <EyeOff size={14}/> : <Eye size={14}/>}
                  {codigoVisivel ? 'Ocultar código' : 'Ver código da cota'}
                </button>
              </div>

              {/* Dono (se vendida) */}
              {cotaAtiva.dono && (
                <div style={{ marginTop:16, padding:'12px 16px', textAlign:'center',
                  background:'rgba(168,85,247,0.08)', borderRadius:12,
                  border:'1px solid rgba(168,85,247,0.2)' }}>
                  <div style={{ fontSize:10, color:'rgba(168,85,247,0.5)', letterSpacing:2, marginBottom:4 }}>TITULAR</div>
                  <div style={{ fontSize:16, color:'#a855f7', fontWeight:700 }}>
                    {cotaAtiva.dono.toUpperCase()}
                  </div>
                  {cotaAtiva.empresa && (
                    <div style={{ fontSize:12, color:'rgba(168,85,247,0.5)', marginTop:2 }}>
                      {cotaAtiva.empresa}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ══ VALOR ══ */}
            <div style={{ marginBottom:24, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12,
              animation:'fadeInUp 0.6s ease-out 0.2s both' }}>
              <div style={{ padding:'18px 16px', background:'rgba(0,255,136,0.05)',
                border:'1px solid rgba(0,255,136,0.15)', borderRadius:16, textAlign:'center' }}>
                <div style={{ fontSize:10, color:'rgba(0,255,136,0.4)', letterSpacing:2, marginBottom:6 }}>VALOR DA COTA</div>
                <div style={{ fontSize:24, fontWeight:900, color:'#00ff88',
                  textShadow:'0 0 16px rgba(0,255,136,0.4)', fontFamily:"'Courier New',monospace" }}>
                  R$ 3.600
                </div>
              </div>
              <div style={{ padding:'18px 16px', background:'rgba(168,85,247,0.05)',
                border:'1px solid rgba(168,85,247,0.15)', borderRadius:16, textAlign:'center' }}>
                <div style={{ fontSize:10, color:'rgba(168,85,247,0.4)', letterSpacing:2, marginBottom:6 }}>TOTAL DE POSTS</div>
                <div style={{ fontSize:24, fontWeight:900, color:'#a855f7',
                  textShadow:'0 0 16px rgba(168,85,247,0.4)', fontFamily:"'Courier New',monospace" }}>
                  {resumo ? resumo.postsBlog + resumo.postsJornal : '—'}
                </div>
              </div>
            </div>

            {/* ══ BLOCOS COMPOSTOS ══ */}
            <div style={{ marginBottom:24, animation:'fadeInUp 0.6s ease-out 0.3s both' }}>
              <h2 style={{ fontSize:11, letterSpacing:3, color:'rgba(168,85,247,0.4)',
                marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
                <Star size={12}/> COMPOSIÇÃO DA COTA
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12 }}>
                {cotaAtiva.blocos.map((bloco, i) => (
                  <BlocoCard key={i} bloco={bloco} codigoVisivel={codigoVisivel}/>
                ))}
              </div>
            </div>

            {/* ══ AÇÃO: Comprar / Gerar certificado ══ */}
            {cotaAtiva.status !== 'vendida' && (
              <div style={{ animation:'fadeInUp 0.6s ease-out 0.5s both' }}>
                <button onClick={() => setModalAberto(true)}
                  style={{ width:'100%', padding:'18px',
                    background:'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,255,136,0.1))',
                    border:'1px solid rgba(168,85,247,0.4)',
                    borderRadius:16, color:'#a855f7',
                    fontFamily:"'Courier New',monospace", fontSize:15, fontWeight:700,
                    cursor:'pointer', display:'flex', alignItems:'center',
                    justifyContent:'center', gap:10, letterSpacing:2,
                    transition:'all 0.3s',
                    boxShadow:'0 0 32px rgba(168,85,247,0.1)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,255,136,0.15))';
                    e.currentTarget.style.boxShadow = '0 0 48px rgba(168,85,247,0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,255,136,0.1))';
                    e.currentTarget.style.boxShadow = '0 0 32px rgba(168,85,247,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                  <ShoppingCart size={18}/> REGISTRAR TITULAR E GERAR CERTIFICADO
                </button>
              </div>
            )}

            {/* Re-download se já vendida */}
            {cotaAtiva.status === 'vendida' && (
              <button onClick={() => {
                const html = gerarCertificadoHTML(cotaAtiva);
                const blob = new Blob([html], { type:'text/html;charset=utf-8' });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement('a');
                a.href = url; a.download = `certificado-${cotaAtiva.id}.html`;
                document.body.appendChild(a); a.click();
                document.body.removeChild(a); URL.revokeObjectURL(url);
              }} style={{ width:'100%', padding:'14px',
                background:'rgba(168,85,247,0.08)',
                border:'1px solid rgba(168,85,247,0.2)',
                borderRadius:14, color:'#a855f7',
                fontFamily:"'Courier New',monospace", fontSize:13,
                cursor:'pointer', display:'flex', alignItems:'center',
                justifyContent:'center', gap:8, animation:'fadeInUp 0.6s ease-out 0.5s both' }}>
                <Download size={14}/> Baixar certificado novamente
              </button>
            )}

            {/* Data de geração */}
            <div style={{ textAlign:'center', marginTop:28, fontSize:11,
              color:'rgba(255,255,255,0.2)', animation:'fadeIn 1s ease-out 0.7s both' }}>
              <p>Cota calculada em {new Date(cotaAtiva.dataGeracao).toLocaleString('pt-BR')}</p>
              <p style={{ marginTop:3 }}>Código baseado em {resumo?.postsBlog ?? 0} posts do blog + {resumo?.postsJornal ?? 0} do jornal</p>
            </div>
          </>
        )}

        {!cota && !loading && (
          <div style={{ textAlign:'center', padding:40, color:'rgba(168,85,247,0.5)' }}>
            <p>Nenhum conteúdo encontrado para gerar a cota.</p>
            <p style={{ fontSize:12, marginTop:8, color:'rgba(255,255,255,0.25)' }}>
              Publique posts no blog ou jornal para ativar o ETF.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAberto && cota && (
        <ModalCompra cota={cota}
          onConfirmar={handleComprar}
          onFechar={() => setModalAberto(false)}/>
      )}

      <style jsx global>{`
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.97)} }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp   { from{opacity:0;transform:translateY(16px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(168,85,247,0.2); border-radius:99px; }
      `}</style>
    </div>
  );
}
