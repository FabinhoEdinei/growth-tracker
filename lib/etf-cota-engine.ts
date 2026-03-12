// ─────────────────────────────────────────────────────────────────────────────
// lib/etf-cota-engine.ts
// Motor de geração de códigos de cota do Growth Tracker ETF
//
// ALGORITMO:
// 1. Para cada post, analisa o texto completo (título + excerpt + categoria)
// 2. Conta a frequência de cada letra a-z (vogais têm peso dobrado)
// 3. Gera um número composto: cada letra vira seu índice * contagem (ex: a=1*5=5)
// 4. Soma todos → "valor bruto" do post
// 5. Converte para código alfanumérico base-36 com prefixo do tipo
// 6. Combina os 3 blocos (Blog 40% + Jornal 35% + TV 25%) em código final
// ─────────────────────────────────────────────────────────────────────────────

export interface PostData {
  titulo:   string;
  slug:     string;
  date:     string;
  category: string;
  excerpt:  string;
  tipo:     'blog' | 'jornal' | 'tv';
}

export interface BlocoETF {
  tipo:        'blog' | 'jornal' | 'tv';
  posts:       PostData[];
  valor:       number;       // valor numérico calculado
  codigo:      string;       // código alfanumérico do bloco
  peso:        number;       // 0.40 | 0.35 | 0.25
  contribuicao: number;      // valor * peso (em R$)
}

export interface CotaETF {
  id:           string;      // código único da cota
  codigoCompleto: string;    // GT-XXXX-XXXX-XXXX-[checksum]
  blocos:       BlocoETF[];
  valorTotal:   number;      // R$ 3.600,00
  dataGeracao:  string;
  versao:       string;      // hash de versão do app
  status:       'disponivel' | 'vendida';
  dono?:        string;
  empresa?:     string;
  dataVenda?:   string;
}

// ── Pesos por tipo de bloco ───────────────────────────────────────────────────
const PESOS: Record<string, number> = { blog: 0.40, jornal: 0.35, tv: 0.25 };
const VALOR_COTA = 3600;

// Vogais têm peso 2x
const VOGAIS = new Set(['a','e','i','o','u']);

// ── Análise de texto de um post ───────────────────────────────────────────────
export function analisarTexto(texto: string): Record<string, number> {
  const freq: Record<string, number> = {};
  const limpo = texto.toLowerCase().replace(/[^a-záéíóúãõâêôàç]/g, '');

  for (const char of limpo) {
    // normaliza caracteres acentuados para base
    const base = char
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace('ç', 'c');

    if (base >= 'a' && base <= 'z') {
      const peso = VOGAIS.has(base) ? 2 : 1; // vogais valem dobrado
      freq[base] = (freq[base] || 0) + peso;
    }
  }
  return freq;
}

// ── Gera valor numérico de um post ───────────────────────────────────────────
export function calcularValorPost(post: PostData): number {
  const texto = `${post.titulo} ${post.excerpt} ${post.category}`;
  const freq   = analisarTexto(texto);

  let valor = 0;
  for (let i = 0; i < 26; i++) {
    const letra = String.fromCharCode(97 + i); // 'a' = 97
    const indice = i + 1;                      // a=1, b=2, ..., z=26
    const contagem = freq[letra] || 0;
    valor += indice * contagem;
  }

  // Multiplica pelo índice de data (dias desde 01/01/2020)
  const origem = new Date('2020-01-01').getTime();
  const dataPost = post.date ? new Date(post.date).getTime() : Date.now();
  const diasDesdeOrigem = Math.max(1, Math.floor((dataPost - origem) / 86400000));
  valor = valor * diasDesdeOrigem;

  return valor;
}

// ── Converte número para código alfanumérico estilo ticker ───────────────────
function numParaCodigo(n: number, tamanho = 6): string {
  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem 0,O,1,I para clareza
  let resultado = '';
  let num = Math.abs(Math.round(n));

  if (num === 0) return CHARS[0].repeat(tamanho);

  while (num > 0 && resultado.length < tamanho) {
    resultado = CHARS[num % CHARS.length] + resultado;
    num = Math.floor(num / CHARS.length);
  }

  return resultado.padStart(tamanho, CHARS[0]);
}

// ── Checksum simples (soma dos char codes mod 36) ────────────────────────────
function gerarChecksum(codigo: string): string {
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let soma = 0;
  for (const c of codigo) soma += c.charCodeAt(0);
  return CHARS[soma % CHARS.length] + CHARS[(soma * 7) % CHARS.length];
}

// ── Calcula um bloco inteiro ──────────────────────────────────────────────────
export function calcularBloco(posts: PostData[], tipo: 'blog' | 'jornal' | 'tv'): BlocoETF {
  const peso = PESOS[tipo];

  if (posts.length === 0) {
    return {
      tipo, posts, peso,
      valor: 0,
      codigo: numParaCodigo(0),
      contribuicao: 0,
    };
  }

  // Soma os valores de todos os posts do bloco
  const valorBruto = posts.reduce((acc, p) => acc + calcularValorPost(p), 0);

  // Normaliza para range razoável (módulo de um número grande primo)
  const valorNorm = valorBruto % 99991999;

  const codigo = numParaCodigo(valorNorm);
  const contribuicao = VALOR_COTA * peso;

  return { tipo, posts, peso, valor: valorNorm, codigo, contribuicao };
}

// ── Gera a cota completa ──────────────────────────────────────────────────────
export function gerarCota(
  postsBlog:   PostData[],
  postsJornal: PostData[],
  postsTv:     PostData[] = []
): CotaETF {
  const blocos: BlocoETF[] = [
    calcularBloco(postsBlog,   'blog'),
    calcularBloco(postsJornal, 'jornal'),
    calcularBloco(postsTv,     'tv'),
  ];

  // Código completo: GT-[BLOG]-[JORNAL]-[TV]-[CHECKSUM]
  const partes = blocos.map(b => b.codigo).join('-');
  const codigoBase = `GT-${partes}`;
  const checksum   = gerarChecksum(codigoBase);
  const codigoCompleto = `${codigoBase}-${checksum}`;

  // ID curto para referência
  const id = `GT${Date.now().toString(36).toUpperCase().slice(-6)}`;

  // Versão = hash baseada na data + total de posts
  const totalPosts = postsBlog.length + postsJornal.length + postsTv.length;
  const versao = numParaCodigo(totalPosts * new Date().getFullYear(), 4);

  return {
    id,
    codigoCompleto,
    blocos,
    valorTotal: VALOR_COTA,
    dataGeracao: new Date().toISOString(),
    versao,
    status: 'disponivel',
  };
}

// ── Registra venda (transforma cota) ─────────────────────────────────────────
export function venderCota(cota: CotaETF, dono: string, empresa?: string): CotaETF {
  return {
    ...cota,
    status:    'vendida',
    dono,
    empresa,
    dataVenda: new Date().toISOString(),
    // Re-deriva um código com o nome do dono embutido
    codigoCompleto: `${cota.codigoCompleto.slice(0, -2)}${gerarChecksum(dono.toUpperCase())}`,
  };
}

// ── Formata o código para exibição ───────────────────────────────────────────
export function formatarCodigo(codigo: string): string {
  return codigo; // já está formatado GT-XXXXXX-XXXXXX-XXXXXX-XX
}

// ── Gera HTML do certificado (para download) ─────────────────────────────────
export function gerarCertificadoHTML(cota: CotaETF): string {
  const data = new Date(cota.dataGeracao).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const dataVenda = cota.dataVenda
    ? new Date(cota.dataVenda).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
    : '';

  const blocoLabels: Record<string, string> = {
    blog:   '📝 Blog',
    jornal: '📰 Jornal',
    tv:     '📺 TV Empresarial',
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Certificado de Cota — ${cota.codigoCompleto}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0514;
    color: #f0ede8;
    font-family: 'Share Tech Mono', monospace;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .certificado {
    width: 100%;
    max-width: 800px;
    background: linear-gradient(160deg, #1a0f2e 0%, #0f0820 50%, #150b28 100%);
    border: 1px solid rgba(168,85,247,0.4);
    border-radius: 4px;
    padding: 60px 50px;
    position: relative;
    overflow: hidden;
  }

  /* Cantos decorativos */
  .canto {
    position: absolute;
    width: 40px; height: 40px;
    border-color: rgba(0,255,136,0.5);
    border-style: solid;
  }
  .canto.tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
  .canto.tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
  .canto.bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
  .canto.br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

  /* Pentáculo SVG de fundo */
  .bg-symbol {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.04;
    width: 500px; height: 500px;
    pointer-events: none;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
  }

  .emitter {
    font-size: 11px;
    letter-spacing: 4px;
    color: rgba(168,85,247,0.7);
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  h1 {
    font-family: 'Cinzel', serif;
    font-size: 28px;
    font-weight: 900;
    background: linear-gradient(135deg, #00ff88, #00d4ff, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
    margin-bottom: 6px;
  }

  .subtitulo {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 3px;
  }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,136,0.3), rgba(168,85,247,0.3), transparent);
    margin: 30px 0;
  }

  .codigo-cota {
    text-align: center;
    margin: 30px 0;
    padding: 24px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(0,255,136,0.2);
    border-radius: 4px;
  }

  .codigo-label {
    font-size: 10px;
    letter-spacing: 4px;
    color: rgba(0,255,136,0.5);
    margin-bottom: 10px;
  }

  .codigo-valor {
    font-size: 22px;
    font-weight: 700;
    color: #00ff88;
    letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(0,255,136,0.4);
  }

  .dono-section {
    text-align: center;
    margin: 24px 0;
    padding: 20px;
    background: rgba(168,85,247,0.06);
    border: 1px solid rgba(168,85,247,0.2);
    border-radius: 4px;
  }

  .dono-label {
    font-size: 10px;
    letter-spacing: 4px;
    color: rgba(168,85,247,0.5);
    margin-bottom: 8px;
  }

  .dono-nome {
    font-family: 'Cinzel', serif;
    font-size: 22px;
    color: #a855f7;
    text-shadow: 0 0 16px rgba(168,85,247,0.4);
  }

  .blocos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 24px 0;
  }

  .bloco {
    padding: 16px;
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 4px;
    text-align: center;
  }

  .bloco-tipo { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
  .bloco-codigo { font-size: 14px; color: #00d4ff; margin-bottom: 4px; }
  .bloco-peso { font-size: 11px; color: rgba(0,212,255,0.4); }
  .bloco-posts { font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 4px; }

  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 24px 0;
  }

  .meta-item { }
  .meta-label { font-size: 10px; letter-spacing: 2px; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
  .meta-valor { font-size: 14px; color: rgba(255,255,255,0.75); }

  .valor-destaque {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, rgba(0,255,136,0.06), rgba(168,85,247,0.06));
    border: 1px solid rgba(0,255,136,0.15);
    border-radius: 4px;
    margin: 24px 0;
  }

  .valor-label { font-size: 10px; letter-spacing: 3px; color: rgba(0,255,136,0.5); margin-bottom: 8px; }
  .valor-numero {
    font-family: 'Cinzel', serif;
    font-size: 36px;
    color: #00ff88;
    text-shadow: 0 0 24px rgba(0,255,136,0.4);
  }

  .rodape {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 10px;
    color: rgba(255,255,255,0.2);
  }

  .assinatura {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: rgba(0,255,136,0.4);
  }

  @media print {
    body { background: white; }
    .certificado { border: 2px solid #333; }
  }
</style>
</head>
<body>
<div class="certificado">
  <div class="canto tl"></div>
  <div class="canto tr"></div>
  <div class="canto bl"></div>
  <div class="canto br"></div>

  <!-- Pentáculo SVG de fundo -->
  <svg class="bg-symbol" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" stroke="white" stroke-width="0.5"/>
    <circle cx="100" cy="100" r="70" stroke="white" stroke-width="0.5"/>
    <polygon points="100,10 190,145 14,55 186,55 10,145" stroke="white" stroke-width="0.5" fill="none"/>
    <circle cx="100" cy="100" r="40" stroke="white" stroke-width="0.5"/>
  </svg>

  <div class="header">
    <div class="emitter">Growth Tracker · Sistema de Ativos Digitais</div>
    <h1>CERTIFICADO DE COTA</h1>
    <div class="subtitulo">GROWTH TRACKER ETF · SÉRIE ${new Date(cota.dataGeracao).getFullYear()}</div>
  </div>

  <div class="divider"></div>

  <div class="codigo-cota">
    <div class="codigo-label">CÓDIGO DA COTA</div>
    <div class="codigo-valor">${cota.codigoCompleto}</div>
  </div>

  ${cota.dono ? `
  <div class="dono-section">
    <div class="dono-label">TITULAR DA COTA</div>
    <div class="dono-nome">${cota.dono.toUpperCase()}</div>
    ${cota.empresa ? `<div style="font-size:12px;color:rgba(168,85,247,0.5);margin-top:4px">${cota.empresa}</div>` : ''}
  </div>` : ''}

  <div class="blocos">
    ${cota.blocos.map(b => `
    <div class="bloco">
      <div class="bloco-tipo">${blocoLabels[b.tipo] || b.tipo}</div>
      <div class="bloco-codigo">${b.codigo}</div>
      <div class="bloco-peso">${Math.round(b.peso * 100)}% · R$ ${b.contribuicao.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
      <div class="bloco-posts">${b.posts.length} post${b.posts.length !== 1 ? 's' : ''}</div>
    </div>`).join('')}
  </div>

  <div class="valor-destaque">
    <div class="valor-label">VALOR DA COTA</div>
    <div class="valor-numero">R$ ${cota.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
  </div>

  <div class="meta">
    <div class="meta-item">
      <div class="meta-label">DATA DE EMISSÃO</div>
      <div class="meta-valor">${data}</div>
    </div>
    ${cota.dataVenda ? `
    <div class="meta-item">
      <div class="meta-label">DATA DE TRANSFERÊNCIA</div>
      <div class="meta-valor">${dataVenda}</div>
    </div>` : ''}
    <div class="meta-item">
      <div class="meta-label">STATUS</div>
      <div class="meta-valor" style="color:${cota.status === 'vendida' ? '#a855f7' : '#00ff88'}">${cota.status === 'vendida' ? 'TRANSFERIDA' : 'DISPONÍVEL'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">VERSÃO DO ATIVO</div>
      <div class="meta-valor">v${cota.versao}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">ID DE REFERÊNCIA</div>
      <div class="meta-valor">${cota.id}</div>
    </div>
  </div>

  <div class="rodape">
    <div>
      <div>Este certificado representa uma cota do Growth Tracker ETF,</div>
      <div>ativo composto por conteúdo digital original do titular do sistema.</div>
    </div>
    <div class="assinatura">Growth Tracker<br/>Sistema de Crescimento Digital</div>
  </div>
</div>
</body>
</html>`;
}
