'use client';

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

export const BlogList: React.FC<BlogListProps> = ({ posts }) => {
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
    <div className="blog-list">
      {posts.map((post) => (
        <BlogCard key={post.slug} {...post} />
      ))}

      <style jsx>{`
        .blog-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .blog-list {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 30px 15px;
          }
        }
      `}</style>
    </div>
  );
};