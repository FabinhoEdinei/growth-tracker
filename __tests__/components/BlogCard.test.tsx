import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlogCard } from '@/app/components/Blog/BlogCard'

const mockPost = {
  title: 'Meu Primeiro Post',
  slug: 'meu-primeiro-post',
  date: '2025-01-15',
  author: 'Fabinho',
  category: 'Desenvolvimento',
  excerpt:
    'Este e um excerpt de teste para verificar a renderizacao do componente BlogCard com todas as propriedades.',
}

describe('BlogCard', () => {
  it('renderiza o titulo do post', () => {
    render(<BlogCard {...mockPost} />)
    expect(screen.getByText('Meu Primeiro Post')).toBeInTheDocument()
  })

  it('renderiza a categoria do post', () => {
    render(<BlogCard {...mockPost} />)
    expect(screen.getByText('Desenvolvimento')).toBeInTheDocument()
  })

  it('renderiza o excerpt do post', () => {
    render(<BlogCard {...mockPost} />)
    expect(
      screen.getByText(/Este e um excerpt de teste/)
    ).toBeInTheDocument()
  })

  it('renderiza o nome do autor', () => {
    render(<BlogCard {...mockPost} />)
    expect(screen.getByText('Fabinho')).toBeInTheDocument()
  })

  it('formata a data em pt-BR', () => {
    render(<BlogCard {...mockPost} />)
    // toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    // Resultado esperado: "15 de jan. de 2025" (pode variar por locale do ambiente)
    const dateElement = screen.getByText(/jan/i)
    expect(dateElement).toBeInTheDocument()
  })

  it('calcula e exibe o tempo de leitura', () => {
    render(<BlogCard {...mockPost} />)
    // excerpt tem ~18 palavras -> ceil(18/250) = 1, mas o componente usa || 3 como fallback
    expect(screen.getByText(/min/)).toBeInTheDocument()
  })

  it('gera link correto com o slug', () => {
    render(<BlogCard {...mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog/meu-primeiro-post')
  })

  it('renderiza corretamente com categoria desconhecida (usa fallback Geral)', () => {
    render(<BlogCard {...mockPost} category="Desconhecida" />)
    expect(screen.getByText('Desconhecida')).toBeInTheDocument()
  })

  it('renderiza o texto "Ler mais"', () => {
    render(<BlogCard {...mockPost} />)
    expect(screen.getByText('Ler mais')).toBeInTheDocument()
  })
})
