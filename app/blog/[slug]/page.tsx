'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// IMPORTANTE: Importando o CSS
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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/blog/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push('/blog');
      });
  }, [params.slug, router]);

  if (loading) return <div className={styles.blogPostPage} style={{textAlign: 'center', color: '#00ff88'}}>Carregando...</div>;
  if (!post) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

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
        {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
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
