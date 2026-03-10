import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJornalPost } from '@/app/lib/content-loader';
import { JornalPageWrapper } from '@/app/components/Jornal/JornalPageWrapper';

const typeConfig: Record<string, { label: string; icon: string; accent: string }> = {
  fabio:       { label: 'AVENTURAS DE FABIO', icon: '🤠', accent: '#8B4513' },
  claudia:     { label: 'DIÁRIO DE CLÁUDIA',  icon: '🌸', accent: '#9B7B2B' },
  publicidade: { label: 'ANÚNCIO ESPECIAL',   icon: '✨', accent: '#8B2020' },
  fatos:       { label: 'FATOS DO DIA',        icon: '📰', accent: '#3B5050' },
  lugares:     { label: 'TERRAS EXPLORADAS',   icon: '🗺️', accent: '#4B5E2A' },
};

const typeOrnament: Record<string, string> = {
  fabio: '★  ★  ★', claudia: '❀  ❀  ❀',
  publicidade: '⚜  ⚜  ⚜', fatos: '◆  ◆  ◆', lugares: '⚑  ⚑  ⚑',
};

// ── SVG inline: ornamento de canto (80x80) ────────────────────────────────
const CornerSVG = () => (
  <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gf-c" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"  stopColor="#FFF0A0"/>
        <stop offset="35%" stopColor="#DAA520"/>
        <stop offset="65%" stopColor="#FFE566"/>
        <stop offset="100%" stopColor="#B8860B"/>
      </linearGradient>
      <filter id="gg-c">
        <feGaussianBlur stdDeviation="0.8" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <g filter="url(#gg-c)">
      {/* Losango */}
      <path d="M 40 6 L 74 40 L 40 74 L 6 40 Z" fill="none" stroke="url(#gf-c)" strokeWidth="1.3"/>
      {/* Rosa central */}
      {[0,40,80,120,160,200,240,280,320].map((deg) => (
        <ellipse key={deg}
          cx={40+Math.cos(deg*Math.PI/180)*11} cy={40+Math.sin(deg*Math.PI/180)*11}
          rx="5.5" ry="3.2"
          transform={`rotate(${deg} ${40+Math.cos(deg*Math.PI/180)*11} ${40+Math.sin(deg*Math.PI/180)*11})`}
          fill="url(#gf-c)" opacity="0.92"/>
      ))}
      <circle cx="40" cy="40" r="7.5" fill="url(#gf-c)"/>
      <circle cx="40" cy="40" r="3.8" fill="#5a2800"/>
      {/* Folhas */}
      <path d="M 40 28 Q 28 18 16 8 Q 28 14 40 28" fill="#B8860B" opacity="0.78"/>
      <path d="M 52 40 Q 64 28 74 16 Q 66 28 52 40" fill="#B8860B" opacity="0.78"/>
      <path d="M 40 52 Q 28 64 16 74 Q 28 66 40 52" fill="#B8860B" opacity="0.78"/>
      <path d="M 28 40 Q 16 52 6 62 Q 16 56 28 40" fill="#B8860B" opacity="0.78"/>
      {/* Caules */}
      <path d="M 16 72 Q 28 54 40 40" stroke="#9B6914" strokeWidth="1.2" fill="none"/>
      <path d="M 72 16 Q 58 28 40 40" stroke="#9B6914" strokeWidth="1.2" fill="none"/>
      {/* Mini flores nos vértices */}
      {[[40,6],[74,40],[40,74],[6,40]].map(([cx,cy],i) => (
        <g key={i}>
          {[0,72,144,216,288].map((d) => (
            <ellipse key={d}
              cx={cx+Math.cos(d*Math.PI/180)*4.5} cy={cy+Math.sin(d*Math.PI/180)*4.5}
              rx="2.6" ry="1.7"
              transform={`rotate(${d} ${cx+Math.cos(d*Math.PI/180)*4.5} ${cy+Math.sin(d*Math.PI/180)*4.5})`}
              fill="url(#gf-c)" opacity="0.88"/>
          ))}
          <circle cx={cx} cy={cy} r="2.4" fill="#DAA520"/>
        </g>
      ))}
      {/* Arabescos */}
      <path d="M 10 10 Q 18 6 26 12 Q 20 18 10 10" fill="url(#gf-c)" opacity="0.55"/>
      <path d="M 70 10 Q 62 6 54 12 Q 60 18 70 10" fill="url(#gf-c)" opacity="0.55"/>
      <path d="M 10 70 Q 18 74 26 68 Q 20 62 10 70" fill="url(#gf-c)" opacity="0.55"/>
    </g>
  </svg>
);

// ── SVG inline: ornamento central horizontal (120x30) ─────────────────────
const CenterSVG = () => (
  <svg viewBox="0 0 120 30" width="120" height="30" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gf-m" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"  stopColor="#FFF0A0"/>
        <stop offset="40%" stopColor="#DAA520"/>
        <stop offset="70%" stopColor="#FFE566"/>
        <stop offset="100%" stopColor="#B8860B"/>
      </linearGradient>
      <filter id="gg-m">
        <feGaussianBlur stdDeviation="0.7" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <g filter="url(#gg-m)">
      {/* Flor central */}
      {[0,36,72,108,144,180,216,252,288,324].map((deg) => (
        <ellipse key={deg}
          cx={60+Math.cos(deg*Math.PI/180)*9} cy={15+Math.sin(deg*Math.PI/180)*8}
          rx="5" ry="3"
          transform={`rotate(${deg} ${60+Math.cos(deg*Math.PI/180)*9} ${15+Math.sin(deg*Math.PI/180)*8})`}
          fill="url(#gf-m)" opacity="0.92"/>
      ))}
      <circle cx="60" cy="15" r="6" fill="url(#gf-m)"/>
      <circle cx="60" cy="15" r="3" fill="#5a2800"/>
      {/* Arabescos laterais */}
      <path d="M 60 15 Q 42 8 28 12" stroke="url(#gf-m)" strokeWidth="1.3" fill="none"/>
      <path d="M 60 15 Q 78 8 92 12" stroke="url(#gf-m)" strokeWidth="1.3" fill="none"/>
      <path d="M 28 12 Q 22 15 28 18 Q 34 15 28 12" fill="url(#gf-m)" opacity="0.7"/>
      <path d="M 92 12 Q 98 15 92 18 Q 86 15 92 12" fill="url(#gf-m)" opacity="0.7"/>
      {/* Mini flores */}
      {[0,72,144,216,288].map((d) => (
        <ellipse key={d}
          cx={28+Math.cos(d*Math.PI/180)*4} cy={15+Math.sin(d*Math.PI/180)*4}
          rx="2.2" ry="1.5"
          transform={`rotate(${d} ${28+Math.cos(d*Math.PI/180)*4} ${15+Math.sin(d*Math.PI/180)*4})`}
          fill="url(#gf-m)" opacity="0.82"/>
      ))}
      {[0,72,144,216,288].map((d) => (
        <ellipse key={d}
          cx={92+Math.cos(d*Math.PI/180)*4} cy={15+Math.sin(d*Math.PI/180)*4}
          rx="2.2" ry="1.5"
          transform={`rotate(${d} ${92+Math.cos(d*Math.PI/180)*4} ${15+Math.sin(d*Math.PI/180)*4})`}
          fill="url(#gf-m)" opacity="0.82"/>
      ))}
      <circle cx="28" cy="15" r="2" fill="#DAA520"/>
      <circle cx="92" cy="15" r="2" fill="#DAA520"/>
    </g>
  </svg>
);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug === 'undefined') notFound();

  const post = await getJornalPost(slug);
  if (!post) notFound();

  const cfg = typeConfig[post.type] ?? typeConfig['fatos'];
  const ornament = typeOrnament[post.type] ?? '◆  ◆  ◆';
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <JornalPageWrapper>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 12px 80px' }}>

        {/* Voltar topo */}
        <Link href="/jornal" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Courier New', monospace", fontSize: 10,
          letterSpacing: 3, color: cfg.accent, textDecoration: 'none',
          textTransform: 'uppercase', marginBottom: 20, opacity: 0.65,
        }}>← VOLTAR AO JORNAL</Link>

        {/* ════ MOLDURA PRINCIPAL ════
            Abordagem: borda CSS de madeira + cantos SVG sobrepostos
            O conteúdo cresce livremente, bordas acompanham
        */}
        <div style={{ position: 'relative' }}>

          {/* Corpo com papel envelhecido + borda de madeira CSS */}
          <div style={{
            background: 'linear-gradient(160deg, #f9f4e8 0%, #f2ead6 30%, #ede5d0 65%, #f4eedd 100%)',
            border: '22px solid transparent',
            borderImage: `
              linear-gradient(
                135deg,
                #e8a060 0%, #c07838 15%, #9B5520 30%,
                #7a3e10 45%, #9B5520 55%, #c07838 70%,
                #e8a060 85%, #c07838 100%
              ) 1
            `,
            boxShadow: `
              inset 0 0 0 1px rgba(218,165,32,0.7),
              inset 0 0 0 2px rgba(90,40,0,0.25),
              inset 18px 0 24px rgba(0,0,0,0.06),
              inset -18px 0 24px rgba(0,0,0,0.06),
              inset 0 18px 24px rgba(0,0,0,0.04),
              inset 0 -18px 24px rgba(0,0,0,0.04),
              0 8px 40px rgba(0,0,0,0.3),
              0 2px 8px rgba(0,0,0,0.2)
            `,
            padding: '44px 48px',
            position: 'relative',
          }}>

            {/* Linha dourada interna dupla */}
            <div style={{
              position: 'absolute', inset: 8,
              border: '1.5px solid rgba(218,165,32,0.75)',
              pointerEvents: 'none', zIndex: 1,
            }}/>
            <div style={{
              position: 'absolute', inset: 12,
              border: '0.5px solid rgba(218,165,32,0.38)',
              pointerEvents: 'none', zIndex: 1,
            }}/>

            {/* Entalhe sombra interna */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `
                radial-gradient(ellipse at top left, rgba(100,60,10,0.12) 0%, transparent 50%),
                radial-gradient(ellipse at top right, rgba(100,60,10,0.10) 0%, transparent 50%),
                radial-gradient(ellipse at bottom left, rgba(80,40,5,0.09) 0%, transparent 50%),
                radial-gradient(ellipse at bottom right, rgba(80,40,5,0.09) 0%, transparent 50%)
              `,
              pointerEvents: 'none', zIndex: 0,
            }}/>

            {/* Linhas sutis de papel */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(160,120,40,0.045) 22px, rgba(160,120,40,0.045) 23px)',
            }}/>

            {/* Conteúdo */}
            <div style={{ position: 'relative', zIndex: 2 }}>

              {/* Ornamento tipo */}
              <div style={{ textAlign:'center', fontSize:11, color:'rgba(80,50,10,0.28)', letterSpacing:9, marginBottom:22 }}>
                {ornament}
              </div>

              {/* Label */}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span style={{ fontSize:18 }}>{cfg.icon}</span>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:'bold', letterSpacing:2, textTransform:'uppercase', color:cfg.accent }}>
                  {cfg.label}
                </span>
              </div>

              <div style={{ borderTop:`1px solid ${cfg.accent}`, opacity:0.2, marginBottom:18 }}/>

              {/* Título */}
              <h1 style={{ fontFamily:"'Georgia',serif", fontSize:'clamp(20px,3.5vw,28px)', fontWeight:'bold', lineHeight:1.25, color:'#1e1008', margin:'0 0 10px' }}>
                {post.title}
              </h1>

              {/* Data */}
              <div style={{ fontFamily:"'Georgia',serif", fontSize:11, fontStyle:'italic', color:'rgba(42,24,16,0.48)', marginBottom:10 }}>
                {formatDate(post.date)}
                {post.character && <span style={{ marginLeft:10 }}>— {post.character}</span>}
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p style={{ fontFamily:"'Georgia',serif", fontSize:13, fontStyle:'italic', color:'rgba(42,24,16,0.62)', borderLeft:`2px solid ${cfg.accent}`, paddingLeft:12, marginBottom:20, lineHeight:1.65, margin:'0 0 20px' }}>
                  {post.excerpt}
                </p>
              )}

              <div style={{ borderTop:`1px solid ${cfg.accent}`, opacity:0.16, marginBottom:22 }}/>

              {/* Corpo do post — cresce livremente */}
              <div className="jornal-content" dangerouslySetInnerHTML={{ __html: post.content }}/>

              {/* Ornamento rodapé */}
              <div style={{ textAlign:'center', marginTop:40, fontSize:11, color:'rgba(80,50,10,0.2)', letterSpacing:10 }}>
                ◆ &nbsp; ◆ &nbsp; ◆
              </div>

            </div>
          </div>

          {/* ── CANTOS SVG sobrepostos (fora do fluxo) ── */}
          {/* Superior esquerdo */}
          <div style={{ position:'absolute', top:-6, left:-6, zIndex:10, pointerEvents:'none' }}>
            <CornerSVG/>
          </div>
          {/* Superior direito */}
          <div style={{ position:'absolute', top:-6, right:-6, zIndex:10, pointerEvents:'none', transform:'scaleX(-1)' }}>
            <CornerSVG/>
          </div>
          {/* Inferior esquerdo */}
          <div style={{ position:'absolute', bottom:-6, left:-6, zIndex:10, pointerEvents:'none', transform:'scaleY(-1)' }}>
            <CornerSVG/>
          </div>
          {/* Inferior direito */}
          <div style={{ position:'absolute', bottom:-6, right:-6, zIndex:10, pointerEvents:'none', transform:'scale(-1,-1)' }}>
            <CornerSVG/>
          </div>

          {/* ── CENTRO topo e base ── */}
          <div style={{ position:'absolute', top:-9, left:'50%', transform:'translateX(-50%)', zIndex:10, pointerEvents:'none' }}>
            <CenterSVG/>
          </div>
          <div style={{ position:'absolute', bottom:-9, left:'50%', transform:'translateX(-50%) scaleY(-1)', zIndex:10, pointerEvents:'none' }}>
            <CenterSVG/>
          </div>

        </div>
        {/* fim moldura */}

        {/* Voltar rodapé */}
        <div style={{ textAlign:'center', marginTop:32 }}>
          <Link href="/jornal" style={{ fontFamily:"'Courier New',monospace", fontSize:10, letterSpacing:3, color:cfg.accent, textDecoration:'none', textTransform:'uppercase', opacity:0.58 }}>
            ← VOLTAR AO JORNAL
          </Link>
        </div>
      </div>

      <style>{`
        .jornal-content { font-family:'Georgia',serif; font-size:14px; line-height:1.88; color:#3a2415; }
        .jornal-content h2 { font-size:19px; color:#1e1008; margin:24px 0 10px; font-weight:bold; }
        .jornal-content h3 { font-size:16px; color:#2a1810; margin:18px 0 7px; }
        .jornal-content p  { margin-bottom:14px; }
        .jornal-content ul, .jornal-content ol { padding-left:22px; margin-bottom:14px; }
        .jornal-content li { margin-bottom:5px; }
        .jornal-content strong { color:#1e1008; font-weight:bold; }
        .jornal-content em { font-style:italic; }
        .jornal-content blockquote {
          border-left:2px solid #8B4513; padding-left:14px;
          margin:16px 0; font-style:italic; color:rgba(42,24,16,0.62);
        }
        .jornal-content hr { border:none; border-top:1px solid rgba(139,69,19,0.14); margin:20px 0; }
        .jornal-content a  { color:#8B4513; }
        .jornal-content table { width:100%; border-collapse:collapse; margin-bottom:16px; font-size:13px; }
        .jornal-content th, .jornal-content td { border:1px solid rgba(139,69,19,0.2); padding:6px 10px; }
        .jornal-content th { background:rgba(139,69,19,0.08); font-weight:bold; }
      `}</style>
    </JornalPageWrapper>
  );
}
