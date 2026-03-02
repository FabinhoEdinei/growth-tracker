import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrganicNav } from '@/app/components/Blog/OrganicNav'

describe('OrganicNav', () => {
  it('renderiza todos os botoes de navegacao', () => {
    render(<OrganicNav />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('possui aria-labels corretos em cada botao', () => {
    render(<OrganicNav />)
    expect(screen.getByLabelText('Ir para Recentes')).toBeInTheDocument()
    expect(screen.getByLabelText('Ir para Desenvolvimento')).toBeInTheDocument()
    expect(screen.getByLabelText(/Técnico/)).toBeInTheDocument()
    expect(screen.getByLabelText('Ir para Design')).toBeInTheDocument()
  })

  it('chama scrollIntoView ao clicar em um botao', async () => {
    const user = userEvent.setup()
    const mockScrollIntoView = vi.fn()

    // Criar um elemento mock no DOM para a secao
    const mockSection = document.createElement('div')
    mockSection.id = 'recentes'
    mockSection.scrollIntoView = mockScrollIntoView
    document.body.appendChild(mockSection)

    render(<OrganicNav />)

    const recentesBtn = screen.getByLabelText('Ir para Recentes')
    await user.click(recentesBtn)

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })

    // Limpar
    document.body.removeChild(mockSection)
  })

  it('renderiza o elemento nav', () => {
    render(<OrganicNav />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
