'use client';

import { useState } from 'react';

interface OrganicBlogButtonProps {
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
}

export const OrganicBlogButton: React.FC<OrganicBlogButtonProps> = ({
  href = '/blog',
  onClick,
  size = 'medium',
  variant = 'primary',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeStyles = {
    small: { padding: '8px 16px', fontSize: '11px', iconSize: '14px' },
    medium: { padding: '10px 20px', fontSize: '12px', iconSize: '16px' },
    large: { padding: '14px 28px', fontSize: '14px', iconSize: '18px' },
  };

  const currentSize = sizeStyles[size];

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      className={`organic-blog-btn ${variant}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Veias de fundo */}
      <svg className="btn-veins" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path
          d="M 0 20 Q 25 10, 50 20 T 100 20"
          stroke="rgba(0, 255, 136, 0.2)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 10 15 Q 30 10, 50 15"
          stroke="rgba(0, 255, 136, 0.15)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 50 25 Q 70 30, 90 25"
          stroke="rgba(0, 255, 136, 0.15)"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      {/* Borda animada */}
      <div
        className="border-glow"
        style={{
          opacity: isHovered ? 1 : 0.5,
        }}
      />

      {/* Conteúdo */}
      <div className="btn-content">
        <span className="btn-icon" style={{ fontSize: currentSize.iconSize }}>
          🌿
        </span>
        <span className="btn-text">Blog</span>
        <span
          className="btn-arrow"
          style={{
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          →
        </span>
      </div>

      {/* Partículas de hover */}
      {isHovered && (
        <>
          <div className="particle p1" />
          <div className="particle p2" />
          <div className="particle p3" />
        </>
      )}

      <style jsx>{`
        .organic-blog-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: ${currentSize.padding};
          background: linear-gradient(
            135deg,
            rgba(0, 255, 136, 0.15),
            rgba(45, 90, 61, 0.2)
          );
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 255, 136, 0.4);
          border-radius: 12px 0 12px 0;
          color: #00ff88;
          font-family: 'Courier New', monospace;
          font-size: ${currentSize.fontSize};
          font-weight: bold;
          letter-spacing: 1.5px;
          text-decoration: none;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .organic-blog-btn.secondary {
          background: linear-gradient(
            135deg,
            rgba(0, 212, 255, 0.15),
            rgba(45, 90, 90, 0.2)
          );
          border-color: rgba(0, 212, 255, 0.4);
          color: #00d4ff;
        }

        .organic-blog-btn:hover {
          transform: translateY(-2px) scale(1.02);
          border-color: #00ff88;
          box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3),
            inset 0 0 20px rgba(0, 255, 136, 0.1);
        }

        .organic-blog-btn.secondary:hover {
          border-color: #00d4ff;
          box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3),
            inset 0 0 20px rgba(0, 212, 255, 0.1);
        }

        .btn-veins {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.5;
          z-index: 0;
        }

        .border-glow {
          position: absolute;
          inset: -2px;
          border-radius: 12px 0 12px 0;
          background: linear-gradient(
            135deg,
            rgba(0, 255, 136, 0.3),
            transparent
          );
          filter: blur(4px);
          transition: opacity 0.3s;
          z-index: 0;
        }

        .btn-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 1;
        }

        .btn-icon {
          display: inline-block;
          filter: drop-shadow(0 0 4px rgba(0, 255, 136, 0.6));
          animation: iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .btn-text {
          text-transform: uppercase;
        }

        .btn-arrow {
          font-size: 14px;
          transition: transform 0.3s;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #00ff88;
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat 1.5s ease-out;
        }

        .p1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }

        .p2 {
          top: 50%;
          right: 30%;
          animation-delay: 0.2s;
        }

        .p3 {
          bottom: 30%;
          left: 60%;
          animation-delay: 0.4s;
        }

        @keyframes particleFloat {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        @media (max-width: 768px) {
          .organic-blog-btn {
            padding: 8px 14px;
            font-size: 11px;
          }
        }
      `}</style>
    </a>
  );
};