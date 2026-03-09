'use client';

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

// Agora só recebe o post pronto — sem fetch, sem estado de loading
export default function BlogClient({ post }: { post: Post }) {
  return (
    <div className={styles.blogPostPage}>
      <header className={styles.postHeader}>
        <Link href="/blog" className={styles.backLink}>← Voltar</Link>
        <h1 className={styles.postTitle}>{post.title}</h1>
      </header>
      <article
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
