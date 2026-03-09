import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJornalPost } from '@/app/lib/content-loader';
import { JornalPageWrapper } from '@/app/components/Jornal/JornalPageWrapper';

const typeConfig: Record<string, { label: string; icon: string; accent: string; border: string }> = {
  fabio:       { label: 'AVENTURAS DE FABIO', icon: '🤠', accent: '#8B4513', border: '#8B4513' },
  claudia:     { label: 'DIÁRIO DE CLÁUDIA',  icon: '🌸', accent: '#DAA520', border: '#DAA520' },
  publicidade: { label: 'ANÚNCIO ESPECIAL',   icon: '✨', accent: '#c41e3a', border: '#000'    },
  fatos:       { label: 'FATOS DO DIA',        icon: '📰', accent: '#2F4F4F', border: '#2F4F4F' },
  lugares:     { label: 'TERRAS EXPLORADAS',   icon: '🗺️', accent: '#556B2F', border: '#556B2F' },
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug || slug === 'undefined') notFound();

  const post = await getJornalPost(slug);
  if (!post) notFound();

  const cfg = typeConfig[post.type] ?? typeConfig['fatos'];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  return (
    <JornalPageWrapper>
      <div style={{
        maxWidth: 780,
        margin: '0 auto',
        padding: '40px 20px 80px',
      }}>

        {/* Voltar */}
        <Link href="/jornal" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Courier New', monospace",
          fontSize: 11, letterSpacing: 2,
          color: cfg.accent, textDecoration: 'none',
          textTransform: 'uppercase',
          marginBottom: 32,
          opacity: 0.8,
        }}>
          ← Voltar ao Jornal
        </Link>

        {/* Card principal */}
        <div style={{
          background: 'linear-gradient(135deg, #faf8f0, #f0ebe0)',
          border: `2px solid ${cfg.border}`,
          borderRadius: 4,
          padding: '40px 36px',
          boxShadow: '4px 4px 16px rgba(0,0,0,0.15), inset 0 0 60px rgba(139,69,19,0.03)',
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Textura vintage */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
            zIndex: 0,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* Ornamento topo */}
            <div style={{
              textAlign: 'center', fontSize: 11,
              color: 'rgba(0,0,0,0.25)', letterSpacing: 6,
              marginBottom: 20,
            }}>
              {post.type === 'fabio'       && '★ ★ ★'}
              {post.type === 'claudia'     && '❀ ❀ ❀'}
              {post.type === 'publicidade' && '⚜ ⚜ ⚜'}
              {post.type === 'fatos'       && '◆ ◆ ◆'}
              {post.type === 'lugares'     && '⚑ ⚑ ⚑'}
            </div>

            {/* Label tipo */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 16,
            }}>
              <span style={{ fontSize: 22 }}>{cfg.icon}</span>
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 9, fontWeight: 'bold',
                letterSpacing: 2, textTransform: 'uppercase',
                color: cfg.accent,
              }}>
                {cfg.label}
              </span>
            </div>

            {/* Divisor */}
            <div style={{ borderTop: `1px solid ${cfg.border}`, opacity: 0.3, marginBottom: 20 }} />

            {/* Título */}
            <h1 style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(24px, 5vw, 36px)',
              fontWeight: 'bold',
              lineHeight: 1.2,
              color: '#2a1810',
              marginBottom: 12,
            }}>
              {post.title}
            </h1>

            {/* Data + character */}
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: 12, fontStyle: 'italic',
              color: 'rgba(0,0,0,0.5)',
              marginBottom: 8,
            }}>
              {formatDate(post.date)}
              {post.character && (
                <span style={{ marginLeft: 12, opacity: 0.7 }}>— {post.character}</span>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p style={{
                fontFamily: "'Georgia', serif",
                fontSize: 15, fontStyle: 'italic',
                color: 'rgba(42,24,16,0.7)',
                borderLeft: `3px solid ${cfg.accent}`,
                paddingLeft: 16, marginBottom: 28,
                lineHeight: 1.6,
              }}>
                {post.excerpt}
              </p>
            )}

            {/* Divisor */}
            <div style={{ borderTop: `1px solid ${cfg.border}`, opacity: 0.3, marginBottom: 28 }} />

            {/* Conteúdo */}
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 15, lineHeight: 1.8,
                color: '#3a2820',
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Ornamento rodapé */}
            <div style={{
              textAlign: 'center', marginTop: 40,
              fontSize: 11, color: 'rgba(0,0,0,0.2)',
              letterSpacing: 6,
            }}>
              ◆ ◆ ◆
            </div>

          </div>
        </div>

        {/* Link voltar rodapé */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/jornal" style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 11, letterSpacing: 2,
            color: cfg.accent, textDecoration: 'none',
            textTransform: 'uppercase', opacity: 0.7,
          }}>
            ← Voltar ao Jornal
          </Link>
        </div>

      </div>

      {/* Estilos globais para o conteúdo markdown */}
      <style>{`
        .jornal-page h2 { font-family: Georgia, serif; font-size: 22px; color: #2a1810; margin: 28px 0 12px; }
        .jornal-page h3 { font-family: Georgia, serif; font-size: 18px; color: #2a1810; margin: 20px 0 8px; }
        .jornal-page p  { margin-bottom: 16px; }
        .jornal-page ul, .jornal-page ol { padding-left: 24px; margin-bottom: 16px; }
        .jornal-page li { margin-bottom: 6px; }
        .jornal-page strong { color: #2a1810; }
        .jornal-page blockquote {
          border-left: 3px solid #8B4513;
          padding-left: 16px;
          margin: 20px 0;
          font-style: italic;
          color: rgba(42,24,16,0.7);
        }
      `}</style>
    </JornalPageWrapper>
  );
}
