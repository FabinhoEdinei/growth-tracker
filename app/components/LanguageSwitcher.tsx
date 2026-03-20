'use client';

// app/components/LanguageSwitcher.tsx
// Botão flutuante de troca de idioma
// Adicionar no layout principal ou em qualquer página

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      {/* Botão principal */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          padding:       '5px 10px',
          background:    'rgba(255,255,255,.06)',
          border:        '1px solid rgba(255,255,255,.12)',
          borderRadius:  20,
          color:         'rgba(255,255,255,.7)',
          fontSize:      11,
          cursor:        'pointer',
          fontFamily:    "'Courier New',monospace",
          letterSpacing: 0.5,
          display:       'flex',
          alignItems:    'center',
          gap:           4,
          backdropFilter:'blur(8px)',
          transition:    'all .2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.12)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.06)'; }}
      >
        {LOCALE_LABELS[locale]} <span style={{ fontSize:8, opacity:.5 }}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Overlay para fechar */}
          <div style={{ position:'fixed', inset:0, zIndex:98 }} onClick={() => setOpen(false)}/>

          <div style={{
            position:   'absolute',
            top:        'calc(100% + 6px)',
            right:      0,
            zIndex:     99,
            background: 'rgba(8,6,20,.96)',
            border:     '1px solid rgba(255,255,255,.12)',
            borderRadius:12,
            overflow:   'hidden',
            backdropFilter:'blur(12px)',
            boxShadow:  '0 8px 32px rgba(0,0,0,.5)',
            minWidth:   120,
            animation:  'fadeDown .15s ease',
          }}>
            {LOCALES.map(l => (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false); }}
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  width:      '100%',
                  padding:    '9px 14px',
                  background: l === locale ? 'rgba(168,85,247,.15)' : 'transparent',
                  border:     'none',
                  borderLeft: `3px solid ${l===locale?'#a855f7':'transparent'}`,
                  color:      l === locale ? '#c084fc' : 'rgba(255,255,255,.65)',
                  fontSize:   12,
                  cursor:     'pointer',
                  textAlign:  'left',
                  fontFamily: "'Courier New',monospace",
                  letterSpacing: 0.5,
                  transition: 'background .15s',
                }}
                onMouseEnter={e => { if(l!==locale)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.06)'; }}
                onMouseLeave={e => { if(l!==locale)(e.currentTarget as HTMLElement).style.background='transparent'; }}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
        </>
      )}

      <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
