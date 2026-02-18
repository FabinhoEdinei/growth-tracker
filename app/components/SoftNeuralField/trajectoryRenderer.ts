// trajectoryRenderer.ts
// Renderiza o mapa de trajetória e dados da partícula no canvas

import { ParticleMemory } from './particleData';
import { getProsperityScore, predictNextPosition } from './trajectoryMath';

const TYPE_COLORS: Record<string, string> = {
  agenda:   '#ff0066',
  financas: '#ffaa00',
  saude:    '#00ff88',
  meta:     '#ff00ff',
  vazio:    '#00ffff',
};

// Desenha trilha de trajetória colorida por tipo
export const drawTrajectoryMap = (
  ctx: CanvasRenderingContext2D,
  memory: ParticleMemory
): void => {
  const { trajectory, payload } = memory;
  if (trajectory.length < 2) return;

  const color = TYPE_COLORS[payload.type] || '#00ffff';
  const score = getProsperityScore(memory);
  const alpha = 0.08 + (score / 100) * 0.15; // Trilha mais viva = mais próspera

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = alpha;
  ctx.shadowBlur = 6;
  ctx.shadowColor = color;
  ctx.setLineDash([2, 4]);

  ctx.beginPath();
  trajectory.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
};

// Desenha previsão de próxima posição
export const drawPrediction = (
  ctx: CanvasRenderingContext2D,
  memory: ParticleMemory
): void => {
  const predicted = predictNextPosition(memory.trajectory);
  if (!predicted) return;

  const last = memory.trajectory[memory.trajectory.length - 1];
  const color = TYPE_COLORS[memory.payload.type] || '#00ffff';

  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 6]);
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.lineTo(predicted.x, predicted.y);
  ctx.stroke();

  // Ponto de destino previsto
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = color;
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(predicted.x, predicted.y, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.setLineDash([]);
  ctx.restore();
};

// Desenha ícone de tipo sobre a partícula
export const drawDataBadge = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  memory: ParticleMemory,
  size: number
): void => {
  if (memory.payload.type === 'vazio') return;

  const color = TYPE_COLORS[memory.payload.type];
  const icons: Record<string, string> = {
    agenda:   '◈',
    financas: '◆',
    saude:    '✦',
    meta:     '★',
  };
  const icon = icons[memory.payload.type] || '';

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = color;
  ctx.font = `${size + 4}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.fillText(icon, x, y - size - 2);
  ctx.restore();
};

// Score de prosperidade como mini barra
export const drawProsperityBar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  memory: ParticleMemory,
  size: number
): void => {
  const score = getProsperityScore(memory);
  if (score < 10) return;

  const barW = size * 2.5;
  const barH = 2;
  const bx = x - barW / 2;
  const by = y + size + 3;

  ctx.save();
  // Fundo
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bx, by, barW, barH);

  // Preenchimento
  const color = TYPE_COLORS[memory.payload.type] || '#00ffff';
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = color;
  ctx.shadowBlur = 4;
  ctx.shadowColor = color;
  ctx.fillRect(bx, by, barW * (score / 100), barH);
  ctx.restore();
};
