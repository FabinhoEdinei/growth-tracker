import { BlogPost } from '../../components/Blog/BlogPost';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Por enquanto, posts hardcoded
// Depois vamos ler de arquivos .md
function getPostBySlug(slug: string) {
  const posts: Record<string, any> = {
    'historia-growth-tracker': {
      metadata: {
        title: 'A História do Growth Tracker: Do Zero ao Sistema Neural',
        date: '2026-02-18',
        author: 'Claude AI',
        category: 'Desenvolvimento',
      },
      content: `
        <h1>A História do Growth Tracker</h1>
        <h2>Do Conceito à Realidade</h2>
        <p>Tudo começou com uma pergunta simples: <strong>"E se pudéssemos ver dados como partículas vivas?"</strong></p>
        <p>O que era apenas um canvas com alguns pontos coloridos se transformou em um ecossistema completo de dados, física e interatividade.</p>
        
        <hr>
        
        <h2>🎯 FASE 1: O Início - "Funcionando"</h2>
        <p>No primeiro dia, tínhamos apenas:</p>
        <ul>
          <li>Um canvas preto</li>
          <li>Partículas básicas se movendo aleatoriamente</li>
          <li>Um header simples com o texto "Funcionando"</li>
        </ul>
        
        <p><strong>Linha de código histórica:</strong></p>
        <pre><code>&lt;h1&gt;Funcionando&lt;/h1&gt;</code></pre>
        
        <p>Mas já era mágico. As partículas <strong>se moviam</strong>. Era vida digital.</p>
        
        <hr>
        
        <h2>🌈 FASE 2: As Formas Tomam Vida</h2>
        <p>Percebemos que círculos não eram suficientes. Precisávamos de <strong>personalidade</strong>.</p>
        
        <p>Implementamos 6 formas geométricas:</p>
        <ul>
          <li>⬤ Círculos</li>
          <li>■ Quadrados</li>
          <li>▲ Triângulos</li>
          <li>⬡ Hexágonos</li>
          <li>◆ Diamantes</li>
          <li>★ Estrelas</li>
        </ul>
        
        <p>Cada partícula ganhou uma <strong>identidade visual única</strong>.</p>
        
        <hr>
        
        <h2>🎨 FASE 3: Sistema de Zonas</h2>
        <p>A tela ficou dividida em 3 zonas verticais:</p>
        
        <table>
          <thead>
            <tr>
              <th>Zona</th>
              <th>Cor</th>
              <th>Propósito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ALPHA</strong></td>
              <td>Magenta/Vermelho</td>
              <td>Agenda</td>
            </tr>
            <tr>
              <td><strong>BETA</strong></td>
              <td>Verde/Cyan</td>
              <td>Geral</td>
            </tr>
            <tr>
              <td><strong>GAMMA</strong></td>
              <td>Laranja/Roxo</td>
              <td>Finanças</td>
            </tr>
          </tbody>
        </table>
        
        <p>As partículas <strong>mudavam de cor</strong> ao atravessar as zonas. Era como ver energia fluindo.</p>
        
        <hr>
        
        <h2>⚡ FASE 4: Física Realista</h2>
        
        <h3>Colisões Elásticas</h3>
        <p>Implementamos física de colisão baseada em:</p>
        <pre><code>F = ma (Segunda Lei de Newton)
Conservação de momento
Coeficiente de restituição: 0.8</code></pre>
        
        <p>As partículas <strong>ricocheteavam</strong> umas nas outras como bolas de bilhar cósmicas.</p>
        
        <h3>Desintegração</h3>
        <p>Quando uma partícula caía sobre outra verticalmente:</p>
        <ul>
          <li><strong>3 segundos</strong> de fragmentação</li>
          <li>20-35 <strong>partículas sombra</strong> explodindo</li>
          <li>Reintegração <strong>2x mais rápida</strong> em direção oposta</li>
        </ul>
        
        <p>Era como assistir à morte e renascimento digital em tempo real.</p>
        
        <hr>
        
        <h2>💭 Reflexões</h2>
        
        <h3>O que aprendemos:</h3>
        <ol>
          <li><strong>Física é poesia</strong> — Equações viram arte</li>
          <li><strong>Dados têm vida</strong> — Números podem dançar</li>
          <li><strong>Modularidade é poder</strong> — Pequenos módulos, grande sistema</li>
          <li><strong>Performance importa</strong> — 50K usuários simultâneos é possível</li>
          <li><strong>Estética é funcionalidade</strong> — Beleza atrai, utilidade mantém</li>
        </ol>
        
        <hr>
        
        <h2>🎯 A Visão Final</h2>
        <p>Growth Tracker não é apenas um app.</p>
        <p>É um <strong>organismo digital vivo</strong>.</p>
        
        <blockquote>
          <p>Cada partícula é uma célula.<br>
          Cada zona é um órgão.<br>
          O header é o cérebro.<br>
          Os raios são sinapses.</p>
        </blockquote>
        
        <p>E o sistema neural está apenas <strong>começando a acordar</strong>.</p>
        
        <hr>
        
        <p><em>Publicado em 18 de fevereiro de 2026</em><br>
        <em>Escrito por Claude AI</em><br>
        <em>Categoria: Desenvolvimento</em></p>
      `,
    },
  };

  return posts[slug] || null;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="post-page">
      <Link href="/blog" className="back-button">
        ← Voltar ao Blog
      </Link>

      <BlogPost content={post.content} metadata={post.metadata} />

      <style jsx>{`
        .post-page {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1));
          position: relative;
        }

        :global(.back-button) {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 100;
          padding: 10px 20px;
          background: rgba(0,255,255,0.1);
          border: 1px solid rgba(0,255,255,0.3);
          border-radius: 8px;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        :global(.back-button:hover) {
          background: rgba(0,255,255,0.2);
          box-shadow: 0 0 20px rgba(0,255,255,0.3);
          transform: translateX(-4px);
        }
      `}</style>
    </div>
  );
}