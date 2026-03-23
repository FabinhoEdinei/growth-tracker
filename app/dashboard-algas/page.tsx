'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Microscope, TrendingUp, FileText,
  Activity, Droplets, Dna, Code2, Newspaper,
  BookOpen, RefreshCw, Calendar, Loader2
} from 'lucide-react';

// ── Tipos ──────────────────────────────────────────────────────────────────

interface CategoryData  { name: string; count: number; color: string; }
interface MonthlyData   { month: string; posts: number; year: number; }
interface PostRecente   { title: string; slug: string; date: string; category: string; excerpt: string; }

interface DashboardData {
  blog: {
    totalPosts:      number;
    postsEsteMes:    number;
    growthRate:      number;
    postsByCategory: CategoryData[];
    monthlyData:     MonthlyData[];
    recentes:        PostRecente[];
  };
  jornal: {
    totalPosts:   number;
    postsEsteMes: number;
    recentes:     PostRecente[];
  };
  geral: {
    totalConteudo: number;
    postsHoje:     number;
  };
  codigo: {
    linhasDeCodigo:  number;
    arquivos:        number;
    arquivosPorTipo: Record<string, number>;
  };
  geradoEm: string;
}

// ── Subcomponentes ─────────────────────────────────────────────────────────

function BarChart({ data, hoveredIndex, onHover }: {
  data: MonthlyData[];
  hoveredIndex: number | null;
  onHover: (i: number | null) => void;
}) {
  const maxValue = Math.max(...data.map(d => d.posts), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-around', height:'120px', gap:'6px', padding:'10px 0' }}>
      {data.map((item, i) => (
        <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}
          onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)}>
          <span style={{ fontSize:'10px', color:'rgba(0,255,136,0.5)', marginBottom:'3px', fontFamily:'Courier New, monospace' }}>
            {item.posts}
          </span>
          <div style={{
            width:'100%', maxWidth:'28px',
            height: item.posts === 0 ? '4px' : `${(item.posts / maxValue) * 80}px`,
            background: hoveredIndex === i
              ? 'linear-gradient(to top, #00ff88, rgba(0,255,136,0.8))'
              : 'linear-gradient(to top, #00ff88, rgba(0,255,136,0.3))',
            borderRadius:'4px 4px 0 0',
            transition:'all 0.3s ease',
            boxShadow: hoveredIndex === i ? '0 0 16px rgba(0,255,136,0.6)' : 'none',
            opacity: item.posts === 0 ? 0.2 : 1,
          }}/>
          <span style={{ fontSize:'10px', color:'rgba(0,255,136,0.6)', marginTop:'5px', fontFamily:'Courier New, monospace' }}>
            {item.month}
          </span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, hoveredIndex, onHover }: {
  data: CategoryData[];
  hoveredIndex: number | null;
  onHover: (i: number | null) => void;
}) {
  const total = data.reduce((a, b) => a + b.count, 0) || 1;
  let angle = 0;
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'20px', flexWrap:'wrap' }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        {data.map((item, i) => {
          const slice = (item.count / total) * 360;
          const start = angle;
          angle += slice;
          const x1 = 60 + 50 * Math.cos((start - 90) * Math.PI / 180);
          const y1 = 60 + 50 * Math.sin((start - 90) * Math.PI / 180);
          const x2 = 60 + 50 * Math.cos((angle - 90) * Math.PI / 180);
          const y2 = 60 + 50 * Math.sin((angle - 90) * Math.PI / 180);
          const large = slice > 180 ? 1 : 0;
          return (
            <path key={i}
              d={`M 60 60 L ${x1} ${y1} A 50 50 0 ${large} 1 ${x2} ${y2} Z`}
              fill={item.color} stroke="rgba(0,0,0,0.3)" strokeWidth="1"
              style={{ opacity: hoveredIndex === i ? 1 : 0.75, transition:'opacity 0.3s', cursor:'pointer' }}
              onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)}
            />
          );
        })}
        <circle cx="60" cy="60" r="30" fill="rgba(10,10,30,0.95)" />
        <text x="60" y="58" textAnchor="middle" fill="#00ff88" fontSize="13" fontWeight="bold">{total}</text>
        <text x="60" y="70" textAnchor="middle" fill="rgba(0,255,136,0.5)" fontSize="9">posts</text>
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
        {data.map((item, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px',
            color: hoveredIndex === i ? '#00ff88' : 'rgba(0,255,136,0.7)',
            transition:'color 0.3s', cursor:'pointer' }}
            onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)}>
            <div style={{ width:10, height:10, background:item.color, borderRadius:2, boxShadow:`0 0 8px ${item.color}`, flexShrink:0 }}/>
            <span>{item.name}: <strong>{item.count}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardBase({ children, delay=0, style={} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      background:'rgba(0,255,136,0.05)', border:'1px solid rgba(0,255,136,0.2)',
      borderRadius:15, padding:25, backdropFilter:'blur(10px)',
      transition:'all 0.3s ease', animation:`fadeInUp 0.8s ease-out ${delay}s both`, ...style
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,255,136,0.15)';
      e.currentTarget.style.borderColor = 'rgba(0,255,136,0.45)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)';
    }}>
      {children}
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────

export default function DashboardAlgasPage() {
  const [data,         setData]         = useState<DashboardData | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [hoveredBar,   setHoveredBar]   = useState<number | null>(null);
  const [hoveredDonut, setHoveredDonut] = useState<number | null>(null);
  const [ultimaSync,   setUltimaSync]   = useState<Date | null>(null);
  const [refreshing,   setRefreshing]   = useState(false);

  async function fetchData(manual = false) {
    if (manual) setRefreshing(true); else setLoading(true);
    try {
      const res = await fetch('/api/dashboard-algas');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      const jsonData = await res.json();
      setData(jsonData);
      setError(null);
      setUltimaSync(new Date());
    } catch (e) {
      console.error('[v0] Dashboard Algas fetch error:', e);
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const d = data;

  return (
    <div style={{
      minHeight:'100vh',
      background:'radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1))',
      position:'relative', overflow:'hidden',
      fontFamily:'Courier New, monospace', color:'#00ff88',
    }}>

      {/* ── Fundo animado ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, opacity:0.4 }}>
        <div style={{ position:'absolute', width:'200%', height:'200%', top:'-50%', left:'-50%',
          background:'radial-gradient(ellipse at 20% 30%, rgba(0,255,136,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0,200,100,0.1) 0%, transparent 50%)',
          animation:'float1 20s ease-in-out infinite', filter:'blur(40px)' }}/>
        <div style={{ position:'absolute', width:'200%', height:'200%', top:'-50%', left:'-50%',
          background:'radial-gradient(ellipse at 70% 20%, rgba(0,255,136,0.12) 0%, transparent 40%)',
          animation:'float2 15s ease-in-out infinite', filter:'blur(30px)' }}/>
      </div>

      {/* ── Header fixo ── */}
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
        background:'rgba(0,0,0,0.6)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid rgba(0,255,136,0.1)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 20px' }}>
        <Link href="/" style={{ textDecoration:'none' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8,
            padding:'8px 16px', background:'rgba(0,255,136,0.1)',
            border:'1px solid rgba(0,255,136,0.25)', borderRadius:30,
            color:'#00ff88', fontSize:13, cursor:'pointer' }}>
            <ArrowLeft size={16}/><span>Voltar</span>
          </div>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {ultimaSync && (
            <span style={{ fontSize:11, color:'rgba(0,255,136,0.4)' }}>
              {ultimaSync.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}
            </span>
          )}
          <button onClick={() => fetchData(true)} disabled={refreshing}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px',
              background:'rgba(0,255,136,0.1)', border:'1px solid rgba(0,255,136,0.25)',
              borderRadius:20, color:'#00ff88', fontSize:12, cursor:'pointer' }}>
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}/>
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div style={{ position:'relative', zIndex:10, padding:'80px 20px 40px', maxWidth:1200, margin:'0 auto' }}>

        {/* Título */}
        <div style={{ textAlign:'center', marginBottom:40, animation:'fadeInDown 0.8s ease-out' }}>
          <div style={{ fontSize:48, marginBottom:10, animation:'float 3s ease-in-out infinite',
            filter:'drop-shadow(0 0 20px rgba(0,255,136,0.5))' }}>🦠</div>
          <h1 style={{ fontSize:32, marginBottom:8, textShadow:'0 0 20px rgba(0,255,136,0.5)', letterSpacing:2 }}>
            Dashboard Algas
          </h1>
          <p style={{ fontSize:13, color:'rgba(0,255,136,0.5)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Activity size={13}/> Dados reais do Growth Tracker <Activity size={13}/>
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:60, color:'rgba(0,255,136,0.6)' }}>
            <Loader2 size={40} style={{ animation:'spin 1s linear infinite', margin:'0 auto 16px' }}/>
            <p>Lendo arquivos do projeto...</p>
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div style={{ textAlign:'center', padding:40,
            background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.2)',
            borderRadius:15, color:'#ff8888', marginBottom:24 }}>
            <p>❌ {error}</p>
            <button onClick={() => fetchData(true)} style={{ marginTop:12, padding:'8px 20px',
              background:'rgba(255,68,68,0.15)', border:'1px solid rgba(255,68,68,0.3)',
              borderRadius:20, color:'#ff8888', cursor:'pointer', fontSize:13 }}>
              Tentar novamente
            </button>
          </div>
        )}

        {d && !loading && (
          <>
            {/* ── KPIs principais ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:24 }}>

              <CardBase delay={0.1}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <BookOpen size={22} style={{ opacity:0.8 }}/>
                  <span style={{ background:'rgba(0,255,136,0.15)', padding:'3px 8px',
                    borderRadius:12, fontSize:11 }}>+{d.blog.postsEsteMes} este mês</span>
                </div>
                <div style={{ fontSize:38, fontWeight:'bold', marginBottom:4 }}>{d.blog.totalPosts}</div>
                <div style={{ fontSize:12, color:'rgba(0,255,136,0.55)' }}>Posts no Blog</div>
              </CardBase>

              <CardBase delay={0.15}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <Newspaper size={22} style={{ opacity:0.8 }}/>
                  <span style={{ background:'rgba(0,255,136,0.15)', padding:'3px 8px',
                    borderRadius:12, fontSize:11 }}>+{d.jornal.postsEsteMes} este mês</span>
                </div>
                <div style={{ fontSize:38, fontWeight:'bold', marginBottom:4 }}>{d.jornal.totalPosts}</div>
                <div style={{ fontSize:12, color:'rgba(0,255,136,0.55)' }}>Posts no Jornal</div>
              </CardBase>

              <CardBase delay={0.2}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <Droplets size={22} style={{ opacity:0.8 }}/>
                  <TrendingUp size={15} style={{ color: d.blog.growthRate >= 0 ? '#00ff88' : '#ff4444' }}/>
                </div>
                <div style={{ fontSize:38, fontWeight:'bold', marginBottom:4,
                  color: d.blog.growthRate >= 0 ? '#00ff88' : '#ff8888' }}>
                  {d.blog.growthRate > 0 ? '+' : ''}{d.blog.growthRate}%
                </div>
                <div style={{ fontSize:12, color:'rgba(0,255,136,0.55)' }}>Crescimento vs. mês anterior</div>
              </CardBase>

              <CardBase delay={0.25}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <FileText size={22} style={{ opacity:0.8 }}/>
                  <span style={{ background:'rgba(0,255,136,0.15)', padding:'3px 8px',
                    borderRadius:12, fontSize:11 }}>hoje: {d.geral.postsHoje}</span>
                </div>
                <div style={{ fontSize:38, fontWeight:'bold', marginBottom:4 }}>{d.geral.totalConteudo}</div>
                <div style={{ fontSize:12, color:'rgba(0,255,136,0.55)' }}>Total de conteúdo</div>
              </CardBase>

              <CardBase delay={0.3}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <Code2 size={22} style={{ opacity:0.8 }}/>
                </div>
                <div style={{ fontSize:38, fontWeight:'bold', marginBottom:4 }}>
                  {(d.codigo.linhasDeCodigo / 1000).toFixed(1)}k
                </div>
                <div style={{ fontSize:12, color:'rgba(0,255,136,0.55)' }}>Linhas de código</div>
              </CardBase>

              <CardBase delay={0.35}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <Microscope size={22} style={{ opacity:0.8 }}/>
                </div>
                <div style={{ fontSize:38, fontWeight:'bold', marginBottom:4 }}>{d.codigo.arquivos}</div>
                <div style={{ fontSize:12, color:'rgba(0,255,136,0.55)' }}>Arquivos no projeto</div>
              </CardBase>

            </div>

            {/* ── Gráficos ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16, marginBottom:24 }}>

              <CardBase delay={0.4} style={{}}>
                <h3 style={{ fontSize:15, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                  <Activity size={16}/> Posts por Mês (blog)
                </h3>
                <BarChart data={d.blog.monthlyData} hoveredIndex={hoveredBar} onHover={setHoveredBar}/>
              </CardBase>

              <CardBase delay={0.45} style={{}}>
                <h3 style={{ fontSize:15, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                  <Dna size={16}/> Por Categoria
                </h3>
                {d.blog.postsByCategory.length > 0
                  ? <DonutChart data={d.blog.postsByCategory} hoveredIndex={hoveredDonut} onHover={setHoveredDonut}/>
                  : <p style={{ color:'rgba(0,255,136,0.4)', fontSize:13, textAlign:'center', paddingTop:20 }}>Sem categorias ainda</p>
                }
              </CardBase>

            </div>

            {/* ── Posts recentes ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16, marginBottom:24 }}>

              {/* Blog recentes */}
              <CardBase delay={0.5} style={{}}>
                <h3 style={{ fontSize:15, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                  <BookOpen size={16}/> Últimos posts do Blog
                </h3>
                {d.blog.recentes.length === 0
                  ? <p style={{ color:'rgba(0,255,136,0.35)', fontSize:12 }}>Nenhum post ainda</p>
                  : d.blog.recentes.map((p, i) => (
                    <Link key={i} href={`/blog/${p.slug}`} style={{ textDecoration:'none' }}>
                      <div style={{ padding:'10px 12px', marginBottom:8, borderRadius:10,
                        background:'rgba(0,255,136,0.04)', border:'1px solid rgba(0,255,136,0.1)',
                        transition:'all 0.2s', cursor:'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,255,136,0.35)'; e.currentTarget.style.background='rgba(0,255,136,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,255,136,0.1)'; e.currentTarget.style.background='rgba(0,255,136,0.04)'; }}>
                        <div style={{ fontSize:13, fontWeight:'bold', color:'#00ff88', marginBottom:3, lineHeight:1.3 }}>{p.title}</div>
                        <div style={{ fontSize:11, color:'rgba(0,255,136,0.4)', display:'flex', gap:10 }}>
                          <span><Calendar size={10} style={{ display:'inline', marginRight:3 }}/>{p.date}</span>
                          <span style={{ background:'rgba(0,255,136,0.15)', padding:'1px 6px', borderRadius:8 }}>{p.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                }
              </CardBase>

              {/* Jornal recentes */}
              <CardBase delay={0.55} style={{}}>
                <h3 style={{ fontSize:15, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                  <Newspaper size={16}/> Últimos posts do Jornal
                </h3>
                {d.jornal.recentes.length === 0
                  ? <p style={{ color:'rgba(0,255,136,0.35)', fontSize:12 }}>Nenhum post ainda</p>
                  : d.jornal.recentes.map((p, i) => (
                    <Link key={i} href={`/jornal/${p.slug}`} style={{ textDecoration:'none' }}>
                      <div style={{ padding:'10px 12px', marginBottom:8, borderRadius:10,
                        background:'rgba(0,255,136,0.04)', border:'1px solid rgba(0,255,136,0.1)',
                        transition:'all 0.2s', cursor:'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,255,136,0.35)'; e.currentTarget.style.background='rgba(0,255,136,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,255,136,0.1)'; e.currentTarget.style.background='rgba(0,255,136,0.04)'; }}>
                        <div style={{ fontSize:13, fontWeight:'bold', color:'#00ff88', marginBottom:3, lineHeight:1.3 }}>{p.title}</div>
                        <div style={{ fontSize:11, color:'rgba(0,255,136,0.4)', display:'flex', gap:10 }}>
                          <span><Calendar size={10} style={{ display:'inline', marginRight:3 }}/>{p.date}</span>
                          <span style={{ background:'rgba(0,255,136,0.15)', padding:'1px 6px', borderRadius:8 }}>{p.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                }
              </CardBase>

            </div>

            {/* ── Tipos de arquivo ── */}
            <CardBase delay={0.6} style={{}}>
              <h3 style={{ fontSize:15, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                <Code2 size={16}/> Distribuição de arquivos no projeto
              </h3>
              <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
                {Object.entries(d.codigo.arquivosPorTipo)
                  .sort((a,b) => b[1]-a[1])
                  .map(([ext, qtd]) => {
                    const total = Object.values(d.codigo.arquivosPorTipo).reduce((a,b)=>a+b,0);
                    const pct = Math.round((qtd/total)*100);
                    const cores: Record<string,string> = { '.tsx':'#00d4ff', '.ts':'#00ff88', '.css':'#ff69b4', '.md':'#e8b84b', '.json':'#a855f7' };
                    const cor = cores[ext] ?? '#00ff88';
                    return (
                      <div key={ext} style={{ display:'flex', alignItems:'center', gap:8,
                        padding:'6px 12px', background:'rgba(0,255,136,0.05)',
                        border:`1px solid ${cor}33`, borderRadius:20 }}>
                        <span style={{ fontFamily:'Courier New', fontSize:12, color:cor, fontWeight:'bold' }}>{ext}</span>
                        <span style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>{qtd}</span>
                        <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{pct}%</span>
                      </div>
                    );
                  })}
              </div>
            </CardBase>

            {/* Footer */}
            <div style={{ textAlign:'center', marginTop:32, padding:20,
              borderTop:'1px solid rgba(0,255,136,0.1)',
              fontSize:11, color:'rgba(0,255,136,0.35)', animation:'fadeIn 1s ease-out 0.8s both' }}>
              <p>🧬 Dados reais do Growth Tracker</p>
              <p style={{ marginTop:4 }}>
                Gerado em {d.geradoEm ? new Date(d.geradoEm).toLocaleString('pt-BR') : '—'}
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes float1  { 0%,100%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(30px,-30px) rotate(120deg)} 66%{transform:translate(-20px,20px) rotate(240deg)} }
        @keyframes float2  { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(-40px,40px) rotate(180deg)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  );
}
