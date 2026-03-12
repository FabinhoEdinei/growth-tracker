// app/api/etf-cota/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { gerarCota, type PostData } from '@/lib/etf-cota-engine';

export const dynamic = 'force-dynamic';

// ── Tenta vários caminhos possíveis para os posts ────────────────────────────
function lerPostsDirs(candidatos: string[], tipo: PostData['tipo']): PostData[] {
  for (const dirPath of candidatos) {
    if (!fs.existsSync(dirPath)) continue;
    const arquivos = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    if (arquivos.length === 0) continue;

    return arquivos.flatMap(arquivo => {
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
  return []; // nenhum caminho funcionou → retorna vazio (não quebra)
}

export async function GET() {
  try {
    const base = process.cwd();

    // ── Blog: tenta todos os caminhos comuns ─────────────────────────────────
    const postsBlog = lerPostsDirs([
      path.join(base, 'app', 'content', 'post'),
      path.join(base, 'app', 'content', 'posts'),
      path.join(base, 'content', 'post'),
      path.join(base, 'content', 'posts'),
      path.join(base, 'posts'),
      path.join(base, 'public', 'posts'),
    ], 'blog');

    // ── Jornal: tenta todos os caminhos comuns ────────────────────────────────
    const postsJornal = lerPostsDirs([
      path.join(base, 'app', 'content', 'jornal'),
      path.join(base, 'content', 'jornal'),
      path.join(base, 'jornal'),
      path.join(base, 'public', 'jornal'),
    ], 'jornal');

    // ── TV: post sintético (sempre existe) ───────────────────────────────────
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
        totalPosts:  postsBlog.length + postsJornal.length,
        postsBlog:   postsBlog.length,
        postsJornal: postsJornal.length,
        // debug: mostra quais caminhos têm conteúdo (remove em produção)
        _debug: {
          cwd: base,
          blogCount:   postsBlog.length,
          jornalCount: postsJornal.length,
        },
      },
    });

  } catch (error: any) {
    console.error('[etf-cota] Erro:', error);
    return NextResponse.json(
      { error: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
