'use client';

import Link from 'next/link';

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
  return (
    <Link href={`/blog/${slug}`}>
      <article className="blog-card">
        {image && (
          <div className="card-image">
            <img src={image} alt={title} />
          </div>
        )}
        
        <div className="card-content">
          <div className="card-meta">
            <span className="category">{category}</span>
            <span className="date">{new Date(date).toLocaleDateString('pt-BR')}</span>
          </div>
          
          <h2 className="card-title">{title}</h2>
          <p className="card-excerpt">{excerpt}</p>
          
          <div className="card-footer">
            <span className="author">Por {author}</span>
            <span className="read-more">Ler mais →</span>
          </div>
        </div>

        <style jsx>{`
   .blog-card {
  display: block;
  background: linear-gradient(135deg, rgba(10,10,30,0.95), rgba(20,10,40,0.95));
  border: 1px solid rgba(0,255,255,0.2);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer; /* ← ADICIONAR */
  backdrop-filter: blur(10px);
  text-decoration: none; /* ← ADICIONAR */
}

          .blog-card:hover {
            border-color: rgba(0,255,255,0.6);
            box-shadow: 0 0 30px rgba(0,255,255,0.3), 0 10px 40px rgba(0,0,0,0.5);
            transform: translateY(-4px);
          }

          .card-image {
            width: 100%;
            height: 200px;
            overflow: hidden;
            background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1));
          }

          .card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .blog-card:hover .card-image img {
            transform: scale(1.05);
          }

          .card-content {
            padding: 20px;
          }

          .card-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .category {
            font-size: 10px;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            color: #ff0066;
            background: rgba(255,0,102,0.15);
            padding: 4px 10px;
            border-radius: 4px;
            border: 1px solid rgba(255,0,102,0.3);
          }

          .date {
            font-size: 11px;
            font-family: 'Courier New', monospace;
            color: rgba(255,255,255,0.5);
            letter-spacing: 1px;
          }

          .card-title {
            font-size: 20px;
            font-weight: bold;
            color: rgba(255,255,255,0.95);
            margin: 0 0 12px 0;
            line-height: 1.3;
            font-family: 'Orbitron', monospace;
          }

          .card-excerpt {
            font-size: 13px;
            color: rgba(255,255,255,0.6);
            line-height: 1.6;
            margin: 0 0 16px 0;
          }

          .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid rgba(255,255,255,0.1);
          }

          .author {
            font-size: 11px;
            color: rgba(0,255,255,0.7);
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
          }

          .read-more {
            font-size: 11px;
            color: #00ffff;
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
            transition: all 0.2s;
          }

          .blog-card:hover .read-more {
            color: #ff00ff;
            text-shadow: 0 0 10px rgba(255,0,255,0.5);
          }
        `}</style>
      </article>
    </Link>
  );
};