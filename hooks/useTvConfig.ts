// hooks/useTvConfig.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Tipos ─────────────────────────────────────────────────────────────────────
export type SlideType = 'builtin' | 'blog' | 'jornal' | 'custom';

export interface RankingEntry {
  nome: string; setor: string; pontos: number;
  variacao: number; lider?: boolean;
}
export interface LinhaProducao {
  nome: string; status: 'operando' | 'manutenção' | 'parado'; pct?: number;
}
export interface Comunicado {
  tipo: 'URGENTE' | 'NOVIDADE' | 'EVENTO' | 'AVISO'; titulo: string; quando: string;
}

export interface SlideConfig {
  id: string; type: SlideType; label: string;
  icon: string; color: string; active: boolean; order: number;

  producao?: {
    unidadesHoje: number; tempoOperacional: string;
    linhas: LinhaProducao[]; alerta?: string;
  };
  ranking?: {
    titulo: string; subtitulo: string; premio?: string; entries: RankingEntry[];
  };
  comunicado?: { items: Comunicado[]; };
  clima?: {
    cidade: string; temperatura: number; condicao: string;
    umidade: number; vento: number;
  };
  metas?: { items: { texto: string; feito: boolean }[]; };
  selectedSlugs?: string[];
  custom?: {
    titulo: string; subtitulo?: string; corpo: string;
    rodape?: string; bgColor?: string;
  };
}

// ── Defaults ──────────────────────────────────────────────────────────────────
export const DEFAULT_SLIDES: SlideConfig[] = [
  {
    id:'metas', type:'builtin', label:'Metas do Dia',
    icon:'🎯', color:'#00ff88', active:true, order:0,
    metas:{ items:[
      { texto:'Publicar post semanal', feito:false },
      { texto:'Atualizar dashboard',   feito:false },
      { texto:'Revisar métricas',      feito:true  },
    ]},
  },
  {
    id:'producao', type:'builtin', label:'Produção de Conteúdo',
    icon:'✍️', color:'#00d4ff', active:true, order:1,
    producao:{
      unidadesHoje:4832, tempoOperacional:'6h 42m',
      alerta:'Manutenção preventiva agendada: 14:00',
      linhas:[
        { nome:'Linha A', status:'operando',   pct:94 },
        { nome:'Linha B', status:'operando',   pct:87 },
        { nome:'Linha C', status:'manutenção'        },
        { nome:'Linha D', status:'operando',   pct:91 },
      ],
    },
  },
  {
    id:'ranking', type:'builtin', label:'Ranking',
    icon:'🏆', color:'#ffd700', active:true, order:2,
    ranking:{
      titulo:'Ranking da Semana', subtitulo:'Top Performers',
      premio:'Prêmio do mês: Viagem para equipe vencedora!',
      entries:[
        { nome:'Ana Silva',     setor:'Vendas',    pontos:2847, variacao:12, lider:true },
        { nome:'Carlos Mendes', setor:'Produção',  pontos:2654, variacao:8  },
        { nome:'Mariana Costa', setor:'Vendas',    pontos:2598, variacao:15 },
        { nome:'João Pereira',  setor:'Logística', pontos:2341, variacao:-3 },
        { nome:'Fernanda Lima', setor:'Produção',  pontos:2289, variacao:5  },
      ],
    },
  },
  {
    id:'comunicado', type:'builtin', label:'Comunicados',
    icon:'📢', color:'#a855f7', active:true, order:3,
    comunicado:{ items:[
      { tipo:'URGENTE',  titulo:'Alteração no horário de almoço', quando:'Hoje'         },
      { tipo:'NOVIDADE', titulo:'Novo benefício: Gympass',         quando:'Ontem'        },
      { tipo:'EVENTO',   titulo:'Festa de fim de ano - 20/12',     quando:'2 dias atrás' },
    ]},
  },
  {
    id:'clima', type:'builtin', label:'Clima',
    icon:'🌤️', color:'#38bdf8', active:true, order:4,
    clima:{ cidade:'São Paulo', temperatura:24, condicao:'Parcialmente nublado', umidade:68, vento:14 },
  },
  // ✅ Card de dados reais do app — consome /api/tv-report
  {
    id:'app-growth', type:'builtin', label:'Status do App',
    icon:'📡', color:'#00ff88', active:true, order:5,
  },
];

const LS_KEY     = 'gt_tv_config_v2';
const LS_VERSION = 3; // ← incrementar aqui quando DEFAULT_SLIDES mudar
const LS_VER_KEY = 'gt_tv_config_version';

// ── Valida se o dado do localStorage é utilizável ─────────────────────────────
function isValidConfig(data: unknown): data is SlideConfig[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (s: any) =>
        typeof s?.id === 'string' &&
        typeof s?.label === 'string' &&
        typeof s?.active === 'boolean'
    )
  );
}

// ── Garante que slides builtin ausentes sejam adicionados ─────────────────────
function mergeComDefaults(saved: SlideConfig[]): SlideConfig[] {
  const savedIds = new Set(saved.map(s => s.id));
  const faltando = DEFAULT_SLIDES.filter(d => !savedIds.has(d.id));
  if (faltando.length === 0) return saved;
  // Adiciona os novos no fim com order após os existentes
  const maxOrder = Math.max(...saved.map(s => s.order), saved.length - 1);
  const novos = faltando.map((s, i) => ({ ...s, order: maxOrder + 1 + i }));
  return [...saved, ...novos];
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTvConfig() {
  const [slides, setSlides] = useState<SlideConfig[]>(DEFAULT_SLIDES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let resolved = false;
    try {
      const savedVersion = parseInt(localStorage.getItem(LS_VER_KEY) ?? '0', 10);
      const raw = localStorage.getItem(LS_KEY);

      if (raw && savedVersion >= LS_VERSION) {
        // Versão atual — usa os dados salvos
        const parsed = JSON.parse(raw);
        if (isValidConfig(parsed)) {
          setSlides(parsed);
          resolved = true;
        }
      } else if (raw && savedVersion < LS_VERSION) {
        // Versão antiga — faz merge: mantém dados do usuário + adiciona slides novos
        const parsed = JSON.parse(raw);
        if (isValidConfig(parsed)) {
          const merged = mergeComDefaults(parsed);
          setSlides(merged);
          // Salva já atualizado
          localStorage.setItem(LS_KEY, JSON.stringify(merged));
          localStorage.setItem(LS_VER_KEY, String(LS_VERSION));
          resolved = true;
        }
      }
    } catch {
      // JSON corrompido — usa defaults
    }

    if (!resolved) {
      setSlides(DEFAULT_SLIDES);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_SLIDES));
        localStorage.setItem(LS_VER_KEY, String(LS_VERSION));
      } catch {}
    }

    setLoaded(true);
  }, []);

  const persist = (next: SlideConfig[]) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      localStorage.setItem(LS_VER_KEY, String(LS_VERSION));
    } catch {}
  };

  const updateSlide = useCallback((id: string, patch: Partial<SlideConfig>) => {
    setSlides(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...patch } : s);
      persist(next);
      return next;
    });
  }, []);

  const toggleActive = useCallback((id: string) => {
    setSlides(prev => {
      const next = prev.map(s => s.id === id ? { ...s, active: !s.active } : s);
      persist(next);
      return next;
    });
  }, []);

  const reorder = useCallback((fromIdx: number, toIdx: number) => {
    setSlides(prev => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      const reindexed = next.map((s, i) => ({ ...s, order: i }));
      persist(reindexed);
      return reindexed;
    });
  }, []);

  const addSlide = useCallback((slide: SlideConfig) => {
    setSlides(prev => {
      const next = [...prev, { ...slide, order: prev.length }];
      persist(next);
      return next;
    });
  }, []);

  const removeSlide = useCallback((id: string) => {
    setSlides(prev => {
      const next = prev.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }));
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSlides(DEFAULT_SLIDES);
    persist(DEFAULT_SLIDES);
  }, []);

  const activeSlides = slides
    .filter(s => s.active)
    .sort((a, b) => a.order - b.order);

  return {
    slides, activeSlides, loaded,
    updateSlide, toggleActive, reorder,
    addSlide, removeSlide, reset,
  };
}
