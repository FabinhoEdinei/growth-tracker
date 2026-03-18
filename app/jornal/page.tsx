// app/jornal/page.tsx

import { NewspaperHeader } from '../components/Jornal/NewspaperHeader';
import { NewspaperGrid }   from '../components/Jornal/NewspaperGrid';
import { JornalPageWrapper } from '../components/Jornal/JornalPageWrapper';
import { JornalCard } from '../types/jornal';
import fs   from 'fs';
import path from 'path';
import matter from 'gray-matter';

function getAllCards(): JornalCard[] {
  const dir = path.join(process.cwd(), 'app/content/jornal');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      return {
        slug:      data.slug || f.replace('.md', ''),
        title:     data.title || '',
        type:      data.type  || 'fatos',
        date:      data.date  || new Date().toISOString(),
        excerpt:   data.excerpt || '',
        character: data.character,
        location:  data.location,
        image:     data.image,
        content,
        cardStyle: data.cardStyle,
      } as JornalCard;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function JornalPage() {
  const cards = getAllCards();

  return (
    // JornalPageWrapper mantém o fundo e o estilo global — não mexemos nele
    <JornalPageWrapper>
      <NewspaperHeader />
      {/*
        ✅ Wrapper com background #f5f0e8 colado direto abaixo do header
           elimina a faixa preta entre o header e os cards
      */}
      <div style={{ background: '#f5f0e8', minHeight: '60vh' }}>
        <NewspaperGrid cards={cards} />
      </div>
    </JornalPageWrapper>
  );
}
