export type ShapeType = 'circle' | 'square' | 'triangle' | 'hexagon' | 'diamond' | 'star';
export type Zone = 'alpha' | 'beta' | 'gamma';
export type ParticleState = 'normal' | 'disintegrating' | 'shadow' | 'attracted';

export interface ParticleData {
  id: string;
  code: string;
  references: {
    alpha: string;
    beta: string;
    gamma: string;
  };
  content: {
    title: string;
    description: string;
    metadata: string;
  };
}

export interface ShadowParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
}

export interface Lightning {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  points: Array<{ x: number; y: number }>;
  alpha: number;
  life: number;
}

export interface HeaderBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
  shape: ShapeType;
  rotation: number;
  rotationSpeed: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
  glitchOffset: number;
  mass: number;
  data: ParticleData;
  currentZone: Zone;
  state: ParticleState;
  disintegrationTimer: number;
  shadowParticles: ShadowParticle[];
  originalVelocity: { vx: number; vy: number };
  attractionForce: { x: number; y: number };
}

export interface ModalInfo {
  visible: boolean;
  x: number;
  y: number;
  data: ParticleData | null;
  zone: Zone;
}

export interface AgendaState {
  visible: boolean;
  x: number;
  y: number;
}