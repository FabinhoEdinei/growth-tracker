import { ShapeType } from './types';
import { alienShips, shipNames } from './alienShips';

const shipCache = new Map<string, HTMLImageElement>();

function svgToDataURL(svg: string, color: string): string {
  const coloredSVG = svg.replace(/currentColor/g, color);
  return 'data:image/svg+xml;base64,' + btoa(coloredSVG);
}

export const drawShape = (
  ctx: CanvasRenderingContext2D,
  shape: ShapeType,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string
): void => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Aumentar tamanho em 5%
  const adjustedSize = size * 1.05;

  // Mapear formas antigas para naves
  const shapeToShip: Record<ShapeType, keyof typeof alienShips> = {
    circle: 'heartOfGold',
    square: 'vogon',
    triangle: 'babelFish',
    hexagon: 'magrathea',
    diamond: 'slartibartfast',
    star: 'zaphod',
  };

  const shipName = shapeToShip[shape];
  const cacheKey = `${shipName}-${color}`;

  // Renderizar SVG
  if (!shipCache.has(cacheKey)) {
    const img = new Image();
    img.src = svgToDataURL(alienShips[shipName], color);
    shipCache.set(cacheKey, img);
  }

  const img = shipCache.get(cacheKey);
  if (img && img.complete) {
    ctx.drawImage(
      img,
      -adjustedSize,
      -adjustedSize,
      adjustedSize * 2,
      adjustedSize * 2
    );
  } else {
    // Fallback enquanto carrega
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, adjustedSize, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};