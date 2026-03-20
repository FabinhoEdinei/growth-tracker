'use client';

// app/tv-empresarial/canais/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import {
  useChannelConfig,
  CANAIS_DEFAULT,
  type Canal,
  type CanalId,
  type CanalSlide,
} from '@/hooks/useChannelConfig';

// ── Helpers ───────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width:'100%', padding:'8px 12px', boxSizing:'border-box',
  background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)',
  borderRadius:8, color:'#fff', fontSize:13, fontFamily:'inherit', outline:'none',
};

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ display:'block', fontSize:9, color:'rgba(255,255,255,.35)', letterSpacing:1.5, marginBottom:4, fontFamily:"'Courier New',monospace", textTransform:'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

const CORES = ['#a855f7','#00d4ff','#00ff88','#ffd700','#ff8c42','#ff4d6d','#c084fc','#38bdf8','#f472b6','#fb923c'];

// ── Editor de slide ────────────────────────────────────────────────────────────
function SlideEditor({ canal, slide, onChange, onRemove }: {
  canal: Canal; slide: CanalSlide;
  onChange:(patch:Partial<CanalSlide>)=>void; onRemove:()=>void;
}) {
  const [open, setOpen] = useState(false);
  const d = slide.custom ?? { titulo:'', corpo:'' };

  return (
    <div style={{ border:`1px solid ${open?canal.cor+'50':'rgba(255,255,255,.07)'}`, borderRadius:10, overflow:'hidden', marginBottom:6, background:'rgba(255,255,255,.02)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px' }}>
        {/* Toggle ativo */}
        <button onClick={()=>onChange({active:!slide.active})} style={{ width:36,height:20,borderRadius:10,border:'none',cursor:'pointer', background:slide.active?`${canal.cor}44`:'rgba(255,255,255,.08)', position:'relative', transition:'background .2s', flexShrink:0 }}>
          <div style={{ position:'absolute',top:2,width:16,height:16,borderRadius:'50%', background:slide.active?canal.cor:'rgba(255,255,255,.3)', left:slide.active?18:2, transition:'left .2s,background .2s', boxShadow:slide.active?`0 0 6px ${canal.cor}`:'none' }}/>
        </button>

        <span style={{ fontSize:14, flexShrink:0 }}>{slide.icon}</span>
        <span style={{ flex:1, fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:600, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{slide.label}</span>

        <button onClick={()=>setOpen(v=>!v)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.4)', fontSize:11, cursor:'pointer', padding:'2px 6px' }}>
          {open?'▲':'▼'}
        </button>
        <button onClick={onRemove} style={{ background:'rgba(255,77,109,.1)', border:'1px solid rgba(255,77,109,.2)', borderRadius:6, color:'#ff4d6d', fontSize:10, cursor:'pointer', padding:'3px 8px' }}>✕</button>
      </div>

      {open && (
        <div style={{ padding:'0 12px 12px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 50px', gap:8, marginTop:10 }}>
            <Field label="Rótulo"><input style={inp} value={slide.label} onChange={e=>onChange({label:e.target.value})}/></Field>
            <Field label="Ícone"><input style={inp} value={slide.icon} onChange={e=>onChange({icon:e.target.value})} maxLength={4}/></Field>
          </div>
          <Field label="Título do slide"><input style={inp} value={d.titulo} onChange={e=>onChange({custom:{...d,titulo:e.target.value}})}/></Field>
          <Field label="Corpo">
            <textarea style={{...inp,height:72,resize:'vertical'}} value={d.corpo} onChange={e=>onChange({custom:{...d,corpo:e.target.value}})}/>
          </Field>
          <Field label="Rodapé"><input style={inp} value={d.rodape??''} onChange={e=>onChange({custom:{...d,rodape:e.target.value}})} placeholder="Texto pequeno no rodapé..."/></Field>
        </div>
      )}
    </div>
  );
}

// ── Card de canal ──────────────────────────────────────────────────────────────
function CanalCard({ canal, isEditing, onEdit, onToggle, onUpdate, onSlideChange, onSlideRemove, onSlideAdd }: {
  canal: Canal; isEditing: boolean;
  onEdit:()=>void; onToggle:()=>void;
  onUpdate:(patch:Partial<Canal>)=>void;
  onSlideChange:(slideId:string,patch:Partial<CanalSlide>)=>void;
  onSlideRemove:(slideId:string)=>void;
  onSlideAdd:()=>void;
}) {
  return (
    <div style={{ border:`1px solid ${isEditing?canal.cor+'60':'rgba(255,255,255,.08)'}`, borderRadius:14, overflow:'hidden', background:'rgba(255,255,255,.02)', transition:'border-color .3s', opacity:canal.ativo?1:.55 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px' }}>
        {/* Cor */}
        <div style={{ width:10,height:10,borderRadius:'50%',background:canal.cor,boxShadow:`0 0 8px ${canal.cor}`,flexShrink:0 }}/>
        <span style={{ fontSize:18, flexShrink:0 }}>{canal.icone}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13,fontWeight:700,color:'rgba(255,255,255,.85)' }}>{canal.nome}</div>
          <div style={{ fontSize:9,color:'rgba(255,255,255,.3)',fontFamily:"'Courier New',monospace",marginTop:1,letterSpacing:1 }}>
            SIGLA: {canal.sigla} · {canal.slides.filter(s=>s.active).length}/{canal.slides.length} SLIDES ATIVOS
          </div>
        </div>

        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <button onClick={onEdit} style={{ padding:'5px 10px', background:isEditing?`${canal.cor}22`:'rgba(255,255,255,.05)', border:`1px solid ${isEditing?canal.cor+'55':'rgba(255,255,255,.1)'}`, borderRadius:7, color:isEditing?canal.cor:'rgba(255,255,255,.5)', fontSize:10, cursor:'pointer', fontFamily:"'Courier New',monospace", letterSpacing:1 }}>
            {isEditing?'✕ FECHAR':'✏️ EDITAR'}
          </button>
          {/* Toggle */}
          <button onClick={onToggle} style={{ width:44,height:24,borderRadius:12,border:'none',cursor:'pointer', background:canal.ativo?`${canal.cor}44`:'rgba(255,255,255,.08)', position:'relative', transition:'background .3s' }}>
            <div style={{ position:'absolute',top:3,width:18,height:18,borderRadius:'50%', background:canal.ativo?canal.cor:'rgba(255,255,255,.3)', left:canal.ativo?23:3, transition:'left .3s,background .3s', boxShadow:canal.ativo?`0 0 6px ${canal.cor}`:'none' }}/>
          </button>
        </div>
      </div>

      {/* Editor */}
      {isEditing && (
        <div style={{ padding:'0 14px 16px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
          {/* Campos básicos */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 70px 50px', gap:8, margin:'14px 0 10px' }}>
            <Field label="Nome do canal"><input style={inp} value={canal.nome} onChange={e=>onUpdate({nome:e.target.value})}/></Field>
            <Field label="Sigla"><input style={inp} value={canal.sigla} onChange={e=>onUpdate({sigla:e.target.value})} maxLength={4}/></Field>
            <Field label="Ícone"><input style={inp} value={canal.icone} onChange={e=>onUpdate({icone:e.target.value})} maxLength={4}/></Field>
          </div>

          {/* Cor */}
          <Field label="Cor do canal">
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', paddingTop:2 }}>
              {CORES.map(c=>(
                <button key={c} onClick={()=>onUpdate({cor:c})} style={{ width:22,height:22,borderRadius:'50%',background:c,border:'none',cursor:'pointer', boxShadow:canal.cor===c?`0 0 0 2px #fff,0 0 0 4px ${c}`:'none', transition:'box-shadow .2s' }}/>
              ))}
              <input type="color" value={canal.cor} onChange={e=>onUpdate({cor:e.target.value})} style={{ width:22,height:22,padding:0,border:'none',borderRadius:'50%',cursor:'pointer',background:'none' }}/>
            </div>
          </Field>

          {/* Slides */}
          <div style={{ fontSize:10,color:'rgba(255,255,255,.4)',letterSpacing:1.5,marginBottom:8,marginTop:4,fontFamily:"'Courier New',monospace" }}>
            SLIDES DA PROGRAMAÇÃO
          </div>

          {canal.slides.map(slide=>(
            <SlideEditor
              key={slide.id}
              canal={canal}
              slide={slide}
              onChange={patch=>onSlideChange(slide.id,patch)}
              onRemove={()=>onSlideRemove(slide.id)}
            />
          ))}

          <button onClick={onSlideAdd} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:`${canal.cor}12`, border:`1px solid ${canal.cor}40`, borderRadius:8, color:canal.cor, fontSize:11, cursor:'pointer', fontFamily:"'Courier New',monospace", letterSpacing:1, fontWeight:700, marginTop:4 }}>
            + ADICIONAR SLIDE
          </button>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function CanaisPage() {
  const { canais, loaded, updateCanal, updateSlide, addSlide, removeSlide, reset } = useChannelConfig();
  const [editingId, setEditingId] = useState<CanalId|null>(null);
  const [saved,     setSaved]     = useState(false);

  const flash = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  const handleUpdate = (id:CanalId, patch:Partial<Canal>) => { updateCanal(id,patch); flash(); };
  const handleSlide  = (canalId:CanalId, slideId:string, patch:Partial<CanalSlide>) => { updateSlide(canalId,slideId,patch); flash(); };
  const handleRemove = (canalId:CanalId, slideId:string) => { removeSlide(canalId,slideId); flash(); };
  const handleAdd    = (canalId:CanalId) => {
    const canal = canais.find(c=>c.id===canalId);
    if (!canal) return;
    const newSlide: CanalSlide = {
      id:     `${canalId}-${Date.now().toString(36)}`,
      label:  'Novo Slide', icon:'📌',
      active: true, order: canal.slides.length,
      custom: { titulo:'Novo Slide', corpo:'Conteúdo do slide.' },
    };
    addSlide(canalId, newSlide); flash();
  };

  if (!loaded) return (
    <div style={{ minHeight:'100vh', background:'#06040f', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.4)', fontFamily:"'Courier New',monospace" }}>
      Carregando...
    </div>
  );

  const ativos   = canais.filter(c=>c.ativo).length;

  return (
    <div style={{ minHeight:'100vh', background:'#06040f', color:'#e8e4f0', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ position:'sticky',top:0,zIndex:50,background:'rgba(6,4,15,.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(255,255,255,.07)',padding:'12px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/tv-empresarial" style={{ textDecoration:'none' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,padding:'5px 12px',background:'rgba(168,85,247,.10)',border:'1px solid rgba(168,85,247,.30)',borderRadius:20,color:'#c084fc',fontSize:11,cursor:'pointer' }}>← TV</div>
          </Link>
          <span style={{ fontSize:13,fontWeight:800,letterSpacing:2,color:'rgba(255,255,255,.7)',fontFamily:"'Courier New',monospace" }}>
            📡 EDITOR DE CANAIS
          </span>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          {saved && <span style={{ fontSize:10,color:'#00ff88',letterSpacing:1,fontFamily:"'Courier New',monospace" }}>✓ SALVO</span>}
          <div style={{ fontSize:10,color:'rgba(255,255,255,.3)',fontFamily:"'Courier New',monospace" }}>{ativos}/{canais.length} ativos</div>
          <button onClick={()=>{if(confirm('Resetar todos os canais para o padrão?')){reset();flash();}}} style={{ padding:'5px 12px',background:'rgba(255,77,109,.08)',border:'1px solid rgba(255,77,109,.25)',borderRadius:20,color:'#ff4d6d',fontSize:10,cursor:'pointer',fontFamily:"'Courier New',monospace" }}>
            ↺ RESETAR
          </button>
          <Link href="/tv-empresarial/config" style={{ padding:'5px 12px',background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.25)',borderRadius:20,color:'#00d4ff',fontSize:10,textDecoration:'none',fontFamily:"'Courier New',monospace" }}>
            ⚙️ SLIDES
          </Link>
        </div>
      </div>

      <div style={{ maxWidth:720,margin:'0 auto',padding:'24px 16px 60px' }}>

        {/* Guia rápido */}
        <div style={{ padding:'12px 16px',background:'rgba(168,85,247,.06)',border:'1px solid rgba(168,85,247,.15)',borderRadius:12,marginBottom:20,fontSize:11,color:'rgba(255,255,255,.5)',lineHeight:1.7 }}>
          <span style={{ color:'#c084fc',fontWeight:700 }}>Como funciona:</span> Cada canal tem sua programação independente de slides. O seletor lateral na TV (botão com sigla do canal) permite trocar entre eles. Slides desativados não aparecem na TV.
        </div>

        {/* Lista de canais */}
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {canais.map(canal=>(
            <CanalCard
              key={canal.id}
              canal={canal}
              isEditing={editingId===canal.id}
              onEdit={()=>setEditingId(editingId===canal.id?null:canal.id)}
              onToggle={()=>{ handleUpdate(canal.id,{ativo:!canal.ativo}); }}
              onUpdate={patch=>handleUpdate(canal.id,patch)}
              onSlideChange={(sid,patch)=>handleSlide(canal.id,sid,patch)}
              onSlideRemove={sid=>handleRemove(canal.id,sid)}
              onSlideAdd={()=>handleAdd(canal.id)}
            />
          ))}
        </div>
      </div>

      <style>{`
        *{box-sizing:border-box;}
        input,textarea{outline:none;}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,.2);}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,.3);border-radius:2px;}
      `}</style>
    </div>
  );
}
