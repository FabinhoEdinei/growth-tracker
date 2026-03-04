---

title: "Behind the Scenes: Design do Jornal Vintage"
slug: "design-jornal-vintage"
date: "2026-03-05"
author: "Fabio Edinei"
category: "Jornada"
excerpt: "O processo criativo por trás da recriação de um jornal parisiense do início do século XX em componentes React modulares."

---

Behind the Scenes: Design do Jornal Vintage

> "A nostalgia é um arquivo que remove as partes ruins dos bons dias passados." — Doug Larson

O Desafio

Tudo começou quando precisei criar uma nova tela para o Growth Tracker — um item de menu chamado "Jornal". O pedido era específico: recriar o layout de um jornal antigo parisiense, onde cada anúncio circulado em azul deveria ser um módulo independente, capaz de ser montado individualmente mas mantendo a coerência visual do layout original.

A referência? Uma página de jornal francesa do início do século XX, repleta de anúncios elegantes de perfumes, flores, joias, moda e produtos de luxo. Cada elemento tinha sua própria personalidade, mas todos conversavam visualmente através de uma estética comum: tipografia serifada, ornamentos decorativos, bordas elaboradas e aquele tom sepia característico do papel envelhecido.

A Análise

O primeiro passo foi estudar meticulosamente a imagem de referência. Identifiquei 8 módulos distintos:

1. Header Principal — "FLEURS DE MOUSSE" com moldura dupla e detalhes ornamentais
2. Card de Perfume — Dois produtos lado a lado com divisória central
3. Card de Flores — Com ilustração de vaso e preços em destaque
4. Card Ópera-Bijou — Joalheria com borda dupla e lista de especialidades
5. Card de Moda — Dama elegante com informações de lojas
6. Card Sabonete — Moldura ornamentada com retrato feminino
7. Card Champagne — Layout promocional com preços em colunas
8. Card Biscuits — Design em duas colunas com contraste tipográfico

Cada um desses elementos precisava ser um componente React independente, com props configuráveis, mas mantendo a estética vintage que os unificava.

Decisões de Design

Paleta de Cores

Optei por uma paleta que evocasse o papel envelhecido e a tinta de impressão antiga:

- Background: `#f5f0e6` — Papel amarelado
- Texto Principal: `#2c2416` — Preto suave envelhecido
- Texto Secundário: `#5c4a32` — Marrom acinzentado
- Destaques: `#c9b896` — Dourado envelhecido
- Bordas: `#d4c4a8` — Bege médio

Tipografia

A escolha das fontes foi crucial para capturar a essência do jornal antigo:

- Títulos: Playfair Display — Serifada elegante com contrastes marcantes
- Corpo: Old Standard TT — Clássica, legível, com ar de tipografia de livro antigo

Elementos Decorativos

Cada card recebeu ornamentos característicos:

- Flores tipográficas (❦, ❧, ✦) como separadores
- Bordas duplas e simples para criar hierarquia
- Linhas decorativas com gradiente para suavizar transições
- Textura de papel sutil no background usando CSS patterns

O Processo de Implementação

1. Estrutura Base

Comecei criando o componente `JornalHeader` como peça central. Ele estabelecia o tom: fundo escuro (`#2c2416`), texto claro (`#f5f0e6`), borda interna dourada e aquele layout simétrico típico dos headers de jornal da época.

```tsx
<div className="w-full bg-[#2c2416] text-[#f5f0e6] p-4 md:p-6">
  <div className="border-2 border-[#c9b896] p-3 md:p-4">
    {/* ... */}
  </div>
</div>
```

2. SVGs como Ilustrações

Para as ilustrações (vaso de flores, dama elegante, retrato feminino), optei por SVGs inline em vez de imagens. Isso garantia:

- Escalabilidade perfeita em qualquer resolução
- Cores que se adaptam ao tema
- Performance otimizada (sem requisições externas)
- Facilidade de personalização via props

O card de flores, por exemplo, tem um SVG de vaso com círculos representando flores, linhas para caules e elipses para folhas — tudo desenhado à mão no código.

3. Modularização

Cada card foi projetado como um módulo autocontido:

```tsx
interface PerfumeCardProps {
  brand?: string;
  product1?: { name: string; subtitle: string };
  product2?: { name: string; subtitle: string };
  manufacturer?: string;
}
```

Isso permitia que qualquer card fosse usado isoladamente em outras partes da aplicação, ou combinado no layout completo do jornal.

4. Layout Responsivo

O grid do jornal precisava funcionar tanto em desktop quanto mobile:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Coluna Esquerda */}
  <div className="space-y-4">
    <PerfumeCard {...data.perfume} />
    <FashionCard {...data.fashion} />
    <ChampagneCard {...data.champagne} />
  </div>
  {/* Coluna Direita */}
  <div className="space-y-4">
    <FlowersCard {...data.flowers} />
    <OperaCard {...data.opera} />
    <SoapCard {...data.soap} />
    <BiscuitCard {...data.biscuit} />
  </div>
</div>
```

Em mobile, as colunas se empilham verticalmente. Em desktop, mantêm o layout de jornal tradicional.

Desafios Encontrados

O CSS Vintage

O maior desafio foi fazer o CSS parecer "antigo" sem parecer "desatualizado". As bordas precisavam ser grossas mas elegantes. Os espaçamentos precisavam ser generosos mas não excessivos. As cores precisavam ser quentes mas não saturadas demais.

A solução veio com a criação de classes utilitárias específicas:

```css
.decorative-line {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #2c2416 20%,
    #2c2416 80%,
    transparent 100%
  );
}
```

Consistência Visual

Com 8 módulos diferentes, manter a consistência era crucial. Criei um sistema de:

- Padding padronizado: `p-3 md:p-4` em todos os cards
- Bordas consistentes: `border-2 border-[#2c2416]` como padrão
- Tipografia hierárquica: Títulos em `font-newspaper`, corpo em `font-newspaper-body`
- Ornamentos padronizados: Cada card termina com um símbolo decorativo

O Tema Sepia

A textura de papel foi criada com um pattern CSS sutil:

```css
.paper-texture {
  background-image: 
    linear-gradient(rgba(139, 105, 20, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 105, 20, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

Isso adiciona uma grade quase imperceptível que evoca a fibra do papel antigo.

O Resultado

O Jornal final é uma recriação fiel da estética parisiense do início do século XX, mas implementada com tecnologia moderna:

- React + TypeScript para tipagem segura e componentização
- Tailwind CSS para estilização eficiente e responsiva
- SVG inline para ilustrações escaláveis
- Props configuráveis para cada módulo

Cada card pode ser usado isoladamente, mas quando montados juntos, criam aquela experiência imersiva de folhear um jornal antigo — com o cheiro de café e a sensação de papel grosso entre os dedos.

Aprendizados

1. A referência é sagrada: Estudar cada detalhe da imagem original revelou padrões que não seriam óbvios à primeira vista — como a simetria dos ornamentos, o contraste entre bordas grossas e finas, e o uso estratégico do espaço em branco.

2. Modularidade exige planejamento: Pensar em cada elemento como um módulo independente desde o início economizou horas de refatoração posterior.

3. O detalhe faz a diferença: Pequenos toques como os ornamentos tipográficos, as bordas duplas e a textura de papel transformam um layout comum em uma experiência imersiva.

4. CSS é poderoso: Não precisamos de imagens pesadas para criar ilustrações elegantes — SVGs bem desenhados e CSS cuidadoso podem criar resultados surpreendentes.

Conclusão

O Jornal Vintage é mais do que uma tela — é uma viagem no tempo. Cada card conta uma história: do perfumista parisiense ao joalheiro da Ópera, do fabricante de luvas premiado ao produtor de champagne de Épernay.

E agora, todos esses elementos podem ser remixados, reconfigurados e reimaginados, mantendo sempre aquela elegância atemporal que só um jornal antigo pode transmitir.

---

"O design não é apenas como algo parece. É como funciona." — Steve Jobs

Data de publicação: 05 de Março de 2026

Projeto: Growth Tracker — Módulo Jornal

Stack: React, TypeScript, Tailwind CSS, SVG