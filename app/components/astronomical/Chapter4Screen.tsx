/**
 * @file Chapter4Screen.tsx
 * @description Componente principal para exibição do Capítulo 4
 * com relógio astronômico medieval em estilo 2D de game
 * @author Fabio
 */

'use client'

import React, { useState, useEffect } from 'react'
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
// ASTRONOMICAL CLOCK BACKGROUND COMPONENT
// ============================================================================

interface AstronomicalClockBackgroundProps {
  clockState: any
  currentDate: Date
}

const AstronomicalClockBackground: React.FC<AstronomicalClockBackgroundProps> = ({
  clockState,
  currentDate,
}) => {
  const angles = calculateClockAngles(currentDate)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {/* Camada de profundidade - atmosfera escura para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-amber-950/40 to-gray-900/80 z-10" />
      
      {/* Partículas flutuantes estilo game */}
      <div className="absolute inset-0 z-0">
        {mounted && [...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-amber-200/20 animate-float"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Relógio Astronômico como cenário principal */}
      <div className="relative z-0 scale-150 md:scale-[2.5] lg:scale-[3] opacity-30 dark:opacity-25">
        <svg
          className="w-[500px] h-[500px] md:w-[600px] md:h-[600px]"
          viewBox="0 0 200 200"
          style={{ filter: 'drop-shadow(0 0 30px rgba(218, 165, 32, 0.3))' }}
        >
          {/* Fundo do relógio com textura de pedra medieval */}
          <defs>
            <radialGradient id="clockBgGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2C1810" />
              <stop offset="60%" stopColor="#1A0F08" />
              <stop offset="100%" stopColor="#0D0704" />
            </radialGradient>
            
            <radialGradient id="clockFaceGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3D2817" />
              <stop offset="100%" stopColor="#1C1109" />
            </radialGradient>

            <pattern id="stoneTexture" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#2C1810" />
              <circle cx="1" cy="1" r="0.5" fill="#3D2817" opacity="0.5" />
              <circle cx="3" cy="3" r="0.5" fill="#1A0F08" opacity="0.5" />
            </pattern>

            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="innerShadow">
              <feOffset dx="0" dy="1" />
              <feGaussianBlur stdDeviation="1" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.6" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Círculo externo - moldura de pedra */}
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="url(#stoneTexture)"
            stroke="#8B6914"
            strokeWidth="3"
            filter="url(#innerShadow)"
          />
          
          {/* Borda ornamental dupla */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="#B8860B"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#DAA520"
            strokeWidth="0.4"
            opacity="0.4"
          />

          {/* Face do relógio */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="url(#clockFaceGradient)"
            stroke="#4A3728"
            strokeWidth="1"
          />

          {/* Anel externo com números romanos */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12 - 90
            const radian = (angle * Math.PI) / 180
            const x = 100 + 78 * Math.cos(radian)
            const y = 100 + 78 * Math.sin(radian)
            const roman = [
              'XII', 'I', 'II', 'III', 'IV', 'V',
              'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
            ][i]

            return (
              <text
                key={`roman-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight="bold"
                fill="#DAA520"
                fontFamily="serif"
                opacity="0.8"
              >
                {roman}
              </text>
            )
          })}

          {/* Marcadores de horas ornamentados */}
          {[...Array(60)].map((_, i) => {
            const angle = (i * 360) / 60 - 90
            const radian = (angle * Math.PI) / 180
            const isHour = i % 5 === 0
            const outerR = isHour ? 92 : 90
            const innerR = isHour ? 86 : 88
            const x1 = 100 + outerR * Math.cos(radian)
            const y1 = 100 + outerR * Math.sin(radian)
            const x2 = 100 + innerR * Math.cos(radian)
            const y2 = 100 + innerR * Math.sin(radian)

            return (
              <line
                key={`marker-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHour ? '#DAA520' : '#8B6914'}
                strokeWidth={isHour ? '1.5' : '0.5'}
                opacity={isHour ? '0.9' : '0.4'}
              />
            )
          })}

          {/* Anéis zodiacais concêntricos */}
          <circle
            cx="100"
            cy="100"
            r="65"
            fill="none"
            stroke="#B8860B"
            strokeWidth="0.8"
            opacity="0.5"
            strokeDasharray="2 4"
          />
          <circle
            cx="100"
            cy="100"
            r="55"
            fill="none"
            stroke="#DAA520"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <circle
            cx="100"
            cy="100"
            r="45"
            fill="none"
            stroke="#8B6914"
            strokeWidth="0.3"
            opacity="0.4"
            strokeDasharray="1 3"
          />

          {/* Símbolos zodiacais simplificados */}
          {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((sign, i) => {
            const angle = (i * 360) / 12 - 75
            const radian = (angle * Math.PI) / 180
            const x = 100 + 60 * Math.cos(radian)
            const y = 100 + 60 * Math.sin(radian)

            return (
              <text
                key={`zodiac-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="6"
                fill="#CD853F"
                opacity="0.6"
              >
                {sign}
              </text>
            )
          })}

          {/* Ponteiros do relógio */}
          {/* Ponteiro das horas */}
          <line
            x1="100"
            y1="100"
            x2={100 + 40 * Math.cos((angles.hour - 90) * Math.PI / 180)}
            y2={100 + 40 * Math.sin((angles.hour - 90) * Math.PI / 180)}
            stroke="#DAA520"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          
          {/* Ponteiro dos minutos */}
          <line
            x1="100"
            y1="100"
            x2={100 + 55 * Math.cos((angles.minute - 90) * Math.PI / 180)}
            y2={100 + 55 * Math.sin((angles.minute - 90) * Math.PI / 180)}
            stroke="#B8860B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Ponteiro dos segundos */}
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((angles.second - 90) * Math.PI / 180)}
            y2={100 + 60 * Math.sin((angles.second - 90) * Math.PI / 180)}
            stroke="#FFD700"
            strokeWidth="0.5"
            opacity="0.7"
          />

          {/* Centro do relógio */}
          <circle cx="100" cy="100" r="4" fill="#DAA520" filter="url(#glow)" />
          <circle cx="100" cy="100" r="2" fill="#2C1810" />

          {/* Fase lunar no canto */}
          <g transform="translate(160, 40)">
            <circle cx="0" cy="0" r="12" fill="#1A0F08" stroke="#B8860B" strokeWidth="0.5" />
            <path
              d={`M 0 -12 A 12 12 0 1 1 0 12 A ${12 * Math.abs(Math.cos((clockState.moonPhase || 0) * Math.PI))} 12 0 1 0 0 -12`}
              fill="#DAA520"
              opacity="0.6"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

// ============================================================================
// GAME-STYLE UI PANEL COMPONENT
// ============================================================================

interface GamePanelProps {
  children: React.ReactNode
  title?: string
  icon?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'dark'
}

const GamePanel: React.FC<GamePanelProps> = ({
  children,
  title,
  icon,
  className = '',
  variant = 'primary',
}) => {
  const variants = {
    primary: 'bg-gray-900/85 border-amber-700/50 text-amber-100',
    secondary: 'bg-amber-950/80 border-amber-600/40 text-amber-200',
    dark: 'bg-black/80 border-gray-700/50 text-gray-300',
  }

  return (
    <div
      className={`relative backdrop-blur-md rounded-lg border-2 ${variants[variant]} shadow-2xl ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Cantos ornamentados estilo game RPG */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-500/60 rounded-tl" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-500/60 rounded-tr" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-500/60 rounded-bl" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-500/60 rounded-br" />

      {title && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-amber-700/30 bg-gradient-to-r from-amber-900/20 to-transparent">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-amber-400">
            {title}
          </h3>
        </div>
      )}

      <div className="p-4">{children}</div>
    </div>
  )
}

// ============================================================================
// MAIN CHAPTER SCREEN COMPONENT - GAME STYLE
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
  const [showDebug, setShowDebug] = useState(false)
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
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* RELÓGIO ASTRONÔMICO COMO CENÁRIO DE FUNDO */}
      <AstronomicalClockBackground clockState={clockState} currentDate={new Date()} />

      {/* CONTEÚDO DO GAME - INTERFACE SOBREPOSTA */}
      <div className="relative z-20 min-h-screen flex flex-col">
        
        {/* HUD Superior - Status do Capítulo */}
        <header className="px-4 py-3 bg-gradient-to-b from-black/90 to-black/50 backdrop-blur-sm border-b border-amber-800/30">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-amber-900/50">
                <span className="font-serif font-bold text-amber-100 text-lg">IV</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-amber-400 text-lg leading-tight">
                  {chapterMetadata.title}
                </h1>
                <p className="text-xs text-amber-600/80 font-mono uppercase tracking-widest">
                  Capítulo {chapterNumber} de 12
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Barra de progresso estilo game */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-amber-600 font-mono">PROGRESSO</span>
                <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                    style={{ width: `${(chapterNumber / 12) * 100}%` }}
                  />
                </div>
              </div>

              {/* Hora atual no HUD */}
              <div className="text-right">
                <div className="font-mono text-amber-400 text-sm font-bold">
                  {detailedInfo.formattedTime}
                </div>
                <div className="text-[10px] text-amber-700 font-mono uppercase">
                  {clockState.zodiacSign}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Área Principal - Layout de Game */}
        <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Coluna Esquerda - Informações do Capítulo */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Painel Principal do Capítulo */}
            <GamePanel title="Descrição do Capítulo" icon="📜" variant="primary">
              <div className="space-y-4 text-amber-100/90 leading-relaxed">
                <p className="text-lg font-serif text-amber-200">
                  {chapterMetadata.description}
                </p>
                
                <div className="border-l-2 border-amber-600/50 pl-4 my-4">
                  <p className="italic text-amber-300/80">
                    "O tempo é o fogo em que queimamos, e o relógio astronômico é o mapa 
                    das estrelas que nos guia através das eras."
                  </p>
                </div>

                <p>
                  Os relógios astronômicos medievais representam uma das maiores conquistas da
                  engenharia antiga. Combinando precisão matemática com artesanato refinado, esses
                  mecanismos não apenas marcavam as horas, mas também rastreavam os movimentos
                  celestiais que guiavam a vida medieval.
                </p>

                <p>
                  O mais famoso deles, o <strong className="text-amber-400">Zytglogge de Berna</strong>, 
                  construído no século XVI, continua funcionando com sua precisão original.
                </p>
              </div>
            </GamePanel>

            {/* Grid de Objetivos/Conteúdo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GamePanel title="Mecanismos" icon="⚙️" variant="secondary">
                <ul className="space-y-3">
                  {[
                    { label: 'Engrenagens', desc: 'Sistema de rodas dentadas', status: 'active' },
                    { label: 'Escape', desc: 'Regulador de velocidade', status: 'locked' },
                    { label: 'Cordas', desc: 'Transmissão de força', status: 'locked' },
                    { label: 'Pêndulo', desc: 'Oscilador principal', status: 'locked' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 group cursor-pointer">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'active' ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 'bg-gray-600'
                      }`} />
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${
                          item.status === 'active' ? 'text-amber-200' : 'text-gray-500'
                        }`}>
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                      {item.status === 'locked' && (
                        <span className="text-xs text-gray-600">🔒</span>
                      )}
                    </li>
                  ))}
                </ul>
              </GamePanel>

              <GamePanel title="Ciclos Celestiais" icon="🌙" variant="secondary">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 bg-amber-950/30 rounded border border-amber-800/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌙</span>
                      <div>
                        <div className="text-sm font-semibold text-amber-200">Fase Lunar</div>
                        <div className="text-xs text-amber-600">Ciclo atual</div>
                      </div>
                    </div>
                    <MoonPhaseDisplay
                      phaseIndex={clockState.moonPhase}
                      size="sm"
                      showLabel={false}
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-amber-950/30 rounded border border-amber-800/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      <div>
                        <div className="text-sm font-semibold text-amber-200">Zodíaco</div>
                        <div className="text-xs text-amber-600">Posição solar</div>
                      </div>
                    </div>
                    <ZodiacDisplay
                      signName={clockState.zodiacSign}
                      size="sm"
                      showSymbolOnly={true}
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-amber-950/30 rounded border border-amber-800/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📅</span>
                      <div>
                        <div className="text-sm font-semibold text-amber-200">Dia da Semana</div>
                        <div className="text-xs text-amber-600">Calendário perpétuo</div>
                      </div>
                    </div>
                    <span className="font-mono text-amber-400 text-sm">
                      {clockState.dayOfWeek}
                    </span>
                  </div>
                </div>
              </GamePanel>
            </div>

            {/* Painel de Lore/Descrição Expandida */}
            <GamePanel title="Lore do Mundo" icon="🏛️" variant="dark">
              <div className="prose prose-invert prose-amber max-w-none">
                <p className="text-gray-300">
                  Neste capítulo, exploraremos os componentes fundamentais desses relógios: o
                  mecanismo de engrenagens, o sistema lunar, o zodíaco eterno e como cada elemento
                  se conecta em harmonia perfeita. Prepare-se para uma jornada através do tempo.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {[
                    { icon: '⏰', label: 'Horas', value: 'Sistema de 12h' },
                    { icon: '🌑', label: 'Lua', value: '29.5 dias' },
                    { icon: '♈', label: 'Zodíaco', value: '12 signos' },
                    { icon: '📆', label: 'Calendário', value: 'Gregoriano' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-2 bg-gray-800/50 rounded border border-gray-700/50">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-xs text-gray-500 uppercase">{stat.label}</div>
                      <div className="text-sm font-mono text-amber-400">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </GamePanel>
          </div>

          {/* Coluna Direita - Sidebar estilo game */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Mini-mapa / Radar do Relógio */}
            <GamePanel title="Radar Astronômico" icon="🎯" variant="secondary">
              <div className="aspect-square relative bg-gray-900 rounded border border-amber-800/30 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Círculos de radar */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.3" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.3" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="#B8860B" strokeWidth="0.3" opacity="0.3" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="#B8860B" strokeWidth="0.3" opacity="0.3" />
                  
                  {/* Ponto pulsante no centro */}
                  <circle cx="50" cy="50" r="2" fill="#DAA520">
                    <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
                
                {/* Overlay de status */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-amber-600">
                  <span>LAT: 46.948°N</span>
                  <span>BERNA</span>
                </div>
              </div>
            </GamePanel>

            {/* Status do Relógio */}
            <GamePanel title="Status do Mecanismo" icon="⚡" variant="primary">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Estado</span>
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                    isUpdating 
                      ? 'bg-green-900/50 text-green-400 border border-green-700/50' 
                      : 'bg-red-900/50 text-red-400 border border-red-700/50'
                  }`}>
                    {isUpdating ? 'ONLINE' : 'PAUSADO'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Precisão</span>
                  <span className="font-mono text-amber-400">99.8%</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Engrenagens</span>
                  <span className="font-mono text-amber-400">Active</span>
                </div>

                <button
                  onClick={isUpdating ? pause : resume}
                  className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-100 text-sm font-semibold rounded border border-amber-600/50 transition-all active:scale-95"
                >
                  {isUpdating ? '⏸ Pausar Mecanismo' : '▶ Retomar Mecanismo'}
                </button>
              </div>
            </GamePanel>

            {/* Dica/Tooltip */}
            <div className="p-3 bg-amber-950/40 border border-amber-800/30 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 text-lg">💡</span>
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  <strong className="text-amber-400">Dica:</strong> Observe o relógio ao fundo. 
                  As engrenagens se movem em sincronia com o tempo real. Cada ciclo completo 
                  representa uma hora no mundo medieval.
                </p>
              </div>
            </div>

            {/* Controles de Debug (toggle) */}
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="w-full text-xs text-gray-600 hover:text-gray-400 transition-colors py-1"
            >
              {showDebug ? '▼ Ocultar Debug' : '▶ Mostrar Debug'}
            </button>

            {showDebug && (
              <GamePanel title="Debug Info" icon="🐛" variant="dark">
                <pre className="text-[10px] font-mono text-gray-500 overflow-auto max-h-40">
                  {JSON.stringify({ clockState, detailedInfo }, null, 2)}
                </pre>
              </GamePanel>
            )}
          </div>
        </main>

        {/* HUD Inferior - Navegação */}
        <footer className="px-4 py-4 bg-gradient-to-t from-black/90 to-black/50 backdrop-blur-sm border-t border-amber-800/30">
          <div className="max-w-6xl mx-auto">
            <NavigationButtons
              onPrevious={() => handleNavigate('prev')}
              onNext={() => handleNavigate('next')}
              currentChapter={chapterNumber}
              totalChapters={12}
              isLoading={isNavigating}
            />
            
            {/* Barra de navegação visual estilo game */}
            <div className="mt-4 flex items-center gap-1 justify-center">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i + 1 === chapterNumber
                      ? 'w-8 bg-amber-400 shadow-lg shadow-amber-400/50'
                      : i + 1 < chapterNumber
                      ? 'w-4 bg-amber-700'
                      : 'w-4 bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* Animações globais */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Chapter4Screen
