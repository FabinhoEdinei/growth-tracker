/**
 * @file astronomicalUtils.ts
 * @description Funções utilitárias para cálculos astronômicos e temporais
 * @author Fabio
 */

import {
  AstronomicalClockState,
  ZODIAC_SIGNS,
  MOON_PHASES,
  DAYS_OF_WEEK,
  ANIMATION_CONFIG,
} from './types'

// ============================================================================
// CÁLCULOS ASTRONÔMICOS
// ============================================================================

/**
 * Calcula a idade da lua em dias usando o ciclo lunar de 29.5306 dias
 * Usa como referência o ano lunar de 2000 (J2000)
 */
export function calculateLunarAge(date: Date): number {
  const lunarCycle = ANIMATION_CONFIG.LUNAR_CYCLE_DAYS
  const epoch = new Date(2000, 0, 6, 18, 14, 0).getTime() // Luna nova de referência
  const timeSincEpoch = (date.getTime() - epoch) / (1000 * 86400)
  return timeSincEpoch % lunarCycle
}

/**
 * Calcula o índice da fase lunar (0-7)
 * 0 = Nova, 1 = Crescente, 2 = Quarto Crescente, etc.
 */
export function calculateMoonPhaseIndex(date: Date): number {
  const lunarAge = calculateLunarAge(date)
  const lunarCycle = ANIMATION_CONFIG.LUNAR_CYCLE_DAYS
  const phaseIndex = Math.floor((lunarAge / lunarCycle) * MOON_PHASES.length) % MOON_PHASES.length
  return Math.max(0, phaseIndex)
}

/**
 * Calcula o percentual de iluminação da lua (0-100%)
 * Formula baseada em efemerídas astronômicas
 */
export function calculateMoonIllumination(date: Date): number {
  const phaseIndex = calculateMoonPhaseIndex(date)
  return Math.abs(Math.sin((phaseIndex * Math.PI) / 4)) * 100
}

/**
 * Determina o signo do zodíaco baseado na data
 */
export function getZodiacSignByDate(date: Date): string {
  const month = date.getMonth() + 1 // 1-12
  const day = date.getDate()

  // Define os intervalos de datas para cada signo
  if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return 'Áries'
  if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return 'Touro'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gêmeos'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Câncer'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leão'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgem'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpião'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitário'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricórnio'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquário'
  return 'Peixes' // 19 Fev - 20 Mar
}

/**
 * Obtém o objeto ZodiacSign completo para um nome de signo
 */
export function getZodiacSignByName(name: string) {
  return ZODIAC_SIGNS.find((z) => z.name === name)
}

/**
 * Calcula o ângulo de posição do signo zodiacal atual
 * Áries começa em ~0° (lado direito)
 * Retorna ângulo em graus (0-360)
 */
export function calculateZodiacAngle(date: Date): number {
  const month = date.getMonth() + 1 // 1-12
  const day = date.getDate()
  
  // Mapeamento de mês/dia para posição de signo
  // Janeiro=0°, cada mês ocupa 30°
  const monthAngle = ((month - 1) * 30) % 360
  
  // Ajuste fino baseado no dia (cada dia ~1°)
  const dayAngle = Math.floor((day - 1) / 1.25) // ~1° por dia
  
  // Áries começa em março (30° no calendário)
  // Deslocamos -90° para alinhar Áries com 0° (lado direito)
  return (monthAngle + dayAngle - 90 + 360) % 360
}

/**
 * Calcula o índice do signo (0-11) baseado na data
 */
export function getZodiacIndexByDate(date: Date): number {
  const angle = calculateZodiacAngle(date)
  return Math.floor(angle / 30) % 12
}

// ============================================================================
// CÁLCULOS DE TEMPO
// ============================================================================

/**
 * Calcula os ângulos dos ponteiros do relógio
 */
export interface ClockAngles {
  hour: number
  minute: number
  second: number
}

export function calculateClockAngles(date: Date): ClockAngles {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return {
    hour: (hour % 12) * 30 + minute * 0.5 + second * 0.00833, // 360°/12h = 30°/h
    minute: minute * 6 + second * 0.1, // 360°/60min = 6°/min
    second: second * 6, // 360°/60s = 6°/s
  }
}

/**
 * Retorna o dia da semana em português
 */
export function getDayOfWeek(date: Date): string {
  return DAYS_OF_WEEK[date.getDay()]
}

/**
 * Formata o tempo no padrão HH:MM:SS
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

/**
 * Formata a data em formato legível (ex: "23 de Abril de 2024")
 */
export function formatDate(date: Date): string {
  const day = date.getDate()
  const month = date.toLocaleString('pt-BR', { month: 'long' })
  const year = date.getFullYear()
  return `${day} de ${month} de ${year}`
}

// ============================================================================
// ESTADO COMPLETO DO RELÓGIO
// ============================================================================

/**
 * Calcula o estado completo do relógio astronômico
 */
export function getCurrentAstronomicalState(date: Date = new Date()): AstronomicalClockState {
  const angles = calculateClockAngles(date)
  const moonPhaseIndex = calculateMoonPhaseIndex(date)
  const zodiacSign = getZodiacSignByDate(date)
  const dayOfWeek = getDayOfWeek(date)

  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    moonPhase: moonPhaseIndex,
    zodiacSign,
    dayOfWeek,
  }
}

/**
 * Calcula informações detalhadas para exibição
 */
export interface DetailedAstronomicalInfo extends AstronomicalClockState {
  moonPhaseName: string
  moonIllumination: number
  formattedTime: string
  formattedDate: string
  zodiacSymbol: string
}

export function getDetailedAstronomicalInfo(date: Date = new Date()): DetailedAstronomicalInfo {
  const state = getCurrentAstronomicalState(date)
  const zodiacSign = getZodiacSignByName(state.zodiacSign)
  const moonPhaseName = MOON_PHASES[state.moonPhase]
  const moonIllumination = calculateMoonIllumination(date)

  return {
    ...state,
    moonPhaseName,
    moonIllumination,
    formattedTime: formatTime(date),
    formattedDate: formatDate(date),
    zodiacSymbol: zodiacSign?.symbol || '?',
  }
}

// ============================================================================
// VALIDAÇÕES E VERIFICAÇÕES
// ============================================================================

/**
 * Verifica se a data é válida
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Calcula a diferença em dias entre duas datas
 */
export function daysDifference(date1: Date, date2: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor((date2.getTime() - date1.getTime()) / msPerDay)
}

/**
 * Verifica se é uma data especial (aniversário, eclipsas teóricas, etc)
 */
export function isSpecialDate(date: Date): {
  isSpecial: boolean
  reason?: string
} {
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Solstícios e equinócios
  if ((month === 3 && day === 20) || (month === 3 && day === 21)) {
    return { isSpecial: true, reason: 'Equinócio da Primavera' }
  }
  if ((month === 6 && day === 20) || (month === 6 && day === 21)) {
    return { isSpecial: true, reason: 'Solstício de Verão' }
  }
  if ((month === 9 && day === 22) || (month === 9 && day === 23)) {
    return { isSpecial: true, reason: 'Equinócio do Outono' }
  }
  if ((month === 12 && day === 21) || (month === 12 && day === 22)) {
    return { isSpecial: true, reason: 'Solstício de Inverno' }
  }

  // Lua cheia (aproximado, 15º dia lunar)
  const lunarAge = calculateLunarAge(date)
  if (lunarAge > 13.5 && lunarAge < 15.5) {
    return { isSpecial: true, reason: 'Lua Cheia' }
  }

  // Lua nova
  if (lunarAge < 0.5 || lunarAge > 29) {
    return { isSpecial: true, reason: 'Lua Nova' }
  }

  return { isSpecial: false }
}
