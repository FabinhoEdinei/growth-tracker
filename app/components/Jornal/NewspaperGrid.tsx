'use client';

import { NewspaperCard } from './NewspaperCard';
import { JornalCard } from '@/app/types/jornal';

interface NewspaperGridProps {
  cards: JornalCard[];
}

export const NewspaperGrid: React.FC<NewspaperGridProps> = ({ cards }) => {
  // Garantir 12 cards
  const gridCards = [...cards];
  while (gridCards.length < 12) {
    gridCards.push({
      slug: `empty-${gridCards.length}`,
      title: '',
      type: 'fatos',
      date: '',
      excerpt: '',
      content: '',
    });
  }

  return (
    <div className="newspaper-grid-container">
      <div className="newspaper-grid">
        {/* Card 01 - HEADER (largo no topo) */}
        {gridCards[0]?.title && (
          <NewspaperCard {...gridCards[0]} gridArea="header" />
        )}

        {/* Card 02 - INDEPENDENTE (esquerda superior) */}
        {gridCards[1]?.title && (
          <NewspaperCard {...gridCards[1]} gridArea="card-02" />
        )}

        {/* Cards 03-12 */}
        {gridCards.slice(2, 12).map((card, index) => (
          card.title ? (
            <NewspaperCard
              key={card.slug}
              {...card}
              gridArea={`card-${index + 3}`}
            />
          ) : null
        ))}
      </div>

      <style jsx>{`
        .newspaper-grid-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        /* DESKTOP LAYOUT - Como jornal vintage */
        .newspaper-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: auto;
          grid-template-areas:
            "header header header header header header header header header header header header"
            "card-02 card-02 card-02 card-02 card-3 card-3 card-3 card-3 card-4 card-4 card-4 card-4"
            "largo1 largo1 largo1 largo1 largo1 largo1 card-5 card-5 card-5 card-6 card-6 card-6"
            "card-8 card-8 card-8 card-8 card-8 card-8 card-8 card-8 card-7 card-7 card-7 card-7"
            "card-8 card-8 card-8 card-8 card-8 card-8 card-8 card-8 card-9 card-9 card-9 card-9"
            "card-10 card-10 card-10 card-10 card-11 card-11 card-11 card-11 card-12 card-12 card-12 card-12";
        }

        /* Tablet - 768px a 1024px */
        @media (max-width: 1024px) {
          .newspaper-grid {
            grid-template-columns: repeat(6, 1fr);
            grid-template-areas:
              "header header header header header header"
              "card-02 card-02 card-02 card-3 card-3 card-3"
              "card-4 card-4 card-4 card-5 card-5 card-5"
              "largo1 largo1 largo1 largo1 card-6 card-6"
              "card-8 card-8 card-8 card-7 card-7 card-7"
              "card-8 card-8 card-8 card-9 card-9 card-9"
              "card-10 card-10 card-11 card-11 card-12 card-12";
          }
        }

        /* Mobile - até 768px (Cards empilhados) */
        @media (max-width: 768px) {
          .newspaper-grid-container {
            padding: 12px;
          }

          .newspaper-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            grid-template-areas:
              "header"
              "card-02"
              "card-3"
              "card-4"
              "largo1"
              "card-5"
              "card-6"
              "card-7"
              "card-8"
              "card-9"
              "card-10"
              "card-11"
              "card-12";
          }
        }

        /* Mobile pequeno - até 480px */
        @media (max-width: 480px) {
          .newspaper-grid-container {
            padding: 8px;
          }

          .newspaper-grid {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};