import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock FloatingParticles (canvas-based component)
vi.mock('@/app/components/Blog/FloatingParticles', () => ({
  FloatingParticles: () => <div data-testid="floating-particles" />,
}))

// Mock AlgaeIcon (SVG component)
vi.mock('@/app/components/SoftNeuralField/AlgaeIcon', () => ({
  AlgaeIcon: ({ size }: { size?: number }) => (
    <svg data-testid="algae-icon" width={size} height={size} />
  ),
}))

// Mock BlogIcon (SVG component)
vi.mock('@/app/components/Blog/BlogIcon', () => ({
  BlogIcon: ({ size }: { size?: number }) => (
    <svg data-testid="blog-icon" width={size} height={size} />
  ),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
