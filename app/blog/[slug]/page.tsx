'use client';

import { useEffect, useState, use } from 'react'; // Importamos o 'use' do React
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

// No Next.js 15/16, params é recebido como uma Promise
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params: paramsPromise }: PageProps) {
  // Desembrulha os parâmetros de forma segura para o Next.js 16
  const params = use(paramsPromise);
  const slug = params.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // PROTEÇÃO: Impede que o fetch rode se o slug for undefined ou a string "undefined"
    if (!slug || slug === 'undefined') {
      console.warn("Slug inválido detectado no carregamento.");
      return;
    }

    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post não encontrado');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar post:', error);
        setLoading(false);
        // Opcional: Redirecionar se o post realmente não existir
        // router.push('/blog');
      });
  }, [slug]); // Depende apenas do slug extraído

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className={styles.blogPostPage} style={{ textAlign: 'center', color: '#00ff88', paddingTop: '100px' }}>
        Carregando...
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.blogPostPage} style={{ textAlign: 'center', color: '#ff4444', paddingTop: '100px' }}>
        Post não encontrado.
        <br />
        <Link href="/blog" style={{ color: '#00ff88', textDecoration: 'underline' }}>Voltar ao blog</Link>
      </div>
    );
  }

  return (
    <div className={styles.blogPostPage}>
      <nav className={styles.postNav}>
        <Link href="/blog" className={styles.backLink}>
          ← Voltar ao Blog
        </Link>
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

        {post.excerpt && (
          <p className={styles.postExcerpt}>{post.excerpt}</p>
        )}
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
        <Link href="/blog" className={styles.backToBlog}>
          ← Voltar ao Blog
        </Link>
      </footer>
    </div>
  );
}
