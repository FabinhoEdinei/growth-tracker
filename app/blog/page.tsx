import { BlogHeader } from '../components/Blog/BlogHeader';
import { BlogList } from '../components/Blog/BlogList';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Server Component - sem 'use client'
function getAllPosts() {
  try {
    const postsDirectory = path.join(process.cwd(), 'app/content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const mdFiles = fileNames.filter(name => name.endsWith('.md'));

    const posts = mdFiles.map(fileName => {
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

    return posts.sort((a, b) => {
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
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1))',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
    }}>
      <Link 
        href="/" 
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 100,
          padding: '10px 20px',
          background: 'rgba(0,255,255,0.1)',
          border: '1px solid rgba(0,255,255,0.3)',
          borderRadius: '8px',
          color: '#00ffff',
          fontFamily: 'Courier New, monospace',
          fontSize: '12px',
          letterSpacing: '1px',
          textDecoration: 'none',
          transition: 'all 0.3s',
          backdropFilter: 'blur(10px)',
        }}
      >
        ← Voltar ao App
      </Link>

      <BlogHeader />
      <BlogList posts={posts} />
    </div>
  );
}