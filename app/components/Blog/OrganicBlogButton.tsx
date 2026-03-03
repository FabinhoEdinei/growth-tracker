'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrganicBlogButtonProps {
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  compact?: boolean;
  className?: string;
}

export const OrganicBlogButton: React.FC<OrganicBlogButtonProps> = ({
  href = '/blog',
  onClick,
  size = 'medium',
  variant = 'primary',
  compact = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const sizeStyles = {
    small: { padding: '8px 16px', fontSize: '11px', iconSize: '14px', borderRadius: '16px' },
    medium: { padding: '12px 24px', fontSize: '13px', iconSize: '16px', borderRadius: '20px' },
    large: { padding: '16px 32px', fontSize: '15px', iconSize: '20px', borderRadius: '24px' },
  };

  const currentSize = compact 
    ? { padding: '8px 16px', fontSize: '11px', iconSize: '14px', borderRadius: '16px' }
    : sizeStyles[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // ✅ Navegar para href usando router
      router.push(href);
    }
  };

  return (
    <button
      type="button"
      className={`organic-blog-btn ${variant} ${compact ? 'compact' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* SVG de Veias Orgânicas */}
      <svg className="btn-veins" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path
          d="M 0 20 Q 25 15, 50 20 T 100 20"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 10 10 Q 30 8, 50 12"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 50 12 Q 70 8, 90 10"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 10 30 Q 30 32, 50 28"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 50 28 Q 70 32, 90 30"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 25 20 L 25 15"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 50 20 L 50 12"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 75 20 L 75 15"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      {/* Efeito de onda */}
      <div className={`wave-effect ${isHovered ? 'active' : ''}`} />

      {/* Borda gradiente */}
      <div className="border-shimmer" />

      {/* Conteúdo */}
      <div className="btn-content">
        <svg
          className="btn-icon-svg"
          width={currentSize.iconSize}
          height={currentSize.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12 2 Q 18 5, 20 12 Q 18 19, 12 22 Q 6 19, 4 12 Q 6 5, 12 2 Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M 12 2 L 12 22"
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth="1.5"
          />
          <path
            d="M 12 8 Q 15 10, 17 12"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1"
          />
          <path
            d="M 12 8 Q 9 10, 7 12"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1"
          />
        </svg>

        <span className="btn-text">Blog</span>
        
        {!compact && (
          <span
            className="btn-arrow"
            style={{
              transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
            }}
          >
            →
          </span>
        )}
      </div>

      {/* Partículas */}
      {isHovered && (
        <>
          <div className="particle p1" />
          <div className="particle p2" />
          <div className="particle p3" />
          <div className="particle p4" />
        </>
      )}

      <style jsx>{`
        .organic-blog-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: ${currentSize.padding};
          background: linear-gradient(135deg, #00b894, #00cec9, #55a3ff);
          border: none;
          border-radius: ${currentSize.borderRadius};
          color: white;
          font-family: 'Courier New', monospace;
          font-size: ${currentSize.fontSize};
          font-weight: bold;
          letter-spacing: 1.5px;
          text-decoration: none;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
        }

        .organic-blog-btn.secondary {
          background: linear-gradient(135deg, #00d4ff, #00a8cc, #0077b6);
        }

        .organic-blog-btn:hover {
          box-shadow: 0 0 30px rgba(0, 184, 148, 0.6);
          transform: scale(1.05) translateY(-2px);
        }

        .organic-blog-btn.secondary:hover {
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
        }

        .organic-blog-btn.compact {
          padding: 8px 16px;
          font-size: 11px;
          border-radius: 16px;
        }

        .btn-veins {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.6;
          z-index: 1;
        }

        .wave-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: translateX(-100%) translateY(-100%) rotate(45deg);
          opacity: 0;
          transition: all 0.5s;
          z-index: 2;
          pointer-events: none;
        }

        .wave-effect.active {
          animation: onda-alga 1s ease-in-out;
          opacity: 1;
        }

        @keyframes onda-alga {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .border-shimmer {
          position: absolute;
          inset: -2px;
          border-radius: ${currentSize.borderRadius};
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          opacity: 0;
          animation: shimmer 3s linear infinite;
          z-index: 0;
          pointer-events: none;
        }

        .organic-blog-btn:hover .border-shimmer {
          opacity: 1;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .btn-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 3;
          pointer-events: none;
        }

        .btn-icon-svg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          animation: leafFloat 3s ease-in-out infinite;
        }

        @keyframes leafFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-3px) rotate(2deg);
          }
        }

        .btn-text {
          position: relative;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .btn-arrow {
          font-size: 16px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat 1.8s ease-out;
          z-index: 4;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
          pointer-events: none;
        }

        .p1 {
          top: 15%;
          left: 20%;
          animation-delay: 0s;
        }

        .p2 {
          top: 50%;
          right: 25%;
          animation-delay: 0.2s;
        }

        .p3 {
          bottom: 25%;
          left: 60%;
          animation-delay: 0.4s;
        }

        .p4 {
          top: 70%;
          right: 40%;
          animation-delay: 0.6s;
        }

        @keyframes particleFloat {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          30% {
            opacity: 1;
            transform: translateY(-8px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-25px) scale(0.3);
          }
        }

        @media (max-width: 768px) {
          .organic-blog-btn {
            padding: 10px 20px;
            font-size: 12px;
            border-radius: 18px;
          }

          .btn-arrow {
            font-size: 14px;
          }
        }

        .organic-blog-btn:active {
          transform: scale(0.98) translateY(0);
          box-shadow: 0 2px 10px rgba(0, 184, 148, 0.4);
        }

        .organic-blog-btn:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: 3px;
        }
      `}</style>
    </button>
  );
};