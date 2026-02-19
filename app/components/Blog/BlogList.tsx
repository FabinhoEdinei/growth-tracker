'use client';

import { useState, useMemo } from 'react';
import { BlogCard } from './BlogCard';

interface Post {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  image?: string;
}

interface BlogListProps {
  posts: Post[];
}

type SortOption = 'recentes' | 'antigos' | 'titulo';

export const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  const [sortBy, setSortBy] = useState<SortOption>('recentes');

  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    
    switch (sortBy) {
      case 'recentes':
        return sorted.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case 'antigos':
        return sorted.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case 'titulo':
        return sorted.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      default:
        return sorted;
    }
  }, [posts, sortBy]);

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📝</span>
        <p>Nenhum post publicado ainda</p>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: rgba(255,255,255,0.3);
          }

          .empty-icon {
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
            opacity: 0.3;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Barra de ordenação */}
      <div className="sort-bar">
        <span className="sort-label">ORDENAR POR:</span>
        <div className="sort-buttons">
          <button
            className={`sort-btn ${sortBy === 'recentes' ? 'active' : ''}`}
            onClick={() => setSortBy('recentes')}
          >
            📅 Recentes
          </button>
          <button
            className={`sort-btn ${sortBy === 'antigos' ? 'active' : ''}`}
            onClick={() => setSortBy('antigos')}
          >
            🕐 Antigos
          </button>
          <button
            className={`sort-btn ${sortBy === 'titulo' ? 'active' : ''}`}
            onClick={() => setSortBy('titulo')}
          >
            🔤 Título
          </button>
        </div>
        <span className="post-count">{posts.length} posts</span>
      </div>

      {/* Grid de posts */}
      <div className="blog-list">
        {sortedPosts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>

      <style jsx>{`
        .sort-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          border-bottom: 1px solid rgba(0,255,255,0.1);
        }

        .sort-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 2px;
        }

        .sort-buttons {
          display: flex;
          gap: 8px;
        }

        .sort-btn {
          padding: 6px 14px;
          background: rgba(0,255,255,0.05);
          border: 1px solid rgba(0,255,255,0.2);
          border-radius: 6px;
          color: rgba(255,255,255,0.5);
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .sort-btn:hover {
          background: rgba(0,255,255,0.1);
          border-color: rgba(0,255,255,0.4);
          color: rgba(255,255,255,0.8);
        }

        .sort-btn.active {
          background: rgba(0,255,255,0.2);
          border-color: rgba(0,255,255,0.6);
          color: #00ffff;
          box-shadow: 0 0 15px rgba(0,255,255,0.3);
        }

        .post-count {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(255,0,102,0.6);
          letter-spacing: 1px;
        }

        .blog-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .sort-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .sort-buttons {
            width: 100%;
            flex-wrap: wrap;
          }

          .sort-btn {
            flex: 1;
            min-width: 100px;
            font-size: 10px;
            padding: 8px 10px;
          }

          .blog-list {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 30px 15px;
          }
        }
      `}</style>
    </>
  );
};