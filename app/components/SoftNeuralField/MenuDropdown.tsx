'use client';

import { useState, useRef, useEffect } from 'react';

interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  color: string;
}

export const MenuDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    {
      icon: '📊',
      label: 'Dashboard',
      href: '/dashboard',
      badge: 'Beta',
      color: '#00ffff',
    },
    {
      icon: '🎯',
      label: 'Metas',
      href: '/metas',
      color: '#ff00ff',
    },
    {
      icon: '💼',
      label: 'Finanças',
      href: '/financas',
      badge: 'Pro',
      color: '#ffaa00',
    },
    {
      icon: '💪',
      label: 'Gim Tracker',
      href: '/gim',
      color: '#00ff88',
    },
    {
      icon: '📰',
      label: 'Jornal',
      href: '/jornal',
      badge: 'Soon',
      color: '#ff0066',
    },
    {
      icon: '🔮',
      label: 'Pentáculos',
      href: '/pentaculos',
      badge: 'New',
      color: '#FFD700',
    },
    {
      icon: '⚙️',
      label: 'Configurações',
      href: '/config',
      color: '#8b8b8b',
    },
  ];

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="menu-dropdown" ref={menuRef}>
      <button
        className="menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        <span className="menu-icon">🗂️</span>
        <span className="menu-text">Menu</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-content">
          <div className="dropdown-header">
            <span className="header-icon">🚀</span>
            <span className="header-text">GROWTH MODULES</span>
          </div>

          <div className="menu-items">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="menu-item"
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  setIsOpen(false);
                }}
                style={{
                  '--item-color': item.color,
                  animationDelay: `${index * 0.05}s`,
                } as React.CSSProperties}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
                {item.badge && (
                  <span className="item-badge">{item.badge}</span>
                )}
                <span className="item-arrow">→</span>
              </a>
            ))}
          </div>

          <div className="dropdown-footer">
            <div className="footer-stats">
              <span className="stat">
                <span className="stat-value">{menuItems.length}</span>
                <span className="stat-label">módulos</span>
              </span>
              <span className="stat-separator">•</span>
              <span className="stat">
                <span className="stat-value">∞</span>
                <span className="stat-label">crescimento</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .menu-dropdown {
          position: relative;
          display: inline-block;
        }

        .menu-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: rgba(0, 255, 255, 0.15);
          border: 1px solid rgba(0, 255, 255, 0.4);
          border-radius: 5px;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.3s;
          pointer-events: auto;
        }

        .menu-button:hover {
          background: rgba(0, 255, 255, 0.25);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .menu-icon {
          font-size: 14px;
        }

        .menu-text {
          font-weight: bold;
        }

        .arrow {
          font-size: 8px;
          transition: transform 0.3s;
          margin-left: 2px;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .dropdown-content {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 280px;
          background: linear-gradient(
            135deg,
            rgba(5, 5, 25, 0.98),
            rgba(15, 5, 35, 0.98)
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          box-shadow: 
            0 0 30px rgba(0, 255, 255, 0.2),
            0 10px 40px rgba(0, 0, 0, 0.8);
          z-index: 1000;
          animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: linear-gradient(
            90deg,
            rgba(0, 255, 255, 0.1),
            rgba(255, 0, 255, 0.1)
          );
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        }

        .header-icon {
          font-size: 16px;
        }

        .header-text {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(0, 255, 255, 0.8);
          font-weight: bold;
        }

        .menu-items {
          padding: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          margin-bottom: 4px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid transparent;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          transition: all 0.3s;
          cursor: pointer;
          animation: itemSlide 0.3s ease-out backwards;
        }

        @keyframes itemSlide {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .menu-item:hover {
          background: rgba(0, 0, 0, 0.5);
          border-color: var(--item-color);
          box-shadow: 0 0 15px var(--item-color);
          transform: translateX(4px);
        }

        .item-icon {
          font-size: 18px;
          filter: drop-shadow(0 0 5px var(--item-color));
        }

        .item-label {
          flex: 1;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.5px;
        }

        .item-badge {
          padding: 2px 6px;
          background: var(--item-color);
          color: #000;
          font-size: 8px;
          font-weight: bold;
          border-radius: 3px;
          letter-spacing: 1px;
        }

        .item-arrow {
          font-size: 14px;
          color: var(--item-color);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .menu-item:hover .item-arrow {
          opacity: 1;
        }

        .dropdown-footer {
          padding: 10px 16px;
          background: linear-gradient(
            90deg,
            rgba(0, 255, 255, 0.05),
            rgba(255, 0, 255, 0.05)
          );
          border-top: 1px solid rgba(0, 255, 255, 0.2);
        }

        .footer-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: 'Courier New', monospace;
          font-size: 9px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .stat-value {
          font-size: 14px;
          font-weight: bold;
          color: #00ffff;
          text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
        }

        .stat-label {
          font-size: 8px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
        }

        .stat-separator {
          color: rgba(255, 0, 255, 0.5);
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .menu-button {
            padding: 5px 12px;
            font-size: 9px;
          }

          .dropdown-content {
            min-width: 250px;
            left: auto;
            right: 0;
            transform: none;
          }

          @keyframes dropdownSlide {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .menu-item {
            font-size: 11px;
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
};