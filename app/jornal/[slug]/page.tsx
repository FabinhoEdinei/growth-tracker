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

// ── SVG: Ornamento de canto refinado ────────────────────────────────
const CornerOrnament = ({ rotate = 0 }: { rotate?: number }) => (
  <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: `rotate(${rotate}deg)` }}>
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F4E8C1"/>
        <stop offset="30%" stopColor="#DAA520"/>
        <stop offset="60%" stopColor="#B8860B"/>
        <stop offset="100%" stopColor="#8B6914"/>
      </linearGradient>
      <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B4423"/>
        <stop offset="50%" stopColor="#4A3728"/>
        <stop offset="100%" stopColor="#3E2723"/>
      </linearGradient>
    </defs>
    {/* Base floral */}
    <path d="M 50 15 Q 65 35 85 50 Q 65 65 50 85 Q 35 65 15 50 Q 35 35 50 15" 
          fill="url(#goldGrad)" opacity="0.9" stroke="#8B6914" strokeWidth="0.5"/>
    {/* Centro */}
    <circle cx="50" cy="50" r="8" fill="url(#goldGrad)" stroke="#5D4E37" strokeWidth="1"/>
    <circle cx="50" cy="50" r="4" fill="#3E2723"/>
    {/* Pétalas */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <ellipse key={i} cx={50 + Math.cos(deg * Math.PI / 180) * 22} 
               cy={50 + Math.sin(deg * Math.PI / 180) * 22}
               rx="6" ry="3.5" transform={`rotate(${deg + 90} ${50 + Math.cos(deg * Math.PI / 180) * 22} ${50 + Math.sin(deg * Math.PI / 180) * 22})`}
               fill="url(#goldGrad)" opacity="0.85"/>
    ))}
    {/* Folhagens */}
    <path d="M 20 20 Q 35 30 50 50" stroke="url(#woodGrad)" strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M 80 20 Q 65 30 50 50" stroke="url(#woodGrad)" strokeWidth="2" fill="none" opacity="0.6"/>
  </svg>
);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;  if (!slug || slug === 'undefined') notFound();

  const post = await getJornalPost(slug);
  if (!post) notFound();

  const cfg = typeConfig[post.type] ?? typeConfig['fatos'];
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <JornalPageWrapper>
      {/* Fundo com textura suave */}
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8DCC4 0%, #D4C4A8 50%, #C9B896 100%)',
        padding: '20px 16px 40px',
      }}>
        
        {/* Botão Voltar - Estilo Placa Vintage */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Link href="/jornal" style={{
            display: 'inline-block',
            padding: '10px 32px',
            background: 'linear-gradient(180deg, #8B6914 0%, #6B4423 50%, #4A3728 100%)',
            border: '2px solid #3E2723',
            borderRadius: '4px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            color: '#F4E8C1',
            fontFamily: "'Georgia', serif",
            fontSize: 12,
            fontWeight: 'bold',
            letterSpacing: 3,
            textDecoration: 'none',
            textTransform: 'uppercase',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            position: 'relative',
          }}>
            <span style={{ marginRight: 8 }}>←</span>
            Voltar ao Jornal
            {/* Detalhe decorativo */}
            <div style={{
              position: 'absolute',
              bottom: '3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(244,232,193,0.4), transparent)',
            }}/>
          </Link>        </div>

        {/* Moldura Principal */}
        <div style={{ 
          maxWidth: 750, 
          margin: '0 auto',
          position: 'relative',
          background: 'linear-gradient(135deg, #6B4423 0%, #4A3728 50%, #3E2723 100%)',
          padding: '18px',
          borderRadius: '3px',
          boxShadow: `
            0 10px 40px rgba(0,0,0,0.5),
            0 4px 12px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}>
          {/* Cantos ornamentais */}
          <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}>
            <CornerOrnament />
          </div>
          <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
            <CornerOrnament rotate={90} />
          </div>
          <div style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 10 }}>
            <CornerOrnament rotate={-90} />
          </div>
          <div style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 10 }}>
            <CornerOrnament rotate={180} />
          </div>

          {/* Papel Interno */}
          <div style={{
            background: 'linear-gradient(160deg, #FAF6EC 0%, #F5EFDD 50%, #F0E8D0 100%)',
            padding: '48px 42px 56px',
            position: 'relative',
            boxShadow: 'inset 0 0 60px rgba(139,105,20,0.08)',
          }}>
            {/* Linhas de textura do papel */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(139,105,20,0.03) 24px, rgba(139,105,20,0.03) 25px)',
              pointerEvents: 'none',
            }}/>

            {/* Conteúdo */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Cabeçalho */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{                   fontSize: 10, 
                  letterSpacing: 8, 
                  color: 'rgba(139,105,20,0.4)', 
                  marginBottom: 16,
                  fontWeight: 'bold',
                }}>
                  ◆  ◆  ◆
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: 10, 
                  marginBottom: 16,
                }}>
                  <span style={{ fontSize: 22 }}>{cfg.icon}</span>
                  <span style={{ 
                    fontFamily: "'Georgia', serif",
                    fontSize: 9, 
                    fontWeight: 'bold', 
                    letterSpacing: 3, 
                    color: cfg.accent,
                    textTransform: 'uppercase',
                    borderBottom: `1.5px solid ${cfg.accent}`,
                    paddingBottom: 3,
                  }}>
                    {cfg.label}
                  </span>
                </div>

                <h1 style={{ 
                  fontFamily: "'Georgia', serif", 
                  fontSize: 'clamp(22px, 4vw, 28px)', 
                  fontWeight: 'bold', 
                  lineHeight: 1.3, 
                  color: '#2C1810',
                  margin: '20px 0 12px',
                  textAlign: 'center',
                }}>
                  {post.title}
                </h1>

                <div style={{ 
                  fontFamily: "'Georgia', serif",
                  fontSize: 12, 
                  fontStyle: 'italic', 
                  color: 'rgba(62,39,35,0.6)',
                }}>
                  {formatDate(post.date)}                  {post.character && <span style={{ marginLeft: 12 }}>— {post.character}</span>}
                </div>
              </div>

              {/* Separador */}
              <div style={{ 
                height: '1px', 
                background: `linear-gradient(90deg, transparent, ${cfg.accent}40, transparent)`,
                margin: '24px 0 28px',
              }}/>

              {/* Excerpt */}
              {post.excerpt && (
                <div style={{
                  borderLeft: `3px solid ${cfg.accent}`,
                  paddingLeft: 16,
                  marginBottom: 28,
                  fontStyle: 'italic',
                  color: 'rgba(62,39,35,0.7)',
                  lineHeight: 1.7,
                  fontSize: 14,
                }}>
                  {post.excerpt}
                </div>
              )}

              {/* Conteúdo principal */}
              <div className="jornal-content" dangerouslySetInnerHTML={{ __html: post.content }}/>

              {/* Ornamento final */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: 48, 
                fontSize: 10, 
                letterSpacing: 8, 
                color: 'rgba(139,105,20,0.3)',
              }}>
                ❖  ❖  ❖
              </div>
            </div>
          </div>

          {/* Sombra inferior da moldura */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '16px',            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)',
            filter: 'blur(4px)',
            zIndex: -1,
          }}/>
        </div>

        {/* Botão inferior */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link href="/jornal" style={{
            fontFamily: "'Georgia', serif",
            fontSize: 11, 
            letterSpacing: 2, 
            color: '#6B4423', 
            textDecoration: 'none',
            opacity: 0.7,
            borderBottom: '1px solid transparent',
            transition: 'border-color 0.2s',
          }}>
            ← Voltar ao Jornal
          </Link>
        </div>
      </div>

      <style>{`
        .jornal-content { 
          font-family: 'Georgia', serif; 
          font-size: 15px; 
          line-height: 1.85; 
          color: #3E2723;
        }
        .jornal-content p { 
          margin-bottom: 18px; 
          text-align: justify;
        }
        .jornal-content h2 { 
          font-size: 20px; 
          color: '#2C1810'; 
          margin: 32px 0 14px; 
          fontWeight: 'bold';
          fontFamily: "'Georgia', serif";
        }
        .jornal-content h3 { 
          font-size: 16px; 
          color: '#4A3728'; 
          margin: 24px 0 10px;
          fontFamily: "'Georgia', serif";
        }
        .jornal-content strong { 
          color: '#2C1810'; 
          fontWeight: bold;        }
        .jornal-content em { 
          font-style: italic; 
          color: '#5D4E37';
        }
        .jornal-content ul, 
        .jornal-content ol { 
          padding-left: 24px; 
          margin-bottom: 18px; 
        }
        .jornal-content li { 
          margin-bottom: 8px; 
        }
        .jornal-content blockquote {
          border-left: 3px solid #8B6914;
          padding: 12px 16px;
          margin: 24px 0;
          font-style: italic;
          color: 'rgba(62,39,35,0.7)';
          background: 'rgba(139,105,20,0.05)';
        }
        .jornal-content hr { 
          border: none; 
          border-top: 1px solid rgba(139,105,20,0.2); 
          margin: 28px 0; 
        }
      `}</style>
    </JornalPageWrapper>
  );
}