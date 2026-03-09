import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  author: string;
  readTime: string;
  content: string;
  image?: string;
}

export interface JornalPost {
  slug: string;
  title: string;
  type: string;
  date: string;
  excerpt: string;
  character?: string;
  content: string;
}

// ─── Helper interno ───────────────────────────────────────────────────────────

function findMdFile(directory: string, slug: string): string | null {
  if (!fs.existsSync(directory)) return null;

  const filenames = fs.readdirSync(directory).filter(f => f.endsWith('.md'));

  for (const filename of filenames) {
    try {
      const filePath = path.join(directory, filename);
      const { data } = matter(fs.readFileSync(filePath, 'utf8'));
      const fileSlug = data.slug || filename.replace('.md', '');
      if (fileSlug === slug) return filename;
    } catch {
      continue;
    }
  }
  return null;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Tenta 'posts' primeiro, depois 'post' como fallback
  const dirs = ['posts', 'post'];

  for (const dir of dirs) {
    const directory = path.join(process.cwd(), 'app/content', dir);
    const filename = findMdFile(directory, slug);
    if (!filename) continue;

    try {
      const filePath = path.join(directory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: data.slug || slug,
        title: data.title || '',
        category: data.category || 'geral',
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        author: data.author || 'Anônimo',
        readTime: data.readTime || data.read_time || '5 min',
        content: await marked(content),
        image: data.image,
      };
    } catch {
      continue;
    }
  }

  return null;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const dirs = ['posts', 'post'];
  const seen = new Set<string>();
  const posts: BlogPost[] = [];

  for (const dir of dirs) {
    const directory = path.join(process.cwd(), 'app/content', dir);
    if (!fs.existsSync(directory)) continue;

    const filenames = fs.readdirSync(directory)
      .filter(f => f.endsWith('.md'))
      .sort();

    for (const filename of filenames) {
      try {
        const filePath = path.join(directory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const slug = data.slug || filename.replace('.md', '');

        if (seen.has(slug)) continue;
        seen.add(slug);

        posts.push({
          slug,
          title: data.title || '',
          category: data.category || 'geral',
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || '',
          author: data.author || 'Anônimo',
          readTime: data.readTime || data.read_time || '5 min',
          content: await marked(content),
          image: data.image,
        });
      } catch {
        continue;
      }
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ─── Jornal ───────────────────────────────────────────────────────────────────

export async function getJornalPost(slug: string): Promise<JornalPost | null> {
  const directory = path.join(process.cwd(), 'app/content/jornal');
  const filename = findMdFile(directory, slug);
  if (!filename) return null;

  try {
    const filePath = path.join(directory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug || slug,
      title: data.title || '',
      type: data.type || 'fatos',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      character: data.character,
      content: await marked(content),
    };
  } catch {
    return null;
  }
}

export async function getAllJornalPosts(): Promise<JornalPost[]> {
  const directory = path.join(process.cwd(), 'app/content/jornal');
  if (!fs.existsSync(directory)) return [];

  const filenames = fs.readdirSync(directory)
    .filter(f => f.endsWith('.md'))
    .sort();

  const posts: JornalPost[] = [];

  for (const filename of filenames) {
    try {
      const filePath = path.join(directory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      posts.push({
        slug: data.slug || filename.replace('.md', ''),
        title: data.title || '',
        type: data.type || 'fatos',
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        character: data.character,
        content: await marked(content),
      });
    } catch {
      continue;
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
