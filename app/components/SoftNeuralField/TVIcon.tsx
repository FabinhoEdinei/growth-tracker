'use client';

interface TVIconProps {
  size?: number;
  className?: string;
}

export const TVIcon: React.FC<TVIconProps> = ({ size = 22, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="tvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0066" />
          <stop offset="50%" stopColor="#cc0052" />
          <stop offset="100%" stopColor="#990040" />
        </linearGradient>

        <filter id="tvGlow">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Corpo da TV */}
      <rect
        x="4"
        y="8"
        width="24"
        height="18"
        rx="2"
        fill="url(#tvGrad)"
        filter="url(#tvGlow)"
      />

      {/* Tela */}
      <rect
        x="6"
        y="10"
        width="20"
        height="12"
        rx="1"
        fill="#1a0a0f"
        opacity="0.8"
      />

      {/* Brilho da tela */}
      <rect
        x="8"
        y="12"
        width="10"
        height="8"
        fill="#ff3377"
        opacity="0.3"
      />

      {/* Antena esquerda */}
      <line
        x1="12"
        y1="8"
        x2="8"
        y2="4"
        stroke="#ff0066"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Antena direita */}
      <line
        x1="20"
        y1="8"
        x2="24"
        y2="4"
        stroke="#ff0066"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Botões */}
      <circle cx="8" cy="28" r="1" fill="#ff3377" opacity="0.8" />
      <circle cx="11" cy="28" r="1" fill="#ff3377" opacity="0.8" />
      <circle cx="14" cy="28" r="1" fill="#ff3377" opacity="0.8" />

      {/* Símbolo LIVE */}
      <circle cx="23" cy="14" r="1.5" fill="#ff0066" opacity="0.9">
        <animate
          attributeName="opacity"
          values="0.4;1;0.4"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default TVIcon;