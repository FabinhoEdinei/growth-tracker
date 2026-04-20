/**
 * @file AstronomicalComponents.tsx
 * @description Componentes reutilizáveis para visualização de relógio astronômico
 * @author Fabio
 */

'use client'

import React from 'react'
import { MOON_PHASES, ZODIAC_SIGNS, COLOR_PALETTE } from './types'

// ============================================================================
// CLOCK HAND COMPONENT
// ============================================================================

export interface ClockHandProps {
  angle: number
  length: string // ex: "35%", "45%"
  width: string // ex: "3px", "2px"
  color: string
  label?: string
  delay?: number
}

export const ClockHand: React.FC<ClockHandProps> = ({
  angle,
  length,
  width,
  color,
  label,
  delay = 0,
}) => (
  <div
    className="absolute origin-bottom transition-transform duration-300"
    title={label}
    style={{
      transform: `rotate(${angle}deg)`,
      width: width,
      height: length,
      backgroundColor: color,
      left: '50%',
      bottom: '50%',
      marginLeft: `-${parseInt(width) / 2}px`,
      borderRadius: `${width}`,
      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
    }}
  />
)

// ============================================================================
// MOON PHASE DISPLAY
// ============================================================================

export interface MoonPhaseDisplayProps {
  phaseIndex: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showIllumination?: boolean
}

const MOON_SIZES = {
  sm: { container: 'w-12 h-12', text: 'text-xs' },
  md: { container: 'w-20 h-20', text: 'text-sm' },
  lg: { container: 'w-32 h-32', text: 'text-base' },
}

export const MoonPhaseDisplay: React.FC<MoonPhaseDisplayProps> = ({
  phaseIndex,
  size = 'md',
  showLabel = true,
  showIllumination = true,
}) => {
  const illumination = Math.abs(Math.sin((phaseIndex * Math.PI) / 4)) * 100
  const phaseName = MOON_PHASES[phaseIndex]
  const sizeConfig = MOON_SIZES[size]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${sizeConfig.container}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Base da lua */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill={COLOR_PALETTE.lightBg}
            stroke={COLOR_PALETTE.darkGold}
            strokeWidth="1"
          />

          {/* Cráteres lunares */}
          <circle cx="35" cy="30" r="3" fill={COLOR_PALETTE.gold} opacity="0.6" />
          <circle cx="60" cy="45" r="2" fill={COLOR_PALETTE.gold} opacity="0.6" />
          <circle cx="40" cy="65" r="2.5" fill={COLOR_PALETTE.gold} opacity="0.6" />

          {/* Sombra luna (fase) */}
          <ellipse
            cx="50"
            cy="50"
            rx={48 * Math.cos((phaseIndex * Math.PI) / 4)}
            ry="48"
            fill={COLOR_PALETTE.darkBg}
            opacity="0.4"
          />
        </svg>
      </div>

      {showLabel && (
        <div className="text-center">
          <p className={`font-serif font-bold text-gray-900 dark:text-gray-100 ${sizeConfig.text}`}>
            {phaseName}
          </p>
          {showIllumination && (
            <p className={`text-gray-500 dark:text-gray-400 ${sizeConfig.text}`}>
              {Math.round(illumination)}% iluminada
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ZODIAC DISPLAY
// ============================================================================

export interface ZodiacDisplayProps {
  signName: string
  size?: 'sm' | 'md' | 'lg'
  showDateRange?: boolean
  showSymbolOnly?: boolean
}

const ZODIAC_SIZES = {
  sm: { symbol: 'text-2xl', name: 'text-xs', range: 'text-xs' },
  md: { symbol: 'text-4xl', name: 'text-sm', range: 'text-xs' },
  lg: { symbol: 'text-6xl', name: 'text-base', range: 'text-sm' },
}

export const ZodiacDisplay: React.FC<ZodiacDisplayProps> = ({
  signName,
  size = 'md',
  showDateRange = true,
  showSymbolOnly = false,
}) => {
  const zodiac = ZODIAC_SIGNS.find((z) => z.name === signName)
  const sizeConfig = ZODIAC_SIZES[size]

  if (!zodiac) {
    return <div className="text-gray-500">Signo desconhecido</div>
  }

  if (showSymbolOnly) {
    return <div className={sizeConfig.symbol}>{zodiac.symbol}</div>
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={sizeConfig.symbol}>{zodiac.symbol}</div>
      <div className="text-center">
        <p className={`font-serif font-bold text-gray-800 dark:text-gray-200 ${sizeConfig.name}`}>
          {zodiac.name}
        </p>
        {showDateRange && (
          <p className={`text-gray-500 dark:text-gray-400 ${sizeConfig.range}`}>{zodiac.dateRange}</p>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// TIME DISPLAY
// ============================================================================

export interface TimeDisplayProps {
  hours: number
  minutes: number
  seconds: number
  format?: '12h' | '24h'
  showSeconds?: boolean
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  hours,
  minutes,
  seconds,
  format = '24h',
  showSeconds = true,
}) => {
  let displayHours = hours
  let period = ''

  if (format === '12h') {
    period = hours >= 12 ? 'PM' : 'AM'
    displayHours = hours % 12 || 12
  }

  const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${
    showSeconds ? `:${seconds.toString().padStart(2, '0')}` : ''
  }`

  return (
    <div className="text-center font-mono">
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{timeStr}</p>
      {period && <p className="text-xs text-gray-500 dark:text-gray-400">{period}</p>}
    </div>
  )
}

// ============================================================================
// INFO SECTION (Reutilizável)
// ============================================================================

export interface InfoSectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  variant?: 'default' | 'subtle' | 'highlight'
}

const SECTION_VARIANTS = {
  default: 'bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-900',
  subtle: 'bg-amber-50 dark:bg-gray-900 border-amber-100 dark:border-gray-800',
  highlight: 'bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-gray-700 dark:to-gray-800 border-amber-300 dark:border-yellow-700',
}

export const InfoSection: React.FC<InfoSectionProps> = ({
  icon,
  title,
  children,
  variant = 'default',
}) => (
  <div className={`rounded-lg p-4 md:p-6 border shadow-sm ${SECTION_VARIANTS[variant]}`}>
    <div className="flex items-center gap-2 mb-3">
      <div className="text-amber-700 dark:text-amber-400">{icon}</div>
      <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
        {title}
      </h3>
    </div>
    <div className="text-gray-700 dark:text-gray-300">{children}</div>
  </div>
)

// ============================================================================
// CHAPTER HEADER
// ============================================================================

export interface ChapterHeaderProps {
  number: number
  title: string
  subtitle: string
  description: string
  estimatedReadTime: string
  difficulty: string
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({
  number,
  title,
  subtitle,
  description,
  estimatedReadTime,
  difficulty,
}) => (
  <div className="text-center space-y-3 mb-8">
    <div className="flex items-center justify-center gap-2">
      <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full shadow-lg">
        <span className="text-white font-serif font-bold text-sm">
          {number > 9 ? number : number.toString().padStart(1, ' ')}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h1>
    </div>

    <p className="text-lg text-amber-700 dark:text-amber-300 font-serif italic">{subtitle}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{description}</p>

    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 flex-wrap">
      <span className="flex items-center gap-1">
        <span className="text-lg">📖</span>
        {estimatedReadTime}
      </span>
      <span>•</span>
      <span>{difficulty}</span>
    </div>
  </div>
)

// ============================================================================
// NAVIGATION BUTTONS
// ============================================================================

export interface NavigationButtonsProps {
  onPrevious?: () => void
  onNext?: () => void
  currentChapter?: number
  totalChapters?: number
  isLoading?: boolean
  hidePrevious?: boolean
  hideNext?: boolean
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  currentChapter = 1,
  totalChapters = 12,
  isLoading = false,
  hidePrevious = false,
  hideNext = false,
}) => (
  <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
    {!hidePrevious ? (
      <button
        onClick={onPrevious}
        disabled={isLoading || currentChapter === 1}
        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-amber-200 dark:border-amber-900 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-serif font-bold text-gray-900 dark:text-gray-100"
      >
        <span>←</span> Anterior
      </button>
    ) : (
      <div />
    )}

    <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        Capítulo {currentChapter} de {totalChapters}
      </p>
    </div>

    {!hideNext ? (
      <button
        onClick={onNext}
        disabled={isLoading || currentChapter === totalChapters}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-serif font-bold"
      >
        Próximo <span>→</span>
      </button>
    ) : (
      <div />
    )}
  </div>
)

// ============================================================================
// DIVIDER ORNAMENTAL
// ============================================================================

export interface OrnamentalDividerProps {
  variant?: 'thin' | 'medium' | 'thick'
  style?: 'line' | 'dots' | 'symbols'
  className?: string
}

export const OrnamentalDivider: React.FC<OrnamentalDividerProps> = ({
  variant = 'medium',
  style = 'line',
  className = '',
}) => {
  const heightMap = {
    thin: 'h-px',
    medium: 'h-0.5',
    thick: 'h-1',
  }

  if (style === 'symbols') {
    return (
      <div className={`flex items-center justify-center gap-4 my-6 ${className}`}>
        <div className={`flex-1 ${heightMap[variant]} bg-amber-200 dark:bg-amber-900`} />
        <span className="text-amber-700 dark:text-amber-400 text-lg">✦</span>
        <div className={`flex-1 ${heightMap[variant]} bg-amber-200 dark:bg-amber-900`} />
      </div>
    )
  }

  if (style === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-2 my-6 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-amber-400 dark:bg-amber-600 rounded-full" />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${heightMap[variant]} bg-gradient-to-r from-transparent via-amber-200 to-transparent dark:via-amber-900 my-6 ${className}`}
    />
  )
}
