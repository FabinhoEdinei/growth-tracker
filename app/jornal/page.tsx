import { NewspaperHeader } from '../components/Jornal/NewspaperHeader';
import { NewspaperGrid } from '../components/Jornal/NewspaperGrid';
import { JornalCard } from '../types/jornal';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function getAllCards(): JornalCard[] {
  const jornalDirectory = path.join(process.cwd(), 'app/content/jornal');
  
  // Verificar se diretório existe
  if (!fs.existsSync(jornalDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(jornalDirectory);
  
  const cards = filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(jornalDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: data.slug || filename.replace('.md', ''),
        title: data.title || '',
        type: data.type || 'fatos',
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        character: data.character,
        location: data.location,
        image: data.image,
        content,
        cardStyle: data.cardStyle,
      } as JornalCard;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return cards;
}

export default function JornalPage() {
  const cards = getAllCards();

  return (
    <div className="jornal-page">
      <NewspaperHeader />
      <NewspaperGrid cards={cards} />

      <style jsx>{`
        .jornal-page {
          min-height: 100vh;
          background: linear-gradient(
            180deg,
            #faf8f0 0%,
            #f5f0e8 50%,
            #faf8f0 100%
          );
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.01) 2px,
              rgba(139, 69, 19, 0.01) 4px
            );
        }
      `}</style>
    </div>
  );
}