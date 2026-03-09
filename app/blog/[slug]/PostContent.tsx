'use client';

import { useEffect, useState, use } from 'react';
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

export function PostContent({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.slug || params.slug === 'undefined') return;

    fetch(`/api/blog/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (!post) return <div className={styles.error}>Post não encontrado.</div>;

  return (
    <div className={styles.blogPostPage}>
      <Link href="/blog" className={styles.backLink}>← Voltar</Link>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} className={styles.postContent} />
    </div>
  );
}
