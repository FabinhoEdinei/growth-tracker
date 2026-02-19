---
title: "Hexágonos Orbitais: O Sistema Paralelo"
slug: "hexagonos-orbitais"
date: "2026-02-21"
author: "Growth Team"
category: "Features"
excerpt: "Como criamos um segundo sistema completamente isolado com órbita elíptica invisível ao redor do header."
---

# Hexágonos Orbitais: O Sistema Paralelo

## Dois Mundos, Um Canvas

Growth Tracker não tem apenas **um** sistema de partículas.

Tem **dois sistemas completamente isolados**:

1. **Partículas normais** — movimento livre em 4 direções
2. **Hexágonos orbitais** — órbita elíptica fixa ao redor do header

E eles **nunca se tocam**.

---

## A Rota Invisível

Enquanto partículas normais se movem livremente, hexágonos seguem uma **elipse matemática**:

```typescript
x = cx + radius × cos(angle)
y = cy + radius × tilt × sin(angle)

tilt = 0.35  // elipse achatada
radius = 160px + variação
Você não vê a rota. Mas ela existe.
A cada frame, o ângulo avança:
angle += 0.006 rad/frame  // movimento lento e suave
Por Que Separar?
Partículas Normais
Hexágonos Orbitais
Dados temporários
Dados fixos persistentes
Trajetória caótica
Trajetória previsível
20-50 instâncias
4-6 instâncias
Colisões entre si
Sem colisões
Trail longo
Sem trail
Propósitos diferentes = sistemas diferentes.
4 Tipos de Dados Orbitais
Cada hexágono carrega um tipo específico:
◈ Agenda — magenta (#ff0066) — tarefas e compromissos
◆ Finanças — laranja (#ffaa00) — valores e investimentos
✦ Saúde — verde (#00ff88) — metas físicas e bem-estar
★ Meta — roxo (#cc00ff) — objetivos de longo prazo
Interação
Clique em um hexágono → card de informação aparece
Você pode:
Ver detalhes do dado
Marcar como "feito" (agenda/saúde/meta)
Ver valor monetário (finanças)
Ver prioridade (alta/média/baixa)
Velocidades Angulares Diferentes
Cada tipo tem velocidade orbital própria:
const speedOffset = {
  agenda:   0,              // velocidade base
  financas: +0.0015,        // 25% mais rápido
  saude:   -0.0009,         // 15% mais lento
  meta:     +0.003,         // 50% mais rápido
}
Resultado: Os hexágonos se reagrupam e se afastam naturalmente, como planetas em órbitas distintas. 🪐
Renderização Multi-Camada
Cada hexágono orbital é desenhado em 4 camadas:
Halo exterior (glow blur 30px) - 25% opacity
Borda hexagonal (stroke width 1.5px) - cor do tipo
Núcleo preenchido (fill 50% do tamanho) - 25% opacity
Ícone central (◈ ◆ ✦ ★) - 70-95% opacity
Efeito de Destaque
Ao passar o mouse ou clicar:
Opacity sobe para 90%
Stroke width: 1.5px → 2px
Shadow blur: 12px → 20px
highlighted = true
Isolamento Arquitetural
O sistema orbital é 100% independente:
orbitalTypes.ts      ← Tipos exclusivos
orbitalEngine.ts     ← Física orbital
orbitalRenderer.ts   ← Renderização hexágonos
OrbitalSystem.ts     ← Gerenciador (singleton)
OrbitalInfoCard.tsx  ← UI do card
Zero importações de arquivos das partículas normais (exceto HeaderBounds de types.ts).
Isso permite:
✅ Desenvolver independentemente
✅ Testar isoladamente
✅ Modificar sem quebrar partículas normais
✅ Desligar um sistema sem afetar o outro
O Futuro dos Orbitais
FASE 1 (Atual)
✅ Órbita fixa ao redor do header
✅ 4 tipos de dados
✅ Click para ver detalhes
FASE 2 (Próximo)
⬜ Drag & drop para reordenar
⬜ Adicionar novos hexágonos em runtime
⬜ Sincronização com banco de dados
FASE 3 (Futuro)
⬜ Múltiplas órbitas (camadas concêntricas)
⬜ Órbitas elípticas variáveis
⬜ Gravidade entre hexágonos (clustering)
Dados que Orbitam
Growth Tracker transformou uma metáfora em realidade:
"Seus dados orbitam você"
Não é apenas visual. É funcional.
Não é apenas estética. É arquitetura.
Hexágonos orbitais são dados vivos girando ao seu redor, sempre visíveis, sempre acessíveis, sempre em movimento.
Como satélites digitais da sua vida. 🛰️
Publicado em 21 de fevereiro de 2026
Escrito por Growth Team
Categoria: Features