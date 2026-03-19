// app/jornal/page.tsx
// Paginação via searchParams — ?pagina=2, ?pagina=3...
// Página 1: header completo + grid
// Páginas seguintes: mini header + grid  navegação vintage

import { NewspaperHeader }   from '../components/Jornal/NewspaperHeader';
import { NewspaperGrid }     from '../components/Jornal/NewspaperGrid';
import { JornalPageWrapper } from '../components/Jornal/JornalPageWrapper';
import { JornalCard }        from '../types/jornal';
import Link   from 'next/link';
import fs     from 'fs';
import path   from 'path';
import matter from 'gray-matter';

const POR_PAGINA = 12;

// ── Leitura dos posts ─────────────────────────────────────────────────────────
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

// ── Barra de navegação vintage ────────────────────────────────────────────────
function VintageNavBar({ paginaAtual, totalPaginas, totalPosts }: {
  paginaAtual: number; totalPaginas: number; totalPosts: number;
}) {
  const temAnterior = paginaAtual > 1;
  const temProxima  = paginaAtual < totalPaginas;

  const btnBase: React.CSSProperties = {
    fontFamily:    "'Courier New',monospace",
    fontSize:      10, fontWeight: 700,
    textDecoration:'none',
    padding:       '7px 12px',
    border:        '1px solid rgba(200,168,75,0.5)',
    borderRadius:  4,
    background:    'rgba(200,168,75,0.08)',
    letterSpacing: 1.5,
    display:       'flex', alignItems:'center', gap:5,
    color:         '#c8a84b',
    transition:    'all .2s',
  };

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    color:      'rgba(200,168,75,0.35)',
    border:     '1px solid rgba(200,168,75,0.15)',
    background: 'transparent',
    pointerEvents: 'none',
  };

  return (
    <div style={{
      background:    '#1a1208',
      borderTop:     '2px solid rgba(139,105,20,0.5)',
      borderBottom:  '1px solid rgba(139,105,20,0.25)',
      padding:       '12px 14px',
      display:       'flex', alignItems:'center', justifyContent:'space-between',
      gap:           8, flexWrap:'wrap',
      position:      'sticky', top:0, zIndex:20,
    }}>

      {/* ◀ Anterior */}
      {temAnterior
        ? <Link href={paginaAtual===2?'/jornal':`/jornal?pagina=${paginaAtual-1}`} style={btnBase}>◀ ANTERIOR</Link>
        : <Link href="/" style={btnBase}>⌂ HOME</Link>
      }

      {/* Centro */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
        <span style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'rgba(200,168,75,0.6)', letterSpacing:2 }}>
          ◆ PÁG. {paginaAtual} / {totalPaginas} · {totalPosts} EDIÇÕES ◆
        </span>
        {/* Dots de página */}
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          {Array.from({ length: totalPaginas }, (_, i) => i+1).map(p => (
            <Link key={p} href={p===1?'/jornal':`/jornal?pagina=${p}`} style={{
              width:      p===paginaAtual ? 18 : 7,
              height:     7, borderRadius:4,
              background: p===paginaAtual ? '#c8a84b' : 'rgba(200,168,75,0.25)',
              display:    'block', transition:'all .3s',
              boxShadow:  p===paginaAtual ? '0 0 6px rgba(200,168,75,0.5)' : 'none',
            }}/>
          ))}
        </div>
      </div>

      {/* Próxima ▶ */}
      {temProxima
        ? <Link href={`/jornal?pagina=${paginaAtual+1}`} style={btnBase}>PRÓXIMA ▶</Link>
        : <Link href="/" style={btnBase}>⌂ HOME</Link>
      }
    </div>
  );
}

// ── Mini header para páginas 2+ ───────────────────────────────────────────────
function MiniHeader({ pagina }: { pagina: number }) {
  return (
    <div style={{
      background:   'linear-gradient(180deg,#0d0a04,#1a1208)',
      borderBottom: '2px solid rgba(139,105,20,0.5)',
      padding:      '10px 14px',
      textAlign:    'center',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center', marginBottom:4 }}>
        <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(139,105,20,0.5))' }}/>
        <span style={{ color:'rgba(139,105,20,0.5)', fontSize:9 }}>◆</span>
        <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(139,105,20,0.5),transparent)' }}/>
      </div>
      <div style={{ fontFamily:"'Georgia',serif", fontSize:15, fontWeight:900, color:'#c8a84b', letterSpacing:3, textTransform:'uppercase' }}>
        Growth Tracker Gazette
      </div>
      <div style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'rgba(139,105,20,0.5)', letterSpacing:2, marginTop:3 }}>
        CONTINUAÇÃO — PÁGINA {pagina}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center', marginTop:4 }}>
        <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(139,105,20,0.4))' }}/>
        <span style={{ color:'rgba(139,105,20,0.3)', fontSize:8 }}>◇ ◆ ◇</span>
        <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(139,105,20,0.4),transparent)' }}/>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function JornalPage({
  searchParams,
}: {
  searchParams?: { pagina?: string };
}) {
  const allCards     = getAllCards();
  const totalPosts   = allCards.length;
  const totalPaginas = Math.max(1, Math.ceil(totalPosts / POR_PAGINA));
  const paginaAtual  = Math.min(
    Math.max(1, parseInt(searchParams?.pagina ?? '1', 10)),
    totalPaginas
  );

  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const cards  = allCards.slice(inicio, inicio + POR_PAGINA);

  return (
    <JornalPageWrapper>
      {/* Header — completo na p.1, mini nas demais */}
      {paginaAtual === 1
        ? <NewspaperHeader />
        : <MiniHeader pagina={paginaAtual} />
      }

      {/* Nav topo */}
      {totalPaginas > 1 && (
        <VintageNavBar
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalPosts={totalPosts}
        />
      )}

      {/* Grid */}
      <div style={{ background:'#f5f0e8', minHeight:'60vh' }}>
        <NewspaperGrid cards={cards} />
      </div>

      {/* Nav rodapé */}
      {totalPaginas > 1 && (
        <VintageNavBar
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalPosts={totalPosts}
        />
      )}
    </JornalPageWrapper>
  );
}
