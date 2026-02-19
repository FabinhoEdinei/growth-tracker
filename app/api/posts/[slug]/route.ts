import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'app/content/posts');

marked.setOptions({
  gfm: true,
  breaks: true,
});

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const fileName = fileNames.find(name => {
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return data.slug === slug;
    });

    if (!fileName) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const htmlContent = marked(content);

    const post = {
      title: data.title || 'Sem título',
      slug: data.slug || fileName.replace(/\.md$/, ''),
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Anônimo',
      category: data.category || 'Geral',
      excerpt: data.excerpt || '',
      image: data.image,
      content: htmlContent,
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error reading post:', error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}