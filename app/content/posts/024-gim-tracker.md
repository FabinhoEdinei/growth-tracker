---
title: 'Documentação do Gim Tracker'
slug:"documentaco-gim-tracker"
date: "2026-03-12"
author: "Fabio Edinei"
character: "fabio"
type: "fatos"
category: "Relatório Diário"
tags:
  - relatório
  - daily
  - growth-tracker
  - '2026-03-12'
---

# 🏋️ GYM TRACKER — Documentação Completa
### Uma série em 4 capítulos sobre a construção da tela de academia do Growth Tracker

> **Projeto:** Growth Tracker  
> **Módulo:** `app/gim-tracker/`  
> **Stack:** Next.js 13+ (App Router) · TypeScript · CSS-in-JS inline  
> **Data de criação:** Março de 2026  
> **Autor:** Fabio Edinei  

---

## Índice Geral

- [Capítulo 1 — A Concepção: Arquitetura e Tipos](#capítulo-1)
- [Capítulo 2 — O Treino: Dados, Exercícios e Lógica de Estado](#capítulo-2)
- [Capítulo 3 — A Engine: O Hook useWorkout](#capítulo-3)
- [Capítulo 4 — A Interface: Componentes e Experiência Visual](#capítulo-4)

---

<a name="capítulo-1"></a>
# Capítulo 1 — A Concepção: Arquitetura e Tipos

## 1.1 Visão Geral

O Gym Tracker nasceu da necessidade de ter um acompanhamento de treino integrado ao Growth Tracker — um módulo que refletisse progresso real, com timer, contagem de séries e navegação entre blocos de exercícios. A premissa era simples: **sem dependências externas de estado**, **zero bibliotecas de UI**, apenas React puro com estilo inline, garantindo portabilidade total.

A decisão mais importante da fase de concepção foi **separar completamente dados, lógica e apresentação** em 5 arquivos independentes:

```
app/gim-tracker/
  ├── GymTrackerPage.tsx      ← Orquestrador (zero lógica própria)
  ├── types/
  │   └── gym.ts              ← Contratos TypeScript
  ├── data/
  │   └── workout.ts          ← Treino estático + helpers
  ├── hooks/
  │   └── useWorkout.ts       ← Toda a lógica e timers
  └── components/
      └── index.tsx           ← Todos os componentes visuais
```

Essa separação permite que no futuro o treino seja trocado (outro arquivo em `data/`), a lógica seja reutilizada em outro componente, ou os componentes sejam estilizados de forma diferente — sem quebrar nada.

---

## 1.2 O Sistema de Tipos (`types/gym.ts`)

O primeiro arquivo criado foi o de tipos — ele define o contrato de tudo que existe no módulo.

### Tipos de Enumeração

```typescript
export type Equipment    = 'barbell' | 'bodyweight' | 'both';
export type MuscleGroup  = 'chest' | 'back' | 'shoulders' | 'biceps'
                         | 'triceps' | 'legs' | 'glutes' | 'core' | 'fullbody';
export type WorkoutPhase = 'idle' | 'exercise' | 'rest' | 'finished';
```

**`Equipment`** diferencia exercícios com haltere, corpo livre ou mistos — usado para exibir a label correta no card do exercício.

**`MuscleGroup`** mapeia o grupo muscular principal de cada exercício — permite filtros futuros e exibição visual de músculos trabalhados.

**`WorkoutPhase`** é o coração do estado da máquina de estados do treino:
- `idle` → tela inicial, antes de começar
- `exercise` → exercício ativo, timer rodando
- `rest` → countdown de descanso entre séries
- `finished` → treino concluído, exibe resumo

### Estrutura Estática do Treino

```typescript
export interface Set {
  reps:    number;
  done:    boolean;
  timeMs?: number;  // timestamp ao concluir (opcional)
}

export interface Exercise {
  id:          string;
  name:        string;
  equipment:   Equipment;
  muscleGroup: MuscleGroup;
  sets:        number;       // quantidade de séries
  reps:        string;       // "12-15" | "45s" | "10 (cada lado)"
  restSeconds: number;       // segundos de descanso após cada série
  weight?:     string;       // sugestão de carga (opcional)
  cues:        string[];     // dicas de execução (máx 4)
  emoji:       string;       // identificador visual rápido
}

export interface WorkoutBlock {
  id:          string;
  name:        string;
  description: string;
  exercises:   Exercise[];
}

export interface Workout {
  id:           string;
  name:         string;
  totalMinutes: number;
  blocks:       WorkoutBlock[];
}
```

A decisão de `reps` ser `string` (não `number`) foi deliberada: permite representar séries por tempo (`"45s"`), por lado (`"10 (cada lado)"`) ou por range (`"12-15"`) sem conversões especiais.

### Estado em Runtime

```typescript
export interface ExerciseProgress {
  exerciseId:    string;
  completedSets: number;
  sets:          Set[];     // espelho das séries com status de cada uma
}

export interface WorkoutState {
  phase:                WorkoutPhase;
  currentBlockIndex:    number;
  currentExerciseIndex: number;
  currentSetIndex:      number;
  elapsedSeconds:       number;      // timer global do treino
  restSecondsLeft:      number;      // countdown de descanso
  progress:             Record<string, ExerciseProgress>;
  startedAt:            number | null;
  finishedAt:           number | null;
}
```

O `progress` é um `Record<string, ExerciseProgress>` — um mapa indexado pelo `exerciseId`. Isso permite acesso O(1) ao progresso de qualquer exercício sem percorrer arrays, e mantém o histórico de todas as séries de todo o treino na memória.

---

## 1.3 Decisões de Arquitetura

### Por que CSS inline (não Tailwind, não CSS Modules)?

O módulo Gym Tracker usa exclusivamente `style={{}}` inline. A razão: **portabilidade e isolamento**. O restante do Growth Tracker usa Tailwind, mas um módulo de treino pode eventualmente ser extraído para um app standalone. Com estilo inline, não há dependência de nenhum arquivo de configuração externo.

### Por que um único `components/index.tsx`?

Todos os 7 componentes visuais ficam num único arquivo. Isso parece contra-intuitivo, mas elimina a necessidade de gerenciar imports entre múltiplos arquivos menores. Como todos os componentes compartilham o mesmo objeto de tema `T`, um único arquivo evita duplicação e garante consistência visual absoluta.

### Por que `'use client'` no topo de todos os arquivos de componente?

O App Router do Next.js 13+ torna Server Components o padrão. O Gym Tracker usa `useState`, `useEffect`, `useRef` e `useCallback` — APIs exclusivas do cliente. A diretiva `'use client'` é obrigatória em qualquer arquivo que use hooks React.

---

<a name="capítulo-2"></a>
# Capítulo 2 — O Treino: Dados, Exercícios e Lógica de Programa

## 2.1 O Arquivo de Dados (`data/workout.ts`)

O treino `WORKOUT_FULLBODY_45` é um objeto TypeScript estático — não há banco de dados, não há API. Isso foi uma escolha consciente: treinos mudam raramente e a simplicidade de um arquivo local supera qualquer complexidade de infraestrutura.

### Estrutura do Treino

```typescript
export const WORKOUT_FULLBODY_45: Workout = {
  id:           'fullbody-45-dumbbell',
  name:         'FULL BODY 45MIN',
  totalMinutes: 45,
  blocks:       [ /* 6 blocos */ ],
};
```

### Os 6 Blocos de Treino

| Bloco | Nome | Duração | Foco |
|-------|------|---------|------|
| `warmup` | AQUECIMENTO | 5 min | Mobilidade e ativação |
| `block-a` | PEITO + TRÍCEPS | 10 min | Empurrar horizontal |
| `block-b` | COSTAS + BÍCEPS | 10 min | Puxar horizontal |
| `block-c` | PERNAS + GLÚTEOS | 10 min | Membros inferiores |
| `block-d` | OMBROS + CORE | 8 min | Estabilidade e força funcional |
| `cooldown` | FINALIZAÇÃO | 2 min | Alongamento |

### Detalhamento do Bloco A — Exemplo

```typescript
{
  id:          'block-a',
  name:        'BLOCO A — PEITO + TRÍCEPS',
  description: 'Empurrar horizontal e vertical • 3 séries cada',
  exercises: [
    {
      id:          'dumbbell-press',
      name:        'Supino com Halteres',
      equipment:   'barbell',
      muscleGroup: 'chest',
      sets:        3,
      reps:        '12-15',
      restSeconds: 45,
      weight:      '10-16kg cada',
      emoji:       '💪',
      cues: [
        'Escápulas retraídas e deprimidas no banco',
        'Cotovelos a 45° do tronco',
        'Suba explosivo, desça controlado (2s)',
        'Toque os halteres no topo sem travar',
      ],
    },
    // ... Flexão e Tríceps Coice
  ],
},
```

Cada exercício tem **exatamente 4 dicas de execução** (`cues`). Esse limite foi estabelecido para manter o card visual compacto — mais de 4 dicas ultrapassaria a altura da tela em mobile.

### Progressão de Descanso por Tipo de Exercício

A duração do descanso foi cuidadosamente calibrada por tipo de exercício:

| Tipo | Descanso | Justificativa |
|------|----------|---------------|
| Compostos pesados (Supino, Terra) | 45-50s | Alta demanda neural e muscular |
| Isolados (Rosca, Tríceps) | 40s | Grupos menores recuperam mais rápido |
| Isométricos (Prancha) | 30s | Estabilidade, não força máxima |
| Aquecimento | 10-20s | Objetivo é ativação, não recuperação |
| Finalização | 0-10s | Fluxo contínuo de alongamento |

### Os Helpers Exportados

```typescript
export function getTotalSets(workout: Workout): number {
  return workout.blocks
    .flatMap(b => b.exercises)
    .reduce((acc, ex) => acc + ex.sets, 0);
}

export function getTotalExercises(workout: Workout): number {
  return workout.blocks.flatMap(b => b.exercises).length;
}
```

Para o `WORKOUT_FULLBODY_45`:
- **Total de exercícios:** 17
- **Total de séries:** ~45 (variando por exercício)
- **Duração total:** 45 minutos

---

## 2.2 Filosofia do Design do Treino

### Equipamento Mínimo

O treino foi desenhado para ser realizado com **apenas halteres e o próprio corpo**. Sem barras, sem máquinas, sem banco obrigatório. Isso torna o treino executável em casa, hotel ou academia simples.

### Progressão de Dificuldade por Bloco

Os blocos foram ordenados estrategicamente:
1. **Aquecimento** prepara articulações
2. **Peito/Tríceps** e **Costas/Bíceps** trabalham antagonistas em blocos separados (não supersets) para recuperação parcial
3. **Pernas** vem no meio — maior grupo muscular, executado com energia moderada
4. **Ombros/Core** finaliza com estabilidade quando o sistema nervoso já aqueceu
5. **Finalização** desacelera o organismo

### Carga Sugerida como Range

As cargas são sempre ranges: `"10-16kg cada"`, `"8-12kg cada"`. Isso respeita a individualidade — um iniciante usa 10kg, um avançado usa 16kg, no mesmo treino.

---

<a name="capítulo-3"></a>
# Capítulo 3 — A Engine: O Hook `useWorkout`

## 3.1 Visão Geral do Hook

`useWorkout` é o coração do módulo. Ele recebe um `Workout` e retorna todo o estado e todas as ações necessárias para a interface. **Nenhum componente visual sabe como o tempo funciona** — toda essa responsabilidade fica neste hook.

```typescript
export function useWorkout(workout: Workout) {
  const [state, setState] = useState<WorkoutState>(/* ... */);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  // ... lógica

  return {
    state,
    currentBlock,
    currentExercise,
    currentProgress,
    isLastSet,
    overallProgress,
    nextExerciseName,
    startWorkout,
    completeSet,
    skipRest,
    skipExercise,
    resetWorkout,
    formatTime,
    getTotalCompletedSets,
    getTotalSets,
  };
}
```

## 3.2 Inicialização do Estado

```typescript
function buildInitialProgress(workout: Workout): Record<string, ExerciseProgress> {
  const progress: Record<string, ExerciseProgress> = {};
  for (const block of workout.blocks) {
    for (const ex of block.exercises) {
      progress[ex.id] = {
        exerciseId:    ex.id,
        completedSets: 0,
        sets: Array.from({ length: ex.sets }, () => ({ reps: 0, done: false })),
      };
    }
  }
  return progress;
}
```

Ao montar, o hook pré-cria o progresso de **todos os exercícios do treino** — não apenas do atual. Isso garante que acessar `state.progress[qualquerExercicioId]` nunca retorna `undefined`.

## 3.3 O Sistema de Timer

O timer foi um dos pontos mais delicados. A solução usa **dois refs** ao invés de state para o controle interno:

```typescript
const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
const elapsedRef = useRef(0);
```

**Por que `useRef` e não `useState` para o elapsed?**

Se `elapsedSeconds` fosse um `useState` separado, o `setInterval` capturaria um closure com o valor antigo — clássico bug de stale closure em React. O `elapsedRef` é mutado diretamente e o valor é propagado para o state via `setState` no tick do interval:

```typescript
const startTimer = useCallback(() => {
  stopTimer();
  timerRef.current = setInterval(() => {
    setState(prev => {
      if (prev.phase === 'rest') {
        const next = prev.restSecondsLeft - 1;
        if (next <= 0) return { ...prev, phase: 'exercise', restSecondsLeft: 0 };
        return { ...prev, restSecondsLeft: next };
      }
      if (prev.phase === 'exercise') {
        elapsedRef.current += 1;
        return { ...prev, elapsedSeconds: elapsedRef.current };
      }
      return prev;
    });
  }, 1000);
}, [stopTimer]);
```

O timer faz **duas coisas em um único interval**:
- Se fase `rest`: decrementa `restSecondsLeft` e transiciona para `exercise` ao chegar em zero
- Se fase `exercise`: incrementa `elapsedRef` e sincroniza com o state

Essa abordagem elimina a necessidade de dois intervals separados.

## 3.4 A Máquina de Estados

### As Duas Funções de Avanço

O bug mais crítico corrigido durante o desenvolvimento foi a distinção entre avançar uma **série** e avançar um **exercício**:

```typescript
// advance: chamada após completar série OU pular descanso
// Respeita séries restantes antes de mudar de exercício
function advance(prev, progress): WorkoutState {
  const block = workout.blocks[prev.currentBlockIndex];
  const ex    = block.exercises[prev.currentExerciseIndex];

  if (prev.currentSetIndex < ex.sets - 1) {
    // Ainda tem séries → próxima série
    return { ...prev, progress, phase: 'exercise',
             currentSetIndex: prev.currentSetIndex + 1, restSecondsLeft: 0 };
  }
  return advanceExercise(prev, progress);
}

// advanceExercise: pula TODO o exercício atual
// Vai direto para próximo exercício ou próximo bloco
function advanceExercise(prev, progress): WorkoutState {
  const block = workout.blocks[prev.currentBlockIndex];

  if (prev.currentExerciseIndex < block.exercises.length - 1) {
    return { ...prev, progress, phase: 'exercise',
             currentExerciseIndex: prev.currentExerciseIndex + 1,
             currentSetIndex: 0, restSecondsLeft: 0 };
  }
  if (prev.currentBlockIndex < workout.blocks.length - 1) {
    return { ...prev, progress, phase: 'exercise',
             currentBlockIndex: prev.currentBlockIndex + 1,
             currentExerciseIndex: 0, currentSetIndex: 0, restSecondsLeft: 0 };
  }
  // Fim do treino
  stopTimer();
  return { ...prev, progress, phase: 'finished', finishedAt: Date.now() };
}
```

**O bug original:** `skipExercise` chamava `advance` (que verifica séries restantes) em vez de `advanceExercise`. Resultado: ao clicar em "Pular Exercício" no meio do Bloco A, ele avançava para a próxima série do mesmo exercício, nunca para o próximo bloco.

**A correção:** `skipExercise` passou a chamar `advanceExercise` diretamente, pulando a verificação de séries pendentes.

### Fluxo Completo de uma Série

```
[Usuário clica "SÉRIE N CONCLUÍDA"]
         ↓
completeSet() é chamado
         ↓
Marca sets[currentSetIndex].done = true
         ↓
         ├─ É o último set do último exercício do último bloco?
         │   └─ Sim → phase: 'finished', stopTimer()
         │
         ├─ restSeconds > 0?
         │   └─ Sim → phase: 'rest', restSecondsLeft = exercise.restSeconds
         │
         └─ Sem descanso → advance() → próxima série ou próximo exercício
```

### Fluxo do Descanso

```
[Timer tick — phase === 'rest']
         ↓
restSecondsLeft -= 1
         ↓
         ├─ restSecondsLeft <= 0?
         │   └─ Sim → phase: 'exercise' (automático, sem ação do usuário)
         │
         └─ Não → continua countdown
         
[Usuário clica "PULAR DESCANSO"]
         ↓
skipRest() → advance() → próxima série ou exercício
```

## 3.5 As Ações Públicas

### `startWorkout`

```typescript
const startWorkout = useCallback(() => {
  elapsedRef.current = 0;
  setState(prev => ({
    ...prev,
    phase: 'exercise',
    startedAt: Date.now(),
    elapsedSeconds: 0
  }));
  startTimer();
}, [startTimer]);
```

Reseta o ref e inicia o interval. O `startedAt` é salvo para cálculos futuros de relatório.

### `completeSet`

A ação mais complexa — marca a série, decide se entra em descanso ou avança:

```typescript
const completeSet = useCallback(() => {
  setState(prev => {
    const updatedSets = [...prev.progress[currentExercise.id].sets];
    updatedSets[prev.currentSetIndex] = {
      ...updatedSets[prev.currentSetIndex],
      done:   true,
      timeMs: Date.now(),
    };

    const updatedProgress = {
      ...prev.progress,
      [currentExercise.id]: {
        ...prev.progress[currentExercise.id],
        completedSets: prev.progress[currentExercise.id].completedSets + 1,
        sets: updatedSets,
      },
    };

    if (isLastSet && isLastExercise && isLastBlock) {
      stopTimer();
      return { ...prev, progress: updatedProgress,
               phase: 'finished', finishedAt: Date.now() };
    }

    if (currentExercise.restSeconds > 0) {
      return { ...prev, progress: updatedProgress,
               phase: 'rest', restSecondsLeft: currentExercise.restSeconds };
    }

    return advance(prev, updatedProgress);
  });
}, [/* deps */]);
```

### `skipExercise`

```typescript
const skipExercise = useCallback(() => {
  setState(prev => {
    if (prev.phase === 'idle' || prev.phase === 'finished') return prev;
    return advanceExercise(prev, prev.progress);
  });
}, []);
```

Disponível somente após 4 séries globais completadas (verificado no componente, não no hook). O hook não tem opinião sobre quando a ação pode ser chamada — essa responsabilidade é da UI.

## 3.6 Derivações Computadas

O hook computa derivações a cada render, sem `useMemo` (o custo é negligível para dados tão pequenos):

```typescript
const currentBlock    = workout.blocks[state.currentBlockIndex] ?? null;
const currentExercise = currentBlock?.exercises[state.currentExerciseIndex] ?? null;
const currentProgress = currentExercise ? state.progress[currentExercise.id] : null;

const isLastSet      = currentExercise
  ? state.currentSetIndex >= currentExercise.sets - 1
  : false;

const overallProgress = Math.round(
  (getTotalCompletedSets() / Math.max(getTotalSets(), 1)) * 100
);

const nextExerciseName = (() => {
  if (!currentBlock || !currentExercise) return undefined;
  if (!isLastSet) return currentExercise.name; // próxima série do mesmo
  const nextInBlock = currentBlock.exercises[state.currentExerciseIndex + 1];
  if (nextInBlock) return nextInBlock.name;
  return workout.blocks[state.currentBlockIndex + 1]?.exercises[0]?.name;
})();
```

O `nextExerciseName` alimenta o `RestTimer` para mostrar "PRÓXIMO: Remada Curvada" durante o descanso.

---

<a name="capítulo-4"></a>
# Capítulo 4 — A Interface: Componentes e Experiência Visual

## 4.1 Sistema de Tema

Todos os componentes compartilham um único objeto de tema `T` definido no topo de `components/index.tsx`:

```typescript
const T = {
  bg:       '#0e0e0e',   // fundo principal — preto quase absoluto
  surface:  '#161616',   // superfícies de primeiro nível
  elevated: '#1e1e1e',   // superfícies elevadas (cards)
  card:     '#222222',   // cards internos
  border:   '#2a2a2a',   // bordas sutis
  accent:   '#ff4520',   // laranja-ferrugem — ação principal
  gold:     '#e8b84b',   // dourado sujo — destaques secundários
  text:     '#f0ede8',   // texto principal — branco quente
  muted:    '#7a7068',   // texto secundário
  dim:      '#4a4540',   // texto terciário / inativo
  success:  '#4caf72',   // verde confirmação
  rest:     '#3d6bff',   // azul descanso
} as const;
```

**A escolha de `#ff4520` (laranja-ferrugem):** Remete ao ferro, ao suor, à dureza da academia. Evita o verde "fitness" genérico ou o azul "tecnologia" clichê. Cria uma identidade industrial única.

**A escolha de fontes:**

```typescript
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --font-display: 'Barlow Condensed', sans-serif;
    --font-mono:    'Share Tech Mono', monospace;
  }
`;
```

- **Barlow Condensed** (display): Condensada, densa, industrial. Perfeita para números grandes e títulos em caps.
- **Share Tech Mono** (mono): Monospace de terminal — usada para timers, labels técnicas e labels de status.

---

## 4.2 Os 7 Componentes

### 1. `WorkoutHeader` — O Header Fixo

```
┌─────────────────────────────────────────────────┐
│ GYM TRACKER                            ▶ ATIVO   │
│ FULL BODY 45MIN                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌        │
│ ◉ 34%   12/35 séries concluídas                 │
└─────────────────────────────────────────────────┘
```

**Elementos:**
- Nome do treino + label de status (`▶ ATIVO` ou `⏸ DESCANSO`)
- Barra de progresso de **tempo** (`linear-gradient` de laranja para dourado)
- Anel SVG de progresso de **séries** (conic-gradient com animação `stroke-dashoffset`)
- Contador `completedSets/totalSets`

**Barra de tempo vs. anel de séries:** As duas métricas são intencionalmente separadas. O tempo é linear (você não controla), as séries são conquistas (você conquista). Visual diferente para conceitos diferentes.

```typescript
const timeProgress = Math.min((elapsedSeconds / (totalMinutes * 60)) * 100, 100);

// Anel SVG
const R    = 12;
const circ = 2 * Math.PI * R;
const strokeDashoffset = circ * (1 - overallProgress / 100);
```

### 2. `BlockBadge` — A Faixa de Navegação de Blocos

```
┌──────────┬──────────┬──────────┬──────────┐
│ ✓ AQUEC. │ ■ BLOCO A│   BLOCO B│   BLOCO C│
└──────────┴──────────┴──────────┴──────────┘
  concluído   ativo     futuro    futuro
```

Scroll horizontal, cada bloco tem:
- Indicador de status: letra (A, B, C...) ou ✓ se concluído
- Borda esquerda colorida: laranja (ativo), verde (concluído), cinza (futuro)
- Nome do bloco + quantidade de exercícios

Não é clicável — navegação é apenas visual. O usuário não pode pular blocos manualmente (design intencional).

### 3. `CyclicDots` — O Contador Cíclico de Séries

```
● ● ○ ○      (2 de 4 séries feitas — ciclo 1)
● ● ● ● ×2  (4 de 4 feitas — ciclo 2 completo)
```

**O conceito:** A cada 4 séries completadas no treino inteiro, as 4 bolinhas acendem sequencialmente e depois "zeram" — recomeçam do zero com o contador `×N` incrementado.

```typescript
const lit    = totalDone % 4;           // bolinhas acesas (0–3)
const cycles = Math.floor(totalDone / 4); // ciclos completos

{[0, 1, 2, 3].map(i => {
  const isLit = i < lit;
  return (
    <div style={{
      width: 13, height: 13, borderRadius: '50%',
      background:  isLit ? `radial-gradient(circle at 35% 35%, #7fff9a, ${T.success})` : T.surface,
      border:      `2px solid ${isLit ? T.success : T.border}`,
      boxShadow:   isLit ? `0 0 7px ${T.success}90` : 'none',
      transition:  'all .25s ease',
    }}/>
  );
})}
```

O `radial-gradient` com ponto de luz em `35% 35%` cria o efeito de esfera 3D nas bolinhas acesas.

### 4. `ExerciseCard` — O Card Principal do Exercício

O card mais complexo — 5 seções internas:

#### Seção 1: Cabeçalho
```
💪  HALTERE · CHEST
    Supino com Halteres      12-15
                             REPS
                             10-16kg cada
```
Emoji grande + tipo de equipamento + grupo muscular + nome + reps + carga sugerida.

#### Seção 2: Timer + CyclicDots
```
14:32  TREINO        ● ● ○ ○
```
Timer do treino em destaque (laranja ativo, azul em descanso) + bolinhas cíclicas lado a lado.

**A decisão de colocar o timer dentro do card (e não apenas no header):**  
Durante o exercício, o usuário foca no card — o header fica fora do campo de visão em mobile. Ter o timer no card garante que o atleta sempre saiba quanto tempo passou sem precisar rolar.

#### Seção 3: Quadradinhos de Séries
```
┌───┐ ┌───┐ ┌───┐
│ ✓ │ │■2■│ │ 3 │    ← 3 séries: concluída, ativa, futura
└───┘ └───┘ └───┘
```

```typescript
const isDone   = progress.sets[i]?.done ?? false;
const isActive = i === currentSetIndex && !isResting;

// Série ativa tem transform: scale(1.1) — destaque visual sutil
```

#### Seção 4: Dicas de Execução
```
▸ Escápulas retraídas e deprimidas no banco
▸ Cotovelos a 45° do tronco
▸ Suba explosivo, desça controlado (2s)
▸ Toque os halteres no topo sem travar
```
Máximo 4 dicas, fonte menor, cor `T.muted` para não competir com as informações primárias.

#### Seção 5: Botões de Ação

**Botão principal — completar série:**
```typescript
// Gradient diagonal, sombra laranja, feedback tátil via onMouseDown/onTouchStart
style={{
  background: `linear-gradient(135deg, ${T.accent} 0%, #c82800 100%)`,
  boxShadow:  `0 4px 18px ${T.accent}44`,
}}
onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
onMouseUp={e =>   { e.currentTarget.style.transform = 'scale(1)'; }}
```

**Botão secundário — pular exercício:**
Aparece apenas quando `totalCompletedSets >= 4`. Transparente, borda sutil, hover sutil. Não compete com o botão principal.

```typescript
const canSkip = totalCompletedSets >= 4;
{canSkip && (
  <button onClick={onSkipExercise} style={{ background: 'transparent', border: `1px solid ${T.border}` }}>
    ⏭ PULAR EXERCÍCIO
  </button>
)}
```

### 5. `RestTimer` — O Countdown de Descanso

```
       ⏸ DESCANSO ATIVO

         ┌─────────┐
         │  (anel) │
         │   32    │
         │   seg   │
         └─────────┘

         PRÓXIMO
      Remada Curvada

    [ PULAR DESCANSO ▶ ]
```

**O anel SVG:**
```typescript
const R      = 50;
const circ   = 2 * Math.PI * R;
const pct    = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
const offset = circ - (pct / 100) * circ;
const isUrgent = secondsLeft <= 5;

<circle
  stroke={isUrgent ? T.accent : T.rest}  // ← muda de azul para laranja nos últimos 5s
  strokeDashoffset={offset}
  style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s' }}
/>
```

A mudança de cor nos últimos 5 segundos (`isUrgent`) cria uma urgência visual que prepara o atleta para o próximo exercício.

### 6. `WorkoutIdle` — Tela de Início

Tela centralizada com:
- Ícone 🏋️ em container com bordas gradiente e glow laranja
- Título e subtítulo
- Grid 3 colunas: minutos, exercícios, séries
- Botão "▶ INICIAR TREINO"

### 7. `WorkoutFinished` — Tela de Conclusão

```
           🏆
    TREINO CONCLUÍDO

  ⏱ 47:23  |  ✅ 42
  TEMPO TOTAL | SÉRIES FEITAS

  [ 🔄 NOVO TREINO ]
```

Tema dourado (`T.gold`) em vez do laranja padrão — a conquista merece uma cor diferente da ação.

---

## 4.3 A Página Orquestradora (`GymTrackerPage.tsx`)

A página principal tem uma única responsabilidade: **orquestrar**. Ela não tem lógica própria — apenas chama o hook e distribui os dados para os componentes.

```typescript
export default function GymTrackerPage() {
  const workout = WORKOUT_FULLBODY_45;

  const { state, currentBlock, currentExercise, ... } = useWorkout(workout);

  const isActive = state.phase === 'exercise' || state.phase === 'rest';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }}/>
      <div>
        {state.phase === 'idle'     && <WorkoutIdle ... />}
        {state.phase === 'finished' && <><WorkoutHeader .../><WorkoutFinished .../></>}
        {isActive && (
          <>
            <WorkoutHeader .../>
            {/* faixa de blocos */}
            {/* progresso do bloco */}
            {state.phase === 'rest'     && <RestTimer .../>}
            {state.phase === 'exercise' && <ExerciseCard .../>}
            {/* lista de próximos exercícios */}
          </>
        )}
      </div>
    </>
  );
}
```

O padrão `{state.phase === 'x' && <Componente/>}` é renderização condicional pura do React — simples, legível, sem switch/case.

---

## 4.4 Animações e Micro-Interações

### Entrada de Cards

```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.slide-up { animation: slideUp .3s ease-out forwards; }
```

Aplicada via `className="slide-up"` no wrapper do `ExerciseCard` e `RestTimer`. O `key` prop garante que a animação re-execute ao mudar de exercício:

```typescript
<div className="slide-up" key={`${currentExercise.id}-${state.currentSetIndex}`}>
  <ExerciseCard ... />
</div>
```

### Barras de Progresso SVG

Todos os anéis de progresso usam a técnica de `strokeDasharray` + `strokeDashoffset`:

```
strokeDasharray  = circunferência total
strokeDashoffset = circunferência × (1 - progresso%)
```

Animado com `transition: stroke-dashoffset 1s linear` — cria o efeito de preenchimento suave.

### Feedback Tátil nos Botões

```typescript
onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
onMouseUp={e =>   { e.currentTarget.style.transform = 'scale(1)'; }}
onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
onTouchEnd={e =>   { e.currentTarget.style.transform = 'scale(1)'; }}
```

Sem CSS class — manipulação direta do estilo inline para resposta imediata (sem esperar re-render).

---

## 4.5 Decisões de UX

### Por que não há botão "Pausar Treino"?

A academia não tem pausa. Se o atleta parar o timer sempre que precisar de água, o relatório de tempo não reflete a realidade. A decisão foi omitir deliberadamente a pausa — o timer é o timer.

### Por que o botão "Pular Exercício" aparece só após 4 séries?

Evita uso acidental. Um atleta que acabou de começar e já pula exercícios está perdendo o treino. Após 4 séries globais, o sistema entende que o usuário está engajado o suficiente para tomar decisões conscientes.

### Por que a lista de "próximos exercícios" fica abaixo do card ativo?

Contexto sem distração. O atleta vê o que vem depois, mas a interface não empurra isso para o centro — o exercício atual domina a tela. A lista de próximos tem `opacity: 0.6` para indicar que são informações secundárias.

### Por que não há skip para blocos completos?

O treino é um programa. Pular um bloco inteiro desequilibraria o treino de forma significativa. A decisão foi deixar apenas o skip de exercício individual — granularidade suficiente para adaptar sem destruir o programa.

---

## Sumário Técnico

| Aspecto | Decisão |
|---------|---------|
| Framework | Next.js 13+ App Router |
| Linguagem | TypeScript strict |
| Estilo | CSS inline (zero dependências externas) |
| Estado | `useState` + `useReducer` implícito via setState |
| Timer | `setInterval` + `useRef` (evita stale closure) |
| Animações | CSS keyframes + SVG stroke-dashoffset |
| Fontes | Barlow Condensed + Share Tech Mono (Google Fonts) |
| Tema | Objeto `T` compartilhado — industrial dark |
| Arquivos | 5 arquivos totais, ~1300 linhas |
| Treino | 6 blocos, 17 exercícios, ~45 séries, 45 min |

---

*Documentação criada em Março de 2026 · Growth Tracker · Fabio Edinei*
