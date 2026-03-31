// hooks/useChannelConfig.ts
// Gerencia os canais da TV Empresarial — cada canal tem cor, ícone e slides próprios
'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Tipos ─────────────────────────────────────────────────────────────────────
export type CanalId =
  | 'principal'
  | 'rh'
  | 'qualidade'
  | 'engenharia'
  | 'pcp'
  | 'seguranca'
  | 'gestao'
  | 'manga';                        // ← GT Manga

export interface CanalSlide {
  id:      string;
  label:   string;
  icon:    string;
  active:  boolean;
  order:   number;
  custom?: { titulo: string; corpo: string; rodape?: string; };
  // ── campos extras para o canal manga ──────────────────────────────────────
  tipo?:   'manga';                 // discriminador
  src?:    string;                  // caminho da imagem
}

export interface Canal {
  id:      CanalId;
  nome:    string;
  sigla:   string;
  icone:   string;
  cor:     string;
  corBg:   string;
  ativo:   boolean;
  slides:  CanalSlide[];
  // flag opcional: o conteúdo do canal é carregado dinamicamente
  dynamic?: boolean;
}

// ── Canais padrão ─────────────────────────────────────────────────────────────
export const CANAIS_DEFAULT: Canal[] = [
  {
    id: 'principal', nome: 'GT Network', sigla: 'GT', icone: '📺',
    cor: '#a855f7', corBg: 'linear-gradient(135deg,#1a0830,#0d0418)',
    ativo: true,
    slides: [
      { id:'gt-boas-vindas', label:'Boas-vindas',    icon:'👋', active:true,  order:0, custom:{ titulo:'Bem-vindo à GT Network', corpo:'Canal central de comunicação corporativa do Growth Tracker.', rodape:'GT NETWORK · AO VIVO' }},
      { id:'gt-destaques',   label:'Destaques',      icon:'⭐', active:true,  order:1, custom:{ titulo:'Destaques do Dia',        corpo:'Acompanhe os principais acontecimentos de todos os departamentos.', rodape:'Atualizado em tempo real' }},
      { id:'gt-agenda',      label:'Agenda Geral',   icon:'📅', active:true,  order:2, custom:{ titulo:'Agenda Corporativa',      corpo:'Reuniões, eventos e marcos importantes da semana.', rodape:'Consulte seu gestor para detalhes' }},
    ],
  },
  {
    id: 'rh', nome: 'RH · Recursos Humanos', sigla: 'RH', icone: '👥',
    cor: '#00d4ff', corBg: 'linear-gradient(135deg,#001830,#00101f)',
    ativo: true,
    slides: [
      { id:'rh-rotina',      label:'Rotina do Time',   icon:'🗓️', active:true,  order:0, custom:{ titulo:'Rotina e Jornada',         corpo:'Gestão de escalas, banco de horas e frequência da equipe.', rodape:'RH · Recursos Humanos' }},
      { id:'rh-beneficios',  label:'Benefícios',       icon:'🎁', active:true,  order:1, custom:{ titulo:'Benefícios e Bem-estar',    corpo:'Planos de saúde, vale-refeição, gympass e demais benefícios ativos.', rodape:'Canal RH' }},
      { id:'rh-treinamentos',label:'Treinamentos',     icon:'📚', active:true,  order:2, custom:{ titulo:'Calendário de Treinamentos', corpo:'Próximas capacitações, reciclagens e certificações disponíveis.', rodape:'Inscreva-se com antecedência' }},
      { id:'rh-vagas',       label:'Vagas Internas',   icon:'🔍', active:false, order:3, custom:{ titulo:'Oportunidades Internas',    corpo:'Vagas abertas para movimentação interna. Fale com o RH.', rodape:'Canal RH' }},
    ],
  },
  {
    id: 'qualidade', nome: 'Qualidade', sigla: 'QA', icone: '✅',
    cor: '#00ff88', corBg: 'linear-gradient(135deg,#001a0d,#00100a)',
    ativo: true,
    slides: [
      { id:'qa-indicadores',       label:'Indicadores',        icon:'📊', active:true,  order:0, custom:{ titulo:'Indicadores de Qualidade',   corpo:'IQP, taxa de rejeição, aprovação em lote e conformidade do período.', rodape:'Qualidade · Atualizado diariamente' }},
      { id:'qa-nao-conformidades', label:'Não Conformidades',  icon:'⚠️', active:true,  order:1, custom:{ titulo:'Não Conformidades Abertas',  corpo:'Registros em tratamento e prazos de resolução pendentes.', rodape:'Canal QA' }},
      { id:'qa-auditorias',        label:'Auditorias',         icon:'🔎', active:true,  order:2, custom:{ titulo:'Calendário de Auditorias',    corpo:'Próximas auditorias internas e externas programadas.', rodape:'Preparação obrigatória' }},
      { id:'qa-normas',            label:'Normas e Docs',      icon:'📋', active:false, order:3, custom:{ titulo:'Normas e Documentação',       corpo:'ISO, procedimentos internos e documentos de qualidade vigentes.', rodape:'Canal QA' }},
    ],
  },
  {
    id: 'engenharia', nome: 'Engenharia', sigla: 'ENG', icone: '⚙️',
    cor: '#ffd700', corBg: 'linear-gradient(135deg,#1a1500,#0f0e00)',
    ativo: true,
    slides: [
      { id:'eng-novos-itens', label:'Novos Itens',  icon:'🆕', active:true,  order:0, custom:{ titulo:'Itens em Implantação',    corpo:'Novos produtos e componentes em processo de homologação e entrada em linha.', rodape:'Engenharia · NPI' }},
      { id:'eng-projetos',    label:'Projetos',     icon:'📐', active:true,  order:1, custom:{ titulo:'Projetos em Andamento',    corpo:'Status dos projetos de engenharia: desenvolvimento, validação e liberação.', rodape:'Canal ENG' }},
      { id:'eng-alteracoes',  label:'Alterações',   icon:'🔄', active:true,  order:2, custom:{ titulo:'Alterações de Engenharia', corpo:'ECNs abertas e alterações de produto em aprovação no período.', rodape:'Aprovação obrigatória antes de produzir' }},
      { id:'eng-ferramental', label:'Ferramental',  icon:'🔧', active:false, order:3, custom:{ titulo:'Ferramental e Gabaritos',  corpo:'Solicitações de ferramental, gabaritos em manutenção e novas aquisições.', rodape:'Canal ENG' }},
    ],
  },
  {
    id: 'pcp', nome: 'PCP · Planejamento', sigla: 'PCP', icone: '📦',
    cor: '#ff8c42', corBg: 'linear-gradient(135deg,#1a0800,#100500)',
    ativo: true,
    slides: [
      { id:'pcp-producao',  label:'Produção do Dia', icon:'🏭', active:true,  order:0, custom:{ titulo:'Produção do Dia',       corpo:'Ordens abertas, apontamentos e performance das linhas no turno atual.', rodape:'PCP · Atualização por turno' }},
      { id:'pcp-sequencia', label:'Sequência',       icon:'📋', active:true,  order:1, custom:{ titulo:'Sequência de Produção',  corpo:'Ordem de fabricação programada para hoje e os próximos 2 dias.', rodape:'Canal PCP' }},
      { id:'pcp-estoque',   label:'Estoque',         icon:'📦', active:true,  order:2, custom:{ titulo:'Posição de Estoque',     corpo:'Materiais críticos, rupturas e itens com reposição urgente.', rodape:'Acionar compras se crítico' }},
      { id:'pcp-atraso',    label:'Atrasos',         icon:'⏰', active:false, order:3, custom:{ titulo:'Ordens com Atraso',      corpo:'Ordens de produção atrasadas e ações corretivas em andamento.', rodape:'Canal PCP' }},
    ],
  },
  {
    id: 'seguranca', nome: 'Segurança', sigla: 'SEG', icone: '🦺',
    cor: '#ff4d6d', corBg: 'linear-gradient(135deg,#1a0005,#100004)',
    ativo: true,
    slides: [
      { id:'seg-dds',         label:'DDS',          icon:'📢', active:true,  order:0, custom:{ titulo:'DDS · Diálogo de Segurança', corpo:'Tema de segurança do dia. Atenção obrigatória antes do início da jornada.', rodape:'Segurança · Tolerância zero' }},
      { id:'seg-indicadores', label:'Indicadores',  icon:'📊', active:true,  order:1, custom:{ titulo:'Indicadores de Segurança',   corpo:'Dias sem acidente, near misses registrados e ações preventivas do mês.', rodape:'Canal SEG' }},
      { id:'seg-epi',         label:'EPIs',         icon:'🥽', active:true,  order:2, custom:{ titulo:'EPIs e Equipamentos',        corpo:'Uso obrigatório, validade dos equipamentos e solicitações pendentes.', rodape:'EPI é obrigação, não opção' }},
      { id:'seg-emergencia',  label:'Emergências',  icon:'🚨', active:false, order:3, custom:{ titulo:'Procedimentos de Emergência', corpo:'Rotas de fuga, pontos de encontro e ramais de emergência.', rodape:'Canal SEG' }},
    ],
  },
  {
    id: 'gestao', nome: 'Gestão Geral', sigla: 'GG', icone: '🎯',
    cor: '#c084fc', corBg: 'linear-gradient(135deg,#140028,#0a0018)',
    ativo: true,
    slides: [
      { id:'gg-kpis',        label:'KPIs',         icon:'📈', active:true,  order:0, custom:{ titulo:'KPIs Estratégicos',     corpo:'OEE, OTIF, NPS e demais indicadores críticos do período.', rodape:'Gestão Geral · Visão executiva' }},
      { id:'gg-metas',       label:'Metas',        icon:'🎯', active:true,  order:1, custom:{ titulo:'Metas do Mês',          corpo:'Performance vs. meta por área. Destaque para times acima do target.', rodape:'Canal GG' }},
      { id:'gg-comunicados', label:'Comunicados',  icon:'📣', active:true,  order:2, custom:{ titulo:'Comunicados da Direção', corpo:'Informes estratégicos, mudanças organizacionais e diretrizes da liderança.', rodape:'Gestão Geral' }},
      { id:'gg-resultados',  label:'Resultados',   icon:'💹', active:false, order:3, custom:{ titulo:'Resultados do Período',  corpo:'Fechamento financeiro, faturamento e resultado operacional consolidado.', rodape:'Confidencial · Apenas gestores' }},
    ],
  },

  // ── GT Manga ─────────────────────────────────────────────────────────────────
  {
    id:      'manga',
    nome:    'GT Manga',
    sigla:   'MGK',
    icone:   '📖',
    cor:     '#ff6b9d',
    corBg:   'linear-gradient(135deg,#1a0010,#0d0008)',
    ativo:   true,
    dynamic: true,          // páginas carregadas da API /api/manga-tv
    slides: [
      // placeholder — substituído em runtime pelo hook useMangaSlides
      {
        id:     'manga-loading',
        label:  'Carregando...',
        icon:   '📖',
        active: true,
        order:  0,
        tipo:   'manga',
        custom: { titulo: 'GT Manga', corpo: 'Capítulo 1', rodape: 'GT MANGA · AO VIVO' },
      },
    ],
  },
];

const LS_KEY  = 'gt_canais_v1';
const LS_VER  = 'gt_canais_version';
const VERSION = 1;

function isValid(d: unknown): d is Canal[] {
  return Array.isArray(d) && d.length > 0 && (d[0] as any)?.id !== undefined;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useChannelConfig() {
  const [canais,     setCanais]     = useState<Canal[]>(CANAIS_DEFAULT);
  const [loaded,     setLoaded]     = useState(false);
  const [canalAtivo, setCanalAtivo] = useState<CanalId>('principal');

  useEffect(() => {
    try {
      const ver = parseInt(localStorage.getItem(LS_VER) ?? '0', 10);
      const raw = localStorage.getItem(LS_KEY);
      if (raw && ver >= VERSION) {
        const parsed = JSON.parse(raw);
        if (isValid(parsed)) {
          // Garante que o canal manga está sempre presente mesmo em saves antigos
          const hasManga = parsed.some((c: Canal) => c.id === 'manga');
          const final    = hasManga ? parsed : [...parsed, CANAIS_DEFAULT.find(c => c.id === 'manga')!];
          setCanais(final);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  const persist = (next: Canal[]) => {
    try {
      localStorage.setItem(LS_KEY,  JSON.stringify(next));
      localStorage.setItem(LS_VER,  String(VERSION));
    } catch {}
  };

  const updateCanal = useCallback((id: CanalId, patch: Partial<Canal>) => {
    setCanais(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...patch } : c);
      persist(next); return next;
    });
  }, []);

  const updateSlide = useCallback((canalId: CanalId, slideId: string, patch: Partial<CanalSlide>) => {
    setCanais(prev => {
      const next = prev.map(c => c.id !== canalId ? c : {
        ...c,
        slides: c.slides.map(s => s.id === slideId ? { ...s, ...patch } : s),
      });
      persist(next); return next;
    });
  }, []);

  const addSlide = useCallback((canalId: CanalId, slide: CanalSlide) => {
    setCanais(prev => {
      const next = prev.map(c => c.id !== canalId ? c : {
        ...c, slides: [...c.slides, slide],
      });
      persist(next); return next;
    });
  }, []);

  const removeSlide = useCallback((canalId: CanalId, slideId: string) => {
    setCanais(prev => {
      const next = prev.map(c => c.id !== canalId ? c : {
        ...c, slides: c.slides.filter(s => s.id !== slideId),
      });
      persist(next); return next;
    });
  }, []);

  // Injeta slides dinâmicos do manga no estado sem persistir (são gerados da API)
  const injectMangaSlides = useCallback((slides: CanalSlide[]) => {
    setCanais(prev => prev.map(c =>
      c.id === 'manga' ? { ...c, slides } : c
    ));
  }, []);

  const reset = useCallback(() => {
    setCanais(CANAIS_DEFAULT); persist(CANAIS_DEFAULT);
  }, []);

  const canal = canais.find(c => c.id === canalAtivo) ?? canais[0];

  return {
    canais, canal, canalAtivo, loaded,
    setCanalAtivo, updateCanal, updateSlide, addSlide, removeSlide, reset,
    injectMangaSlides,
  };
}
