import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJornalPost } from '@/app/lib/content-loader';
import { JornalPageWrapper } from '@/app/components/Jornal/JornalPageWrapper';

const typeConfig: Record<string, { label: string; icon: string; accent: string; border: string }> = {
  fabio:       { label: 'AVENTURAS DE FABIO', icon: '🤠', accent: '#8B4513', border: '#6B3410' },
  claudia:     { label: 'DIÁRIO DE CLÁUDIA',  icon: '🌸', accent: '#DAA520', border: '#B8860B' },
  publicidade: { label: 'ANÚNCIO ESPECIAL',   icon: '✨', accent: '#c41e3a', border: '#8B0000' },
  fatos:       { label: 'FATOS DO DIA',        icon: '📰', accent: '#2F4F4F', border: '#1a2f2f' },
  lugares:     { label: 'TERRAS EXPLORADAS',   icon: '🗺️', accent: '#556B2F', border: '#3a4f1a' },
};

// ── SVG reutilizável de flor dourada ───────────────────────────────────────
function GoldFlower({ cx, cy, r = 12 }: { cx: number; cy: number; r?: number }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx={cx + Math.cos((deg * Math.PI) / 180) * (r + 2)}
          cy={cy + Math.sin((deg * Math.PI) / 180) * (r + 2)}
          rx={r * 0.55} ry={r * 0.38}
          transform={`rotate(${deg} ${cx + Math.cos((deg * Math.PI) / 180) * (r + 2)} ${cy + Math.sin((deg * Math.PI) / 180) * (r + 2)})`}
          fill="url(#gf)" opacity="0.88"
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.65} fill="url(#gf)" />
      <circle cx={cx} cy={cy} r={r * 0.32} fill="#8B4513" />
    </g>
  );
}

function GoldLeaf({ x1, y1, x2, y2, cx, cy }: { x1:number; y1:number; x2:number; y2:number; cx:number; cy:number }) {
  return <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2} Q ${cx} ${cy} ${x1} ${y1}`} fill="#B8860B" opacity="0.72" />;
}

function CornerOrnament({ x, y, flipX = false, flipY = false }: { x: number; y: number; flipX?: boolean; flipY?: boolean }) {
  const sx = flipX ? -1 : 1;
  const sy = flipY ? -1 : 1;
  return (
    <g transform={`translate(${x},${y}) scale(${sx},${sy})`}>
      {/* Rosa central */}
      <GoldFlower cx={38} cy={38} r={13} />
      {/* Folhas */}
      <GoldLeaf x1={38} y1={24} x2={20} y2={10} cx={26} cy={16} />
      <GoldLeaf x1={52} y1={38} x2={70} y2={20} cx={64} cy={26} />
      <GoldLeaf x1={38} y1={52} x2={20} y2={70} cx={26} cy={64} />
      {/* Caules */}
      <path d="M 20 68 Q 30 52 38 38" stroke="#8B6914" strokeWidth="1.6" fill="none" />
      <path d="M 68 20 Q 56 30 38 38" stroke="#8B6914" strokeWidth="1.6" fill="none" />
      {/* Flores pequenas */}
      <GoldFlower cx={16} cy={70} r={5} />
      <GoldFlower cx={70} cy={16} r={5} />
      {/* Arabescos */}
      <path d="M 54 14 Q 64 20 58 32 Q 52 26 54 14" fill="url(#gf)" opacity="0.6" />
      <path d="M 14 54 Q 20 64 32 58 Q 26 52 14 54" fill="url(#gf)" opacity="0.6" />
    </g>
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug === 'undefined') notFound();

  const post = await getJornalPost(slug);
  if (!post) notFound();

  const cfg = typeConfig[post.type] ?? typeConfig['fatos'];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  // Ornamento por tipo
  const typeOrnament: Record<string, string> = {
    fabio: '★  ★  ★', claudia: '❀  ❀  ❀',
    publicidade: '⚜  ⚜  ⚜', fatos: '◆  ◆  ◆', lugares: '⚑  ⚑  ⚑',
  };
  const ornament = typeOrnament[post.type] ?? '◆  ◆  ◆';

  return (
    <JornalPageWrapper>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 12px 80px' }}>

        {/* Voltar */}
        <Link href="/jornal" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Courier New', monospace", fontSize: 10,
          letterSpacing: 2, color: cfg.accent, textDecoration: 'none',
          textTransform: 'uppercase', marginBottom: 24, opacity: 0.75,
        }}>← VOLTAR AO JORNAL</Link>

        {/* ════ MOLDURA COMPLETA ════ */}
        <div style={{ position: 'relative', filter: 'drop-shadow(4px 8px 24px rgba(0,0,0,0.25))' }}>

          {/* ── BARRA SUPERIOR ── */}
          <svg viewBox="0 0 860 90" width="100%" style={{ display: 'block', marginBottom: -1 }}
            xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wood-h" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#d4924a" />
                <stop offset="35%"  stopColor="#a0601e" />
                <stop offset="65%"  stopColor="#8B4513" />
                <stop offset="100%" stopColor="#5a2a08" />
              </linearGradient>
              <linearGradient id="gf" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#FFE566" />
                <stop offset="40%"  stopColor="#DAA520" />
                <stop offset="70%"  stopColor="#FFF3A0" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
              <filter id="wt">
                <feTurbulence type="fractalNoise" baseFrequency="0.8 0.04" numOctaves="4" seed="5" result="n"/>
                <feColorMatrix type="saturate" values="0.25" in="n" result="c"/>
                <feBlend in="SourceGraphic" in2="c" mode="multiply"/>
              </filter>
              <filter id="gg">
                <feGaussianBlur stdDeviation="1.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Madeira */}
            <rect x="0" y="10" width="860" height="70" fill="url(#wood-h)" filter="url(#wt)" rx="3"/>
            {/* Veios */}
            {[20,30,40,50,60,70].map((y, i) => (
              <path key={i} d={`M 0 ${y} Q ${300+i*20} ${y-4} ${600+i*10} ${y} T 860 ${y}`}
                stroke="rgba(0,0,0,0.1)" strokeWidth="0.7" fill="none"/>
            ))}
            {/* Borda dourada externa */}
            <rect x="4" y="14" width="852" height="62" rx="2" fill="none"
              stroke="url(#gf)" strokeWidth="2.5"/>
            {/* Borda dourada interna */}
            <rect x="10" y="20" width="840" height="50" rx="1" fill="none"
              stroke="url(#gf)" strokeWidth="0.8" opacity="0.55"/>

            {/* Cantos florais */}
            <g filter="url(#gg)">
              <CornerOrnament x={4}   y={4} />
              <CornerOrnament x={776} y={4} flipX />
            </g>

            {/* Centro decorativo */}
            <g transform="translate(392,10)" filter="url(#gg)">
              <path d="M -36 18 Q -18 6 0 18 Q 18 6 36 18" stroke="url(#gf)" strokeWidth="1.8" fill="none"/>
              <GoldFlower cx={0} cy={9} r={7} />
              <circle cx={-28} cy={20} r={4} fill="url(#gf)" opacity="0.8"/>
              <circle cx={ 28} cy={20} r={4} fill="url(#gf)" opacity="0.8"/>
            </g>
          </svg>

          {/* ── MEIO: laterais + conteúdo ── */}
          <div style={{ display: 'flex', alignItems: 'stretch' }}>

            {/* Lateral esquerda */}
            <svg viewBox="0 0 55 600" style={{ width: 44, flexShrink: 0 }}
              preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wood-l" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#5a2a08"/>
                  <stop offset="40%"  stopColor="#8B4513"/>
                  <stop offset="75%"  stopColor="#b07030"/>
                  <stop offset="100%" stopColor="#d4924a"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="55" height="600" fill="url(#wood-l)" filter="url(#wt)"/>
              {Array.from({length:20},(_,i)=>(
                <path key={i} d={`M ${2+i%3*2} ${i*32} Q 27 ${i*32+8} 53 ${i*32}`}
                  stroke="rgba(0,0,0,0.08)" strokeWidth="0.7" fill="none"/>
              ))}
              <rect x="5" y="0" width="45" height="600" fill="none" stroke="url(#gf)" strokeWidth="1.8"/>
            </svg>

            {/* Conteúdo principal */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(180deg,#faf8f0 0%,#f5f0e8 50%,#faf8f0 100%)',
              backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(139,69,19,0.01) 2px,rgba(139,69,19,0.01) 4px)',
              padding: '36px 28px',
              borderTop: `2px solid ${cfg.border}55`,
              borderBottom: `2px solid ${cfg.border}55`,
            }}>

              <div style={{ textAlign:'center', fontSize:11, color:'rgba(0,0,0,0.2)', letterSpacing:8, marginBottom:20 }}>
                {ornament}
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <span style={{ fontSize:20 }}>{cfg.icon}</span>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:'bold', letterSpacing:2, textTransform:'uppercase', color:cfg.accent }}>
                  {cfg.label}
                </span>
              </div>

              <div style={{ borderTop:`1px solid ${cfg.border}`, opacity:0.28, marginBottom:18 }}/>

              <h1 style={{ fontFamily:"'Georgia',serif", fontSize:'clamp(22px,4vw,30px)', fontWeight:'bold', lineHeight:1.25, color:'#2a1810', marginBottom:10 }}>
                {post.title}
              </h1>

              <div style={{ fontFamily:"'Georgia',serif", fontSize:12, fontStyle:'italic', color:'rgba(0,0,0,0.42)', marginBottom:10 }}>
                {formatDate(post.date)}
                {post.character && <span style={{ marginLeft:12, opacity:0.7 }}>— {post.character}</span>}
              </div>

              {post.excerpt && (
                <p style={{ fontFamily:"'Georgia',serif", fontSize:14, fontStyle:'italic', color:'rgba(42,24,16,0.68)', borderLeft:`3px solid ${cfg.accent}`, paddingLeft:14, marginBottom:22, lineHeight:1.7 }}>
                  {post.excerpt}
                </p>
              )}

              <div style={{ borderTop:`1px solid ${cfg.border}`, opacity:0.22, marginBottom:22 }}/>

              <div className="jornal-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              <div style={{ textAlign:'center', marginTop:40, fontSize:11, color:'rgba(0,0,0,0.16)', letterSpacing:10 }}>
                ◆ &nbsp; ◆ &nbsp; ◆
              </div>
            </div>

            {/* Lateral direita */}
            <svg viewBox="0 0 55 600" style={{ width:44, flexShrink:0 }}
              preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wood-r" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#d4924a"/>
                  <stop offset="25%"  stopColor="#b07030"/>
                  <stop offset="60%"  stopColor="#8B4513"/>
                  <stop offset="100%" stopColor="#5a2a08"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="55" height="600" fill="url(#wood-r)" filter="url(#wt)"/>
              {Array.from({length:20},(_,i)=>(
                <path key={i} d={`M ${2+i%3*2} ${i*32} Q 27 ${i*32+8} 53 ${i*32}`}
                  stroke="rgba(0,0,0,0.08)" strokeWidth="0.7" fill="none"/>
              ))}
              <rect x="5" y="0" width="45" height="600" fill="none" stroke="url(#gf)" strokeWidth="1.8"/>
            </svg>
          </div>

          {/* ── BARRA INFERIOR ── */}
          <svg viewBox="0 0 860 90" width="100%" style={{ display:'block', marginTop:-1 }}
            xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wood-hb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#5a2a08"/>
                <stop offset="35%"  stopColor="#8B4513"/>
                <stop offset="65%"  stopColor="#a0601e"/>
                <stop offset="100%" stopColor="#d4924a"/>
              </linearGradient>
            </defs>
            <rect x="0" y="10" width="860" height="70" fill="url(#wood-hb)" filter="url(#wt)" rx="3"/>
            {[20,30,40,50,60,70].map((y,i) => (
              <path key={i} d={`M 0 ${y} Q ${300+i*20} ${y-4} ${600+i*10} ${y} T 860 ${y}`}
                stroke="rgba(0,0,0,0.1)" strokeWidth="0.7" fill="none"/>
            ))}
            <rect x="4" y="14" width="852" height="62" rx="2" fill="none" stroke="url(#gf)" strokeWidth="2.5"/>
            <rect x="10" y="20" width="840" height="50" rx="1" fill="none" stroke="url(#gf)" strokeWidth="0.8" opacity="0.55"/>

            <g filter="url(#gg)">
              <CornerOrnament x={4}   y={-4} flipY />
              <CornerOrnament x={776} y={-4} flipX flipY />
            </g>

            <g transform="translate(392,10)" filter="url(#gg)">
              <path d="M -36 50 Q -18 62 0 50 Q 18 62 36 50" stroke="url(#gf)" strokeWidth="1.8" fill="none"/>
              <GoldFlower cx={0} cy={60} r={7} />
              <circle cx={-28} cy={48} r={4} fill="url(#gf)" opacity="0.8"/>
              <circle cx={ 28} cy={48} r={4} fill="url(#gf)" opacity="0.8"/>
            </g>
          </svg>
        </div>

        <div style={{ textAlign:'center', marginTop:28 }}>
          <Link href="/jornal" style={{ fontFamily:"'Courier New',monospace", fontSize:10, letterSpacing:2, color:cfg.accent, textDecoration:'none', textTransform:'uppercase', opacity:0.65 }}>
            ← VOLTAR AO JORNAL
          </Link>
        </div>
      </div>

      <style>{`
        .jornal-content { font-family:'Georgia',serif; font-size:15px; line-height:1.85; color:#3a2820; }
        .jornal-content h2 { font-size:21px; color:#2a1810; margin:26px 0 10px; font-weight:bold; }
        .jornal-content h3 { font-size:17px; color:#2a1810; margin:18px 0 8px; }
        .jornal-content p  { margin-bottom:15px; }
        .jornal-content ul,.jornal-content ol { padding-left:22px; margin-bottom:15px; }
        .jornal-content li { margin-bottom:5px; }
        .jornal-content strong { color:#2a1810; font-weight:bold; }
        .jornal-content blockquote { border-left:3px solid #8B4513; padding-left:14px; margin:18px 0; font-style:italic; color:rgba(42,24,16,0.68); }
        .jornal-content hr { border:none; border-top:1px solid rgba(139,69,19,0.18); margin:22px 0; }
      `}</style>
    </JornalPageWrapper>
  );
}
