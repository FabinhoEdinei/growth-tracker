import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tv-report
// Versão robusta para Vercel — não usa fs diretamente
// Consome /api/etf-cota e /api/code-stats internamente
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface PostItem {
  titulo:   string;
  slug:     string;
  date:     string;
  category: string;
  excerpt?: string;
  tipo:     'blog' | 'jornal' | 'tv';
}

interface EtfResponse {
  cota?: {
    codigoCompleto: string;
    valorTotal:     number;
    status:         'disponivel' | 'vendida';
    blocos:         { tipo: string; contribuicao: number }[];
  };
  resumo?: {
    postsBlog:   number;
    postsJornal: number;
    totalPosts:  number;
  };
}

interface CodeStatsResponse {
  posts?: PostItem[];
}

// ── Helper — fetch interno com timeout ───────────────────────────────────────
async function fetchInternal<T>(url: string, baseUrl: string): Promise<T | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res   = await fetch(`${baseUrl}${url}`, {
      cache:  'no-store',
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ── Score de saúde baseado nos dados reais ────────────────────────────────────
function calcularScore(postsBlog: number, postsJornal: number, temEtf: boolean): number {
  let score = 0;
  score += Math.min(postsBlog   * 8, 40);  // até 40pts
  score += Math.min(postsJornal * 10, 30); // até 30pts
  if (temEtf) score += 20;                 // 20pts
  score += 10;                             // base sempre
  return Math.min(score, 100);
}

function calcularTendencia(score: number): 'crescendo' | 'estável' | 'atenção' {
  if (score >= 75) return 'crescendo';
  if (score >= 45) return 'estável';
  return 'atenção';
}

// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    const baseUrl = new URL(request.url).origin;

    // ── Busca paralela nas duas APIs que já funcionam ─────────────────────
    const [etfData, codeData] = await Promise.all([
      fetchInternal<EtfResponse>('/api/etf-cota',   baseUrl),
      fetchInternal<CodeStatsResponse>('/api/code-stats', baseUrl),
    ]);

    // ── Extrai posts ──────────────────────────────────────────────────────
    const allPosts  = codeData?.posts ?? [];
    const blogPosts = allPosts.filter(p => p.tipo === 'blog');
    const jornalPosts = allPosts.filter(p => p.tipo === 'jornal');

    // ── Dados do ETF ──────────────────────────────────────────────────────
    const cota = etfData?.cota ?? null;
    const resumoEtf = etfData?.resumo;

    // Usa contagem do ETF como fallback se code-stats não retornar posts
    const totalBlog   = blogPosts.length   || resumoEtf?.postsBlog   || 0;
    const totalJornal = jornalPosts.length || resumoEtf?.postsJornal || 0;
    const totalPosts  = totalBlog + totalJornal;

    // ── Métricas calculadas ───────────────────────────────────────────────
    const score     = calcularScore(totalBlog, totalJornal, !!cota);
    const tendencia = calcularTendencia(score);

    const alertas: string[] = [];
    const destaques: string[] = [];

    if (totalPosts === 0)  alertas.push('Nenhuma publicação encontrada — verifique as APIs de conteúdo');
    if (!cota)             alertas.push('Cota ETF não gerada — acesse Pentáculos para minerar');
    if (cota?.status === 'disponivel') destaques.push(`🔮 Cota ${cota.codigoCompleto} disponível para venda`);
    if (totalBlog >= 3)    destaques.push(`📝 ${totalBlog} posts no blog`);
    if (totalJornal >= 1)  destaques.push(`📰 ${totalJornal} edição(ões) no jornal`);
    if (score >= 80)       destaques.push('🚀 App em excelente forma!');

    // ── Monta relatório no formato que os cards esperam ───────────────────
    const relatorio = {
      data: new Date().toLocaleDateString('pt-BR'),

      resumo: {
        postsBlog:           totalBlog,
        postsJornal:         totalJornal,
        arquivosModificados: 0,
        duracaoTotal:        '—',
      },

      testes: {
        total:  0,
        passou: 0,
        falhou: 0,
        taxa:   '—',
      },

      conteudo: {
        blog:   blogPosts.slice(0, 5).map(p => ({
          titulo:  p.titulo,
          slug:    p.slug,
          data:    p.date,
          excerpt: p.excerpt ?? '',
        })),
        jornal: jornalPosts.slice(0, 5).map(p => ({
          titulo:  p.titulo,
          slug:    p.slug,
          data:    p.date,
          excerpt: p.excerpt ?? '',
        })),
      },

      metricas: {
        linhasDeCodigo: 0,
        arquivos:       0,
        arquivosPorTipo: {},
      },

      // ── Dados extras para a TV ────────────────────────────────────────
      tv: {
        scoreSaude:        score,
        tendencia,
        totalConteudo:     totalPosts,
        statusApp:         totalPosts > 0 ? 'ativo' : 'aguardando',
        ultimaAtualizacao: new Date().toISOString(),
        alertas,
        destaques,
        // Dados do ETF direto na resposta
        etf: cota ? {
          codigo:   cota.codigoCompleto,
          valor:    cota.valorTotal,
          status:   cota.status,
          blocos:   cota.blocos,
        } : null,
        // Últimos posts para exibir no card
        ultimosBlog:   blogPosts.slice(0, 3),
        ultimosJornal: jornalPosts.slice(0, 3),
      },
    };

    return NextResponse.json({ relatorio, jornal: null });

  } catch (error) {
    console.error('[tv-report] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar TV report', detalhe: String(error) },
      { status: 500 }
    );
  }
}

// ── POST — mantido para compatibilidade, retorna erro informativo ─────────────
export async function POST() {
  return NextResponse.json(
    { error: 'Geração de jornal via POST desabilitada nesta versão. Use a página Pentáculos.' },
    { status: 501 }
  );
}
