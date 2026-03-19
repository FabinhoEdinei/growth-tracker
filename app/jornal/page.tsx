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

// ── Barra de navegação — substitui o "GRATUITO" no header ────────────────────
function VintageNavBar({ paginaAtual, totalPaginas, totalPosts }: {
  paginaAtual: number; totalPaginas: number; totalPosts: number;
}) {
  const temAnterior = paginaAtual > 1;
  const temProxima  = paginaAtual < totalPaginas;

  const btn: React.CSSProperties = {
    fontFamily:    "'Courier New',monospace",
    fontSize:      10, fontWeight: 900,
    textDecoration:'none',
    padding:       '8px 16px',
    border:        '1.5px solid rgba(200,168,75,0.6)',
    borderRadius:  4,
    background:    'rgba(200,168,75,0.1)',
    letterSpacing: 1.5,
    color:         '#c8a84b',
    display:       'inline-flex',
    alignItems:    'center',
    gap:           5,
    whiteSpace:    'nowrap' as const,
  };

  const btnHome: React.CSSProperties = {
    ...btn,
    color:      'rgba(200,168,75,0.5)',
    border:     '1.5px solid rgba(200,168,75,0.25)',
    background: 'transparent',
  };

  return (
    <div style={{
      background:    'linear-gradient(180deg,#0d0a04 0%,#1a1208 100%)',
      borderBottom:  '2px solid rgba(139,105,20,0.5)',
      padding:       '10px 14px',
      display:       'flex',
      alignItems:    'center',
      justifyContent:'space-between',
      gap:           8,
      position:      'sticky',
      top:           0,
      zIndex:        30,
    }}>

      {/* Esquerda — Anterior ou Home */}
      {temAnterior
        ? <Link href={paginaAtual===2?'/jornal':`/jornal?pagina=${paginaAtual-1}`} style={btn}>◀ ANTERIOR</Link>
        : <Link href="/" style={btnHome}>⌂ HOME</Link>
      }

      {/* Centro — info + dots */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
        <span style={{ fontFamily:"'Courier New',monospace", fontSize:7, color:'rgba(200,168,75,0.55)', letterSpacing:2 }}>
          ◆ PÁG. {paginaAtual}/{totalPaginas} · {totalPosts} EDIÇÕES ◆
        </span>
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          {Array.from({ length: totalPaginas }, (_, i) => i+1).map(p => (
            <Link key={p} href={p===1?'/jornal':`/jornal?pagina=${p}`} style={{
              width:      p===paginaAtual ? 20 : 7,
              height:     7, borderRadius:4,
              background: p===paginaAtual ? '#c8a84b' : 'rgba(200,168,75,0.25)',
              display:    'block', transition:'all .3s',
              boxShadow:  p===paginaAtual ? '0 0 6px rgba(200,168,75,0.5)' : 'none',
            }}/>
          ))}
        </div>
      </div>

      {/* Direita — Próxima ou Home */}
      {temProxima
        ? <Link href={`/jornal?pagina=${paginaAtual+1}`} style={btn}>PRÓXIMA ▶</Link>
        : <Link href="/" style={btnHome}>⌂ HOME</Link>
      }
    </div>
  );
}

// ── Mini header para páginas 2+ ───────────────────────────────────────────────
function MiniHeader({ pagina }: { pagina: number }) {
  return (
    <div style={{
      background:   'linear-gradient(180deg,#0d0a04,#1a1208)',
      padding:      '10px 14px 8px',
      textAlign:    'center',
    }}>
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
      <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center', marginTop:3 }}>
        <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(139,105,20,0.4))' }}/>
        <span style={{ color:'rgba(139,105,20,0.3)', fontSize:8 }}>◇ ◆ ◇</span>
        <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(139,105,20,0.4),transparent)' }}/>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ✅ Next.js 15 — searchParams deve ser awaited
// ═════════════════════════════════════════════════════════════════════════════
export default async function JornalPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  // ✅ await obrigatório no Next.js 15
  const params = await searchParams;

  const allCards     = getAllCards();
  const totalPosts   = allCards.length;
  const totalPaginas = Math.max(1, Math.ceil(totalPosts / POR_PAGINA));
  const paginaAtual  = Math.min(
    Math.max(1, parseInt(params?.pagina ?? '1', 10)),
    totalPaginas
  );

  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const cards  = allCards.slice(inicio, inicio + POR_PAGINA);

  const isPrimeira = paginaAtual === 1;

  return (
    <JornalPageWrapper>

      {/* Página 1 — header vintage completo */}
      {isPrimeira && <NewspaperHeader />}

      {/* Página 2+ — mini header compacto */}
      {!isPrimeira && <MiniHeader pagina={paginaAtual} />}

      {/*
        ✅ Barra de navegação:
        - Página 1: no lugar do "GRATUITO", abaixo do header
        - Páginas 2+: logo abaixo do mini header
        - Só aparece quando há mais de 1 página
        - SEM duplicar no rodapé
      */}
      {totalPaginas > 1 && (
        <VintageNavBar
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalPosts={totalPosts}
        />
      )}

      {/* Grid de cards — sem limit, página controla o slice */}
      <div style={{ background:'#f5f0e8', minHeight:'60vh' }}>
        <NewspaperGrid cards={cards} />
      </div>

      {/* ✅ Sem nav no rodapé — só topo */}

    </JornalPageWrapper>
  );
}
