import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

interface JornalPost {
  slug: string;
  title: string;
  type: string;
  date: string;
  excerpt: string;
  character?: string;
  content: string;
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const jornalDirectory = path.join(process.cwd(), 'app/content/jornal');

    if (!fs.existsSync(jornalDirectory)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const filenames = fs.readdirSync(jornalDirectory);

    // Primeiro, procurar por arquivo que tenha o slug no frontmatter
    let mdFile: string | undefined;

    for (const filename of filenames) {
      if (!filename.endsWith('.md')) continue;

      try {
        const filePath = path.join(jornalDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        const fileSlug = data.slug || filename.replace('.md', '');

        if (fileSlug === slug) {
          mdFile = filename;
          break;
        }
      } catch (error) {
        // Continuar em caso de erro ao ler um arquivo
        continue;
      }
    }

    if (!mdFile) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const filePath = path.join(jornalDirectory, mdFile);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const post: JornalPost = {
      slug: data.slug || slug,
      title: data.title || '',
      type: data.type || 'fatos',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      character: data.character,
      content: await marked(content),
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error loading post:', error);
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
}
