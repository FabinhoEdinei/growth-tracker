import { ParticleData, ShapeType, Zone } from './types';

export const cyberpunkHues = [180, 280, 320, 140, 200, 300];

export const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'hexagon', 'diamond', 'star'];

// Cores por zona
export const zoneColors: Record<Zone, number[]> = {
  alpha: [320, 340, 0], // Magenta/Vermelho
  beta: [140, 160, 180], // Verde/Cyan
  gamma: [35, 45, 280], // Laranja/Roxo
};

export const generateParticleData = (): ParticleData => {
  const id = `PTL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const code = `${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
  
  return {
    id,
    code,
    references: {
      alpha: `REF-A-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      beta: `REF-B-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      gamma: `REF-G-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    },
    content: {
      title: `Partícula ${id.slice(-4)}`,
      description: `Sistema de rastreamento neural ${code}`,
      metadata: `Classe: ${['ALPHA', 'BETA', 'GAMMA', 'DELTA'][Math.floor(Math.random() * 4)]}`,
    },
  };
};

// Determina em qual zona a partícula está baseado na posição X
export const getZoneFromPosition = (x: number, width: number): Zone => {
  const thirdWidth = width / 3;
  if (x < thirdWidth) return 'alpha';
  if (x < thirdWidth * 2) return 'beta';
  return 'gamma';
};

// Determina zona do clique
export const getZoneFromClick = (x: number, canvas: HTMLCanvasElement): Zone => {
  return getZoneFromPosition(x, canvas.width);
};