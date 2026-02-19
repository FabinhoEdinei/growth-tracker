import { BlogHeader } from '../components/Blog/BlogHeader';
import { BlogList } from '../components/Blog/BlogList';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import styles from './blog.module.css';

function getAllPosts() {
  try {
    const postsDirectory = path.join(process.cwd(), 'app/content/post');
    
    if (!fs.existsSync(postsDirectory)) {
      console.log('Post directory not found');
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const mdFiles = fileNames.filter((name: string) => name.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.log('No markdown files found');
      return [];
    }

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
    <div className={styles.blogPageContainer}>
      <Link href="/" className={styles.backButton}>
        ← Voltar ao App
      </Link>

      <BlogHeader />
      <BlogList post={post} />
    </div>
  );
}