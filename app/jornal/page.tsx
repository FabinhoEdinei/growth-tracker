// app/jornal/page.tsx

import { NewspaperHeader }   from '../components/Jornal/NewspaperHeader';
import { NewspaperGrid }     from '../components/Jornal/NewspaperGrid';
import { JornalPageWrapper } from '../components/Jornal/JornalPageWrapper';
import { JornalCard }        from '../types/jornal';
import Link   from 'next/link';
import fs     from 'fs';
import path   from 'path';
import matter from 'gray-matter';

const POR_PAGINA = 12;

function getAllCards(): JornalCard[] {
  const dir = path.join(process.cwd(), 'app/content/jornal');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      return {
        slug:      data.slug     || f.replace('.md', ''),
        title:     data.title    || '',
        type:      data.type     || 'fatos',
        date:      data.date     || new Date().toISOString(),
        excerpt:   data.excerpt  || '',
        character: data.character,
        location:  data.location,
        image:     data.image,
        content,
        cardStyle: data.cardStyle,
      } as JornalCard;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Mini header para páginas 2+ ───────────────────────────────────────────────
function MiniHeader({ pagina, totalPaginas, totalPosts }: {
  pagina: number; totalPaginas: number; totalPosts: number;
}) {
  const btn: React.CSSProperties = {
    fontFamily:    "'Courier New',monospace",
    fontSize:      10, fontWeight: 900,
    textDecoration:'none',
    padding:       '7px 13px',
    border:        '1.5px solid rgba(200,168,75,0.55)',
    borderRadius:  4,
    background:    'rgba(200,168,75,0.1)',
    letterSpacing: 1.5,
    color:         '#c8a84b',
    display:       'inline-flex',
    alignItems:    'center',
    gap:           5,
    whiteSpace:    'nowrap' as const,
  };

  return (
    <div style={{
      background:   'linear-gradient(180deg,#0d0a04,#1a1208)',
      borderBottom: '2px solid rgba(139,105,20,0.5)',
      padding:      '10px 14px',
    }}>
      {/* Título mini */}
      <div style={{ textAlign:'center', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center', marginBottom:3 }}>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(139,105,20,0.5))' }}/>
          <span style={{ color:'rgba(139,105,20,0.5)', fontSize:9 }}>◆</span>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(139,105,20,0.5),transparent)' }}/>
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:15, fontWeight:900, color:'#c8a84b', letterSpacing:3, textTransform:'uppercase' }}>
          Growth Tracker Gazette
        </div>
        <div style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'rgba(139,105,20,0.5)', letterSpacing:2, marginTop:2 }}>
          CONTINUAÇÃO — PÁGINA {pagina}
        </div>
      </div>

      {/* Barra de navegação */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
        <Link href={pagina===2?'/jornal':`/jornal?pagina=${pagina-1}`} style={btn}>◀ ANTERIOR</Link>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flex:1 }}>
          <span style={{ fontFamily:"'Courier New',monospace", fontSize:7, color:'rgba(200,168,75,0.5)', letterSpacing:1.5 }}>
            ◆ PÁG. {pagina}/{totalPaginas} · {totalPosts} EDIÇÕES ◆
          </span>
          <div style={{ display:'flex', gap:4 }}>
            {Array.from({ length: totalPaginas }, (_, i) => i+1).map(p => (
              <Link key={p} href={p===1?'/jornal':`/jornal?pagina=${p}`} style={{
                width: p===pagina?18:7, height:7, borderRadius:4,
                background: p===pagina?'#c8a84b':'rgba(200,168,75,0.25)',
                display:'block', transition:'all .3s',
                boxShadow: p===pagina?'0 0 6px rgba(200,168,75,0.5)':'none',
              }}/>
            ))}
          </div>
        </div>

        {pagina < totalPaginas
          ? <Link href={`/jornal?pagina=${pagina+1}`} style={btn}>PRÓXIMA ▶</Link>
          : <Link href="/" style={{ ...btn, color:'rgba(200,168,75,0.5)', border:'1.5px solid rgba(200,168,75,0.2)', background:'transparent' }}>⌂ HOME</Link>
        }
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default async function JornalPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const params       = await searchParams;
  const allCards     = getAllCards();
  const totalPosts   = allCards.length;
  const totalPaginas = Math.max(1, Math.ceil(totalPosts / POR_PAGINA));
  const paginaAtual  = Math.min(
    Math.max(1, parseInt(params?.pagina ?? '1', 10)),
    totalPaginas
  );

  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const cards  = allCards.slice(inicio, inicio + POR_PAGINA);

  return (
    <JornalPageWrapper>

      {/* Página 1 — header completo com nav integrada */}
      {paginaAtual === 1 && (
        <NewspaperHeader
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalPosts={totalPosts}
        />
      )}

      {/* Páginas 2+ — mini header com nav */}
      {paginaAtual > 1 && (
        <MiniHeader
          pagina={paginaAtual}
          totalPaginas={totalPaginas}
          totalPosts={totalPosts}
        />
      )}

      {/* Grid */}
      <div style={{ background:'#f5f0e8', minHeight:'60vh' }}>
        <NewspaperGrid cards={cards} />
      </div>

    </JornalPageWrapper>
  );
}
