'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { AlgaeIcon } from '../Blog/AlgaeIcon';
import { BlogIcon } from '../Blog/BlogIcon';
import { TVIcon } from './TVIcon';

interface MenuItem {
  icon: string | React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
  badge?: string;
  badgeColor?: string;
  gradient: string;
}

const menuItems: MenuItem[] = [
  { icon: <BlogIcon size={22} />,   label: 'Blog',             href: '/blog',           badge: 'Hot',  badgeColor: '#00ff88', gradient: 'linear-gradient(135deg,rgba(0,255,136,0.25),rgba(45,90,61,0.2))' },
  { icon: <AlgaeIcon size={22} />,  label: 'Dashboard Algas',  href: '/dashboard-algas',badge: 'Beta', badgeColor: '#00ff88', gradient: 'linear-gradient(135deg,rgba(0,255,136,0.2),rgba(0,168,107,0.2))' },
{
  icon: '🎬',
  label: 'TV Config',
  href: '/tv-empresarial/config',
  badge: 'Dev',
  badgeColor: '#ff8c42',
  gradient: 'linear-gradient(135deg,rgba(255,140,66,0.2),rgba(168,85,247,0.2))',
},
{
  icon: '📖',
  label: 'Manga',
  href: '/manga',
  badge: 'New',
  badgeColor: '#ff6b9d',
  gradient: 'linear-gradient(135deg,rgba(255,107,157,0.2),rgba(168,85,247,0.2))',
},
  { icon: '🧬',                     label: 'Perfil',            href: '/dashboard',      badge: 'Beta', badgeColor: '#00d4ff', gradient: 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(148,0,211,0.2))' },
  { icon: <TVIcon size={22} />,     label: 'TV Empresarial',   href: '/tv-empresarial',                                       gradient: 'linear-gradient(135deg,rgba(138,43,226,0.2),rgba(75,0,130,0.2))' },
  { icon: '💼',                     label: 'Finanças',          href: '/financas',       badge: 'Pro',  badgeColor: '#ff6b9d', gradient: 'linear-gradient(135deg,rgba(255,107,157,0.2),rgba(138,43,226,0.2))' },
  { icon: '💪',                     label: 'Gim Tracker',      href: '/gim',                                                  gradient: 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(75,0,130,0.2))' },
  { icon: '📰',                     label: 'Jornal',            href: '/jornal',         badge: 'Soon', badgeColor: '#a855f7', gradient: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(219,39,119,0.2))' },
  { icon: '🔮',                     label: 'Pentáculos',       href: '/pentaculos',     badge: 'New',  badgeColor: '#3b82f6', gradient: 'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(147,51,234,0.2))' },
  { icon: '🧪',                     label: 'Testes',           href: '/testes',         badge: 'Dev',  badgeColor: '#ff0066', gradient: 'linear-gradient(135deg,rgba(255,0,102,0.2),rgba(255,170,0,0.2))' },
  { icon: '⚙️',                     label: 'Configurações',    href: '/config',                                               gradient: 'linear-gradient(135deg,rgba(255,0,255,0.2),rgba(0,212,255,0.2))' },
];

export const MenuDropdown = () => {
  const [isOpen,  setIsOpen]  = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Só usa portal depois de montar no cliente
  useEffect(() => { setMounted(true); }, []);

  // Trava o scroll do body enquanto o sheet está aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    close();
    setTimeout(() => {
      if (item.onClick) item.onClick();
      else router.push(item.href);
    }, 160);
  };

  // ── Portal content ────────────────────────────────────────────────────────
  const sheet = (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position:  'fixed',
          inset:     0,
          zIndex:    9998,
          background:'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'gtFade .2s ease',
        }}
      />

      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:   'fixed',
          bottom:     0,
          left:       0,
          right:      0,
          zIndex:     9999,
          maxHeight:  '88dvh',
          display:    'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg,rgba(16,6,38,.99) 0%,rgba(28,8,52,.99) 100%)',
          borderRadius: '22px 22px 0 0',
          boxShadow:  '0 -6px 50px rgba(0,212,255,.3), 0 -1px 0 rgba(0,212,255,.5)',
          animation:  'gtUp .32s cubic-bezier(.32,1.25,.64,1)',
          paddingBottom: 'env(safe-area-inset-bottom,0px)',
        }}
      >
        {/* Alça */}
        <div style={{ width:44, height:5, background:'rgba(255,255,255,.22)', borderRadius:3, margin:'12px auto 0', flexShrink:0 }} />

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 20px 14px', borderBottom:'1px solid rgba(0,212,255,.2)', flexShrink:0, background:'linear-gradient(90deg,rgba(0,212,255,.1),rgba(255,0,255,.1))' }}>
          <span style={{ fontSize:20, filter:'drop-shadow(0 0 8px rgba(0,212,255,.9))', animation:'gtFloat 3s ease-in-out infinite' }}>🚀</span>
          <span style={{ fontFamily:"'Courier New',monospace", fontSize:11, letterSpacing:2.5, fontWeight:'bold', background:'linear-gradient(135deg,#00d4ff,#ff00ff)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            GROWTH MODULES
          </span>
          <button
            onClick={close}
            style={{ marginLeft:'auto', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.14)', borderRadius:8, color:'rgba(255,255,255,.55)', fontSize:15, cursor:'pointer', padding:'3px 10px' }}
          >✕</button>
        </div>

        {/* ── Lista scrollável ── */}
        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'10px 14px 4px', WebkitOverflowScrolling:'touch' }}>
          {menuItems.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={e => handleItemClick(item, e)}
              onTouchStart={e => { const el = e.currentTarget; el.style.transform='scale(.97)'; el.style.opacity='.8'; }}
              onTouchEnd={e   => { const el = e.currentTarget; el.style.transform=''; el.style.opacity=''; }}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        14,
                width:      '100%',
                padding:    '12px 14px',
                marginBottom: 8,
                background: item.gradient,
                border:     '1.5px solid rgba(0,212,255,.14)',
                borderRadius: 14,
                color:      'rgba(255,255,255,.95)',
                fontFamily: "'Courier New',monospace",
                fontSize:   14,
                fontWeight: 'bold',
                cursor:     'pointer',
                textAlign:  'left',
                minHeight:  54,
                transition: 'transform .15s,opacity .15s',
                animation:  `gtItem .35s ${i * .045}s cubic-bezier(.34,1.2,.64,1) backwards`,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Ícone */}
              <div style={{ width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.35)', borderRadius:11, border:'1.5px solid rgba(0,212,255,.22)', flexShrink:0 }}>
                <span style={{ fontSize:22, filter:'drop-shadow(0 0 6px rgba(255,255,255,.6))' }}>
                  {typeof item.icon === 'string' ? item.icon : item.icon}
                </span>
              </div>

              {/* Label */}
              <span style={{ flex:1, letterSpacing:.4 }}>{item.label}</span>

              {/* Badge */}
              {item.badge && (
                <span style={{ padding:'3px 10px', background:item.badgeColor, boxShadow:`0 0 10px ${item.badgeColor}`, color:'#000', fontSize:9, fontWeight:'bold', borderRadius:6, letterSpacing:1.5, flexShrink:0 }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, padding:'13px 20px', borderTop:'1px solid rgba(0,212,255,.18)', background:'linear-gradient(90deg,rgba(0,212,255,.08),rgba(255,0,255,.08))', fontFamily:"'Courier New',monospace", flexShrink:0 }}>
          {[{val: String(menuItems.length), label:'módulos'}, {val:'∞', label:'crescimento'}].map((s,i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <span style={{ fontSize:20, fontWeight:'bold', background:'linear-gradient(135deg,#00d4ff,#ff00ff)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>{s.val}</span>
              <span style={{ fontSize:8, color:'rgba(255,255,255,.4)', letterSpacing:1.5, textTransform:'uppercase' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes injetados uma única vez no head via <style> global */}
      <style>{`
        @keyframes gtFade  { from{opacity:0}                                   to{opacity:1} }
        @keyframes gtUp    { from{transform:translateY(100%);opacity:.4}        to{transform:translateY(0);opacity:1} }
        @keyframes gtItem  { from{opacity:0;transform:translateX(-18px)}        to{opacity:1;transform:translateX(0)} }
        @keyframes gtFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>
    </>
  );

  return (
    <>
      {/* ── Botão ── */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Menu"
        aria-expanded={isOpen}
        type="button"
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        6,
          padding:    '6px 16px',
          background: 'linear-gradient(135deg,rgba(255,170,0,.2),rgba(255,107,157,.2))',
          border:     '1.5px solid rgba(255,170,0,.55)',
          borderRadius: 6,
          color:      '#ffaa00',
          fontFamily: "'Courier New',monospace",
          fontSize:   10,
          fontWeight: 'bold',
          letterSpacing: 1.5,
          cursor:     'pointer',
          WebkitTapHighlightColor: 'transparent',
          transition: 'transform .2s,box-shadow .2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='scale(1.05)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform=''; }}
      >
        <span style={{ fontSize:14, filter:'drop-shadow(0 0 8px rgba(255,170,0,.8))' }}>🗂️</span>
        <span>Menu</span>
        <span style={{ fontSize:8, marginLeft:2, display:'inline-block', transform:isOpen?'rotate(180deg)':'none', transition:'transform .3s' }}>▲</span>
      </button>

      {/* Portal — fora de qualquer contexto de stacking do componente pai */}
      {mounted && isOpen && createPortal(sheet, document.body)}
    </>
  );
};
