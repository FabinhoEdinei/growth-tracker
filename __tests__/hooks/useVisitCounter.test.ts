import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Nao usar o mock global do useVisitCounter -- importar o hook real
// Precisamos resetar o mock do modulo antes
vi.unmock('@/app/hooks/useVisitCounter')

import { useVisitCounter } from '@/app/hooks/useVisitCounter'

const STORAGE_KEY = 'growth_tracker_visits'

describe('useVisitCounter', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear()
    vi.clearAllMocks()
    // Resetar mocks do localStorage
    ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockClear()
    ;(localStorage.setItem as ReturnType<typeof vi.fn>).mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('primeira visita: count = 1 e isNewVisitor = true', () => {
    // localStorage.getItem retorna null (nenhum dado salvo)
    ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null)

    const { result } = renderHook(() => useVisitCounter())

    // Apos o useEffect rodar
    expect(result.current.visitCount).toBe(1)
    expect(result.current.isNewVisitor).toBe(true)

    // Deve ter salvo no localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.stringContaining('"count":1')
    )
  })

  it('visita no mesmo dia dentro de 30 min: count nao incrementa', () => {
    const now = Date.now()
    const fiveMinutesAgo = now - 5 * 60 * 1000 // 5 minutos atras

    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    // Ajustar para o mesmo dateKey que o hook calcula
    const adjustedDate = today.getHours() < 5
      ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      : today
    const dateKey = `${adjustedDate.getFullYear()}-${String(adjustedDate.getMonth() + 1).padStart(2, '0')}-${String(adjustedDate.getDate()).padStart(2, '0')}`

    const savedData = JSON.stringify({
      count: 3,
      date: dateKey,
      lastVisit: fiveMinutesAgo,
    })

    ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(savedData)

    const { result } = renderHook(() => useVisitCounter())

    // Count nao deve ter incrementado (< 30 min)
    expect(result.current.visitCount).toBe(3)
    expect(result.current.isNewVisitor).toBe(false)
  })

  it('visita no mesmo dia apos 30 min: count incrementa', () => {
    const now = Date.now()
    const fortyMinutesAgo = now - 40 * 60 * 1000 // 40 minutos atras

    const today = new Date()
    const adjustedDate = today.getHours() < 5
      ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      : today
    const dateKey = `${adjustedDate.getFullYear()}-${String(adjustedDate.getMonth() + 1).padStart(2, '0')}-${String(adjustedDate.getDate()).padStart(2, '0')}`

    const savedData = JSON.stringify({
      count: 3,
      date: dateKey,
      lastVisit: fortyMinutesAgo,
    })

    ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(savedData)

    const { result } = renderHook(() => useVisitCounter())

    // Count deve ter incrementado (> 30 min)
    expect(result.current.visitCount).toBe(4)
    expect(result.current.isNewVisitor).toBe(true)
  })

  it('novo dia: count reseta para 1', () => {
    const savedData = JSON.stringify({
      count: 10,
      date: '2024-01-01', // Data antiga
      lastVisit: new Date('2024-01-01T12:00:00').getTime(),
    })

    ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(savedData)

    const { result } = renderHook(() => useVisitCounter())

    // Count deve ter resetado para 1 (novo dia)
    expect(result.current.visitCount).toBe(1)
    expect(result.current.isNewVisitor).toBe(true)
  })
})
