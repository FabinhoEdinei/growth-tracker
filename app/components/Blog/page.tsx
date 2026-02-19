import { BlogHeader } from '../components/Blog/BlogHeader';
import { BlogList } from '../components/Blog/BlogList';
import Link from 'next/link';

// Função helper para ler posts
function getPosts() {
  // Por enquanto, posts hardcoded
  // Depois vamos ler de app/content/posts/*.md
  return [
    {
      title: 'A História do Growth Tracker: Do Zero ao Sistema Neural',
      slug: 'historia-growth-tracker',
      date: '2026-02-18',
      author: 'Claude AI',
      category: 'Desenvolvimento',
      excerpt: 'A jornada completa de como transformamos uma ideia simples em um sistema complexo de partículas neurais inteligentes.',
      image: '/blog/hero-1.jpg',
    },
    {
      title: 'Como Funciona o Sistema de Partículas',
      slug: 'sistema-particulas',
      date: '2026-02-19',
      author: 'Growth Team',
      category: 'Técnico',
      excerpt: 'Deep dive na física, matemática e arquitetura por trás do canvas de partículas.',
    },
    {
      title: 'Otimização para 50K Usuários Simultâneos',
      slug: 'otimizacao-escala',
      date: '2026-02-20',
      author: 'Claude AI',
      category: 'Performance',
      excerpt: 'Técnicas de Spatial Hashing, Device Detection e SSG que tornaram o app escalável.',
    },
    {
      title: 'Hexágonos Orbitais: O Sistema Paralelo',
      slug: 'hexagonos-orbitais',
      date: '2026-02-21',
      author: 'Growth Team',
      category: 'Features',
      excerpt: 'Como criamos um segundo sistema completamente isolado com dados persistentes.',
    },
    {
      title: 'O Futuro: Machine Learning Neural',
      slug: 'futuro-ml',
      date: '2026-02-22',
      author: 'Claude AI',
      category: 'Roadmap',
      excerpt: 'Partículas que aprendem, preveem e evoluem com comportamento emergente.',
    },
    {
      title: 'Behind the Scenes: Design do Header PS5',
      slug: 'design-header-ps5',
      date: '2026-02-23',
      author: 'Growth Team',
      category: 'Design',
      excerpt: 'O processo criativo por trás do header futurista inspirado no controle PlayStation 5.',
    },
  ];
}

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="blog-page">
      {/* Botão voltar */}
      <Link href="/" className="back-button">
        ← Voltar ao App
      </Link>

      <BlogHeader />
      <BlogList posts={posts} />

      <style jsx>{`
        .blog-page {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1));
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        :global(.back-button) {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 100;
          padding: 10px 20px;
          background: rgba(0,255,255,0.1);
          border: 1px solid rgba(0,255,255,0.3);
          border-radius: 8px;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        :global(.back-button:hover) {
          background: rgba(0,255,255,0.2);
          box-shadow: 0 0 20px rgba(0,255,255,0.3);
          transform: translateX(-4px);
        }

        @media (max-width: 768px) {
          :global(.back-button) {
            top: 15px;
            left: 15px;
            padding: 8px 16px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}