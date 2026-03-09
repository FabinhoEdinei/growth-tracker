import { PostContent } from './PostContent';

// Este é um Server Component (padrão do Next.js 16)
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <PostContent paramsPromise={params} />;
}
