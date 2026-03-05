'use client';

import { NewspaperCard } from './NewspaperCard';
import { JornalCard } from '@/app/types/jornal';
import styles from './NewspaperGrid.module.css';

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

  // Mapear grid areas para cada card
  const gridAreas = [
    'header',   // Card 0
    'card-1',   // Card 1
    'card-2',   // Card 2
    'card-3',   // Card 3
    'card-4',   // Card 4
    'card-5',   // Card 5
    'card-6',   // Card 6
    'card-7',   // Card 7
    'card-8',   // Card 8
    'card-9',   // Card 9
    'card-10',  // Card 10
    'card-11',  // Card 11
    'card-12',  // Card 12
  ];

  return (
    <div className={styles.newspaperGridContainer}>
      <div className={styles.newspaperGrid}>
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
    </div>
  );
};