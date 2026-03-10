import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { DailyReport } from './daily-report-generator';

// ─────────────────────────────────────────────────────────────────────────────
// jornal-md-generator.ts
// Gera um arquivo .md para o jornal a partir dos dados do relatório diário.
// A narrativa é em estilo western/cronista — voz do Fabio ou Cláudia.
// ─────────────────────────────────────────────────────────────────────────────

export interface JornalPostConfig {
  personagem: 'fabio' | 'claudia';
  tipo: 'fatos' | 'lugares' | 'fabio' | 'claudia';
  salvarEmDisco?: boolean; // false = só retorna o conteúdo sem salvar
}

// ── Utilitários ───────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDatePtBR(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ── Frases de abertura por personagem ────────────────────────────────────────

const ABERTURAS_FABIO = [
  'O sol raiou sobre o território digital e mais um dia de conquistas começou.',
  'Montei meu cavalo de código e saí pela pradaria dos commits.',
  'O vento do oeste trouxe notícias — e o Growth Tracker registrou cada uma.',
  'Neste cantão de pixels e linhas de código, o dia foi próspero.',
];

const ABERTURAS_CLAUDIA = [
  'Entre o aroma do café matinal e o brilho da tela, o dia se revelou cheio.',
  'Com minha agenda de designs e uma xícara de curiosidade, parti para explorar.',
  'As flores do jardim digital floresceram mais uma vez neste belo dia.',
  'Registrei em meu diário cada momento que valeu a pena lembrar.',
];

function abertura(personagem: 'fabio' | 'claudia'): string {
  const lista = personagem === 'fabio' ? ABERTURAS_FABIO : ABERTURAS_CLAUDIA;
  return lista[Math.floor(Math.random() * lista.length)];
}

// ── Seções narrativas ─────────────────────────────────────────────────────────

function secaoPostagens(relatorio: DailyReport, personagem: 'fabio' | 'claudia'): string {
  const total = relatorio.resumo.postsJornal + relatorio.resumo.postsBlog;
  if (total === 0) return '';

  const voz = personagem === 'fabio'
    ? `Neste dia, ${total} história(s) foram registradas no território do Growth Tracker.`
    : `Foram ${total} publicação(ões) lançadas ao vento — cada uma com sua própria alma.`;

  let secao = `## 📰 As Publicações do Dia\n\n${voz}\n\n`;

  if (relatorio.conteudo.jornal.length > 0) {
    secao += `### No Jornal\n\n`;
    relatorio.conteudo.jornal.slice(0, 3).forEach(post => {
      secao += `**${post.titulo}**\n> ${post.excerpt || 'Uma história que vale a leitura.'}\n\n`;
    });
  }

  if (relatorio.conteudo.blog.length > 0) {
    secao += `### No Blog\n\n`;
    relatorio.conteudo.blog.slice(0, 3).forEach(post => {
      secao += `**${post.titulo}**\n> ${post.excerpt || 'Conhecimento compartilhado com o mundo.'}\n\n`;
    });
  }

  return secao;
}

function secaoCodigo(relatorio: DailyReport, personagem: 'fabio' | 'claudia'): string {
  const { linhasDeCodigo, arquivos, arquivosPorTipo } = relatorio.metricas;
  const tipoMaisComum = Object.entries(arquivosPorTipo)
    .sort((a, b) => b[1] - a[1])[0];

  const voz = personagem === 'fabio'
    ? `Com ${arquivos} arquivos percorridos e ${(linhasDeCodigo / 1000).toFixed(1)}k linhas de território mapeado, o dia de código foi intenso.`
    : `Navegando por ${arquivos} arquivos — cada um um capítulo desta grande história digital.`;

  const detalhe = tipoMaisComum
    ? `O tipo de arquivo mais presente foi \`${tipoMaisComum[0]}\`, com **${tipoMaisComum[1]}** ocorrências.`
    : '';

  const arqMod = relatorio.resumo.arquivosModificados;

  return `## 💻 O Território do Código\n\n${voz} ${detalhe}\n\n**${arqMod}** arquivos foram modificados ao longo do dia — cada alteração um passo rumo ao progresso.\n\n`;
}

function secaoTestes(relatorio: DailyReport, personagem: 'fabio' | 'claudia'): string {
  const { passou, falhou, total, taxa } = relatorio.testes;

  const voz = personagem === 'fabio'
    ? `Na arena dos testes, ${passou} desafios foram superados e ${falhou} ainda aguardam domação.`
    : `Os testes revelaram sua verdade: ${passou} aprovados, ${falhou} a revisar — com uma taxa de sucesso de **${taxa}**.`;

  const humor = falhou === 0
    ? '🏆 Perfeição absoluta — todos os testes passaram!'
    : falhou <= 2
    ? '⚡ Quase lá — poucos ajustes e o resultado será impecável.'
    : '🔧 Há trabalho a fazer, mas cada bug resolvido é uma vitória.';

  return `## 🧪 A Batalha dos Testes\n\n${voz}\n\n${humor}\n\n| Resultado | Quantidade |\n|-----------|------------|\n| ✅ Passou | ${passou} |\n| ❌ Falhou | ${falhou} |\n| 📊 Total  | ${total} |\n| 🎯 Taxa   | ${taxa} |\n\n`;
}

function secaoTempo(relatorio: DailyReport, personagem: 'fabio' | 'claudia'): string {
  const duracao = relatorio.resumo.duracaoTotal;

  const voz = personagem === 'fabio'
    ? `O relógio marcou **${duracao}** de jornada — tempo bem investido na construção do futuro digital.`
    : `Foram **${duracao}** de dedicação plena. Cada minuto, uma semente plantada.`;

  return `## ⏱️ O Tempo Investido\n\n${voz}\n\n`;
}

function secaoEncerramento(personagem: 'fabio' | 'claudia', data: string): string {
  const voz = personagem === 'fabio'
    ? `E assim termina mais um dia no Growth Tracker. O pôr do sol digital encontra o território mais desenvolvido do que o amanhecer. Até amanhã, parceiros!`
    : `Fecho meu diário com gratidão por mais um dia de descobertas. O crescimento não para — e nós também não. Até a próxima edição!`;

  return `## 🌅 Até Amanhã\n\n${voz}\n\n---\n\n*Registrado em ${data} pelo Growth Tracker TV*\n`;
}

// ── Gerador principal ─────────────────────────────────────────────────────────

export function gerarPostJornal(
  relatorio: DailyReport,
  config: JornalPostConfig = { personagem: 'fabio', tipo: 'fatos', salvarEmDisco: true }
): { slug: string; frontmatter: string; conteudo: string; caminhoArquivo: string } {
  const agora = new Date();
  const dataFormatada = formatDate(agora);
  const dataPtBR = formatDatePtBR(agora);

  const { personagem, tipo } = config;

  // ── Título dinâmico ───────────────────────────────────────────────────────
  const totalPosts = relatorio.resumo.postsJornal + relatorio.resumo.postsBlog;
  const titulos = {
    fabio: [
      `Dia ${dataFormatada}: Entre Bugs e Conquistas no Território Digital`,
      `Crônicas do Oeste Digital — ${dataPtBR}`,
      `O Sheriff do Código Relata: ${totalPosts} Publicação(ões) e Muito Mais`,
    ],
    claudia: [
      `Diário de ${dataPtBR}: Um Dia de Descobertas e Crescimento`,
      `Cláudia Registra: As Histórias que o Dia Trouxe`,
      `${dataPtBR} — Páginas de um Dia Produtivo`,
    ],
  };
  const listaTitulos = titulos[personagem];
  const titulo = listaTitulos[Math.floor(Math.random() * listaTitulos.length)];

  const slug = `${dataFormatada}-${slugify(titulo)}`;

  const excerptBase = `Relatório do dia ${dataPtBR}: ${totalPosts} publicação(ões), ${relatorio.metricas.arquivos} arquivos analisados e uma taxa de testes de ${relatorio.testes.taxa}.`;

  // ── Frontmatter ───────────────────────────────────────────────────────────
  const frontmatter = matter.stringify('', {
    title: titulo,
    slug,
    date: dataFormatada,
    author: personagem === 'fabio' ? 'Fabio Edinei' : 'Cláudia',
    character: personagem,
    type: tipo,
    category: 'Relatório Diário',
    excerpt: excerptBase,
    tags: ['relatório', 'daily', 'growth-tracker', dataFormatada],
  });

  // ── Corpo da história ─────────────────────────────────────────────────────
  const corpo = [
    `# ${titulo}\n`,
    `*${dataPtBR}*\n`,
    `---\n`,
    `${abertura(personagem)}\n`,
    secaoPostagens(relatorio, personagem),
    secaoCodigo(relatorio, personagem),
    secaoTestes(relatorio, personagem),
    secaoTempo(relatorio, personagem),
    secaoEncerramento(personagem, dataPtBR),
  ].join('\n');

  // ── Conteúdo completo (frontmatter + corpo) ───────────────────────────────
  const conteudoCompleto = frontmatter + corpo;

  // ── Salvar em disco ───────────────────────────────────────────────────────
  const jornalPath = path.join(process.cwd(), 'app/content/jornal');
  const nomeArquivo = `${slug}.md`;
  const caminhoArquivo = path.join(jornalPath, nomeArquivo);

  if (config.salvarEmDisco !== false) {
    if (!fs.existsSync(jornalPath)) {
      fs.mkdirSync(jornalPath, { recursive: true });
    }
    fs.writeFileSync(caminhoArquivo, conteudoCompleto, 'utf8');
  }

  return { slug, frontmatter, conteudo: conteudoCompleto, caminhoArquivo };
}

// ── Verificar se já foi gerado hoje ──────────────────────────────────────────

export function postJornalJaGeradoHoje(): boolean {
  const jornalPath = path.join(process.cwd(), 'app/content/jornal');
  if (!fs.existsSync(jornalPath)) return false;

  const hoje = formatDate(new Date());
  const arquivos = fs.readdirSync(jornalPath);

  return arquivos.some(f => f.startsWith(hoje) && f.endsWith('.md'));
}
