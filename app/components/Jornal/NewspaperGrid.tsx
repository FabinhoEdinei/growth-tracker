'use client';

import { NewspaperCard } from './NewspaperCard';
import { JornalCard } from '@/app/types/jornal';

interface NewspaperGridProps {
  cards: JornalCard[];
}

export const NewspaperGrid: React.FC<NewspaperGridProps> = ({ cards }) => {
  // Garantir que temos exatamente 12 cards (preencher com vazios se necessário)
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

  // Definir áreas do grid (layout vintage tipo jornal)
  const gridAreas = [
    'header',      // Card 1 - Header principal (largo)
    'card-2',      // Card 2
    'card-3',      // Card 3
    'card-4',      // Card 4
    'card-5',      // Card 5
    'card-6',      // Card 6
    'card-7',      // Card 7
    'card-8',      // Card 8
    'card-9',      // Card 9
    'card-10',     // Card 10
    'card-11',     // Card 11
    'card-12',     // Card 12
  ];

  return (
    <div className="newspaper-grid-container">
      <div className="newspaper-grid">
        {gridCards.slice(0, 12).map((card, index) => (
          card.title ? (
            <NewspaperCard
              key={card.slug}
              {...card}
              gridArea={gridAreas[index]}
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

        .newspaper-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(12, 1fr);
          grid-template-areas:
            "header header header header header header card-2 card-2 card-2 card-3 card-3 card-3"
            "card-4 card-4 card-4 card-5 card-5 card-5 card-5 card-6 card-6 card-6 card-6 card-6"
            "card-7 card-7 card-7 card-7 card-8 card-8 card-8 card-8 card-9 card-9 card-9 card-9"
            "card-10 card-10 card-10 card-10 card-10 card-11 card-11 card-11 card-12 card-12 card-12";
        }

        /* Tablet (768px - 1024px) */
        @media (max-width: 1024px) {
          .newspaper-grid {
            grid-template-columns: repeat(6, 1fr);
            grid-template-areas:
              "header header header header header header"
              "card-2 card-2 card-2 card-3 card-3 card-3"
              "card-4 card-4 card-4 card-5 card-5 card-5"
              "card-6 card-6 card-6 card-6 card-7 card-7"
              "card-8 card-8 card-9 card-9 card-9 card-9"
              "card-10 card-10 card-10 card-11 card-11 card-11"
              "card-12 card-12 card-12 card-12 card-12 card-12";
          }
        }

        /* Mobile (até 768px) - Cards empilhados */
        @media (max-width: 768px) {
          .newspaper-grid-container {
            padding: 12px;
          }

          .newspaper-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            grid-template-areas:
              "header"
              "card-2"
              "card-3"
              "card-4"
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

        /* Mobile pequeno (até 480px) */
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