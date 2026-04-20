---
title: "Relógio Astronômico: Implementação Completa do Zytglogge Digital"
slug: "relogio-astronomico-zytlogge-digital"
date: "2026-04-20"
author: "Fabio Edinei"
category: "Desenvolvimento"
tags:
  - relógio
  - astronômico
  - zytglogge
  - 3d
  - react
  - svg
  - nextjs
---

# 🕰️ Relógio Astronômico: Zytglogge Digital
### Implementação completa de um relógio astronômico inspirado no famoso Zytglogge de Berna

> **Projeto:** Growth Tracker  
> **Módulo:** `app/components/astronomical/`  
> **Stack:** React · TypeScript · SVG · Next.js  
> **Data de criação:** Abril de 2026  
> **Autor:** Fabio Edinei  

---

## Visão Geral

O Relógio Astronômico é uma recriação digital fiel do **Zytglogge**, o famoso relógio medieval de Berna, Suíça. Implementado como componente React reutilizável, ele combina cálculos astronômicos precisos com uma estética 3D profunda, funcionando tanto como background decorativo quanto como elemento interativo.

### 🎯 Objetivos Alcançados

- ✅ **Precisão astronômica**: Cálculos de fases lunares, signos zodiacais e ângulos horários
- ✅ **Fidelidade visual**: Cores e detalhes inspirados no relógio original
- ✅ **Animação em tempo real**: Ponteiros se movendo suavemente
- ✅ **Efeito 3D**: Profundidade com sombras, gradientes e filtros SVG
- ✅ **Responsividade**: Adapta-se a diferentes tamanhos e posições
- ✅ **Integração**: Funciona como background no leitor de mangá

---

## Arquitetura do Sistema

### 1. Estrutura de Arquivos

```
app/components/astronomical/
├── AstronomicalClockBackground.tsx    ← Componente principal
├── AstronomicalComponents.tsx          ← Componentes auxiliares
├── AstronomicalUtils.ts                ← Funções de cálculo
├── useAstronomicalClock.ts            ← Hook de estado
└── types.ts                           ← Tipos TypeScript
```

### 2. Componentes Principais

#### AstronomicalClockBackground
O componente principal que renderiza o relógio SVG completo.

```tsx
interface AstronomicalClockBackgroundProps {
  size?: 'sm' | 'md' | 'lg' | 'full'
  opacity?: number
  position?: 'center' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  clockState?: { hour: number; minute: number; second: number }
  showZodiac?: boolean
  blur?: boolean
}
```

#### useAstronomicalClock
Hook personalizado para gerenciar estado e atualizações automáticas.

```tsx
const { clockState, detailedInfo } = useAstronomicalClock({
  autoUpdate: true,
  updateInterval: 1000
})
```

---

## Implementação Técnica

### 1. Cálculos Astronômicos

#### Ângulos dos Ponteiros
```tsx
export function calculateClockAngles(date: Date): ClockAngles {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return {
    hour: (hour % 12) * 30 + minute * 0.5 + second * 0.00833,
    minute: minute * 6 + second * 0.1,
    second: second * 6,
  }
}
```

#### Fases Lunares
```tsx
export function calculateMoonPhaseIndex(date: Date): number {
  const lunarCycle = 29.5306 // dias
  const epoch = new Date(2000, 0, 6, 18, 14, 0).getTime()
  const timeSinceEpoch = (date.getTime() - epoch) / (1000 * 86400)
  return Math.floor((timeSinceEpoch % lunarCycle) / lunarCycle * 8) % 8
}
```

### 2. Renderização SVG com Efeitos 3D

#### Gradientes e Sombras
```tsx
<defs>
  <radialGradient id="clockMainGradient" cx="40%" cy="40%">
    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
    <stop offset="50%" stopColor="#B8860B" stopOpacity="0.3" />
    <stop offset="100%" stopColor="#8B4513" stopOpacity="0.2" />
  </radialGradient>

  <filter id="shadow">
    <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.4" />
  </filter>

  <filter id="depth">
    <feGaussianBlur stdDeviation="2" />
    <feOffset dx="2" dy="2" />
  </filter>
</defs>
```

#### Ponteiros com Profundidade
```tsx
<g transform={`rotate(${hourAngle} 100 100)`}>
  <line
    x1="100" y1="100" x2="118" y2="100"
    stroke="#B8860B"
    strokeWidth="4"
    strokeLinecap="round"
    filter="url(#shadow)"
  />
  {/* Sombra para profundidade */}
  <line
    x1="100" y1="100" x2="118" y2="100"
    stroke="#1A1A1A"
    strokeWidth="4"
    strokeLinecap="round"
    opacity="0.3"
    transform="translate(1,1)"
  />
</g>
```

---

## Ajustes para Fidelidade ao Zytglogge

### 1. Paleta de Cores Autêntica

```tsx
const CLOCK_COLORS = {
  gold: '#E8B923',        // Ouro real brilhante
  darkGold: '#B8860B',    // Ouro escuro
  darkRed: '#8B4513',     // Vermelho-marrom do painel
  cobaltBlue: '#003A8F',  // Azul cobalto do zodíaco
  stoneGray: '#708090',   // Cinza pedra
}
```

### 2. Detalhes Arquitetônicos

- **Anel zodiacal**: Azul cobalto com símbolos dourados
- **Números romanos**: Fonte serifada com sombreamento
- **Marcadores**: Espessura variável (principais mais grossos)
- **Centro ornamental**: Diamante central com brilho

### 3. Ajuste da Hora do Usuário

Por padrão, o relógio usa a hora local do navegador:

```tsx
const currentTime = new Date() // Hora do usuário
const { hour, minute, second } = getCurrentAstronomicalState(currentTime)
```

Para forçar uma hora específica:

```tsx
const customTime = new Date()
customTime.setHours(14, 30, 45) // 14:30:45

<AstronomicalClockBackground
  clockState={{
    hour: customTime.getHours(),
    minute: customTime.getMinutes(),
    second: customTime.getSeconds()
  }}
/>
```

---

## Efeitos 3D e Profundidade

### 1. Filtros SVG para Profundidade

```tsx
<filter id="texture">
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" />
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
</filter>

<filter id="emboss">
  <feConvolveMatrix
    kernelMatrix="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0 0 -1"
    divisor="1"
    bias="0"
    order="3"
  />
</filter>
```

### 2. Camadas de Sombras

```tsx
{/* Base do ponteiro */}
<line ... stroke="#B8860B" strokeWidth="4" />

{/* Sombra projetada */}
<line ... stroke="#000" strokeWidth="4" opacity="0.2" transform="translate(2,2)" />

{/* Brilho superior */}
<line ... stroke="#FFD700" strokeWidth="2" opacity="0.6" />
```

### 3. Gradientes Radiais para Volume

```tsx
<radialGradient id="sphereGradient" cx="30%" cy="30%">
  <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
  <stop offset="70%" stopColor="#B8860B" />
  <stop offset="100%" stopColor="#000" />
</radialGradient>
```

---

## Integração no Projeto

### Uso como Background no Manga Reader

```tsx
// app/manga/page.tsx
{cap.id === 'cap-04' && (
  <AstronomicalBackground
    size="full"
    opacity={0.3}
    position="center"
    clockState={clockState}
    showZodiac={true}
  />
)}
```

### Hook de Estado Global

```tsx
// Contexto global para sincronização
const { clockState } = useAstronomicalClock({
  autoUpdate: true,
  updateInterval: 1000
})
```

---

## Otimizações de Performance

### 1. Memoização de Cálculos

```tsx
const angles = useMemo(
  () => calculateClockAngles(date),
  [date]
)
```

### 2. Atualização Condicional

```tsx
const { clockState } = useAstronomicalClock({
  autoUpdate: !props.clockState, // Desabilita se estado externo
})
```

### 3. Renderização Eficiente

- SVG inline para evitar requests externos
- Filtros compartilhados no `<defs>`
- Componente puro sem side-effects

---

## Próximos Passos

### Melhorias Planejadas

- [ ] **Animação de cuco**: Movimento periódico dos bonecos
- [ ] **Sons autênticos**: Badaladas horárias
- [ ] **Interatividade**: Click para pausar/retomar
- [ ] **Modo noturno**: Ajuste automático de cores
- [ ] **Localização**: Fusos horários e idiomas

### Expansão do Sistema

- **Múltiplos relógios**: Sincronização entre instâncias
- **Temas personalizáveis**: Paletas alternativas
- **Integração com calendário**: Eventos astronômicos

---

## Conclusão

O Relógio Astronômico representa uma fusão perfeita entre precisão técnica e beleza estética, recriando digitalmente uma obra-prima da relojoaria medieval. Sua implementação modular e otimizada garante versatilidade para diversos contextos, desde backgrounds decorativos até interfaces interativas.

A combinação de cálculos astronômicos precisos com efeitos 3D avançados cria uma experiência imersiva que honra a tradição do Zytglogge enquanto abraça as possibilidades do desenvolvimento web moderno.

---

*Publicado em 20 de abril de 2026 por Fabio Edinei*</content>
<parameter name="filePath">/workspaces/growth-tracker/app/content/posts/035-relogio-astronomico-zytlogge.md