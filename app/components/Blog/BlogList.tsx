'use client';

import { useState, useMemo } from 'react';
import { BlogCard } from './BlogCard';
import { FloatingParticles } from './FloatingParticles';

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

  // Agrupar posts por categoria
  const postsByCategory = useMemo(() => {
    const groups: Record<string, Post[]> = {};
    sortedPosts.forEach(post => {
      if (!groups[post.category]) {
        groups[post.category] = [];
      }
      groups[post.category].push(post);
    });
    return groups;
  }, [sortedPosts]);

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <FloatingParticles count={10} />
        <span className="empty-icon">🌿</span>
        <p>Nenhum post germinado ainda...</p>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 100px 20px;
            color: rgba(255,255,255,0.4);
            position: relative;
          }

          .empty-icon {
            font-size: 64px;
            display: block;
            margin-bottom: 20px;
            opacity: 0.3;
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Barra de ordenação */}
      <div className="sort-bar">
        <span className="sort-label">CRESCIMENTO:</span>
        <div className="sort-buttons">
          <button
            className={`sort-btn ${sortBy === 'recentes' ? 'active' : ''}`}
            onClick={() => setSortBy('recentes')}
          >
            🌱 Recentes
          </button>
          <button
            className={`sort-btn ${sortBy === 'antigos' ? 'active' : ''}`}
            onClick={() => setSortBy('antigos')}
          >
            🌳 Raízes
          </button>
          <button
            className={`sort-btn ${sortBy === 'titulo' ? 'active' : ''}`}
            onClick={() => setSortBy('titulo')}
          >
            🔤 A-Z
          </button>
        </div>
        <span className="post-count">{posts.length} brotos</span>
      </div>

      {/* Grid de posts por categoria */}
      {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
        <section key={category} id={category.toLowerCase()} className="biome-section">
          <FloatingParticles count={15} color="#00ff88" />
          
          <div className="biome-header">
            <h2 className="biome-title">{category}</h2>
            <div className="biome-line"></div>
          </div>

          <div className="posts-grid">
            {categoryPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </section>
      ))}

      <style jsx>{`
        .sort-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto 60px;
          padding: 20px;
          border-bottom: 1px solid rgba(0,255,136,0.2);
        }

        .sort-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(0,255,136,0.6);
          letter-spacing: 2px;
        }

        .sort-buttons {
          display: flex;
          gap: 8px;
        }

        .sort-btn {
          padding: 8px 16px;
          background: rgba(0,255,136,0.05);
          border: 1px solid rgba(0,255,136,0.2);
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .sort-btn:hover {
          background: rgba(0,255,136,0.1);
          border-color: rgba(0,255,136,0.4);
          color: rgba(255,255,255,0.9);
        }

        .sort-btn.active {
          background: rgba(0,255,136,0.2);
          border-color: rgba(0,255,136,0.6);
          color: #00ff88;
          box-shadow: 0 0 15px rgba(0,255,136,0.3);
        }

        .post-count {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(0,255,136,0.6);
          letter-spacing: 1px;
        }

        .biome-section {
          position: relative;
          max-width: 1200px;
          margin: 0 auto 80px;
          padding: 40px 20px;
        }

        .biome-header {
          margin-bottom: 40px;
        }

        .biome-title {
          font-size: 48px;
          font-weight: 200;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #00ff88, #00ffff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          animation: fadeIn 1s ease-out;
        }

        .biome-line {
          height: 2px;
          width: 100px;
          background: linear-gradient(90deg, #00ff88, transparent);
          animation: expandLine 1s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes expandLine {
          from { width: 0; }
          to { width: 100px; }
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
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
          }

          .posts-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .biome-title {
            font-size: 32px;
          }
        }
      `}</style>
    </>
  );
};