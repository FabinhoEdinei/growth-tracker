'use client';

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
    const postsDirectory = path.join(process.cwd(), 'app/content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      console.error('Posts directory not found:', postsDirectory);
      return null;
    }

    const filenames = fs.readdirSync(postsDirectory);
    
    const mdFile = filenames.find(
      (filename) => {
        const fileSlug = filename.replace('.md', '');
        return fileSlug === slug || fileSlug.toLowerCase() === slug.toLowerCase();
      }
    );

    if (!mdFile) {
      console.error('Post not found:', slug);
      return null;
    }

    const filePath = path.join(postsDirectory, mdFile);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug || slug,
      title: data.title || '',
      category: data.category || 'Místico',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      author: data.author || 'Fabio Edinei',
      readTime: data.readTime || '1 min',
      content: marked(content),
      image: data.image,
    };
  } catch (error) {
    console.error('Error loading post:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const postsDirectory = path.join(process.cwd(), 'app/content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const filenames = fs.readdirSync(postsDirectory);
    
    return filenames
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => ({
        slug: filename.replace('.md', ''),
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function BlogPostPage({ params }: PageProps) {
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

  return (
    <div className="blog-post-page">
      <nav className="post-nav">
        <Link href="/blog" className="back-link">
          ← Voltar ao Blog
        </Link>
      </nav>

      <header className="post-header">
        <div className="post-category">{post.category}</div>
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta">
          <span className="meta-item">📅 {formatDate(post.date)}</span>
          <span className="meta-separator">•</span>
          <span className="meta-item">⏱️ {post.readTime}</span>
          <span className="meta-separator">•</span>
          <span className="meta-item">✍️ {post.author}</span>
        </div>

        {post.excerpt && (
          <p className="post-excerpt">{post.excerpt}</p>
        )}
      </header>

      {post.image && (
        <div className="post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <article 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="post-footer">
        <Link href="/blog" className="back-to-blog">
          ← Voltar ao Blog
        </Link>
      </footer>

      <style jsx>{`
        .blog-post-page {
          min-height: 100vh;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(26, 20, 30, 1),
            rgba(10, 8, 15, 1)
          );
          padding: 80px 20px 60px;
        }

        .post-nav {
          max-width: 900px;
          margin: 0 auto 30px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: transparent;
          border: 2px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          color: #00ff88;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 1px;
          transition: all 0.3s;
        }

        .back-link:hover {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          transform: translateX(-4px);
        }

        .post-header {
          max-width: 900px;
          margin: 0 auto 40px;
          text-align: center;
        }

        .post-category {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(255, 215, 0, 0.15);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          color: #ffd700;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .post-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
          color: #00ff88;
          margin: 0 0 20px 0;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }

        .post-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: rgba(200, 200, 220, 0.7);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .meta-separator {
          color: rgba(200, 200, 220, 0.3);
        }

        .post-excerpt {
          font-family: 'Georgia', serif;
          font-size: 18px;
          font-style: italic;
          line-height: 1.6;
          color: rgba(200, 200, 220, 0.8);
          max-width: 700px;
          margin: 0 auto;
        }

        .post-image {
          max-width: 900px;
          margin: 0 auto 40px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .post-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .post-content {
          max-width: 900px;
          margin: 0 auto;
          background: rgba(20, 15, 25, 0.6);
          padding: 60px 80px;
          border-radius: 16px;
          border: 1px solid rgba(0, 255, 136, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          font-family: 'Georgia', serif;
          font-size: 18px;
          line-height: 1.8;
          color: rgba(230, 230, 240, 0.95);
        }

        .post-footer {
          max-width: 900px;
          margin: 40px auto 0;
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid rgba(0, 255, 136, 0.2);
        }

        .back-to-blog {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: transparent;
          border: 2px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          color: #00ff88;
          text-decoration: none;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 1px;
          transition: all 0.3s;
        }

        .back-to-blog:hover {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          transform: translateX(-4px);
        }

        @media (max-width: 768px) {
          .blog-post-page {
            padding: 80px 15px 40px;
          }

          .post-title {
            font-size: 32px;
          }

          .post-content {
            padding: 40px 25px;
            font-size: 16px;
          }
        }
      `}</style>

      {/* Estilos globais para o conteúdo markdown */}
      <style jsx global>{`
        .post-content h1,
        .post-content h2,
        .post-content h3,
        .post-content h4 {
          font-family: 'Playfair Display', 'Georgia', serif;
          color: #00ff88;
          margin: 40px 0 20px;
          line-height: 1.3;
        }

        .post-content h1 { font-size: 36px; }
        .post-content h2 { font-size: 30px; }
        .post-content h3 { font-size: 24px; }
        .post-content h4 { font-size: 20px; }

        .post-content p {
          margin-bottom: 24px;
        }

        .post-content strong {
          color: #00d4ff;
          font-weight: 600;
        }

        .post-content em {
          color: #a855f7;
        }

        .post-content a {
          color: #00ff88;
          text-decoration: underline;
          transition: color 0.3s;
        }

        .post-content a:hover {
          color: #00ffaa;
        }

        .post-content blockquote {
          border-left: 4px solid #ffd700;
          padding-left: 24px;
          margin: 30px 0;
          font-style: italic;
          color: rgba(255, 215, 0, 0.9);
        }

        .post-content code {
          background: rgba(0, 0, 0, 0.4);
          padding: 3px 8px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          color: #00ffaa;
        }

        .post-content pre {
          background: rgba(0, 0, 0, 0.6);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #00ff88;
          overflow-x: auto;
          margin: 30px 0;
        }

        .post-content pre code {
          background: none;
          padding: 0;
        }

        .post-content ul,
        .post-content ol {
          margin: 20px 0;
          padding-left: 30px;
        }

        .post-content li {
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .post-content h1 { font-size: 28px; }
          .post-content h2 { font-size: 24px; }
          .post-content h3 { font-size: 20px; }
        }
      `}</style>
    </div>
  );
}