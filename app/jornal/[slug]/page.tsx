import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJornalPost } from '@/app/lib/content-loader';
import { JornalPageWrapper } from '@/app/components/Jornal/JornalPageWrapper';

const typeConfig: Record<string, { label: string; icon: string; accent: string }> = {
  fabio:       { label: 'AVENTURAS DE FABIO', icon: '🤠', accent: '#5D2E0A' },
  claudia:     { label: 'DIÁRIO DE CLÁUDIA',  icon: '🌸', accent: '#6B4423' },
  publicidade: { label: 'ANÚNCIO ESPECIAL',   icon: '✨', accent: '#4A1D1D' },
  fatos:       { label: 'FATOS DO DIA',        icon: '📰', accent: '#2C3E50' },
  lugares:     { label: 'TERRAS EXPLORADAS',   icon: '🗺️', accent: '#3E4A1D' },
};

// ── SVG: Ornamento de Canto Estilo "Entalhe em Madeira" ──────────────────
const WoodCornerSVG = () => (
  <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Filtro para dar volume de entalhe */}
      <filter id="bevel">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
        <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#ffffff" result="spec">
          <fePointLight x="-5000" y="-10000" z="20000"/>
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut"/>
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
      </filter>
      
      <linearGradient id="wood-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="50%" stopColor="#5D2E0A" />
        <stop offset="100%" stopColor="#3E1F07" />
      </linearGradient>
    </defs>
    
    <g filter="url(#bevel)">
      {/* Volutas e detalhes que lembram a moldura da Imagem 1 */}
      <path d="M 10 10 Q 50 10 50 50 Q 10 50 10 10" fill="url(#wood-grad)" />
      <path d="M 20 20 C 60 10 90 40 50 50 C 40 80 10 60 20 20" fill="url(#wood-grad)" opacity="0.9" />
      <circle cx="50" cy="50" r="8" fill="#3E1F07" />
      {/* Detalhe em "Ouro Velho" para os cantinhos inferiores como na imagem */}
      <circle cx="50" cy="50" r="4" fill="#DAA520" />
    </g>
  </svg>
);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug === 'undefined') notFound();

  const post = await getJornalPost(slug);
  if (!post) notFound();

  const cfg = typeConfig[post.type] ?? typeConfig['fatos'];
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <JornalPageWrapper>
      <div style={{ maxWidth: 850, margin: '0 auto', padding: '40px 16px' }}>

        {/* Botão Superior Estilo Placa de Madeira */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/jornal" style={{
            display: 'inline-block',
            padding: '12px 40px',
            background: 'linear-gradient(to bottom, #6d3a1a, #4a250f)',
            border: '3px solid #3d1e0a',
            borderRadius: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)',
            color: '#d4a373',
            fontFamily: "'Georgia', serif",
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 2,
            textDecoration: 'none',
            textTransform: 'uppercase',
            position: 'relative'
          }}>
            <span style={{ opacity: 0.8 }}>← VOLTAR AO JORNAL</span>
          </Link>
        </div>

        {/* ════ MOLDURA DE MADEIRA ENTALHADA ════ */}
        <div style={{ 
          position: 'relative',
          padding: '30px', // Espaço para a moldura aparecer
          background: '#1a1005', // Fundo escuro atrás da moldura
          borderRadius: '8px'
        }}>
          
          {/* A Moldura em si */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            background: '#f4ecd8', // Papel envelhecido
            border: '28px solid transparent',
            borderImageSource: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', // Textura de grão
            borderImageSlice: 30,
            borderStyle: 'solid',
            boxShadow: `
              0 0 0 4px #4a250f,
              inset 0 0 15px rgba(0,0,0,0.3),
              20px 20px 40px rgba(0,0,0,0.6)
            `,
            // O segredo da borda da imagem 1: gradientes que simulam o relevo cilíndrico
            backgroundColor: '#5d2e0a', 
            backgroundImage: `
              linear-gradient(90deg, #3e1f07 0%, #6d3a1a 15%, #8b4513 50%, #6d3a1a 85%, #3e1f07 100%)
            `,
          }}>

            {/* Conteúdo Interno (O Papel) */}
            <div style={{
              background: '#fdf8ec',
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
              padding: '40px 30px',
              minHeight: '600px',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)'
            }}>
               {/* Cabeçalho do Post */}
               <div style={{ textAlign: 'center', marginBottom: 30 }}>
                  <div style={{ fontSize: 10, letterSpacing: 5, color: '#8b4513', opacity: 0.6, marginBottom: 15 }}>◆ ◆ ◆</div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                    <span style={{ fontSize: 24 }}>{cfg.icon}</span>
                    <span style={{ fontFamily: 'serif', fontWeight: 'bold', letterSpacing: 3, color: '#5d2e0a' }}>{cfg.label}</span>
                  </div>
                  <h1 style={{ fontFamily: 'serif', fontSize: '2.2rem', color: '#1a1005', margin: '20px 0' }}>{post.title}</h1>
                  <div style={{ fontStyle: 'italic', color: '#6d3a1a', opacity: 0.8 }}>{formatDate(post.date)}</div>
               </div>

               <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #8b4513, transparent)', margin: '20px 0', opacity: 0.3 }} />

               <div className="jornal-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>

          {/* Cantos Entalhados (Posicionados sobre a borda) */}
          <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><WoodCornerSVG /></div>
          <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 5, transform: 'scaleX(-1)' }}><WoodCornerSVG /></div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 5, transform: 'scaleY(-1)' }}><WoodCornerSVG /></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 5, transform: 'rotate(180deg)' }}><WoodCornerSVG /></div>
        </div>

      </div>

      <style>{`
        .jornal-content { 
          font-family: 'Georgia', serif; 
          font-size: 16px; 
          line-height: 1.8; 
          color: #2c1e10; 
        }
        .jornal-content p { margin-bottom: 20px; text-align: justify; }
        .jornal-content strong { color: #5d2e0a; }
      `}</style>
    </JornalPageWrapper>
  );
}
