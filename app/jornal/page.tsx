import { NewspaperHeader } from '../components/Jornal/NewspaperHeader';
import { NewspaperGrid } from '../components/Jornal/NewspaperGrid';
import { JornalPageWrapper } from '../components/Jornal/JornalPageWrapper';
import { JornalCard } from '../types/jornal';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function getAllCards(): JornalCard[] {
  const jornalDirectory = path.join(process.cwd(), 'app/content/jornal');
  
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
    <JornalPageWrapper>
      <NewspaperHeader />
      <NewspaperGrid cards={cards} />
    </JornalPageWrapper>
  );
}