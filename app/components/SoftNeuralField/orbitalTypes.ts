// orbitalTypes.ts
// Tipos exclusivos do sistema orbital hexagonal
// MÓDULO ISOLADO — não interfere com partículas normais

export type OrbitalDataType = 'agenda' | 'financas' | 'saude' | 'meta';

export interface OrbitalPayload {
  type: OrbitalDataType;
  label: string;
  value?: number;
  done?: boolean;
  priority?: 1 | 2 | 3;
  dueAt?: number;
  note?: string;
}

export interface OrbitalParticle {
  id: string;

  // Posição orbital (ângulo em radianos na órbita)
  angle: number;
  angularSpeed: number;   // rad/frame — fixo, não muda

  // Raio da órbita (distância do centro do header)
  orbitRadius: number;
  orbitTilt: number;      // Inclinação elíptica (0 = círculo)

  // Posição calculada no canvas
  x: number;
  y: number;

  // Visual hexagonal
  size: number;
  rotation: number;
  rotationSpeed: number;
  hue: number;
  pulsePhase: number;     // Para animação de pulso independente

  // Dados fixos que carrega
  payload: OrbitalPayload;

  // Estado
  highlighted: boolean;   // Ativado ao hover/click
}

// Cores por tipo de dado
export const ORBITAL_COLORS: Record<OrbitalDataType, {
  hue: number;
  primary: string;
  glow: string;
}> = {
  agenda:   { hue: 340, primary: '#ff0066', glow: 'rgba(255,0,102,0.6)'   },
  financas: { hue:  45, primary: '#ffaa00', glow: 'rgba(255,170,0,0.6)'   },
  saude:    { hue: 140, primary: '#00ff88', glow: 'rgba(0,255,136,0.6)'   },
  meta:     { hue: 280, primary: '#cc00ff', glow: 'rgba(204,0,255,0.6)'   },
};
