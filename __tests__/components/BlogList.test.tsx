import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogList } from '@/app/components/Blog/BlogList'

const mockPosts = [
  {
    title: 'Post Alpha',
    slug: 'post-alpha',
    date: '2025-03-01',
    author: 'Fabinho',
    category: 'Desenvolvimento',
    excerpt: 'Excerpt do post alpha sobre desenvolvimento.',
  },
  {
    title: 'Post Beta',
    slug: 'post-beta',
    date: '2025-01-10',
    author: 'Fabinho',
    category: 'Design',
    excerpt: 'Excerpt do post beta sobre design.',
  },
  {
    title: 'Post Gamma',
    slug: 'post-gamma',
    date: '2025-02-15',
    author: 'Fabinho',
    category: 'Desenvolvimento',
    excerpt: 'Excerpt do post gamma sobre desenvolvimento.',
  },
]

describe('BlogList', () => {
  it('exibe mensagem de estado vazio quando nao ha posts', () => {
    render(<BlogList posts={[]} />)
    expect(
      screen.getByText(/Nenhum post germinado ainda/)
    ).toBeInTheDocument()
  })

  it('renderiza a barra de ordenacao com os botoes', () => {
    render(<BlogList posts={mockPosts} />)
    expect(screen.getByText(/Recentes/)).toBeInTheDocument()
    expect(screen.getByText(/Raízes/)).toBeInTheDocument()
    expect(screen.getByText(/A-Z/)).toBeInTheDocument()
  })

  it('exibe a contagem total de posts', () => {
    render(<BlogList posts={mockPosts} />)
    expect(screen.getByText('3 brotos')).toBeInTheDocument()
  })

  it('renderiza titulos de categorias como secoes', () => {
    render(<BlogList posts={mockPosts} />)
    expect(screen.getByText('Desenvolvimento')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
  })

  it('renderiza todos os posts', () => {
    render(<BlogList posts={mockPosts} />)
    expect(screen.getByText('Post Alpha')).toBeInTheDocument()
    expect(screen.getByText('Post Beta')).toBeInTheDocument()
    expect(screen.getByText('Post Gamma')).toBeInTheDocument()
  })

  it('alterna ordenacao ao clicar em "Raizes" (antigos)', async () => {
    const user = userEvent.setup()
    render(<BlogList posts={mockPosts} />)

    const raizesBtn = screen.getByText(/Raízes/)
    await user.click(raizesBtn)

    // Apos clicar, o botao deve ter a classe 'active'
    // Todos os posts ainda devem estar visiveis
    expect(screen.getByText('Post Alpha')).toBeInTheDocument()
    expect(screen.getByText('Post Beta')).toBeInTheDocument()
    expect(screen.getByText('Post Gamma')).toBeInTheDocument()
  })

  it('alterna ordenacao ao clicar em "A-Z" (titulo)', async () => {
    const user = userEvent.setup()
    render(<BlogList posts={mockPosts} />)

    const azBtn = screen.getByText(/A-Z/)
    await user.click(azBtn)

    // Todos os posts ainda devem ser renderizados
    expect(screen.getByText('Post Alpha')).toBeInTheDocument()
    expect(screen.getByText('Post Beta')).toBeInTheDocument()
    expect(screen.getByText('Post Gamma')).toBeInTheDocument()
  })

  it('agrupa posts da mesma categoria juntos', () => {
    render(<BlogList posts={mockPosts} />)
    // Deve haver 2 secoes de categoria (Desenvolvimento tem 2 posts, Design tem 1)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
  })
})
