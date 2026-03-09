import { notFound } from 'next/navigation';
import BlogClient from './BlogClient';
import { getBlogPost } from '@/app/lib/content-loader';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug || slug === 'undefined') {
    notFound();
  }

  const post = await getBlogPost(slug);

  if (!post) {
    notFound(); // HTTP 404 real — antes de qualquer resposta ao browser
  }

  return <BlogClient post={post} />;
}
