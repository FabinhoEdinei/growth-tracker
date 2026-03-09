import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const postsDirectory = path.join(process.cwd(), 'app/content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json(
        { error: 'Posts directory not found' },
        { status: 404 }
      );
    }

    const filenames = fs.readdirSync(postsDirectory);
    
    const mdFile = filenames.find(
      (filename) => {
        const fileSlug = filename.replace('.md', '');
        return fileSlug === params.slug || fileSlug.toLowerCase() === params.slug.toLowerCase();
      }
    );

    if (!mdFile) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const filePath = path.join(postsDirectory, mdFile);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const post = {
      slug: data.slug || params.slug,
      title: data.title || '',
      category: data.category || 'Místico',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      author: data.author || 'Fabio Edinei',
      readTime: data.readTime || '1 min',
      content: marked(content),
      image: data.image,
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error loading post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}