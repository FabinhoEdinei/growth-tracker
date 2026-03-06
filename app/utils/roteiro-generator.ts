import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface SegmentoTV {
  id: string;
  tipo: 'abertura' | 'historia' | 'publicidade' | 'encerramento';
  titulo: string;
  duracao: number; // em minutos
  conteudo: string;
  personagem?: 'fabio' | 'claudia';
  horario: string;
}

export interface RoteiroTV {
  data: string;
  edicao: number;
  duracao_total: number;
  segmentos: SegmentoTV[];
}

export class RoteiroGenerator {
  private jornalPath: string;

  constructor() {
    this.jornalPath = path.join(process.cwd(), 'app/content/jornal');
  }

  // Gerar roteiro do dia
  gerarRoteiroDoDia(): RoteiroTV {
    const posts = this.carregarPostsDoDia();
    const segmentos: SegmentoTV[] = [];

    // 1. ABERTURA (2 min)
    segmentos.push({
      id: 'abertura',
      tipo: 'abertura',
      titulo: 'Vinheta de Abertura - Growth Tracker TV',
      duracao: 2,
      conteudo: this.gerarAbertura(),
      horario: '08:00',
    });

    // 2. HISTÓRIAS DO DIA (posts do jornal)
    let horarioAtual = new Date();
    horarioAtual.setHours(8, 2, 0); // Começa 8:02

    posts.forEach((post, index) => {
      const duracao = this.calcularDuracao(post.content);
      
      segmentos.push({
        id: `historia-${index}`,
        tipo: 'historia',
        titulo: post.title,
        duracao,
        conteudo: post.content,
        personagem: post.character,
        horario: this.formatarHorario(horarioAtual),
      });

      // Adicionar break comercial a cada 2 histórias
      if ((index + 1) % 2 === 0 && index < posts.length - 1) {
        horarioAtual = this.adicionarMinutos(horarioAtual, duracao);
        
        segmentos.push({
          id: `comercial-${index}`,
          tipo: 'publicidade',
          titulo: 'Intervalo Comercial',
          duracao: 1,
          conteudo: this.gerarComercial(),
          horario: this.formatarHorario(horarioAtual),
        });

        horarioAtual = this.adicionarMinutos(horarioAtual, 1);
      } else {
        horarioAtual = this.adicionarMinutos(horarioAtual, duracao);
      }
    });

    // 3. ENCERRAMENTO (1 min)
    segmentos.push({
      id: 'encerramento',
      tipo: 'encerramento',
      titulo: 'Encerramento e Prévia de Amanhã',
      duracao: 1,
      conteudo: this.gerarEncerramento(),
      horario: this.formatarHorario(horarioAtual),
    });

    const duracaoTotal = segmentos.reduce((acc, seg) => acc + seg.duracao, 0);

    return {
      data: new Date().toISOString(),
      edicao: Math.floor(Date.now() / 86400000),
      duracao_total: duracaoTotal,
      segmentos,
    };
  }

  // Carregar posts do dia
  private carregarPostsDoDia() {
    if (!fs.existsSync(this.jornalPath)) {
      return [];
    }

    const filenames = fs.readdirSync(this.jornalPath);
    const hoje = new Date().toISOString().split('T')[0];

    return filenames
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => {
        const filePath = path.join(this.jornalPath, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug: data.slug || filename.replace('.md', ''),
          title: data.title || '',
          type: data.type || 'fatos',
          date: data.date || new Date().toISOString(),
          character: data.character,
          content,
        };
      })
      .filter((post) => post.date.startsWith(hoje))
      .slice(0, 5); // Máximo 5 histórias por dia
  }

  // Calcular duração baseada no conteúdo
  private calcularDuracao(content: string): number {
    const palavras = content.split(/\s+/).length;
    const minutosLeitura = Math.ceil(palavras / 150); // 150 palavras/min
    return Math.max(3, Math.min(minutosLeitura, 8)); // Entre 3-8 min
  }

  // Gerar abertura
  private gerarAbertura(): string {
    return `
# 🎬 GROWTH TRACKER TV - EDIÇÃO DE HOJE

**VINHETA DE ABERTURA**

[Música tema começa - estilo western digital]

**NARRADOR:**
"Bom dia, exploradores do oeste digital! Bem-vindos a mais uma edição do Growth Tracker TV, suas crônicas diárias de crescimento e desenvolvimento pessoal."

**FABIO (apresentador):**
"Olá pessoal! Eu sou Fabio, e hoje temos histórias incríveis de bugs derrotados, códigos domados, e muito mais!"

**CLÁUDIA (co-apresentadora):**
"E eu sou Cláudia! Prepare-se para uma jornada pelos pixels, designs e descobertas do dia!"

[Vinheta visual: Logo animado do Growth Tracker]
    `.trim();
  }

  // Gerar comercial
  private gerarComercial(): string {
    const comerciais = [
      '☕ **CAFÉ CODE FUEL** - O combustível oficial dos desenvolvedores!',
      '💻 **CURSO TURBO CODE** - Aprenda em 7 dias o que levaria 7 meses!',
      '🎧 **FONES ANTI-BUG** - Bloqueie distrações, capture soluções!',
    ];

    return comerciais[Math.floor(Math.random() * comerciais.length)];
  }

  // Gerar encerramento
  private gerarEncerramento(): string {
    return `
# 👋 ATÉ AMANHÃ!

**FABIO:**
"E assim terminamos mais uma edição do Growth Tracker TV!"

**CLÁUDIA:**
"Amanhã voltamos com mais aventuras digitais!"

**AMBOS:**
"Continuem crescendo! 🚀"

[Música de encerramento]
[Créditos rolando]
    `.trim();
  }

  // Utilitários
  private formatarHorario(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private adicionarMinutos(date: Date, minutos: number): Date {
    return new Date(date.getTime() + minutos * 60000);
  }
}