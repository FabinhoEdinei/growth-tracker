'use client';

import Link from 'next/link';
import { useState } from 'react';

interface BlogCardProps {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  image?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  slug,
  date,
  author,
  category,
  excerpt,
  image,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mapear categoria para cor
  const categoryColors: Record<string, { border: string; glow: string; badge: string }> = {
    'Desenvolvimento': { 
      border: 'rgba(0, 255, 136, 0.3)', 
      glow: 'rgba(0, 255, 136, 0.2)',
      badge: '#00ff88'
    },
    'Técnico': { 
      border: 'rgba(0, 212, 255, 0.3)', 
      glow: 'rgba(0, 212, 255, 0.2)',
      badge: '#00d4ff'
    },
    'Design': { 
      border: 'rgba(255, 0, 255, 0.3)', 
      glow: 'rgba(255, 0, 255, 0.2)',
      badge: '#ff00ff'
    },
    'Performance': { 
      border: 'rgba(255, 170, 0, 0.3)', 
      glow: 'rgba(255, 170, 0, 0.2)',
      badge: '#ffaa00'
    },
    'Features': { 
      border: 'rgba(255, 0, 102, 0.3)', 
      glow: 'rgba(255, 0, 102, 0.2)',
      badge: '#ff0066'
    },
    'Roadmap': { 
      border: 'rgba(168, 85, 247, 0.3)', 
      glow: 'rgba(168, 85, 247, 0.2)',
      badge: '#a855f7'
    },
    'Geral': { 
      border: 'rgba(127, 176, 105, 0.3)', 
      glow: 'rgba(127, 176, 105, 0.2)',
      badge: '#7fb069'
    },
    'Místico': { 
      border: 'rgba(255, 215, 0, 0.3)', 
      glow: 'rgba(255, 215, 0, 0.2)',
      badge: '#ffd700'
    },
  };

  const colors = categoryColors[category] || categoryColors['Geral'];

  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Tempo de leitura estimado (250 palavras/min)
  const readTime = Math.ceil(excerpt.split(' ').length / 250) || 3;

  return (
    <Link 
      href={`/blog/${slug}`}
      className="post-leaf"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? colors.badge : colors.border,
      }}
    >
      {/* Linha de destaque superior */}
      <div 
        className="top-accent" 
        style={{ 
          background: `linear-gradient(90deg, ${colors.badge}, transparent)`,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)'
        }}
      />

      {/* Badge de categoria */}
      <div className="post-category" style={{ color: colors.badge }}>
        {category}
      </div>

      {/* Imagem (se existir) */}
      {image && (
        <div className="post-image">
          <img src={image} alt={title} />
        </div>
      )}

      {/* Título */}
      <h3 className="post-title">{title}</h3>

      {/* Excerpt */}
      <p className="post-excerpt">{excerpt}</p>

      {/* Meta informações */}
      <div className="post-meta">
        <span className="meta-item">
          <span className="meta-icon">📅</span>
          {formatDate(date)}
        </span>
        <span className="meta-separator">•</span>
        <span className="meta-item">
          <span className="meta-icon">⏱️</span>
          {readTime} min
        </span>
        <span className="meta-separator">•</span>
        <span className="meta-item">
          <span className="meta-icon">✍️</span>
          {author}
        </span>
      </div>

      {/* Botão de leitura (aparece no hover) */}
      <div 
        className="read-more"
        style={{ 
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(-10px)'
        }}
      >
        <span>Ler mais</span>
        <span className="arrow">→</span>
      </div>

      {/* Veias da folha (decoração sutil) */}
      <svg className="leaf-veins" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d="M 10 50 Q 30 30, 50 50 T 90 50" 
          stroke={colors.border} 
          strokeWidth="0.5" 
          fill="none" 
          opacity="0.2"
        />
        <path 
          d="M 20 40 Q 35 35, 50 40" 
          stroke={colors.border} 
          strokeWidth="0.3" 
          fill="none" 
          opacity="0.15"
        />
        <path 
          d="M 50 60 Q 65 65, 80 60" 
          stroke={colors.border} 
          strokeWidth="0.3" 
          fill="none" 
          opacity="0.15"
        />
      </svg>

      <style jsx>{`
        .post-leaf {
          position: relative;
          display: block;
          background: linear-gradient(
            135deg,
            rgba(10, 26, 40, 0.95),
            rgba(45, 90, 61, 0.15)
          );
          backdrop-filter: blur(10px);
          border: 1.5px solid;
          border-radius: 20px 0 20px 0;
          padding: 30px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
          opacity: 0;
          transform: translateY(40px) rotate(-2deg);
          animation: leafGrow 0.8s ease-out forwards;
        }

        @keyframes leafGrow {
          to {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }

        .post-leaf:hover {
          transform: translateY(-10px) rotate(0deg) scale(1.02);
          box-shadow: 0 20px 50px ${colors.glow};
        }

        .top-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .post-category {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: bold;
          margin-bottom: 12px;
          display: inline-block;
          padding: 4px 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          border: 1px solid currentColor;
        }

        .post-image {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
          background: rgba(0, 0, 0, 0.3);
        }

        .post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .post-leaf:hover .post-image img {
          transform: scale(1.1);
        }

        .post-title {
          font-size: 22px;
          margin-bottom: 16px;
          font-weight: 500;
          line-height: 1.3;
          color: rgba(255, 255, 255, 0.95);
          transition: color 0.3s;
        }

        .post-leaf:hover .post-title {
          color: ${colors.badge};
        }

        .post-excerpt {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .meta-icon {
          font-size: 12px;
          opacity: 0.6;
        }

        .meta-separator {
          opacity: 0.3;
        }

        .read-more {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: ${colors.badge};
          transition: all 0.3s;
          margin-top: 12px;
        }

        .arrow {
          font-size: 16px;
          transition: transform 0.3s;
        }

        .post-leaf:hover .arrow {
          transform: translateX(5px);
        }

        .leaf-veins {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.3;
          z-index: 0;
        }

        /* Tornar conteúdo relativo para ficar acima das veias */
        .post-category,
        .post-image,
        .post-title,
        .post-excerpt,
        .post-meta,
        .read-more {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .post-leaf {
            padding: 20px;
            border-radius: 16px 0 16px 0;
          }

          .post-title {
            font-size: 18px;
          }

          .post-excerpt {
            font-size: 13px;
            -webkit-line-clamp: 2;
          }

          .post-meta {
            font-size: 10px;
            gap: 6px;
          }
        }
      `}</style>
    </Link>
  );
};