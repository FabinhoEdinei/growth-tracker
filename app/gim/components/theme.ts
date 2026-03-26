// app/gim/components/theme.ts
// Fonte única de verdade para cores, fontes e tokens visuais

export const T = {
  // Fundos
  bg:        '#0a0a0a',
  bgDeep:    '#060606',
  card:      '#141414',
  cardHover: '#1a1a1a',

  // Bordas
  border:    '#222222',
  borderHot: 'rgba(255,69,32,0.5)',

  // Acento neon vermelho/laranja
  accent:    '#ff4520',
  accentB:   '#ff7a00',
  gradient:  'linear-gradient(135deg, #ff4520 0%, #ff7a00 100%)',
  glow:      'rgba(255,69,32,0.3)',
  glowStr:   'rgba(255,69,32,0.6)',

  // Texto
  text:      '#f0ede8',
  textDim:   '#b0ada8',
  muted:     '#6a6560',
  faint:     '#3a3530',

  // Status
  success:   '#22c55e',
  successBg: 'rgba(34,197,94,0.12)',

  // Tipografia
  mono:      'var(--font-mono, "Share Tech Mono", monospace)',
  display:   'var(--font-display, "Barlow Condensed", sans-serif)',
} as const;

export type Theme = typeof T;
