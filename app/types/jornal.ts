export type CardType = 
  | 'fabio'      // Personagem Fabio
  | 'claudia'    // Personagem Cláudia
  | 'publicidade' // Anúncios vintage
  | 'fatos'      // Fatos do dia
  | 'lugares';   // Lugares visitados

export interface JornalCard {
  slug: string;
  title: string;
  type: CardType;
  date: string;
  excerpt: string;
  character?: 'fabio' | 'claudia';
  location?: string;
  image?: string;
  content: string;
  // Estilos específicos do card
  cardStyle?: {
    border?: string;
    font?: string;
    decoration?: string;
  };
}

export interface CardCharacteristics {
  fabio: {
    color: string;
    font: string;
    icon: string;
    border: string;
  };
  claudia: {
    color: string;
    font: string;
    icon: string;
    border: string;
  };
}