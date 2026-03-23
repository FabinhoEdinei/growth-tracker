export const alienShips = {
  // 1. Nave Vogon - Cargueiro pesado com detalhes industriais
  vogon: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vogonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.5"/>
        </linearGradient>
      </defs>
      <path d="M24 4 L36 14 L38 22 L36 32 L30 38 L18 38 L12 32 L10 22 L12 14 Z" 
            fill="url(#vogonGrad)" opacity="0.9"/>
      <rect x="21" y="8" width="6" height="12" rx="1" fill="currentColor" opacity="0.6"/>
      <ellipse cx="17" cy="20" rx="3" ry="2" fill="currentColor" opacity="0.8"/>
      <ellipse cx="31" cy="20" rx="3" ry="2" fill="currentColor" opacity="0.8"/>
      <path d="M16 32 L14 42 L18 40 Z" fill="currentColor" opacity="0.7"/>
      <path d="M32 32 L34 42 L30 40 Z" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="26" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="24" cy="26" r="2" fill="currentColor"/>
      <rect x="20" y="34" width="8" height="3" rx="1" fill="currentColor" opacity="0.5"/>
    </svg>
  `,

  // 2. Heart of Gold - Disco voador elegante com aura
  heartOfGold: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:0.8"/>
          <stop offset="70%" style="stop-color:currentColor;stop-opacity:0.3"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0"/>
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="24" rx="22" ry="10" fill="url(#goldGlow)" opacity="0.4"/>
      <ellipse cx="24" cy="24" rx="18" ry="8" fill="currentColor" opacity="0.9"/>
      <ellipse cx="24" cy="22" rx="14" ry="5" fill="currentColor" opacity="0.6"/>
      <ellipse cx="24" cy="24" rx="8" ry="4" fill="currentColor"/>
      <circle cx="24" cy="16" r="5" fill="currentColor" opacity="0.8"/>
      <circle cx="24" cy="16" r="3" fill="currentColor"/>
      <circle cx="16" cy="24" r="1.5" fill="currentColor"/>
      <circle cx="32" cy="24" r="1.5" fill="currentColor"/>
      <circle cx="24" cy="28" r="1.5" fill="currentColor"/>
      <path d="M10 24 Q8 20 12 16" stroke="currentColor" fill="none" stroke-width="1" opacity="0.5"/>
      <path d="M38 24 Q40 20 36 16" stroke="currentColor" fill="none" stroke-width="1" opacity="0.5"/>
    </svg>
  `,

  // 3. Nave Babel Fish - Bio-nave orgânica com tentáculos
  babelFish: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bioGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.5"/>
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="22" rx="16" ry="10" fill="url(#bioGrad)"/>
      <ellipse cx="24" cy="20" rx="12" ry="6" fill="currentColor" opacity="0.6"/>
      <path d="M6 22 Q2 18 6 14 Q10 18 8 22 Q6 26 4 22" fill="currentColor" opacity="0.7"/>
      <path d="M42 22 Q46 18 42 14 Q38 18 40 22 Q42 26 44 22" fill="currentColor" opacity="0.7"/>
      <circle cx="18" cy="19" r="3" fill="currentColor"/>
      <circle cx="18" cy="19" r="1.5" fill="currentColor" opacity="0.5"/>
      <circle cx="30" cy="19" r="3" fill="currentColor"/>
      <circle cx="30" cy="19" r="1.5" fill="currentColor" opacity="0.5"/>
      <path d="M20 28 Q24 32 28 28" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M14 32 Q12 38 16 36" stroke="currentColor" fill="none" stroke-width="1" opacity="0.6"/>
      <path d="M34 32 Q36 38 32 36" stroke="currentColor" fill="none" stroke-width="1" opacity="0.6"/>
      <path d="M24 30 L24 38" stroke="currentColor" stroke-width="1" opacity="0.6"/>
    </svg>
  `,

  // 4. Nave Magrathea - Construtor de planetas com anel orbital
  magrathea: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:0.2"/>
          <stop offset="50%" style="stop-color:currentColor;stop-opacity:0.8"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.2"/>
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="24" rx="22" ry="6" fill="none" stroke="url(#ringGrad)" stroke-width="2"/>
      <polygon points="24,6 36,18 34,30 28,38 20,38 14,30 12,18" fill="currentColor" opacity="0.85"/>
      <polygon points="24,10 32,18 30,28 26,34 22,34 18,28 16,18" fill="currentColor" opacity="0.5"/>
      <circle cx="24" cy="20" r="6" fill="currentColor" opacity="0.8"/>
      <circle cx="24" cy="20" r="3" fill="currentColor"/>
      <rect x="21" y="30" width="6" height="6" rx="1" fill="currentColor" opacity="0.6"/>
      <circle cx="18" cy="15" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="30" cy="15" r="2" fill="currentColor" opacity="0.6"/>
      <path d="M20 38 L18 44 L22 42 Z" fill="currentColor" opacity="0.5"/>
      <path d="M28 38 L30 44 L26 42 Z" fill="currentColor" opacity="0.5"/>
    </svg>
  `,

  // 5. Nave Slartibartfast - Designer elegante com geometria complexa
  slartibartfast: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="slartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.6"/>
        </linearGradient>
      </defs>
      <path d="M24 4 L34 12 L38 22 L34 32 L28 40 L20 40 L14 32 L10 22 L14 12 Z" 
            fill="url(#slartGrad)" opacity="0.9"/>
      <path d="M24 8 L30 14 L24 20 L18 14 Z" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.8"/>
      <circle cx="24" cy="24" r="3" fill="currentColor"/>
      <path d="M16 18 L12 16 L14 22" stroke="currentColor" fill="none" stroke-width="1.5" opacity="0.6"/>
      <path d="M32 18 L36 16 L34 22" stroke="currentColor" fill="none" stroke-width="1.5" opacity="0.6"/>
      <ellipse cx="24" cy="34" rx="6" ry="2" fill="currentColor" opacity="0.5"/>
      <path d="M18 36 L16 44 L20 40" fill="currentColor" opacity="0.4"/>
      <path d="M30 36 L32 44 L28 40" fill="currentColor" opacity="0.4"/>
      <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
      <circle cx="28" cy="20" r="1.5" fill="currentColor"/>
    </svg>
  `,

  // 6. Nave Zaphod - Dual-engine com design arrojado
  zaphod: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="engineGlow" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.3"/>
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="24" rx="20" ry="9" fill="currentColor" opacity="0.9"/>
      <ellipse cx="24" cy="22" rx="16" ry="6" fill="currentColor" opacity="0.6"/>
      <circle cx="14" cy="16" r="6" fill="url(#engineGlow)" opacity="0.9"/>
      <circle cx="14" cy="16" r="3" fill="currentColor"/>
      <circle cx="34" cy="16" r="6" fill="url(#engineGlow)" opacity="0.9"/>
      <circle cx="34" cy="16" r="3" fill="currentColor"/>
      <rect x="20" y="28" width="8" height="8" rx="2" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="32" r="2" fill="currentColor" opacity="0.5"/>
      <path d="M14 22 L10 32 L14 30" fill="currentColor" opacity="0.5"/>
      <path d="M34 22 L38 32 L34 30" fill="currentColor" opacity="0.5"/>
      <ellipse cx="24" cy="24" rx="4" ry="2" fill="currentColor"/>
      <path d="M8 18 Q4 14 8 10" stroke="currentColor" fill="none" stroke-width="1" opacity="0.4"/>
      <path d="M40 18 Q44 14 40 10" stroke="currentColor" fill="none" stroke-width="1" opacity="0.4"/>
    </svg>
  `,
};

// Planetas estilizados para o sistema orbital
export const alienPlanets = {
  // Planeta Terra-like com atmosfera
  terra: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="terraGlow" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:1"/>
          <stop offset="70%" style="stop-color:currentColor;stop-opacity:0.7"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.4"/>
        </radialGradient>
        <radialGradient id="atmosphere" cx="50%" cy="50%">
          <stop offset="70%" style="stop-color:currentColor;stop-opacity:0"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.3"/>
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#atmosphere)"/>
      <circle cx="24" cy="24" r="16" fill="url(#terraGlow)"/>
      <ellipse cx="18" cy="20" rx="5" ry="4" fill="currentColor" opacity="0.4"/>
      <ellipse cx="28" cy="26" rx="6" ry="3" fill="currentColor" opacity="0.3"/>
      <ellipse cx="22" cy="30" rx="4" ry="2" fill="currentColor" opacity="0.35"/>
      <circle cx="30" cy="16" r="2" fill="currentColor" opacity="0.5"/>
    </svg>
  `,

  // Planeta gasoso com anéis
  gasGiant: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gasGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:0.9"/>
          <stop offset="30%" style="stop-color:currentColor;stop-opacity:0.7"/>
          <stop offset="70%" style="stop-color:currentColor;stop-opacity:0.8"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.6"/>
        </linearGradient>
        <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:0.1"/>
          <stop offset="50%" style="stop-color:currentColor;stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.1"/>
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="24" rx="23" ry="5" fill="none" stroke="url(#ringGrad2)" stroke-width="3"/>
      <circle cx="24" cy="24" r="14" fill="url(#gasGrad)"/>
      <ellipse cx="24" cy="18" rx="10" ry="1" fill="currentColor" opacity="0.3"/>
      <ellipse cx="24" cy="22" rx="12" ry="1.5" fill="currentColor" opacity="0.25"/>
      <ellipse cx="24" cy="28" rx="11" ry="1" fill="currentColor" opacity="0.35"/>
      <ellipse cx="24" cy="24" rx="22" ry="4" fill="none" stroke="url(#ringGrad2)" stroke-width="2"/>
    </svg>
  `,

  // Lua cratérica
  moon: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="moonGrad" cx="35%" cy="35%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.5"/>
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="14" fill="url(#moonGrad)"/>
      <circle cx="18" cy="20" r="4" fill="currentColor" opacity="0.3"/>
      <circle cx="28" cy="18" r="2.5" fill="currentColor" opacity="0.25"/>
      <circle cx="22" cy="28" r="3" fill="currentColor" opacity="0.35"/>
      <circle cx="30" cy="26" r="2" fill="currentColor" opacity="0.3"/>
      <circle cx="16" cy="26" r="1.5" fill="currentColor" opacity="0.4"/>
      <circle cx="26" cy="22" r="1" fill="currentColor" opacity="0.45"/>
    </svg>
  `,

  // Planeta cristalino
  crystal: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="crystalGrad" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.6"/>
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="14" fill="url(#crystalGrad)"/>
      <polygon points="24,10 28,20 24,24 20,20" fill="currentColor" opacity="0.5"/>
      <polygon points="24,38 28,28 24,24 20,28" fill="currentColor" opacity="0.4"/>
      <polygon points="10,24 20,20 24,24 20,28" fill="currentColor" opacity="0.45"/>
      <polygon points="38,24 28,20 24,24 28,28" fill="currentColor" opacity="0.35"/>
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="24" r="2" fill="currentColor"/>
    </svg>
  `,

  // Planeta vulcânico
  volcanic: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="volcanicGrad" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.5"/>
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="14" fill="url(#volcanicGrad)"/>
      <path d="M18 16 Q20 12 22 16 L20 22 Z" fill="currentColor" opacity="0.7"/>
      <path d="M28 20 Q30 16 32 20 L30 26 Z" fill="currentColor" opacity="0.65"/>
      <path d="M22 28 Q24 24 26 28 L24 34 Z" fill="currentColor" opacity="0.6"/>
      <circle cx="16" cy="26" r="2" fill="currentColor" opacity="0.8"/>
      <circle cx="30" cy="16" r="1.5" fill="currentColor" opacity="0.75"/>
      <ellipse cx="24" cy="24" rx="8" ry="3" fill="currentColor" opacity="0.2"/>
    </svg>
  `,

  // Planeta oceânico
  oceanic: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="oceanGrad" cx="40%" cy="40%">
          <stop offset="0%" style="stop-color:currentColor;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.6"/>
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="14" fill="url(#oceanGrad)"/>
      <path d="M12 22 Q16 18 20 22 Q24 26 28 22 Q32 18 36 22" stroke="currentColor" fill="none" stroke-width="1.5" opacity="0.4"/>
      <path d="M14 28 Q18 24 22 28 Q26 32 30 28 Q34 24 38 28" stroke="currentColor" fill="none" stroke-width="1.5" opacity="0.35"/>
      <ellipse cx="20" cy="18" rx="3" ry="2" fill="currentColor" opacity="0.3"/>
      <ellipse cx="30" cy="30" rx="2" ry="1.5" fill="currentColor" opacity="0.25"/>
      <circle cx="26" cy="20" r="1" fill="currentColor" opacity="0.5"/>
    </svg>
  `,
};

export const shipNames = Object.keys(alienShips) as Array<keyof typeof alienShips>;
export const planetNames = Object.keys(alienPlanets) as Array<keyof typeof alienPlanets>;
