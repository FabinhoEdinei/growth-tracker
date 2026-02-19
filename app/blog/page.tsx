import { BlogHeader } from '../components/Blog/BlogHeader';
import { BlogList } from '../components/Blog/BlogList';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function getAllPosts() {
  try {
    const postsDirectory = path.join(process.cwd(), 'app/content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const mdFiles = fileNames.filter((name: string) => name.endsWith('.md'));

    const posts = mdFiles.map((fileName: string) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        title: data.title || 'Sem título',
        slug: data.slug || fileName.replace(/\.md$/, ''),
        date: data.date || new Date().toISOString().split('T')[0],
        author: data.author || 'Anônimo',
        category: data.category || 'Geral',
        excerpt: data.excerpt || '',
        image: data.image,
      };
    });

    return posts.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <style jsx global>{`
        .blog-page-container {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1));
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .blog-back-button {
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

        .blog-back-button:hover {
          background: rgba(0,255,255,0.2);
          box-shadow: 0 0 20px rgba(0,255,255,0.3);
          transform: translateX(-4px);
        }

        @media (max-width: 768px) {
          .blog-back-button {
            top: 15px;
            left: 15px;
            padding: 8px 16px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="blog-page-container">
        <Link href="/" className="blog-back-button">
          ← Voltar ao App
        </Link>

        <BlogHeader />
        <BlogList posts={posts} />
      </div>
    </>
  );
}