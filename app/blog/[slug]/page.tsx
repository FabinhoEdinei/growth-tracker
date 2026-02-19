import { BlogPost } from '../../components/Blog/BlogPost';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import styles from './post.module.css';

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
    <div className={styles.postPageContainer}>
      <Link href="/blog" className={styles.backButton}>
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
  );
}