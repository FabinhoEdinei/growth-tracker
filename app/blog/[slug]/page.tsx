import BlogClient from './BlogClient';

// No Next 16, este arquivo é um Server Component por padrão.
// Ele apenas repassa a Promise do params para o componente de cliente.
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogClient paramsPromise={params} />;
}
