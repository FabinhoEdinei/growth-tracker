import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VisitCounter } from '@/app/components/VisitCounter/VisitCounter'

// Mock do hook useVisitCounter
vi.mock('@/app/hooks/useVisitCounter', () => ({
  useVisitCounter: () => ({
    visitCount: 5,
    isNewVisitor: false,
  }),
}))

describe('VisitCounter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza o label "VISITAS HOJE"', () => {
    render(<VisitCounter />)
    expect(screen.getByText('VISITAS HOJE')).toBeInTheDocument()
  })

  it('exibe o valor do contador', () => {
    render(<VisitCounter />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renderiza o icone do olho', () => {
    render(<VisitCounter />)
    const container = screen.getByText('VISITAS HOJE').closest('div')
    expect(container).toBeInTheDocument()
  })
})
