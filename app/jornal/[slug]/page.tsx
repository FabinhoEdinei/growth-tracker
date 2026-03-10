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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug === 'undefined') notFound();

  const post = await getJornalPost(slug);
  if (!post) notFound();

  const cfg = typeConfig[post.type] ?? typeConfig['fatos'];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  const typeOrnament: Record<string, string> = {
    fabio: '★  ★  ★', claudia: '❀  ❀  ❀',
    publicidade: '⚜  ⚜  ⚜', fatos: '◆  ◆  ◆', lugares: '⚑  ⚑  ⚑',
  };
  const ornament = typeOrnament[post.type] ?? '◆  ◆  ◆';

  return (
    <JornalPageWrapper>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 12px 80px' }}>

        {/* Voltar */}
        <Link href="/jornal" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Courier New', monospace", fontSize: 10,
          letterSpacing: 3, color: cfg.accent, textDecoration: 'none',
          textTransform: 'uppercase', marginBottom: 24, opacity: 0.65,
        }}>← VOLTAR AO JORNAL</Link>

        {/* ════ MOLDURA SVG COMPLETA ════ */}
        <svg
          viewBox="0 0 820 1100"
          width="100%"
          style={{ display: 'block', filter: 'drop-shadow(2px 6px 20px rgba(0,0,0,0.35))' }}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            {/* ── Gradientes madeira ── */}
            <linearGradient id="wg-h" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#e8a060"/>
              <stop offset="20%"  stopColor="#c07838"/>
              <stop offset="50%"  stopColor="#9B5520"/>
              <stop offset="80%"  stopColor="#7a3e10"/>
              <stop offset="100%" stopColor="#5c2e08"/>
            </linearGradient>
            <linearGradient id="wg-v" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#5c2e08"/>
              <stop offset="20%"  stopColor="#7a3e10"/>
              <stop offset="50%"  stopColor="#9B5520"/>
              <stop offset="80%"  stopColor="#c07838"/>
              <stop offset="100%" stopColor="#e8a060"/>
            </linearGradient>

            {/* ── Gradiente ouro ── */}
            <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#FFF0A0"/>
              <stop offset="25%"  stopColor="#DAA520"/>
              <stop offset="55%"  stopColor="#FFE566"/>
              <stop offset="80%"  stopColor="#B8860B"/>
              <stop offset="100%" stopColor="#FFD700"/>
            </linearGradient>
            <linearGradient id="gold2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FFD700"/>
              <stop offset="50%"  stopColor="#B8860B"/>
              <stop offset="100%" stopColor="#DAA520"/>
            </linearGradient>

            {/* ── Papel envelhecido ── */}
            <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#f9f4e8"/>
              <stop offset="30%"  stopColor="#f2ead6"/>
              <stop offset="65%"  stopColor="#ede5d0"/>
              <stop offset="100%" stopColor="#f5f0e0"/>
            </linearGradient>
            <filter id="paper-noise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="8" result="noise"/>
              <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
              <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend"/>
              <feComponentTransfer in="blend">
                <feFuncR type="linear" slope="0.97" intercept="0.03"/>
                <feFuncG type="linear" slope="0.95" intercept="0.02"/>
                <feFuncB type="linear" slope="0.90" intercept="0.01"/>
              </feComponentTransfer>
            </filter>

            {/* ── Textura veio madeira ── */}
            <filter id="wood-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.8" numOctaves="5" seed="3" result="n"/>
              <feColorMatrix type="saturate" values="0.4" in="n" result="c"/>
              <feBlend in="SourceGraphic" in2="c" mode="overlay" result="b"/>
              <feComponentTransfer in="b">
                <feFuncR type="linear" slope="0.85" intercept="0.08"/>
                <feFuncG type="linear" slope="0.72" intercept="0.05"/>
                <feFuncB type="linear" slope="0.52" intercept="0.02"/>
              </feComponentTransfer>
            </filter>

            {/* ── Brilho dourado ── */}
            <filter id="gold-glow">
              <feGaussianBlur stdDeviation="1.2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="engrave">
              <feGaussianBlur stdDeviation="0.4" result="b"/>
              <feOffset dx="0.5" dy="0.8" in="b" result="offset"/>
              <feBlend in="SourceGraphic" in2="offset" mode="multiply"/>
            </filter>
          </defs>

          {/* ══════════════════════════════════════════════
              PAPEL — fundo envelhecido
          ══════════════════════════════════════════════ */}
          <rect x="28" y="28" width="764" height="1044" fill="url(#paper)" filter="url(#paper-noise)" rx="1"/>
          {/* Manchas de idade nos cantos */}
          <radialGradient id="age-tl" cx="0%" cy="0%" r="40%">
            <stop offset="0%" stopColor="rgba(139,100,20,0.14)"/>
            <stop offset="100%" stopColor="rgba(139,100,20,0)"/>
          </radialGradient>
          <radialGradient id="age-br" cx="100%" cy="100%" r="40%">
            <stop offset="0%" stopColor="rgba(100,70,10,0.10)"/>
            <stop offset="100%" stopColor="rgba(100,70,10,0)"/>
          </radialGradient>
          <rect x="28" y="28" width="764" height="1044" fill="url(#age-tl)"/>
          <rect x="28" y="28" width="764" height="1044" fill="url(#age-br)"/>
          {/* Linhas horizontais sutis de papel */}
          {Array.from({length:52},(_,i)=>(
            <line key={i} x1="28" y1={80+i*19} x2="792" y2={80+i*19}
              stroke="rgba(180,150,80,0.055)" strokeWidth="0.5"/>
          ))}

          {/* ══════════════════════════════════════════════
              MOLDURA — 4 BARRAS FINAS DE MADEIRA
          ══════════════════════════════════════════════ */}

          {/* Topo */}
          <rect x="0" y="0" width="820" height="30" fill="url(#wg-h)" filter="url(#wood-grain)" rx="2"/>
          {/* Base */}
          <rect x="0" y="1070" width="820" height="30" fill="url(#wg-h)" filter="url(#wood-grain)" rx="2"/>
          {/* Esquerda */}
          <rect x="0" y="0" width="30" height="1100" fill="url(#wg-v)" filter="url(#wood-grain)"/>
          {/* Direita */}
          <rect x="790" y="0" width="30" height="1100" fill="url(#wg-v)" filter="url(#wood-grain)"/>

          {/* ── Linha dourada interna (entalhe duplo) ── */}
          {/* Topo */}
          <rect x="4" y="4" width="812" height="22" rx="1" fill="none" stroke="url(#gold)" strokeWidth="1.8"/>
          <rect x="8" y="8" width="804" height="14" rx="0.5" fill="none" stroke="url(#gold2)" strokeWidth="0.7" opacity="0.7"/>
          {/* Base */}
          <rect x="4" y="1074" width="812" height="22" rx="1" fill="none" stroke="url(#gold)" strokeWidth="1.8"/>
          <rect x="8" y="1078" width="804" height="14" rx="0.5" fill="none" stroke="url(#gold2)" strokeWidth="0.7" opacity="0.7"/>
          {/* Esquerda */}
          <rect x="4" y="4" width="22" height="1092" rx="1" fill="none" stroke="url(#gold)" strokeWidth="1.8"/>
          <rect x="8" y="8" width="14" height="1084" rx="0.5" fill="none" stroke="url(#gold2)" strokeWidth="0.7" opacity="0.7"/>
          {/* Direita */}
          <rect x="794" y="4" width="22" height="1092" rx="1" fill="none" stroke="url(#gold)" strokeWidth="1.8"/>
          <rect x="798" y="8" width="14" height="1084" rx="0.5" fill="none" stroke="url(#gold2)" strokeWidth="0.7" opacity="0.7"/>

          {/* ══════════════════════════════════════════════
              ENTALHES NA MADEIRA — linhas decorativas
          ══════════════════════════════════════════════ */}
          {/* Topo — entalhes horizontais */}
          <line x1="80" y1="10" x2="740" y2="10" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6"/>
          <line x1="80" y1="20" x2="740" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4"/>
          {/* Base */}
          <line x1="80" y1="1080" x2="740" y2="1080" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6"/>
          <line x1="80" y1="1090" x2="740" y2="1090" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4"/>
          {/* Laterais — entalhes verticais */}
          <line x1="10" y1="90" x2="10" y2="1010" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
          <line x1="20" y1="90" x2="20" y2="1010" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4"/>
          <line x1="800" y1="90" x2="800" y2="1010" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
          <line x1="810" y1="90" x2="810" y2="1010" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4"/>

          {/* ══════════════════════════════════════════════
              ORNAMENTOS DOURADOS — CANTOS + CENTRO
              (entalhados com filter engrave)
          ══════════════════════════════════════════════ */}
          <g filter="url(#gold-glow)">

            {/* ── CANTO SUPERIOR ESQUERDO ── */}
            <g transform="translate(2, 2)">
              {/* Quadrado de canto */}
              <rect x="2" y="2" width="76" height="76" rx="2" fill="none" stroke="url(#gold)" strokeWidth="1.2"/>
              {/* Losango central */}
              <path d="M 39 8 L 70 39 L 39 70 L 8 39 Z" fill="none" stroke="url(#gold)" strokeWidth="1.4"/>
              {/* Rosa central */}
              {[0,40,80,120,160,200,240,280,320].map((deg) => (
                <ellipse key={deg}
                  cx={39 + Math.cos(deg*Math.PI/180)*10}
                  cy={39 + Math.sin(deg*Math.PI/180)*10}
                  rx="5.5" ry="3.2"
                  transform={`rotate(${deg} ${39+Math.cos(deg*Math.PI/180)*10} ${39+Math.sin(deg*Math.PI/180)*10})`}
                  fill="url(#gold)" opacity="0.9"/>
              ))}
              <circle cx="39" cy="39" r="7" fill="url(#gold)"/>
              <circle cx="39" cy="39" r="3.5" fill="#6B3010"/>
              {/* Folhas nos diagonais */}
              <path d="M 39 28 Q 28 18 18 10 Q 30 16 39 28" fill="#B8860B" opacity="0.8"/>
              <path d="M 50 39 Q 62 28 70 18 Q 64 30 50 39" fill="#B8860B" opacity="0.8"/>
              <path d="M 39 50 Q 28 62 18 70 Q 30 64 39 50" fill="#B8860B" opacity="0.8"/>
              <path d="M 28 39 Q 16 50 8 60 Q 18 54 28 39" fill="#B8860B" opacity="0.8"/>
              {/* Veias das folhas */}
              <path d="M 39 28 Q 32 22 25 14" stroke="#DAA520" strokeWidth="0.6" fill="none" opacity="0.7"/>
              <path d="M 50 39 Q 58 32 66 22" stroke="#DAA520" strokeWidth="0.6" fill="none" opacity="0.7"/>
              {/* Flores mini nos cantos do losango */}
              {[[39,8],[70,39],[39,70],[8,39]].map(([cx,cy],i) => (
                <g key={i}>
                  {[0,72,144,216,288].map((d) => (
                    <ellipse key={d}
                      cx={cx + Math.cos(d*Math.PI/180)*4.5}
                      cy={cy + Math.sin(d*Math.PI/180)*4.5}
                      rx="2.8" ry="1.8"
                      transform={`rotate(${d} ${cx+Math.cos(d*Math.PI/180)*4.5} ${cy+Math.sin(d*Math.PI/180)*4.5})`}
                      fill="url(#gold)" opacity="0.85"/>
                  ))}
                  <circle cx={cx} cy={cy} r="2.5" fill="#DAA520"/>
                </g>
              ))}
              {/* Arabescos finos */}
              <path d="M 12 12 Q 20 8 28 14 Q 22 20 12 12" fill="url(#gold)" opacity="0.55"/>
              <path d="M 66 12 Q 58 8 50 14 Q 56 20 66 12" fill="url(#gold)" opacity="0.55"/>
              <path d="M 12 66 Q 20 72 28 66 Q 22 58 12 66" fill="url(#gold)" opacity="0.55"/>
            </g>

            {/* ── CANTO SUPERIOR DIREITO (espelho H) ── */}
            <g transform="translate(820,2) scale(-1,1)">
              <rect x="2" y="2" width="76" height="76" rx="2" fill="none" stroke="url(#gold)" strokeWidth="1.2"/>
              <path d="M 39 8 L 70 39 L 39 70 L 8 39 Z" fill="none" stroke="url(#gold)" strokeWidth="1.4"/>
              {[0,40,80,120,160,200,240,280,320].map((deg) => (
                <ellipse key={deg}
                  cx={39+Math.cos(deg*Math.PI/180)*10} cy={39+Math.sin(deg*Math.PI/180)*10}
                  rx="5.5" ry="3.2"
                  transform={`rotate(${deg} ${39+Math.cos(deg*Math.PI/180)*10} ${39+Math.sin(deg*Math.PI/180)*10})`}
                  fill="url(#gold)" opacity="0.9"/>
              ))}
              <circle cx="39" cy="39" r="7" fill="url(#gold)"/>
              <circle cx="39" cy="39" r="3.5" fill="#6B3010"/>
              <path d="M 39 28 Q 28 18 18 10 Q 30 16 39 28" fill="#B8860B" opacity="0.8"/>
              <path d="M 50 39 Q 62 28 70 18 Q 64 30 50 39" fill="#B8860B" opacity="0.8"/>
              <path d="M 39 50 Q 28 62 18 70 Q 30 64 39 50" fill="#B8860B" opacity="0.8"/>
              <path d="M 28 39 Q 16 50 8 60 Q 18 54 28 39" fill="#B8860B" opacity="0.8"/>
              {[[39,8],[70,39],[39,70],[8,39]].map(([cx,cy],i) => (
                <g key={i}>
                  {[0,72,144,216,288].map((d) => (
                    <ellipse key={d}
                      cx={cx+Math.cos(d*Math.PI/180)*4.5} cy={cy+Math.sin(d*Math.PI/180)*4.5}
                      rx="2.8" ry="1.8"
                      transform={`rotate(${d} ${cx+Math.cos(d*Math.PI/180)*4.5} ${cy+Math.sin(d*Math.PI/180)*4.5})`}
                      fill="url(#gold)" opacity="0.85"/>
                  ))}
                  <circle cx={cx} cy={cy} r="2.5" fill="#DAA520"/>
                </g>
              ))}
              <path d="M 12 12 Q 20 8 28 14 Q 22 20 12 12" fill="url(#gold)" opacity="0.55"/>
              <path d="M 66 12 Q 58 8 50 14 Q 56 20 66 12" fill="url(#gold)" opacity="0.55"/>
              <path d="M 12 66 Q 20 72 28 66 Q 22 58 12 66" fill="url(#gold)" opacity="0.55"/>
            </g>

            {/* ── CANTO INFERIOR ESQUERDO (espelho V) ── */}
            <g transform="translate(2,1100) scale(1,-1)">
              <rect x="2" y="2" width="76" height="76" rx="2" fill="none" stroke="url(#gold)" strokeWidth="1.2"/>
              <path d="M 39 8 L 70 39 L 39 70 L 8 39 Z" fill="none" stroke="url(#gold)" strokeWidth="1.4"/>
              {[0,40,80,120,160,200,240,280,320].map((deg) => (
                <ellipse key={deg}
                  cx={39+Math.cos(deg*Math.PI/180)*10} cy={39+Math.sin(deg*Math.PI/180)*10}
                  rx="5.5" ry="3.2"
                  transform={`rotate(${deg} ${39+Math.cos(deg*Math.PI/180)*10} ${39+Math.sin(deg*Math.PI/180)*10})`}
                  fill="url(#gold)" opacity="0.9"/>
              ))}
              <circle cx="39" cy="39" r="7" fill="url(#gold)"/>
              <circle cx="39" cy="39" r="3.5" fill="#6B3010"/>
              <path d="M 39 28 Q 28 18 18 10 Q 30 16 39 28" fill="#B8860B" opacity="0.8"/>
              <path d="M 50 39 Q 62 28 70 18 Q 64 30 50 39" fill="#B8860B" opacity="0.8"/>
              <path d="M 39 50 Q 28 62 18 70 Q 30 64 39 50" fill="#B8860B" opacity="0.8"/>
              <path d="M 28 39 Q 16 50 8 60 Q 18 54 28 39" fill="#B8860B" opacity="0.8"/>
              {[[39,8],[70,39],[39,70],[8,39]].map(([cx,cy],i) => (
                <g key={i}>
                  {[0,72,144,216,288].map((d) => (
                    <ellipse key={d}
                      cx={cx+Math.cos(d*Math.PI/180)*4.5} cy={cy+Math.sin(d*Math.PI/180)*4.5}
                      rx="2.8" ry="1.8"
                      transform={`rotate(${d} ${cx+Math.cos(d*Math.PI/180)*4.5} ${cy+Math.sin(d*Math.PI/180)*4.5})`}
                      fill="url(#gold)" opacity="0.85"/>
                  ))}
                  <circle cx={cx} cy={cy} r="2.5" fill="#DAA520"/>
                </g>
              ))}
              <path d="M 12 12 Q 20 8 28 14 Q 22 20 12 12" fill="url(#gold)" opacity="0.55"/>
              <path d="M 66 12 Q 58 8 50 14 Q 56 20 66 12" fill="url(#gold)" opacity="0.55"/>
              <path d="M 12 66 Q 20 72 28 66 Q 22 58 12 66" fill="url(#gold)" opacity="0.55"/>
            </g>

            {/* ── CANTO INFERIOR DIREITO (espelho HV) ── */}
            <g transform="translate(820,1100) scale(-1,-1)">
              <rect x="2" y="2" width="76" height="76" rx="2" fill="none" stroke="url(#gold)" strokeWidth="1.2"/>
              <path d="M 39 8 L 70 39 L 39 70 L 8 39 Z" fill="none" stroke="url(#gold)" strokeWidth="1.4"/>
              {[0,40,80,120,160,200,240,280,320].map((deg) => (
                <ellipse key={deg}
                  cx={39+Math.cos(deg*Math.PI/180)*10} cy={39+Math.sin(deg*Math.PI/180)*10}
                  rx="5.5" ry="3.2"
                  transform={`rotate(${deg} ${39+Math.cos(deg*Math.PI/180)*10} ${39+Math.sin(deg*Math.PI/180)*10})`}
                  fill="url(#gold)" opacity="0.9"/>
              ))}
              <circle cx="39" cy="39" r="7" fill="url(#gold)"/>
              <circle cx="39" cy="39" r="3.5" fill="#6B3010"/>
              <path d="M 39 28 Q 28 18 18 10 Q 30 16 39 28" fill="#B8860B" opacity="0.8"/>
              <path d="M 50 39 Q 62 28 70 18 Q 64 30 50 39" fill="#B8860B" opacity="0.8"/>
              <path d="M 39 50 Q 28 62 18 70 Q 30 64 39 50" fill="#B8860B" opacity="0.8"/>
              <path d="M 28 39 Q 16 50 8 60 Q 18 54 28 39" fill="#B8860B" opacity="0.8"/>
              {[[39,8],[70,39],[39,70],[8,39]].map(([cx,cy],i) => (
                <g key={i}>
                  {[0,72,144,216,288].map((d) => (
                    <ellipse key={d}
                      cx={cx+Math.cos(d*Math.PI/180)*4.5} cy={cy+Math.sin(d*Math.PI/180)*4.5}
                      rx="2.8" ry="1.8"
                      transform={`rotate(${d} ${cx+Math.cos(d*Math.PI/180)*4.5} ${cy+Math.sin(d*Math.PI/180)*4.5})`}
                      fill="url(#gold)" opacity="0.85"/>
                  ))}
                  <circle cx={cx} cy={cy} r="2.5" fill="#DAA520"/>
                </g>
              ))}
              <path d="M 12 12 Q 20 8 28 14 Q 22 20 12 12" fill="url(#gold)" opacity="0.55"/>
              <path d="M 66 12 Q 58 8 50 14 Q 56 20 66 12" fill="url(#gold)" opacity="0.55"/>
              <path d="M 12 66 Q 20 72 28 66 Q 22 58 12 66" fill="url(#gold)" opacity="0.55"/>
            </g>

            {/* ── CENTRO TOPO ── */}
            <g transform="translate(370, 0)">
              {/* Flor central grande */}
              {[0,36,72,108,144,180,216,252,288,324].map((deg) => (
                <ellipse key={deg}
                  cx={40+Math.cos(deg*Math.PI/180)*12} cy={15+Math.sin(deg*Math.PI/180)*10}
                  rx="6" ry="3.5"
                  transform={`rotate(${deg} ${40+Math.cos(deg*Math.PI/180)*12} ${15+Math.sin(deg*Math.PI/180)*10})`}
                  fill="url(#gold)" opacity="0.92"/>
              ))}
              <circle cx="40" cy="15" r="7.5" fill="url(#gold)"/>
              <circle cx="40" cy="15" r="3.8" fill="#6B3010"/>
              {/* Arabescos laterais */}
              <path d="M 40 15 Q 20 8 8 12" stroke="url(#gold)" strokeWidth="1.4" fill="none"/>
              <path d="M 40 15 Q 60 8 72 12" stroke="url(#gold)" strokeWidth="1.4" fill="none"/>
              <path d="M 8 12 Q 4 16 8 20 Q 12 16 8 12" fill="url(#gold)" opacity="0.7"/>
              <path d="M 72 12 Q 76 16 72 20 Q 68 16 72 12" fill="url(#gold)" opacity="0.7"/>
              {/* Mini flores */}
              {[0,72,144,216,288].map((d) => (
                <ellipse key={d}
                  cx={8+Math.cos(d*Math.PI/180)*4} cy={16+Math.sin(d*Math.PI/180)*4}
                  rx="2.5" ry="1.6"
                  transform={`rotate(${d} ${8+Math.cos(d*Math.PI/180)*4} ${16+Math.sin(d*Math.PI/180)*4})`}
                  fill="url(#gold)" opacity="0.8"/>
              ))}
              {[0,72,144,216,288].map((d) => (
                <ellipse key={d}
                  cx={72+Math.cos(d*Math.PI/180)*4} cy={16+Math.sin(d*Math.PI/180)*4}
                  rx="2.5" ry="1.6"
                  transform={`rotate(${d} ${72+Math.cos(d*Math.PI/180)*4} ${16+Math.sin(d*Math.PI/180)*4})`}
                  fill="url(#gold)" opacity="0.8"/>
              ))}
            </g>

            {/* ── CENTRO BASE (espelho V do topo) ── */}
            <g transform="translate(370, 1100) scale(1,-1)">
              {[0,36,72,108,144,180,216,252,288,324].map((deg) => (
                <ellipse key={deg}
                  cx={40+Math.cos(deg*Math.PI/180)*12} cy={15+Math.sin(deg*Math.PI/180)*10}
                  rx="6" ry="3.5"
                  transform={`rotate(${deg} ${40+Math.cos(deg*Math.PI/180)*12} ${15+Math.sin(deg*Math.PI/180)*10})`}
                  fill="url(#gold)" opacity="0.92"/>
              ))}
              <circle cx="40" cy="15" r="7.5" fill="url(#gold)"/>
              <circle cx="40" cy="15" r="3.8" fill="#6B3010"/>
              <path d="M 40 15 Q 20 8 8 12" stroke="url(#gold)" strokeWidth="1.4" fill="none"/>
              <path d="M 40 15 Q 60 8 72 12" stroke="url(#gold)" strokeWidth="1.4" fill="none"/>
              <path d="M 8 12 Q 4 16 8 20 Q 12 16 8 12" fill="url(#gold)" opacity="0.7"/>
              <path d="M 72 12 Q 76 16 72 20 Q 68 16 72 12" fill="url(#gold)" opacity="0.7"/>
              {[0,72,144,216,288].map((d) => (
                <ellipse key={d}
                  cx={8+Math.cos(d*Math.PI/180)*4} cy={16+Math.sin(d*Math.PI/180)*4}
                  rx="2.5" ry="1.6"
                  transform={`rotate(${d} ${8+Math.cos(d*Math.PI/180)*4} ${16+Math.sin(d*Math.PI/180)*4})`}
                  fill="url(#gold)" opacity="0.8"/>
              ))}
              {[0,72,144,216,288].map((d) => (
                <ellipse key={d}
                  cx={72+Math.cos(d*Math.PI/180)*4} cy={16+Math.sin(d*Math.PI/180)*4}
                  rx="2.5" ry="1.6"
                  transform={`rotate(${d} ${72+Math.cos(d*Math.PI/180)*4} ${16+Math.sin(d*Math.PI/180)*4})`}
                  fill="url(#gold)" opacity="0.8"/>
              ))}
            </g>

            {/* ── CENTRO LATERAL ESQUERDA (meio da altura) ── */}
            <g transform="translate(0, 511) rotate(-90) translate(-40,0)">
              {[0,36,72,108,144,180,216,252,288,324].map((deg) => (
                <ellipse key={deg}
                  cx={40+Math.cos(deg*Math.PI/180)*11} cy={15+Math.sin(deg*Math.PI/180)*9}
                  rx="5.5" ry="3"
                  transform={`rotate(${deg} ${40+Math.cos(deg*Math.PI/180)*11} ${15+Math.sin(deg*Math.PI/180)*9})`}
                  fill="url(#gold)" opacity="0.88"/>
              ))}
              <circle cx="40" cy="15" r="7" fill="url(#gold)"/>
              <circle cx="40" cy="15" r="3.5" fill="#6B3010"/>
              <path d="M 40 15 Q 22 9 10 13" stroke="url(#gold)" strokeWidth="1.2" fill="none"/>
              <path d="M 40 15 Q 58 9 70 13" stroke="url(#gold)" strokeWidth="1.2" fill="none"/>
            </g>

            {/* ── CENTRO LATERAL DIREITA ── */}
            <g transform="translate(820, 589) rotate(90) translate(-40,0)">
              {[0,36,72,108,144,180,216,252,288,324].map((deg) => (
                <ellipse key={deg}
                  cx={40+Math.cos(deg*Math.PI/180)*11} cy={15+Math.sin(deg*Math.PI/180)*9}
                  rx="5.5" ry="3"
                  transform={`rotate(${deg} ${40+Math.cos(deg*Math.PI/180)*11} ${15+Math.sin(deg*Math.PI/180)*9})`}
                  fill="url(#gold)" opacity="0.88"/>
              ))}
              <circle cx="40" cy="15" r="7" fill="url(#gold)"/>
              <circle cx="40" cy="15" r="3.5" fill="#6B3010"/>
              <path d="M 40 15 Q 22 9 10 13" stroke="url(#gold)" strokeWidth="1.2" fill="none"/>
              <path d="M 40 15 Q 58 9 70 13" stroke="url(#gold)" strokeWidth="1.2" fill="none"/>
            </g>

          </g>{/* fim gold-glow */}

          {/* ══════════════════════════════════════════════
              CONTEÚDO DO POST (via foreignObject)
          ══════════════════════════════════════════════ */}
          <foreignObject x="44" y="44" width="732" height="1012">
            <div
              // @ts-ignore
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                fontFamily: "'Georgia', serif",
                color: '#2a1810',
                padding: '28px 32px',
                height: '100%',
                boxSizing: 'border-box' as const,
              }}
            >
              {/* Ornamento topo */}
              <div style={{ textAlign:'center', fontSize:11, color:'rgba(80,50,10,0.3)', letterSpacing:9, marginBottom:20 }}>
                {ornament}
              </div>

              {/* Tipo + ícone */}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span style={{ fontSize:18 }}>{cfg.icon}</span>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:'bold', letterSpacing:2, textTransform:'uppercase' as const, color:cfg.accent }}>
                  {cfg.label}
                </span>
              </div>

              {/* Linha */}
              <div style={{ borderTop:`1px solid ${cfg.accent}`, opacity:0.22, marginBottom:16 }}/>

              {/* Título */}
              <h1 style={{ fontFamily:"'Georgia',serif", fontSize:'clamp(20px,3.5vw,28px)', fontWeight:'bold', lineHeight:1.25, color:'#1e1008', marginBottom:10, margin:'0 0 10px' }}>
                {post.title}
              </h1>

              {/* Data */}
              <div style={{ fontFamily:"'Georgia',serif", fontSize:11, fontStyle:'italic', color:'rgba(42,24,16,0.5)', marginBottom:10 }}>
                {formatDate(post.date)}
                {post.character && <span style={{ marginLeft:10 }}>— {post.character}</span>}
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p style={{ fontFamily:"'Georgia',serif", fontSize:13, fontStyle:'italic', color:'rgba(42,24,16,0.65)', borderLeft:`2px solid ${cfg.accent}`, paddingLeft:12, marginBottom:20, lineHeight:1.65, margin:'0 0 20px' }}>
                  {post.excerpt}
                </p>
              )}

              <div style={{ borderTop:`1px solid ${cfg.accent}`, opacity:0.18, marginBottom:20 }}/>

              {/* Corpo */}
              <div
                className="jornal-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{ fontFamily:"'Georgia',serif", fontSize:14, lineHeight:1.85, color:'#3a2415' }}
              />

              {/* Ornamento rodapé */}
              <div style={{ textAlign:'center', marginTop:36, fontSize:11, color:'rgba(80,50,10,0.22)', letterSpacing:10 }}>
                ◆ &nbsp; ◆ &nbsp; ◆
              </div>
            </div>
          </foreignObject>

        </svg>
        {/* fim SVG moldura */}

        {/* Voltar rodapé */}
        <div style={{ textAlign:'center', marginTop:28 }}>
          <Link href="/jornal" style={{ fontFamily:"'Courier New',monospace", fontSize:10, letterSpacing:3, color:cfg.accent, textDecoration:'none', textTransform:'uppercase', opacity:0.6 }}>
            ← VOLTAR AO JORNAL
          </Link>
        </div>
      </div>

      <style>{`
        .jornal-content h2 { font-size:20px; color:#1e1008; margin:24px 0 10px; font-weight:bold; }
        .jornal-content h3 { font-size:16px; color:#2a1810; margin:18px 0 7px; }
        .jornal-content p  { margin-bottom:14px; }
        .jornal-content ul, .jornal-content ol { padding-left:22px; margin-bottom:14px; }
        .jornal-content li { margin-bottom:5px; }
        .jornal-content strong { color:#1e1008; font-weight:bold; }
        .jornal-content em { font-style:italic; }
        .jornal-content blockquote {
          border-left:2px solid #8B4513; padding-left:14px;
          margin:16px 0; font-style:italic; color:rgba(42,24,16,0.65);
        }
        .jornal-content hr { border:none; border-top:1px solid rgba(139,69,19,0.15); margin:20px 0; }
        .jornal-content a { color:#8B4513; }
      `}</style>
    </JornalPageWrapper>
  );
}
