/**
 * @file useAstronomicalClock.ts
 * @description Custom hook para gerenciar estado e atualizações do relógio astronômico
 * @author Fabio
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  AstronomicalClockState,
  ANIMATION_CONFIG,
} from './types'
import {
  getCurrentAstronomicalState,
  getDetailedAstronomicalInfo,
  isValidDate,
  type DetailedAstronomicalInfo,
} from './AstronomicalUtils'

export interface UseAstronomicalClockOptions {
  autoUpdate?: boolean
  updateInterval?: number
  initialDate?: Date
}

export interface UseAstronomicalClockReturn {
  clockState: AstronomicalClockState
  detailedInfo: DetailedAstronomicalInfo
  isUpdating: boolean
  setDate: (date: Date) => void
  pause: () => void
  resume: () => void
  reset: () => void
}

/**
 * Hook para gerenciar o estado do relógio astronômico
 * Fornece atualizações automáticas, estado detalhado e controles manuais
 */
export function useAstronomicalClock({
  autoUpdate = true,
  updateInterval = ANIMATION_CONFIG.CLOCK_UPDATE_INTERVAL,
  initialDate,
}: UseAstronomicalClockOptions = {}): UseAstronomicalClockReturn {
  const [currentDate, setCurrentDate] = useState<Date>(() => initialDate ?? new Date())
  const [clockState, setClockState] = useState<AstronomicalClockState>(() =>
    getCurrentAstronomicalState(currentDate),
  )
  const [isUpdating, setIsUpdating] = useState(autoUpdate)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const initialDateRef = useRef(initialDate)

  // Atualizar estado quando a data muda
  useEffect(() => {
    setClockState(getCurrentAstronomicalState(currentDate))
  }, [currentDate])

  // Gerenciar intervalo de atualização automática
  useEffect(() => {
    if (!isUpdating) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Atualizar imediatamente
    setCurrentDate(new Date())

    // Agendar próxima atualização
    intervalRef.current = setInterval(() => {
      setCurrentDate(new Date())
    }, updateInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isUpdating, updateInterval])

  // Callbacks
  const handleSetDate = useCallback((date: Date) => {
    if (isValidDate(date)) {
      setCurrentDate(date)
    }
  }, [])

  const handlePause = useCallback(() => {
    setIsUpdating(false)
  }, [])

  const handleResume = useCallback(() => {
    setIsUpdating(true)
  }, [])

  const handleReset = useCallback(() => {
    if (initialDateRef.current) {
      setCurrentDate(initialDateRef.current)
    } else {
      setCurrentDate(new Date())
    }
  }, [])

  // Calcular informações detalhadas
  const detailedInfo = getDetailedAstronomicalInfo(currentDate)

  return {
    clockState,
    detailedInfo,
    isUpdating,
    setDate: handleSetDate,
    pause: handlePause,
    resume: handleResume,
    reset: handleReset,
  }
}

/**
 * Hook para sincronizar múltiplos relógios (em desenvolvimento)
 */
export interface UseSynchronizedClocksOptions {
  clocks: number // Quantidade de relógios
  offset?: number[] // Offset em horas para cada relógio
}

export function useSynchronizedClocks({
  clocks,
  offset,
}: UseSynchronizedClocksOptions) {
  const [states, setStates] = useState<AstronomicalClockState[]>(() => {
    const now = new Date()
    return [...Array(clocks)].map((_, i) => {
      const date = new Date(now)
      if (offset?.[i]) {
        date.setHours(date.getHours() + offset[i])
      }
      return getCurrentAstronomicalState(date)
    })
  })

  const [isUpdating, setIsUpdating] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isUpdating) return

    const update = () => {
      setStates((prevStates) => {
        const now = new Date()
        return prevStates.map((_, i) => {
          const date = new Date(now)
          if (offset?.[i]) {
            date.setHours(date.getHours() + offset[i])
          }
          return getCurrentAstronomicalState(date)
        })
      })
    }

    update()
    intervalRef.current = setInterval(update, ANIMATION_CONFIG.CLOCK_UPDATE_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isUpdating, offset])

  return { states, isUpdating, setIsUpdating }
}

/**
 * Hook para gerenciar histórico de datas (para timeline)
 */
export interface UseDateHistoryOptions {
  maxHistory?: number
}

export interface UseDateHistoryReturn {
  history: Date[]
  addDate: (date: Date) => void
  clearHistory: () => void
  goToDate: (index: number) => Date | null
  currentIndex: number
}

export function useDateHistory({
  maxHistory = 10,
}: UseDateHistoryOptions = {}): UseDateHistoryReturn {
  const [history, setHistory] = useState<Date[]>([new Date()])
  const [currentIndex, setCurrentIndex] = useState(0)

  const addDate = useCallback((date: Date) => {
    if (isValidDate(date)) {
      setHistory((prev) => {
        const newHistory = [...prev.slice(0, currentIndex + 1), date]
        if (newHistory.length > maxHistory) {
          newHistory.shift()
        }
        return newHistory
      })
      setCurrentIndex((prev) => Math.min(prev + 1, maxHistory - 1))
    }
  }, [currentIndex, maxHistory])

  const clearHistory = useCallback(() => {
    setHistory([new Date()])
    setCurrentIndex(0)
  }, [])

  const goToDate = useCallback((index: number): Date | null => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index)
      return history[index]
    }
    return null
  }, [history])

  return {
    history,
    addDate,
    clearHistory,
    goToDate,
    currentIndex,
  }
}

/**
 * Hook para gerenciar estado de carregamento e erro
 */
export interface UseChapterLoaderReturn {
  isLoading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export function useChapterLoader(): UseChapterLoaderReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    setLoading: setIsLoading,
    setError,
    reset,
  }
}
