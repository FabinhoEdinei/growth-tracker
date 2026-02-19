import { BlogPost } from '../../components/Blog/BlogPost';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

function getAllPostSlugs() {
  try {
    const postsDirectory = path.join(process.cwd(), 'app/content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((name: string) => name.endsWith('.md'))
      .map((name: string) => {
        const fullPath = path.join(postsDirectory, name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        return data.slug || name.replace(/\.md$/, '');
      });
  } catch (error) {
    return [];
  }
}

function getPostBySlug(slug: string) {
  try {
    const postsDirectory = path.join(process.cwd(), 'app/content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      return null;
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const fileName = fileNames.find((name: string) => {
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return data.slug === slug;
    });

    if (!fileName) {
      return null;
    }

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const htmlContent = marked(content);

    return {
      title: data.title || 'Sem título',
      slug: data.slug || fileName.replace(/\.md$/, ''),
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Anônimo',
      category: data.category || 'Geral',
      excerpt: data.excerpt || '',
      image: data.image,
      content: htmlContent as string,
    };
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <style jsx global>{`
        .post-page-container {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1));
          position: relative;
        }

        .post-back-button {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 100;
          padding: 10px 20px;
          background: rgba(0,255,255,0.1);
          border: 1px solid rgba(0,255,255,0.3);
          border-radius: 8px;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .post-back-button:hover {
          background: rgba(0,255,255,0.2);
          box-shadow: 0 0 20px rgba(0,255,255,0.3);
          transform: translateX(-4px);
        }
      `}</style>

      <div className="post-page-container">
        <Link href="/blog" className="post-back-button">
          ← Voltar ao Blog
        </Link>

        <BlogPost 
          content={post.content} 
          metadata={{
            title: post.title,
            date: post.date,
            author: post.author,
            category: post.category,
          }} 
        />
      </div>
    </>
  );
}