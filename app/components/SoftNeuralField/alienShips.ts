export const alienShips = {
  // 1. Nave Vogon (burocrática e feia)
  vogon: `
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5 L30 15 L28 25 L25 30 L15 30 L12 25 L10 15 Z" 
            fill="currentColor" opacity="0.8"/>
      <rect x="18" y="10" width="4" height="8" fill="currentColor" opacity="0.4"/>
      <circle cx="15" cy="18" r="2" fill="currentColor"/>
      <circle cx="25" cy="18" r="2" fill="currentColor"/>
    </svg>
  `,

  // 2. Heart of Gold (icônica e dourada)
  heartOfGold: `
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="20" rx="15" ry="8" fill="currentColor" opacity="0.9"/>
      <circle cx="20" cy="20" r="6" fill="currentColor"/>
      <path d="M10 20 Q8 15 12 12 L20 8 L28 12 Q32 15 30 20" 
            fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="12" r="3" fill="currentColor" opacity="0.5"/>
    </svg>
  `,

  // 3. Nave Babel Fish (orgânica)
  babelFish: `
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="20" rx="12" ry="6" fill="currentColor" opacity="0.8"/>
      <path d="M8 20 Q5 18 8 15 Q10 18 8 20" fill="currentColor" opacity="0.6"/>
      <path d="M32 20 Q35 18 32 15 Q30 18 32 20" fill="currentColor" opacity="0.6"/>
      <circle cx="16" cy="19" r="1.5" fill="currentColor"/>
      <circle cx="24" cy="19" r="1.5" fill="currentColor"/>
      <path d="M18 24 Q20 26 22 24" stroke="currentColor" fill="none"/>
    </svg>
  `,

  // 4. Nave Magrathea (construtor de planetas)
  magrathea: `
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,5 30,18 25,30 15,30 10,18" fill="currentColor" opacity="0.8"/>
      <circle cx="20" cy="18" r="5" fill="currentColor" opacity="0.6"/>
      <rect x="18" y="25" width="4" height="5" fill="currentColor" opacity="0.4"/>
      <circle cx="14" cy="15" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="26" cy="15" r="2" fill="currentColor" opacity="0.5"/>
    </svg>
  `,

  // 5. Nave Slartibartfast (designer de fiordes)
  slartibartfast: `
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8 L28 14 L30 22 L26 28 L14 28 L10 22 L12 14 Z" 
            fill="currentColor" opacity="0.85"/>
      <path d="M20 8 L25 12 L20 16 L15 12 Z" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.7"/>
    </svg>
  `,

  // 6. Nave Zaphod (duas cabeças = duas engines)
  zaphod: `
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="20" rx="14" ry="7" fill="currentColor" opacity="0.9"/>
      <circle cx="13" cy="15" r="4" fill="currentColor" opacity="0.7"/>
      <circle cx="27" cy="15" r="4" fill="currentColor" opacity="0.7"/>
      <rect x="18" y="23" width="4" height="6" fill="currentColor" opacity="0.5"/>
    </svg>
  `,
};

export const shipNames = Object.keys(alienShips) as Array<keyof typeof alienShips>;