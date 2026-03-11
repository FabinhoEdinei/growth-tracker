'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Edit3, Save, X, Github, Linkedin,
  Globe, Flame, BookOpen, Newspaper, Dumbbell,
  Camera, Check, ExternalLink, Star, Zap, Activity
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

interface Perfil {
  nome:       string;
  titulo:     string;
  bio:        string;
  avatar:     string; // base64 ou URL
  github:     string;
  linkedin:   string;
  site:       string;
  streakMeta: number; // meta diária em minutos
}

interface Stats {
  postsBlog:   number;
  postsJornal: number;
  treinos:     number;
  streak:      number;
  diasAtivo:   number;
  linhasCodigo: number;
}

const PERFIL_DEFAULT: Perfil = {
  nome:       'Fabio Edinei',
  titulo:     'Developer & Growth Hacker',
  bio:        'Construindo o Growth Tracker — um sistema de crescimento pessoal e profissional. Apaixonado por código, dados e evolução contínua.',
  avatar:     '',
  github:     'FabinhoEdinei',
  linkedin:   '',
  site:       'growth-tracker-lilac.vercel.app',
  streakMeta: 30,
};

const STATS_KEY   = 'gt_stats';
const PERFIL_KEY  = 'gt_perfil';

// ─────────────────────────────────────────────────────────────────────────────
// Hook localStorage
// ─────────────────────────────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, [key]);

  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return [value, set, loaded] as const;
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente: Anel orbital do avatar
// ─────────────────────────────────────────────────────────────────────────────

function OrbitalRing({ size = 160 }: { size?: number }) {
  const dots = [
    { angle: 0,   r: 6,  color: '#00ff88', speed: 1 },
    { angle: 72,  r: 5,  color: '#a855f7', speed: 1 },
    { angle: 144, r: 7,  color: '#00d4ff', speed: 1 },
    { angle: 216, r: 4,  color: '#ff00ff', speed: 1 },
    { angle: 288, r: 5,  color: '#ffaa00', speed: 1 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Anel externo */}
      <div style={{
        position: 'absolute', inset: -18,
        borderRadius: '50%',
        border: '1.5px solid rgba(0,255,136,0.2)',
        animation: 'orbitSpin 12s linear infinite',
      }}>
        {dots.map((d, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: d.r * 2, height: d.r * 2,
            borderRadius: '50%',
            background: d.color,
            boxShadow: `0 0 ${d.r * 3}px ${d.color}`,
            top: '50%', left: '50%',
            transform: `rotate(${d.angle}deg) translateX(${size / 2 + 18}px) translateY(-50%)`,
          }}/>
        ))}
      </div>
      {/* Anel interno */}
      <div style={{
        position: 'absolute', inset: -8,
        borderRadius: '50%',
        border: '1px solid rgba(168,85,247,0.15)',
        animation: 'orbitSpin 8s linear infinite reverse',
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente: Stat card
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, delay }: {
  icon: React.ElementType; label: string; value: string | number; color: string; delay: number;
}) {
  return (
    <div style={{
      background: `rgba(${color === '#00ff88' ? '0,255,136' : color === '#a855f7' ? '168,85,247' : color === '#00d4ff' ? '0,212,255' : '255,170,0'},0.06)`,
      border: `1px solid ${color}25`,
      borderRadius: 16, padding: '18px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      transition: 'all 0.3s',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = `${color}60`;
      e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = `${color}25`;
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <Icon size={20} style={{ color, filter: `drop-shadow(0 0 6px ${color})` }}/>
      <span style={{ fontSize: 26, fontWeight: 900, color, fontFamily: "'Courier New', monospace",
        textShadow: `0 0 16px ${color}80`, letterSpacing: -1 }}>
        {value}
      </span>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente: Campo editável
// ─────────────────────────────────────────────────────────────────────────────

function Campo({ label, value, onChange, multiline = false, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string;
}) {
  const base: React.CSSProperties = {
    width: '100%', background: 'rgba(0,255,136,0.05)',
    border: '1px solid rgba(0,255,136,0.2)', borderRadius: 10,
    color: '#f0ede8', fontFamily: "'Courier New', monospace", fontSize: 14,
    padding: '10px 14px', outline: 'none', resize: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, color: 'rgba(0,255,136,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>
        {label}
      </label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} style={base}
            onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(0,255,136,0.1)'; }}
            onBlur={e =>  { e.target.style.borderColor = 'rgba(0,255,136,0.2)'; e.target.style.boxShadow = 'none'; }}/>
        : <input type="text" value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} style={base}
            onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(0,255,136,0.1)'; }}
            onBlur={e =>  { e.target.style.borderColor = 'rgba(0,255,136,0.2)'; e.target.style.boxShadow = 'none'; }}/>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const [perfil, setPerfil, perfilLoaded] = useLocalStorage<Perfil>(PERFIL_KEY, PERFIL_DEFAULT);
  const [stats,  setStats,  statsLoaded]  = useLocalStorage<Stats>(STATS_KEY, {
    postsBlog: 0, postsJornal: 0, treinos: 0, streak: 0, diasAtivo: 0, linhasCodigo: 0,
  });

  const [editando,    setEditando]    = useState(false);
  const [draft,       setDraft]       = useState<Perfil>(PERFIL_DEFAULT);
  const [salvando,    setSalvando]    = useState(false);
  const [salvoOk,     setSalvoOk]     = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Busca stats reais da API
  useEffect(() => {
    fetch('/api/dashboard-algas')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setStats(prev => ({
          ...prev,
          postsBlog:    data.blog?.totalPosts    ?? prev.postsBlog,
          postsJornal:  data.jornal?.totalPosts  ?? prev.postsJornal,
          linhasCodigo: data.codigo?.linhasDeCodigo ?? prev.linhasCodigo,
        }));
      })
      .catch(() => {});
  }, []);

  function abrirEdicao() {
    setDraft({ ...perfil });
    setEditando(true);
    setSalvoOk(false);
  }

  function cancelar() {
    setEditando(false);
    setDraft({ ...perfil });
  }

  async function salvar() {
    setSalvando(true);
    await new Promise(r => setTimeout(r, 400)); // feedback visual
    setPerfil(draft);
    setSalvando(false);
    setSalvoOk(true);
    setEditando(false);
    setTimeout(() => setSalvoOk(false), 2500);
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target?.result as string;
      setDraft(p => ({ ...p, avatar: b64 }));
    };
    reader.readAsDataURL(file);
  }

  const avatarSrc = editando ? draft.avatar : perfil.avatar;
  const nivel = Math.floor((stats.postsBlog + stats.postsJornal + stats.treinos) / 5) + 1;
  const xpAtual = (stats.postsBlog + stats.postsJornal + stats.treinos) % 5;

  if (!perfilLoaded) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 20%, #1a0f2e 0%, #0a0514 50%, #000 100%)',
      color: '#f0ede8',
      fontFamily: "'Courier New', monospace",
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Fundo de partículas ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Glow verde */}
        <div style={{ position: 'absolute', top: '-10%', left: '60%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
          animation: 'blob1 18s ease-in-out infinite' }}/>
        {/* Glow roxo */}
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 600, height: 600,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
          animation: 'blob2 22s ease-in-out infinite' }}/>
        {/* Glow ciano */}
        <div style={{ position: 'absolute', top: '40%', right: '-5%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          animation: 'blob3 15s ease-in-out infinite' }}/>
        {/* Scanlines */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,1) 2px, rgba(0,255,136,1) 3px)',
          backgroundSize: '100% 4px' }}/>
      </div>

      {/* ── Header ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,5,20,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,255,136,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', background: 'rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.2)', borderRadius: 30,
            color: '#00ff88', fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.08)'; }}>
            <ArrowLeft size={15}/><span>Voltar</span>
          </div>
        </Link>

        <span style={{ fontSize: 13, color: 'rgba(0,255,136,0.5)', letterSpacing: 2 }}>
          PERFIL
        </span>

        <div style={{ display: 'flex', gap: 8 }}>
          {editando ? (
            <>
              <button onClick={cancelar} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
                color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}>
                <X size={14}/> Cancelar
              </button>
              <button onClick={salvar} disabled={salvando} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                background: salvando ? 'rgba(0,255,136,0.3)' : 'rgba(0,255,136,0.15)',
                border: '1px solid rgba(0,255,136,0.4)', borderRadius: 20,
                color: '#00ff88', fontSize: 13, cursor: 'pointer',
                transition: 'all 0.2s' }}>
                <Save size={14}/>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </>
          ) : (
            <button onClick={abrirEdicao} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)', borderRadius: 20,
              color: '#00ff88', fontSize: 13, cursor: 'pointer',
              transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.1)'; }}>
              <Edit3 size={14}/> Editar
            </button>
          )}
        </div>
      </div>

      {/* ── Toast salvo ── */}
      {salvoOk && (
        <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          zIndex: 999, display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 24px', background: 'rgba(0,255,136,0.15)',
          border: '1px solid rgba(0,255,136,0.4)', borderRadius: 30,
          color: '#00ff88', fontSize: 14, backdropFilter: 'blur(12px)',
          animation: 'fadeInUp 0.3s ease-out' }}>
          <Check size={16}/> Perfil salvo com sucesso!
        </div>
      )}

      {/* ── Conteúdo ── */}
      <div style={{ position: 'relative', zIndex: 10,
        maxWidth: 640, margin: '0 auto', padding: '88px 20px 60px' }}>

        {/* ══ HERO: Avatar + Nome + Bio ══ */}
        <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeInDown 0.7s ease-out' }}>

          {/* Avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden',
              border: '2px solid rgba(0,255,136,0.3)',
              boxShadow: '0 0 40px rgba(0,255,136,0.15), inset 0 0 20px rgba(0,0,0,0.5)',
              background: 'linear-gradient(135deg, #1a0f2e, #2d1b4e)',
              position: 'relative' }}>
              {avatarSrc && !avatarError
                ? <img src={avatarSrc} alt="avatar" onError={() => setAvatarError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                : <div style={{ width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 48, filter: 'drop-shadow(0 0 12px rgba(0,255,136,0.5))' }}>
                    🧬
                  </div>
              }
            </div>

            {/* Anel orbital */}
            <OrbitalRing size={120}/>

            {/* Botão trocar foto (modo edição) */}
            {editando && (
              <>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar}
                  style={{ display: 'none' }}/>
                <button onClick={() => fileRef.current?.click()} style={{
                  position: 'absolute', bottom: 4, right: 4,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(0,255,136,0.2)', border: '1px solid rgba(0,255,136,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#00ff88' }}>
                  <Camera size={15}/>
                </button>
              </>
            )}

            {/* Badge de nível */}
            <div style={{ position: 'absolute', top: -6, right: -6,
              background: 'linear-gradient(135deg, #a855f7, #6b21a8)',
              border: '2px solid rgba(168,85,247,0.4)',
              borderRadius: 20, padding: '2px 8px',
              fontSize: 11, fontWeight: 700, color: '#fff',
              boxShadow: '0 0 12px rgba(168,85,247,0.4)' }}>
              Nv {nivel}
            </div>
          </div>

          {/* Nome e título */}
          {editando ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <Campo label="Nome" value={draft.nome} onChange={v => setDraft(p => ({ ...p, nome: v }))}
                placeholder="Seu nome"/>
              <Campo label="Título" value={draft.titulo} onChange={v => setDraft(p => ({ ...p, titulo: v }))}
                placeholder="Ex: Developer & Growth Hacker"/>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 6px',
                background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: -0.5 }}>
                {perfil.nome}
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(168,85,247,0.9)', margin: '0 0 16px',
                letterSpacing: 1 }}>
                {perfil.titulo}
              </p>
            </>
          )}

          {/* Bio */}
          {editando ? (
            <Campo label="Bio" value={draft.bio} onChange={v => setDraft(p => ({ ...p, bio: v }))}
              multiline placeholder="Conte um pouco sobre você..."/>
          ) : (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
              maxWidth: 480, margin: '0 auto',
              borderLeft: '2px solid rgba(0,255,136,0.2)', paddingLeft: 16, textAlign: 'left' }}>
              {perfil.bio}
            </p>
          )}
        </div>

        {/* ══ BARRA XP / NÍVEL ══ */}
        <div style={{ marginBottom: 32, animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'rgba(0,255,136,0.5)', letterSpacing: 1 }}>
              NÍVEL {nivel} — {xpAtual}/5 XP
            </span>
            <span style={{ fontSize: 11, color: 'rgba(0,255,136,0.5)' }}>
              {Math.round((xpAtual / 5) * 100)}%
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${(xpAtual / 5) * 100}%`,
              background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
              boxShadow: '0 0 12px rgba(0,255,136,0.5)',
              transition: 'width 1s ease-out',
            }}/>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            Baseado em posts + treinos acumulados
          </p>
        </div>

        {/* ══ ESTATÍSTICAS ══ */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: 3, color: 'rgba(0,255,136,0.4)',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={13}/> ATIVIDADE
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard icon={BookOpen}   label="Posts Blog"       value={stats.postsBlog}   color="#00ff88" delay={0.2}/>
            <StatCard icon={Newspaper}  label="Posts Jornal"     value={stats.postsJornal} color="#a855f7" delay={0.25}/>
            <StatCard icon={Dumbbell}   label="Treinos"          value={stats.treinos}     color="#00d4ff" delay={0.3}/>
            <StatCard icon={Flame}      label="Dias de Streak"   value={stats.streak}      color="#ff4520" delay={0.35}/>
            <StatCard icon={Star}       label="Dias Ativo"       value={stats.diasAtivo}   color="#ffaa00" delay={0.4}/>
            <StatCard icon={Zap}        label={`Linhas (k)`}
              value={stats.linhasCodigo > 0 ? `${(stats.linhasCodigo/1000).toFixed(1)}k` : '—'}
              color="#00d4ff" delay={0.45}/>
          </div>

          {/* Editar stats manuais */}
          {editando && (
            <div style={{ marginTop: 16, padding: 16,
              background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)',
              borderRadius: 12 }}>
              <p style={{ fontSize: 11, color: 'rgba(0,255,136,0.4)', marginBottom: 12, letterSpacing: 1 }}>
                STATS MANUAIS (posts e linhas vêm da API automaticamente)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Campo label="Treinos realizados"
                  value={String(stats.treinos)}
                  onChange={v => setStats(p => ({ ...p, treinos: parseInt(v) || 0 }))}/>
                <Campo label="Dias de streak"
                  value={String(stats.streak)}
                  onChange={v => setStats(p => ({ ...p, streak: parseInt(v) || 0 }))}/>
                <Campo label="Dias ativo total"
                  value={String(stats.diasAtivo)}
                  onChange={v => setStats(p => ({ ...p, diasAtivo: parseInt(v) || 0 }))}/>
                <Campo label="Meta diária (min)"
                  value={String(perfil.streakMeta)}
                  onChange={v => setDraft(p => ({ ...p, streakMeta: parseInt(v) || 30 }))}/>
              </div>
            </div>
          )}
        </div>

        {/* ══ LINKS SOCIAIS ══ */}
        <div style={{ marginBottom: 32, animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
          <h2 style={{ fontSize: 12, letterSpacing: 3, color: 'rgba(0,255,136,0.4)',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={13}/> LINKS
          </h2>

          {editando ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Campo label="GitHub (usuário)"
                value={draft.github}
                onChange={v => setDraft(p => ({ ...p, github: v }))}
                placeholder="FabinhoEdinei"/>
              <Campo label="LinkedIn (URL ou usuário)"
                value={draft.linkedin}
                onChange={v => setDraft(p => ({ ...p, linkedin: v }))}
                placeholder="linkedin.com/in/seu-perfil"/>
              <Campo label="Site / Portfolio"
                value={draft.site}
                onChange={v => setDraft(p => ({ ...p, site: v }))}
                placeholder="seu-site.com"/>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {perfil.github && (
                <a href={`https://github.com/${perfil.github}`} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                    transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)';
                      e.currentTarget.style.background = 'rgba(0,255,136,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Github size={20} style={{ color: '#00ff88' }}/>
                      <div>
                        <div style={{ fontSize: 14, color: '#f0ede8' }}>GitHub</div>
                        <div style={{ fontSize: 12, color: 'rgba(0,255,136,0.5)' }}>@{perfil.github}</div>
                      </div>
                    </div>
                    <ExternalLink size={14} style={{ color: 'rgba(255,255,255,0.25)' }}/>
                  </div>
                </a>
              )}

              {perfil.linkedin && (
                <a href={perfil.linkedin.startsWith('http') ? perfil.linkedin : `https://linkedin.com/in/${perfil.linkedin}`}
                  target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                    transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
                      e.currentTarget.style.background = 'rgba(168,85,247,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Linkedin size={20} style={{ color: '#a855f7' }}/>
                      <div>
                        <div style={{ fontSize: 14, color: '#f0ede8' }}>LinkedIn</div>
                        <div style={{ fontSize: 12, color: 'rgba(168,85,247,0.6)' }}>{perfil.linkedin}</div>
                      </div>
                    </div>
                    <ExternalLink size={14} style={{ color: 'rgba(255,255,255,0.25)' }}/>
                  </div>
                </a>
              )}

              {perfil.site && (
                <a href={perfil.site.startsWith('http') ? perfil.site : `https://${perfil.site}`}
                  target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                    transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                      e.currentTarget.style.background = 'rgba(0,212,255,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Globe size={20} style={{ color: '#00d4ff' }}/>
                      <div>
                        <div style={{ fontSize: 14, color: '#f0ede8' }}>Site</div>
                        <div style={{ fontSize: 12, color: 'rgba(0,212,255,0.6)' }}>{perfil.site}</div>
                      </div>
                    </div>
                    <ExternalLink size={14} style={{ color: 'rgba(255,255,255,0.25)' }}/>
                  </div>
                </a>
              )}

              {!perfil.github && !perfil.linkedin && !perfil.site && (
                <div style={{ padding: 20, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13,
                  border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 14 }}>
                  Nenhum link adicionado — clique em Editar
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <div style={{ textAlign: 'center', paddingTop: 24,
          borderTop: '1px solid rgba(0,255,136,0.08)',
          fontSize: 11, color: 'rgba(255,255,255,0.2)',
          animation: 'fadeIn 1s ease-out 0.7s both' }}>
          <p>🧬 Growth Tracker · Perfil local · Dados salvos no dispositivo</p>
        </div>
      </div>

      {/* ── CSS Global ── */}
      <style jsx global>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blob1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(-40px, 30px) scale(1.1); }
          66%     { transform: translate(30px, -20px) scale(0.95); }
        }
        @keyframes blob2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(50px, -40px) scale(1.15); }
        }
        @keyframes blob3 {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(-30px, 30px); }
        }
        @keyframes fadeInDown {
          from { opacity:0; transform:translateY(-20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        * { box-sizing: border-box; }
        input, textarea { transition: border-color 0.2s, box-shadow 0.2s; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.2); border-radius: 99px; }
      `}</style>
    </div>
  );
}
