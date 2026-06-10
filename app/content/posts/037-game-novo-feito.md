---
title: "Upgrade do Growth-tracker o game"
slug: "upgrade-game-menu-"
date: "2026-06-10"
author: "Fabio Edinei"
category: "Desenvolvimento"
excerpt: "Documentacao completa das melhorias visuais implementadas no sistema do game do Growth Tracker, incluindo no app."
---

# 🛠️ LinguaTrioGame — Como Foi Feito

> Documentação técnica do jogo de memória trilíngue integrado ao Growth Tracker.

---

## Visão Geral

O **LinguaTrioGame** é um jogo de cartas de memória onde o jogador precisa encontrar **trios** de cartas — a mesma palavra nos três idiomas (PT, ES, EN) — dentro de um limite de tempo. O jogo foi construído como um único arquivo React/TypeScript (`app/game/page.tsx`) com estética cyberpunk/neon, sem dependências externas além do próprio React.

---

## Stack Utilizada

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilização | Inline styles + CSS-in-JS via `<style>` tag |
| Animações | CSS Keyframes + CSS Transitions |
| Efeito 3D | CSS `transform-style: preserve-3d` + `backfaceVisibility` |
| Estado | React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`) |
| Deploy | Vercel |

---

## Arquitetura do Arquivo

O jogo inteiro vive em `app/game/page.tsx` e é dividido em cinco blocos principais:

```
CARD_DB          → banco de dados das 30 palavras (emoji + PT + ES + EN)
LEVELS           → configuração dos 5 níveis de dificuldade
utils            → shuffle<T>() e buildDeck()
Card3D           → componente de carta com flip 3D e tilt por mouse
LevelSelect      → tela de seleção de nível
GameScreen       → tela principal do jogo (timer, deck, lógica)
ResultScreen     → tela de vitória/derrota
LinguaTrioGame   → componente raiz (máquina de estados de telas)
```

---

## Banco de Cartas

`CARD_DB` contém 30 entradas com tipagem `CardData`:

```ts
interface CardData {
  id: number;
  emoji: string;
  pt: string;   // Português
  es: string;   // Espanhol
  en: string;   // Inglês
  cat: string;  // categoria semântica
}
```

As categorias são: `fruit`, `creature`, `item`, `nature`, `element`, `place`, `action`, `animal`. Servem de base para expansão futura por categoria.

---

## Geração do Deck

A função `buildDeck(pairs: number)` faz:

1. Embaralha o `CARD_DB` com `shuffle<T>()` (Fisher-Yates)
2. Fatia os primeiros `N` itens conforme o nível
3. Para cada item, cria **3 cartas** — uma por idioma — com `cardId` único (`{id}-pt`, `{id}-es`, `{id}-en`) e `matchId` compartilhado
4. Embaralha o deck final novamente

```ts
function buildDeck(pairs: number): DeckCard[] {
  const selected = shuffle(CARD_DB).slice(0, pairs);
  const deck: DeckCard[] = [];
  selected.forEach((card) => {
    deck.push({ ...card, cardId: `${card.id}-pt`, lang: "pt", matchId: card.id });
    deck.push({ ...card, cardId: `${card.id}-es`, lang: "es", matchId: card.id });
    deck.push({ ...card, cardId: `${card.id}-en`, lang: "en", matchId: card.id });
  });
  return shuffle(deck);
}
```

---

## Flip 3D das Cartas

O componente `Card3D` usa CSS 3D real:

- O **wrapper** tem `perspective: 600px` e `transformStyle: preserve-3d`
- A **face traseira** tem `backfaceVisibility: hidden` e nenhum transform adicional
- A **face frontal** tem `backfaceVisibility: hidden` e `transform: rotateY(180deg)` estático
- O flip é controlado pelo `transform` do wrapper: `rotateY(0deg)` → `rotateY(180deg)`
- O **efeito de tilt** por mouse vai exclusivamente no wrapper, nunca nas faces — isso preserva o `backfaceVisibility` corretamente

```
wrapper [rotateY(180deg) + tiltX + tiltY]
  ├── face-back  [backfaceVisibility: hidden]
  └── face-front [backfaceVisibility: hidden, transform: rotateY(180deg)]
```

---

## Lógica de Jogo

### Fluxo de clique
```
handleFlip(card)
  ├── guarda carta em flipped[]
  ├── se flipped.length === 3:
  │     ├── todos matchId iguais? → TRIO CORRETO
  │     │     ├── atualiza combo e score
  │     │     ├── adiciona matchId ao Set matched
  │     │     └── limpa flipped[]
  │     └── matchId diferente? → ERRO
  │           ├── marca cartas como wrong (glow vermelho)
  │           ├── trava lockRef por 900ms
  │           └── limpa flipped[] e wrong[]
```

### Sistema de pontuação
- Trio correto: **100 pts + combo × 50**
- Bônus de tempo ao vencer: **timeLeft × 5**
- Combo reseta a cada erro

### Timer
Implementado com `setInterval` armazenado em `timerRef`. Ao zerar o tempo com trios ainda faltando, chama `onLose`. Ao completar todos os trios, chama `onWin` com o bônus de tempo.

---

## Máquina de Estados

`LinguaTrioGame` controla três telas via estado `screen`:

```
"levels" → LevelSelect
"game"   → GameScreen  (key={gameKey} para remount controlado)
"result" → ResultScreen
```

O `gameKey` é um inteiro que só incrementa ao iniciar ou repetir uma partida — evita o problema de `key={Date.now()}` que causava remount em todo re-render.

---

## Animações CSS

Todas as animações são `@keyframes` injetadas via `<style>` tag no JSX:

| Animação | Uso |
|----------|-----|
| `dealIn` | Cartas surgindo ao iniciar fase |
| `floatUp` | Popup de pontuação flutuando para cima |
| `shakeBoard` | Tremor do grid ao errar um trio |
| `pulse` | Indicador de combo pulsando |

---

## Níveis

| # | Nome | Pares | Cartas | Tempo |
|---|------|-------|--------|-------|
| 1 | Aprendiz | 4 | 12 | 120s |
| 2 | Guerreiro | 6 | 18 | 100s |
| 3 | Mestre | 8 | 24 | 80s |
| 4 | Lenda | 10 | 30 | 60s |
| 5 | Deus | 12 | 36 | 45s |

---

## Bugs Corrigidos na V2

| Bug | Causa | Solução |
|-----|-------|---------|
| Carta aberta permanentemente | `transform` de tilt na face frontal sobrescrevia `rotateY(180deg)` | Tilt movido para o wrapper externo |
| Build falhando no Vercel | Parâmetros `pairs`, `arr` e props sem tipo TypeScript | Tipagem completa com interfaces |
| Remount ao re-renderizar | `key={Date.now()}` recalculado em todo render | `gameKey` numérico com incremento controlado |
| Score/matched desatualizados no resultado | Stale closures em `useEffect` sem dependências corretas | Callbacks estabilizados com `useRef` |
