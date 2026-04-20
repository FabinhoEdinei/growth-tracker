/**
 * @file Chapter4Screen.tsx
 * @description Componente principal para exibição do Capítulo 4
 * com relógio astronômico medieval
 * @author Fabio
 */

'use client'

import React, { useState } from 'react'
import { useAstronomicalClock } from './useAstronomicalClock'
import {
  ClockHand,
  MoonPhaseDisplay,
  ZodiacDisplay,
  InfoSection,
  ChapterHeader,
  NavigationButtons,
  OrnamentalDivider,
} from './AstronomicalComponents'
import { calculateClockAngles } from './AstronomicalUtils'
import { CHAPTERS_METADATA, COLOR_PALETTE } from './types'

// ============================================================================
// ASTRONOMICAL CLOCK COMPONENT
// ============================================================================

interface AstronomicalClockProps {
  clockState: any
  currentDate: Date
}

const AstronomicalClockDisplay: React.FC<AstronomicalClockProps> = ({
  clockState,
  currentDate,
}) => {
  const angles = calculateClockAngles(currentDate)

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Fundo do relógio com padrão medieval */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
        {/* Círculo externo ornamentado */}
        <circle
          cx="100"
          cy="100"
          r="98"
          fill="url(#clockGradient)"
          stroke={COLOR_PALETTE.darkGold}
          strokeWidth="2"
        />

        {/* Números romanos */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12 - 90
          const radian = (angle * Math.PI) / 180
          const x = 100 + 75 * Math.cos(radian)
          const y = 100 + 75 * Math.sin(radian)
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
              fontSize="10"
              fontWeight="bold"
              fill={COLOR_PALETTE.darkBrown}
              fontFamily="serif"
            >
              {roman}
            </text>
          )
        })}

        {/* Marcadores de horas */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12 - 90
          const radian = (angle * Math.PI) / 180
          const x1 = 100 + 90 * Math.cos(radian)
          const y1 = 100 + 90 * Math.sin(radian)
          const x2 = 100 + 85 * Math.cos(radian)
          const y2 = 100 + 85 * Math.sin(radian)

          return (
            <line
              key={`marker-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={COLOR_PALETTE.darkGold}
              strokeWidth="1.5"
            />
          )
        })}

        {/* Anel zodiacal */}
        <circle
          cx="100"
          cy="100"
          r="55"
          fill="none"
          stroke={COLOR_PALETTE.gold}
          strokeWidth="0.5"
          opacity="0.6"
        />
        <circle
          cx="100"
          cy="100"
          r="65"
          fill="none"
          stroke={COLOR_PALETTE.darkGold}
          strokeWidth="0.5"
          opacity="0.4"
        />

        {/* Gradiente */}
        <defs>
          <radialGradient id="clockGradient">
            <stop offset="0%" stopColor="#FFF8DC" />
            <stop offset="100%" stopColor="#E8D5B5" />
          </radialGradient>
        </defs>
      </svg>

      {/* Centro e ponteiros */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 bg-gradient-to-br from-amber-700 to-yellow-900 rounded-full shadow-lg z-20" />

        <div className="absolute w-24 h-24 md:w-32 md:h-32 z-10">
          <ClockHand angle={angles.hour} length="35%" width="3px" color={COLOR_PALETTE.darkBrown} label="Hora" />
          <ClockHand angle={angles.minute} length="45%" width="2px" color={COLOR_PALETTE.mediumBrown} label="Minuto" />
          <ClockHand angle={angles.second} length="50%" width="1px" color={COLOR_PALETTE.gold} label="Segundo" />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN CHAPTER SCREEN COMPONENT
// ============================================================================

interface Chapter4ScreenProps {
  chapterNumber?: number
  onNavigate?: (direction: 'prev' | 'next') => Promise<void> | void
}

export const Chapter4Screen: React.FC<Chapter4ScreenProps> = ({
  chapterNumber = 4,
  onNavigate,
}) => {
  const { clockState, detailedInfo, isUpdating, pause, resume } =
    useAstronomicalClock({
      autoUpdate: true,
      updateInterval: 1000,
    })

  const [isNavigating, setIsNavigating] = useState(false)
  const chapterMetadata = CHAPTERS_METADATA[chapterNumber] || CHAPTERS_METADATA[4]

  const handleNavigate = async (direction: 'prev' | 'next') => {
    setIsNavigating(true)
    try {
      if (onNavigate) {
        await Promise.resolve(onNavigate(direction))
      }
    } finally {
      setIsNavigating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Padrão ornamental sutil */}
      <div
        className="fixed inset-0 opacity-5 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139, 111, 71, .1) 10px, rgba(139, 111, 71, .1) 20px)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Header */}
        <ChapterHeader
          number={chapterMetadata.number}
          title={chapterMetadata.title}
          subtitle={chapterMetadata.subtitle}
          description={chapterMetadata.description}
          estimatedReadTime={chapterMetadata.estimatedReadTime}
          difficulty={chapterMetadata.difficulty}
        />

        {/* Relógio Astronômico Principal */}
        <div className="mb-12 flex justify-center animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border-2 border-amber-200 dark:border-amber-900 backdrop-blur-sm">
            <AstronomicalClockDisplay clockState={clockState} currentDate={new Date()} />
          </div>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <InfoSection icon={<span className="text-2xl">🌙</span>} title="Fase Lunar">
            <MoonPhaseDisplay
              phaseIndex={clockState.moonPhase}
              size="md"
              showLabel={true}
              showIllumination={true}
            />
          </InfoSection>

          <InfoSection icon={<span className="text-2xl">⭐</span>} title="Zodíaco">
            <ZodiacDisplay
              signName={clockState.zodiacSign}
              size="md"
              showDateRange={true}
              showSymbolOnly={false}
            />
          </InfoSection>

          <InfoSection icon={<span className="text-2xl">📅</span>} title="Tempo Atual">
            <div className="space-y-3 text-center">
              <div>
                <p className="text-sm font-serif text-gray-700 dark:text-gray-300 mb-1">
                  {clockState.dayOfWeek}
                </p>
                <p className="font-mono text-lg font-bold text-amber-700 dark:text-amber-400">
                  {detailedInfo.formattedTime}
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {detailedInfo.formattedDate}
              </div>
            </div>
          </InfoSection>
        </div>

        <OrnamentalDivider variant="medium" style="symbols" />

        {/* Descrição expandida */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8 border border-amber-200 dark:border-amber-900 shadow-sm mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sobre este Capítulo
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Os relógios astronômicos medievais representam uma das maiores conquistas da
              engenharia antiga. Combinando precisão matemática com artesanato refinado, esses
              mecanismos não apenas marcavam as horas, mas também rastreavam os movimentos
              celestiais que guiavam a vida medieval.
            </p>

            <p>
              O mais famoso deles, o <strong>Zytglogge de Berna</strong>, construído no século XVI,
              continua funcionando com sua precisão original. Este relógio mostra:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Horas e minutos:</strong> Medidas através de um complexo sistema de
                engrenagens
              </li>
              <li>
                <strong>Fases lunares:</strong> Calculadas com precisão astronômica notável
              </li>
              <li>
                <strong>Signos do zodíaco:</strong> Representando a posição do sol no eclíptica
              </li>
              <li>
                <strong>Dias da semana:</strong> Ciclos perpétuos do tempo gregoriano
              </li>
            </ul>

            <p>
              Neste capítulo, exploraremos os componentes fundamentais desses relógios: o
              mecanismo de engrenagens, o sistema lunar, o zodíaco eterno e como cada elemento
              se conecta em harmonia perfeita. Prepare-se para uma jornada através do tempo.
            </p>
          </div>
        </div>

        {/* Controles Técnicos (Desenvolvimento) */}
        <div className="bg-amber-100 dark:bg-gray-700 rounded-lg p-4 mb-12 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <span className="text-gray-800 dark:text-gray-200">
                Relógio {isUpdating ? 'ao vivo' : 'pausado'}
              </span>
            </div>
            <button
              onClick={isUpdating ? pause : resume}
              className="px-3 py-1 bg-white dark:bg-gray-600 rounded text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
            >
              {isUpdating ? 'Pausar' : 'Retomar'}
            </button>
          </div>
        </div>

        {/* Navegação */}
        <NavigationButtons
          onPrevious={() => handleNavigate('prev')}
          onNext={() => handleNavigate('next')}
          currentChapter={chapterNumber}
          totalChapters={12}
          isLoading={isNavigating}
        />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        :global(html) {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}

export default Chapter4Screen
