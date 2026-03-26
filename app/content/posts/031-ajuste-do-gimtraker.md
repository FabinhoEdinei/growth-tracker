---
title: "Upgrade da Gim Tracker"
slug: "upgrade-da-gim-traker"
date: "2026-03-25"
author: "Fabio Edinei"
category: "Desenvolvimento"
excerpt: "Documentacao completa das melhorias visuais implementadas no sistema Gim Tracker."
---
# DevLog — Growth Tracker / Gym Module
**Data:** 26 de março de 2026  
**Autor:** Fabio Edineri  
**Projeto:** [growth-tracker-lilac.vercel.app](https://growth-tracker-lilac.vercel.app)  
**Repositório:** github.com/FabinhoEdinei/growth-tracker

---

## O que era o estado inicial

O módulo `app/gim/` existia, compilava localmente e tinha uma estrutura funcional para um único treino fixo — o **Full Body 45min**. O fluxo era simples: abria a página, mostrava os dados do treino, e dava pra iniciar. Não havia escolha de treino, não havia separação de protocolos por objetivo (core, upper, lower), e todo o código vivia num único arquivo `page.tsx` gigante que misturava dados, lógica e UI.

O `data/workout.ts` exportava um objeto `WORKOUT_FULLBODY_45` com todos os blocos e exercícios. O hook `useWorkout.ts` já existia e funcionava bem — com fases `idle`, `exercise`, `rest` e `finished`, timer de descanso, e avanço automático entre séries, exercícios e blocos. Os componentes visuais (`WorkoutHeader`, `BlockBadge`, `ExerciseCard`, `RestTimer`, `WorkoutIdle`, `WorkoutFinished`) também existiam separados, mas eram importados num `page.tsx` que deixou de funcionar depois das mudanças.

---

## O que foi proposto

O objetivo do dia era **agregar novos treinos** ao sistema existente — especificamente protocolos de core/abdômen em três níveis de intensidade — e criar um **menu de seleção** que permitisse escolher o treino do dia antes de iniciar. A ideia era não quebrar o que já funcionava, só expandir.

---

## O que foi feito, passo a passo

### 1. Criação do `data/abs.ts`

Três novos treinos foram criados seguindo exatamente a mesma estrutura tipada do `WORKOUT_FULLBODY_45`:

- **`WORKOUT_ABS_10`** — ABS Express, 10 minutos, 3 exercícios (prancha, bicicleta, elevação de pernas). Pensado para quem quer um finalizador rápido ou treino de manhã.
- **`WORKOUT_ABS_FINISHER`** — Core Intenso, 15 minutos, 4 exercícios (dead bug, elevação de pernas, prancha, bicicleta). Foco em estabilidade e abdômen inferior.
- **`WORKOUT_ABS_PRO`** — Core Protocol, 20 minutos, 4 exercícios com volume maior (hollow body hold como novidade). Para quem já tem base de core.

Cada exercício tem `id`, `name`, `equipment`, `muscleGroup`, `sets`, `reps`, `restSeconds`, `emoji` e `cues` — campos obrigatórios pelo tipo `Workout` do projeto.

**Por que criar um arquivo separado?** Porque misturar dados de treino diferentes num único arquivo cria acoplamento desnecessário. Se amanhã quiser adicionar um treino de mobilidade ou HIIT, cria `mobility.ts` ou `hiit.ts` sem tocar no que já existe.

---

### 2. Criação do `data/workouts.ts` — catálogo central

Arquivo que agrega todos os treinos disponíveis numa lista única e exporta helpers reutilizáveis:

```ts
export const WORKOUTS: Workout[] = [
  WORKOUT_FULLBODY_45,
  WORKOUT_ABS_10,
  WORKOUT_ABS_FINISHER,
  WORKOUT_ABS_PRO,
];
```

Também exporta `WORKOUT_META` — um `Record` simples que mapeia o `id` de cada treino para seus dados visuais (`icon` e `description`). Isso é separado do tipo `Workout` propositalmente: o tipo original do projeto não tem campos visuais, e adicionar esses campos ao tipo causaria erros de TypeScript em todos os lugares que usam o tipo.

Funções auxiliares exportadas: `getWorkoutMeta(id)`, `getTotalSets(workout)`, `getTotalExercises(workout)`.

**O problema recorrente aqui:** O repositório tinha uma estrutura diferente do que imaginávamos. O arquivo `workout.ts` (singular) no repo **não era o arquivo de dados** — era já um catálogo parcial que importava de `fullbody.ts`. Isso só ficou claro depois de vários erros de build no Vercel. A estrutura final ficou:

```
app/gim/data/
  fullbody.ts     ← dados do Full Body 45min
  abs.ts          ← dados dos 3 treinos de core
  workouts.ts     ← catálogo central (importa dos dois acima)
```

---

### 3. Refatoração do `page.tsx`

O `page.tsx` antigo tinha ~200 linhas misturando imports de componentes antigos (`WorkoutHeader`, `BlockBadge`, `ExerciseCard`, etc.), lógica de estado e JSX. Depois da refatoração, ele virou uma linha:

```ts
export { default } from './components/index';
```

**Por que essa abordagem?** O Next.js exige que `page.tsx` tenha um `export default`. Ao reexportar o default do `components/index.tsx`, a responsabilidade toda fica no componente — que tem acesso a todos os hooks e dados necessários. O `page.tsx` fica como um proxy limpo, sem lógica.

---

### 4. Novo `components/index.tsx` — o orquestrador

Este arquivo substituiu o `page.tsx` antigo como ponto central de toda a UI do módulo. Três grandes responsabilidades:

**`GymTrackerPage` (root):** Estado único `activeWorkout: Workout | null`. Se null, mostra o menu. Se setado, mostra a sessão de treino. Sem complexidade adicional.

**`WorkoutMenu`:** Carrossel horizontal de cards de treino (scroll nativo) + preview detalhado do treino selecionado + botão "INICIAR TREINO" fixo no bottom com gradiente de fade. O card ativo tem gradiente laranja, glow e shadow. Os inativos têm borda sutil no `#2a2a2a`.

**`WorkoutPreview`:** Mostra stats rápidos (duração, exercícios, séries) + descrição + lista de todos os blocos e exercícios com emoji, sets, reps e tempo de descanso. Útil para o usuário revisar o treino antes de começar.

**`WorkoutSession`:** Orquestra as fases do treino usando o hook `useWorkout`. Renderiza condicionalmente:
- `idle` → tela de confirmação com stats e botão COMEÇAR
- `rest` → timer de descanso com countdown
- `exercise` → card do exercício ativo
- `finished` → tela de conclusão com tempo total e séries

---

### 5. Correção de TypeScript — `state.currentSet` vs `state.currentSetIndex`

O `WorkoutState` do hook usa `currentSetIndex` para rastrear a série atual. Em algum momento do processo de edição, o `components/index.tsx` no repo ficou com `state.currentSet` (que não existe no tipo). Isso causou erro de compilação TypeScript no build do Vercel mesmo após o Turbopack compilar com sucesso.

Correção: trocar todas as referências de `state.currentSet` por `state.currentSetIndex`.

O mesmo problema apareceu no cálculo do progresso — estava dividindo `state.currentSet` (undefined) pelo total de séries, resultando em `NaN`. A correção foi usar `getTotalCompletedSets()` do hook, que soma corretamente os `completedSets` de cada exercício no estado.

---

### 6. Correção do `hooks/useWorkout.ts` corrompido

Em algum momento o conteúdo do `components/index.tsx` foi colado no `useWorkout.ts` por engano. O arquivo passou a ter JSX na linha 14 (`<div style={{`), causando erro de parsing do Turbopack:

```
Parsing ecmascript source code failed
Expected '>', got 'ident'
```

O arquivo foi reescrito do zero com o conteúdo correto do hook — idêntico ao que o usuário havia colado anteriormente na conversa.

---

### 7. Migração de `middleware.ts` para `proxy.ts`

O Next.js 16 deprecou a convenção de arquivo `middleware.ts` em favor de `proxy.ts`. O aviso aparecia em todo build:

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

Além de renomear o arquivo, foi necessário trocar o nome da função exportada de `middleware` para `proxy` — o Next.js valida o nome do export e retorna erro se não encontrar uma função `proxy` ou `default` no arquivo `proxy.ts`.

---

### 8. Componentização do módulo de treino

No estado final, o `components/` virou uma pasta com componentes independentes e reutilizáveis:

```
app/gim/components/
  theme.ts          ← tokens de design (cores, fontes, gradientes)
  WorkoutHeader.tsx ← header sticky com progresso circular SVG, timer e badge
  BlockNav.tsx      ← scroll horizontal de blocos com letras A/B/C
  ExerciseCard.tsx  ← card rico com equipamento, músculo, carga, séries, cues
  RestTimer.tsx     ← countdown circular animado com SVG
  UpcomingList.tsx  ← próximos exercícios no bloco com opacidade decrescente
  index.tsx         ← orquestrador (menu + sessão)
```

O `theme.ts` centraliza todos os valores visuais como constantes tipadas. Qualquer mudança de cor ou fonte se propaga para todos os componentes automaticamente.

---

## Problemas encontrados e por que aconteceram

### Problema 1: Estrutura de arquivos diferente do esperado

O maior obstáculo da sessão. Assumimos que `data/workout.ts` continha os dados do Full Body, mas no repo ele era um catálogo. Os dados do Full Body estavam em `data/fullbody.ts`, que nunca tinha sido commitado em alguns momentos. Isso causou uma série de erros em cascata que só ficaram claros progressivamente à medida que cada build falhou com uma mensagem diferente.

**Lição:** Antes de qualquer integração, verificar a estrutura real do repo com um print da pasta.

### Problema 2: Dois arquivos de catálogo simultâneos

Em determinado momento, o repo tinha tanto `workout.ts` quanto `workouts.ts` tentando ser o catálogo central, cada um com imports diferentes. O Turbopack detectou os conflitos circular/ausente e lançou erros em ambos os arquivos.

**Lição:** Ter um único ponto de entrada para dados. O `workouts.ts` é o catálogo, `workout.ts` deveria ter sido deletado ou renomeado logo no início.

### Problema 3: Arquivo `useWorkout.ts` corrompido

Conteúdo JSX no lugar errado. Provavelmente uma operação de copiar/colar que foi no arquivo errado no GitHub mobile.

**Lição:** Editar arquivos de hook/lógica com mais cuidado, especialmente no editor mobile onde a navegação entre arquivos é mais suscetível a erros.

---

## O que dá para melhorar

### Arquitetura

**Tipos mais estritos para os treinos.** O `Exercise` atual aceita `equipment: string` — seria melhor um union type `'bodyweight' | 'barbell' | 'both'`. Isso evitaria dados inválidos e melhoraria o autocompletar.

**Separar os dados de `fullbody.ts` por bloco.** O arquivo tem ~150 linhas. Poderia ser `data/fullbody/warmup.ts`, `data/fullbody/blockA.ts`, etc., com um `data/fullbody/index.ts` que os agrega. Facilita editar exercícios específicos sem rolar centenas de linhas.

**Schema de validação com Zod.** Adicionar validação em runtime nos dados dos treinos garantiria que nenhum exercício com campo faltando quebre o app silenciosamente.

### UX e Features

**Persistência do treino em andamento.** Se o usuário fechar o app no meio do treino e voltar, perde todo o progresso. Salvar o estado no `localStorage` ou `sessionStorage` resolveria isso.

**Histórico de treinos.** Registrar data, tempo total e séries completadas por sessão. Com isso dá para mostrar "Você fez esse treino há 3 dias" no menu de seleção.

**Filtro por grupo muscular.** O `filterWorkoutByType()` já existe no código mas não está exposto na UI. Um seletor de músculo-alvo no menu seria útil.

**Vibração no celular.** Quando o timer de descanso zera, uma vibração curta avisa o usuário sem que ele precise ficar olhando a tela. `navigator.vibrate(200)` no `skipRest` automático resolve.

**Modo de treino personalizado.** Deixar o usuário montar seu próprio treino selecionando blocos de diferentes protocolos (ex: aquecimento do Full Body + bloco de core do ABS Pro).

**Animações de transição.** As telas mudam abruptamente. Uma animação de `slideUp` ou `fadeIn` entre fases (idle → exercise → rest) daria muito mais polish.

**Timer de execução por exercício.** Para exercícios com `reps: '45s'` (prancha, por exemplo), mostrar um countdown em vez de só o texto seria mais funcional.

### Técnico

**Testes unitários para `useWorkout`.** O hook tem lógica complexa de avanço entre séries/exercícios/blocos. Cobrir com Jest garantiria que novas features não quebrem o fluxo existente.

**Migrar o estado para `useReducer`.** O hook atual usa múltiplos `setState` e closures encadeadas. Um reducer tornaria as transições de estado explícitas e testáveis.

**Lazy loading dos dados de treino.** Todos os treinos são importados estaticamente. Para um catálogo grande, importar dinamicamente (`import('./data/abs')`) reduziria o bundle inicial.

**Tipagem do `WorkoutState`.** O campo `currentSet` que causou erro de build hoje indica que os campos do estado não estão todos tipados corretamente ou que o tipo não reflete o que o hook realmente usa. Uma revisão completa do `types/gym.ts` seria bem-vinda.

---

## Resultado final

O módulo `app/gim/` passou de um treino fixo sem escolha para um sistema multi-treino com menu de seleção, preview detalhado, execução completa com timer, descanso circular animado, navegação de blocos e tela de conclusão. A arquitetura ficou modular, com cada componente em seu próprio arquivo e um único `theme.ts` como fonte de verdade visual.

Foram necessários **11 ciclos de deploy** para chegar no estado funcional, cada um revelando uma camada diferente da estrutura real do repositório. A sessão foi mais sobre arqueologia de código do que sobre desenvolvimento — descobrir o que realmente estava no repo e reconciliar com o que queríamos construir.

O app está em produção em [growth-tracker-lilac.vercel.app/gim](https://growth-tracker-lilac.vercel.app/gim).

---

*Growth Tracker — construído com Next.js 16, TypeScript, Tailwind e muita persistência.*
