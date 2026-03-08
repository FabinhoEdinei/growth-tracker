#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 Gerando ícones PWA para Growth Tracker...${NC}\n"

# Criar diretório de ícones
mkdir -p public/icons

# Tamanhos necessários
sizes=(72 96 128 144 152 192 384 512)

echo -e "${GREEN}📦 Gerando ícones em múltiplos tamanhos...${NC}"

for size in "${sizes[@]}"
do
  echo "  → ${size}x${size}px"
  
  # Converter SVG para PNG usando ImageMagick ou Inkscape
  # Escolha um dos comandos abaixo:
  
  # Opção 1: ImageMagick (se instalado)
  convert -background none -resize ${size}x${size} public/icon-base.svg public/icons/icon-${size}x${size}.png
  
  # Opção 2: Inkscape (se instalado)
  # inkscape -w ${size} -h ${size} public/icon-base.svg -o public/icons/icon-${size}x${size}.png
done

# Criar favicon ICO
echo -e "\n${GREEN}🎯 Gerando favicon.ico...${NC}"
convert public/icons/icon-192x192.png -define icon:auto-resize=64,48,32,16 public/favicon.ico

# Criar apple-touch-icon
echo -e "${GREEN}🍎 Gerando apple-touch-icon...${NC}"
cp public/icons/icon-192x192.png public/apple-touch-icon.png

echo -e "\n${BLUE}✅ Ícones gerados com sucesso!${NC}"
echo -e "${GREEN}📁 Arquivos criados em public/icons/${NC}\n"