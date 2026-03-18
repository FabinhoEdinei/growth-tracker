'use client';

import { JornalCard } from '@/app/types/jornal';
import { NewspaperCard } from './NewspaperCard';

interface NewspaperGridProps {
  cards: JornalCard[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout assimétrico estilo jornal impresso
// Padrão que se repete a cada 6 cards:
//
//  [   DESTAQUE LARGO   ]  ← 1 card full width
//  [ MÉDIO ] [ MÉDIO ]     ← 2 cards lado a lado
//  [ P ][ P ][ P ]         ← 3 cards pequenos
//  [   DESTAQUE LARGO   ]  ← próximo ciclo...
//
// ─────────────────────────────────────────────────────────────────────────────

function buildLayout(cards: JornalCard[]): { card: JornalCard; size: 'full' | 'half' | 'third' }[] {
  const pattern: ('full' | 'half' | 'third')[] = [
    'full',
    'half', 'half',
    'third', 'third', 'third',
  ];
  return cards.map((card, i) => ({
    card,
    size: pattern[i % pattern.length],
  }));
}

export function NewspaperGrid({ cards }: NewspaperGridProps) {
  if (!cards.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '40px 20px',
        fontFamily: "'Courier New', monospace",
        fontSize: 12, color: 'rgba(100,80,40,0.5)', letterSpacing: 2,
      }}>
        ◆ SEM EDIÇÕES PUBLICADAS ◆
      </div>
    );
  }

  const layout = buildLayout(cards);

  // Agrupa em linhas conforme o padrão
  type Row = { size: 'full' | 'half' | 'third'; items: typeof layout };
  const rows: Row[] = [];
  let i = 0;

  while (i < layout.length) {
    const size = layout[i].size;
    if (size === 'full') {
      rows.push({ size: 'full', items: [layout[i]] });
      i++;
    } else if (size === 'half') {
      const pair = layout.slice(i, i + 2);
      rows.push({ size: 'half', items: pair });
      i += pair.length;
    } else {
      const trio = layout.slice(i, i + 3);
      rows.push({ size: 'third', items: trio });
      i += trio.length;
    }
  }

  return (
    <div style={{
      background:  '#f5f0e8',
      padding:     '8px 6px 20px',
    }}>

      {/* Separador ornamental */}
      <div style={{
        textAlign: 'center', padding: '4px 0 8px',
        color: 'rgba(139,105,20,0.5)', fontSize: 9,
        letterSpacing: 4, fontFamily: "'Courier New',monospace",
      }}>
        ◆ ◇ ◆ ◇ ◆
      </div>

      {/* Linhas do grid */}
      {rows.map((row, ri) => (
        <div key={ri} style={{
          display: 'grid',
          gridTemplateColumns:
            row.size === 'full'  ? '1fr' :
            row.size === 'half'  ? '1fr 1fr' :
                                   '1fr 1fr 1fr',
          gap: '5px',
          marginBottom: '5px',
        }}>
          {row.items.map(({ card, size }) => (
            <NewspaperCard
              key={card.slug}
              {...card}
              // Título clamp adaptado ao tamanho
              style={{
                // @ts-ignore
                '--title-clamp': size === 'third' ? 1 : 2,
              }}
            />
          ))}
        </div>
      ))}

      {/* Rodapé */}
      <div style={{
        textAlign: 'center', padding: '8px 12px 0',
        borderTop: '1px solid rgba(139,105,20,0.3)',
        fontFamily: "'Courier New',monospace",
        fontSize: 8, color: 'rgba(100,80,40,0.45)', letterSpacing: 2,
      }}>
        ◆ {cards.length} EDIÇÃO{cards.length !== 1 ? 'ÕES' : ''} NO ARQUIVO ◆
      </div>
    </div>
  );
}
