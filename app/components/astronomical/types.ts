/**
 * @file types.ts
 * @description Tipos e constantes para o sistema de capítulos com relógio astronômico
 * @author Fabio
 */

// ============================================================================
// TIPOS PRINCIPAIS
// ============================================================================

export interface AstronomicalClockState {
  hour: number
  minute: number
  second: number
  moonPhase: number
  zodiacSign: string
  dayOfWeek: string
}

export interface ZodiacSign {
  name: string
  symbol: string
  dateRange: string
}

export interface ChapterMetadata {
  number: number
  title: string
  subtitle: string
  description: string
  estimatedReadTime: string
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  content?: string
}

export interface NavigationHandler {
  (direction: 'prev' | 'next'): void
}

// ============================================================================
// CONSTANTES ASTRONÔMICAS
// ============================================================================

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Áries', symbol: '♈', dateRange: '21 Mar - 20 Abr' },
  { name: 'Touro', symbol: '♉', dateRange: '21 Abr - 20 Mai' },
  { name: 'Gêmeos', symbol: '♊', dateRange: '21 Mai - 20 Jun' },
  { name: 'Câncer', symbol: '♋', dateRange: '21 Jun - 22 Jul' },
  { name: 'Leão', symbol: '♌', dateRange: '23 Jul - 22 Ago' },
  { name: 'Virgem', symbol: '♍', dateRange: '23 Ago - 22 Set' },
  { name: 'Libra', symbol: '♎', dateRange: '23 Set - 22 Out' },
  { name: 'Escorpião', symbol: '♏', dateRange: '23 Out - 21 Nov' },
  { name: 'Sagitário', symbol: '♐', dateRange: '22 Nov - 21 Dez' },
  { name: 'Capricórnio', symbol: '♑', dateRange: '22 Dez - 19 Jan' },
  { name: 'Aquário', symbol: '♒', dateRange: '20 Jan - 18 Fev' },
  { name: 'Peixes', symbol: '♓', dateRange: '19 Fev - 20 Mar' },
]

export const MOON_PHASES = [
  'Nova',
  'Crescente',
  'Quarto Crescente',
  'Gibosa Crescente',
  'Cheia',
  'Gibosa Minguante',
  'Quarto Minguante',
  'Crescente Minguante',
] as const

export const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const

// ============================================================================
// CONSTANTES DE CORES (DESIGN SYSTEM)
// ============================================================================

export const COLOR_PALETTE = {
  // Tons principais (Medieval/Ouro)
  gold: '#D4AF37',
  darkGold: '#8B6F47',
  lightGold: '#E8D5B5',
  cream: '#FFF8DC',

  // Tons secundários
  darkBrown: '#2C1810',
  mediumBrown: '#5C4A2F',

  // Tons acessíveis
  lightBg: '#F5E6D3',
  darkBg: '#1A1A1A',
} as const

// ============================================================================
// CONFIGURAÇÕES DE ANIMAÇÃO
// ============================================================================

export const ANIMATION_CONFIG = {
  LUNAR_CYCLE_DAYS: 29.5306,
  CLOCK_UPDATE_INTERVAL: 1000, // ms
  FADE_DURATION: '0.6s',
  EASE_OUT: 'ease-out',
} as const

// ============================================================================
// METADADOS DE CAPÍTULOS
// ============================================================================

export const CHAPTERS_METADATA: Record<number, ChapterMetadata> = {
  1: {
    number: 1,
    title: 'As Engrenagens do Tempo',
    subtitle: 'Introdução ao mecanismo medieval',
    description: 'Comece sua jornada explorando as engrenagens fundamentais que movem os relógios astronômicos.',
    estimatedReadTime: '8 minutos',
    difficulty: 'Iniciante',
  },
  2: {
    number: 2,
    title: 'O Ciclo Lunar',
    subtitle: 'As fases e seus mistérios',
    description: 'Descubra como os antigos calculavam as fases da lua com precisão notável.',
    estimatedReadTime: '10 minutos',
    difficulty: 'Intermediário',
  },
  3: {
    number: 3,
    title: 'O Zodíaco Eterno',
    subtitle: 'Constelações e seus segredos',
    description: 'Explore as 12 constelações zodiacais e sua influência nos mecanismos celestes.',
    estimatedReadTime: '11 minutos',
    difficulty: 'Intermediário',
  },
  4: {
    number: 4,
    title: 'O Mecanismo Celeste',
    subtitle: 'Desvendando os segredos do tempo cósmico',
    description:
      'Mergulhe nas profundezas dos relógios astronômicos medievais e descubra como os antigos mestres calculavam os movimentos celestiais. Uma jornada através do tempo, das fases lunares ao zodíaco eterno.',
    estimatedReadTime: '12 minutos',
    difficulty: 'Intermediário',
  },
  5: {
    number: 5,
    title: 'Os Símbolos do Poder',
    subtitle: 'Decifração e interpretação',
    description: 'Aprenda a ler e interpretar os símbolos gravados nas faces dos relógios históricos.',
    estimatedReadTime: '9 minutos',
    difficulty: 'Avançado',
  },
}
