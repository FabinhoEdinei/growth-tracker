import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'app/content/posts');

export async function GET() {
  try {
    // Verifica se a pasta existe
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json([]);
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

    // Ordena por data (mais recente primeiro)
    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json(sortedPosts);
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json([]);
  }
}