import { ShapeType } from './types';

export const drawShape = (
  ctx: CanvasRenderingContext2D,
  shape: ShapeType,
  x: number,
  y: number,
  size: number,
  rotation: number
): void => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  switch (shape) {
    case 'circle':
      drawCircle(ctx, size);
      break;
    case 'square':
      drawSquare(ctx, size);
      break;
    case 'triangle':
      drawTriangle(ctx, size);
      break;
    case 'hexagon':
      drawHexagon(ctx, size);
      break;
    case 'diamond':
      drawDiamond(ctx, size);
      break;
    case 'star':
      drawStar(ctx, size);
      break;
  }

  ctx.restore();
};

const drawCircle = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
};

const drawSquare = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.fillRect(-size, -size, size * 2, size * 2);
};

const drawTriangle = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size, size);
  ctx.lineTo(-size, size);
  ctx.closePath();
  ctx.fill();
};

const drawHexagon = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = Math.cos(angle) * size;
    const py = Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
};

const drawDiamond = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.6, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.6, 0);
  ctx.closePath();
  ctx.fill();
};

const drawStar = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    const x1 = Math.cos(angle) * outerRadius;
    const y1 = Math.sin(angle) * outerRadius;
    const x2 = Math.cos(angle + Math.PI / 5) * innerRadius;
    const y2 = Math.sin(angle + Math.PI / 5) * innerRadius;
    
    if (i === 0) ctx.moveTo(x1, y1);
    else ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  ctx.fill();
};