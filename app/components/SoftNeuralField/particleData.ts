// particleData.ts
// Cada partícula carrega um DNA de dados vivo

export type DataType = 'agenda' | 'financas' | 'saude' | 'meta' | 'vazio';

export interface ParticlePayload {
  type: DataType;
  id: string;
  createdAt: number;
  value?: number;        // Para finanças/saúde
  label?: string;        // Para agenda/meta
  dueAt?: number;        // Timestamp de vencimento
  done?: boolean;
  priority?: 1 | 2 | 3; // 1=alta 2=media 3=baixa
  tags?: string[];
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;   // timestamp
  vx: number;
  vy: number;
}

export interface ParticleMemory {
  payload: ParticlePayload;
  trajectory: TrajectoryPoint[];  // Mapa de trajetória
  age: number;                    // Frames de vida
  distanceTraveled: number;       // Distância total
  zonesVisited: Set<string>;      // Zonas que passou
  collisions: number;             // Quantas colisões teve
  energy: number;                 // Energia cinética acumulada
}

// Cria memória inicial de uma partícula
export const createParticleMemory = (
  type: DataType = 'vazio',
  payload?: Partial<ParticlePayload>
): ParticleMemory => ({
  payload: {
    type,
    id: `PTL-${Date.now().toString(36).toUpperCase()}`,
    createdAt: Date.now(),
    ...payload,
  },
  trajectory: [],
  age: 0,
  distanceTraveled: 0,
  zonesVisited: new Set(),
  collisions: 0,
  energy: 0,
});
