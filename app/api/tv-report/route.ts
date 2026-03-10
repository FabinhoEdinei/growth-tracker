import { NextResponse } from 'next/server';
import { DailyReportGenerator } from '@/app/utils/daily-report-generator';
import { gerarPostJornal, postJornalJaGeradoHoje } from '@/app/utils/jornal-md-generator';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tv-report
// Retorna o relatório diário enriquecido com metadados extras para a TV.
// Query params:
//   ?gerarJornal=true  → gera e salva o .md do jornal se ainda não existe
//   ?personagem=fabio|claudia
//   ?forcarJornal=true → força geração mesmo que já exista
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deveGerarJornal = searchParams.get('gerarJornal') === 'true';
    const forcarJornal    = searchParams.get('forcarJornal') === 'true';
    const personagem      = (searchParams.get('personagem') ?? 'fabio') as 'fabio' | 'claudia';

    // ── Gerar relatório base ──────────────────────────────────────────────
    const generator = new DailyReportGenerator();
    const relatorio = generator.gerarRelatorioDodia();

    // ── Enriquecer com metadados para a TV ───────────────────────────────
    const totalConteudo = relatorio.resumo.postsJornal + relatorio.resumo.postsBlog;
    const scoreSaude    = calcularScoreSaude(relatorio);
    const tendencia     = calcularTendencia(relatorio);

    const relatorioEnriquecido = {
      ...relatorio,
      tv: {
        scoreSaude,
        tendencia,
        totalConteudo,
        statusApp: totalConteudo > 0 ? 'ativo' : 'aguardando',
        ultimaAtualizacao: new Date().toISOString(),
        alertas: gerarAlertas(relatorio),
        destaques: gerarDestaques(relatorio),
      },
    };

    // ── Gerar .md do jornal (opcional) ────────────────────────────────────
    let jornalGerado = null;
    if (deveGerarJornal) {
      const jaExiste = postJornalJaGeradoHoje();

      if (!jaExiste || forcarJornal) {
        try {
          jornalGerado = gerarPostJornal(relatorio, {
            personagem,
            tipo: 'fatos',
            salvarEmDisco: true,
          });
          // Não retorna o conteúdo completo na resposta (pode ser grande)
          jornalGerado = {
            slug:           jornalGerado.slug,
            caminhoArquivo: jornalGerado.caminhoArquivo,
            gerado:         true,
          };
        } catch (err) {
          console.error('Erro ao gerar post do jornal:', err);
          jornalGerado = { gerado: false, erro: String(err) };
        }
      } else {
        jornalGerado = { gerado: false, motivo: 'já existe post do jornal para hoje' };
      }
    }

    return NextResponse.json({
      relatorio: relatorioEnriquecido,
      jornal: jornalGerado,
    });
  } catch (error) {
    console.error('Erro no tv-report:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar TV report' },
      { status: 500 }
    );
  }
}

// ── POST /api/tv-report — força geração do jornal com body customizado ────────

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const personagem = (body.personagem ?? 'fabio') as 'fabio' | 'claudia';
    const tipo       = body.tipo ?? 'fatos';

    const generator = new DailyReportGenerator();
    const relatorio = generator.gerarRelatorioDodia();

    const resultado = gerarPostJornal(relatorio, {
      personagem,
      tipo,
      salvarEmDisco: true,
    });

    return NextResponse.json({
      sucesso: true,
      slug:           resultado.slug,
      caminhoArquivo: resultado.caminhoArquivo,
      preview:        resultado.conteudo.slice(0, 500) + '...',
    });
  } catch (error) {
    console.error('Erro ao gerar post:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcularScoreSaude(relatorio: ReturnType<DailyReportGenerator['gerarRelatorioDodia']>): number {
  let score = 0;
  // Testes: até 40 pts
  const taxaTestes = parseInt(relatorio.testes.taxa) || 0;
  score += Math.round(taxaTestes * 0.4);
  // Conteúdo publicado: até 30 pts
  const totalPosts = relatorio.resumo.postsJornal + relatorio.resumo.postsBlog;
  score += Math.min(totalPosts * 10, 30);
  // Arquivos de código: até 30 pts
  score += Math.min(Math.round(relatorio.metricas.arquivos / 10), 30);
  return Math.min(score, 100);
}

function calcularTendencia(relatorio: ReturnType<DailyReportGenerator['gerarRelatorioDodia']>): 'crescendo' | 'estável' | 'atenção' {
  const taxa = parseInt(relatorio.testes.taxa) || 0;
  const posts = relatorio.resumo.postsJornal + relatorio.resumo.postsBlog;
  if (taxa >= 80 && posts >= 1) return 'crescendo';
  if (taxa >= 60) return 'estável';
  return 'atenção';
}

function gerarAlertas(relatorio: ReturnType<DailyReportGenerator['gerarRelatorioDodia']>): string[] {
  const alertas: string[] = [];
  if (relatorio.testes.falhou > 0) {
    alertas.push(`${relatorio.testes.falhou} teste(s) falhando — revisar antes do deploy`);
  }
  if (relatorio.resumo.postsJornal === 0 && relatorio.resumo.postsBlog === 0) {
    alertas.push('Nenhuma publicação hoje — considere criar conteúdo');
  }
  if (relatorio.resumo.arquivosModificados > 20) {
    alertas.push('Alto volume de modificações — verificar consistência');
  }
  return alertas;
}

function gerarDestaques(relatorio: ReturnType<DailyReportGenerator['gerarRelatorioDodia']>): string[] {
  const destaques: string[] = [];
  const taxa = parseInt(relatorio.testes.taxa) || 0;
  if (taxa === 100) destaques.push('💯 100% dos testes passando!');
  const total = relatorio.resumo.postsJornal + relatorio.resumo.postsBlog;
  if (total >= 3) destaques.push(`📚 Dia produtivo: ${total} publicações`);
  if (relatorio.metricas.linhasDeCodigo > 10000) {
    destaques.push(`⚡ ${(relatorio.metricas.linhasDeCodigo / 1000).toFixed(1)}k linhas de código no projeto`);
  }
  return destaques;
}
