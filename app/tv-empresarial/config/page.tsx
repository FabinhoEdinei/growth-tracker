'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/tv-empresarial/config/page.tsx
// Editor completo de cards da TV Empresarial
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  useTvConfig,
  DEFAULT_SLIDES,
  type SlideConfig,
  type RankingEntry,
  type LinhaProducao,
  type Comunicado,
} from '@/hooks/useTvConfig';

// ── Paleta de cores rápidas ───────────────────────────────────────────────────
const COLORS = ['#00ff88','#00d4ff','#ffd700','#a855f7','#38bdf8','#ff6b9d','#ff8c42','#ff0066'];

// ── Posts da API ──────────────────────────────────────────────────────────────
interface PostItem { titulo: string; slug: string; date: string; tipo: 'blog'|'jornal'|'tv'; category?: string; }

// ── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => `custom-${Date.now().toString(36)}`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display:'block', fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:1.5, marginBottom:5, fontFamily:"'Courier New',monospace", textTransform:'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width:'100%', padding:'8px 12px', boxSizing:'border-box',
  background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)',
  borderRadius:8, color:'#fff', fontSize:13, fontFamily:'inherit', outline:'none',
};

const btn = (color='#00d4ff', bg='rgba(0,212,255,.12)'): React.CSSProperties => ({
  display:'inline-flex', alignItems:'center', gap:6,
  padding:'7px 14px', background:bg, border:`1px solid ${color}55`,
  borderRadius:8, color, fontSize:11, cursor:'pointer',
  fontFamily:"'Courier New',monospace", letterSpacing:1,
  fontWeight:700, transition:'opacity .2s',
});

// ═════════════════════════════════════════════════════════════════════════════
// EDITOR DE PRODUÇÃO
// ═════════════════════════════════════════════════════════════════════════════
function ProducaoEditor({ slide, onChange }: { slide: SlideConfig; onChange: (p: Partial<SlideConfig>) => void }) {
  const d = slide.producao!;
  const set = (patch: Partial<typeof d>) => onChange({ producao: { ...d, ...patch } });

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <Field label="Unidades hoje">
          <input style={inp} type="number" value={d.unidadesHoje}
            onChange={e => set({ unidadesHoje: Number(e.target.value) })} />
        </Field>
        <Field label="Tempo operacional">
          <input style={inp} value={d.tempoOperacional}
            onChange={e => set({ tempoOperacional: e.target.value })} />
        </Field>
      </div>
      <Field label="Alerta">
        <input style={inp} value={d.alerta ?? ''}
          onChange={e => set({ alerta: e.target.value })} placeholder="ex: Manutenção às 14h" />
      </Field>
      <Field label="Linhas de produção">
        {d.linhas.map((l, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 120px 60px 28px', gap:6, marginBottom:6 }}>
            <input style={inp} value={l.nome} placeholder="Nome"
              onChange={e => { const ls=[...d.linhas]; ls[i]={...ls[i],nome:e.target.value}; set({linhas:ls}); }} />
            <select style={{...inp,padding:'8px 6px'}} value={l.status}
              onChange={e => { const ls=[...d.linhas]; ls[i]={...ls[i],status:e.target.value as LinhaProducao['status']}; set({linhas:ls}); }}>
              <option value="operando">operando</option>
              <option value="manutenção">manutenção</option>
              <option value="parado">parado</option>
            </select>
            <input style={inp} type="number" min={0} max={100} value={l.pct ?? ''} placeholder="%"
              onChange={e => { const ls=[...d.linhas]; ls[i]={...ls[i],pct:Number(e.target.value)}; set({linhas:ls}); }} />
            <button style={{ ...btn('#ff4d6d','rgba(255,77,109,.1)'), padding:'0 8px' }}
              onClick={() => set({ linhas: d.linhas.filter((_,j) => j!==i) })}>✕</button>
          </div>
        ))}
        <button style={btn()} onClick={() => set({ linhas: [...d.linhas, { nome:`Linha ${String.fromCharCode(65+d.linhas.length)}`, status:'operando', pct:100 }] })}>
          + Adicionar linha
        </button>
      </Field>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EDITOR DE RANKING
// ═════════════════════════════════════════════════════════════════════════════
function RankingEditor({ slide, onChange }: { slide: SlideConfig; onChange: (p: Partial<SlideConfig>) => void }) {
  const d = slide.ranking!;
  const set = (patch: Partial<typeof d>) => onChange({ ranking: { ...d, ...patch } });

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <Field label="Título"><input style={inp} value={d.titulo} onChange={e => set({titulo:e.target.value})} /></Field>
        <Field label="Subtítulo"><input style={inp} value={d.subtitulo} onChange={e => set({subtitulo:e.target.value})} /></Field>
      </div>
      <Field label="Prêmio do mês">
        <input style={inp} value={d.premio??''} onChange={e => set({premio:e.target.value})} placeholder="Descrição do prêmio..." />
      </Field>
      <Field label="Participantes">
        {d.entries.map((e, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 100px 70px 60px 28px', gap:6, marginBottom:6 }}>
            <input style={inp} value={e.nome} placeholder="Nome"
              onChange={ev => { const es=[...d.entries]; es[i]={...es[i],nome:ev.target.value}; set({entries:es}); }} />
            <input style={inp} value={e.setor} placeholder="Setor"
              onChange={ev => { const es=[...d.entries]; es[i]={...es[i],setor:ev.target.value}; set({entries:es}); }} />
            <input style={inp} type="number" value={e.pontos} placeholder="Pts"
              onChange={ev => { const es=[...d.entries]; es[i]={...es[i],pontos:Number(ev.target.value)}; set({entries:es}); }} />
            <input style={inp} type="number" value={e.variacao} placeholder="%"
              onChange={ev => { const es=[...d.entries]; es[i]={...es[i],variacao:Number(ev.target.value)}; set({entries:es}); }} />
            <button style={{ ...btn('#ff4d6d','rgba(255,77,109,.1)'), padding:'0 8px' }}
              onClick={() => set({ entries: d.entries.filter((_,j) => j!==i) })}>✕</button>
          </div>
        ))}
        <button style={btn()} onClick={() => set({ entries: [...d.entries, { nome:'', setor:'', pontos:0, variacao:0 }] })}>
          + Adicionar pessoa
        </button>
      </Field>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EDITOR DE COMUNICADOS
// ═════════════════════════════════════════════════════════════════════════════
function ComunicadoEditor({ slide, onChange }: { slide: SlideConfig; onChange: (p: Partial<SlideConfig>) => void }) {
  const d = slide.comunicado!;
  const set = (patch: Partial<typeof d>) => onChange({ comunicado: { ...d, ...patch } });

  return (
    <Field label="Comunicados">
      {d.items.map((c, i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'110px 1fr 100px 28px', gap:6, marginBottom:6 }}>
          <select style={{...inp,padding:'8px 6px'}} value={c.tipo}
            onChange={e => { const it=[...d.items]; it[i]={...it[i],tipo:e.target.value as Comunicado['tipo']}; set({items:it}); }}>
            {['URGENTE','NOVIDADE','EVENTO','AVISO'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input style={inp} value={c.titulo} placeholder="Título do comunicado"
            onChange={e => { const it=[...d.items]; it[i]={...it[i],titulo:e.target.value}; set({items:it}); }} />
          <input style={inp} value={c.quando} placeholder="Quando"
            onChange={e => { const it=[...d.items]; it[i]={...it[i],quando:e.target.value}; set({items:it}); }} />
          <button style={{ ...btn('#ff4d6d','rgba(255,77,109,.1)'), padding:'0 8px' }}
            onClick={() => set({ items: d.items.filter((_,j) => j!==i) })}>✕</button>
        </div>
      ))}
      <button style={btn()} onClick={() => set({ items:[...d.items,{tipo:'AVISO',titulo:'',quando:'Hoje'}] })}>
        + Adicionar comunicado
      </button>
    </Field>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EDITOR DE CLIMA
// ═════════════════════════════════════════════════════════════════════════════
function ClimaEditor({ slide, onChange }: { slide: SlideConfig; onChange: (p: Partial<SlideConfig>) => void }) {
  const d = slide.clima!;
  const set = (patch: Partial<typeof d>) => onChange({ clima: { ...d, ...patch } });
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
      <Field label="Cidade"><input style={inp} value={d.cidade} onChange={e=>set({cidade:e.target.value})} /></Field>
      <Field label="Condição"><input style={inp} value={d.condicao} onChange={e=>set({condicao:e.target.value})} /></Field>
      <Field label="Temperatura (°C)"><input style={inp} type="number" value={d.temperatura} onChange={e=>set({temperatura:Number(e.target.value)})} /></Field>
      <Field label="Umidade (%)"><input style={inp} type="number" value={d.umidade} onChange={e=>set({umidade:Number(e.target.value)})} /></Field>
      <Field label="Vento (km/h)"><input style={inp} type="number" value={d.vento} onChange={e=>set({vento:Number(e.target.value)})} /></Field>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EDITOR DE METAS
// ═════════════════════════════════════════════════════════════════════════════
function MetasEditor({ slide, onChange }: { slide: SlideConfig; onChange: (p: Partial<SlideConfig>) => void }) {
  const d = slide.metas!;
  const set = (patch: Partial<typeof d>) => onChange({ metas: { ...d, ...patch } });
  return (
    <Field label="Metas do dia">
      {d.items.map((m, i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'28px 1fr 28px', gap:6, marginBottom:6, alignItems:'center' }}>
          <input type="checkbox" checked={m.feito} style={{ width:18,height:18,cursor:'pointer',accentColor:'#00ff88' }}
            onChange={() => { const it=[...d.items]; it[i]={...it[i],feito:!it[i].feito}; set({items:it}); }} />
          <input style={inp} value={m.texto}
            onChange={e => { const it=[...d.items]; it[i]={...it[i],texto:e.target.value}; set({items:it}); }} />
          <button style={{ ...btn('#ff4d6d','rgba(255,77,109,.1)'), padding:'0 8px' }}
            onClick={() => set({ items: d.items.filter((_,j) => j!==i) })}>✕</button>
        </div>
      ))}
      <button style={btn()} onClick={() => set({ items:[...d.items,{texto:'',feito:false}] })}>+ Adicionar meta</button>
    </Field>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SELETOR DE POSTS (blog / jornal)
// ═════════════════════════════════════════════════════════════════════════════
function PostSelector({ slide, tipo, onChange }: { slide: SlideConfig; tipo: 'blog'|'jornal'; onChange: (p: Partial<SlideConfig>) => void }) {
  const [posts,   setPosts]   = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/code-stats',{cache:'no-store'})
      .then(r=>r.json())
      .then(d => { setPosts((d?.posts??[]).filter((p:PostItem)=>p.tipo===tipo)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tipo]);

  const sel = slide.selectedSlugs ?? [];
  const toggle = (slug: string) => {
    const next = sel.includes(slug) ? sel.filter(s=>s!==slug) : [...sel,slug];
    onChange({ selectedSlugs: next });
  };

  if (loading) return <div style={{ color:'rgba(255,255,255,.4)', fontSize:12 }}>Carregando posts...</div>;
  if (!posts.length) return <div style={{ color:'rgba(255,255,255,.3)', fontSize:12 }}>Nenhum {tipo} encontrado na API.</div>;

  return (
    <Field label={`Selecionar ${tipo === 'blog' ? 'posts do blog' : 'edições do jornal'} para exibir`}>
      <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:280, overflowY:'auto' }}>
        {posts.map(p => {
          const active = sel.includes(p.slug);
          return (
            <button key={p.slug} onClick={() => toggle(p.slug)} style={{
              display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
              background: active ? 'rgba(0,212,255,.12)' : 'rgba(255,255,255,.04)',
              border:`1px solid ${active ? 'rgba(0,212,255,.4)' : 'rgba(255,255,255,.08)'}`,
              borderRadius:10, cursor:'pointer', textAlign:'left',
              transition:'all .2s',
            }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{active ? '✅' : '⬜'}</span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.85)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.titulo}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', marginTop:2 }}>{p.category ?? tipo} · {p.date ? new Date(p.date).toLocaleDateString('pt-BR') : '—'}</div>
              </div>
            </button>
          );
        })}
      </div>
    </Field>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EDITOR DE CARD CUSTOMIZADO
// ═════════════════════════════════════════════════════════════════════════════
function CustomEditor({ slide, onChange }: { slide: SlideConfig; onChange: (p: Partial<SlideConfig>) => void }) {
  const d = slide.custom ?? { titulo:'', corpo:'' };
  const set = (patch: Partial<typeof d>) => onChange({ custom: { ...d, ...patch } });
  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <Field label="Título"><input style={inp} value={d.titulo} onChange={e=>set({titulo:e.target.value})} placeholder="Título do card" /></Field>
        <Field label="Subtítulo"><input style={inp} value={d.subtitulo??''} onChange={e=>set({subtitulo:e.target.value})} placeholder="Opcional" /></Field>
      </div>
      <Field label="Corpo do texto">
        <textarea style={{...inp,height:100,resize:'vertical'}} value={d.corpo}
          onChange={e=>set({corpo:e.target.value})} placeholder="Conteúdo principal do card..." />
      </Field>
      <Field label="Rodapé">
        <input style={inp} value={d.rodape??''} onChange={e=>set({rodape:e.target.value})} placeholder="Texto pequeno no rodapé..." />
      </Field>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CARD DO SLIDE NA LISTA
// ═════════════════════════════════════════════════════════════════════════════
function SlideCard({
  slide, index, total, isEditing,
  onEdit, onToggle, onMoveUp, onMoveDown, onDelete, onChange,
}: {
  slide: SlideConfig; index: number; total: number; isEditing: boolean;
  onEdit: () => void; onToggle: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  onDelete: () => void; onChange: (p: Partial<SlideConfig>) => void;
}) {
  const isCustom = slide.type === 'custom' || slide.type === 'blog' || slide.type === 'jornal';

  return (
    <div style={{
      background: 'rgba(255,255,255,.03)',
      border: `1px solid ${isEditing ? slide.color+'80' : 'rgba(255,255,255,.08)'}`,
      borderRadius: 14, overflow:'hidden',
      transition: 'border-color .3s',
      opacity: slide.active ? 1 : 0.5,
    }}>
      {/* ── Header do card ── */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px' }}>
        {/* Drag handle */}
        <div style={{ display:'flex', flexDirection:'column', gap:3, cursor:'grab', padding:'2px 4px', flexShrink:0 }}>
          <button onClick={onMoveUp}   disabled={index===0}       style={{ background:'none',border:'none',color:index===0?'rgba(255,255,255,.1)':'rgba(255,255,255,.4)',cursor:index===0?'default':'pointer',fontSize:10,padding:'1px 4px' }}>▲</button>
          <button onClick={onMoveDown} disabled={index===total-1} style={{ background:'none',border:'none',color:index===total-1?'rgba(255,255,255,.1)':'rgba(255,255,255,.4)',cursor:index===total-1?'default':'pointer',fontSize:10,padding:'1px 4px' }}>▼</button>
        </div>

        {/* Cor */}
        <div style={{ width:10, height:10, borderRadius:'50%', background:slide.color, boxShadow:`0 0 6px ${slide.color}`, flexShrink:0 }}/>

        {/* Info */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,.85)' }}>{slide.icon} {slide.label}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:1, letterSpacing:1 }}>
            {slide.type.toUpperCase()} · SLIDE {index+1}
          </div>
        </div>

        {/* Ações */}
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <button onClick={onEdit} style={{ ...btn(isEditing?slide.color:'rgba(255,255,255,.5)', isEditing?`${slide.color}22`:'rgba(255,255,255,.05)'), padding:'5px 10px' }}>
            {isEditing ? '✕ FECHAR' : '✏️ EDITAR'}
          </button>

          {/* Toggle ativo */}
          <button onClick={onToggle} style={{
            width:44, height:24, borderRadius:12, border:'none', cursor:'pointer',
            background: slide.active ? '#00ff8844' : 'rgba(255,255,255,.08)',
            position:'relative', transition:'background .3s', flexShrink:0,
          }}>
            <div style={{
              position:'absolute', top:3, width:18, height:18, borderRadius:'50%',
              background: slide.active ? '#00ff88' : 'rgba(255,255,255,.3)',
              left: slide.active ? 23 : 3,
              transition:'left .3s, background .3s',
              boxShadow: slide.active ? '0 0 6px #00ff88' : 'none',
            }}/>
          </button>

          {isCustom && (
            <button onClick={onDelete} style={{ ...btn('#ff4d6d','rgba(255,77,109,.1)'), padding:'5px 9px' }}>🗑</button>
          )}
        </div>
      </div>

      {/* ── Editor expandido ── */}
      {isEditing && (
        <div style={{ padding:'0 14px 16px', borderTop:'1px solid rgba(255,255,255,.06)' }}>

          {/* Campos comuns */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 140px', gap:10, margin:'14px 0 10px' }}>
            <Field label="Rótulo do slide">
              <input style={inp} value={slide.label} onChange={e=>onChange({label:e.target.value})} />
            </Field>
            <Field label="Ícone (emoji)">
              <input style={inp} value={slide.icon} onChange={e=>onChange({icon:e.target.value})} maxLength={4} />
            </Field>
            <Field label="Cor de destaque">
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', paddingTop:2 }}>
                {COLORS.map(c => (
                  <button key={c} onClick={()=>onChange({color:c})} style={{
                    width:22,height:22,borderRadius:'50%',background:c,border:'none',cursor:'pointer',
                    boxShadow: slide.color===c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none',
                    transition:'box-shadow .2s',
                  }}/>
                ))}
                <input type="color" value={slide.color} onChange={e=>onChange({color:e.target.value})}
                  style={{ width:22,height:22,padding:0,border:'none',borderRadius:'50%',cursor:'pointer',background:'none' }}/>
              </div>
            </Field>
          </div>

          {/* Editor específico por tipo */}
          {slide.type==='builtin' && slide.id==='producao'  && <ProducaoEditor  slide={slide} onChange={onChange}/>}
          {slide.type==='builtin' && slide.id==='ranking'   && <RankingEditor   slide={slide} onChange={onChange}/>}
          {slide.type==='builtin' && slide.id==='comunicado'&& <ComunicadoEditor slide={slide} onChange={onChange}/>}
          {slide.type==='builtin' && slide.id==='clima'     && <ClimaEditor     slide={slide} onChange={onChange}/>}
          {slide.type==='builtin' && slide.id==='metas'     && <MetasEditor     slide={slide} onChange={onChange}/>}
          {slide.type==='blog'    && <PostSelector slide={slide} tipo="blog"   onChange={onChange}/>}
          {slide.type==='jornal'  && <PostSelector slide={slide} tipo="jornal" onChange={onChange}/>}
          {slide.type==='custom'  && <CustomEditor slide={slide} onChange={onChange}/>}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export default function TvConfigPage() {
  const { slides, loaded, updateSlide, toggleActive, reorder, addSlide, removeSlide, reset } = useTvConfig();
  const [editingId, setEditingId] = useState<string|null>(null);
  const [saved,     setSaved]     = useState(false);
  const [tab,       setTab]       = useState<'slides'|'novo'>('slides');

  // ── Novo card ─────────────────────────────────────────────────────────────
  const [novoTipo,  setNovoTipo]  = useState<'blog'|'jornal'|'custom'>('custom');
  const [novoLabel, setNovoLabel] = useState('');
  const [novoIcon,  setNovoIcon]  = useState('📄');
  const [novoCor,   setNovoCor]   = useState('#00d4ff');

  const criarCard = () => {
    if (!novoLabel.trim()) return;
    const base: SlideConfig = {
      id:     uid(), type: novoTipo,
      label:  novoLabel, icon: novoIcon, color: novoCor,
      active: true, order: slides.length,
    };
    if (novoTipo==='blog'||novoTipo==='jornal') base.selectedSlugs=[];
    if (novoTipo==='custom') base.custom={ titulo:novoLabel, corpo:'' };
    addSlide(base);
    setNovoLabel(''); setTab('slides');
    flash();
  };

  const flash = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  const handleChange = useCallback((id: string, patch: Partial<SlideConfig>) => {
    updateSlide(id, patch);
    flash();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSlide]);

  const activeCount = slides.filter(s=>s.active).length;

  if (!loaded) return (
    <div style={{ minHeight:'100vh', background:'#06040f', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.4)', fontFamily:"'Courier New',monospace" }}>
      Carregando configurações...
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#06040f', color:'#e8e4f0', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(6,4,15,.95)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,.07)', padding:'12px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/tv-empresarial" style={{ textDecoration:'none' }}>
            <div style={{ ...btn('rgba(255,255,255,.5)','rgba(255,255,255,.06)'), padding:'5px 12px', borderRadius:20 }}>← TV</div>
          </Link>
          <span style={{ fontSize:13, fontWeight:800, letterSpacing:2, color:'rgba(255,255,255,.7)', fontFamily:"'Courier New',monospace" }}>
            📺 EDITOR DE PROGRAMAÇÃO
          </span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {saved && (
            <span style={{ fontSize:10, color:'#00ff88', letterSpacing:1, animation:'fadeIn .3s ease', fontFamily:"'Courier New',monospace" }}>
              ✓ SALVO
            </span>
          )}
          <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', fontFamily:"'Courier New',monospace" }}>
            {activeCount}/{slides.length} ativos
          </div>
          <button onClick={() => { if(confirm('Resetar todas as configurações?')) { reset(); flash(); } }}
            style={{ ...btn('#ff4d6d','rgba(255,77,109,.08)'), padding:'5px 12px', borderRadius:20 }}>
            ↺ RESETAR
          </button>
        </div>
      </div>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 16px 60px' }}>

        {/* ── Abas ── */}
        <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:'1px solid rgba(255,255,255,.07)', paddingBottom:0 }}>
          {([['slides','📋 Programação'],['novo','➕ Novo Card']] as const).map(([k,l]) => (
            <button key={k} onClick={()=>setTab(k)} style={{
              padding:'9px 18px', fontSize:12, fontWeight:700, cursor:'pointer',
              border:'none', background:'none',
              borderBottom: tab===k ? '2px solid #00d4ff' : '2px solid transparent',
              color: tab===k ? '#e2e8f0' : 'rgba(255,255,255,.35)',
              transition:'all .2s', fontFamily:"'Courier New',monospace", letterSpacing:1,
            }}>{l}</button>
          ))}
        </div>

        {/* ════ ABA: SLIDES ════ */}
        {tab==='slides' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

            {/* Legenda rápida */}
            <div style={{ display:'flex', gap:12, marginBottom:4, flexWrap:'wrap' }}>
              {[
                { label:'Mover ordem',   hint:'▲▼' },
                { label:'Ativar/Pausar', hint:'Toggle' },
                { label:'Editar dados',  hint:'✏️ EDITAR' },
              ].map(({label,hint}) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:'rgba(255,255,255,.3)' }}>
                  <span style={{ color:'rgba(255,255,255,.5)', fontFamily:'monospace' }}>{hint}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {slides.sort((a,b)=>a.order-b.order).map((slide, i) => (
              <SlideCard
                key={slide.id}
                slide={slide}
                index={i}
                total={slides.length}
                isEditing={editingId===slide.id}
                onEdit={() => setEditingId(editingId===slide.id ? null : slide.id)}
                onToggle={() => { toggleActive(slide.id); flash(); }}
                onMoveUp={()   => { reorder(i, i-1); flash(); }}
                onMoveDown={()  => { reorder(i, i+1); flash(); }}
                onDelete={()   => { if(confirm(`Remover "${slide.label}"?`)) { removeSlide(slide.id); flash(); } }}
                onChange={(patch) => handleChange(slide.id, patch)}
              />
            ))}
          </div>
        )}

        {/* ════ ABA: NOVO CARD ════ */}
        {tab==='novo' && (
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,.7)', marginBottom:18 }}>Criar novo card de programação</div>

            {/* Tipo */}
            <Field label="Tipo de card">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {([
                  ['blog',    '📝', 'Blog',    'Puxa posts reais do blog'],
                  ['jornal',  '📰', 'Jornal',  'Puxa edições do jornal'],
                  ['custom',  '✍️', 'Custom',  'Conteúdo livre editável'],
                ] as const).map(([t,ic,lb,desc]) => (
                  <button key={t} onClick={()=>{ setNovoTipo(t); if(t==='blog')setNovoIcon('📝'); if(t==='jornal')setNovoIcon('📰'); }}
                    style={{
                      flex:1, minWidth:100, padding:'12px 10px',
                      background: novoTipo===t ? 'rgba(0,212,255,.15)' : 'rgba(255,255,255,.04)',
                      border:`1px solid ${novoTipo===t ? 'rgba(0,212,255,.5)' : 'rgba(255,255,255,.1)'}`,
                      borderRadius:10, cursor:'pointer', textAlign:'center',
                    }}>
                    <div style={{ fontSize:18, marginBottom:4 }}>{ic}</div>
                    <div style={{ fontSize:11, fontWeight:700, color: novoTipo===t ? '#00d4ff' : 'rgba(255,255,255,.6)' }}>{lb}</div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,.3)', marginTop:2 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </Field>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 60px', gap:10 }}>
              <Field label="Nome do card">
                <input style={inp} value={novoLabel} onChange={e=>setNovoLabel(e.target.value)} placeholder="Ex: Destaques da semana" />
              </Field>
              <Field label="Ícone">
                <input style={inp} value={novoIcon} onChange={e=>setNovoIcon(e.target.value)} maxLength={4} />
              </Field>
            </div>

            <Field label="Cor de destaque">
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', paddingTop:2 }}>
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>setNovoCor(c)} style={{ width:26,height:26,borderRadius:'50%',background:c,border:'none',cursor:'pointer', boxShadow:novoCor===c?`0 0 0 2px #fff,0 0 0 4px ${c}`:'none',transition:'box-shadow .2s' }}/>
                ))}
              </div>
            </Field>

            <button
              onClick={criarCard}
              disabled={!novoLabel.trim()}
              style={{
                ...btn('#00ff88','rgba(0,255,136,.12)'),
                padding:'10px 24px', borderRadius:10, fontSize:12,
                opacity: novoLabel.trim() ? 1 : 0.4,
                cursor: novoLabel.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              ✦ CRIAR CARD
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(2px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
        input,textarea,select { outline:none; }
        input::placeholder,textarea::placeholder { color:rgba(255,255,255,.2); }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(0,212,255,.3); border-radius:2px; }
      `}</style>
    </div>
  );
}
