'use client';

import { useState, useRef, useEffect } from 'react';
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

export const MenuDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      icon: <BlogIcon size={22} />,
      label: 'Blog',
      href: '/blog',
      badge: 'Hot',
      badgeColor: '#00ff88',
      gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.25), rgba(45, 90, 61, 0.2))',
    },
    {
      icon: <AlgaeIcon size={22} />,
      label: 'Dashboard Algas',
      href: '/dashboard-algas',
      badge: 'Beta',
      badgeColor: '#00ff88',
      gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 168, 107, 0.2))',
    },
    {
      icon: '🧬',
      label: 'Perfil',
      href: '/dashboard',
      badge: 'Beta',
      badgeColor: '#00d4ff',
      gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(148, 0, 211, 0.2))',
    },
    {
      icon: <TVIcon size={22} />,
      label: 'TV Empresarial',
      href: '/tv-empresarial',
      gradient: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(75, 0, 130, 0.2))',
    },
    {
      icon: '💼',
      label: 'Finanças',
      href: '/financas',
      badge: 'Pro',
      badgeColor: '#ff6b9d',
      gradient: 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(138, 43, 226, 0.2))',
    },
    {
      icon: '💪',
      label: 'Gim Tracker',
      href: '/gim',
      gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(75, 0, 130, 0.2))',
    },
    {
      icon: '📰',
      label: 'Jornal',
      href: '/jornal',
      badge: 'Soon',
      badgeColor: '#a855f7',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(219, 39, 119, 0.2))',
    },
    {
      icon: '🔮',
      label: 'Pentáculos',
      href: '/pentaculos',
      badge: 'New',
      badgeColor: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
    },
    {
      icon: '🧪',
      label: 'Testes',
      href: '/testes',
      badge: 'Dev',
      badgeColor: '#ff0066',
      gradient: 'linear-gradient(135deg, rgba(255, 0, 102, 0.2), rgba(255, 170, 0, 0.2))',
    },
    {
      icon: '⚙️',
      label: 'Configurações',
      href: '/config',
      gradient: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(0, 212, 255, 0.2))',
    },
  ];

  // Bloqueia scroll do body quando o menu mobile está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.onClick) {
      item.onClick();
    } else {
      router.push(item.href);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay escuro — cobre tudo atrás do painel no mobile */}
      {isOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="menu-dropdown" ref={menuRef}>
        <button
          className="menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          aria-expanded={isOpen}
          type="button"
        >
          <span className="menu-icon">🗂️</span>
          <span className="menu-text">Menu</span>
          <span className={`arrow ${isOpen ? 'open' : ''}`}>▲</span>
        </button>

        {isOpen && (
          <div className="dropdown-panel" role="menu">
            <div className="panel-glow" />

            {/* Alça de arraste visual (mobile) */}
            <div className="drag-handle" />

            <div className="dropdown-header">
              <span className="header-icon">🚀</span>
              <span className="header-text">GROWTH MODULES</span>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar menu"
              >✕</button>
            </div>

            <div className="menu-items">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  role="menuitem"
                  className="menu-item"
                  onClick={(e) => handleItemClick(item, e)}
                  style={{
                    background: item.gradient,
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="item-icon-wrapper">
                    <span className="item-icon">
                      {typeof item.icon === 'string' ? item.icon : item.icon}
                    </span>
                    <div className="icon-glow" />
                  </div>
                  <span className="item-label">{item.label}</span>
                  {item.badge && (
                    <span
                      className="item-badge"
                      style={{
                        background: item.badgeColor,
                        boxShadow: `0 0 12px ${item.badgeColor}`,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="dropdown-footer">
              <div className="footer-stat">
                <span className="stat-value">{menuItems.length}</span>
                <span className="stat-label">módulos</span>
              </div>
              <span className="footer-separator">•</span>
              <div className="footer-stat">
                <span className="stat-value">∞</span>
                <span className="stat-label">crescimento</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ── Overlay ─────────────────────────────────────────────────── */
        .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          z-index: 998;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Wrapper ─────────────────────────────────────────────────── */
        .menu-dropdown {
          position: relative;
          display: inline-block;
          pointer-events: auto;
        }

        /* ── Botão ───────────────────────────────────────────────────── */
        .menu-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: linear-gradient(135deg, rgba(255,170,0,0.2), rgba(255,107,157,0.2));
          border: 1.5px solid rgba(255,170,0,0.5);
          border-radius: 6px;
          color: #ffaa00;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.3s;
          pointer-events: auto;
          position: relative;
          overflow: hidden;
        }

        .menu-button:hover {
          border-color: rgba(255,170,0,0.8);
          box-shadow: 0 0 20px rgba(255,170,0,0.4), inset 0 0 20px rgba(255,170,0,0.1);
          transform: scale(1.05);
        }

        .menu-icon { font-size: 14px; filter: drop-shadow(0 0 8px rgba(255,170,0,0.8)); }
        .menu-text  { font-weight: bold; }
        .arrow      { font-size: 8px; transition: transform 0.3s; margin-left: 2px; }
        .arrow.open { transform: rotate(180deg); }

        /* ── Painel — Desktop ────────────────────────────────────────── */
        .dropdown-panel {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          background: linear-gradient(135deg, rgba(10,5,30,0.98), rgba(30,10,50,0.98));
          backdrop-filter: blur(20px);
          border: 2px solid transparent;
          border-radius: 16px;
          box-shadow:
            0 0 40px rgba(0,212,255,0.3),
            0 0 80px rgba(255,0,255,0.2),
            0 20px 60px rgba(0,0,0,0.9);
          z-index: 999;
          overflow: hidden;
          animation: dropdownSlide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          /* borda gradiente via outline trick */
          outline: 2px solid transparent;
          background-clip: padding-box;
        }

        /* borda colorida */
        .dropdown-panel::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(0,212,255,0.5), rgba(255,0,255,0.5), rgba(0,212,255,0.5));
          z-index: -1;
        }

        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)     scale(1);    }
        }

        .drag-handle { display: none; }

        .close-btn {
          display: none;
          margin-left: auto;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 16px;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .close-btn:hover { color: #fff; }

        /* ── Painel — Mobile (bottom sheet) ─────────────────────────── */
        @media (max-width: 768px) {
          .dropdown-panel {
            /* Ocupa a tela de baixo pra cima — nunca sai da tela */
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-width: 100%;
            transform: none;
            border-radius: 20px 20px 0 0;
            /* remove a animação de desktop */
            animation: bottomSheetSlide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            /* garante que não passe do topo da tela */
            max-height: 88dvh;
            display: flex;
            flex-direction: column;
          }

          .dropdown-panel::after {
            border-radius: 22px 22px 0 0;
          }

          @keyframes bottomSheetSlide {
            from { transform: translateY(100%); opacity: 0.6; }
            to   { transform: translateY(0);    opacity: 1;   }
          }

          /* Alça de arraste */
          .drag-handle {
            display: block;
            width: 40px;
            height: 4px;
            background: rgba(255,255,255,0.25);
            border-radius: 2px;
            margin: 10px auto 0;
            flex-shrink: 0;
          }

          /* Botão fechar visível no mobile */
          .close-btn { display: block; }

          .menu-items {
            /* Preenche o espaço disponível com scroll */
            flex: 1;
            max-height: none !important;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .menu-item {
            font-size: 14px;
            padding: 13px 14px;
            /* toque mais fácil */
            min-height: 52px;
          }

          .item-icon-wrapper {
            width: 38px;
            height: 38px;
          }

          .item-icon { font-size: 20px; }
        }

        /* ── Glow do painel ──────────────────────────────────────────── */
        .panel-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(255,0,255,0.08));
          filter: blur(20px);
          z-index: -1;
          animation: glowPulse 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }

        /* ── Header ──────────────────────────────────────────────────── */
        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          background: linear-gradient(90deg, rgba(0,212,255,0.15), rgba(255,0,255,0.15));
          border-bottom: 2px solid rgba(0,212,255,0.3);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .dropdown-header::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0%   { left: -100%; }
          100% { left: 200%;  }
        }

        .header-icon {
          font-size: 20px;
          filter: drop-shadow(0 0 10px rgba(0,212,255,0.8));
          animation: iconFloat 3s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-4px); }
        }

        .header-text {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 2.5px;
          background: linear-gradient(135deg, #00d4ff, #ff00ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }

        /* ── Items ───────────────────────────────────────────────────── */
        .menu-items {
          padding: 12px;
          max-height: 380px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .menu-items::-webkit-scrollbar       { width: 6px; }
        .menu-items::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); border-radius: 10px; }
        .menu-items::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00d4ff, #ff00ff);
          border-radius: 10px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          margin-bottom: 7px;
          border: 2px solid transparent;
          border-radius: 12px;
          color: rgba(255,255,255,0.95);
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          animation: itemSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
          width: 100%;
          text-align: left;
        }

        @keyframes itemSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0);     }
        }

        .menu-item:hover {
          border-color: rgba(0,212,255,0.6);
          box-shadow: 0 0 24px rgba(0,212,255,0.35), inset 0 0 16px rgba(0,212,255,0.08);
          transform: translateX(4px) scale(1.01);
        }

        /* Toque ativo no mobile */
        .menu-item:active {
          transform: scale(0.97);
          opacity: 0.85;
        }

        .item-icon-wrapper {
          position: relative;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.4);
          border-radius: 10px;
          border: 1.5px solid rgba(0,212,255,0.3);
          flex-shrink: 0;
        }

        .item-icon {
          font-size: 22px;
          position: relative; z-index: 2;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.7));
        }

        .icon-glow {
          position: absolute; inset: -4px;
          background: radial-gradient(circle, rgba(0,212,255,0.4), transparent);
          filter: blur(10px);
          opacity: 0; transition: opacity 0.3s;
        }

        .menu-item:hover .icon-glow { opacity: 1; }

        .item-label {
          flex: 1;
          letter-spacing: 0.5px;
          text-shadow: 0 0 10px rgba(0,212,255,0.25);
        }

        .item-badge {
          padding: 3px 9px;
          color: #000;
          font-size: 9px;
          font-weight: bold;
          border-radius: 6px;
          letter-spacing: 1.5px;
          border: 1.5px solid rgba(255,255,255,0.25);
          flex-shrink: 0;
        }

        /* ── Footer ──────────────────────────────────────────────────── */
        .dropdown-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 14px 20px;
          background: linear-gradient(90deg, rgba(0,212,255,0.1), rgba(255,0,255,0.1));
          border-top: 2px solid rgba(0,212,255,0.3);
          font-family: 'Courier New', monospace;
          flex-shrink: 0;
          /* espaço seguro iOS/Android */
          padding-bottom: max(14px, env(safe-area-inset-bottom));
        }

        .footer-stat      { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .stat-value       { font-size: 18px; font-weight: bold; background: linear-gradient(135deg,#00d4ff,#ff00ff); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label       { font-size: 8px; color: rgba(255,255,255,0.45); letter-spacing: 1.5px; text-transform: uppercase; }
        .footer-separator { color: rgba(255,0,255,0.6); font-size: 14px; animation: separatorPulse 2s ease-in-out infinite; }

        @keyframes separatorPulse {
          0%, 100% { opacity: 0.4; transform: scale(1);   }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
      `}</style>
    </>
  );
};
