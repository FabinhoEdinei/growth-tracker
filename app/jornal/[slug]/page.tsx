import { notFound } from 'next/navigation';
import { getJornalPost } from '@/app/lib/content-loader';

// Se você tiver um JornalClient, importe aqui:
// import JornalClient from './JornalClient';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug || slug === 'undefined') {
    notFound();
  }

  const post = await getJornalPost(slug);

  if (!post) {
    notFound(); // HTTP 404 real
  }

  // Se tiver JornalClient:
  // return <JornalClient post={post} />;

  // Fallback direto caso não tenha client component separado:
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
