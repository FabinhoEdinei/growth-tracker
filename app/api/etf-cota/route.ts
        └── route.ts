import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { calcularBloco, gerarCota, type PostData } from '@/lib/etf-cota-engine';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/etf-cota
// Lê todos os posts reais e gera a cota ETF composta
// ─────────────────────────────────────────────────────────────────────────────

function lerPostsDir(dirPath: string, tipo: PostData['tipo']): PostData[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .flatMap(arquivo => {
      try {
        const raw = fs.readFileSync(path.join(dirPath, arquivo), 'utf8');
        const { data, content } = matter(raw);
        return [{
          titulo:   data.title    ?? arquivo.replace('.md', ''),
          slug:     data.slug     ?? arquivo.replace('.md', ''),
          date:     data.date     ?? '',
          category: data.category ?? 'Geral',
          excerpt:  data.excerpt  ?? content.slice(0, 200).replace(/[#*`]/g, '').trim(),
          tipo,
        }] as PostData[];
      } catch { return []; }
    });
}

export async function GET() {
  try {
    const base = process.cwd();

    const postsBlog = [
      ...lerPostsDir(path.join(base, 'app/content/post'), 'blog'),
      ...lerPostsDir(path.join(base, 'app/content/posts'), 'blog'),
    ];
    const postsJornal = lerPostsDir(path.join(base, 'app/content/jornal'), 'jornal');

    // TV: gera post sintético baseado na data atual (sem arquivos .md próprios)
    const postsTv: PostData[] = [{
      titulo:   'TV Empresarial Growth Tracker',
      slug:     'tv-empresarial',
      date:     new Date().toISOString().split('T')[0],
      category: 'TV',
      excerpt:  'Dashboard de métricas empresariais e relatório diário do sistema de crescimento digital.',
      tipo:     'tv',
    }];

    const cota = gerarCota(postsBlog, postsJornal, postsTv);

    return NextResponse.json({
      cota,
      resumo: {
        totalPosts: postsBlog.length + postsJornal.length,
        postsBlog:   postsBlog.length,
        postsJornal: postsJornal.length,
      }
    });
  } catch (error) {
    console.error('ETF Cota API error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
