import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

function getPostBySlug(slug: string) {
  try {
    const jornalDirectory = path.join(process.cwd(), 'app/content/jornal');
    
    if (!fs.existsSync(jornalDirectory)) {
      return null;
    }

    const filenames = fs.readdirSync(jornalDirectory);
    const mdFile = filenames.find(
      (filename) => filename.replace('.md', '') === slug || filename.includes(slug)
    );

    if (!mdFile) {
      return null;
    }

    const filePath = path.join(jornalDirectory, mdFile);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug || slug,
      title: data.title || '',
      type: data.type || 'fatos',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      character: data.character,
      content: marked(content),
    };
  } catch (error) {
    console.error('Error loading post:', error);
    return null;
  }
}

export default function PostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Definir estilo baseado no tipo
  const typeStyles: Record<string, any> = {
    fabio: {
      background: 'linear-gradient(180deg, #3a2817, #2a1810)',
      accentColor: '#DAA520',
      icon: '🤠',
      label: 'AVENTURAS DE FABIO',
    },
    claudia: {
      background: 'linear-gradient(180deg, #2d2416, #1d1410)',
      accentColor: '#FFD700',
      icon: '🌸',
      label: 'DIÁRIO DE CLÁUDIA',
    },
    publicidade: {
      background: 'linear-gradient(180deg, #1a1410, #0a0a08)',
      accentColor: '#ff6b6b',
      icon: '✨',
      label: 'ANÚNCIO ESPECIAL',
    },
    fatos: {
      background: 'linear-gradient(180deg, #2a2520, #1a1510)',
      accentColor: '#8B7355',
      icon: '📰',
      label: 'FATOS DO DIA',
    },
    lugares: {
      background: 'linear-gradient(180deg, #2d2a20, #1d1a10)',
      accentColor: '#A0826D',
      icon: '🗺️',
      label: 'TERRAS EXPLORADAS',
    },
  };

  const style = typeStyles[post.type] || typeStyles.fatos;

  return (
    <div className="post-page" style={{ background: style.background }}>
      {/* Botões de navegação vintage */}
      <div className="vintage-nav">
        <Link href="/" className="vintage-btn btn-home">
          <span className="btn-icon">🏠</span>
          <span className="btn-text">INÍCIO</span>
        </Link>

        <Link href="/jornal" className="vintage-btn btn-jornal">
          <span className="btn-icon">📰</span>
          <span className="btn-text">JORNAL</span>
        </Link>
      </div>

      {/* Conteúdo do post */}
      <article className="post-article">
        {/* Moldura ornamental */}
        <div className="ornamental-border">
          <div className="corner-ornament tl"></div>
          <div className="corner-ornament tr"></div>
          <div className="corner-ornament bl"></div>
          <div className="corner-ornament br"></div>
        </div>

        {/* Header do post */}
        <header className="post-header">
          <div className="post-category" style={{ color: style.accentColor }}>
            <span className="category-icon">{style.icon}</span>
            <span className="category-text">{style.label}</span>
          </div>

          <div className="ornament-divider">
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>

          <h1 className="post-title">{post.title}</h1>

          <div className="post-meta">
            <time className="post-date">{formatDate(post.date)}</time>
          </div>

          <div className="ornament-divider">
            <span>◆</span>
            <span>◆</span>
            <span>◆</span>
          </div>
        </header>

        {/* Conteúdo */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="post-footer">
          <div className="ornament-divider">
            <span>❋</span>
            <span>❋</span>
            <span>❋</span>
          </div>

          <Link href="/jornal" className="back-to-jornal">
            ← Voltar ao Jornal
          </Link>
        </footer>
      </article>

      <style jsx>{`
        .post-page {
          min-height: 100vh;
          padding: 80px 20px 40px;
          position: relative;
        }

        /* Botões de navegação vintage */
        .vintage-nav {
          position: fixed;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 12px;
          z-index: 100;
        }

        .vintage-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #5a4a3a, #3a2a1a);
          border: 2px solid #8B7355;
          border-radius: 8px;
          color: #f5e6d3;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1.5px;
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .vintage-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          opacity: 0;
          transition: opacity 0.3s;
        }

        .vintage-btn:hover::before {
          opacity: 1;
        }

        .vintage-btn:hover {
          transform: translateY(-2px);
          border-color: #DAA520;
          box-shadow: 
            0 6px 20px rgba(218, 165, 32, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .btn-icon {
          font-size: 16px;
          filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
        }

        .btn-text {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        /* Artigo */
        .post-article {
          max-width: 900px;
          margin: 0 auto;
          background: linear-gradient(
            180deg,
            rgba(245, 235, 220, 0.95),
            rgba(240, 230, 215, 0.95)
          );
          padding: 60px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          position: relative;
          border: 3px solid #6b5344;
        }

        /* Moldura ornamental */
        .ornamental-border {
          position: absolute;
          inset: 10px;
          border: 2px solid #a09070;
          pointer-events: none;
        }

        .corner-ornament {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 2px solid #8B7355;
        }

        .corner-ornament.tl {
          top: -2px;
          left: -2px;
          border-right: none;
          border-bottom: none;
        }

        .corner-ornament.tr {
          top: -2px;
          right: -2px;
          border-left: none;
          border-bottom: none;
        }

        .corner-ornament.bl {
          bottom: -2px;
          left: -2px;
          border-right: none;
          border-top: none;
        }

        .corner-ornament.br {
          bottom: -2px;
          right: -2px;
          border-left: none;
          border-top: none;
        }

        /* Header do post */
        .post-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .post-category {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 3px;
          font-family: 'Courier New', monospace;
          text-transform: uppercase;
        }

        .category-icon {
          font-size: 20px;
        }

        .ornament-divider {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 20px 0;
          font-size: 12px;
          color: #8B7355;
          opacity: 0.6;
        }

        .post-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
          margin: 20px 0;
          color: #2a1810;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
        }

        .post-meta {
          margin: 20px 0;
        }

        .post-date {
          font-family: 'Georgia', serif;
          font-size: 14px;
          font-style: italic;
          color: #6b5344;
        }

        /* Conteúdo */
        .post-content {
          font-family: 'Georgia', serif;
          font-size: 18px;
          line-height: 1.8;
          color: #2a1810;
          margin-bottom: 40px;
        }

        .post-content :global(h1),
        .post-content :global(h2),
        .post-content :global(h3) {
          font-family: 'Playfair Display', 'Georgia', serif;
          margin: 30px 0 15px;
          color: #2a1810;
        }

        .post-content :global(h1) { font-size: 36px; }
        .post-content :global(h2) { font-size: 28px; }
        .post-content :global(h3) { font-size: 22px; }

        .post-content :global(p) {
          margin-bottom: 20px;
        }

        .post-content :global(code) {
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
        }

        .post-content :global(pre) {
          background: rgba(0, 0, 0, 0.05);
          padding: 20px;
          border-left: 4px solid #8B7355;
          overflow-x: auto;
          margin: 20px 0;
        }

        .post-content :global(blockquote) {
          border-left: 4px solid #DAA520;
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #5a4a3a;
        }

        /* Footer */
        .post-footer {
          text-align: center;
          padding-top: 40px;
          border-top: 2px solid #d4c4b0;
        }

        .back-to-jornal {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #5a4a3a, #3a2a1a);
          border: 2px solid #8B7355;
          border-radius: 8px;
          color: #f5e6d3;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 1.5px;
          transition: all 0.3s;
        }

        .back-to-jornal:hover {
          transform: translateY(-2px);
          border-color: #DAA520;
          box-shadow: 0 6px 20px rgba(218, 165, 32, 0.3);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .post-page {
            padding: 100px 10px 40px;
          }

          .vintage-nav {
            top: 10px;
            left: 10px;
            flex-direction: column;
            gap: 8px;
          }

          .vintage-btn {
            padding: 8px 16px;
            font-size: 11px;
          }

          .post-article {
            padding: 30px 20px;
          }

          .post-title {
            font-size: 32px;
          }

          .post-content {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}