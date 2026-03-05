'use client';

import { ReactNode } from 'react';

interface VintageFrameProps {
  children: ReactNode;
  variant?: 'ornate' | 'simple' | 'elegant' | 'decorative';
  color?: 'brown' | 'gold' | 'sepia' | 'black';
  size?: 'small' | 'medium' | 'large';
}

export const VintageFrame: React.FC<VintageFrameProps> = ({
  children,
  variant = 'ornate',
  color = 'brown',
  size = 'medium',
}) => {
  const colors = {
    brown: { primary: '#6b5344', secondary: '#8b7355', accent: '#a09070' },
    gold: { primary: '#8B7500', secondary: '#DAA520', accent: '#FFD700' },
    sepia: { primary: '#704214', secondary: '#8B4513', accent: '#A0522D' },
    black: { primary: '#2c2416', secondary: '#3a3020', accent: '#4a4030' },
  };

  const sizes = {
    small: { padding: 15, borderWidth: 2 },
    medium: { padding: 20, borderWidth: 3 },
    large: { padding: 30, borderWidth: 4 },
  };

  const currentColor = colors[color];
  const currentSize = sizes[size];

  return (
    <div className="vintage-frame-wrapper">
      <svg className="frame-svg" viewBox="0 0 400 600" preserveAspectRatio="none">
        <defs>
          {/* Padrão de ornamento */}
          <pattern id={`ornament-${variant}`} patternUnits="userSpaceOnUse" width="20" height="20">
            <circle cx="10" cy="10" r="1" fill={currentColor.secondary} />
          </pattern>

          {/* Gradiente para profundidade */}
          <linearGradient id={`frameGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: currentColor.primary, stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: currentColor.secondary, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: currentColor.accent, stopOpacity: 1 }} />
          </linearGradient>

          {/* Filtro de sombra */}
          <filter id={`shadow-${variant}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Renderizar moldura baseada no variant */}
        {variant === 'ornate' && (
          <g>
            {/* Bordas principais */}
            <rect
              x="10"
              y="10"
              width="380"
              height="580"
              fill="none"
              stroke={currentColor.primary}
              strokeWidth={currentSize.borderWidth}
              filter={`url(#shadow-${variant})`}
            />
            <rect
              x="15"
              y="15"
              width="370"
              height="570"
              fill="none"
              stroke={currentColor.accent}
              strokeWidth="1"
            />

            {/* Ornamentos dos cantos - Estilo Ornate */}
            <g className="corner-ornaments">
              {/* Canto superior esquerdo */}
              <path
                d="M 10 10 Q 30 30 50 10 Q 30 -10 10 10"
                fill={currentColor.secondary}
              />
              <circle cx="30" cy="10" r="3" fill={currentColor.accent} />

              {/* Canto superior direito */}
              <path
                d="M 390 10 Q 370 30 350 10 Q 370 -10 390 10"
                fill={currentColor.secondary}
              />
              <circle cx="370" cy="10" r="3" fill={currentColor.accent} />

              {/* Canto inferior esquerdo */}
              <path
                d="M 10 590 Q 30 570 50 590 Q 30 610 10 590"
                fill={currentColor.secondary}
              />
              <circle cx="30" cy="590" r="3" fill={currentColor.accent} />

              {/* Canto inferior direito */}
              <path
                d="M 390 590 Q 370 570 350 590 Q 370 610 390 590"
                fill={currentColor.secondary}
              />
              <circle cx="370" cy="590" r="3" fill={currentColor.accent} />
            </g>

            {/* Ornamentos laterais */}
            <g className="side-ornaments">
              <path
                d="M 5 200 Q 15 180 5 160 Q 15 140 5 120"
                fill="none"
                stroke={currentColor.secondary}
                strokeWidth="2"
              />
              <path
                d="M 5 400 Q 15 380 5 360 Q 15 340 5 320"
                fill="none"
                stroke={currentColor.secondary}
                strokeWidth="2"
              />
              <path
                d="M 395 200 Q 385 180 395 160 Q 385 140 395 120"
                fill="none"
                stroke={currentColor.secondary}
                strokeWidth="2"
              />
              <path
                d="M 395 400 Q 385 380 395 360 Q 385 340 395 320"
                fill="none"
                stroke={currentColor.secondary}
                strokeWidth="2"
              />
            </g>

            {/* Decoração central superior */}
            <path
              d="M 180 10 Q 200 20 220 10 Q 200 5 180 10"
              fill={currentColor.secondary}
            />

            {/* Decoração central inferior */}
            <path
              d="M 180 590 Q 200 580 220 590 Q 200 595 180 590"
              fill={currentColor.secondary}
            />
          </g>
        )}

        {variant === 'simple' && (
          <g>
            <rect
              x="10"
              y="10"
              width="380"
              height="580"
              fill="none"
              stroke={currentColor.primary}
              strokeWidth={currentSize.borderWidth}
            />
            <rect
              x="15"
              y="15"
              width="370"
              height="570"
              fill="none"
              stroke={currentColor.accent}
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          </g>
        )}

        {variant === 'elegant' && (
          <g>
            {/* Bordas duplas */}
            <rect
              x="10"
              y="10"
              width="380"
              height="580"
              fill="none"
              stroke={currentColor.primary}
              strokeWidth={currentSize.borderWidth}
            />
            <rect
              x="18"
              y="18"
              width="364"
              height="564"
              fill="none"
              stroke={currentColor.secondary}
              strokeWidth="1"
            />

            {/* Cantos elegantes */}
            <g>
              <line x1="10" y1="50" x2="50" y2="10" stroke={currentColor.accent} strokeWidth="1" />
              <line x1="350" y1="10" x2="390" y2="50" stroke={currentColor.accent} strokeWidth="1" />
              <line x1="10" y1="550" x2="50" y2="590" stroke={currentColor.accent} strokeWidth="1" />
              <line x1="350" y1="590" x2="390" y2="550" stroke={currentColor.accent} strokeWidth="1" />
            </g>

            {/* Ornamentos centrais */}
            <ellipse cx="200" cy="15" rx="30" ry="5" fill={currentColor.secondary} opacity="0.6" />
            <ellipse cx="200" cy="585" rx="30" ry="5" fill={currentColor.secondary} opacity="0.6" />
          </g>
        )}

        {variant === 'decorative' && (
          <g>
            {/* Borda principal */}
            <rect
              x="10"
              y="10"
              width="380"
              height="580"
              fill="none"
              stroke={currentColor.primary}
              strokeWidth={currentSize.borderWidth}
            />

            {/* Padrão decorativo */}
            <rect
              x="12"
              y="12"
              width="376"
              height="576"
              fill={`url(#ornament-${variant})`}
              opacity="0.1"
            />

            {/* Cantos com floreios */}
            <g className="flourish-corners">
              {/* Superior esquerdo */}
              <path
                d="M 10 10 C 20 15, 25 20, 30 30 C 25 25, 20 20, 10 10"
                fill={currentColor.secondary}
              />
              <circle cx="35" cy="35" r="2" fill={currentColor.accent} />

              {/* Superior direito */}
              <path
                d="M 390 10 C 380 15, 375 20, 370 30 C 375 25, 380 20, 390 10"
                fill={currentColor.secondary}
              />
              <circle cx="365" cy="35" r="2" fill={currentColor.accent} />

              {/* Inferior esquerdo */}
              <path
                d="M 10 590 C 20 585, 25 580, 30 570 C 25 575, 20 580, 10 590"
                fill={currentColor.secondary}
              />
              <circle cx="35" cy="565" r="2" fill={currentColor.accent} />

              {/* Inferior direito */}
              <path
                d="M 390 590 C 380 585, 375 580, 370 570 C 375 575, 380 580, 390 590"
                fill={currentColor.secondary}
              />
              <circle cx="365" cy="565" r="2" fill={currentColor.accent} />
            </g>

            {/* Elementos decorativos nas bordas */}
            <g className="edge-decorations">
              <rect x="180" y="8" width="40" height="4" fill={currentColor.secondary} />
              <rect x="180" y="588" width="40" height="4" fill={currentColor.secondary} />
              <rect x="8" y="280" width="4" height="40" fill={currentColor.secondary} />
              <rect x="388" y="280" width="4" height="40" fill={currentColor.secondary} />
            </g>
          </g>
        )}
      </svg>

      <div className="frame-content">{children}</div>

      <style jsx>{`
        .vintage-frame-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .frame-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .frame-content {
          position: relative;
          z-index: 2;
          padding: ${currentSize.padding}px;
          height: 100%;
        }

        .corner-ornaments,
        .side-ornaments,
        .flourish-corners,
        .edge-decorations {
          opacity: 0;
          animation: fadeIn 0.6s ease-out forwards;
        }

        .corner-ornaments {
          animation-delay: 0.2s;
        }

        .side-ornaments {
          animation-delay: 0.4s;
        }

        .flourish-corners {
          animation-delay: 0.3s;
        }

        .edge-decorations {
          animation-delay: 0.5s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};