'use client';

export const BlogIcon = ({ size = 20 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="50%" stopColor="#00d4aa" />
          <stop offset="100%" stopColor="#00a86b" />
        </linearGradient>
      </defs>

      {/* Folha principal */}
      <path
        d="M 16 4 Q 24 8, 26 16 Q 24 24, 16 28 Q 8 24, 6 16 Q 8 8, 16 4 Z"
        fill="url(#blogGrad)"
        opacity="0.8"
      />

      {/* Veias */}
      <path
        d="M 16 4 L 16 28"
        stroke="#004d33"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <path
        d="M 16 12 Q 20 14, 22 16"
        stroke="#004d33"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M 16 12 Q 12 14, 10 16"
        stroke="#004d33"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M 16 20 Q 20 22, 22 24"
        stroke="#004d33"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M 16 20 Q 12 22, 10 24"
        stroke="#004d33"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Brilho central */}
      <ellipse
        cx="16"
        cy="16"
        rx="6"
        ry="8"
        fill="#88ffcc"
        opacity="0.3"
      />
    </svg>
  );
};