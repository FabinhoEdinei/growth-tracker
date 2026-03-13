// orbitalTypes.ts
// Tipos exclusivos do sistema orbital hexagonal
// MÓDULO ISOLADO — não interfere com partículas normais

// ── Tipos de dados orbitais ──────────────────────────────────────────────────
export type OrbitalDataType =
  | 'agenda'
  | 'financas'
  | 'saude'
  | 'meta'
  | 'etf'      // Pentáculos — cota ETF gerada
  | 'blog'     // Post publicado no Blog
  | 'tv'       // Episódio / relatório da TV Empresarial
  | 'jornal';  // Edição do Jornal

// ── Payload base ─────────────────────────────────────────────────────────────
export interface OrbitalPayload {
  type: OrbitalDataType;
  label: string;
  value?:    number;
  done?:     boolean;
  priority?: 1 | 2 | 3;
  dueAt?:    number;
  note?:     string;

  // ── Campos exclusivos dos novos tipos ─────────────────────────────────────

  /** etf — código completo GT-XXXX-XXXX-XXXX-XX */
  codigoETF?: string;
  /** etf — valor total em R$ (sempre 3600) */
  valorETF?:  number;
  /** etf — status da cota */
  statusETF?: 'disponivel' | 'vendida';

  /** blog / jornal / tv — slug para navegação */
  slug?:      string;
  /** blog / jornal / tv — categoria do conteúdo */
  category?:  string;
  /** blog / jornal / tv — data de publicação ISO */
  pubDate?:   string;
  /** tv — número do episódio ou relatório */
  episode?:   number;
}

// ── Partícula orbital ─────────────────────────────────────────────────────────
export interface OrbitalParticle {
  id: string;

  // Posição orbital
  angle:        number;
  angularSpeed: number;   // rad/frame — fixo

  // Órbita
  orbitRadius:  number;
  orbitTilt:    number;   // inclinação elíptica (0 = círculo)

  // Posição canvas
  x: number;
  y: number;

  // Visual hexagonal
  size:          number;
  rotation:      number;
  rotationSpeed: number;
  hue:           number;
  pulsePhase:    number;

  // Dados
  payload: OrbitalPayload;

  // Estado
  highlighted: boolean;
}

// ── Paleta de cores por tipo ──────────────────────────────────────────────────
export const ORBITAL_COLORS: Record<OrbitalDataType, {
  hue:     number;
  primary: string;
  glow:    string;
}> = {
  // Tipos originais
  agenda:   { hue: 340, primary: '#ff0066', glow: 'rgba(255,0,102,0.6)'    },
  financas: { hue:  45, primary: '#ffaa00', glow: 'rgba(255,170,0,0.6)'    },
  saude:    { hue: 140, primary: '#00ff88', glow: 'rgba(0,255,136,0.6)'    },
  meta:     { hue: 280, primary: '#cc00ff', glow: 'rgba(204,0,255,0.6)'    },

  // Novos tipos
  etf:      { hue:  45, primary: '#ffd700', glow: 'rgba(255,215,0,0.7)'    }, // ouro — cota valiosa
  blog:     { hue: 190, primary: '#00d4ff', glow: 'rgba(0,212,255,0.6)'    }, // ciano — conhecimento
  tv:       { hue: 260, primary: '#a855f7', glow: 'rgba(168,85,247,0.65)'  }, // roxo — broadcast
  jornal:   { hue:  20, primary: '#ff8c42', glow: 'rgba(255,140,66,0.6)'   }, // âmbar — impressão
};

// ── Rótulos legíveis por tipo ─────────────────────────────────────────────────
export const ORBITAL_TYPE_LABEL: Record<OrbitalDataType, string> = {
  agenda:   'Agenda',
  financas: 'Finanças',
  saude:    'Saúde',
  meta:     'Meta',
  etf:      'Token ETF',
  blog:     'Blog',
  tv:       'TV',
  jornal:   'Jornal',
};

// ── Ícones por tipo ───────────────────────────────────────────────────────────
export const ORBITAL_TYPE_ICON: Record<OrbitalDataType, string> = {
  agenda:   '📅',
  financas: '💰',
  saude:    '💚',
  meta:     '🎯',
  etf:      '🔮',
  blog:     '📝',
  tv:       '📺',
  jornal:   '📰',
};
