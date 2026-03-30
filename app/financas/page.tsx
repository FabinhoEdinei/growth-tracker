'use client'

import { useState, useEffect, useRef, useCallback } from "react";

// ── Fonte monospace via Google Fonts ─────────────────────────────────────────
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap";
document.head.appendChild(FONT_LINK);

// ── Paleta base ───────────────────────────────────────────────────────────────
const C = {
  bg:      "#020a04",
  panel:   "rgba(0,255,65,0.04)",
  border:  "rgba(0,255,65,0.18)",
  green:   "#00ff41",
  dim:     "#00a82b",
  dimmer:  "#005515",
  pink:    "#ff6b9d",
  cyan:    "#00d4ff",
  gold:    "#ffd700",
  red:     "#ff4444",
  white:   "#e8ffe8",
};

// ── Conteúdo do curso ─────────────────────────────────────────────────────────
const MODULOS = [
  {
    id: "m0",
    titulo: "BOOT · Visão Geral do Sistema",
    icone: "⚡",
    cor: C.green,
    nivel: "FUNDAMENTOS",
    duracao: "5 min",
    secoes: [
      {
        titulo: "O que é a GT TV Empresarial",
        conteudo: `A GT TV Empresarial é um sistema de comunicação corporativa em tempo real integrado ao Growth Tracker. Funciona como uma emissora interna: cada departamento tem seu próprio canal com slides configuráveis, ticker de notícias ao vivo e transmissão contínua.

ARQUITETURA DO SISTEMA:
━━━━━━━━━━━━━━━━━━━━━━
  /app/tv-empresarial/page.tsx     ← Tela principal da TV
  /hooks/useChannelConfig.ts       ← Estado global dos canais
  /app/api/manga-tv/route.ts       ← API de conteúdo dinâmico
  /app/components/tv/              ← Componentes reutilizáveis

FLUXO DE DADOS:
  useChannelConfig → localStorage → estado React → UI`,
        dica: "💡 O estado dos canais persiste no localStorage com a chave 'gt_canais_v1'. Você pode inspecionar pelo DevTools → Application → Local Storage.",
      },
      {
        titulo: "Canais disponíveis e suas identidades",
        conteudo: `MAPA DE CANAIS ATIVOS:
━━━━━━━━━━━━━━━━━━━━━
  📺  GT   · GT Network       → #a855f7  Canal central
  👥  RH   · Recursos Humanos → #00d4ff  Gestão de pessoas
  ✅  QA   · Qualidade        → #00ff88  Indicadores e normas
  ⚙️  ENG  · Engenharia       → #ffd700  Projetos e ECNs
  📦  PCP  · Planejamento     → #ff8c42  Produção e estoque
  🦺  SEG  · Segurança        → #ff4d6d  DDS e EPIs
  🎯  GG   · Gestão Geral     → #c084fc  KPIs e resultados
  📖  MGK  · GT Manga         → #ff6b9d  Canal de manga

Cada canal tem: cor primária, cor de background (corBg),
ícone, sigla, e uma lista de CanalSlide[].`,
        dica: "💡 A cor do canal define: borda do botão, glow, progress bar, badge e HUD. Mudar uma cor muda tudo visualmente.",
      },
    ],
  },
  {
    id: "m1",
    titulo: "OPERAÇÃO · Controles em Tempo Real",
    icone: "🎮",
    cor: C.cyan,
    nivel: "OPERAÇÃO",
    duracao: "8 min",
    secoes: [
      {
        titulo: "Navegação por teclado (modo avançado)",
        conteudo: `MAPA COMPLETO DE ATALHOS:
━━━━━━━━━━━━━━━━━━━━━━━━
  ←  ArrowLeft    → Slide anterior
  →  ArrowRight   → Próximo slide
  SPACE           → Pausar / Retomar slideshow
  C               → Abrir/fechar seletor de canais
  ESC             → (no MangaReader) voltar à lista

COMPORTAMENTO DO TIMER:
  • O intervalo de 8000ms (SLIDE_MS) reinicia ao trocar canal
  • Pausar congela o ProgressBar via requestAnimationFrame
  • O timer usa setInterval + paused flag — não acumula drift

COMO MODIFICAR O INTERVALO:
  // app/tv-empresarial/page.tsx — linha 6
  const SLIDE_MS = 8000; // ← altere aqui (ms)`,
        dica: "💡 Para telas de refeitório, recomenda-se 12000ms (12s). Para painéis de gestão com mais info, 6000ms funciona bem.",
      },
      {
        titulo: "Seletor de canais lateral",
        conteudo: `O seletor lateral é o componente <ChannelSelector>.

COMPORTAMENTO:
  • Largura: 0px (fechado) → 72px (aberto)
  • Transição: cubic-bezier(.4,0,.2,1) 350ms
  • A área de slides se desloca com: left: offset (0 ou 72px)
  • Clicar num canal: muda canalAtivo + fecha seletor + reseta cur=0

ADICIONAR UM NOVO CANAL AO SELETOR:
  1. Adicione o CanalId ao type em useChannelConfig.ts
  2. Crie o objeto Canal em CANAIS_DEFAULT[]
  3. O seletor renderiza automaticamente todos canais onde c.ativo === true

OCULTAR UM CANAL SEM DELETAR:
  // No objeto Canal, mude:
  ativo: false  // some do seletor, mantém os dados`,
        dica: "💡 A ordem dos canais no seletor segue a ordem em CANAIS_DEFAULT[]. Para reordenar, mude a posição no array.",
      },
      {
        titulo: "Pause, ProgressBar e animações de slide",
        conteudo: `A ProgressBar usa requestAnimationFrame para animação fluida.

ANATOMIA DA PROGRESSBAR:
  st.current   → timestamp de início
  pm.current   → ms acumulados em pause
  pa.current   → timestamp de quando pausou

CÁLCULO:
  pct = ((now - start - pausedMs) / SLIDE_MS) * 100

ANIMAÇÕES DE ENTRADA/SAÍDA:
  gtEnter: translateX(var(--gt-enter)) → translateX(0)
  gtExit:  translateX(0) → translateX(var(--gt-exit))

  dir='left'  → entra pela direita (100%), sai pela esquerda (-100%)
  dir='right' → entra pela esquerda (-100%), sai pela direita (100%)

TROCAR PARA FADE (sem slide):
  // Substitua as keyframes por:
  @keyframes gtEnter { from{opacity:0} to{opacity:1} }
  @keyframes gtExit  { from{opacity:1} to{opacity:0} }`,
        dica: "💡 O outgoing slide fica no zIndex:1, o incoming no zIndex:2. O busy flag de 480ms evita clicks duplos durante a transição.",
      },
    ],
  },
  {
    id: "m2",
    titulo: "CANAIS · Configuração e Slides",
    icone: "📡",
    cor: C.gold,
    nivel: "CONFIGURAÇÃO",
    duracao: "12 min",
    secoes: [
      {
        titulo: "Estrutura de um CanalSlide",
        conteudo: `INTERFACE COMPLETA:
━━━━━━━━━━━━━━━━━━
interface CanalSlide {
  id:      string;      // identificador único (ex: 'rh-ferias')
  label:   string;      // nome exibido no HUD inferior
  icon:    string;      // emoji do slide
  active:  boolean;     // false = slide oculto, mas não deletado
  order:   number;      // ordem de exibição (0, 1, 2...)
  custom?: {
    titulo: string;     // título grande central
    corpo:  string;     // parágrafo descritivo
    rodape?: string;    // texto pequeno abaixo (ex: 'Canal RH')
  };
  // Campos exclusivos do canal Manga:
  tipo?:   'manga';
  src?:    string;      // '/manga/cap-01/page-01.jpg'
}

CRIAR UM SLIDE VIA CÓDIGO:
  addSlide('rh', {
    id:     'rh-ferias',
    label:  'Férias 2025',
    icon:   '🏖️',
    active: true,
    order:  4,
    custom: {
      titulo: 'Escala de Férias',
      corpo:  'Confira o calendário de férias aprovado.',
      rodape: 'Canal RH · Atualizado em Jan/2025',
    }
  });`,
        dica: "💡 O campo order define a sequência mas os slides são filtrados por active:true e depois sorted por order. Gaps são ok (0, 1, 5, 10...).",
      },
      {
        titulo: "useChannelConfig — API completa do hook",
        conteudo: `MÉTODOS DISPONÍVEIS:
━━━━━━━━━━━━━━━━━━━
  setCanalAtivo(id)              → troca o canal visível
  updateCanal(id, patch)         → atualiza propriedades do canal
  updateSlide(canalId, slideId, patch) → atualiza um slide
  addSlide(canalId, slide)       → adiciona slide ao canal
  removeSlide(canalId, slideId)  → remove slide permanentemente
  injectMangaSlides(slides[])    → injeta slides dinâmicos (sem persist)
  reset()                        → restaura CANAIS_DEFAULT + apaga localStorage

EXEMPLOS PRÁTICOS:

// Mudar cor do canal RH:
updateCanal('rh', { cor: '#ff6b9d' });

// Desativar um slide sem deletar:
updateSlide('rh', 'rh-vagas', { active: false });

// Reordenar slides:
updateSlide('rh', 'rh-vagas', { order: 0 });
updateSlide('rh', 'rh-rotina', { order: 1 });

// Editar conteúdo de um slide:
updateSlide('gt', 'gt-boas-vindas', {
  custom: {
    titulo: 'Bom dia, time!',
    corpo:  'Hoje é segunda. Reunião às 9h.',
    rodape: 'GT Network · 06/01/2025',
  }
});`,
        dica: "💡 Todas as mudanças persistem automaticamente no localStorage via persist(). Não precisa chamar save() ou reload().",
      },
      {
        titulo: "Criar um canal novo do zero",
        conteudo: `PASSO A PASSO COMPLETO:
━━━━━━━━━━━━━━━━━━━━━━
1. Adicionar o ID ao tipo CanalId:
   // hooks/useChannelConfig.ts
   export type CanalId = ... | 'meu-canal';

2. Criar o objeto Canal em CANAIS_DEFAULT:
   {
     id:    'meu-canal',
     nome:  'Meu Canal',
     sigla: 'MC',
     icone: '🚀',
     cor:   '#00ffcc',
     corBg: 'linear-gradient(135deg,#001a15,#000f0c)',
     ativo: true,
     slides: [
       {
         id:    'mc-intro',
         label: 'Introdução',
         icon:  '🚀',
         active: true,
         order: 0,
         custom: {
           titulo: 'Bem-vindo ao Meu Canal',
           corpo:  'Conteúdo personalizado aqui.',
         }
       }
     ],
   }

3. Deploy → canal aparece automaticamente no seletor.

DICA DE COR:
  cor    → hexadecimal vibrante (define glow, border, progress)
  corBg  → linear-gradient escuro para o fundo da TV`,
        dica: "💡 Use o gerador de gradiente: https://cssgradient.io — escolha dois tons muito escuros da mesma família da cor primária.",
      },
    ],
  },
  {
    id: "m3",
    titulo: "ESTÉTICA · Temas e Layout Visual",
    icone: "🎨",
    cor: C.pink,
    nivel: "AVANÇADO",
    duracao: "15 min",
    secoes: [
      {
        titulo: "Anatomia visual da TV — camadas de render",
        conteudo: `A TV é composta por 5 camadas empilhadas (z-index):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  z-index: 0  → corBg (gradiente de fundo do canal)
  z-index: 0  → Glow radial (radial-gradient overlay)
  z-index: 1  → Slide saindo (gtExit animation)
  z-index: 2  → Slide entrando (gtEnter animation)
  z-index: 5  → Overlay de PAUSADO
  z-index: 10 → HUD (header + arrows + footer)
  z-index: 15 → Seletor lateral de canais
  z-index: 20 → GTNewsTicker (ticker de notícias)

COMPONENTES VISUAIS DE CADA SLIDE:
  SlideContent → badge do canal + ícone + título + corpo + rodapé
  SlideContentManga → Image fill + badge + vinheta radial

GLOW DO CANAL (fundo sutil):
  // Cor do canal vazada como luz ambiente:
  background: radial-gradient(
    ellipse at 30% 40%,
    {canal.cor}0a 0%,   ← "0a" = 4% de opacidade
    transparent 60%
  )`,
        dica: "💡 Para aumentar o glow ambiente, mude '0a' para '1a' (10%) ou '2a' (16%). Valores acima de '33' ficam muito pesados.",
      },
      {
        titulo: "Trocar o tema visual completo da TV",
        conteudo: `RECEITA: TEMA CYBERPUNK VERMELHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Trocar cor do canal principal:
updateCanal('principal', {
  cor:   '#ff0044',
  corBg: 'linear-gradient(135deg,#1a0005,#0a0003)',
});

// 2. Trocar a animação de transição (em page.tsx):
@keyframes gtEnter {
  from { transform: translateY(100%); opacity: 0.3; }
  to   { transform: translateY(0);    opacity: 1;   }
}

RECEITA: TEMA HOLOGRÁFICO AZUL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
updateCanal('principal', {
  cor:   '#00d4ff',
  corBg: 'linear-gradient(135deg,#000d1a,#00060f)',
});
// Adicionar scanlines no fundo:
// position:absolute, inset:0
// background: repeating-linear-gradient(
//   0deg,
//   transparent, transparent 2px,
//   rgba(0,212,255,0.03) 2px, rgba(0,212,255,0.03) 4px
// )

RECEITA: TEMA CORPORATIVO LIMPO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
corBg: 'linear-gradient(135deg,#0a0a14,#060610)'
cor:   '#6366f1'  // índigo`,
        dica: "💡 A variável corBg aceita qualquer valor CSS válido: linear-gradient, radial-gradient, ou até uma cor sólida como '#000000'.",
      },
      {
        titulo: "Customizar o HUD — header, footer e setas",
        conteudo: `O HUD fica em z-index:10 e desaparece após 4.5s de inatividade.
O tempo é controlado por nudgeUI() com setTimeout de 4500ms.

MUDAR TEMPO DE VISIBILIDADE DO HUD:
  // page.tsx — dentro de nudgeUI():
  uiRef.current = setTimeout(() => setShowUI(false), 4500);
  //                                                  ↑ altere aqui

TORNAR HUD PERMANENTE (sempre visível):
  // Remova o setTimeout e force showUI=true:
  const [showUI] = useState(true); // sem setter

ESTILIZAR AS SETAS DE NAVEGAÇÃO:
  // Encontre o map(['prev','next']) e altere o style:
  width: 48,          // maior
  height: 48,
  borderRadius: 8,    // quadrado arredondado ao invés de círculo
  fontSize: 18,
  background: \`\${canal.cor}22\`,
  border: \`1.5px solid \${canal.cor}55\`,

OCULTAR AS SETAS COMPLETAMENTE:
  // Envolva o map em:
  {!isMangaChannel && (['prev','next']...).map(...)}`,
        dica: "💡 O HUD respeita a largura do seletor via 'left: offset'. Se o seletor estiver aberto, o HUD recua automaticamente.",
      },
      {
        titulo: "Customizar o SlideContent — layout dos slides",
        conteudo: `ESTRUTURA DO SLIDE PADRÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━
  [ BADGE DO CANAL   ]   ← display:inline-flex, borderRadius:20
  [ 🎯 ÍCONE GRANDE  ]   ← fontSize:42, filter:drop-shadow
  [ TÍTULO H2        ]   ← clamp(18px, 4vw, 26px)
  [ Corpo parágrafo  ]   ← fontSize:13, maxWidth:480
  [ RODAPÉ           ]   ← fontSize:9, letterSpacing:2

MUDAR TAMANHO DO ÍCONE:
  // No SlideContent, encontre:
  fontSize:42, marginBottom:14
  // Altere para 64px para destaque maior

ADICIONAR IMAGEM DE FUNDO POR SLIDE:
  // No SlideContent, antes do return:
  if (slide.custom?.bgImage) {
    return (
      <div style={{
        position:'absolute', inset:0,
        backgroundImage: \`url(\${slide.custom.bgImage})\`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.4)',
      }}/>
      // ...resto do conteúdo por cima
    );
  }

MUDAR A FONTE DO TÍTULO:
  // Substitua -apple-system por:
  fontFamily: "'Orbitron', monospace"  // sci-fi
  fontFamily: "'Georgia', serif"       // editorial
  fontFamily: "'Courier New', monospace" // terminal`,
        dica: "💡 O clamp(18px, 4vw, 26px) no título garante responsividade: em mobile fica 18px, em telas grandes cresce até 26px.",
      },
    ],
  },
  {
    id: "m4",
    titulo: "MANGA TV · Canal Dinâmico",
    icone: "📖",
    cor: C.pink,
    nivel: "AVANÇADO",
    duracao: "10 min",
    secoes: [
      {
        titulo: "Como o canal GT Manga funciona",
        conteudo: `O canal Manga é o único canal DINÂMICO da TV.
Os outros canais têm slides fixos no código. O Manga carrega
suas páginas em runtime via API.

FLUXO COMPLETO:
━━━━━━━━━━━━━━━
  1. Usuário seleciona canal MGK
  2. useMangaLoader() detecta canalAtivo === 'manga'
  3. Faz fetch('/api/manga-tv')
  4. API lê /public/manga/cap-01/ com fs.readdirSync()
  5. Retorna [{index, src, label}] ordenado alfabeticamente
  6. useMangaLoader chama injectMangaSlides(slides[])
  7. injectMangaSlides() faz setCanais() sem persist
     (não salva no localStorage — é sempre re-carregado da pasta)
  8. O canal exibe as imagens como SlideContentManga

POR QUE SEM PERSIST?
  As imagens podem mudar (novo capítulo, novas páginas).
  Recalcular sempre garante que a TV reflita o estado atual
  do /public sem precisar resetar o localStorage.`,
        dica: "💡 O hook tem loaded.current = useRef(false) — carrega só uma vez por sessão. Para recarregar sem reload, mude para useState(false) e adicione um botão de refresh.",
      },
      {
        titulo: "Adicionar Capítulo 2 ao canal Manga",
        conteudo: `ESTRATÉGIA 1 — Um canal por capítulo:
  Crie 'manga-cap2' como novo CanalId com dynamic:true
  e uma API /api/manga-tv-cap2 apontando para /public/manga/cap-02/

ESTRATÉGIA 2 — Seletor de capítulo dentro do canal:
  Adicione um state capAtivo ao useMangaLoader:

  // Em page.tsx, antes do componente principal:
  const [mangaCap, setMangaCap] = useState('cap-01');

  // No fetch:
  fetch(\`/api/manga-tv?cap=\${mangaCap}\`)

  // Na API (route.ts), ler o query param:
  const { searchParams } = new URL(request.url);
  const cap = searchParams.get('cap') ?? 'cap-01';
  const MANGA_DIR = path.join(process.cwd(),'public','manga', cap);

ESTRUTURA DE PASTAS RECOMENDADA:
  public/
  └── manga/
      ├── cap-01/
      │   ├── 001.jpg
      │   ├── 002.jpg
      │   └── ...
      ├── cap-02/
      │   └── ...
      └── cap-03/`,
        dica: "💡 As imagens são ordenadas com localeCompare + numeric:true. Nomeie sempre com zero-pad: 001.jpg, 002.jpg... para garantir ordem correta.",
      },
      {
        titulo: "Customizar o visual do canal Manga na TV",
        conteudo: `O SlideContentManga renderiza:
  • Image fill com objectFit:'contain'
  • Badge no topo com sigla + label da página
  • Vinheta radial nas bordas para profundidade

TORNAR A IMAGEM FILL (sem barras laterais):
  // SlideContentManga — troque:
  objectFit: 'contain'  →  objectFit: 'cover'

MUDAR A COR DA VINHETA:
  // No radial-gradient da vinheta:
  background: \`radial-gradient(
    ellipse at center,
    transparent 55%,
    #1a0010 100%   ← use a mesma cor do corBg do canal
  )\`

OCULTAR O BADGE DE PÁGINA:
  // Remova o primeiro div do SlideContentManga (posição absolute top:10)

ADICIONAR NÚMERO DA PÁGINA GRANDE:
  // No SlideContentManga, após o Image:
  <div style={{
    position:'absolute', bottom:20, right:20, zIndex:3,
    fontFamily:"'Orbitron',monospace", fontSize:11,
    color: canal.cor, opacity:0.7, letterSpacing:2,
  }}>
    {slide.label.toUpperCase()}
  </div>`,
        dica: "💡 O padding do container de slides é '48px 0 8px' para manga vs '56px 24px 16px' para slides normais — isso dá mais espaço à imagem.",
      },
    ],
  },
  {
    id: "m5",
    titulo: "TICKER · GTNewsTicker Avançado",
    icone: "📰",
    cor: "#ff8c42",
    nivel: "COMPONENTES",
    duracao: "8 min",
    secoes: [
      {
        titulo: "Como o GTNewsTicker funciona",
        conteudo: `O GTNewsTicker é um componente independente fixo no bottom:0.
Roda uma faixa de texto em loop contínuo.

USO NA TV:
  <GTNewsTicker speed={80} height={TICKER_H} controls={false}/>

PROPS DISPONÍVEIS:
  speed:    number  → px/s de velocidade (padrão: 80)
  height:   number  → altura em px (padrão: 44)
  controls: boolean → mostrar botões pause/play (padrão: true)

LOCALIZAÇÃO DO COMPONENTE:
  /app/components/tv/GTNewsTicker.tsx

COMO EDITAR AS NOTÍCIAS DO TICKER:
  Dentro do GTNewsTicker, procure o array de textos:
  const NEWS_ITEMS = [
    "🔴 AO VIVO · Reunião geral às 15h",
    "📦 PCP · Meta de produção 98% atingida",
    // adicione aqui
  ];

TORNAR AS NOTÍCIAS DINÂMICAS (fetch da API):
  useEffect(() => {
    fetch('/api/noticias').then(r=>r.json()).then(setNews);
  }, []);`,
        dica: "💡 O height do ticker (TICKER_H = 44) é usado como bottom offset em toda a TV. Mudar o height exige atualizar a constante em page.tsx também.",
      },
      {
        titulo: "Personalizar o visual do ticker",
        conteudo: `O ticker padrão tem fundo escuro com texto colorido.

MUDAR A COR DO TICKER PARA ACOMPANHAR O CANAL:
  // Em page.tsx, passe a cor do canal:
  <GTNewsTicker
    speed={80}
    height={TICKER_H}
    controls={false}
    accentColor={canal.cor}   ← adicione esta prop
  />

  // Em GTNewsTicker.tsx, receba e use:
  function GTNewsTicker({ accentColor = '#ff0044', ...props }) {
    // use accentColor no estilo do texto e borda

ESTILO BREAKING NEWS (fundo vermelho pulsante):
  background: '#ff0000'
  animation: 'pulse 1s ease-in-out infinite'
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.85; }
  }

ADICIONAR ÍCONE "AO VIVO" PULSANTE:
  <span style={{
    animation: 'blink 1s step-end infinite',
    color: '#ff0044', marginRight: 8,
  }}>● AO VIVO</span>`,
        dica: "💡 O ticker usa z-index:20, acima de tudo. Para sobrepor algo ao ticker (ex: modal), use z-index:21 ou superior.",
      },
    ],
  },
  {
    id: "m6",
    titulo: "UPGRADES · Funcionalidades Futuras",
    icone: "🚀",
    cor: "#a855f7",
    nivel: "ROADMAP",
    duracao: "10 min",
    secoes: [
      {
        titulo: "Upgrade 1 — Editor visual de slides (drag & drop)",
        conteudo: `STATUS: 🟡 Planejado

COMO IMPLEMENTAR:
  Criar /app/tv-empresarial/editor/page.tsx com:

  1. Lista de slides com @dnd-kit/core para reordenar
  2. Formulário inline para editar titulo/corpo/rodape
  3. Toggle active por slide
  4. Preview ao vivo do slide editado

  // Instalar:
  pnpm add @dnd-kit/core @dnd-kit/sortable

  // Uso básico:
  import { DndContext, closestCenter } from '@dnd-kit/core';
  import { SortableContext } from '@dnd-kit/sortable';

  <DndContext onDragEnd={handleDragEnd}>
    <SortableContext items={slides.map(s=>s.id)}>
      {slides.map(s => <SortableSlideItem key={s.id} slide={s}/>)}
    </SortableContext>
  </DndContext>

PERSISTÊNCIA:
  Cada onChange chama updateSlide() que persiste no localStorage.
  Zero backend necessário.`,
        dica: "💡 O /tv-empresarial/config já existe no projeto. Você pode expandir essa rota ao invés de criar uma nova.",
      },
      {
        titulo: "Upgrade 2 — Agendamento de slides por horário",
        conteudo: `STATUS: 🟡 Planejado

CONCEITO:
  Cada slide tem um campo schedule opcional:
  { horaInicio: '08:00', horaFim: '12:00', diasSemana: [1,2,3,4,5] }

IMPLEMENTAÇÃO:
  // Estender CanalSlide:
  schedule?: {
    horaInicio: string;  // '08:00'
    horaFim:    string;  // '18:00'
    diasSemana: number[]; // 0=dom, 1=seg...
  };

  // Hook useScheduledSlides:
  function useScheduledSlides(slides: CanalSlide[]) {
    const now = new Date();
    const hora = \`\${now.getHours()}:\${now.getMinutes()}\`;
    const dia  = now.getDay();
    return slides.filter(s => {
      if (!s.schedule) return s.active;
      const { horaInicio, horaFim, diasSemana } = s.schedule;
      return s.active
        && diasSemana.includes(dia)
        && hora >= horaInicio
        && hora <= horaFim;
    });
  }

  // No componente TvEmpresarial:
  const slides = useScheduledSlides(
    canal.slides.sort((a,b)=>a.order-b.order)
  );`,
        dica: "💡 Para atualizar a lista de slides ativos a cada minuto, use setInterval de 60000ms que force um re-render ou chame o hook dentro de um state de clock.",
      },
      {
        titulo: "Upgrade 3 — Temas globais com CSS Variables",
        conteudo: `STATUS: 🟢 Implementável hoje

CONCEITO:
  Ao invés de espalhar cores por todo o código, centralizar
  em CSS custom properties no :root.

IMPLEMENTAÇÃO:
  // globals.css ou layout.tsx:
  :root {
    --tv-bg:       #020a04;
    --tv-green:    #00ff41;
    --tv-ticker-h: 44px;
    --tv-font:     'Share Tech Mono', monospace;
    --tv-radius:   12px;
    --tv-blur:     blur(12px);
  }

  // Tema alternativo:
  [data-theme="corporate"] {
    --tv-bg:    #0a0a14;
    --tv-green: #6366f1;
  }

TROCAR TEMA DINAMICAMENTE:
  document.documentElement.setAttribute('data-theme', 'corporate');

TEMAS PRONTOS PARA IMPLEMENTAR:
  'cyberpunk'  → verde neon, fundo preto, scanlines
  'corporate'  → índigo, fundo navy, sem efeitos
  'hacker'     → verde terminal, grain texture
  'hologram'   → ciano, partículas, blur pesado
  'broadcast'  → vermelho, estilo CNN/TV aberta`,
        dica: "💡 Combinar data-theme com localStorage permite que cada TV em cada tela da empresa tenha seu próprio tema sem mudar o código.",
      },
      {
        titulo: "Upgrade 4 — Conteúdo via Supabase (real-time)",
        conteudo: `STATUS: 🔵 Intermediário (requer Supabase configurado)

CONCEITO:
  Os slides deixam de viver no localStorage e passam para
  uma tabela Supabase com realtime subscription.

SCHEMA SUGERIDO:
  CREATE TABLE tv_slides (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    canal_id   text NOT NULL,
    label      text,
    icon       text,
    titulo     text,
    corpo      text,
    rodape     text,
    active     boolean DEFAULT true,
    ordem      int DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );

HOOK useLiveSlides:
  import { createClient } from '@/lib/supabase/client';

  function useLiveSlides(canalId: string) {
    const [slides, setSlides] = useState([]);
    useEffect(() => {
      const sub = supabase
        .channel('tv_slides')
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'tv_slides',
          filter: \`canal_id=eq.\${canalId}\`
        }, payload => {
          // atualizar estado local
        })
        .subscribe();
      return () => sub.unsubscribe();
    }, [canalId]);
    return slides;
  }`,
        dica: "💡 Com Supabase realtime, mudanças no painel admin aparecem na TV em <1s sem reload — ideal para comunicados urgentes.",
      },
    ],
  },
];

// ── Utilitário: efeito de digitação ──────────────────────────────────────────
function useTypewriter(text, speed = 8) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { displayed, done };
}

// ── Componente: linha de terminal com prompt ──────────────────────────────────
function TermLine({ children, color = C.green, prompt = ">" }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 2 }}>
      <span style={{ color: C.dim, fontFamily: "'Share Tech Mono',monospace", flexShrink: 0 }}>{prompt}</span>
      <span style={{ color, fontFamily: "'Share Tech Mono',monospace", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{children}</span>
    </div>
  );
}

// ── Componente: bloco de código ───────────────────────────────────────────────
function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", margin: "12px 0", borderRadius: 6, border: `1px solid ${C.border}`, background: "rgba(0,255,65,0.03)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 10px", borderBottom: `1px solid ${C.border}`, background: "rgba(0,255,65,0.06)" }}>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: C.dim, letterSpacing: 2 }}>CÓDIGO</span>
        <button onClick={() => { navigator.clipboard?.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 4, color: copied ? C.green : C.dim, fontSize: 9, cursor: "pointer", padding: "2px 8px", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, transition: "color .2s" }}>
          {copied ? "✓ COPIADO" : "COPIAR"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "12px 14px", fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: C.white, lineHeight: 1.75, overflowX: "auto" }}>{children}</pre>
    </div>
  );
}

// ── Componente: dica destacada ────────────────────────────────────────────────
function DicaBox({ children }) {
  return (
    <div style={{ margin: "14px 0 0", padding: "10px 14px", borderLeft: `3px solid ${C.gold}`, background: "rgba(255,215,0,0.05)", borderRadius: "0 6px 6px 0" }}>
      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: C.gold, lineHeight: 1.7 }}>{children}</span>
    </div>
  );
}

// ── Componente: editor de tema ao vivo ────────────────────────────────────────
function TemaEditor() {
  const [tema, setTema] = useState({ cor: "#00ff41", corBg1: "#020a04", corBg2: "#001a0a", corBorder: "#00ff41", nomeSigla: "GT", nomeCanal: "GT NETWORK", icone: "📺" });
  const [copied, setCopied] = useState(false);

  const css = `// updateCanal('principal', {
  cor:   '${tema.cor}',
  corBg: 'linear-gradient(135deg,${tema.corBg1},${tema.corBg2})',
  sigla: '${tema.nomeSigla}',
  nome:  '${tema.nomeCanal}',
  icone: '${tema.icone}',
});`;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: C.dim, letterSpacing: 2, marginBottom: 12 }}>▸ EDITOR DE TEMA AO VIVO</div>

      {/* Preview */}
      <div style={{ position: "relative", height: 120, borderRadius: 10, overflow: "hidden", border: `1px solid ${tema.cor}44`, marginBottom: 12, background: `linear-gradient(135deg,${tema.corBg1},${tema.corBg2})` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 40%, ${tema.cor}15 0%,transparent 60%)` }} />
        <div style={{ position: "absolute", top: 10, left: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${tema.cor}`, background: `${tema.cor}22`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <span style={{ fontSize: 14 }}>{tema.icone}</span>
            <span style={{ fontSize: 6, color: tema.cor, fontFamily: "'Share Tech Mono',monospace", fontWeight: 900 }}>{tema.nomeSigla}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 10, color: tema.cor, letterSpacing: 2 }}>{tema.nomeCanal}</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>● AO VIVO</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${tema.cor}, transparent)` }} />
        <div style={{ position: "absolute", bottom: 8, right: 12, fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: `${tema.cor}88`, letterSpacing: 1 }}>PREVIEW</div>
      </div>

      {/* Controles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        {[
          { label: "COR PRIMÁRIA", key: "cor", type: "color" },
          { label: "BG ESCURO 1", key: "corBg1", type: "color" },
          { label: "BG ESCURO 2", key: "corBg2", type: "color" },
          { label: "ÍCONE", key: "icone", type: "text", placeholder: "📺" },
          { label: "SIGLA", key: "nomeSigla", type: "text", placeholder: "GT" },
          { label: "NOME", key: "nomeCanal", type: "text", placeholder: "GT NETWORK" },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: C.dim, letterSpacing: 1.5, marginBottom: 4 }}>{label}</div>
            <input type={type} value={tema[key]} placeholder={placeholder}
              onChange={e => setTema(t => ({ ...t, [key]: e.target.value }))}
              style={{ width: "100%", background: "rgba(0,255,65,0.05)", border: `1px solid ${C.border}`, borderRadius: 5, padding: type === "color" ? "2px 4px" : "5px 8px", color: C.white, fontFamily: "'Share Tech Mono',monospace", fontSize: 11, outline: "none", height: type === "color" ? 30 : "auto", cursor: type === "color" ? "pointer" : "text", boxSizing: "border-box" }} />
          </div>
        ))}
      </div>

      <CodeBlock>{css}</CodeBlock>

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {[
          { nome: "CYBERPUNK", cor: "#ff0044", bg1: "#1a0005", bg2: "#0a0002", icone: "⚡", sigla: "CP" },
          { nome: "HOLOGRAM",  cor: "#00d4ff", bg1: "#000d1a", bg2: "#00060f", icone: "💎", sigla: "HL" },
          { nome: "NEON GTN",  cor: "#00ff41", bg1: "#020a04", bg2: "#001a0a", icone: "📺", sigla: "GT" },
          { nome: "SOLAR",     cor: "#ffd700", bg1: "#1a1200", bg2: "#0f0b00", icone: "☀️", sigla: "SL" },
        ].map(p => (
          <button key={p.nome} onClick={() => setTema({ cor: p.cor, corBg1: p.bg1, corBg2: p.bg2, corBorder: p.cor, nomeSigla: p.sigla, nomeCanal: p.nome, icone: p.icone })}
            style={{ flex: 1, padding: "5px 4px", background: `${p.cor}12`, border: `1px solid ${p.cor}44`, borderRadius: 5, color: p.cor, fontFamily: "'Share Tech Mono',monospace", fontSize: 8, cursor: "pointer", letterSpacing: 1, transition: "all .2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = `${p.cor}25`)}
            onMouseLeave={e => (e.currentTarget.style.background = `${p.cor}12`)}>
            {p.nome}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Componente: AI Assistant integrado ───────────────────────────────────────
function AIAssistant({ contexto }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Você é o GT TV Assistant — especialista técnico na TV Empresarial do Growth Tracker.
O sistema usa Next.js App Router, TypeScript, Tailwind, com estado gerenciado por useChannelConfig (localStorage).
Contexto atual do usuário: ${contexto}
Responda em português, de forma direta e técnica. Use exemplos de código quando útil.
Formate código com \`\`\` e seja conciso (máx 300 palavras).`,
          messages: [
            ...msgs.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: q }
          ],
        }),
      });
      const d = await res.json();
      const txt = d.content?.find(c => c.type === "text")?.text ?? "Sem resposta.";
      setMsgs(m => [...m, { role: "ai", text: txt }]);
    } catch {
      setMsgs(m => [...m, { role: "ai", text: "⚠️ Erro ao conectar. Verifique sua conexão." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 20, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "8px 12px", background: "rgba(0,255,65,0.06)", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>🤖</span>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: C.green, letterSpacing: 2, fontWeight: 900 }}>GT AI ASSISTANT</span>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: C.dim, marginLeft: "auto" }}>PERGUNTE SOBRE ESTE MÓDULO</span>
      </div>
      <div style={{ height: 180, overflowY: "auto", padding: "10px 12px", background: "rgba(0,0,0,.6)" }}>
        {msgs.length === 0 && (
          <TermLine color={C.dim} prompt="$">Faça uma pergunta sobre este módulo...</TermLine>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <TermLine prompt={m.role === "user" ? "você>" : "ai>"} color={m.role === "user" ? C.cyan : C.green}>
              {m.text}
            </TermLine>
          </div>
        ))}
        {loading && <TermLine color={C.dim} prompt="ai>">processando...</TermLine>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Como faço para mudar a cor do canal RH?"
          style={{ flex: 1, background: "rgba(0,255,65,0.04)", border: "none", padding: "8px 12px", color: C.white, fontFamily: "'Share Tech Mono',monospace", fontSize: 11, outline: "none" }}
        />
        <button onClick={send} disabled={loading}
          style={{ padding: "0 16px", background: loading ? "transparent" : "rgba(0,255,65,0.1)", border: "none", borderLeft: `1px solid ${C.border}`, color: loading ? C.dimmer : C.green, fontFamily: "'Share Tech Mono',monospace", fontSize: 10, cursor: loading ? "default" : "pointer", letterSpacing: 1, transition: "background .2s" }}>
          {loading ? "..." : "ENVIAR"}
        </button>
      </div>
    </div>
  );
}

// ── Componente: progresso do curso ────────────────────────────────────────────
function Progresso({ concluidos, total }) {
  const pct = Math.round((concluidos / total) * 100);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: C.dim, letterSpacing: 2 }}>PROGRESSO DO CURSO</span>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: C.green, letterSpacing: 1 }}>{concluidos}/{total} MÓDULOS · {pct}%</span>
      </div>
      <div style={{ height: 4, background: C.dimmer, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${C.green},${C.cyan})`, boxShadow: `0 0 8px ${C.green}88`, transition: "width .6s ease", borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export default function GTTVCurso() {
  const [moduloAtivo, setModuloAtivo]   = useState(null);
  const [secaoAtiva,  setSecaoAtiva]    = useState(0);
  const [concluidos,  setConcluidos]    = useState(new Set());
  const [booted,      setBooted]        = useState(false);
  const [bootStep,    setBootStep]      = useState(0);

  const BOOT_LINES = [
    "GT_TV_SYSTEM v3.4.1 · INICIALIZANDO...",
    "▸ Carregando módulos de treinamento...",
    "▸ Conectando ao AI Assistant...",
    "▸ Compilando 6 módulos / 21 seções...",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "✓ SISTEMA PRONTO · BEM-VINDO AO CURSO",
  ];

  useEffect(() => {
    if (booted) return;
    const id = setInterval(() => {
      setBootStep(s => {
        if (s >= BOOT_LINES.length - 1) { clearInterval(id); setTimeout(() => setBooted(true), 600); return s; }
        return s + 1;
      });
    }, 300);
    return () => clearInterval(id);
  }, [booted]);

  const marcarConcluida = (modId, secIdx) => {
    setConcluidos(s => new Set([...s, `${modId}-${secIdx}`]));
  };

  const moduloAtual = MODULOS.find(m => m.id === moduloAtivo);
  const secaoAtual  = moduloAtual?.secoes[secaoAtiva];
  const totalSecoes = MODULOS.reduce((acc, m) => acc + m.secoes.length, 0);

  // ── BOOT SCREEN ────────────────────────────────────────────────────────────
  if (!booted) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Share Tech Mono',monospace", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ fontSize: 28, marginBottom: 20, textAlign: "center", filter: `drop-shadow(0 0 20px ${C.green})` }}>📺</div>
        {BOOT_LINES.slice(0, bootStep + 1).map((line, i) => (
          <div key={i} style={{ marginBottom: 6, color: i === bootStep ? C.green : C.dim, fontSize: 12, letterSpacing: 1, animation: i === bootStep ? "none" : undefined }}>
            {line}
          </div>
        ))}
        <div style={{ marginTop: 16, height: 2, background: C.dimmer, borderRadius: 1, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((bootStep + 1) / BOOT_LINES.length) * 100}%`, background: C.green, transition: "width .3s ease" }} />
        </div>
      </div>
    </div>
  );

  // ── LEITOR DE SEÇÃO ────────────────────────────────────────────────────────
  if (moduloAtivo && secaoAtual) {
    const totalSecaoModulo = moduloAtual.secoes.length;
    const isLast = secaoAtiva === totalSecaoModulo - 1;
    const jaFeita = concluidos.has(`${moduloAtivo}-${secaoAtiva}`);

    // Detecta se é a seção do editor de tema
    const isEditorTema = secaoAtual.titulo.includes("Trocar o tema visual");

    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "'Share Tech Mono',monospace" }}>
        {/* CRT scanlines sutil */}
        <div style={{ position: "fixed", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.18) 2px,rgba(0,0,0,.18) 4px)", pointerEvents: "none", zIndex: 100 }} />

        {/* Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(2,10,4,.95)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => { setModuloAtivo(null); setSecaoAtiva(0); }}
            style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 5, color: C.dim, fontSize: 9, cursor: "pointer", padding: "3px 8px", letterSpacing: 1, fontFamily: "'Share Tech Mono',monospace", transition: "color .2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.green)}
            onMouseLeave={e => (e.currentTarget.style.color = C.dim)}>
            ← MÓDULOS
          </button>
          <span style={{ fontSize: 12 }}>{moduloAtual.icone}</span>
          <span style={{ fontSize: 10, color: moduloAtual.cor, letterSpacing: 1.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{moduloAtual.titulo}</span>
          <span style={{ fontSize: 8, color: C.dimmer, letterSpacing: 1 }}>{secaoAtiva + 1}/{totalSecaoModulo}</span>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 80px" }}>

          {/* Título da seção */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 8, color: C.dim, letterSpacing: 3, marginBottom: 8 }}>
              {moduloAtual.nivel} · SEÇÃO {secaoAtiva + 1}
            </div>
            <h2 style={{ margin: 0, fontFamily: "'Orbitron',monospace", fontSize: "clamp(14px,3vw,20px)", color: moduloAtual.cor, letterSpacing: 1, textShadow: `0 0 20px ${moduloAtual.cor}55`, lineHeight: 1.3 }}>
              {secaoAtual.titulo}
            </h2>
          </div>

          {/* Conteúdo principal */}
          <div style={{ background: "rgba(0,255,65,0.02)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px", marginBottom: 16 }}>
            {secaoAtual.conteudo.split('\n').map((line, i) => {
              const isCode = line.startsWith('  ') && line.trim().length > 0;
              const isHeader = /^[A-Z\s·]+:$/.test(line.trim()) || /^━+$/.test(line.trim());
              return (
                <div key={i} style={{ marginBottom: isHeader ? 6 : 1 }}>
                  {isHeader ? (
                    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: moduloAtual.cor, letterSpacing: 2, marginTop: 10, marginBottom: 4 }}>{line}</div>
                  ) : isCode ? (
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: C.cyan, lineHeight: 1.7, paddingLeft: 12, borderLeft: `2px solid ${C.border}` }}>{line}</div>
                  ) : (
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: C.white, lineHeight: 1.8 }}>{line || <br />}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dica */}
          {secaoAtual.dica && <DicaBox>{secaoAtual.dica}</DicaBox>}

          {/* Editor de tema ao vivo */}
          {isEditorTema && <TemaEditor />}

          {/* AI Assistant */}
          <AIAssistant contexto={`Módulo: ${moduloAtual.titulo} | Seção: ${secaoAtual.titulo}`} />

          {/* Navegação */}
          <div style={{ marginTop: 24, display: "flex", gap: 10, alignItems: "center" }}>
            {secaoAtiva > 0 && (
              <button onClick={() => setSecaoAtiva(s => s - 1)}
                style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.dim, fontFamily: "'Share Tech Mono',monospace", fontSize: 10, cursor: "pointer", letterSpacing: 1, transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = C.green; e.currentTarget.style.borderColor = C.green; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.dim; e.currentTarget.style.borderColor = C.border; }}>
                ← ANTERIOR
              </button>
            )}
            <div style={{ flex: 1 }} />
            {!jaFeita && (
              <button onClick={() => marcarConcluida(moduloAtivo, secaoAtiva)}
                style={{ padding: "6px 14px", background: "rgba(0,255,65,0.08)", border: `1px solid ${C.green}55`, borderRadius: 6, color: C.green, fontFamily: "'Share Tech Mono',monospace", fontSize: 9, cursor: "pointer", letterSpacing: 1 }}>
                ✓ MARCAR FEITO
              </button>
            )}
            {jaFeita && <span style={{ fontSize: 9, color: C.dim, letterSpacing: 1 }}>✓ CONCLUÍDA</span>}
            {!isLast ? (
              <button onClick={() => { setSecaoAtiva(s => s + 1); }}
                style={{ padding: "8px 20px", background: `${moduloAtual.cor}15`, border: `1px solid ${moduloAtual.cor}55`, borderRadius: 6, color: moduloAtual.cor, fontFamily: "'Share Tech Mono',monospace", fontSize: 10, cursor: "pointer", letterSpacing: 1, transition: "all .2s", boxShadow: `0 0 10px ${moduloAtual.cor}22` }}
                onMouseEnter={e => (e.currentTarget.style.background = `${moduloAtual.cor}25`)}
                onMouseLeave={e => (e.currentTarget.style.background = `${moduloAtual.cor}15`)}>
                PRÓXIMA →
              </button>
            ) : (
              <button onClick={() => { marcarConcluida(moduloAtivo, secaoAtiva); setModuloAtivo(null); setSecaoAtiva(0); }}
                style={{ padding: "8px 20px", background: `${C.green}15`, border: `1px solid ${C.green}55`, borderRadius: 6, color: C.green, fontFamily: "'Share Tech Mono',monospace", fontSize: 10, cursor: "pointer", letterSpacing: 1, boxShadow: `0 0 12px ${C.green}33` }}>
                ✓ CONCLUIR MÓDULO
              </button>
            )}
          </div>

          {/* Mini índice do módulo */}
          <div style={{ marginTop: 28, padding: "12px 14px", background: "rgba(0,255,65,0.02)", border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 8, color: C.dimmer, letterSpacing: 2, marginBottom: 10 }}>SEÇÕES DESTE MÓDULO</div>
            {moduloAtual.secoes.map((s, i) => (
              <button key={i} onClick={() => setSecaoAtiva(i)}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", padding: "5px 0", cursor: "pointer", textAlign: "left", borderBottom: i < moduloAtual.secoes.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${i === secaoAtiva ? moduloAtual.cor : C.border}`, background: concluidos.has(`${moduloAtivo}-${i}`) ? `${moduloAtual.cor}33` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: moduloAtual.cor, flexShrink: 0 }}>
                  {concluidos.has(`${moduloAtivo}-${i}`) ? "✓" : i + 1}
                </span>
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: i === secaoAtiva ? moduloAtual.cor : C.dim, letterSpacing: .5 }}>{s.titulo}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── TELA PRINCIPAL — LISTA DE MÓDULOS ─────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "'Share Tech Mono',monospace" }}>
      {/* CRT scanlines */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px)", pointerEvents: "none", zIndex: 100 }} />

      {/* Noise grain overlay */}
      <div style={{ position: "fixed", inset: 0, opacity: .025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 99 }} />

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, background: "rgba(0,0,0,.4)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50 }}>
        <span style={{ fontSize: 22, filter: `drop-shadow(0 0 10px ${C.green})` }}>📺</span>
        <div>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(11px,3vw,15px)", color: C.green, letterSpacing: 3, fontWeight: 900 }}>GT TV · CURSO COMPLETO</div>
          <div style={{ fontSize: 8, color: C.dim, letterSpacing: 2, marginTop: 2 }}>OPERAÇÃO · CONFIGURAÇÃO · UPGRADES · ESTÉTICA</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 8, color: C.dim, letterSpacing: 1 }}>MÓDULOS</div>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, color: C.green }}>{MODULOS.length}</div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* Progresso */}
        <Progresso concluidos={concluidos.size} total={totalSecoes} />

        {/* Intro terminal */}
        <div style={{ padding: "14px", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 24 }}>
          <TermLine prompt="$" color={C.dim}>gt-tv --curso --nivel=avancado</TermLine>
          <TermLine>Curso completo: {MODULOS.length} módulos · {totalSecoes} seções</TermLine>
          <TermLine color={C.cyan}>Inclui: operação, canais, estética, manga, ticker, upgrades</TermLine>
          <TermLine color={C.gold}>AI Assistant disponível em cada módulo para dúvidas em tempo real</TermLine>
        </div>

        {/* Grid de módulos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MODULOS.map((m, mi) => {
            const totalM   = m.secoes.length;
            const feitasM  = m.secoes.filter((_, si) => concluidos.has(`${m.id}-${si}`)).length;
            const pctM     = Math.round((feitasM / totalM) * 100);
            const concluido = pctM === 100;

            return (
              <button key={m.id} onClick={() => { setModuloAtivo(m.id); setSecaoAtiva(0); }}
                style={{ display: "block", width: "100%", textAlign: "left", background: concluido ? `${m.cor}08` : C.panel, border: `1px solid ${concluido ? m.cor + "55" : C.border}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "all .25s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${m.cor}10`; e.currentTarget.style.borderColor = `${m.cor}66`; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = concluido ? `${m.cor}08` : C.panel; e.currentTarget.style.borderColor = concluido ? `${m.cor}55` : C.border; e.currentTarget.style.transform = ""; }}>

                {/* Barra de progresso do módulo */}
                <div style={{ position: "absolute", bottom: 0, left: 0, width: `${pctM}%`, height: 2, background: m.cor, boxShadow: `0 0 6px ${m.cor}`, transition: "width .5s ease" }} />

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22, filter: concluido ? `drop-shadow(0 0 8px ${m.cor})` : "none", transition: "filter .3s" }}>{m.icone}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(9px,2.5vw,12px)", color: m.cor, letterSpacing: 1, fontWeight: 900 }}>{m.titulo}</span>
                      <span style={{ fontSize: 7, padding: "2px 7px", background: `${m.cor}15`, border: `1px solid ${m.cor}33`, borderRadius: 10, color: m.cor, letterSpacing: 1.5, flexShrink: 0 }}>{m.nivel}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: C.dim, letterSpacing: .5 }}>⏱ {m.duracao}</span>
                      <span style={{ fontSize: 9, color: C.dim }}>·</span>
                      <span style={{ fontSize: 9, color: C.dim }}>{totalM} seções</span>
                      {feitasM > 0 && <span style={{ fontSize: 9, color: m.cor }}>· {feitasM}/{totalM} feitas</span>}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    {concluido ? (
                      <span style={{ fontSize: 16, filter: `drop-shadow(0 0 6px ${m.cor})` }}>✓</span>
                    ) : (
                      <span style={{ fontSize: 14, color: C.dim }}>›</span>
                    )}
                  </div>
                </div>

                {/* Títulos das seções (mini-preview) */}
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {m.secoes.map((s, si) => (
                    <span key={si} style={{ fontSize: 8, padding: "2px 8px", background: concluidos.has(`${m.id}-${si}`) ? `${m.cor}15` : "rgba(255,255,255,.03)", border: `1px solid ${concluidos.has(`${m.id}-${si}`) ? m.cor + "44" : "rgba(255,255,255,.08)"}`, borderRadius: 10, color: concluidos.has(`${m.id}-${si}`) ? m.cor : "rgba(255,255,255,.3)", letterSpacing: .5 }}>
                      {s.titulo.length > 28 ? s.titulo.slice(0, 28) + "…" : s.titulo}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, padding: "14px", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.dimmer, letterSpacing: 2, lineHeight: 1.8 }}>
            GT TV EMPRESARIAL · GROWTH TRACKER<br />
            {MODULOS.length} MÓDULOS · {totalSecoes} SEÇÕES · AI-POWERED
          </div>
          <div style={{ marginTop: 8, height: 1, background: `linear-gradient(90deg,transparent,${C.dimmer},transparent)` }} />
          <div style={{ marginTop: 8, fontSize: 8, color: C.dimmer, letterSpacing: 1 }}>
            VERSÃO 3.4.1 · NEXT.JS APP ROUTER · TYPESCRIPT
          </div>
        </div>
      </div>
    </div>
  );
}
