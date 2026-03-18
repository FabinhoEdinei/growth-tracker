'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JornalCard } from '@/app/types/jornal';
import { VintageFrame } from './VintageFrame';

//Sem prop style — não aceita propriedades extras
interface NewspaperCardProps extends JornalCard {
  gridArea?: string;
}

const cardStyles = {
  fabio: {
    frameVariant: 'ornate' as const,
    frameColor:   'brown' as const,
    borderColor:  '#8B4513',
    background:   'linear-gradient(135deg, #f4e4d7, #e8d5c4)',
    accentColor:  '#8B4513',
    icon:         '🤠',
  },
  claudia: {
    frameVariant: 'elegant' as const,
    frameColor:   'gold' as const,
    borderColor:  '#DAA520',
    background:   'linear-gradient(135deg, #fff8e7, #f5e6d3)',
    accentColor:  '#DAA520',
    icon:         '🌸',
  },
  publicidade: {
    frameVariant: 'decorative' as const,
    frameColor:   'black' as const,
    borderColor:  '#000',
    background:   '#fffef5',
    accentColor:  '#c41e3a',
    icon:         '✨',
  },
  fatos: {
    frameVariant: 'simple' as const,
    frameColor:   'sepia' as const,
    borderColor:  '#2F4F4F',
    background:   '#f9f9f0',
    accentColor:  '#2F4F4F',
    icon:         '📰',
  },
  lugares: {
    frameVariant: 'elegant' as const,
    frameColor:   'brown' as const,
    borderColor:  '#556B2F',
    background:   'linear-gradient(135deg, #faf8f0, #f0ebe0)',
    accentColor:  '#556B2F',
    icon:         '🗺️',
  },
};

// ✅ Export correto — era NewspaperGrid por engano
export const NewspaperCard: React.FC<NewspaperCardProps> = ({
  slug,
  title,
  type,
  excerpt,
  date,
  gridArea,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const style  = cardStyles[type as keyof typeof cardStyles] ?? cardStyles.fatos;

  const handleClick = () => router.push(`/jornal/${slug}`);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', { day:'2-digit', month:'short' });
    } catch { return dateStr; }
  };

  return (
    <div
      className="newspaper-card"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        gridArea,
        background: style.background,
        transform:  isHovered ? 'scale(1.01) translateY(-2px)' : 'scale(1)',
      }}
    >
      <VintageFrame variant={style.frameVariant} color={style.frameColor} size="medium">
        <div className="card-inner">

          <div className="card-ornament-top">
            {type === 'publicidade' && '⚜ ⚜ ⚜'}
            {type === 'fabio'       && '★ ★ ★'}
            {type === 'claudia'     && '❀ ❀ ❀'}
            {type === 'fatos'       && '◆ ◆ ◆'}
            {type === 'lugares'     && '⚑ ⚑ ⚑'}
          </div>

          <div className="card-header">
            <span className="card-icon">{style.icon}</span>
            <div className="card-label" style={{ color: style.accentColor }}>
              {type === 'fabio'       && 'AVENTURAS DE FABIO'}
              {type === 'claudia'     && 'DIÁRIO DE CLÁUDIA'}
              {type === 'publicidade' && 'ANÚNCIO ESPECIAL'}
              {type === 'fatos'       && 'FATOS DO DIA'}
              {type === 'lugares'     && 'TERRAS EXPLORADAS'}
            </div>
            <span className="card-date-inline">{formatDate(date)}</span>
          </div>

          <h3 className="card-title">{title}</h3>
          <div className="card-divider" style={{ borderColor: style.accentColor }} />
          <p className="card-excerpt">{excerpt}</p>

          <div className="card-footer">
            <span className="read-more" style={{ color: style.accentColor }}>LER →</span>
          </div>
        </div>
      </VintageFrame>

      <div className="vintage-texture" />

      <style jsx>{`
        .newspaper-card {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          box-shadow: 1px 1px 5px rgba(0,0,0,0.12);
          min-height: 120px;
        }
        .newspaper-card:hover { box-shadow: 3px 3px 10px rgba(0,0,0,0.2); }

        .card-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 2px 0;
        }

        .card-ornament-top {
          text-align: center;
          font-size: 8px;
          color: rgba(0,0,0,0.25);
          margin-bottom: 3px;
          letter-spacing: 3px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 4px;
        }

        .card-icon       { font-size: 12px; flex-shrink: 0; }

        .card-label {
          font-size: 7px;
          font-weight: bold;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-family: 'Courier New', monospace;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-date-inline {
          font-size: 7px;
          font-style: italic;
          color: rgba(0,0,0,0.4);
          font-family: 'Georgia', serif;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .card-title {
          font-size: 11px;
          font-weight: bold;
          line-height: 1.25;
          margin: 0 0 3px 0;
          color: #2a1810;
          font-family: 'Georgia', serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-divider {
          border-top: 1px solid;
          margin: 3px 0;
          opacity: 0.35;
        }

        .card-excerpt {
          font-size: 9px;
          line-height: 1.4;
          color: #3a2820;
          margin-bottom: 3px;
          font-family: 'Georgia', serif;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer   { text-align: right; margin-top: auto; }

        .read-more {
          font-size: 7px;
          font-weight: bold;
          letter-spacing: 0.8px;
          font-family: 'Courier New', monospace;
          transition: transform 0.2s;
          display: inline-block;
        }
        .newspaper-card:hover .read-more { transform: translateX(3px); }

        .vintage-texture {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px
          );
          pointer-events: none;
          opacity: 0.3;
          z-index: 0;
        }
      `}</style>
    </div>
  );
};
