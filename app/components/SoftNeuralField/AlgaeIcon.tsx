'use client';

import React from 'react';

interface AlgaeIconProps {
  size?: number;
  className?: string;
}

export const AlgaeIcon: React.FC<AlgaeIconProps> = ({ 
  size = 22,
  className = '' 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ 
        filter: 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.5))',
        transition: 'all 0.3s ease',
      }}
    >
      <defs>
        <linearGradient id="algaeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88"/>
          <stop offset="50%" stopColor="#00d4aa"/>
          <stop offset="100%" stopColor="#00a86b"/>
        </linearGradient>
        <filter id="glowSmall">
          <feGaussianBlur stdDeviation="0.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="innerGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#88ffcc" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <circle cx="16" cy="16" r="12" fill="url(#algaeGrad)" filter="url(#glowSmall)"/>
      <circle cx="16" cy="16" r="9" fill="url(#innerGlow)" opacity="0.6"/>
      <circle cx="16" cy="16" r="4" fill="#004d33" opacity="0.7"/>
      <circle cx="16" cy="16" r="2.5" fill="#006644" opacity="0.9"/>
      
      <ellipse cx="11" cy="12" rx="2" ry="3" fill="#00cc66" opacity="0.8"/>
      <ellipse cx="21" cy="12" rx="2" ry="3" fill="#00cc66" opacity="0.8"/>
      <ellipse cx="11" cy="20" rx="2" ry="3" fill="#00cc66" opacity="0.8"/>
      <ellipse cx="21" cy="20" rx="2" ry="3" fill="#00cc66" opacity="0.8"/>
      
      <g stroke="#00ff88" strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round">
        <path d="M16 4 Q16 2, 15 1"/>
        <path d="M16 4 Q17 2, 18 1"/>
        <path d="M28 16 Q30 16, 31 15"/>
        <path d="M28 16 Q30 17, 31 18"/>
        <path d="M16 28 Q16 30, 15 31"/>
        <path d="M16 28 Q17 30, 18 31"/>
        <path d="M4 16 Q2 16, 1 15"/>
        <path d="M4 16 Q2 17, 1 18"/>
      </g>
      
      <circle cx="9" cy="9" r="0.8" fill="#88ffcc" opacity="0.5"/>
      <circle cx="24" cy="8" r="0.5" fill="#88ffcc" opacity="0.4"/>
      <circle cx="25" cy="24" r="0.8" fill="#88ffcc" opacity="0.5"/>
      <circle cx="7" cy="23" r="0.5" fill="#88ffcc" opacity="0.4"/>
    </svg>
  );
};