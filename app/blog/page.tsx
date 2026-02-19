'use client';

import { BlogHeader } from '../components/Blog/BlogHeader';
import { BlogList } from '../components/Blog/BlogList';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Post {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  image?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Fetch posts do endpoint API
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error loading posts:', err));
  }, []);

  return (
    <div className="blog-page">
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