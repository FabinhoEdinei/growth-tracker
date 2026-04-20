/**
 * @file AstronomicalClockBackground.tsx
 * @description Relógio astronômico otimizado para funcionar como background
 * Versão melhorada com detalhes mais fiéis ao Zytglogge real
 * Funciona com diálogos/conteúdo na frente
 */

'use client'

import React, { useMemo } from 'react'
import { useAstronomicalClock } from '../astronomical/useAstronomicalClock'
import { calculateClockAngles, calculateZodiacAngle, getZodiacIndexByDate } from '../astronomical/AstronomicalUtils'

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
  const currentDate = new Date(
    0,
    0,
    0,
    currentClockState.hour,
    currentClockState.minute,
    currentClockState.second,
  )
  
  // Calcular ângulos dos ponteiros
  const { hour: hourAngle, minute: minuteAngle, second: secondAngle } = useMemo(
    () => calculateClockAngles(currentDate),
    [currentClockState],
  )
  
  // Calcular ângulo do signo zodiacal atual (para deslocar o centro)
  const zodiacAngle = useMemo(
    () => calculateZodiacAngle(new Date()),
    [] // Só recalcular quando o dia muda
  )
  
  // Calcular posição do centro baseado no signo zodiacal
  const zodiacRadian = (zodiacAngle * Math.PI) / 180
  const centerOffsetX = 8 * Math.cos(zodiacRadian)
  const centerOffsetY = 8 * Math.sin(zodiacRadian)

  // Tamanhos mapeados
  const sizeMap = {
    sm: { container: 'w-48 h-48', svgSize: 200 },
    md: { container: 'w-96 h-96', svgSize: 400 },
    lg: { container: 'w-full h-screen', svgSize: 800 },
    full: { container: 'fixed inset-0 w-full h-full', svgSize: 1000 },
  }

  const positionMap = {
    center: 'fixed inset-0',
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

          {/* Filtros para profundidade 3D */}
          <filter id="depth">
            <feGaussianBlur stdDeviation="1" />
            <feOffset dx="1" dy="1" />
            <feComposite in="SourceGraphic" />
          </filter>

          <filter id="emboss">
            <feConvolveMatrix
              kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1"
              divisor="1"
              bias="0"
            />
          </filter>

          <filter id="innerShadow">
            <feFlood floodColor="#000" floodOpacity="0.3" />
            <feComposite in2="SourceGraphic" operator="atop" />
            <feGaussianBlur stdDeviation="2" />
            <feOffset dx="1" dy="1" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Fundo principal com textura e profundidade */}
        <circle
          cx="100"
          cy="100"
          r="98"
          fill={CLOCK_COLORS.darkRed}
          stroke={CLOCK_COLORS.gold}
          strokeWidth="2"
          filter="url(#innerShadow)"
        />

        {/* Gradiente sobre fundo com efeito 3D */}
        <circle cx="100" cy="100" r="98" fill="url(#clockMainGradient)" filter="url(#emboss)" />

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
          ][(i + 0) % 12] // Ordem correta: começa com XII no topo

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
            // Deslocar para que Áries fique à direita (3 o'clock)
            // Áries é o primeiro signo, então use i=3 para colocá-lo à direita
            const adjustedI = (i + 3) % 12
            const angle = (adjustedI * 360) / 12 - 90
            const radian = (angle * Math.PI) / 180
            const x = 100 + 68 * Math.cos(radian)
            const y = 100 + 68 * Math.sin(radian)

            const zodiacSymbols = [
              '♈', // Áries - i=0
              '♉', // Touro - i=1
              '♊', // Gêmeos - i=2
              '♋', // Câncer - i=3
              '♌', // Leão - i=4
              '♍', // Virgem - i=5
              '♎', // Libra - i=6
              '♏', // Escorpião - i=7
              '♐', // Sagitário - i=8
              '♑', // Capricórnio - i=9
              '♒', // Aquário - i=10
              '♓', // Peixes - i=11
            ]

            return (
              <text
                key={`zodiac-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight="bold"
                fill={CLOCK_COLORS.lightGold}
                opacity="0.85"
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

        {/* Centro com símbolo (Sol/Lua) com efeito 3D - deslocado para o signo */}
        <circle
          cx={100 + centerOffsetX}
          cy={100 + centerOffsetY}
          r="8"
          fill="#000"
          opacity="0.3"
          transform={`translate(1,1)`}
        />
        <circle
          cx={100 + centerOffsetX}
          cy={100 + centerOffsetY}
          r="6"
          fill={CLOCK_COLORS.gold}
          filter="url(#centerGlow)"
        />

        {/* Ponteiro das horas com sombra 3D */}
        <g transform={`rotate(${hourAngle} 100 100)`}>
          {/* Sombra */}
          <line
            x1="100"
            y1="100"
            x2="118"
            y2="100"
            stroke="#000"
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity="0.4"
            transform="translate(1,1)"
          />
          {/* Ponteiro principal */}
          <line
            x1="100"
            y1="100"
            x2="118"
            y2="100"
            stroke={CLOCK_COLORS.darkGold}
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#depth)"
          />
        </g>

        {/* Ponteiro dos minutos com sombra 3D */}
        <g transform={`rotate(${minuteAngle} 100 100)`}>
          {/* Sombra */}
          <line
            x1="100"
            y1="100"
            x2="125"
            y2="100"
            stroke="#000"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.4"
            transform="translate(1,1)"
          />
          {/* Ponteiro principal */}
          <line
            x1="100"
            y1="100"
            x2="125"
            y2="100"
            stroke={CLOCK_COLORS.darkGold}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#depth)"
          />
        </g>

        {/* Ponteiro dos segundos com sombra 3D */}
        <g transform={`rotate(${secondAngle} 100 100)`}>
          {/* Sombra */}
          <line
            x1="100"
            y1="100"
            x2="128"
            y2="100"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.4"
            transform="translate(1,1)"
          />
          {/* Ponteiro principal */}
          <line
            x1="100"
            y1="100"
            x2="128"
            y2="100"
            stroke={CLOCK_COLORS.cobaltBlue}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#depth)"
          />
        </g>

        {/* Diamante central (ornamentação real) com brilho - deslocado para o signo */}
        <circle
          cx={100 + centerOffsetX}
          cy={100 + centerOffsetY}
          r="3"
          fill={CLOCK_COLORS.lightGold}
          filter="url(#centerGlow)"
        />
      </svg>
    </div>
  )
}

export default AstronomicalClockBackground
