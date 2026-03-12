'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Eye, EyeOff, Download, ShoppingCart,
  RefreshCw, Loader2, CheckCircle, Lock, Unlock,
  FileText, Newspaper, Tv2, Star, Mail, X, Filter
} from 'lucide-react';
import type { CotaETF, BlocoETF } from '@/lib/etf-cota-engine';
import { gerarCertificadoHTML, venderCota } from '@/lib/etf-cota-engine';

// ── localStorage ──────────────────────────────────────────────────────────────
const HISTORICO_KEY = 'gt_tokens_historico';
function carregarHistorico(): CotaETF[] {
  try { const r = localStorage.getItem(HISTORICO_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function salvarHistorico(lista: CotaETF[]) {
  try { localStorage.setItem(HISTORICO_KEY, JSON.stringify(lista)); } catch {}
}

// ── Pentáculo SVG ─────────────────────────────────────────────────────────────
function PentaculoSVG({ size = 180, glow = false }: { size?: number; glow?: boolean }) {
  const cx = size / 2, cy = size / 2;
  const r1 = size * 0.45, r2 = size * 0.35, r3 = size * 0.18;
  const pontos = Array.from({ length: 5 }, (_, i) => {
    const ang = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return [cx + r1 * Math.cos(ang), cy + r1 * Math.sin(ang)];
  });
  const estrela = [0,2,4,1,3,0].map(i => pontos[i]);
  const estrelaPts = estrela.map(p => p.join(',')).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {glow && <defs>
        <filter id="pGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="pGlowSoft"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>}
      {[r1,r2,r3].map((r,i) => <circle key={i} cx={cx} cy={cy} r={r} stroke={i===0?'rgba(168,85,247,0.35)':'rgba(0,255,136,0.2)'} strokeWidth={i===0?1:0.75} filter={glow?'url(#pGlowSoft)':undefined}/>)}
      <circle cx={cx} cy={cy} r={r1*1.08} stroke="rgba(168,85,247,0.15)" strokeWidth={0.5} strokeDasharray="4 6"/>
      <polyline points={estrelaPts} stroke="rgba(0,255,136,0.5)" strokeWidth={1} filter={glow?'url(#pGlow)':undefined}/>
      {pontos.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={3} fill={i===0?'#00ff88':i%2===0?'#a855f7':'#00d4ff'} filter={glow?'url(#pGlow)':undefined}/>)}
      {pontos.map(([x,y],i) => { const [nx,ny]=pontos[(i+1)%5]; return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="rgba(168,85,247,0.2)" strokeWidth={0.5}/>; })}
      <circle cx={cx} cy={cy} r={5} fill="rgba(0,255,136,0.3)" stroke="rgba(0,255,136,0.6)" strokeWidth={0.75} filter={glow?'url(#pGlow)':undefined}/>
      {['✦','⬡','◈','⬟','✧'].map((rune,i) => {
        const ang=(Math.PI*2*i)/5-Math.PI/2;
        return <text key={i} x={cx+r2*0.62*Math.cos(ang)} y={cy+r2*0.62*Math.sin(ang)+4} textAnchor="middle" fontSize={size*0.04} fill="rgba(168,85,247,0.3)" fontFamily="monospace">{rune}</text>;
      })}
    </svg>
  );
}

// ── BlocoCard ─────────────────────────────────────────────────────────────────
const BLOCO_CFG = {
  blog:   { icon: FileText,  cor: '#00ff88', label: 'Blog',           peso: '40%' },
  jornal: { icon: Newspaper, cor: '#a855f7', label: 'Jornal',         peso: '35%' },
  tv:     { icon: Tv2,       cor: '#00d4ff', label: 'TV Empresarial', peso: '25%' },
};

function BlocoCard({ bloco, codigoVisivel }: { bloco: BlocoETF; codigoVisivel: boolean }) {
  const cfg = BLOCO_CFG[bloco.tipo];
  const Icon = cfg.icon;
  const cor = cfg.cor;
  return (
    <div style={{ background:`rgba(${cor==='#00ff88'?'0,255,136':cor==='#a855f7'?'168,85,247':'0,212,255'},0.05)`, border:`1px solid ${cor}25`, borderRadius:16, padding:'20px 18px', transition:'all 0.3s' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${cor}50`;e.currentTarget.style.boxShadow=`0 8px 32px ${cor}15`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=`${cor}25`;e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Icon size={18} style={{color:cor,filter:`drop-shadow(0 0 4px ${cor})`}}/>
          <span style={{fontSize:13,color:'rgba(255,255,255,0.7)',fontFamily:'Courier New,monospace'}}>{cfg.label}</span>
        </div>
        <span style={{fontSize:11,background:`${cor}20`,color:cor,padding:'2px 8px',borderRadius:20,fontFamily:'Courier New,monospace'}}>{cfg.peso}</span>
      </div>
      <div style={{background:'rgba(0,0,0,0.3)',borderRadius:8,padding:'12px 14px',marginBottom:12}}>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:2,marginBottom:4}}>CÓDIGO DO BLOCO</div>
        <div style={{fontSize:16,fontFamily:'Courier New,monospace',letterSpacing:2,color:codigoVisivel?cor:'transparent',textShadow:codigoVisivel?`0 0 12px ${cor}80`:'none',background:codigoVisivel?'none':`${cor}30`,borderRadius:codigoVisivel?0:4,padding:codigoVisivel?0:'2px 4px',transition:'all 0.4s',userSelect:codigoVisivel?'text':'none'}}>
          {codigoVisivel?bloco.codigo:'••••••'}
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginBottom:2}}>POSTS</div>
          <div style={{fontSize:18,fontWeight:700,color:cor,fontFamily:'Courier New,monospace'}}>{bloco.posts.length}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginBottom:2}}>CONTRIBUIÇÃO</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',fontFamily:'Courier New,monospace'}}>R$ {bloco.contribuicao.toLocaleString('pt-BR',{minimumFractionDigits:2})}</div>
        </div>
      </div>
    </div>
  );
}

// ── TokenCard (grade) ─────────────────────────────────────────────────────────
function TokenCard({ cota, onComprar, onDownload }: { cota: CotaETF; onComprar:(c:CotaETF)=>void; onDownload:(c:CotaETF)=>void }) {
  const [vis, setVis] = useState(false);
  const vendida = cota.status === 'vendida';
  const cor = vendida ? '#a855f7' : '#00ff88';
  return (
    <div style={{background:vendida?'rgba(168,85,247,0.05)':'rgba(0,255,136,0.04)',border:`1px solid ${cor}22`,borderRadius:16,padding:'16px 14px',transition:'all 0.3s',position:'relative'}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor=`${cor}45`;e.currentTarget.style.boxShadow=`0 8px 24px ${cor}12`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor=`${cor}22`;e.currentTarget.style.boxShadow='none';}}>
      <div style={{position:'absolute',top:10,right:10,display:'flex',alignItems:'center',gap:4,padding:'2px 8px',borderRadius:20,fontSize:9,letterSpacing:1,background:vendida?'rgba(168,85,247,0.15)':'rgba(0,255,136,0.12)',color:cor,border:`1px solid ${cor}30`}}>
        {vendida?<Lock size={8}/>:<Unlock size={8}/>}{vendida?'VENDIDA':'DISPONÍVEL'}
      </div>
      <div style={{fontSize:9,color:'rgba(255,255,255,0.25)',marginBottom:8,fontFamily:"'Courier New',monospace"}}>{cota.id} · {new Date(cota.dataGeracao).toLocaleDateString('pt-BR')}</div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:9,color:'rgba(255,255,255,0.2)',letterSpacing:2,marginBottom:3}}>CÓDIGO</div>
        <div style={{fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1,color:vis?cor:'transparent',background:vis?'none':'rgba(255,255,255,0.05)',borderRadius:vis?0:4,padding:vis?0:'3px 6px',transition:'all 0.3s',wordBreak:'break-all',textShadow:vis?`0 0 8px ${cor}60`:'none'}}>
          {vis?cota.codigoCompleto:'••••••••••••••••••••••••••••'}
        </div>
      </div>
      {vendida&&cota.dono&&<div style={{marginBottom:8,padding:'4px 8px',background:'rgba(168,85,247,0.08)',borderRadius:6,fontSize:10,color:'#a855f7',fontFamily:"'Courier New',monospace"}}>👤 {cota.dono}</div>}

      {/* ── VALOR com span "ob" (rascunho) ── */}
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
        <div>
          <div style={{fontSize:9,color:'rgba(255,255,255,0.2)',marginBottom:1}}>VALOR</div>
          <div style={{display:'flex',alignItems:'baseline',gap:4}}>
            <div style={{fontSize:14,fontWeight:700,color:'#00ff88',fontFamily:"'Courier New',monospace"}}>R$3.600</div>
            <span style={{
              fontSize:8,
              color:'rgba(0,255,136,0.45)',
              fontFamily:"'Courier New',monospace",
              background:'rgba(0,255,136,0.07)',
              padding:'1px 5px',
              borderRadius:4,
              letterSpacing:1,
              border:'1px solid rgba(0,255,136,0.12)',
            }}>ob</span>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:9,color:'rgba(255,255,255,0.2)',marginBottom:1}}>POSTS</div>
          <div style={{fontSize:14,fontWeight:700,color:vendida?'#a855f7':'#00d4ff',fontFamily:"'Courier New',monospace"}}>{cota.blocos.reduce((a,b)=>a+b.posts.length,0)}</div>
        </div>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:12}}>
        {cota.blocos.map((b,i)=>(
          <div key={i} style={{flex:1,textAlign:'center',padding:'3px 2px',background:'rgba(0,0,0,0.25)',borderRadius:5,fontSize:8,color:'rgba(255,255,255,0.25)',fontFamily:"'Courier New',monospace"}}>
            <div style={{color:['#00ff88','#a855f7','#00d4ff'][i],fontSize:9,fontWeight:700}}>{b.codigo.slice(0,4)}</div>
            {['BLG','JNL','TV'][i]}
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:5}}>
        <button onClick={()=>setVis(v=>!v)} style={{padding:'6px 8px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,color:'rgba(255,255,255,0.35)',cursor:'pointer',display:'flex',alignItems:'center'}}>
          {vis?<EyeOff size={10}/>:<Eye size={10}/>}
        </button>
        <button onClick={()=>onDownload(cota)} style={{flex:1,padding:'6px',background:'rgba(0,212,255,0.07)',border:'1px solid rgba(0,212,255,0.18)',borderRadius:7,color:'#00d4ff',cursor:'pointer',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',gap:4,fontFamily:"'Courier New',monospace"}}>
          <Download size={9}/> Cert.
        </button>
        {!vendida&&<button onClick={()=>onComprar(cota)} style={{flex:2,padding:'6px 8px',background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:7,color:'#a855f7',cursor:'pointer',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',gap:4,fontFamily:"'Courier New',monospace",transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(168,85,247,0.22)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(168,85,247,0.12)';}}>
          <ShoppingCart size={9}/> Comprar
        </button>}
      </div>
    </div>
  );
}

// ── Modal compra com e-mail ───────────────────────────────────────────────────
function ModalCompraToken({ cota, onConfirmar, onFechar }: { cota:CotaETF; onConfirmar:(d:string,e:string)=>Promise<void>; onFechar:()=>void }) {
  const [nome,setNome]=useState('');
  const [email,setEmail]=useState('');
  const [env,setEnv]=useState(false);
  const inp:React.CSSProperties={width:'100%',background:'rgba(0,0,0,0.4)',border:'1px solid rgba(168,85,247,0.25)',borderRadius:8,color:'#f0ede8',fontFamily:"'Courier New',monospace",fontSize:13,padding:'10px 14px',outline:'none',boxSizing:'border-box'};
  async function ok(){if(!nome.trim()||!email.trim())return;setEnv(true);await onConfirmar(nome.trim(),email.trim());setEnv(false);}
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:400,position:'relative',background:'linear-gradient(160deg,#1a0f2e,#0f0820)',border:'1px solid rgba(168,85,247,0.4)',borderRadius:20,padding:28,animation:'fadeInUp 0.3s ease-out'}}>
        <button onClick={onFechar} style={{position:'absolute',top:14,right:14,background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer'}}><X size={16}/></button>
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{fontSize:24,marginBottom:6}}>🔮</div>
          <h3 style={{fontFamily:"'Courier New',monospace",fontSize:14,color:'#a855f7',margin:'0 0 3px'}}>Adquirir Token</h3>
          <div style={{fontSize:11,color:'rgba(0,255,136,0.5)',fontFamily:"'Courier New',monospace"}}>{cota.id}</div>
        </div>
        <div style={{textAlign:'center',padding:'10px 0',marginBottom:18,borderTop:'1px solid rgba(168,85,247,0.1)',borderBottom:'1px solid rgba(168,85,247,0.1)'}}>
          <span style={{fontSize:22,fontWeight:900,color:'#00ff88',fontFamily:"'Courier New',monospace"}}>R$ 3.600,00</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:14}}>
          <div><label style={{fontSize:9,color:'rgba(168,85,247,0.5)',letterSpacing:2,display:'block',marginBottom:4}}>NOME *</label>
            <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome ou empresa" style={inp} onFocus={e=>{e.target.style.borderColor='rgba(168,85,247,0.6)';}} onBlur={e=>{e.target.style.borderColor='rgba(168,85,247,0.25)';}}/>
          </div>
          <div><label style={{fontSize:9,color:'rgba(168,85,247,0.5)',letterSpacing:2,display:'block',marginBottom:4}}>E-MAIL *</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" style={inp} onFocus={e=>{e.target.style.borderColor='rgba(168,85,247,0.6)';}} onBlur={e=>{e.target.style.borderColor='rgba(168,85,247,0.25)';}}/>
          </div>
        </div>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.22)',marginBottom:16,padding:'8px 10px',background:'rgba(0,0,0,0.2)',borderRadius:6,lineHeight:1.6}}>
          📧 E-mail de confirmação será enviado com o código da cota e valor.
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onFechar} style={{flex:1,padding:'10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,color:'rgba(255,255,255,0.4)',fontSize:12,cursor:'pointer',fontFamily:"'Courier New',monospace"}}>Cancelar</button>
          <button onClick={ok} disabled={!nome.trim()||!email.trim()||env} style={{flex:2,padding:'10px',background:nome&&email?'rgba(168,85,247,0.2)':'rgba(255,255,255,0.04)',border:`1px solid ${nome&&email?'rgba(168,85,247,0.5)':'rgba(255,255,255,0.1)'}`,borderRadius:9,color:nome&&email?'#a855f7':'rgba(255,255,255,0.3)',fontSize:12,cursor:nome&&email?'pointer':'not-allowed',fontFamily:"'Courier New',monospace",display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
            {env?<><Loader2 size={12} style={{animation:'spin 1s linear infinite'}}/> Enviando...</>:<><Mail size={12}/> Confirmar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal compra cota principal ───────────────────────────────────────────────
function ModalCompra({ cota, onConfirmar, onFechar }: { cota:CotaETF; onConfirmar:(d:string,e:string)=>void; onFechar:()=>void }) {
  const [nome,setNome]=useState('');
  const [empresa,setEmpresa]=useState('');
  const inp:React.CSSProperties={width:'100%',background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',borderRadius:10,color:'#f0ede8',fontFamily:"'Courier New',monospace",fontSize:14,padding:'10px 14px',outline:'none',boxSizing:'border-box'};
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:420,background:'linear-gradient(160deg,#1a0f2e,#0f0820)',border:'1px solid rgba(168,85,247,0.4)',borderRadius:20,padding:32,animation:'fadeInUp 0.3s ease-out',position:'relative'}}>
        <button onClick={onFechar} style={{position:'absolute',top:14,right:14,background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer'}}><X size={18}/></button>
        <div style={{textAlign:'center',marginBottom:24}}><div style={{fontSize:32,marginBottom:8}}>🔮</div><h2 style={{fontFamily:"'Courier New',monospace",fontSize:18,color:'#a855f7',marginBottom:4}}>Registrar Titular</h2><p style={{fontSize:12,color:'rgba(255,255,255,0.35)',lineHeight:1.5,margin:0}}>A cota será vinculada ao nome informado e um certificado será gerado.</p></div>
        <div style={{textAlign:'center',padding:'16px 0',marginBottom:20,borderTop:'1px solid rgba(168,85,247,0.1)',borderBottom:'1px solid rgba(168,85,247,0.1)'}}><span style={{fontSize:28,fontWeight:900,color:'#00ff88',fontFamily:"'Courier New',monospace",textShadow:'0 0 16px rgba(0,255,136,0.4)'}}>R$ 3.600,00</span></div>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
          <div><label style={{fontSize:10,color:'rgba(168,85,247,0.5)',letterSpacing:2,display:'block',marginBottom:6}}>NOME DO TITULAR *</label><input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo ou apelido" style={inp} onFocus={e=>{e.target.style.borderColor='rgba(168,85,247,0.5)';}} onBlur={e=>{e.target.style.borderColor='rgba(0,255,136,0.2)';}} /></div>
          <div><label style={{fontSize:10,color:'rgba(168,85,247,0.5)',letterSpacing:2,display:'block',marginBottom:6}}>EMPRESA (opcional)</label><input value={empresa} onChange={e=>setEmpresa(e.target.value)} placeholder="Nome da empresa" style={inp} onFocus={e=>{e.target.style.borderColor='rgba(168,85,247,0.5)';}} onBlur={e=>{e.target.style.borderColor='rgba(0,255,136,0.2)';}} /></div>
        </div>
        {nome&&<div style={{marginBottom:20,padding:'12px 14px',background:'rgba(168,85,247,0.06)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:8,fontSize:11,color:'rgba(168,85,247,0.7)',fontFamily:"'Courier New',monospace",textAlign:'center'}}>A cota será registrada em:<br/><span style={{color:'#a855f7',fontSize:14,fontWeight:700}}>{nome.toUpperCase()}</span></div>}
        <div style={{display:'flex',gap:10}}>
          <button onClick={onFechar} style={{flex:1,padding:'12px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer',fontFamily:"'Courier New',monospace"}}>Cancelar</button>
          <button onClick={()=>nome.trim()&&onConfirmar(nome.trim(),empresa.trim())} disabled={!nome.trim()} style={{flex:2,padding:'12px',background:nome.trim()?'rgba(168,85,247,0.2)':'rgba(255,255,255,0.05)',border:`1px solid ${nome.trim()?'rgba(168,85,247,0.5)':'rgba(255,255,255,0.1)'}`,borderRadius:10,color:nome.trim()?'#a855f7':'rgba(255,255,255,0.3)',fontSize:13,cursor:nome.trim()?'pointer':'not-allowed',fontFamily:"'Courier New',monospace",display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <Download size={14}/> Gerar Certificado
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA PRINCIPAL ──────────────────────────────────────────────────────────
export default function PentaculosPage() {
  const [cota,          setCota]          = useState<CotaETF | null>(null);
  const [resumo,        setResumo]        = useState<{postsBlog:number;postsJornal:number}|null>(null);
  const [loading,       setLoading]       = useState(true);
  const [codigoVisivel, setCodigoVisivel] = useState(false);
  const [modalAberto,   setModalAberto]   = useState(false);
  const [cotaFinal,     setCotaFinal]     = useState<CotaETF | null>(null);
  const [sucesso,       setSucesso]       = useState(false);
  const [rotacao,       setRotacao]       = useState(0);
  const rafRef = useRef<number>(0);

  // grade
  const [historico,   setHistorico]   = useState<CotaETF[]>([]);
  const [filtroGrade, setFiltroGrade] = useState<'todos'|'disponivel'|'vendida'>('todos');
  const [modalToken,  setModalToken]  = useState<CotaETF | null>(null);
  const [gerando,     setGerando]     = useState(false);
  const [toastMsg,    setToastMsg]    = useState('');

  // ── NOVO: toggle visibilidade da grade ────────────────────────────────────
  const [luzGrade, setLuzGrade] = useState(true);

  useEffect(() => { setHistorico(carregarHistorico()); }, []);

  function toast(msg: string) { setToastMsg(msg); setTimeout(()=>setToastMsg(''), 3500); }

  function baixarCert(c: CotaETF) {
    const html=gerarCertificadoHTML(c);
    const blob=new Blob([html],{type:'text/html;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`certificado-${c.id}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  // ── NOVO: baixar todos os certificados visíveis ───────────────────────────
  function baixarTodosCerts() {
    tokensVis.forEach((t, i) => {
      setTimeout(() => baixarCert(t), i * 350);
    });
    toast(`${tokensVis.length} certificado(s) sendo baixados!`);
  }

  async function gerarNovoToken() {
    setGerando(true);
    try {
      const res=await fetch('/api/etf-cota'); if(!res.ok)throw new Error();
      const {cota:nova}=await res.json();
      const novo:CotaETF={...nova,id:`GT${Date.now().toString(36).toUpperCase().slice(-6)}`};
      setHistorico(prev=>{const lista=[...prev,novo];salvarHistorico(lista);return lista;});
      toast('Novo token gerado!');
    } catch { toast('Erro ao gerar token.'); }
    setGerando(false);
  }

  async function handleComprarToken(dono: string, email: string) {
    if(!modalToken)return;
    const cv:CotaETF={...modalToken,status:'vendida',dono,dataVenda:new Date().toISOString()};
    setHistorico(prev=>{const lista=prev.map(t=>t.id===modalToken.id?cv:t);salvarHistorico(lista);return lista;});
    await fetch('/api/etf-email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({para:email,dono,codigo:cv.codigoCompleto,valor:'R$ 3.600,00',id:cv.id,data:new Date().toLocaleDateString('pt-BR')})}).catch(()=>{});
    baixarCert(cv);
    setModalToken(null);
    toast(`Token adquirido! E-mail enviado para ${email}`);
  }

  const tokensVis = historico.filter(t=>filtroGrade==='todos'?true:t.status===filtroGrade);
  const totalDisp = historico.filter(t=>t.status!=='vendida').length;
  const totalVend = historico.filter(t=>t.status==='vendida').length;

  // rotação pentáculo
  useEffect(() => {
    let angle=0;
    const animar=()=>{angle+=0.1;setRotacao(angle);rafRef.current=requestAnimationFrame(animar);};
    rafRef.current=requestAnimationFrame(animar);
    return()=>cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => { fetchCota(); }, []);

  async function fetchCota() {
    setLoading(true);
    try {
      const res=await fetch('/api/etf-cota'); if(!res.ok)throw new Error();
      const data=await res.json(); setCota(data.cota); setResumo(data.resumo);
    } catch { setCota(null); }
    setLoading(false);
  }

  function handleComprar(dono: string, _empresa: string) {
    if(!cota)return;
    const cv=venderCota(cota,dono,_empresa||undefined);
    setCotaFinal(cv); setModalAberto(false);
    baixarCert(cv);
    setHistorico(prev=>{const lista=[...prev,cv];salvarHistorico(lista);return lista;});
    setSucesso(true); setTimeout(()=>setSucesso(false),2500);
  }

  const cotaAtiva = cotaFinal ?? cota;

  return (
    <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at 50% 0%,#1a0832 0%,#0a0514 40%,#000 100%)',color:'#f0ede8',fontFamily:"'Courier New',monospace",position:'relative',overflow:'hidden'}}>

      {/* Fundo */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'15%',left:'50%',transform:'translateX(-50%)',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)',animation:'pulse 6s ease-in-out infinite'}}/>
        <div style={{position:'absolute',bottom:'20%',right:'10%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,136,0.07) 0%,transparent 70%)',animation:'pulse 8s ease-in-out infinite reverse'}}/>
        <div style={{position:'absolute',inset:0,opacity:0.02,backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 17.3 L60 34.7 L30 52 L0 34.7 L0 17.3 Z' fill='none' stroke='%23a855f7' stroke-width='0.5'/%3E%3C/svg%3E")`,backgroundSize:'60px 52px'}}/>
      </div>

      {/* Header */}
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(5,2,12,0.85)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(168,85,247,0.15)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px'}}>
        <Link href="/" style={{textDecoration:'none'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 16px',background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:30,color:'#a855f7',fontSize:13,cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(168,85,247,0.15)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(168,85,247,0.08)';}}>
            <ArrowLeft size={15}/><span>Voltar</span>
          </div>
        </Link>
        <span style={{fontSize:12,color:'rgba(168,85,247,0.5)',letterSpacing:3}}>✦ PENTÁCULOS ✦</span>
        <div style={{display:'flex',gap:8}}>
          <button onClick={gerarNovoToken} disabled={gerando} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(0,255,136,0.08)',border:'1px solid rgba(0,255,136,0.25)',borderRadius:20,color:'#00ff88',fontSize:12,cursor:'pointer'}}>
            <RefreshCw size={12} style={{animation:gerando?'spin 1s linear infinite':'none'}}/>{gerando?'Gerando...':'+ Token'}
          </button>
          <button onClick={fetchCota} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:20,color:'#a855f7',fontSize:12,cursor:'pointer'}}>
            <RefreshCw size={12} style={{animation:loading?'spin 1s linear infinite':'none'}}/>Recalcular
          </button>
        </div>
      </div>

      {/* Toasts */}
      {(sucesso||toastMsg) && (
        <div style={{position:'fixed',bottom:30,left:'50%',transform:'translateX(-50%)',zIndex:999,display:'flex',alignItems:'center',gap:8,padding:'12px 24px',background:'rgba(168,85,247,0.15)',border:'1px solid rgba(168,85,247,0.4)',borderRadius:30,color:'#a855f7',fontSize:13,backdropFilter:'blur(12px)',animation:'fadeInUp 0.3s ease-out',maxWidth:'90vw',textAlign:'center'}}>
          <CheckCircle size={15}/> {toastMsg || 'Certificado gerado e baixado!'}
        </div>
      )}

      {/* Conteúdo */}
      <div style={{position:'relative',zIndex:10,maxWidth:720,margin:'0 auto',padding:'80px 20px 60px'}}>

        {/* ══ HERO ══ */}
        <div style={{textAlign:'center',marginBottom:36,animation:'fadeInDown 0.8s ease-out'}}>
          <div style={{display:'inline-block',transform:`rotate(${rotacao}deg)`,filter:'drop-shadow(0 0 30px rgba(168,85,247,0.3))',marginBottom:8}}>
            <PentaculoSVG size={160} glow/>
          </div>
          <h1 style={{fontSize:28,fontWeight:900,letterSpacing:3,margin:'0 0 6px',background:'linear-gradient(135deg,#a855f7,#00d4ff,#00ff88)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            GROWTH TRACKER ETF
          </h1>
          <p style={{fontSize:12,color:'rgba(168,85,247,0.5)',letterSpacing:2,marginBottom:6}}>ATIVO COMPOSTO DIGITAL · SÉRIE {new Date().getFullYear()}</p>
          <p style={{fontSize:13,color:'rgba(255,255,255,0.35)',maxWidth:440,margin:'0 auto'}}>
            Cada cota representa a soma do conteúdo original — blog, jornal e TV empresarial — convertido em código único.
          </p>
        </div>

        {/* ══ COTA ATUAL ══ */}
        {loading && <div style={{textAlign:'center',padding:40,color:'rgba(168,85,247,0.5)'}}><Loader2 size={32} style={{animation:'spin 1s linear infinite',margin:'0 auto 10px'}}/><p style={{fontSize:13}}>Calculando cota...</p></div>}

        {cotaAtiva && !loading && (
          <>
            <div style={{marginBottom:20,padding:22,background:'linear-gradient(135deg,rgba(168,85,247,0.08),rgba(0,255,136,0.05))',border:'1px solid rgba(168,85,247,0.3)',borderRadius:20,animation:'fadeInUp 0.6s ease-out 0.1s both'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:cotaAtiva.status==='vendida'?'#a855f7':'#00ff88',boxShadow:`0 0 8px ${cotaAtiva.status==='vendida'?'#a855f7':'#00ff88'}`,animation:'pulse 2s ease-in-out infinite'}}/>
                  <span style={{fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:2}}>{cotaAtiva.status==='vendida'?'TRANSFERIDA':'DISPONÍVEL'}</span>
                </div>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>v{cotaAtiva.versao}</span>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:11,color:'rgba(168,85,247,0.5)',letterSpacing:3,marginBottom:8}}>CÓDIGO DA COTA</div>
                <div style={{fontSize:codigoVisivel?14:17,fontFamily:"'Courier New',monospace",letterSpacing:codigoVisivel?2:5,color:codigoVisivel?'#00ff88':'rgba(255,255,255,0.15)',textShadow:codigoVisivel?'0 0 20px rgba(0,255,136,0.5)':'none',transition:'all 0.5s',marginBottom:14,wordBreak:'break-all',padding:codigoVisivel?0:'8px 0',background:codigoVisivel?'none':'rgba(255,255,255,0.03)',borderRadius:8,userSelect:codigoVisivel?'text':'none'}}>
                  {codigoVisivel?cotaAtiva.codigoCompleto:'•••••••••••••••••••••••••••••'}
                </div>
                <button onClick={()=>setCodigoVisivel(v=>!v)} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 18px',background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.3)',borderRadius:20,color:'#a855f7',fontSize:12,cursor:'pointer'}}>
                  {codigoVisivel?<EyeOff size={13}/>:<Eye size={13}/>}{codigoVisivel?'Ocultar':'Ver código'}
                </button>
              </div>
              {cotaAtiva.dono&&<div style={{marginTop:14,padding:'10px 14px',textAlign:'center',background:'rgba(168,85,247,0.08)',borderRadius:10,border:'1px solid rgba(168,85,247,0.2)'}}>
                <div style={{fontSize:10,color:'rgba(168,85,247,0.5)',letterSpacing:2,marginBottom:3}}>TITULAR</div>
                <div style={{fontSize:15,color:'#a855f7',fontWeight:700}}>{cotaAtiva.dono.toUpperCase()}</div>
              </div>}
            </div>

            {/* KPIs */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20,animation:'fadeInUp 0.6s ease-out 0.2s both'}}>
              <div style={{padding:'16px',background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.15)',borderRadius:16,textAlign:'center'}}>
                <div style={{fontSize:10,color:'rgba(0,255,136,0.4)',letterSpacing:2,marginBottom:5}}>VALOR DA COTA</div>
                <div style={{fontSize:22,fontWeight:900,color:'#00ff88',fontFamily:"'Courier New',monospace"}}>R$ 3.600</div>
              </div>
              <div style={{padding:'16px',background:'rgba(168,85,247,0.05)',border:'1px solid rgba(168,85,247,0.15)',borderRadius:16,textAlign:'center'}}>
                <div style={{fontSize:10,color:'rgba(168,85,247,0.4)',letterSpacing:2,marginBottom:5}}>POSTS BASE</div>
                <div style={{fontSize:22,fontWeight:900,color:'#a855f7',fontFamily:"'Courier New',monospace"}}>{resumo?resumo.postsBlog+resumo.postsJornal:'—'}</div>
              </div>
            </div>

            {/* Blocos */}
            <div style={{marginBottom:20,animation:'fadeInUp 0.6s ease-out 0.3s both'}}>
              <h2 style={{fontSize:11,letterSpacing:3,color:'rgba(168,85,247,0.4)',marginBottom:12,display:'flex',alignItems:'center',gap:8}}><Star size={11}/> COMPOSIÇÃO</h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr',gap:10}}>
                {cotaAtiva.blocos.map((b,i)=><BlocoCard key={i} bloco={b} codigoVisivel={codigoVisivel}/>)}
              </div>
            </div>

            {/* Botão comprar cota atual */}
            {cotaAtiva.status!=='vendida'&&(
              <button onClick={()=>setModalAberto(true)} style={{width:'100%',padding:'16px',background:'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(0,255,136,0.1))',border:'1px solid rgba(168,85,247,0.4)',borderRadius:16,color:'#a855f7',fontFamily:"'Courier New',monospace",fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,letterSpacing:2,transition:'all 0.3s',marginBottom:16}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 0 40px rgba(168,85,247,0.25)';e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
                <ShoppingCart size={16}/> REGISTRAR TITULAR E GERAR CERTIFICADO
              </button>
            )}
            {cotaAtiva.status==='vendida'&&(
              <button onClick={()=>baixarCert(cotaAtiva)} style={{width:'100%',padding:'12px',background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:14,color:'#a855f7',fontFamily:"'Courier New',monospace",fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:16}}>
                <Download size={13}/> Baixar certificado novamente
              </button>
            )}
          </>
        )}

        {/* ══ GRADE DE TOKENS ══ */}
        <div style={{marginTop:36}}>

          {/* Cabeçalho da grade */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:10}}>
            <h2 style={{fontSize:12,letterSpacing:3,color:'rgba(168,85,247,0.5)',margin:0,display:'flex',alignItems:'center',gap:8}}>
              ✦ TOKENS EMITIDOS
              <span style={{fontSize:10,background:'rgba(168,85,247,0.15)',color:'#a855f7',padding:'2px 8px',borderRadius:12}}>{historico.length}</span>
            </h2>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
              {/* Filtros */}
              {(['todos','disponivel','vendida'] as const).map(f=>(
                <button key={f} onClick={()=>setFiltroGrade(f)} style={{padding:'4px 12px',borderRadius:20,fontSize:10,cursor:'pointer',background:filtroGrade===f?'rgba(168,85,247,0.2)':'rgba(255,255,255,0.04)',border:`1px solid ${filtroGrade===f?'rgba(168,85,247,0.5)':'rgba(255,255,255,0.08)'}`,color:filtroGrade===f?'#a855f7':'rgba(255,255,255,0.35)',fontFamily:"'Courier New',monospace",letterSpacing:1,transition:'all 0.2s'}}>
                  {f==='todos'?`TODOS (${historico.length})`:f==='disponivel'?`DISP. (${totalDisp})`:`VEND. (${totalVend})`}
                </button>
              ))}

              {/* ── TOGGLE "LUZ DA GRADE" ── */}
              <button
                onClick={()=>setLuzGrade(v=>!v)}
                title={luzGrade?'Desligar grade':'Ligar grade'}
                style={{
                  position:'relative',
                  width:44, height:24,
                  borderRadius:12,
                  border:`1px solid ${luzGrade?'rgba(0,255,136,0.4)':'rgba(255,255,255,0.12)'}`,
                  background:luzGrade?'rgba(0,255,136,0.15)':'rgba(255,255,255,0.04)',
                  cursor:'pointer',
                  transition:'all 0.3s',
                  flexShrink:0,
                }}
              >
                <div style={{
                  position:'absolute',
                  top:3,
                  left: luzGrade ? 22 : 3,
                  width:16, height:16,
                  borderRadius:'50%',
                  background:luzGrade?'#00ff88':'rgba(255,255,255,0.25)',
                  boxShadow:luzGrade?'0 0 8px rgba(0,255,136,0.8)':'none',
                  transition:'all 0.3s',
                }}/>
              </button>
              <span style={{fontSize:10,color:luzGrade?'rgba(0,255,136,0.6)':'rgba(255,255,255,0.2)',fontFamily:"'Courier New',monospace",letterSpacing:1,minWidth:52}}>
                {luzGrade?'LUZ ON':'LUZ OFF'}
              </span>
            </div>
          </div>

          {/* ── Conteúdo condicional ── */}
          {!luzGrade ? (
            /* Estado OFF → ícone público */
            <div style={{textAlign:'center',padding:'48px 20px',border:'1px dashed rgba(255,255,255,0.06)',borderRadius:16,animation:'fadeIn 0.4s ease-out'}}>
              <div style={{fontSize:40,marginBottom:10,filter:'grayscale(1)',opacity:0.3}}>🔮</div>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.18)',fontFamily:"'Courier New',monospace",letterSpacing:2,margin:0}}>
                GRADE DESLIGADA
              </p>
              <p style={{fontSize:10,color:'rgba(255,255,255,0.1)',marginTop:6,marginBottom:0}}>
                Ligue para visualizar os tokens
              </p>
            </div>

          ) : historico.length===0 ? (
            <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(168,85,247,0.3)',fontSize:13,border:'1px dashed rgba(168,85,247,0.1)',borderRadius:16}}>
              <div style={{fontSize:32,marginBottom:10}}>🔮</div>
              <p>Nenhum token ainda — clique em <strong style={{color:'#00ff88'}}>+ Token</strong> para gerar</p>
            </div>

          ) : (
            <>
              {/* Cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14}}>
                {tokensVis.map(t=>(
                  <TokenCard key={t.id} cota={t} onComprar={setModalToken} onDownload={baixarCert}/>
                ))}
              </div>

              {/* ── Rodapé da grade: Quantidade Total + Download ── */}
              <div style={{
                marginTop:18,
                display:'flex',
                alignItems:'center',
                justifyContent:'space-between',
                flexWrap:'wrap',
                gap:10,
                padding:'14px 18px',
                background:'rgba(0,0,0,0.25)',
                border:'1px solid rgba(168,85,247,0.12)',
                borderRadius:14,
              }}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:2,fontFamily:"'Courier New',monospace"}}>
                    QUANTIDADE TOTAL
                  </span>
                  <span style={{
                    fontSize:20,
                    fontWeight:900,
                    color:'#00ff88',
                    fontFamily:"'Courier New',monospace",
                    textShadow:'0 0 10px rgba(0,255,136,0.4)',
                    lineHeight:1,
                  }}>
                    {historico.length}
                  </span>
                  <span style={{fontSize:10,color:'rgba(255,255,255,0.18)',fontFamily:"'Courier New',monospace"}}>
                    · R$ {(historico.length*3600).toLocaleString('pt-BR')}
                  </span>
                </div>

                <button
                  onClick={baixarTodosCerts}
                  disabled={tokensVis.length===0}
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:6,
                    padding:'8px 18px',
                    background:'rgba(0,212,255,0.08)',
                    border:'1px solid rgba(0,212,255,0.28)',
                    borderRadius:10,
                    color:'#00d4ff',
                    fontSize:11,
                    cursor:tokensVis.length?'pointer':'not-allowed',
                    fontFamily:"'Courier New',monospace",
                    letterSpacing:1,
                    transition:'all 0.2s',
                    opacity:tokensVis.length?1:0.4,
                  }}
                  onMouseEnter={e=>{if(tokensVis.length){e.currentTarget.style.background='rgba(0,212,255,0.16)';e.currentTarget.style.boxShadow='0 0 16px rgba(0,212,255,0.2)';}}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,212,255,0.08)';e.currentTarget.style.boxShadow='none';}}
                >
                  <Download size={11}/> DOWNLOAD ({tokensVis.length})
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cotaAtiva&&!loading&&(
          <div style={{textAlign:'center',marginTop:28,fontSize:11,color:'rgba(255,255,255,0.18)'}}>
            <p>Cota calculada em {new Date(cotaAtiva.dataGeracao).toLocaleString('pt-BR')}</p>
          </div>
        )}
      </div>

      {/* Modais */}
      {modalAberto&&cota&&<ModalCompra cota={cota} onConfirmar={handleComprar} onFechar={()=>setModalAberto(false)}/>}
      {modalToken&&<ModalCompraToken cota={modalToken} onConfirmar={handleComprarToken} onFechar={()=>setModalToken(null)}/>}

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
