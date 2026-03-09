import { notFound } from 'next/navigation';
import BlogClient from './BlogClient';

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

async function getPost(slug: string): Promise<Post | null> {
  try {
    // Usa a mesma rota de API que o cliente usava
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Slug inválido → 404 imediato
  if (!slug || slug === 'undefined') {
    notFound();
  }

  const post = await getPost(slug);

  // Post não encontrado → 404 real (HTTP 404 antes de responder)
  if (!post) {
    notFound();
  }

  return <BlogClient post={post} />;
}
