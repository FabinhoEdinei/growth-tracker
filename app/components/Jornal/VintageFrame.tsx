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
    gold:  { primary: '#8B7500', secondary: '#DAA520', accent: '#FFD700' },
    sepia: { primary: '#704214', secondary: '#8B4513', accent: '#A0522D' },
    black: { primary: '#2c2416', secondary: '#3a3020', accent: '#4a4030' },
  };

  const sizes = {
    small:  { padding: 6,  borderWidth: 1.5 },
    medium: { padding: 8,  borderWidth: 2   },
    large:  { padding: 14, borderWidth: 3   },
  };

  const c = colors[color];
  const s = sizes[size];

  return (
    <div className="vf-wrapper">
      <svg className="vf-svg" viewBox="0 0 400 300" preserveAspectRatio="none">
        <defs>
          <pattern id={`op-${variant}`} patternUnits="userSpaceOnUse" width="20" height="20">
            <circle cx="10" cy="10" r="1" fill={c.secondary} />
          </pattern>
        </defs>

        {variant === 'ornate' && (
          <g>
            <rect x="4" y="4" width="392" height="292" fill="none" stroke={c.primary} strokeWidth={s.borderWidth} />
            <rect x="8" y="8" width="384" height="284" fill="none" stroke={c.accent} strokeWidth="1" />
            <circle cx="10"  cy="10"  r="3" fill={c.secondary} />
            <circle cx="390" cy="10"  r="3" fill={c.secondary} />
            <circle cx="10"  cy="290" r="3" fill={c.secondary} />
            <circle cx="390" cy="290" r="3" fill={c.secondary} />
            <path d="M 185 4 Q 200 9 215 4 Q 200 1 185 4"   fill={c.secondary} />
            <path d="M 185 296 Q 200 291 215 296 Q 200 299 185 296" fill={c.secondary} />
          </g>
        )}

        {variant === 'simple' && (
          <g>
            <rect x="4" y="4" width="392" height="292" fill="none" stroke={c.primary} strokeWidth={s.borderWidth} />
            <rect x="8" y="8" width="384" height="284" fill="none" stroke={c.accent} strokeWidth="1" strokeDasharray="4,4" />
          </g>
        )}

        {variant === 'elegant' && (
          <g>
            <rect x="4" y="4" width="392" height="292" fill="none" stroke={c.primary} strokeWidth={s.borderWidth} />
            <rect x="9" y="9" width="382" height="282" fill="none" stroke={c.secondary} strokeWidth="1" />
            <line x1="4"   y1="22"  x2="22"  y2="4"   stroke={c.accent} strokeWidth="1" />
            <line x1="378" y1="4"   x2="396" y2="22"  stroke={c.accent} strokeWidth="1" />
            <line x1="4"   y1="278" x2="22"  y2="296" stroke={c.accent} strokeWidth="1" />
            <line x1="378" y1="296" x2="396" y2="278" stroke={c.accent} strokeWidth="1" />
          </g>
        )}

        {variant === 'decorative' && (
          <g>
            <rect x="4" y="4" width="392" height="292" fill="none" stroke={c.primary} strokeWidth={s.borderWidth} />
            <rect x="7" y="7" width="386" height="286" fill={`url(#op-${variant})`} opacity="0.08" />
            <rect x="180" y="3"   width="40" height="3"  fill={c.secondary} />
            <rect x="180" y="294" width="40" height="3"  fill={c.secondary} />
            <rect x="3"   y="130" width="3"  height="40" fill={c.secondary} />
            <rect x="394" y="130" width="3"  height="40" fill={c.secondary} />
          </g>
        )}
      </svg>

      <div className="vf-content">{children}</div>

      <style jsx>{`
        .vf-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .vf-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        .vf-content {
          position: relative;
          z-index: 2;
          padding: ${s.padding}px;
          height: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};
