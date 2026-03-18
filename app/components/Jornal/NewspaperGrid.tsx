'use client';

import { NewspaperCard } from './NewspaperCard';
import { JornalCard } from '@/app/types/jornal';
import styles from './NewspaperGrid.module.css';

interface NewspaperGridProps {
  cards: JornalCard[];
}

export const NewspaperGrid: React.FC<NewspaperGridProps> = ({ cards }) => {
  // Garante até 12 cards — sem preencher com vazios (evita cards em branco)
  const gridCards = cards.slice(0, 12);

  const gridAreas = [
    'header',
    'card-1', 'card-2', 'card-3',
    'card-4', 'card-5', 'card-6',
    'card-7', 'card-8', 'card-9',
    'card-10', 'card-11', 'card-12',
  ];

  return (
    <div className={styles.newspaperGridContainer}>
      <div className={styles.newspaperGrid}>
        {gridCards.map((card, index) =>
          card.title ? (
            <NewspaperCard
              key={card.slug}
              {...card}
              gridArea={gridAreas[index]}
            />
          ) : null
        )}
      </div>
    </div>
  );
};
