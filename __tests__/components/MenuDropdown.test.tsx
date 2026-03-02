import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuDropdown } from '@/app/components/SoftNeuralField/MenuDropdown'

describe('MenuDropdown', () => {
  beforeEach(() => {
    render(<MenuDropdown />)
  })

  it('renderiza o botao de menu com texto "Menu"', () => {
    expect(screen.getByText('Menu')).toBeInTheDocument()
  })

  it('renderiza o botao com aria-label correto', () => {
    expect(screen.getByLabelText('Menu')).toBeInTheDocument()
  })

  it('nao exibe o dropdown inicialmente', () => {
    expect(screen.queryByText('GROWTH MODULES')).not.toBeInTheDocument()
  })

  it('abre o dropdown ao clicar no botao', async () => {
    const user = userEvent.setup()
    const menuBtn = screen.getByLabelText('Menu')
    await user.click(menuBtn)

    expect(screen.getByText('GROWTH MODULES')).toBeInTheDocument()
  })

  it('exibe todos os itens do menu ao abrir', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Menu'))

    expect(screen.getByText('Dashboard Algas')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Metas')).toBeInTheDocument()
    expect(screen.getByText(/Finanças/)).toBeInTheDocument()
    expect(screen.getByText('Gim Tracker')).toBeInTheDocument()
    expect(screen.getByText('Jornal')).toBeInTheDocument()
    expect(screen.getByText(/Pentáculos/)).toBeInTheDocument()
    expect(screen.getByText(/Configurações/)).toBeInTheDocument()
  })

  it('exibe badges nos itens corretos', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Menu'))

    // Buscar todos os badges
    const newBadges = screen.getAllByText('New')
    expect(newBadges.length).toBeGreaterThanOrEqual(2)

    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Hot')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Soon')).toBeInTheDocument()
  })

  it('fecha o dropdown ao clicar no botao novamente', async () => {
    const user = userEvent.setup()
    const menuBtn = screen.getByLabelText('Menu')

    // Abrir
    await user.click(menuBtn)
    expect(screen.getByText('GROWTH MODULES')).toBeInTheDocument()

    // Fechar
    await user.click(menuBtn)
    expect(screen.queryByText('GROWTH MODULES')).not.toBeInTheDocument()
  })

  it('exibe o footer com contagem de modulos e "crescimento"', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Menu'))

    expect(screen.getByText(/módulos/)).toBeInTheDocument()
    expect(screen.getByText(/crescimento/)).toBeInTheDocument()
  })

  it('itens do menu possuem hrefs corretos', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Menu'))

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')

    const metasLink = screen.getByText('Metas').closest('a')
    expect(metasLink).toHaveAttribute('href', '/metas')
  })
})
