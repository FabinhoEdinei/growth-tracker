import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Força runtime Node.js para usar fs
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PostMeta {
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
}

function lerPosts(dirPath: string): PostMeta[] {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`[dashboard-algas] Diretório não encontrado: ${dirPath}`);
      return [];
    }

    const arquivos = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    console.log(`[dashboard-algas] Encontrados ${arquivos.length} arquivos em ${dirPath}`);

    return arquivos
      .map(arquivo => {
        try {
          const raw = fs.readFileSync(path.join(dirPath, arquivo), 'utf8');
          const { data, content } = matter(raw);

          let dateStr = '';
          if (data.date) {
            dateStr =
              data.date instanceof Date
                ? data.date.toISOString()
                : String(data.date);
          }

          return {
            title: data.title ?? arquivo.replace('.md', ''),
            slug: data.slug ?? arquivo.replace('.md', ''),
            date: dateStr,
            category: data.category ?? 'Outros',
            excerpt:
              data.excerpt ??
              content.slice(0, 120).replace(/[#*`]/g, '').trim(),
          };
        } catch (e) {
          console.log(`[dashboard-algas] Erro ao ler ${arquivo}:`, e);
          return null;
        }
      })
      .filter(Boolean) as PostMeta[];
  } catch (e) {
    console.error(`[dashboard-algas] Erro ao ler diretório ${dirPath}:`, e);
    return [];
  }
}

function calcularPostsPorMes(posts: PostMeta[]) {
  const meses: Record<string, number> = {};
  const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  posts.forEach(p => {
    if (!p.date) return;
    const d = new Date(p.date);
    if (isNaN(d.getTime())) return;

    const key = `${d.getFullYear()}-${d.getMonth()}`;
    meses[key] = (meses[key] || 0) + 1;
  });

  const hoje = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    return {
      month: labels[d.getMonth()],
      posts: meses[key] || 0,
      year: d.getFullYear(),
    };
  });
}

function calcularCategorias(posts: PostMeta[]) {
  const map: Record<string, number> = {};
  posts.forEach(p => {
    map[p.category] = (map[p.category] || 0) + 1;
  });

  const cores = ['#00ff88','#00cc6a','#00994d','#a855f7','#00d4ff','#ff4520','#e8b84b'];

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count], i) => ({
      name,
      count,
      color: cores[i] ?? '#00ff88',
    }));
}

export async function GET() {
  try {
    const base = process.cwd();
    console.log(`[dashboard-algas] Base path: ${base}`);

    const postsBlog = lerPosts(path.join(base, 'app/content/post'));
    const postsBlog2 = lerPosts(path.join(base, 'app/content/posts'));
    const postsJornal = lerPosts(path.join(base, 'app/content/jornal'));

    const todosBlogs = [...postsBlog, ...postsBlog2];
    const todosPosts = [...todosBlogs, ...postsJornal];

    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    const postsEsteMes = todosPosts.filter(p => {
      const d = new Date(p.date);
      if (isNaN(d.getTime())) return false;
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    }).length;

    const mesAnterior = todosPosts.filter(p => {
      const d = new Date(p.date);
      if (isNaN(d.getTime())) return false;

      const prev = new Date(anoAtual, mesAtual - 1, 1);
      return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear();
    }).length;

    const growthRate =
      mesAnterior > 0
        ? Math.round(((postsEsteMes - mesAnterior) / mesAnterior) * 100 * 10) / 10
        : postsEsteMes > 0
        ? 100
        : 0;

    const recentes = [...todosPosts]
      .filter(p => p.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const appPath = path.join(base, 'app');
    let totalLinhas = 0,
      totalArquivos = 0;
    const porTipo: Record<string, number> = {};

    function contarArquivos(dir: string, depth = 0) {
      if (depth > 10) return;

      try {
        if (!fs.existsSync(dir)) return;

        for (const f of fs.readdirSync(dir)) {
          if (['node_modules', '.next', '.git', 'public', '.vercel'].includes(f)) continue;

          const full = path.join(dir, f);

          try {
            const stat = fs.statSync(full);

            if (stat.isDirectory()) {
              contarArquivos(full, depth + 1);
              continue;
            }

            const ext = path.extname(f);

            if (['.tsx','.ts','.css','.md','.json'].includes(ext)) {
              totalArquivos++;
              porTipo[ext] = (porTipo[ext] || 0) + 1;

              try {
                totalLinhas += fs.readFileSync(full, 'utf8').split('\n').length;
              } catch {}
            }
          } catch {}
        }
      } catch (e) {
        console.error(`[dashboard-algas] Erro ao contar arquivos em ${dir}:`, e);
      }
    }

    contarArquivos(appPath);

    return NextResponse.json({
      blog: {
        totalPosts: todosBlogs.length,
        postsEsteMes,
        growthRate,
        postsByCategory: calcularCategorias(todosBlogs),
        monthlyData: calcularPostsPorMes(todosBlogs),
        recentes: recentes.filter(p =>
          todosBlogs.find(b => b.slug === p.slug)
        ),
      },
      jornal: {
        totalPosts: postsJornal.length,
        postsEsteMes: postsJornal.filter(p => {
          const d = new Date(p.date);
          if (isNaN(d.getTime())) return false;
          return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
        }).length,
        recentes: postsJornal
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3),
      },
      geral: {
        totalConteudo: todosPosts.length,
        postsHoje: todosPosts.filter(p => {
          if (!p.date) return false;

          const hoje = new Date().toISOString().split('T')[0];
          const d = new Date(p.date);

          if (isNaN(d.getTime())) return false;

          return d.toISOString().startsWith(hoje);
        }).length,
      },
      codigo: {
        linhasDeCodigo: totalLinhas,
        arquivos: totalArquivos,
        arquivosPorTipo: porTipo,
      },
      geradoEm: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[dashboard-algas] API error:', error);

    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: message,
        stack: process.env.NODE_ENV === 'development' ? stack : undefined,
      },
      { status: 500 }
    );
  }
}