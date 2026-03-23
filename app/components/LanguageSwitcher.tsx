'use client';

// app/components/LanguageSwitcher.tsx

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { LOCALES, LOCALE_META, type Locale } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = LOCALE_META[locale];

  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      {/* Botão principal */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          padding:'5px 10px',
          background:'rgba(255,255,255,.06)',
          border:'1px solid rgba(255,255,255,.12)',
          borderRadius:20,
          color:'rgba(255,255,255,.7)',
          fontSize:11, cursor:'pointer',
          fontFamily:"'Courier New',monospace",
          letterSpacing:.5,
          display:'flex', alignItems:'center', gap:4,
          backdropFilter:'blur(8px)',
          transition:'all .2s',
        }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.12)';}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.06)';}}
      >
        {current.flag} {current.short}
        <span style={{ fontSize:8, opacity:.5 }}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div style={{ position:'fixed', inset:0, zIndex:98 }} onClick={() => setOpen(false)}/>
          <div style={{
            position:'absolute', top:'calc(100% + 6px)', right:0, zIndex:99,
            background:'rgba(8,6,20,.96)',
            border:'1px solid rgba(255,255,255,.12)',
            borderRadius:12, overflow:'hidden',
            backdropFilter:'blur(12px)',
            boxShadow:'0 8px 32px rgba(0,0,0,.5)',
            minWidth:130,
            animation:'fadeDown .15s ease',
          }}>
            {LOCALES.map(l => {
              const meta = LOCALE_META[l];
              const ativo = l === locale;
              return (
                <button key={l} onClick={() => { setLocale(l); setOpen(false); }} style={{
                  display:'flex', alignItems:'center', width:'100%',
                  padding:'9px 14px',
                  background: ativo ? 'rgba(168,85,247,.15)' : 'transparent',
                  border:'none',
                  borderLeft:`3px solid ${ativo?'#a855f7':'transparent'}`,
                  color: ativo ? '#c084fc' : 'rgba(255,255,255,.65)',
                  fontSize:12, cursor:'pointer', textAlign:'left',
                  fontFamily:"'Courier New',monospace",
                  letterSpacing:.5, transition:'background .15s', gap:8,
                }}
                  onMouseEnter={e=>{if(!ativo)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.06)';}}
                  onMouseLeave={e=>{if(!ativo)(e.currentTarget as HTMLElement).style.background='transparent';}}
                >
                  <span style={{ fontSize:16 }}>{meta.flag}</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700 }}>{meta.label}</div>
                    <div style={{ fontSize:8, opacity:.4 }}>{meta.short}</div>
                  </div>
                  {ativo && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#a855f7', boxShadow:'0 0 6px #a855f7' }}/>}
                </button>
              );
            })}
          </div>
        </>
      )}
      <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
