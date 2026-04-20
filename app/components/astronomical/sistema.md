# Sistema de Capítulos com Relógio Astronômico Medieval

Arquitetura modular e bem estruturada para exibição de capítulos em Growth Tracker com estética medieval/retro-futurista.

## 📁 Estrutura de Arquivos

```
├── types.ts                      # Tipos, interfaces e constantes globais
├── astronomicalUtils.ts          # Funções de cálculo astronômico
├── useAstronomicalClock.ts      # Custom hooks para gerenciar estado
├── AstronomicalComponents.tsx   # Componentes reutilizáveis
├── Chapter4Screen.tsx           # Componente principal do capítulo
└── README.md                    # Este arquivo
```

## 🎯 Arquivos por Propósito

### `types.ts`
Centraliza **tipos TypeScript** e **constantes**:
- `AstronomicalClockState` - Estado do relógio
- `ZodiacSign`, `ChapterMetadata` - Estruturas de dados
- `ZODIAC_SIGNS`, `MOON_PHASES`, `DAYS_OF_WEEK` - Constantes astronômicas
- `CHAPTERS_METADATA` - Dados dos capítulos 1-5
- `COLOR_PALETTE` - Design system (cores)

**Uso:**
```typescript
import { AstronomicalClockState, CHAPTERS_METADATA } from './types'
```

---

### `astronomicalUtils.ts`
Funções **puras** para cálculos:

#### Cálculos Lunares
- `calculateLunarAge(date)` - Idade da lua em dias
- `calculateMoonPhaseIndex(date)` - Índice 0-7 da fase
- `calculateMoonIllumination(date)` - Percentual iluminação

#### Zodíaco
- `getZodiacSignByDate(date)` - Signo baseado na data
- `getZodiacSignByName(name)` - Retorna objeto completo do signo

#### Tempo
- `calculateClockAngles(date)` - Ângulos dos ponteiros
- `getDayOfWeek(date)` - Nome do dia em português
- `formatTime(date)` - Formato HH:MM:SS
- `formatDate(date)` - Data em português

#### Estado Completo
- `getCurrentAstronomicalState(date?)` - Retorna `AstronomicalClockState`
- `getDetailedAstronomicalInfo(date?)` - Retorna info expandida

**Uso:**
```typescript
import {
  getCurrentAstronomicalState,
  calculateMoonIllumination,
  getZodiacSignByDate,
} from './astronomicalUtils'

const state = getCurrentAstronomicalState()
const moonPercent = calculateMoonIllumination(new Date())
```

---

### `useAstronomicalClock.ts`
Custom hooks para **gerenciamento de estado**:

#### `useAstronomicalClock(options?)`
Principal hook para relógio em tempo real.

**Opções:**
```typescript
{
  autoUpdate?: boolean        // Atualizar automaticamente (default: true)
  updateInterval?: number     // Intervalo em ms (default: 1000)
  initialDate?: Date         // Data inicial (default: now)
}
```

**Retorna:**
```typescript
{
  clockState: AstronomicalClockState
  detailedInfo: DetailedAstronomicalInfo
  isUpdating: boolean
  setDate: (date: Date) => void
  pause: () => void
  resume: () => void
  reset: () => void
}
```

**Exemplo:**
```typescript
const { clockState, detailedInfo, pause, resume } = useAstronomicalClock({
  autoUpdate: true,
})

return (
  <div>
    <p>Hora: {detailedInfo.formattedTime}</p>
    <button onClick={pause}>Pausar</button>
  </div>
)
```

#### `useSynchronizedClocks(options)`
Gerenciar múltiplos relógios com offsets.

#### `useDateHistory(options?)`
Histórico de datas para timeline.

#### `useChapterLoader()`
Gerenciar loading e erros de capítulo.

---

### `AstronomicalComponents.tsx`
Componentes reutilizáveis e compostos:

#### `ClockHand`
Ponteiro individual do relógio.

**Props:**
```typescript
{
  angle: number        // Ângulo de rotação
  length: string       // "35%", "45%", etc
  width: string        // "3px", "2px", etc
  color: string        // Cor em hex
  label?: string       // Tooltip
}
```

#### `MoonPhaseDisplay`
Exibe fase lunar com iluminação.

**Props:**
```typescript
{
  phaseIndex: number              // 0-7
  size?: 'sm' | 'md' | 'lg'      // Tamanho
  showLabel?: boolean             // Mostrar nome (default: true)
  showIllumination?: boolean      // % iluminação (default: true)
}
```

**Exemplo:**
```tsx
<MoonPhaseDisplay phaseIndex={clockState.moonPhase} size="md" />
```

#### `ZodiacDisplay`
Exibe signo do zodíaco com símbolo.

**Props:**
```typescript
{
  signName: string
  size?: 'sm' | 'md' | 'lg'
  showDateRange?: boolean
  showSymbolOnly?: boolean
}
```

#### `InfoSection`
Container para informações (reutilizável).

**Props:**
```typescript
{
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  variant?: 'default' | 'subtle' | 'highlight'
}
```

**Exemplo:**
```tsx
<InfoSection
  icon={<span>🌙</span>}
  title="Fase Lunar"
  variant="highlight"
>
  <MoonPhaseDisplay phaseIndex={moonIndex} />
</InfoSection>
```

#### `ChapterHeader`
Header padronizado para capítulos.

#### `NavigationButtons`
Botões de navegação entre capítulos.

#### `OrnamentalDivider`
Divisor decorativo (linha, pontos ou símbolos).

---

### `Chapter4Screen.tsx`
Componente principal que integra tudo.

**Props:**
```typescript
{
  chapterNumber?: number              // Qual capítulo (default: 4)
  onNavigate?: (dir: 'prev' | 'next') => void
}
```

**Uso no seu blog:**
```tsx
import Chapter4Screen from '@/components/Chapter4Screen'

export default function BlogChapter4() {
  const handleNavigate = async (direction: 'prev' | 'next') => {
    // Navegar para outro capítulo
    if (direction === 'next') {
      // Ir para capítulo 5
    }
  }

  return <Chapter4Screen chapterNumber={4} onNavigate={handleNavigate} />
}
```

---

## 🔧 Integração no Growth Tracker

### Opção 1: Página Dinâmica (Recomendado)

**Arquivo:** `app/blog/capitulo/[number]/page.tsx`

```typescript
'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Chapter4Screen from '@/components/Chapter4Screen'
import { CHAPTERS_METADATA } from '@/components/astronomical/types'

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const chapterNumber = parseInt(params.number as string) || 1

  const handleNavigate = async (direction: 'prev' | 'next') => {
    const nextChapter = direction === 'next' ? chapterNumber + 1 : chapterNumber - 1

    if (nextChapter >= 1 && nextChapter <= 12) {
      router.push(`/blog/capitulo/${nextChapter}`)
    }
  }

  return <Chapter4Screen chapterNumber={chapterNumber} onNavigate={handleNavigate} />
}
```

### Opção 2: Página Estática (Growth Tracker TV)

**Arquivo:** `app/gt-tv/capitulo-4/page.tsx`

```typescript
'use client'

import Chapter4Screen from '@/components/Chapter4Screen'

export default function TVChapter4() {
  return <Chapter4Screen chapterNumber={4} />
}
```

---

## 🎨 Customização

### Alterar Cores
Edite `COLOR_PALETTE` em `types.ts`:

```typescript
export const COLOR_PALETTE = {
  gold: '#D4AF37',           // Cor principal
  darkGold: '#8B6F47',       // Acentos
  // ... adicione suas cores
}
```

### Adicionar Novo Capítulo
Edite `CHAPTERS_METADATA` em `types.ts`:

```typescript
5: {
  number: 5,
  title: 'Meu Novo Capítulo',
  subtitle: 'Subtítulo',
  description: 'Descrição longa...',
  estimatedReadTime: '10 minutos',
  difficulty: 'Intermediário',
}
```

### Personalizar Componente
Use `AstronomicalComponents` separadamente:

```tsx
import {
  ClockHand,
  MoonPhaseDisplay,
  InfoSection,
} from '@/components/AstronomicalComponents'
import { useAstronomicalClock } from '@/hooks/useAstronomicalClock'

export function CustomClock() {
  const { clockState } = useAstronomicalClock()

  return (
    <InfoSection icon="🌙" title="Meu Relógio">
      <MoonPhaseDisplay phaseIndex={clockState.moonPhase} />
    </InfoSection>
  )
}
```

---

## 📊 Cálculos Astronômicos

### Fase Lunar
Usa o ciclo lunar de **29.5306 dias** com referência ao ano 2000 (J2000). Implementa 8 fases:
0. Nova
1. Crescente
2. Quarto Crescente
3. Gibosa Crescente
4. Cheia
5. Gibosa Minguante
6. Quarto Minguante
7. Crescente Minguante

### Zodíaco
Baseado nas datas de transição real:
- Áries: 21 Mar - 20 Abr
- Touro: 21 Abr - 20 Mai
- ... (12 signos)

### Ângulos do Relógio
- **Hora:** 30°/hora + 0.5°/minuto
- **Minuto:** 6°/minuto + 0.1°/segundo
- **Segundo:** 6°/segundo

---

## 🚀 Performance

- **Re-renders otimizados** com `useCallback` e `useMemo` onde necessário
- **Intervalo de atualização** padrão: 1000ms (ajustável)
- **SVG estático** para relógio (eficiente)
- **Padrão CSS** para ornamentação (sem imagens)

---

## 🧪 Exemplos Avançados

### Relógio Astronômico Customizado

```tsx
'use client'

import {
  ClockHand,
  MoonPhaseDisplay,
  ZodiacDisplay,
} from '@/components/AstronomicalComponents'
import { useAstronomicalClock } from '@/hooks/useAstronomicalClock'
import { calculateClockAngles } from '@/lib/astronomicalUtils'

export function CustomAstronomicalDisplay() {
  const { clockState } = useAstronomicalClock()
  const angles = calculateClockAngles(new Date())

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h3>Hora Atual</h3>
        <div className="relative w-32 h-32 border-2 border-gold rounded-full">
          {/* Seus ponteiros aqui */}
          <ClockHand angle={angles.hour} length="40%" width="3px" color="#8B6F47" />
          <ClockHand angle={angles.minute} length="50%" width="2px" color="#5C4A2F" />
        </div>
      </div>

      <div>
        <h3>Lua</h3>
        <MoonPhaseDisplay phaseIndex={clockState.moonPhase} size="lg" />
      </div>

      <div>
        <h3>Zodíaco</h3>
        <ZodiacDisplay signName={clockState.zodiacSign} size="lg" />
      </div>
    </div>
  )
}
```

### Timeline de Datas

```tsx
import { useDateHistory } from '@/hooks/useAstronomicalClock'

export function DateTimeline() {
  const { history, goToDate, currentIndex } = useDateHistory({ maxHistory: 20 })

  return (
    <div className="space-y-2">
      {history.map((date, index) => (
        <button
          key={index}
          onClick={() => goToDate(index)}
          className={index === currentIndex ? 'bg-gold' : 'bg-gray-200'}
        >
          {date.toLocaleDateString('pt-BR')}
        </button>
      ))}
    </div>
  )
}
```

---

## ✅ Checklist para Integração

- [ ] Copiar arquivos para `components/astronomical/`
- [ ] Adicionar imports corretos no seu componente
- [ ] Testar em modo light e dark
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Verificar animações (atualização a cada segundo)
- [ ] Customizar cores se necessário
- [ ] Integrar com seu sistema de navegação de capítulos

---

## 📝 Notas

- **Sem dependências externas** além de React (usa Lucide para alguns ícones)
- **TypeScript full** para segurança de tipos
- **Dark mode ready** com variáveis Tailwind
- **Acessível** com labels, roles, e estrutura semântica
- **Sem localStorage** (mantém estado em memória durante sessão)

---

**Desenvolvido com ❤️ para Growth Tracker**

Para questões técnicas ou sugestões, abra uma issue no repositório.
