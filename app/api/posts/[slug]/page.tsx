'use client';

import { BlogPost } from '../../components/Blog/BlogPost';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PostData {
  title: string;
  date: string;
  author: string;
  category: string;
  content: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/posts/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading post:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="post-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando post...</p>
        </div>

        <style jsx>{`
          .post-page {
            min-height: 100vh;
            background: radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1));
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loading {
            text-align: center;
            color: rgba(255,255,255,0.5);
            font-family: 'Courier New', monospace;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0,255,255,0.2);
            border-top-color: #00ffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-page">
        <div className="error">
          <h1>404</h1>
          <p>Post não encontrado</p>
          <Link href="/blog" className="back-link">
            ← Voltar ao Blog
          </Link>
        </div>

        <style jsx>{`
          .post-page {
            min-height: 100vh;
            background: radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1));
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .error {
            text-align: center;
            color: rgba(255,255,255,0.8);
            font-family: 'Orbitron', monospace;
          }

          .error h1 {
            font-size: 72px;
            color: #ff0066;
            margin: 0 0 20px 0;
          }

          .error p {
            font-size: 18px;
            margin-bottom: 30px;
          }

          .back-link {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(0,255,255,0.1);
            border: 1px solid rgba(0,255,255,0.3);
            border-radius: 8px;
            color: #00ffff;
            text-decoration: none;
            font-family: 'Courier New', monospace;
            transition: all 0.3s;
          }

          .back-link:hover {
            background: rgba(0,255,255,0.2);
            box-shadow: 0 0 20px rgba(0,255,255,0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="post-page">
      <Link href="/blog" className="back-button">
        ← Voltar ao Blog
      </Link>

      <BlogPost 
        content={post.content} 
        metadata={{
          title: post.title,
          date: post.date,
          author: post.author,
          category: post.category,
        }} 
      />

      <style jsx>{`
        .post-page {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1));
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
      `}</style>
    </div>
  );
}