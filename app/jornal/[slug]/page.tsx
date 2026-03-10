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

// ── SVG: Ornamento Barroco 3D Detalhado ──────────────────
const OrnateCorner3D = ({ flipped = false }: { flipped?: boolean }) => {
  const transform = flipped ? 'scale(-1, 1)' : '';
  
  return (
    <svg 
      viewBox="0 0 200 200" 
      width="180" 
      height="180" 
      style={{ transform }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradiente principal da madeira */}
        <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="25%" stopColor="#6B4423" />
          <stop offset="50%" stopColor="#4A3728" />
          <stop offset="75%" stopColor="#5D4E37" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>

        {/* Gradiente dourado para detalhes */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#B8941F" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>

        {/* Gradiente para efeito 3D */}
        <radialGradient id="depthGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#A67B5B" />
          <stop offset="40%" stopColor="#6B4423" />
          <stop offset="100%" stopColor="#2C1810" />
        </radialGradient>

        {/* Filtro de sombra */}        <filter id="deepShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="3" stdDeviation="3" floodOpacity="0.6" />
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
        </filter>

        {/* Filtro de iluminação 3D */}
        <filter id="bevel3D" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feSpecularLighting 
            in="blur" 
            surfaceScale="6" 
            specularConstant="0.9" 
            specularExponent="25" 
            lightingColor="#FFE4B5" 
            result="spec"
          >
            <fePointLight x="100" y="50" z="300" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
          <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>

        {/* Textura de madeira */}
        <pattern id="woodTexture" patternUnits="userSpaceOnUse" width="50" height="50">
          <rect width="50" height="50" fill="#4A3728" />
          <path d="M0,25 Q12,20 25,25 T50,25" stroke="#3E2723" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M0,35 Q12,30 25,35 T50,35" stroke="#5D4E37" strokeWidth="0.3" fill="none" opacity="0.3" />
        </pattern>
      </defs>

      <g filter="url(#bevel3D)">
        {/* Base do ornamento - forma principal */}
        <path 
          d="M 20 20 
             C 60 10, 90 40, 100 80 
             C 110 120, 90 160, 60 180 
             C 40 190, 20 185, 15 170 
             C 10 150, 25 140, 35 135 
             C 50 130, 70 135, 75 125 
             C 80 115, 70 95, 55 85 
             C 35 75, 15 80, 10 65 
             C 5 50, 10 30, 20 20 Z" 
          fill="url(#woodGradient)" 
          stroke="#2C1810" 
          strokeWidth="2"
          filter="url(#deepShadow)"
        />

        {/* Camada interna para profundidade */}
        <path           d="M 30 35 
             C 55 30, 80 50, 85 75 
             C 90 95, 80 120, 65 135 
             C 55 145, 40 140, 35 130 
             C 30 120, 40 115, 50 110 
             C 60 105, 65 95, 60 85 
             C 50 75, 35 80, 30 70 
             C 25 60, 27 45, 30 35 Z" 
          fill="url(#depthGradient)" 
          opacity="0.8"
        />

        {/* Detalhes florais/volutas */}
        <path 
          d="M 40 50 
             C 50 45, 65 50, 70 60 
             C 75 70, 70 85, 60 90 
             C 50 95, 35 90, 30 80 
             C 25 70, 30 55, 40 50 Z" 
          fill="url(#goldGradient)" 
          opacity="0.7"
        />

        <path 
          d="M 55 100 
             C 65 95, 80 100, 85 110 
             C 90 120, 85 135, 75 140 
             C 65 145, 50 140, 45 130 
             C 40 120, 45 105, 55 100 Z" 
          fill="url(#goldGradient)" 
          opacity="0.6"
        />

        {/* Círculo central decorativo */}
        <circle 
          cx="60" 
          cy="85" 
          r="12" 
          fill="url(#goldGradient)" 
          stroke="#8B6914" 
          strokeWidth="2"
          filter="url(#deepShadow)"
        />

        <circle 
          cx="60" 
          cy="85" 
          r="6" 
          fill="#2C1810" 
          opacity="0.6"        />

        {/* Linhas decorativas */}
        <path 
          d="M 25 45 Q 40 40 55 45" 
          stroke="#D4AF37" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.6"
        />
        <path 
          d="M 70 130 Q 75 145 70 160" 
          stroke="#D4AF37" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.5"
        />

        {/* Detalhes de brilho */}
        <ellipse cx="45" cy="60" rx="8" ry="4" fill="#FFE4B5" opacity="0.3" />
        <ellipse cx="70" cy="110" rx="6" ry="3" fill="#FFE4B5" opacity="0.25" />
      </g>
    </svg>
  );
};

// ── Componente da Moldura Completa 3D ──────────────────
const OrnateFrame3D = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ 
      position: 'relative',
      padding: '40px',
      background: 'linear-gradient(135deg, #1a1005 0%, #2C1810 50%, #1a1005 100%)',
      borderRadius: '12px',
      boxShadow: `
        0 20px 60px rgba(0,0,0,0.8),
        0 10px 30px rgba(0,0,0,0.6),
        inset 0 1px 2px rgba(255,255,255,0.1)
      `,
    }}>
      {/* Cantos ornamentais posicionados */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
        <OrnateCorner3D />
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
        <OrnateCorner3D flipped />
      </div>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 10, transform: 'scaleY(-1)' }}>
        <OrnateCorner3D />
      </div>      <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, transform: 'scale(-1, -1)' }}>
        <OrnateCorner3D />
      </div>

      {/* Moldura principal */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(90deg, #3E2723 0%, #5D4E37 15%, #6B4423 30%, #8B6914 50%, #6B4423 70%, #5D4E37 85%, #3E2723 100%)',
        padding: '25px',
        borderRadius: '4px',
        boxShadow: `
          0 0 0 8px #2C1810,
          0 0 0 12px #4A3728,
          0 0 0 15px #1a1005,
          inset 0 0 30px rgba(0,0,0,0.8),
          inset 0 0 60px rgba(0,0,0,0.6),
          0 10px 40px rgba(0,0,0,0.7)
        `,
      }}>
        {/* Camada intermediária com textura */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #4A3728 0%, #5D4E37 50%, #4A3728 100%)',
          padding: '20px',
          borderRadius: '2px',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
        }}>
          {/* Conteúdo interno - Papel envelhecido */}
          <div style={{
            background: '#F5EBD8',
            backgroundImage: `
              linear-gradient(90deg, rgba(139,105,20,0.03) 50%, transparent 50%),
              linear-gradient(rgba(139,105,20,0.03) 50%, transparent 50%)
            `,
            backgroundSize: '20px 20px',
            padding: '50px 40px',
            minHeight: '700px',
            boxShadow: `
              inset 0 0 80px rgba(139,105,20,0.15),
              inset 0 0 120px rgba(0,0,0,0.1)
            `,
            position: 'relative',
          }}>
            {/* Efeito de vinhetagem nas bordas do papel */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(139,105,20,0.1) 100%)',
              pointerEvents: 'none',
            }} />            
            {children}
          </div>
        </div>
      </div>

      {/* Sombra projetada abaixo */}
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        height: '40px',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
        filter: 'blur(10px)',
        zIndex: -1,
      }} />
    </div>
  );
};

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
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 16px' }}>

        {/* Botão Superior Estilo Placa de Madeira 3D */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <Link href="/jornal" style={{
            display: 'inline-block',
            padding: '14px 48px',
            background: `
              linear-gradient(135deg, 
                #6d3a1a 0%, 
                #8B4513 25%, 
                #6d3a1a 50%, 
                #4a250f 75%, 
                #3d1e0a 100%
              )            `,
            border: '3px solid #2C1810',
            borderRadius: '6px',
            boxShadow: `
              0 8px 20px rgba(0,0,0,0.6),
              0 4px 10px rgba(0,0,0,0.4),
              inset 0 2px 3px rgba(255,255,255,0.3),
              inset 0 -2px 3px rgba(0,0,0,0.4)
            `,
            color: '#E8D5B7',
            fontFamily: "'Georgia', serif",
            fontSize: 15,
            fontWeight: 'bold',
            letterSpacing: 3,
            textDecoration: 'none',
            textTransform: 'uppercase',
            position: 'relative',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            transform: 'translateY(0)',
            transition: 'transform 0.2s',
          }}>
            {/* Efeito de relevo no botão */}
            <span style={{ 
              position: 'relative',
              zIndex: 1,
            }}>← VOLTAR AO JORNAL</span>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
              borderRadius: '4px',
              pointerEvents: 'none',
            }} />
          </Link>
        </div>

        {/* ════ MOLDURA 3D ORNAMENTADA ════ */}
        <OrnateFrame3D>
          {/* Cabeçalho do Post */}
          <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative' }}>
            <div style={{ fontSize: 11, letterSpacing: 6, color: '#8B6914', opacity: 0.7, marginBottom: 20, fontWeight: 'bold' }}>
              ◆ ◆ ◆
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 15, 
              marginBottom: 25,              padding: '10px 30px',
              background: 'linear-gradient(90deg, transparent, rgba(139,105,20,0.1), transparent)',
            }}>
              <span style={{ fontSize: 32, filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))' }}>{cfg.icon}</span>
              <span style={{ 
                fontFamily: "'Georgia', serif", 
                fontWeight: 'bold', 
                letterSpacing: 4, 
                color: '#4A3728',
                fontSize: 14,
                textTransform: 'uppercase',
                borderBottom: '2px solid #8B6914',
                paddingBottom: '5px',
              }}>{cfg.label}</span>
            </div>

            <h1 style={{ 
              fontFamily: "'Georgia', serif", 
              fontSize: '2.4rem', 
              color: '#2C1810', 
              margin: '30px 0',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              lineHeight: 1.2,
            }}>
              {post.title}
            </h1>
            
            <div style={{ 
              fontStyle: 'italic', 
              color: '#6B4423', 
              fontSize: '1.1rem',
              opacity: 0.9,
              fontFamily: "'Georgia', serif",
            }}>
              {formatDate(post.date)}
            </div>
          </div>

          {/* Separador decorativo */}
          <div style={{ 
            height: '2px', 
            background: 'linear-gradient(to right, transparent, #8B6914, #D4AF37, #8B6914, transparent)', 
            margin: '30px 0', 
            opacity: 0.6,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',              transform: 'translate(-50%, -50%)',
              width: '8px',
              height: '8px',
              background: '#8B6914',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(139,105,20,0.5)',
            }} />
          </div>

          {/* Conteúdo */}
          <div 
            className="jornal-content" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            style={{ position: 'relative', zIndex: 1 }}
          />
        </OrnateFrame3D>

      </div>

      <style>{`
        .jornal-content { 
          font-family: 'Georgia', serif; 
          font-size: 17px; 
          line-height: 1.9; 
          color: #2C1810; 
        }
        .jornal-content p { 
          margin-bottom: 24px; 
          text-align: justify;
          text-indent: 30px;
        }
        .jornal-content p:first-of-type {
          text-indent: 0;
        }
        .jornal-content p:first-of-type::first-letter {
          font-size: 3.5rem;
          float: left;
          line-height: 0.8;
          margin-right: 12px;
          margin-top: 4px;
          color: #6B4423;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .jornal-content strong { 
          color: #4A3728; 
          font-weight: 700;
        }
        .jornal-content h2, .jornal-content h3 {
          font-family: 'Georgia', serif;          color: #4A3728;
          margin-top: 40px;
          margin-bottom: 20px;
        }
        .jornal-content h2 {
          font-size: 1.8rem;
          border-bottom: 2px solid rgba(139,105,20,0.3);
          padding-bottom: 10px;
        }
        .jornal-content h3 {
          font-size: 1.4rem;
        }
        .jornal-content blockquote {
          border-left: 4px solid #8B6914;
          padding-left: 20px;
          margin: 30px 0;
          font-style: italic;
          color: #5D4E37;
          background: rgba(139,105,20,0.05);
          padding: 20px 20px 20px 30px;
        }
      `}</style>
    </JornalPageWrapper>
  );
}