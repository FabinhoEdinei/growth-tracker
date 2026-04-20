/**
 * @file AstronomicalClockBackground.tsx
 * @description Relógio astronômico otimizado para funcionar como background
 * Versão melhorada com detalhes mais fiéis ao Zytglogge real
 * Funciona com diálogos/conteúdo na frente
 */

'use client'

import React, { useMemo } from 'react'
import { useAstronomicalClock } from '../astronomical/useAstronomicalClock'
import { calculateClockAngles } from '../astronomical/AstronomicalUtils'

interface AstronomicalClockBackgroundProps {
  size?: 'sm' | 'md' | 'lg' | 'full'
  opacity?: number // 0-1
  position?: 'center' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  capId?: string
  dark?: boolean
  clockState?: {
    hour: number
    minute: number
    second: number
  }
  showZodiac?: boolean
  blur?: boolean
}

// Paleta de cores FIEL ao Zytglogge real
const CLOCK_COLORS = {
  // Ouro real (mais brilhante)
  gold: '#E8B923',
  darkGold: '#B8860B',
  lightGold: '#FFD700',
  
  // Vermelho-marrom (cor do painel)
  darkRed: '#8B4513',
  mediumRed: '#A0522D',
  
  // Azul cobalto (anel zodiacal)
  cobaltBlue: '#003A8F',
  skyBlue: '#4169E1',
  
  // Marrom-verde (fundo)
  oakGreen: '#556B2F',
  stoneGray: '#708090',
  
  // Preto para sombreamento
  darkShadow: '#1A1A1A',
  mediumShadow: '#3A3A3A',
}

export const AstronomicalClockBackground: React.FC<
  AstronomicalClockBackgroundProps
> = ({
  size = 'full',
  opacity = 0.15,
  position = 'center',
  capId,
  dark = false,
  clockState,
  showZodiac = true,
  blur = false,
}) => {
  // Use hook if no clockState provided
  const { clockState: liveClockState } = useAstronomicalClock({
    autoUpdate: !clockState,
    updateInterval: 1000,
  })
  const currentClockState = clockState || liveClockState
  // Calcular ângulos
  const { hour: hourAngle, minute: minuteAngle, second: secondAngle } = useMemo(
    () =>
      calculateClockAngles(
        new Date(
          0,
          0,
          0,
          currentClockState.hour,
          currentClockState.minute,
          currentClockState.second,
        ),
      ),
    [currentClockState],
  )

  // Tamanhos mapeados
  const sizeMap = {
    sm: { container: 'w-48 h-48', svgSize: 200 },
    md: { container: 'w-96 h-96', svgSize: 400 },
    lg: { container: 'w-full h-screen', svgSize: 800 },
    full: { container: 'fixed inset-0 w-full h-full', svgSize: 1000 },
  }

  const positionMap = {
    center: 'absolute inset-0 flex items-center justify-center',
    'top-right': 'absolute top-0 right-0',
    'top-left': 'absolute top-0 left-0',
    'bottom-right': 'absolute bottom-0 right-0',
    'bottom-left': 'absolute bottom-0 left-0',
  }

  const config = sizeMap[size]

  return (
    <div
      className={`${positionMap[position]} pointer-events-none overflow-hidden`}
      style={{
        opacity,
        filter: blur ? 'blur(2px)' : 'none',
        background: dark ? 'rgba(8, 10, 16, 0.08)' : 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className={config.container}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradientes realistas */}
          <radialGradient id="clockMainGradient" cx="40%" cy="40%">
            <stop offset="0%" stopColor={CLOCK_COLORS.lightGold} stopOpacity="0.4" />
            <stop offset="50%" stopColor={CLOCK_COLORS.gold} stopOpacity="0.3" />
            <stop offset="100%" stopColor={CLOCK_COLORS.darkGold} stopOpacity="0.2" />
          </radialGradient>

          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor={CLOCK_COLORS.gold} />
            <stop offset="100%" stopColor={CLOCK_COLORS.darkGold} />
          </radialGradient>

          {/* Padrão texturizado */}
          <filter id="texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>

          {/* Sombra para profundidade */}
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Fundo principal com textura */}
        <circle
          cx="100"
          cy="100"
          r="98"
          fill={CLOCK_COLORS.darkRed}
          stroke={CLOCK_COLORS.gold}
          strokeWidth="2"
          filter="url(#texture)"
        />

        {/* Gradiente sobre fundo */}
        <circle cx="100" cy="100" r="98" fill="url(#clockMainGradient)" />

        {/* Anel externo (ouro) */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke={CLOCK_COLORS.gold}
          strokeWidth="2"
        />

        {/* Números romanos com estilo melhorado */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12 - 90
          const radian = (angle * Math.PI) / 180
          const x = 100 + 72 * Math.cos(radian)
          const y = 100 + 72 * Math.sin(radian)
          const roman = [
            'XII',
            'I',
            'II',
            'III',
            'IV',
            'V',
            'VI',
            'VII',
            'VIII',
            'IX',
            'X',
            'XI',
          ][i]

          return (
            <text
              key={`roman-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fontWeight="bold"
              fill={CLOCK_COLORS.gold}
              fontFamily="serif"
              opacity="0.8"
              filter="url(#shadow)"
            >
              {roman}
            </text>
          )
        })}

        {/* Marcadores de hora com detalhes */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12 - 90
          const radian = (angle * Math.PI) / 180
          const x1 = 100 + 88 * Math.cos(radian)
          const y1 = 100 + 88 * Math.sin(radian)
          const x2 = 100 + 83 * Math.cos(radian)
          const y2 = 100 + 83 * Math.sin(radian)

          // A cada 3 horas, marca mais grossa
          const isMainHour = i % 3 === 0

          return (
            <line
              key={`marker-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={CLOCK_COLORS.gold}
              strokeWidth={isMainHour ? '2' : '1'}
              opacity="0.9"
            />
          )
        })}

        {/* Anel zodiacal (azul cobalto) */}
        <circle
          cx="100"
          cy="100"
          r="62"
          fill="none"
          stroke={CLOCK_COLORS.cobaltBlue}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Símbolos zodiacais ao redor (simplificado) */}
        {showZodiac &&
          [...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12 - 90
            const radian = (angle * Math.PI) / 180
            const x = 100 + 68 * Math.cos(radian)
            const y = 100 + 68 * Math.sin(radian)

            const zodiacSymbols = [
              '♈',
              '♉',
              '♊',
              '♋',
              '♌',
              '♍',
              '♎',
              '♏',
              '♐',
              '♑',
              '♒',
              '♓',
            ]

            return (
              <text
                key={`zodiac-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7"
                fill={CLOCK_COLORS.skyBlue}
                opacity="0.7"
              >
                {zodiacSymbols[i]}
              </text>
            )
          })}

        {/* Anel interno (vermelho-marrom) */}
        <circle
          cx="100"
          cy="100"
          r="50"
          fill={CLOCK_COLORS.mediumRed}
          stroke={CLOCK_COLORS.darkGold}
          strokeWidth="1"
        />

        {/* Linhas de divisão (12 setores) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12 - 90
          const radian = (angle * Math.PI) / 180
          const x1 = 100 + 50 * Math.cos(radian)
          const y1 = 100 + 50 * Math.sin(radian)
          const x2 = 100 + 30 * Math.cos(radian)
          const y2 = 100 + 30 * Math.sin(radian)

          return (
            <line
              key={`sector-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={CLOCK_COLORS.darkGold}
              strokeWidth="0.5"
              opacity="0.5"
            />
          )
        })}

        {/* Círculo central decorativo */}
        <circle
          cx="100"
          cy="100"
          r="28"
          fill={CLOCK_COLORS.stoneGray}
          stroke={CLOCK_COLORS.gold}
          strokeWidth="1.5"
        />

        {/* Centro com símbolo (Sol/Lua) */}
        <circle cx="100" cy="100" r="6" fill={CLOCK_COLORS.gold} filter="url(#shadow)" />

        {/* Ponteiro das horas */}
        <g transform={`rotate(${hourAngle} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="118"
            y2="100"
            stroke={CLOCK_COLORS.darkGold}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>

        {/* Ponteiro dos minutos */}
        <g transform={`rotate(${minuteAngle} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="125"
            y2="100"
            stroke={CLOCK_COLORS.darkGold}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* Ponteiro dos segundos (sutil) */}
        <g transform={`rotate(${secondAngle} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="128"
            y2="100"
            stroke={CLOCK_COLORS.cobaltBlue}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* Diamante central (ornamentação real) */}
        <circle cx="100" cy="100" r="3" fill={CLOCK_COLORS.lightGold} />
      </svg>
    </div>
  )
}

export default AstronomicalClockBackground
