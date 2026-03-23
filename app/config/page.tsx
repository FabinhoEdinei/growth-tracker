'use client';
// app/configuracoes/page.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LOCALES, LOCALE_META, COOKIE_NAME, type Locale } from '@/lib/i18n';

function Section({ title, icon, children }: { title:string; icon:string; children:React.ReactNode }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span style={{ fontSize:14 }}>{icon}</span>
        <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:900, color:'rgba(0,212,255,.6)', letterSpacing:2, textTransform:'uppercase' }}>{title}</span>
        <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(0,212,255,.2),transparent)', marginLeft:4 }}/>
      </div>
      {children}
    </div>
  );
}

function NavBtn({ href, icon, label, badge, badgeColor, sub }: { href:string; icon:string; label:string; badge?:string; badgeColor?:string; sub?:string }) {
  return (
    <Link href={href} style={{ textDecoration:'none', display:'block', marginBottom:8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:14, cursor:'pointer', transition:'all .2s' }}
        onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,.08)'; el.style.borderColor='rgba(0,212,255,.2)'; }}
        onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,.04)'; el.style.borderColor='rgba(255,255,255,.08)'; }}
      >
        <div style={{ fontSize:22, width:44, height:44, borderRadius:12, background:'rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,.88)', fontFamily:"'Courier New',monospace", letterSpacing:.5 }}>{label}</div>
          {sub && <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', marginTop:2 }}>{sub}</div>}
        </div>
        {badge && <span style={{ padding:'3px 10px', borderRadius:20, fontSize:9, fontWeight:900, fontFamily:"'Courier New',monospace", letterSpacing:1, background:`${badgeColor}22`, border:`1px solid ${badgeColor}55`, color:badgeColor }}>{badge}</span>}
        <span style={{ color:'rgba(255,255,255,.2)', fontSize:12 }}>›</span>
      </div>
    </Link>
  );
}

export default function ConfigPage() {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>('pt');
  const [saved,  setSaved]       = useState(false);
  const [buildDate, setBuildDate] = useState('');

  useEffect(() => {
    // ✅ Lê cookie gt_locale
    const cookie = document.cookie.split(';')
      .map(c=>c.trim()).find(c=>c.startsWith(`${COOKIE_NAME}=`))?.split('=')[1] as Locale|undefined;
    if (cookie && LOCALES.includes(cookie)) setLocaleState(cookie);
    setBuildDate(new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' }));
  }, []);

  const handleLocale = (code: Locale) => {
    setLocaleState(code);
    // ✅ Salva como COOKIE — servidor lê em toda requisição
    document.cookie = `${COOKIE_NAME}=${code}; path=/; max-age=31536000; SameSite=Lax`;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#0a0614 0%,#06030f 100%)', color:'#e8e4f4', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", paddingBottom:60 }}>

      <div style={{ position:'relative', zIndex:1, maxWidth:480, margin:'0 auto', padding:'0 16px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'20px 0 24px', position:'sticky', top:0, zIndex:10, background:'linear-gradient(180deg,rgba(10,6,20,.98) 80%,transparent)', backdropFilter:'blur(8px)' }}>
          <button onClick={()=>router.push('/')} style={{ width:38,height:38,borderRadius:10,border:'1px solid rgba(255,255,255,.12)',background:'rgba(255,255,255,.06)',color:'rgba(255,255,255,.6)',fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
          <div>
            <h1 style={{ margin:0, fontSize:18, fontWeight:900, color:'#fff', fontFamily:"'Courier New',monospace", letterSpacing:2 }}>⚙️ CONFIGURAÇÕES</h1>
            <div style={{ fontSize:9, color:'rgba(0,212,255,.5)', letterSpacing:2, marginTop:2, fontFamily:"'Courier New',monospace" }}>GROWTH TRACKER · SISTEMA</div>
          </div>
          {saved && (
            <div style={{ marginLeft:'auto', fontSize:9, color:'#00ff88', fontFamily:"'Courier New',monospace", letterSpacing:1, display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ width:6,height:6,borderRadius:'50%',background:'#00ff88',display:'inline-block' }}/>
              SALVO
            </div>
          )}
        </div>

        {/* ════ IDIOMA ════ */}
        <Section title="Idioma do App" icon="🌐">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {LOCALES.map(code => {
              const meta  = LOCALE_META[code];
              const ativo = locale === code;
              return (
                <button key={code} onClick={()=>handleLocale(code)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:ativo?'rgba(0,212,255,.1)':'rgba(255,255,255,.03)', border:`1.5px solid ${ativo?'rgba(0,212,255,.5)':'rgba(255,255,255,.07)'}`, borderRadius:12, cursor:'pointer', textAlign:'left', transition:'all .2s', boxShadow:ativo?'0 0 16px rgba(0,212,255,.1)':'none' }}>
                  <span style={{ fontSize:22, lineHeight:1 }}>{meta.flag}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:ativo?'#00d4ff':'rgba(255,255,255,.75)', fontFamily:"'Courier New',monospace" }}>{meta.label}</div>
                    <div style={{ fontSize:8, color:'rgba(255,255,255,.3)', marginTop:1 }}>{meta.short}</div>
                  </div>
                  {ativo && <div style={{ marginLeft:'auto', width:8,height:8,borderRadius:'50%',background:'#00d4ff',boxShadow:'0 0 8px #00d4ff',flexShrink:0 }}/>}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(0,212,255,.04)', border:'1px solid rgba(0,212,255,.1)', borderRadius:8, fontSize:10, color:'rgba(0,212,255,.5)', fontFamily:"'Courier New',monospace", lineHeight:1.6 }}>
            ℹ️ Salvo como cookie — funciona no Jornal, Blog e TV sem recarregar.
          </div>
        </Section>

        {/* ════ FERRAMENTAS ════ */}
        <Section title="Ferramentas" icon="🛠️">
          <NavBtn href="/testes"                  icon="🧪" label="Página de Testes"      badge="DEV"  badgeColor="#ff4d6d" sub="Rotas HTTP, ETF Engine, segurança"/>
          <NavBtn href="/tv-empresarial/config"   icon="📺" label="TV · Editor de Slides" sub="Editar programação dos slides"/>
          <NavBtn href="/tv-empresarial/canais"   icon="📡" label="TV · Editor de Canais" sub="RH, QA, ENG, PCP, SEG, GG"/>
        </Section>

        {/* ════ SOBRE ════ */}
        <Section title="Informações do App" icon="ℹ️">
          <div style={{ padding:'16px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14 }}>
            {[
              { label:'App',       value:'Growth Tracker'             },
              { label:'Versão',    value:'0.1.0'                      },
              { label:'Build',     value:buildDate                    },
              { label:'Framework', value:'Next.js 16 · App Router'   },
              { label:'Deploy',    value:'Vercel · iad1'              },
              { label:'Repo',      value:'FabinhoEdinei/growth-tracker'},
            ].map((row,i,arr)=>(
              <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,.05)':'none' }}>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:1 }}>{row.label.toUpperCase()}</span>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, color:'rgba(255,255,255,.65)' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <a href="https://github.com/FabinhoEdinei/growth-tracker" target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:8, padding:'10px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10, textDecoration:'none', color:'rgba(255,255,255,.4)', fontSize:11, fontFamily:"'Courier New',monospace", transition:'all .2s' }}
            onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,.07)'; el.style.color='rgba(255,255,255,.7)'; }}
            onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,.03)'; el.style.color='rgba(255,255,255,.4)'; }}
          >
            ⬡ github.com/FabinhoEdinei/growth-tracker
          </a>
        </Section>

        {/* ════ AVANÇADO ════ */}
        <Section title="Avançado" icon="⚠️">
          <button onClick={()=>{
            if(confirm('Limpar todas as preferências salvas?')){
              ['gt_locale','gt_tv_config_v2','gt_tv_config_version','gt_canais_v1','gt_canais_version'].forEach(k=>localStorage.removeItem(k));
              // Remove cookie de idioma
              document.cookie=`${COOKIE_NAME}=; path=/; max-age=0`;
              window.location.reload();
            }
          }} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'12px 16px', background:'rgba(255,77,109,.05)', border:'1px solid rgba(255,77,109,.15)', borderRadius:12, cursor:'pointer', color:'#ff4d6d', textAlign:'left', transition:'all .2s' }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='rgba(255,77,109,.12)'; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='rgba(255,77,109,.05)'; }}
          >
            <span style={{ fontSize:18 }}>🗑️</span>
            <div>
              <div style={{ fontFamily:"'Courier New',monospace", fontSize:12, fontWeight:700 }}>Limpar Cache Local</div>
              <div style={{ fontSize:10, color:'rgba(255,77,109,.6)', marginTop:2 }}>Remove idioma, config da TV e canais salvos</div>
            </div>
          </button>
        </Section>

      </div>
    </div>
  );
}
