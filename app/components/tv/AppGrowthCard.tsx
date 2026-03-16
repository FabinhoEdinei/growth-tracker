'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/components/tv/AppGrowthCard.tsx
// Card de crescimento do app — consome /api/tv-report
// Usado como slide da TV e como card standalone
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface TvData {
  scoreSaude:        number;
  tendencia:         'crescendo' | 'estável' | 'atenção';
  totalConteudo:     number;
  statusApp:         string;
  ultimaAtualizacao: string;
  alertas:           string[];
  destaques:         string[];
  etf?: {
    codigo: string; valor: number; status: 'disponivel' | 'vendida';
  } | null;
  ultimosBlog?:   { titulo: string; slug: string; data: string }[];
  ultimosJornal?: { titulo: string; slug: string; data: string }[];
}

interface Relatorio {
  data:    string;
  resumo:  { postsBlog: number; postsJornal: number };
  tv:      TvData;
}

// ── Helpers visuais ───────────────────────────────────────────────────────────
const TENDENCIA_CONFIG = {
  crescendo: { cor: '#00ff88', icone: '📈', label: 'CRESCENDO'  },
  estável:   { cor: '#00d4ff', icone: '➡️', label: 'ESTÁVEL'    },
  atenção:   { cor: '#ff8c42', icone: '⚠️', label: 'ATENÇÃO'    },
};

function ScoreRing({ score, cor }: { score: number; cor: string }) {
  const r    = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ position:'relative', width:90, height:90, flexShrink:0 }}>
      <svg width={90} height={90} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={45} cy={45} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={7}/>
        <circle cx={45} cy={45} r={r} fill="none"
          stroke={cor} strokeWidth={7}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 6px ${cor})`, transition:'stroke-dasharray .8s ease' }}
        />
      </svg>
      <div style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ fontSize:20, fontWeight:900, color:cor, lineHeight:1 }}>{score}</span>
        <span style={{ fontSize:7, color:'rgba(255,255,255,.4)', letterSpacing:1, marginTop:1 }}>SCORE</span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function AppGrowthCard({ relatorio: extRelatorio }: { relatorio?: Relatorio }) {
  const [data,    setData]    = useState<Relatorio | null>(extRelatorio ?? null);
  const [loading, setLoading] = useState(!extRelatorio);
  const [error,   setError]   = useState<string | null>(null);
  const [lastSync,setLastSync]= useState<string>('');

  useEffect(() => {
    if (extRelatorio) { setData(extRelatorio); return; }
    fetch('/api/tv-report', { cache:'no-store' })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => {
        setData(d.relatorio);
        setLastSync(new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }));
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [extRelatorio]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding:28, textAlign:'center' }}>
      <div style={{ fontSize:28, animation:'spin 1s linear infinite', display:'inline-block' }}>⚙️</div>
      <div style={{ marginTop:8, fontSize:11, color:'rgba(255,255,255,.4)', fontFamily:"'Courier New',monospace", letterSpacing:1 }}>
        CARREGANDO DADOS...
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Erro ──────────────────────────────────────────────────────────────────
  if (error || !data) return (
    <div style={{ padding:20, textAlign:'center' }}>
      <div style={{ fontSize:24, marginBottom:8 }}>⚠️</div>
      <div style={{ fontSize:11, color:'#ff8c42', fontFamily:"'Courier New',monospace" }}>
        {error ?? 'Sem dados'}
      </div>
    </div>
  );

  const tv  = data.tv;
  const cfg = TENDENCIA_CONFIG[tv.tendencia] ?? TENDENCIA_CONFIG['estável'];

  return (
    <div style={{ width:'100%', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* ── Título ── */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <span style={{ fontSize:24 }}>📡</span>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:900, color:'#fff' }}>Status do App</h2>
          <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', marginTop:1, letterSpacing:1 }}>
            GROWTH TRACKER · {data.data}
            {lastSync && <span style={{ marginLeft:8, color:'rgba(255,255,255,.25)' }}>· sync {lastSync}</span>}
          </div>
        </div>
      </div>

      {/* ── Score + Tendência ── */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20, padding:'16px 18px', background:'rgba(255,255,255,.04)', border:`1px solid ${cfg.cor}30`, borderRadius:14 }}>
        <ScoreRing score={tv.scoreSaude} cor={cfg.cor} />
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
            <span style={{ fontSize:16 }}>{cfg.icone}</span>
            <span style={{ fontSize:13, fontWeight:900, color:cfg.cor, letterSpacing:1.5, fontFamily:"'Courier New',monospace" }}>
              {cfg.label}
            </span>
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', lineHeight:1.5 }}>
            {tv.statusApp === 'ativo' ? `${tv.totalConteudo} publicações indexadas` : 'Aguardando conteúdo'}
          </div>
        </div>
      </div>

      {/* ── Contadores Blog / Jornal / ETF ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
        {[
          { icon:'📝', label:'Blog',   val: data.resumo.postsBlog,   cor:'#00d4ff' },
          { icon:'📰', label:'Jornal', val: data.resumo.postsJornal, cor:'#ff8c42' },
          { icon:'🔮', label:'ETF',    val: tv.etf ? 1 : 0,          cor:'#ffd700' },
        ].map(({ icon, label, val, cor }) => (
          <div key={label} style={{ padding:'10px 8px', background:'rgba(255,255,255,.04)', border:`1px solid ${cor}22`, borderRadius:10, textAlign:'center' }}>
            <div style={{ fontSize:16, marginBottom:3 }}>{icon}</div>
            <div style={{ fontSize:18, fontWeight:900, color:cor, lineHeight:1 }}>{val}</div>
            <div style={{ fontSize:8, color:'rgba(255,255,255,.35)', letterSpacing:1.5, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── ETF badge ── */}
      {tv.etf && (
        <div style={{ padding:'10px 14px', background:'rgba(255,215,0,.08)', border:'1px solid rgba(255,215,0,.25)', borderRadius:10, marginBottom:14, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:16 }}>🔮</span>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#ffd700', letterSpacing:1, fontFamily:"'Courier New',monospace", overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {tv.etf.codigo}
            </div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', marginTop:1 }}>
              R$ {tv.etf.valor.toLocaleString('pt-BR')} · {tv.etf.status === 'disponivel' ? '🟢 DISPONÍVEL' : '🔴 VENDIDA'}
            </div>
          </div>
        </div>
      )}

      {/* ── Últimos posts do blog ── */}
      {(tv.ultimosBlog?.length ?? 0) > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, color:'rgba(0,212,255,.7)', letterSpacing:2, marginBottom:6, fontFamily:"'Courier New',monospace" }}>BLOG RECENTE</div>
          {tv.ultimosBlog!.map((p, i) => (
            <div key={p.slug} style={{ padding:'7px 10px', background:'rgba(0,212,255,.05)', borderLeft:'2px solid rgba(0,212,255,.3)', borderRadius:'0 6px 6px 0', marginBottom:4, animation:`fadeIn .3s ${i*.08}s backwards` }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.8)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.titulo}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.3)', marginTop:1 }}>{p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '—'}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Últimas edições do jornal ── */}
      {(tv.ultimosJornal?.length ?? 0) > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, color:'rgba(255,140,66,.7)', letterSpacing:2, marginBottom:6, fontFamily:"'Courier New',monospace" }}>JORNAL RECENTE</div>
          {tv.ultimosJornal!.map((p, i) => (
            <div key={p.slug} style={{ padding:'7px 10px', background:'rgba(255,140,66,.05)', borderLeft:'2px solid rgba(255,140,66,.3)', borderRadius:'0 6px 6px 0', marginBottom:4, animation:`fadeIn .3s ${i*.08}s backwards` }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.8)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.titulo}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.3)', marginTop:1 }}>{p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '—'}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Destaques ── */}
      {tv.destaques.length > 0 && (
        <div style={{ marginBottom:10 }}>
          {tv.destaques.map((d, i) => (
            <div key={i} style={{ fontSize:11, color:'rgba(255,255,255,.6)', padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>{d}</div>
          ))}
        </div>
      )}

      {/* ── Alertas ── */}
      {tv.alertas.length > 0 && (
        <div style={{ padding:'10px 12px', background:'rgba(255,140,66,.08)', border:'1px solid rgba(255,140,66,.2)', borderRadius:8 }}>
          {tv.alertas.map((a, i) => (
            <div key={i} style={{ fontSize:10, color:'#ff8c42', display:'flex', gap:6, alignItems:'flex-start', marginBottom: i < tv.alertas.length-1 ? 4 : 0 }}>
              <span style={{ flexShrink:0 }}>⚠</span><span>{a}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}
