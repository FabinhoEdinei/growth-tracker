import { ShapeType } from './types';
import { alienShips, alienPlanets } from './alienShips';

const shipCache = new Map<string, HTMLImageElement>();

function svgToDataURL(svg: string, color: string): string {
  const coloredSVG = svg.replace(/currentColor/g, color);
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(coloredSVG)));
}

// Determina se deve renderizar como planeta baseado na forma
const isPlanetShape = (shape: ShapeType): boolean => {
  return shape === 'circle' || shape === 'hexagon';
};

// Mapear formas antigas para naves
const shapeToShip: Record<ShapeType, keyof typeof alienShips> = {
  circle: 'heartOfGold',
  square: 'vogon',
  triangle: 'babelFish',
  hexagon: 'magrathea',
  diamond: 'slartibartfast',
  star: 'zaphod',
};

// Mapear formas para planetas (alternativo visual)
const shapeToPlanet: Partial<Record<ShapeType, keyof typeof alienPlanets>> = {
  circle: 'terra',
  hexagon: 'gasGiant',
};

export const drawShape = (
  ctx: CanvasRenderingContext2D,
  shape: ShapeType,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string,
  usePlanet = false // Nova opção para alternar entre nave e planeta
): void => {
  ctx.save();
  ctx.translate(x, y);
  
  // Aumentar tamanho em 15% para melhor visibilidade
  const adjustedSize = size * 1.15;

  let svgContent: string;
  let cacheKey: string;

  // Decidir se usa nave ou planeta
  if (usePlanet && shapeToPlanet[shape]) {
    const planetName = shapeToPlanet[shape]!;
    svgContent = alienPlanets[planetName];
    cacheKey = `planet-${planetName}-${color}`;
    // Planetas rotacionam mais devagar
    ctx.rotate(rotation * 0.2);
  } else {
    const shipName = shapeToShip[shape];
    svgContent = alienShips[shipName];
    cacheKey = `ship-${shipName}-${color}`;
    ctx.rotate(rotation);
  }

  // Renderizar SVG
  if (!shipCache.has(cacheKey)) {
    const img = new Image();
    img.src = svgToDataURL(svgContent, color);
    shipCache.set(cacheKey, img);
  }

  const img = shipCache.get(cacheKey);
  if (img && img.complete) {
    // Adicionar glow sutil
    ctx.shadowBlur = 12;
    ctx.shadowColor = color;
    ctx.globalAlpha = 0.95;
    
    ctx.drawImage(
      img,
      -adjustedSize,
      -adjustedSize,
      adjustedSize * 2,
      adjustedSize * 2
    );
  } else {
    // Fallback melhorado enquanto carrega
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    
    if (usePlanet) {
      // Círculo para planeta
      ctx.arc(0, 0, adjustedSize * 0.8, 0, Math.PI * 2);
    } else {
      // Forma angular para nave
      ctx.moveTo(0, -adjustedSize);
      ctx.lineTo(adjustedSize * 0.7, adjustedSize * 0.5);
      ctx.lineTo(-adjustedSize * 0.7, adjustedSize * 0.5);
      ctx.closePath();
    }
    ctx.fill();
  }

  ctx.restore();
};

// Função auxiliar para desenhar com efeito de rastro
export const drawShapeWithTrail = (
  ctx: CanvasRenderingContext2D,
  shape: ShapeType,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string,
  velocityX: number,
  velocityY: number
): void => {
  // Desenhar rastro de movimento
  const trailLength = 5;
  const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
  
  if (speed > 0.3) {
    ctx.save();
    for (let i = trailLength; i > 0; i--) {
      const trailX = x - velocityX * i * 3;
      const trailY = y - velocityY * i * 3;
      const trailAlpha = (1 - i / trailLength) * 0.2;
      const trailSize = size * (1 - i / trailLength * 0.3);
      
      ctx.globalAlpha = trailAlpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(trailX, trailY, trailSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  
  // Desenhar forma principal
  drawShape(ctx, shape, x, y, size, rotation, color);
};
