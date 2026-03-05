'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JornalCard } from '@/app/types/jornal';

interface NewspaperCardProps extends JornalCard {
  gridArea?: string;
}

const cardStyles = {
  fabio: {
    borderColor: '#8B4513',
    borderStyle: 'double',
    borderWidth: '4px',
    background: 'linear-gradient(135deg, #f4e4d7, #e8d5c4)',
    accentColor: '#8B4513',
    icon: '🤠',
    font: "'Courier New', monospace",
  },
  claudia: {
    borderColor: '#DAA520',
    borderStyle: 'solid',
    borderWidth: '3px',
    background: 'linear-gradient(135deg, #fff8e7, #f5e6d3)',
    accentColor: '#DAA520',
    icon: '🌸',
    font: "'Playfair Display', serif",
  },
  publicidade: {
    borderColor: '#000',
    borderStyle: 'dashed',
    borderWidth: '2px',
    background: '#fffef5',
    accentColor: '#c41e3a',
    icon: '✨',
    font: "'Georgia', serif",
  },
  fatos: {
    borderColor: '#2F4F4F',
    borderStyle: 'solid',
    borderWidth: '2px',
    background: '#f9f9f0',
    accentColor: '#2F4F4F',
    icon: '📰',
    font: "'Times New Roman', serif",
  },
  lugares: {
    borderColor: '#556B2F',
    borderStyle: 'ridge',
    borderWidth: '3px',
    background: 'linear-gradient(135deg, #faf8f0, #f0ebe0)',
    accentColor: '#556B2F',
    icon: '🗺️',
    font: "'Georgia', serif",
  },
};

export const NewspaperCard: React.FC<NewspaperCardProps> = ({
  slug,
  title,
  type,
  excerpt,
  date,
  character,
  gridArea,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const style = cardStyles[type];

  const handleClick = () => {
    router.push(`/jornal/${slug}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div
      className="newspaper-card"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        gridArea,
        borderColor: style.borderColor,
        borderStyle: style.borderStyle,
        borderWidth: style.borderWidth,
        background: style.background,
        transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1)',
      }}
    >
      {/* Ornamento superior */}
      <div className="card-ornament-top">
        {type === 'publicidade' && '⚜ ⚜ ⚜'}
        {type === 'fabio' && '★ ★ ★'}
        {type === 'claudia' && '❀ ❀ ❀'}
        {type === 'fatos' && '◆ ◆ ◆'}
        {type === 'lugares' && '⚑ ⚑ ⚑'}
      </div>

      {/* Cabeçalho do card */}
      <div className="card-header">
        <span className="card-icon">{style.icon}</span>
        <div className="card-label" style={{ color: style.accentColor }}>
          {type === 'fabio' && 'AVENTURAS DE FABIO'}
          {type === 'claudia' && 'DIÁRIO DE CLÁUDIA'}
          {type === 'publicidade' && 'ANÚNCIO ESPECIAL'}
          {type === 'fatos' && 'FATOS DO DIA'}
          {type === 'lugares' && 'TERRAS EXPLORADAS'}
        </div>
      </div>

      {/* Título */}
      <h3 className="card-title" style={{ fontFamily: style.font }}>
        {title}
      </h3>

      {/* Data */}
      <div className="card-date">{formatDate(date)}</div>

      {/* Linha decorativa */}
      <div className="card-divider" style={{ borderColor: style.accentColor }} />

      {/* Excerpt */}
      <p className="card-excerpt">{excerpt}</p>

      {/* Footer */}
      <div className="card-footer">
        <span className="read-more" style={{ color: style.accentColor }}>
          LER HISTÓRIA COMPLETA →
        </span>
      </div>

      {/* Textura vintage */}
      <div className="vintage-texture"></div>

      <style jsx>{`
        .newspaper-card {
          position: relative;
          padding: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
        }

        .newspaper-card:hover {
          box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.25);
        }

        .card-ornament-top {
          text-align: center;
          font-size: 10px;
          color: rgba(0, 0, 0, 0.3);
          margin-bottom: 8px;
          letter-spacing: 4px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .card-icon {
          font-size: 20px;
        }

        .card-label {
          font-size: 9px;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: 'Courier New', monospace;
        }

        .card-title {
          font-size: 18px;
          font-weight: bold;
          line-height: 1.2;
          margin: 0 0 10px 0;
          color: #2a1810;
        }

        .card-date {
          font-size: 11px;
          font-style: italic;
          color: rgba(0, 0, 0, 0.5);
          margin-bottom: 12px;
          font-family: 'Georgia', serif;
        }

        .card-divider {
          border-top: 1px solid;
          margin: 12px 0;
          opacity: 0.4;
        }

        .card-excerpt {
          font-size: 13px;
          line-height: 1.6;
          color: #3a2820;
          margin-bottom: 16px;
          font-family: 'Georgia', serif;
        }

        .card-footer {
          text-align: right;
        }

        .read-more {
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 1px;
          font-family: 'Courier New', monospace;
          transition: transform 0.3s;
          display: inline-block;
        }

        .newspaper-card:hover .read-more {
          transform: translateX(4px);
        }

        .vintage-texture {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.02) 2px,
              rgba(0,0,0,0.02) 4px
            );
          pointer-events: none;
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .newspaper-card {
            padding: 16px;
          }

          .card-title {
            font-size: 16px;
          }

          .card-excerpt {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};