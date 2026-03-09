'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './blog.module.css';

interface Post {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  author: string;
  readTime: string;
  content: string;
  image?: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const slug = params.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!slug || slug === 'undefined') return;

    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro:', error);
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (!post) return null;

  return (
    <div className={styles.blogPostPage}>
      <nav className={styles.postNav}>
        <Link href="/blog" className={styles.backLink}>← Voltar ao Blog</Link>
      </nav>

      <header className={styles.postHeader}>
        <div className={styles.postCategory}>{post.category}</div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postMeta}>
          <span>📅 {formatDate(post.date)}</span>
          <span className={styles.metaSeparator}>•</span>
          <span>⏱️ {post.readTime}</span>
          <span className={styles.metaSeparator}>•</span>
          <span>✍️ {post.author}</span>
        </div>
      </header>

      {post.image && (
        <div className={styles.postImage}>
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <article 
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className={styles.postFooter}>
        <Link href="/blog" className={styles.backToBlog}>← Voltar ao Blog</Link>
      </footer>
    </div>
  );
}
