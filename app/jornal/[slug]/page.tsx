'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface JornalPost {
  slug: string;
  title: string;
  type: string;
  date: string;
  excerpt: string;
  character?: string;
  content: string;
}

interface TypeStyle {
  background: string;
  accentColor: string;
  icon: string;
  label: string;
}

const typeStyles: Record<string, TypeStyle> = {
  fabio: {
    background: 'linear-gradient(180deg, #3a2817, #2a1810)',
    accentColor: '#DAA520',
    icon: '🤠',
    label: 'AVENTURAS DE FABIO',
  },
  claudia: {
    background: 'linear-gradient(180deg, #2d2416, #1d1410)',
    accentColor: '#FFD700',
    icon: '🌸',
    label: 'DIÁRIO DE CLÁUDIA',
  },
  publicidade: {
    background: 'linear-gradient(180deg, #1a1410, #0a0a08)',
    accentColor: '#ff6b6b',
    icon: '✨',
    label: 'ANÚNCIO ESPECIAL',
  },
  fatos: {
    background: 'linear-gradient(180deg, #2a2520, #1a1510)',
    accentColor: '#8B7355',
    icon: '📰',
    label: 'FATOS DO DIA',
  },
  lugares: {
    background: 'linear-gradient(180deg, #2d2a20, #1d1a10)',
    accentColor: '#A0826D',
    icon: '🗺️',
    label: 'TERRAS EXPLORADAS',
  },
};

export default function PostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<JornalPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/jornal/${params.slug}`);
        if (!response.ok) {
          setNotFound(true);
          return;
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Erro ao carregar post:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div style={{ background: '#033400', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#00ff64', fontSize: '1.5rem' }}>⏳ Carregando...</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div style={{ background: '#033400', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '600px',
          background: 'linear-gradient(135deg, rgba(245, 235, 220, 0.95), rgba(240, 230, 215, 0.95))',
          padding: '40px',
          border: '4px double #6b5344',
          textAlign: 'center',
        }}>
          <h1 style={{ color: '#8B7355', fontSize: '72px', margin: 0 }}>404</h1>
          <h2 style={{ color: '#2a1810', margin: '20px 0' }}>História Não Encontrada</h2>
          <p style={{ color: '#5a4a3a', marginBottom: '30px' }}>
            Esta página do jornal parece ter sido perdida nas planícies digitais...
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #5a4a3a, #3a2a1a)',
              border: '2px solid #8B7355',
              color: '#f5e6d3',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 'bold',
              borderRadius: '8px',
              display: 'inline-block',
            }}>
              🏠 Voltar ao Início
            </Link>
            <Link href="/jornal" style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8B7355, #6b5344)',
              border: '2px solid #DAA520',
              color: '#f5e6d3',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 'bold',
              borderRadius: '8px',
              display: 'inline-block',
            }}>
              📰 Ver Todas as Histórias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const style = typeStyles[post.type] || typeStyles.fatos;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div style={{ background: style.background, minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
      {/* Botões de navegação vintage */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        display: 'flex',
        gap: '12px',
        zIndex: 100,
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #5a4a3a, #3a2a1a)',
          border: '2px solid #8B7355',
          borderRadius: '8px',
          color: '#f5e6d3',
          textDecoration: 'none',
          fontFamily: "'Courier New', monospace",
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
        }}>
          <span>🏠</span>
          <span>INÍCIO</span>
        </Link>

        <Link href="/jornal" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #5a4a3a, #3a2a1a)',
          border: '2px solid #8B7355',
          borderRadius: '8px',
          color: '#f5e6d3',
          textDecoration: 'none',
          fontFamily: "'Courier New', monospace",
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
        }}>
          <span>📰</span>
          <span>JORNAL</span>
        </Link>
      </div>

      {/* Conteúdo do post */}
      <article style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, rgba(245, 235, 220, 0.95), rgba(240, 230, 215, 0.95))',
        padding: '60px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        border: '3px solid #6b5344',
      }}>
        {/* Header do post */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '3px',
            fontFamily: "'Courier New', monospace",
            textTransform: 'uppercase',
            color: style.accentColor,
          }}>
            <span>{style.icon}</span>
            <span>{style.label}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            margin: '20px 0',
            fontSize: '12px',
            color: '#8B7355',
            opacity: 0.6,
          }}>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: 1.2,
            margin: '20px 0',
            color: '#2a1810',
            textShadow: '2px 2px 0 rgba(0, 0, 0, 0.1)',
          }}>
            {post.title}
          </h1>

          <time style={{
            fontFamily: "'Georgia', serif",
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#6b5344',
          }}>
            {formatDate(post.date)}
          </time>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            margin: '20px 0',
            fontSize: '12px',
            color: '#8B7355',
            opacity: 0.6,
          }}>
            <span>◆</span>
            <span>◆</span>
            <span>◆</span>
          </div>
        </header>

        {/* Conteúdo */}
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '18px',
            lineHeight: 1.8,
            color: '#2a1810',
            marginBottom: '40px',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingTop: '40px', borderTop: '2px solid #d4c4b0' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            margin: '20px 0',
            fontSize: '12px',
            color: '#8B7355',
            opacity: 0.6,
          }}>
            <span>❋</span>
            <span>❋</span>
            <span>❋</span>
          </div>

          <Link href="/jornal" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #5a4a3a, #3a2a1a)',
            border: '2px solid #8B7355',
            borderRadius: '8px',
            color: '#f5e6d3',
            textDecoration: 'none',
            fontFamily: "'Courier New', monospace",
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '1.5px',
          }}>
            ← Voltar ao Jornal
          </Link>
        </footer>
      </article>
    </div>
  );
}
