'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Eye, EyeOff, Download, ShoppingCart,
  RefreshCw, Loader2, CheckCircle, Lock, Unlock,
  FileText, Newspaper, Tv2, Star, Mail, X
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
      {[r1,r2,r3].map((r,i) => <circle key={i} cx={cx} cy={cy} r={r} stroke={i===0?'rgba(168,85,247,0.6)':'rgba(0,255,136,0.4)'} strokeWidth={i===0?1.5:1} filter={glow?'url(#pGlowSoft)':undefined}/>)}
      <circle cx={cx} cy={cy} r={r1*1.08} stroke="rgba(168,85,247,0.3)" strokeWidth={0.8} strokeDasharray="4 6"/>
      <polyline points={estrelaPts} stroke="rgba(0,255,136,0.7)" strokeWidth={1.5} filter={glow?'url(#pGlow)':undefined}/>
      {pontos.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={4} fill={i===0?'#00ff88':i%2===0?'#a855f7':'#00d4ff'} filter={glow?'url(#pGlow)':undefined}/>)}
      {pontos.map(([x,y],i) => { const [nx,ny]=pontos[(i+1)%5]; return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="rgba(168,85,247,0.35)" strokeWidth={0.8}/>; })}
      <circle cx={cx} cy={cy} r={6} fill="rgba(0,255,136,0.4)" stroke="rgba(0,255,136,0.8)" strokeWidth={1} filter={glow?'url(#pGlow)':undefined}/>
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
    <div style={{ background:`rgba(${cor==='#00ff88'?'0,255,136':cor==='#a855f7'?'168,85,247':'0,212,255'},0.08)`, border:`1px solid ${cor}55`, borderRadius:16, padding:'20px 18px', transition:'all 0.3s' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${cor}80`;e.currentTarget.style.boxShadow=`0 8px 32px ${cor}20`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=`${cor}55`;e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Icon size={18} style={{color:cor,filter:`drop-shadow(0 0 4px ${cor})`}}/>
          <span style={{fontSize:13,color:'rgba(255,255,255,0.9)',fontFamily:'Courier New,monospace',fontWeight:600}}>{cfg.label}</span>
        </div>
        <span style={{fontSize:11,background:`${cor}30`,color:cor,padding:'2px 8px',borderRadius:20,fontFamily:'Courier New,monospace',fontWeight:700}}>{cfg.peso}</span>
      </div>
      <div style={{background:'rgba(0,0,0,0.4)',borderRadius:8,padding:'12px 14px',marginBottom:12}}>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.55)',letterSpacing:2,marginBottom:4}}>CÓDIGO DO BLOCO</div>
        <div style={{fontSize:16,fontFamily:'Courier New,monospace',letterSpacing:2,color:codigoVisivel?cor:'transparent',textShadow:codigoVisivel?`0 0 12px ${cor}80`:'none',background:codigoVisivel?'none':`${cor}30`,borderRadius:codigoVisivel?0:4,padding:codigoVisivel?0:'2px 4px',transition:'all 0.4s',userSelect:codigoVisivel?'text':'none'}}>
          {codigoVisivel?bloco.codigo:'••••••'}
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.5)',marginBottom:2}}>POSTS</div>
          <div style={{fontSize:18,fontWeight:700,color:cor,fontFamily:'Courier New,monospace'}}>{bloco.posts.length}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.5)',marginBottom:2}}>CONTRIBUIÇÃO</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.8)',fontFamily:'Courier New,monospace'}}>R$ {bloco.contribuicao.toLocaleString('pt-BR',{minimumFractionDigits:2})}</div>
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
    <div style={{background:vendida?'rgba(168,85,247,0.08)':'rgba(0,255,136,0.06)',border:`1px solid ${cor}40`,borderRadius:16,padding:'16px 14px',transition:'all 0.3s',position:'relative'}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor=`${cor}70`;e.currentTarget.style.boxShadow=`0 8px 24px ${cor}20`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor=`${cor}40`;e.currentTarget.style.boxShadow='none';}}>
      <div style={{position:'absolute',top:10,right:10,display:'flex',alignItems:'center',gap:4,padding:'2px 8px',borderRadius:20,fontSize:9,letterSpacing:1,background:vendida?'rgba(168,85,247,0.25)':'rgba(0,255,136,0.2)',color:cor,border:`1px solid ${cor}50`,fontWeight:700}}>
        {vendida?<Lock size={8}/>:<Unlock size={8}/>}{vendida?'VENDIDA':'DISPONÍVEL'}
      </div>
      <div style={{fontSize:9,color:'rgba(255,255,255,0.55)',marginBottom:8,fontFamily:"'Courier New',monospace"}}>{cota.id} · {new Date(cota.dataGeracao).toLocaleDateString('pt-BR')}</div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:9,color:'rgba(255,255,255,0.5)',letterSpacing:2,marginBottom:3}}>CÓDIGO</div>
        <div style={{fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1,color:vis?cor:'transparent',background:vis?'none':'rgba(255,255,255,0.08)',borderRadius:vis?0:4,padding:vis?0:'3px 6px',transition:'all 0.3s',wordBreak:'break-all',textShadow:vis?`0 0 8px ${cor}60`:'none'}}>
          {vis?cota.codigoCompleto:'••••••••••••••••••••••••••••'}
        </div>
      </div>
      {vendida&&cota.dono&&<div style={{marginBottom:8,padding:'4px 8px',background:'rgba(168,85,247,0.15)',borderRadius:6,fontSize:10,color:'#c084fc',fontFamily:"'Courier New',monospace",fontWeight:600}}>👤 {cota.dono}</div>}

      {/* VALOR com span "ob" */}
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
        <div>
          <div style={{fontSize:9,color:'rgba(255,255,255,0.5)',marginBottom:1}}>VALOR</div>
          <div style={{display:'flex',alignItems:'baseline',gap:4}}>
            <div style={{fontSize:14,fontWeight:700,color:'#00ff88',fontFamily:"'Courier New',monospace"}}>R$3.600</div>
            <span style={{fontSize:8,color:'rgba(0,255,136,0.7)',fontFamily:"'Courier New',monospace",background:'rgba(0,255,136,0.12)',padding:'1px 5px',borderRadius:4,letterSpacing:1,border:'1px solid rgba(0,255,136,0.25)'}}>ob</span>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:9,color:'rgba(255,255,255,0.5)',marginBottom:1}}>POSTS</div>
          <div style={{fontSize:14,fontWeight:700,color:vendida?'#c084fc':'#00d4ff',fontFamily:"'Courier New',monospace"}}>{cota.blocos.reduce((a,b)=>a+b.posts.length,0)}</div>
        </div>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:12}}>
        {cota.blocos.map((b,i)=>(
          <div key={i} style={{flex:1,textAlign:'center',padding:'3px 2px',background:'rgba(0,0,0,0.35)',borderRadius:5,fontSize:8,color:'rgba(255,255,255,0.5)',fontFamily:"'Courier New',monospace"}}>
            <div style={{color:['#00ff88','#a855f7','#00d4ff'][i],fontSize:9,fontWeight:700}}>{b.codigo.slice(0,4)}</div>
            {['BLG','JNL','TV'][i]}
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:5}}>
        <button onClick={()=>setVis(v=>!v)} style={{padding:'6px 8px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:7,color:'rgba(255,255,255,0.7)',cursor:'pointer',display:'flex',alignItems:'center'}}>
          {vis?<EyeOff size={10}/>:<Eye size={10}/>}
        </button>
        <button onClick={()=>onDownload(cota)} style={{flex:1,padding:'6px',background:'rgba(0,212,255,0.12)',border:'1px solid rgba(0,212,255,0.35)',borderRadius:7,color:'#00d4ff',cursor:'pointer',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',gap:4,fontFamily:"'Courier New',monospace",fontWeight:600}}>
          <Download size={9}/> Cert.
        </button>
        {!vendida&&<button onClick={()=>onComprar(cota)} style={{flex:2,padding:'6px 8px',background:'rgba(168,85,247,0.18)',border:'1px solid rgba(168,85,247,0.5)',borderRadius:7,color:'#c084fc',cursor:'pointer',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',gap:4,fontFamily:"'Courier New',monospace",fontWeight:600,transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(168,85,247,0.30)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(168,85,247,0.18)';}}>
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
  const inp:React.CSSProperties={width:'100%',background:'rgba(0,0,0,0.4)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:8,color:'#f0ede8',fontFamily:"'Courier New',monospace",fontSize:13,padding:'10px 14px',outline:'none',boxSizing:'border-box'};
  async function ok(){if(!nome.trim()||!email.trim())return;setEnv(true);await onConfirmar(nome.trim(),email.trim());setEnv(false);}
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.92)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:400,position:'relative',background:'linear-gradient(160deg,#1a0f2e,#0f0820)',border:'1px solid rgba(168,85,247,0.5)',borderRadius:20,padding:28}}>
        <button onClick={onFechar} style={{position:'absolute',top:14,right:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={16}/></button>
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{fontSize:24,marginBottom:6}}>🔮</div>
          <h3 style={{fontFamily:"'Courier New',monospace",fontSize:14,color:'#c084fc',margin:'0 0 3px'}}>Adquirir Token</h3>
          <div style={{fontSize:11,color:'rgba(0,255,136,0.7)',fontFamily:"'Courier New',monospace"}}>{cota.id}</div>
        </div>
        <div style={{textAlign:'center',padding:'10px 0',marginBottom:18,borderTop:'1px solid rgba(168,85,247,0.2)',borderBottom:'1px solid rgba(168,85,247,0.2)'}}>
          <span style={{fontSize:22,fontWeight:900,color:'#00ff88',fontFamily:"'Courier New',monospace"}}>R$ 3.600,00</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:14}}>
          <div><label style={{fontSize:9,color:'rgba(168,85,247,0.8)',letterSpacing:2,display:'block',marginBottom:4}}>NOME *</label>
            <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome ou empresa" style={inp}/>
          </div>
          <div><label style={{fontSize:9,color:'rgba(168,85,247,0.8)',letterSpacing:2,display:'block',marginBottom:4}}>E-MAIL *</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" style={inp}/>
          </div>
        </div>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.45)',marginBottom:16,padding:'8px 10px',background:'rgba(0,0,0,0.3)',borderRadius:6,lineHeight:1.6}}>
          📧 E-mail de confirmação será enviado com o código da cota e valor.
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onFechar} style={{flex:1,padding:'10px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:9,color:'rgba(255,255,255,0.6)',fontSize:12,cursor:'pointer',fontFamily:"'Courier New',monospace"}}>Cancelar</button>
          <button onClick={ok} disabled={!nome.trim()||!email.trim()||env} style={{flex:2,padding:'10px',background:nome&&email?'rgba(168,85,247,0.25)':'rgba(255,255,255,0.06)',border:`1px solid ${nome&&email?'rgba(168,85,247,0.6)':'rgba(255,255,255,0.15)'}`,borderRadius:9,color:nome&&email?'#c084fc':'rgba(255,255,255,0.4)',fontSize:12,cursor:nome&&email?'pointer':'not-allowed',fontFamily:"'Courier New',monospace",display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
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
  const inp:React.CSSProperties={width:'100%',background:'rgba(0,255,136,0.07)',border:'1px solid rgba(0,255,136,0.3)',borderRadius:10,color:'#f0ede8',fontFamily:"'Courier New',monospace",fontSize:14,padding:'10px 14px',outline:'none',boxSizing:'border-box'};
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.9)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:420,background:'linear-gradient(160deg,#1a0f2e,#0f0820)',border:'1px solid rgba(168,85,247,0.5)',borderRadius:20,padding:32,position:'relative'}}>
        <button onClick={onFechar} style={{position:'absolute',top:14,right:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
        <div style={{textAlign:'center',marginBottom:24}}><div style={{fontSize:32,marginBottom:8}}>🔮</div><h2 style={{fontFamily:"'Courier New',monospace",fontSize:18,color:'#c084fc',marginBottom:4}}>Registrar Titular</h2><p style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5,margin:0}}>A cota será vinculada ao nome informado e um certificado será gerado.</p></div>
        <div style={{textAlign:'center',padding:'16px 0',marginBottom:20,borderTop:'1px solid rgba(168,85,247,0.15)',borderBottom:'1px solid rgba(168,85,247,0.15)'}}><span style={{fontSize:28,fontWeight:900,color:'#00ff88',fontFamily:"'Courier New',monospace"}}>R$ 3.600,00</span></div>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
          <div><label style={{fontSize:10,color:'rgba(168,85,247,0.8)',letterSpacing:2,display:'block',marginBottom:6}}>NOME DO TITULAR *</label><input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo ou apelido" style={inp}/></div>
          <div><label style={{fontSize:10,color:'rgba(168,85,247,0.8)',letterSpacing:2,display:'block',marginBottom:6}}>EMPRESA (opcional)</label><input value={empresa} onChange={e=>setEmpresa(e.target.value)} placeholder="Nome da empresa" style={inp}/></div>
        </div>
        {nome&&<div style={{marginBottom:20,padding:'12px 14px',background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.3)',borderRadius:8,fontSize:11,color:'rgba(168,85,247,0.9)',fontFamily:"'Courier New',monospace",textAlign:'center'}}>A cota será registrada em:<br/><span style={{color:'#c084fc',fontSize:14,fontWeight:700}}>{nome.toUpperCase()}</span></div>}
        <div style={{display:'flex',gap:10}}>
          <button onClick={onFechar} style={{flex:1,padding:'12px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:10,color:'rgba(255,255,255,0.6)',fontSize:13,cursor:'pointer',fontFamily:"'Courier New',monospace"}}>Cancelar</button>
          <button onClick={()=>nome.trim()&&onConfirmar(nome.trim(),empresa.trim())} disabled={!nome.trim()} style={{flex:2,padding:'12px',background:nome.trim()?'rgba(168,85,247,0.25)':'rgba(255,255,255,0.06)',border:`1px solid ${nome.trim()?'rgba(168,85,247,0.6)':'rgba(255,255,255,0.15)'}`,borderRadius:10,color:nome.trim()?'#c084fc':'rgba(255,255,255,0.4)',fontSize:13,cursor:nome.trim()?'pointer':'not-allowed',fontFamily:"'Courier New',monospace",display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
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
  const [luzGrade,    setLuzGrade]    = useState(true);
  const [erroToken,   setErroToken]   = useState('');

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

  function baixarTodosCerts() {
    tokensVis.forEach((t, i) => { setTimeout(() => baixarCert(t), i * 350); });
    toast(`${tokensVis.length} certificado(s) sendo baixados!`);
  }

  async function gerarNovoToken() {
    setGerando(true);
    setErroToken('');
    try {
      const res = await fetch('/api/etf-cota');
      if (!res.ok) {
        const txt = await res.text().catch(()=>'');
        throw new Error(`HTTP ${res.status}${txt?' — '+txt.slice(0,80):''}`);
      }
      const data = await res.json();
      // aceita tanto { cota } quanto a cota diretamente
      const nova: CotaETF = data.cota ?? data;
      const novo: CotaETF = {
        ...nova,
        id: `GT${Date.now().toString(36).toUpperCase().slice(-6)}`,
      };
      setHistorico(prev => { const lista=[...prev,novo]; salvarHistorico(lista); return lista; });
      setLuzGrade(true); // garante que a grade fique visível ao gerar
      toast('Novo token gerado! ✦');
    } catch (e: any) {
      const msg = e?.message ?? 'Erro desconhecido';
      setErroToken(msg);
      toast(`Erro: ${msg}`);
    }
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
      const data=await res.json(); setCota(data.cota ?? data); setResumo(data.resumo ?? null);
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

  // ── cores de texto legíveis ───────────────────────────────────────────────
  const txt = {
    label:   'rgba(255,255,255,0.75)',
    muted:   'rgba(255,255,255,0.50)',
    faint:   'rgba(255,255,255,0.35)',
    heading: 'rgba(168,85,247,0.80)',
  };

  return (
    <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at 50% 0%,#1a0832 0%,#0a0514 40%,#000 100%)',color:'#f0ede8',fontFamily:"'Courier New',monospace",position:'relative',overflow:'hidden'}}>

      {/* Fundo */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'15%',left:'50%',transform:'translateX(-50%)',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)',animation:'pulse 6s ease-in-out infinite'}}/>
        <div style={{position:'absolute',bottom:'20%',right:'10%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,136,0.07) 0%,transparent 70%)',animation:'pulse 8s ease-in-out infinite reverse'}}/>
      </div>

      {/* ── Header ── */}
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(5,2,12,0.9)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(168,85,247,0.25)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',gap:8}}>
        <Link href="/" style={{textDecoration:'none',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:30,color:'#c084fc',fontSize:12,cursor:'pointer'}}>
            <ArrowLeft size={14}/><span>Voltar</span>
          </div>
        </Link>
        <span style={{fontSize:11,color:'rgba(168,85,247,0.7)',letterSpacing:3,flexShrink:0}}>✦ PENTÁCULOS ✦</span>
        <div style={{display:'flex',gap:6,flexShrink:0}}>
          <button onClick={gerarNovoToken} disabled={gerando} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 12px',background:'rgba(0,255,136,0.12)',border:'1px solid rgba(0,255,136,0.40)',borderRadius:20,color:'#00ff88',fontSize:11,cursor:'pointer',fontWeight:700}}>
            <RefreshCw size={11} style={{animation:gerando?'spin 1s linear infinite':'none'}}/>{gerando?'..':'+ Token'}
          </button>
          <button onClick={fetchCota} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 12px',background:'rgba(168,85,247,0.10)',border:'1px solid rgba(168,85,247,0.30)',borderRadius:20,color:'#c084fc',fontSize:11,cursor:'pointer'}}>
            <RefreshCw size={11} style={{animation:loading?'spin 1s linear infinite':'none'}}/>Recalc.
          </button>
        </div>
      </div>

      {/* Toasts */}
      {(sucesso||toastMsg) && (
        <div style={{position:'fixed',bottom:30,left:'50%',transform:'translateX(-50%)',zIndex:999,display:'flex',alignItems:'center',gap:8,padding:'12px 24px',background:'rgba(20,10,40,0.95)',border:'1px solid rgba(168,85,247,0.5)',borderRadius:30,color:'#c084fc',fontSize:13,backdropFilter:'blur(12px)',maxWidth:'90vw',textAlign:'center',boxShadow:'0 4px 24px rgba(168,85,247,0.25)'}}>
          <CheckCircle size={15}/> {toastMsg || 'Certificado gerado e baixado!'}
        </div>
      )}

      {/* ── Banner erro token ── */}
      {erroToken && (
        <div style={{position:'fixed',top:64,left:'50%',transform:'translateX(-50%)',zIndex:200,display:'flex',alignItems:'center',gap:8,padding:'10px 18px',background:'rgba(255,60,60,0.12)',border:'1px solid rgba(255,100,100,0.4)',borderRadius:12,color:'#fca5a5',fontSize:11,backdropFilter:'blur(8px)',maxWidth:'90vw',fontFamily:"'Courier New',monospace"}}>
          ⚠ {erroToken}
          <button onClick={()=>setErroToken('')} style={{background:'none',border:'none',color:'#fca5a5',cursor:'pointer',marginLeft:4}}><X size={12}/></button>
        </div>
      )}

      {/* Conteúdo */}
      <div style={{position:'relative',zIndex:10,maxWidth:720,margin:'0 auto',padding:'80px 16px 60px'}}>

        {/* ══ HERO ══ */}
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{display:'inline-block',transform:`rotate(${rotacao}deg)`,filter:'drop-shadow(0 0 30px rgba(168,85,247,0.4))',marginBottom:8}}>
            <PentaculoSVG size={160} glow/>
          </div>
          <h1 style={{fontSize:26,fontWeight:900,letterSpacing:3,margin:'0 0 6px',background:'linear-gradient(135deg,#a855f7,#00d4ff,#00ff88)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            GROWTH TRACKER ETF
          </h1>
          <p style={{fontSize:12,color:'rgba(168,85,247,0.7)',letterSpacing:2,marginBottom:6}}>ATIVO COMPOSTO DIGITAL · SÉRIE {new Date().getFullYear()}</p>
          <p style={{fontSize:13,color:txt.label,maxWidth:440,margin:'0 auto',lineHeight:1.6}}>
            Cada cota representa a soma do conteúdo original — blog, jornal e TV empresarial — convertido em código único.
          </p>
        </div>

        {/* ══ COTA ATUAL ══ */}
        {loading && <div style={{textAlign:'center',padding:40,color:'rgba(168,85,247,0.7)'}}><Loader2 size={32} style={{animation:'spin 1s linear infinite',margin:'0 auto 10px'}}/><p style={{fontSize:13}}>Calculando cota...</p></div>}

        {cotaAtiva && !loading && (
          <>
            <div style={{marginBottom:20,padding:22,background:'linear-gradient(135deg,rgba(168,85,247,0.10),rgba(0,255,136,0.06))',border:'1px solid rgba(168,85,247,0.40)',borderRadius:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:cotaAtiva.status==='vendida'?'#a855f7':'#00ff88',boxShadow:`0 0 8px ${cotaAtiva.status==='vendida'?'#a855f7':'#00ff88'}`,animation:'pulse 2s ease-in-out infinite'}}/>
                  <span style={{fontSize:11,color:txt.label,letterSpacing:2,fontWeight:600}}>{cotaAtiva.status==='vendida'?'TRANSFERIDA':'DISPONÍVEL'}</span>
                </div>
                <span style={{fontSize:11,color:txt.muted}}>v{cotaAtiva.versao}</span>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:11,color:txt.heading,letterSpacing:3,marginBottom:8}}>CÓDIGO DA COTA</div>
                <div style={{fontSize:codigoVisivel?14:17,fontFamily:"'Courier New',monospace",letterSpacing:codigoVisivel?2:5,color:codigoVisivel?'#00ff88':'rgba(255,255,255,0.15)',textShadow:codigoVisivel?'0 0 20px rgba(0,255,136,0.5)':'none',transition:'all 0.5s',marginBottom:14,wordBreak:'break-all',padding:codigoVisivel?0:'8px 0',background:codigoVisivel?'none':'rgba(255,255,255,0.04)',borderRadius:8,userSelect:codigoVisivel?'text':'none'}}>
                  {codigoVisivel?cotaAtiva.codigoCompleto:'•••••••••••••••••••••••••••••'}
                </div>
                <button onClick={()=>setCodigoVisivel(v=>!v)} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 18px',background:'rgba(168,85,247,0.15)',border:'1px solid rgba(168,85,247,0.45)',borderRadius:20,color:'#c084fc',fontSize:12,cursor:'pointer',fontWeight:600}}>
                  {codigoVisivel?<EyeOff size={13}/>:<Eye size={13}/>}{codigoVisivel?'Ocultar':'Ver código'}
                </button>
              </div>
              {cotaAtiva.dono&&<div style={{marginTop:14,padding:'10px 14px',textAlign:'center',background:'rgba(168,85,247,0.10)',borderRadius:10,border:'1px solid rgba(168,85,247,0.3)'}}>
                <div style={{fontSize:10,color:txt.heading,letterSpacing:2,marginBottom:3}}>TITULAR</div>
                <div style={{fontSize:15,color:'#c084fc',fontWeight:700}}>{cotaAtiva.dono.toUpperCase()}</div>
              </div>}
            </div>

            {/* KPIs */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              <div style={{padding:'16px',background:'rgba(0,255,136,0.08)',border:'1px solid rgba(0,255,136,0.30)',borderRadius:16,textAlign:'center'}}>
                <div style={{fontSize:10,color:'rgba(0,255,136,0.7)',letterSpacing:2,marginBottom:5,fontWeight:600}}>VALOR DA COTA</div>
                <div style={{fontSize:22,fontWeight:900,color:'#00ff88',fontFamily:"'Courier New',monospace"}}>R$ 3.600</div>
              </div>
              <div style={{padding:'16px',background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.30)',borderRadius:16,textAlign:'center'}}>
                <div style={{fontSize:10,color:'rgba(168,85,247,0.7)',letterSpacing:2,marginBottom:5,fontWeight:600}}>POSTS BASE</div>
                <div style={{fontSize:22,fontWeight:900,color:'#c084fc',fontFamily:"'Courier New',monospace"}}>{resumo?resumo.postsBlog+resumo.postsJornal:'—'}</div>
              </div>
            </div>

            {/* Blocos */}
            <div style={{marginBottom:20}}>
              <h2 style={{fontSize:11,letterSpacing:3,color:txt.heading,marginBottom:12,display:'flex',alignItems:'center',gap:8,fontWeight:700}}><Star size={11}/> COMPOSIÇÃO</h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr',gap:10}}>
                {cotaAtiva.blocos.map((b,i)=><BlocoCard key={i} bloco={b} codigoVisivel={codigoVisivel}/>)}
              </div>
            </div>

            {cotaAtiva.status!=='vendida'&&(
              <button onClick={()=>setModalAberto(true)} style={{width:'100%',padding:'16px',background:'linear-gradient(135deg,rgba(168,85,247,0.22),rgba(0,255,136,0.10))',border:'1px solid rgba(168,85,247,0.50)',borderRadius:16,color:'#c084fc',fontFamily:"'Courier New',monospace",fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,letterSpacing:2,transition:'all 0.3s',marginBottom:16}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 0 40px rgba(168,85,247,0.30)';e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
                <ShoppingCart size={16}/> REGISTRAR TITULAR E GERAR CERTIFICADO
              </button>
            )}
            {cotaAtiva.status==='vendida'&&(
              <button onClick={()=>baixarCert(cotaAtiva)} style={{width:'100%',padding:'12px',background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:14,color:'#c084fc',fontFamily:"'Courier New',monospace",fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:16,fontWeight:600}}>
                <Download size={13}/> Baixar certificado novamente
              </button>
            )}
          </>
        )}

        {/* ══ GRADE DE TOKENS ══ */}
        <div style={{marginTop:36}}>

          {/* Cabeçalho da grade */}
          <div style={{marginBottom:14}}>
            {/* Linha 1: título + toggle */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <h2 style={{fontSize:12,letterSpacing:3,color:txt.heading,margin:0,display:'flex',alignItems:'center',gap:8,fontWeight:700}}>
                ✦ TOKENS EMITIDOS
                <span style={{fontSize:10,background:'rgba(168,85,247,0.25)',color:'#c084fc',padding:'2px 8px',borderRadius:12,fontWeight:700}}>{historico.length}</span>
              </h2>

              {/* Toggle LUZ DA GRADE */}
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:10,color:luzGrade?'rgba(0,255,136,0.8)':'rgba(255,255,255,0.35)',fontFamily:"'Courier New',monospace",letterSpacing:1,fontWeight:600}}>
                  {luzGrade?'ON':'OFF'}
                </span>
                <button
                  onClick={()=>setLuzGrade(v=>!v)}
                  title={luzGrade?'Desligar grade':'Ligar grade'}
                  style={{
                    position:'relative',
                    width:48, height:26,
                    borderRadius:13,
                    border:`2px solid ${luzGrade?'rgba(0,255,136,0.6)':'rgba(255,255,255,0.2)'}`,
                    background:luzGrade?'rgba(0,255,136,0.18)':'rgba(255,255,255,0.06)',
                    cursor:'pointer',
                    transition:'all 0.3s',
                    padding:0,
                    flexShrink:0,
                  }}
                >
                  <div style={{
                    position:'absolute',
                    top:3,
                    left: luzGrade ? 24 : 3,
                    width:16, height:16,
                    borderRadius:'50%',
                    background:luzGrade?'#00ff88':'rgba(255,255,255,0.35)',
                    boxShadow:luzGrade?'0 0 10px rgba(0,255,136,0.9)':'none',
                    transition:'all 0.3s',
                  }}/>
                </button>
                <span style={{fontSize:9,color:txt.muted,fontFamily:"'Courier New',monospace",letterSpacing:1}}>
                  GRADE
                </span>
              </div>
            </div>

            {/* Linha 2: filtros (linha separada para não cortar no mobile) */}
            {luzGrade && (
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {(['todos','disponivel','vendida'] as const).map(f=>(
                  <button key={f} onClick={()=>setFiltroGrade(f)} style={{padding:'5px 12px',borderRadius:20,fontSize:10,cursor:'pointer',background:filtroGrade===f?'rgba(168,85,247,0.25)':'rgba(255,255,255,0.07)',border:`1px solid ${filtroGrade===f?'rgba(168,85,247,0.60)':'rgba(255,255,255,0.18)'}`,color:filtroGrade===f?'#c084fc':txt.label,fontFamily:"'Courier New',monospace",letterSpacing:1,transition:'all 0.2s',fontWeight:filtroGrade===f?700:400}}>
                    {f==='todos'?`TODOS (${historico.length})`:f==='disponivel'?`DISP. (${totalDisp})`:`VEND. (${totalVend})`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conteúdo condicional */}
          {!luzGrade ? (
            <div style={{textAlign:'center',padding:'48px 20px',border:'1px dashed rgba(255,255,255,0.10)',borderRadius:16}}>
              <div style={{fontSize:40,marginBottom:10,filter:'grayscale(1)',opacity:0.35}}>🔮</div>
              <p style={{fontSize:12,color:txt.muted,fontFamily:"'Courier New',monospace",letterSpacing:2,margin:0}}>GRADE DESLIGADA</p>
              <p style={{fontSize:11,color:txt.faint,marginTop:6,marginBottom:0}}>Ligue o toggle para visualizar os tokens</p>
            </div>

          ) : historico.length===0 ? (
            <div style={{textAlign:'center',padding:'40px 20px',color:txt.muted,fontSize:13,border:'1px dashed rgba(168,85,247,0.20)',borderRadius:16}}>
              <div style={{fontSize:32,marginBottom:10}}>🔮</div>
              <p>Nenhum token ainda — clique em <strong style={{color:'#00ff88'}}>+ Token</strong> para gerar</p>
            </div>

          ) : (
            <>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14}}>
                {tokensVis.map(t=>(
                  <TokenCard key={t.id} cota={t} onComprar={setModalToken} onDownload={baixarCert}/>
                ))}
              </div>

              {/* Rodapé grade */}
              <div style={{marginTop:16,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,padding:'14px 18px',background:'rgba(0,0,0,0.30)',border:'1px solid rgba(168,85,247,0.20)',borderRadius:14}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:10,color:txt.muted,letterSpacing:2,fontFamily:"'Courier New',monospace",fontWeight:600}}>QUANTIDADE TOTAL</span>
                  <span style={{fontSize:20,fontWeight:900,color:'#00ff88',fontFamily:"'Courier New',monospace",textShadow:'0 0 10px rgba(0,255,136,0.5)',lineHeight:1}}>{historico.length}</span>
                  <span style={{fontSize:10,color:txt.faint,fontFamily:"'Courier New',monospace"}}>· R$ {(historico.length*3600).toLocaleString('pt-BR')}</span>
                </div>
                <button
                  onClick={baixarTodosCerts}
                  disabled={tokensVis.length===0}
                  style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:'rgba(0,212,255,0.12)',border:'1px solid rgba(0,212,255,0.40)',borderRadius:10,color:'#00d4ff',fontSize:11,cursor:tokensVis.length?'pointer':'not-allowed',fontFamily:"'Courier New',monospace",letterSpacing:1,fontWeight:700,transition:'all 0.2s',opacity:tokensVis.length?1:0.4}}
                  onMouseEnter={e=>{if(tokensVis.length){e.currentTarget.style.background='rgba(0,212,255,0.20)';e.currentTarget.style.boxShadow='0 0 16px rgba(0,212,255,0.25)';}}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,212,255,0.12)';e.currentTarget.style.boxShadow='none';}}
                >
                  <Download size={11}/> DOWNLOAD ({tokensVis.length})
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cotaAtiva&&!loading&&(
          <div style={{textAlign:'center',marginTop:28,fontSize:11,color:txt.faint}}>
            <p>Cota calculada em {new Date(cotaAtiva.dataGeracao).toLocaleString('pt-BR')}</p>
          </div>
        )}
      </div>

      {/* Modais */}
      {modalAberto&&cota&&<ModalCompra cota={cota} onConfirmar={handleComprar} onFechar={()=>setModalAberto(false)}/>}
      {modalToken&&<ModalCompraToken cota={modalToken} onConfirmar={handleComprarToken} onFechar={()=>setModalToken(null)}/>}

      <style jsx global>{`
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.97)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(168,85,247,0.3); border-radius:99px; }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}
