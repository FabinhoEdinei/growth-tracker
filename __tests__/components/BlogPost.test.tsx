import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlogPost } from '@/app/components/Blog/BlogPost'

const mockMetadata = {
  title: 'Titulo do Post de Teste',
  date: '2025-06-20',
  author: 'Fabinho',
  category: 'Tecnico',
}

const mockContent = '<h2>Subtitulo</h2><p>Paragrafo de teste com <strong>texto em negrito</strong>.</p>'

describe('BlogPost', () => {
  it('renderiza o titulo do post', () => {
    render(<BlogPost content={mockContent} metadata={mockMetadata} />)
    expect(screen.getByText('Titulo do Post de Teste')).toBeInTheDocument()
  })

  it('renderiza a categoria', () => {
    render(<BlogPost content={mockContent} metadata={mockMetadata} />)
    expect(screen.getByText('Tecnico')).toBeInTheDocument()
  })

  it('renderiza o nome do autor com prefixo "Por"', () => {
    render(<BlogPost content={mockContent} metadata={mockMetadata} />)
    expect(screen.getByText('Por Fabinho')).toBeInTheDocument()
  })

  it('formata a data em pt-BR com mes por extenso', () => {
    render(<BlogPost content={mockContent} metadata={mockMetadata} />)
    // toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    // Resultado esperado: "20 de junho de 2025"
    const dateEl = screen.getByText(/junho/i)
    expect(dateEl).toBeInTheDocument()
  })

  it('renderiza conteudo HTML via dangerouslySetInnerHTML', () => {
    render(<BlogPost content={mockContent} metadata={mockMetadata} />)
    expect(screen.getByText('Subtitulo')).toBeInTheDocument()
    expect(screen.getByText(/Paragrafo de teste/)).toBeInTheDocument()
    expect(screen.getByText(/texto em negrito/)).toBeInTheDocument()
  })

  it('renderiza como elemento article', () => {
    render(<BlogPost content={mockContent} metadata={mockMetadata} />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('renderiza o header com banner e separador', () => {
    render(<BlogPost content={mockContent} metadata={mockMetadata} />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })
})
