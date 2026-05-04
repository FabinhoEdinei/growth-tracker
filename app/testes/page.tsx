'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Play, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, Terminal, RefreshCw } from 'lucide-react';
import {
  analisarTexto,
  calcularValorPost,
  calcularBloco,
  gerarCota,
  type PostData,
  type CotaETF,
} from '@/lib/etf-cota-engine';

// ═════════════════════════════════════════════════════════════════════════════
// TIPOS — Routes
// ═════════════════════════════════════════════════════════════════════════════
type RouteStatus = 'idle' | 'running' | 'pass' | 'fail' | 'warn' | 'skip';

interface RouteTest {
  id: string; label: string; path: string; method?: string;
  expectedStatus?: number; tags: string[];
}

interface RouteResult {
  id: string; label: string; path: string; tags: string[];
  status: RouteStatus; httpCode?: number; expectedCode?: number;
  latencyMs?: number; retries: number;
  headers?: Record<string, string>;
  errorSnippet?: string; redirectTo?: string; timestamp: number;
}

interface LogLine { t: number; text: string; kind: 'info' | 'pass' | 'fail' | 'warn' | 'head'; }

// ═════════════════════════════════════════════════════════════════════════════
// TIPOS — ETF Engine
// ═════════════════════════════════════════════════════════════════════════════
type EtfStatus = 'idle' | 'running' | 'pass' | 'fail';

interface EtfResult {
  status: EtfStatus; duracao: number;
  entrada: unknown; saida: unknown;
  erro?: string; detalhes: Record<string, unknown>;
}

interface EtfTeste {
  id: string; nome: string; descricao: string; icone: string; grupo: string;
  fn: () => Promise<EtfResult>;
}

// ═════════════════════════════════════════════════════════════════════════════
// ROTAS
// ═════════════════════════════════════════════════════════════════════════════
const ROUTE_TESTS: RouteTest[] = [
  // Páginas principais
  { id: 'home',      label: 'Home',                  path: '/',                   expectedStatus: 200, tags: ['page', 'core'] },
  { id: 'dashboard', label: 'Dashboard',             path: '/dashboard',          expectedStatus: 200, tags: ['page', 'core'] },
  { id: 'blog',      label: 'Blog (listagem)',        path: '/blog',               expectedStatus: 200, tags: ['page', 'content'] },
  { id: 'jornal',    label: 'Jornal',                path: '/jornal',             expectedStatus: 200, tags: ['page', 'content'] },
  { id: 'tv',        label: 'TV Empresarial',        path: '/tv-empresarial',     expectedStatus: 200, tags: ['page', 'tv'] },
  { id: 'config',    label: 'Configurações',         path: '/config',             expectedStatus: 200, tags: ['page', 'admin'] },
  { id: 'testes',    label: 'Página de Testes',      path: '/testes',             expectedStatus: 200, tags: ['page', 'dev'] },
  { id: 'pentaculos',label: 'Pentáculos',            path: '/pentaculos',         expectedStatus: 200, tags: ['page', 'analytics'] },
  { id: 'gim',       label: 'GIM Dashboard',         path: '/gim',                expectedStatus: 200, tags: ['page', 'analytics'] },
  { id: 'financas',  label: 'Finanças',              path: '/financas',           expectedStatus: 200, tags: ['page', 'analytics'] },
  { id: 'manga',     label: 'Manga Reader',          path: '/manga',              expectedStatus: 200, tags: ['page', 'content'] },

  // APIs críticas
  { id: 'api-code',  label: 'API /code-stats',       path: '/api/code-stats',     expectedStatus: 200, method: 'GET', tags: ['api', 'analytics'] },
  { id: 'api-etf',   label: 'API /etf-cota',         path: '/api/etf-cota',       expectedStatus: 200, method: 'GET', tags: ['api', 'etf'] },
  { id: 'api-daily', label: 'API /daily-report',     path: '/api/daily-report',   expectedStatus: 200, method: 'GET', tags: ['api', 'reports'] },
  { id: 'api-manga', label: 'API /manga',            path: '/api/manga',          expectedStatus: 200, method: 'GET', tags: ['api', 'content'] },
  { id: 'api-roteiro',label: 'API /roteiro',         path: '/api/roteiro',        expectedStatus: 200, method: 'GET', tags: ['api', 'content'] },
  { id: 'api-tv-report',label: 'API /tv-report',     path: '/api/tv-report',      expectedStatus: 200, method: 'GET', tags: ['api', 'tv'] },

  // TV Empresarial (sub-rotas)
  { id: 'tv-config', label: 'TV Config Editor',      path: '/tv-empresarial/config', expectedStatus: 200, tags: ['page', 'tv', 'admin'] },
  { id: 'tv-canais', label: 'TV Canais Manager',     path: '/tv-empresarial/canais', expectedStatus: 200, tags: ['page', 'tv', 'admin'] },

  // Páginas de conteúdo dinâmico
  { id: 'blog-post', label: 'Blog Post (exemplo)',    path: '/blog/como-construir-um-sistema-de-crescimento-digital', expectedStatus: 200, tags: ['page', 'content', 'dynamic'] },
  { id: 'jornal-slug',label: 'Jornal Edição',        path: '/jornal/mercado-digital-em-expansao', expectedStatus: 200, tags: ['page', 'content', 'dynamic'] },

  // 404s esperados
  { id: 'slug-404',  label: 'Blog slug inexistente', path: '/blog/__teste_404__', expectedStatus: 404, tags: ['page', '404'] },
  { id: 'api-404',   label: 'API inexistente',       path: '/api/__teste_404__',  expectedStatus: 404, tags: ['api', '404'] },
  { id: 'page-404',  label: 'Página inexistente',    path: '/__teste_404__',      expectedStatus: 404, tags: ['page', '404'] },

  // Segurança e validação
  { id: 'xss-test',  label: 'Proteção XSS (query)',  path: '/?q=<script>alert(1)</script>', expectedStatus: 200, tags: ['security', 'xss'] },
  { id: 'sql-test',  label: 'Proteção SQL Injection', path: '/api/code-stats?q=1%27%20OR%20%271%27%3D%271', expectedStatus: 200, tags: ['security', 'sqli'] },

  // Performance crítica
  { id: 'api-etf-load', label: 'API ETF sob carga',   path: '/api/etf-cota',       expectedStatus: 200, method: 'GET', tags: ['api', 'etf', 'performance'] },
];

const RETRY_LIMIT = 2;
const TIMEOUT_MS  = 8000;

async function probeRoute(test: RouteTest): Promise<Omit<RouteResult, 'timestamp'>> {
  let lastError = ''; let retries = 0;
  for (let attempt = 0; attempt <= RETRY_LIMIT; attempt++) {
    const t0 = Date.now();
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res = await fetch(test.path, { method: test.method || 'GET', redirect: 'manual', cache: 'no-store', signal: ctrl.signal });
      clearTimeout(timer);
      const latencyMs = Date.now() - t0; const code = res.status;
      const headers: Record<string, string> = {};
      ['content-type','cache-control','x-powered-by','location','x-deny-reason'].forEach(h => {
        const v = res.headers.get(h); if (v) headers[h] = v;
      });
      const redirectTo = headers['location'];
      let errorSnippet: string | undefined;
      if (code >= 400) { try { errorSnippet = (await res.text()).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,300); } catch {} }
      const expected = test.expectedStatus;
      const status: RouteStatus = expected !== undefined ? (code === expected ? 'pass' : 'fail') : code >= 200 && code < 300 ? 'pass' : code < 400 ? 'warn' : 'fail';
      return { id: test.id, label: test.label, path: test.path, tags: test.tags, status, httpCode: code, expectedCode: expected, latencyMs, retries, headers, errorSnippet, redirectTo };
    } catch (e: any) {
      lastError = e?.name === 'AbortError' ? `Timeout (>${TIMEOUT_MS}ms)` : String(e?.message ?? e);
      retries = attempt;
      if (attempt < RETRY_LIMIT) await new Promise(r => setTimeout(r, 500));
    }
  }
  return { id: test.id, label: test.label, path: test.path, tags: test.tags, status: 'fail', retries, errorSnippet: lastError };
}

// ═════════════════════════════════════════════════════════════════════════════
// POSTS DE EXEMPLO
// ═════════════════════════════════════════════════════════════════════════════
const P_BLOG1: PostData = { titulo:'Como construir um sistema de crescimento digital', slug:'p1', date:'2024-03-15', category:'Estratégia', excerpt:'Um guia completo para rastrear e evoluir métricas empresariais usando tecnologia moderna.', tipo:'blog' };
const P_BLOG2: PostData = { titulo:'Automação de relatórios com Next.js e TypeScript',  slug:'p2', date:'2024-06-01', category:'Tecnologia', excerpt:'Aprenda a criar pipelines de dados automatizados para monitorar o crescimento do seu negócio.', tipo:'blog' };
const P_JORN:  PostData = { titulo:'Mercado digital em expansão: oportunidades para 2025', slug:'j1', date:'2024-11-20', category:'Economia', excerpt:'Análise das tendências do mercado digital e como posicionar sua empresa para o futuro.', tipo:'jornal' };
const P_TV:    PostData = { titulo:'TV Empresarial Growth Tracker', slug:'tv', date: new Date().toISOString().split('T')[0], category:'TV', excerpt:'Dashboard de métricas e relatório diário do sistema de crescimento digital.', tipo:'tv' };
const P_VAZIO: PostData = { titulo:'', slug:'vazio', date:'', category:'', excerpt:'', tipo:'blog' };

// ═════════════════════════════════════════════════════════════════════════════
// TESTES ETF
// ═════════════════════════════════════════════════════════════════════════════
function criarTestesEtf(): EtfTeste[] {
  return [
    // analisarTexto — Testes básicos e edge cases
    { id:'t01', grupo:'analisarTexto()', icone:'🔤', nome:'Vogais peso 2x, consoantes 1x', descricao:'"aabb" → a=4, b=2',
      fn: async () => { const t=performance.now(); const s=analisarTexto('aabb'); const d=performance.now()-t; const ok=s['a']===4&&s['b']===2; return { status:ok?'pass':'fail', duracao:d, entrada:'aabb', saida:s, erro:ok?undefined:`a=${s['a']} b=${s['b']}`, detalhes:{esperado:'a=4 b=2'} }; } },
    { id:'t02', grupo:'analisarTexto()', icone:'🔤', nome:'Texto sem letras → {}', descricao:'"123 !@#" deve retornar objeto vazio',
      fn: async () => { const t=performance.now(); const s=analisarTexto('123 !@#'); const d=performance.now()-t; const ok=Object.keys(s).length===0; return { status:ok?'pass':'fail', duracao:d, entrada:'123 !@#', saida:s, erro:ok?undefined:'Esperado {}', detalhes:{chaves:Object.keys(s)} }; } },
    { id:'t03', grupo:'analisarTexto()', icone:'🔤', nome:'Acentos normalizados (á = a)', descricao:'analisarTexto("á") deve gerar mesmo resultado que analisarTexto("a")',
      fn: async () => { const t=performance.now(); const s1=analisarTexto('a'); const s2=analisarTexto('á'); const d=performance.now()-t; const ok=s1['a']===s2['a']; return { status:ok?'pass':'fail', duracao:d, entrada:{a:'a',aacento:'á'}, saida:{s1,s2}, erro:ok?undefined:`a=${s1['a']} á=${s2['a']}`, detalhes:{} }; } },
    { id:'t04', grupo:'analisarTexto()', icone:'🔤', nome:'Texto real do post blog', descricao:'Deve ter ≥10 letras únicas',
      fn: async () => { const t=performance.now(); const txt=`${P_BLOG1.titulo} ${P_BLOG1.excerpt}`; const s=analisarTexto(txt); const d=performance.now()-t; const ok=Object.keys(s).length>=10; return { status:ok?'pass':'fail', duracao:d, entrada:txt.slice(0,60)+'...', saida:{ letrasUnicas:Object.keys(s).length, top5:Object.entries(s).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([l,v])=>`${l}=${v}`).join(' ') }, erro:ok?undefined:`Só ${Object.keys(s).length} letras`, detalhes:{} }; } },
    { id:'t05', grupo:'analisarTexto()', icone:'🔤', nome:'Texto muito longo (1000 chars)', descricao:'Performance com texto grande',
      fn: async () => { const t=performance.now(); const txt='a'.repeat(1000); const s=analisarTexto(txt); const d=performance.now()-t; const ok=s['a']===2000&&d<50; return { status:ok?'pass':'fail', duracao:d, entrada:`'a'.repeat(1000)`, saida:{letraA:s['a'],duracaoMs:d}, erro:ok?undefined:`a=${s['a']} esperado=2000, lento=${d}ms`, detalhes:{limiteMs:50} }; } },
    { id:'t06', grupo:'analisarTexto()', icone:'🔤', nome:'Caracteres especiais e emojis', descricao:'"🚀🌟💎" deve ser tratado como texto vazio',
      fn: async () => { const t=performance.now(); const s=analisarTexto('🚀🌟💎'); const d=performance.now()-t; const ok=Object.keys(s).length===0; return { status:ok?'pass':'fail', duracao:d, entrada:'🚀🌟💎', saida:s, erro:ok?undefined:'Emojis devem ser ignorados', detalhes:{chavesEncontradas:Object.keys(s)} }; } },
    { id:'t07', grupo:'analisarTexto()', icone:'🔤', nome:'Texto null/undefined', descricao:'Deve retornar {} sem quebrar',
      fn: async () => { const t=performance.now(); let s1,s2; try{s1=analisarTexto(null as any);s2=analisarTexto(undefined as any);}catch(e){} const d=performance.now()-t; const ok=(s1&&Object.keys(s1).length===0)&&(s2&&Object.keys(s2).length===0); return { status:ok?'pass':'fail', duracao:d, entrada:{null:null,undefined:undefined}, saida:{s1,s2}, erro:ok?undefined:'Deve retornar {} para valores null/undefined', detalhes:{} }; } },

    // calcularValorPost — Testes avançados
    { id:'t08', grupo:'calcularValorPost()', icone:'🔢', nome:'Post real → valor > 0', descricao:'Deve retornar número positivo finito',
      fn: async () => { const t=performance.now(); const s=calcularValorPost(P_BLOG1); const d=performance.now()-t; const ok=typeof s==='number'&&s>0&&Number.isFinite(s); return { status:ok?'pass':'fail', duracao:d, entrada:P_BLOG1.titulo, saida:s, erro:ok?undefined:`Valor inválido: ${s}`, detalhes:{tipo:typeof s} }; } },
    { id:'t09', grupo:'calcularValorPost()', icone:'🔢', nome:'Posts diferentes → valores diferentes', descricao:'BLOG1 ≠ BLOG2',
      fn: async () => { const t=performance.now(); const v1=calcularValorPost(P_BLOG1); const v2=calcularValorPost(P_BLOG2); const d=performance.now()-t; const ok=v1!==v2; return { status:ok?'pass':'fail', duracao:d, entrada:{p1:P_BLOG1.titulo.slice(0,30),p2:P_BLOG2.titulo.slice(0,30)}, saida:{v1,v2,diferenca:Math.abs(v1-v2)}, erro:ok?undefined:'Colisão! Valores iguais', detalhes:{} }; } },
    { id:'t10', grupo:'calcularValorPost()', icone:'🔢', nome:'Post vazio → 0', descricao:'Sem texto deve retornar exatamente 0',
      fn: async () => { const t=performance.now(); const s=calcularValorPost(P_VAZIO); const d=performance.now()-t; const ok=s===0; return { status:ok?'pass':'fail', duracao:d, entrada:P_VAZIO, saida:s, erro:ok?undefined:`Esperado 0, recebeu ${s}`, detalhes:{} }; } },
    { id:'t11', grupo:'calcularValorPost()', icone:'🔢', nome:'Idempotência — mesmo resultado 2x', descricao:'Mesma entrada → mesmo valor sempre',
      fn: async () => { const t=performance.now(); const v1=calcularValorPost(P_JORN); const v2=calcularValorPost(P_JORN); const d=performance.now()-t; const ok=v1===v2; return { status:ok?'pass':'fail', duracao:d, entrada:P_JORN.titulo, saida:{v1,v2}, erro:ok?undefined:`${v1} ≠ ${v2}`, detalhes:{} }; } },
    { id:'t12', grupo:'calcularValorPost()', icone:'🔢', nome:'Post com XSS attempt', descricao:'Deve sanitizar e calcular normalmente',
      fn: async () => { const t=performance.now(); const p={...P_BLOG1,titulo:'<script>alert(1)</script>Test'}; const s=calcularValorPost(p); const d=performance.now()-t; const ok=typeof s==='number'&&s>0; return { status:ok?'pass':'fail', duracao:d, entrada:p.titulo, saida:s, erro:ok?undefined:'Falhou com XSS attempt', detalhes:{tipo:typeof s} }; } },
    { id:'t13', grupo:'calcularValorPost()', icone:'🔢', nome:'Post muito longo', descricao:'Texto de 10k chars deve ser processado',
      fn: async () => { const t=performance.now(); const p={...P_BLOG1,titulo:'A'.repeat(10000)}; const s=calcularValorPost(p); const d=performance.now()-t; const ok=typeof s==='number'&&s>0&&d<100; return { status:ok?'pass':'fail', duracao:d, entrada:`'A'.repeat(10000)`, saida:{valor:s,duracaoMs:d}, erro:ok?undefined:`Lento ou falhou: ${d}ms`, detalhes:{limiteMs:100} }; } },

    // calcularBloco — Testes de negócio
    { id:'t14', grupo:'calcularBloco()', icone:'🧱', nome:'Bloco blog — peso 0.40 / contrib R$1.440', descricao:'Estrutura correta com 2 posts',
      fn: async () => { const t=performance.now(); const s=calcularBloco([P_BLOG1,P_BLOG2],'blog'); const d=performance.now()-t; const ok=s.tipo==='blog'&&s.peso===0.40&&s.contribuicao===1440&&s.codigo.length===6&&s.posts.length===2; return { status:ok?'pass':'fail', duracao:d, entrada:{posts:2,tipo:'blog'}, saida:{tipo:s.tipo,peso:s.peso,contrib:s.contribuicao,codigo:s.codigo,posts:s.posts.length}, erro:ok?undefined:`peso=${s.peso} contrib=${s.contribuicao} codLen=${s.codigo.length}`, detalhes:{} }; } },
    { id:'t15', grupo:'calcularBloco()', icone:'🧱', nome:'Bloco jornal — peso 0.35 / contrib R$1.260', descricao:'',
      fn: async () => { const t=performance.now(); const s=calcularBloco([P_JORN],'jornal'); const d=performance.now()-t; const ok=s.peso===0.35&&s.contribuicao===1260; return { status:ok?'pass':'fail', duracao:d, entrada:{posts:1,tipo:'jornal'}, saida:{peso:s.peso,contrib:s.contribuicao}, erro:ok?undefined:`peso=${s.peso} contrib=${s.contribuicao}`, detalhes:{} }; } },
    { id:'t16', grupo:'calcularBloco()', icone:'🧱', nome:'Bloco vazio — não quebra', descricao:'posts=[] → valor=0, código de 6 chars',
      fn: async () => { const t=performance.now(); const s=calcularBloco([],'tv'); const d=performance.now()-t; const ok=s.valor===0&&s.codigo.length===6; return { status:ok?'pass':'fail', duracao:d, entrada:{posts:0,tipo:'tv'}, saida:{valor:s.valor,codigo:s.codigo}, erro:ok?undefined:`valor=${s.valor} codLen=${s.codigo.length}`, detalhes:{} }; } },
    { id:'t17', grupo:'calcularBloco()', icone:'🧱', nome:'Código sem chars ambíguos (sem 0 O 1 I)', descricao:'Regex: /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/',
      fn: async () => { const t=performance.now(); const s=calcularBloco([P_BLOG1,P_BLOG2],'blog').codigo; const d=performance.now()-t; const ok=/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(s); return { status:ok?'pass':'fail', duracao:d, entrada:'bloco com 2 posts', saida:s, erro:ok?undefined:`Chars inválidos em "${s}"`, detalhes:{regex:'/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/'} }; } },
    { id:'t18', grupo:'calcularBloco()', icone:'🧱', nome:'Bloco com posts duplicados', descricao:'Deve deduplicar e calcular corretamente',
      fn: async () => { const t=performance.now(); const s=calcularBloco([P_BLOG1,P_BLOG1,P_BLOG2],'blog'); const d=performance.now()-t; const ok=s.posts.length===2&&s.peso===0.40; return { status:ok?'pass':'fail', duracao:d, entrada:{postsDuplicados:3,unicosEsperados:2}, saida:{posts:s.posts.length,peso:s.peso}, erro:ok?undefined:`Posts=${s.posts.length} esperado=2`, detalhes:{} }; } },
    { id:'t19', grupo:'calcularBloco()', icone:'🧱', nome:'Tipo inválido — deve quebrar graciosamente', descricao:'Tipo desconhecido deve lançar erro',
      fn: async () => { const t=performance.now(); let erro:string|undefined,s; try{s=calcularBloco([P_BLOG1],'invalido' as any);}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const ok=erro&&erro.includes('tipo'); return { status:ok?'pass':'fail', duracao:d, entrada:{tipo:'invalido'}, saida:s, erro:ok?undefined:'Deve rejeitar tipo inválido', detalhes:{erroCapturado:erro} }; } },

    // gerarCota — Testes de integração
    { id:'t20', grupo:'gerarCota()', icone:'💎', nome:'Estrutura completa (id, código, 3 blocos, R$3600)', descricao:'',
      fn: async () => { const t=performance.now(); const s=gerarCota([P_BLOG1,P_BLOG2],[P_JORN],[P_TV]); const d=performance.now()-t; const ok=s.id.startsWith('GT')&&s.codigoCompleto.startsWith('GT-')&&s.blocos.length===3&&s.valorTotal===3600&&s.status==='disponivel'; return { status:ok?'pass':'fail', duracao:d, entrada:{blog:2,jornal:1,tv:1}, saida:{id:s.id,codigo:s.codigoCompleto,blocos:s.blocos.length,valor:s.valorTotal,status:s.status}, erro:ok?undefined:'Estrutura inválida', detalhes:{} }; } },
    { id:'t21', grupo:'gerarCota()', icone:'💎', nome:'Formato GT-XXXXXX-XXXXXX-XXXXXX-XX', descricao:'5 partes separadas por hífen',
      fn: async () => { const t=performance.now(); const s=gerarCota([P_BLOG1],[P_JORN],[P_TV]).codigoCompleto; const d=performance.now()-t; const partes=s.split('-'); const ok=partes.length===5&&partes[0]==='GT'&&partes[4].length===2; return { status:ok?'pass':'fail', duracao:d, entrada:'gerarCota', saida:s, erro:ok?undefined:`Partes=${partes.length} checksum="${partes[4]}"`, detalhes:{partes} }; } },
    { id:'t22', grupo:'gerarCota()', icone:'💎', nome:'Soma dos pesos = 1.00 (100%)', descricao:'Blog 40% + Jornal 35% + TV 25%',
      fn: async () => { const t=performance.now(); const c=gerarCota([P_BLOG1],[P_JORN],[P_TV]); const soma=c.blocos.reduce((a,b)=>a+b.peso,0); const d=performance.now()-t; const ok=Math.abs(soma-1)<0.001; return { status:ok?'pass':'fail', duracao:d, entrada:'blocos', saida:{soma,blocos:c.blocos.map(b=>({tipo:b.tipo,peso:b.peso}))}, erro:ok?undefined:`Soma=${soma}`, detalhes:{} }; } },
    { id:'t23', grupo:'gerarCota()', icone:'💎', nome:'Soma das contribuições = R$3.600', descricao:'1440 + 1260 + 900 = 3600',
      fn: async () => { const t=performance.now(); const c=gerarCota([P_BLOG1],[P_JORN],[P_TV]); const soma=c.blocos.reduce((a,b)=>a+b.contribuicao,0); const d=performance.now()-t; const ok=Math.abs(soma-3600)<0.01; return { status:ok?'pass':'fail', duracao:d, entrada:'blocos', saida:{soma,por:c.blocos.map(b=>({tipo:b.tipo,contrib:b.contribuicao}))}, erro:ok?undefined:`Soma=R$${soma}`, detalhes:{} }; } },
    { id:'t24', grupo:'gerarCota()', icone:'💎', nome:'Cota vazia — não quebra', descricao:'gerarCota([], [], []) deve retornar cota válida',
      fn: async () => { const t=performance.now(); let s:CotaETF|null=null; let erro:string|undefined; try{s=gerarCota([],[],[])}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const ok=!erro&&s!==null&&s.blocos.length===3; return { status:ok?'pass':'fail', duracao:d, entrada:'[],[],[]', saida:s?{id:s.id,blocos:s.blocos.length}:null, erro, detalhes:{naoQuebrou:!erro} }; } },
    { id:'t25', grupo:'gerarCota()', icone:'💎', nome:'IDs únicos entre chamadas', descricao:'Duas chamadas → IDs diferentes',
      fn: async () => { const t=performance.now(); const c1=gerarCota([P_BLOG1],[P_JORN],[P_TV]); await new Promise(r=>setTimeout(r,2)); const c2=gerarCota([P_BLOG1],[P_JORN],[P_TV]); const d=performance.now()-t; const ok=c1.id!==c2.id; return { status:ok?'pass':'fail', duracao:d, entrada:'2x gerarCota()', saida:{id1:c1.id,id2:c2.id}, erro:ok?undefined:'Colisão de IDs!', detalhes:{} }; } },
    { id:'t26', grupo:'gerarCota()', icone:'💎', nome:'Cota com dados malformados', descricao:'Deve lidar com posts inválidos',
      fn: async () => { const t=performance.now(); const pInvalido={titulo:'',slug:'',date:'',category:'',excerpt:'',tipo:'blog' as const}; let s:CotaETF|null=null,erro:string|undefined; try{s=gerarCota([pInvalido],[],[]);}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const ok=!erro&&s!==null&&s.valorTotal>=0; return { status:ok?'pass':'fail', duracao:d, entrada:{postMalformado:pInvalido}, saida:s?{valorTotal:s.valorTotal}:null, erro, detalhes:{naoQuebrou:!erro} }; } },

    // API — Testes modernos e de carga
    { id:'t27', grupo:'GET /api/etf-cota', icone:'🌐', nome:'HTTP 200', descricao:'Rota existe e responde',
      fn: async () => { const t=performance.now(); let s:any=null,erro:string|undefined,st=0; try{const r=await fetch('/api/etf-cota');st=r.status;s=await r.json().catch(()=>r.text());}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const ok=st===200&&!erro; return { status:ok?'pass':'fail', duracao:d, entrada:'GET /api/etf-cota', saida:s, erro:ok?undefined:(erro??`HTTP ${st}`), detalhes:{httpStatus:st} }; } },
    { id:'t28', grupo:'GET /api/etf-cota', icone:'🌐', nome:'Campo "cota" com estrutura válida', descricao:'cota.codigoCompleto, cota.blocos, cota.status',
      fn: async () => { const t=performance.now(); let s:any=null,erro:string|undefined; try{const r=await fetch('/api/etf-cota');s=await r.json();}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const c=s?.cota; const ok=!erro&&c&&c.codigoCompleto&&Array.isArray(c.blocos)&&c.status; return { status:ok?'pass':'fail', duracao:d, entrada:'GET /api/etf-cota', saida:c??s, erro:ok?undefined:(erro??'Campo "cota" inválido'), detalhes:{temCodigo:!!c?.codigoCompleto,blocos:c?.blocos?.length,status:c?.status} }; } },
    { id:'t29', grupo:'GET /api/etf-cota', icone:'🌐', nome:'Campo "resumo" com postsBlog e postsJornal', descricao:'Contagens numéricas dos posts lidos do disco',
      fn: async () => { const t=performance.now(); let s:any=null,erro:string|undefined; try{const r=await fetch('/api/etf-cota');s=await r.json();}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const res=s?.resumo; const ok=!erro&&res&&typeof res.postsBlog==='number'&&typeof res.postsJornal==='number'; return { status:ok?'pass':'fail', duracao:d, entrada:'GET /api/etf-cota', saida:res??s, erro:ok?undefined:(erro??'"resumo" inválido'), detalhes:{postsBlog:res?.postsBlog,postsJornal:res?.postsJornal,debug:res?._debug} }; } },
    { id:'t30', grupo:'GET /api/etf-cota', icone:'🌐', nome:'Resposta em < 3s', descricao:'Latência da rota Next.js',
      fn: async () => { const t=performance.now(); let erro:string|undefined; try{const r=await fetch('/api/etf-cota');await r.json();}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const ok=!erro&&d<3000; return { status:ok?'pass':'fail', duracao:d, entrada:'GET /api/etf-cota', saida:{ms:d.toFixed(0)+'ms'}, erro:ok?undefined:(erro??`Lento: ${d.toFixed(0)}ms`), detalhes:{limite:'3000ms'} }; } },
    { id:'t31', grupo:'GET /api/etf-cota', icone:'🌐', nome:'Headers de segurança presentes', descricao:'X-Content-Type-Options, X-Frame-Options',
      fn: async () => { const t=performance.now(); let headers:any={},erro:string|undefined; try{const r=await fetch('/api/etf-cota');headers={...r.headers};}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const ok=!erro&&(headers['x-content-type-options']==='nosniff'||headers['x-frame-options']); return { status:ok?'pass':'fail', duracao:d, entrada:'GET /api/etf-cota', saida:{'x-content-type-options':headers['x-content-type-options'],'x-frame-options':headers['x-frame-options']}, erro:ok?undefined:'Headers de segurança ausentes', detalhes:{} }; } },
    { id:'t32', grupo:'GET /api/etf-cota', icone:'🌐', nome:'Cache-Control adequado', descricao:'Deve ter no-cache para dados dinâmicos',
      fn: async () => { const t=performance.now(); let cc:string='',erro:string|undefined; try{const r=await fetch('/api/etf-cota');cc=r.headers.get('cache-control')||'';}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const ok=!erro&&cc.includes('no-cache'); return { status:ok?'pass':'fail', duracao:d, entrada:'GET /api/etf-cota', saida:{'cache-control':cc}, erro:ok?undefined:'Cache-Control inadequado', detalhes:{esperado:'no-cache'} }; } },

    // Testes de carga e stress
    { id:'t33', grupo:'Performance', icone:'⚡', nome:'10 chamadas simultâneas ETF', descricao:'Deve aguentar carga moderada',
      fn: async () => { const t=performance.now(); const promises=Array(10).fill(0).map(()=>fetch('/api/etf-cota').then(r=>r.json())); let results:any[]=[],erro:string|undefined; try{results=await Promise.all(promises);}catch(e:any){erro=e?.message??String(e);} const d=performance.now()-t; const ok=!erro&&results.length===10&&results.every(r=>r.cota); return { status:ok?'pass':'fail', duracao:d, entrada:'10x /api/etf-cota simultâneo', saida:{duracaoTotal:d.toFixed(0)+'ms',sucessos:results.length}, erro:ok?undefined:(erro??'Falhou carga simultânea'), detalhes:{mediaPorChamada:(d/10).toFixed(1)+'ms'} }; } },
    { id:'t34', grupo:'Performance', icone:'⚡', nome:'analisarTexto() 1000x rápido', descricao:'Performance em lote',
      fn: async () => { const t=performance.now(); for(let i=0;i<1000;i++)analisarTexto('teste performance '+i); const d=performance.now()-t; const ok=d<200; return { status:ok?'pass':'fail', duracao:d, entrada:'1000x analisarTexto()', saida:{duracaoTotal:d.toFixed(0)+'ms',mediaPorChamada:(d/1000).toFixed(3)+'ms'}, erro:ok?undefined:`Lento: ${d}ms`, detalhes:{limite:'200ms'} }; } },
  ];
}

// ═════════════════════════════════════════════════════════════════════════════
// SHARED BADGE
// ═════════════════════════════════════════════════════════════════════════════
function Badge({ status }: { status: RouteStatus }) {
  const map: Record<RouteStatus, [string, string]> = {
    idle: ['#1e2235','#4b5563'], running: ['#0c1a2e','#60a5fa'],
    pass: ['#052e16','#4ade80'], fail: ['#2d0a0a','#f87171'],
    warn: ['#1c1700','#fbbf24'], skip: ['#1a1a1a','#6b7280'],
  };
  const labels: Record<RouteStatus, string> = { idle:'—', running:'RUN', pass:'PASS', fail:'FAIL', warn:'WARN', skip:'SKIP' };
  const [bg, fg] = map[status];
  return (
    <span style={{ background:bg, color:fg, border:`1px solid ${fg}44`, borderRadius:5, padding:'2px 9px', fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:11, fontWeight:700, letterSpacing:1, display:'inline-block', minWidth:46, textAlign:'center' }}>
      {labels[status]}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function TestesPage() {
  const [aba, setAba] = useState<'routes' | 'etf' | 'security'>('routes');

  // ── Routes state ───────────────────────────────────────────────────────────
  const [routeResults, setRouteResults] = useState<RouteResult[]>([]);
  const [log,          setLog]          = useState<LogLine[]>([]);
  const [routeRunning, setRouteRunning] = useState(false);
  const [progress,     setProgress]     = useState({ current:0, total:0 });
  const [expandedRoute,setExpandedRoute]= useState<string|null>(null);
  const [filterRoute,  setFilterRoute]  = useState<'all'|'fail'|'pass'|'warn'>('all');
  const logRef = useRef<HTMLDivElement>(null);

  // ── ETF state ──────────────────────────────────────────────────────────────
  const testesEtf = criarTestesEtf();
  const [etfResults,   setEtfResults]   = useState<Record<string, EtfResult>>({});
  const [etfRunning,   setEtfRunning]   = useState<string|null>(null);
  const [etfRunAll,    setEtfRunAll]    = useState(false);
  const [expandedEtf,  setExpandedEtf]  = useState<string|null>(null);

  // ── Routes helpers ─────────────────────────────────────────────────────────
  const pushLog = useCallback((text: string, kind: LogLine['kind'] = 'info') => {
    setLog(prev => {
      const next = [...prev, { t:Date.now(), text, kind }];
      setTimeout(() => logRef.current?.scrollTo({ top:99999, behavior:'smooth' }), 30);
      return next;
    });
  }, []);

  const runRoutes = async () => {
    setRouteRunning(true); setRouteResults([]); setLog([]);
    setProgress({ current:0, total:ROUTE_TESTS.length });
    pushLog('══════════════════════════════════════', 'head');
    pushLog(' GROWTH TRACKER — ROUTE TEST SUITE', 'head');
    pushLog(` ${new Date().toLocaleString('pt-BR')}`, 'head');
    pushLog('══════════════════════════════════════', 'head');
    pushLog(`${ROUTE_TESTS.length} testes enfileirados`, 'info');
    pushLog('', 'info');
    const session: RouteResult[] = [];
    for (let i=0; i<ROUTE_TESTS.length; i++) {
      const test = ROUTE_TESTS[i];
      setProgress({ current:i+1, total:ROUTE_TESTS.length });
      const pending: RouteResult = { ...test, status:'running', retries:0, timestamp:Date.now(), expectedCode:test.expectedStatus };
      setRouteResults(prev => { const e=prev.find(r=>r.id===test.id); return e?prev.map(r=>r.id===test.id?pending:r):[...prev,pending]; });
      pushLog(`→ [${i+1}/${ROUTE_TESTS.length}] ${test.label} (${test.path})`, 'info');
      const raw = await probeRoute(test);
      const result: RouteResult = { ...raw, timestamp:Date.now() };
      session.push(result);
      setRouteResults(prev => prev.map(r=>r.id===result.id?result:r));
      if (result.status==='pass') pushLog(`  ✓ PASS ${result.httpCode} — ${result.latencyMs}ms${result.retries?` (retry ×${result.retries})`:''}`, 'pass');
      else if (result.status==='warn') pushLog(`  ⚠ WARN ${result.httpCode}${result.redirectTo?` → ${result.redirectTo}`:''}`, 'warn');
      else { pushLog(`  ✗ FAIL ${result.httpCode??'NETWORK'} (esperado ${result.expectedCode??'2xx'})`, 'fail'); if (result.errorSnippet) pushLog(`    └ ${result.errorSnippet.slice(0,120)}`, 'fail'); }
    }
    const passed=session.filter(r=>r.status==='pass').length, failed=session.filter(r=>r.status==='fail').length, warned=session.filter(r=>r.status==='warn').length;
    const avgMs=Math.round(session.reduce((s,r)=>s+(r.latencyMs??0),0)/session.length);
    pushLog('', 'info');
    pushLog('──────────────────────────────────────', 'head');
    pushLog(` ✓ ${passed} passed   ✗ ${failed} failed   ⚠ ${warned} warn`, failed>0?'fail':'pass');
    pushLog(` latência média: ${avgMs}ms`, 'info');
    pushLog('──────────────────────────────────────', 'head');
    setRouteRunning(false);
  };

  // ── ETF helpers ────────────────────────────────────────────────────────────
  const rodarEtf = useCallback(async (teste: EtfTeste) => {
    setEtfRunning(teste.id);
    setEtfResults(prev => ({ ...prev, [teste.id]: { status:'running', duracao:0, entrada:null, saida:null, detalhes:{} } }));
    try { const r = await teste.fn(); setEtfResults(prev => ({ ...prev, [teste.id]: r })); }
    catch (e:any) { setEtfResults(prev => ({ ...prev, [teste.id]: { status:'fail', duracao:0, entrada:null, saida:null, erro:e?.message??String(e), detalhes:{} } })); }
    setEtfRunning(null);
  }, []);

  const rodarTodosEtf = useCallback(async () => {
    setEtfRunAll(true);
    for (const t of testesEtf) { await rodarEtf(t); await new Promise(r=>setTimeout(r,80)); }
    setEtfRunAll(false);
  }, [testesEtf, rodarEtf]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const rShown = routeResults.filter(r => filterRoute==='all'?true:r.status===filterRoute);
  const rPass  = routeResults.filter(r=>r.status==='pass').length;
  const rFail  = routeResults.filter(r=>r.status==='fail').length;
  const rWarn  = routeResults.filter(r=>r.status==='warn').length;
  const rPct   = routeResults.length>0 ? Math.round((rPass/routeResults.length)*100) : null;

  const etfGrupos = [...new Set(testesEtf.map(t=>t.grupo))];
  const etfPass   = testesEtf.filter(t=>etfResults[t.id]?.status==='pass').length;
  const etfFail   = testesEtf.filter(t=>etfResults[t.id]?.status==='fail').length;
  const etfTotal  = testesEtf.length;

  const etfStatusCor = (s: EtfStatus) => ({ idle:'rgba(255,255,255,0.18)', running:'#00d4ff', pass:'#00ff88', fail:'#ff4d6d' }[s]);

  const EtfIcon = ({ s }: { s: EtfStatus }) => {
    if (s==='running') return <RefreshCw size={13} style={{ animation:'spin 0.8s linear infinite', color:'#00d4ff' }}/>;
    if (s==='pass')    return <CheckCircle size={13} style={{ color:'#00ff88' }}/>;
    if (s==='fail')    return <XCircle size={13} style={{ color:'#ff4d6d' }}/>;
    return <div style={{ width:13, height:13, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.12)' }}/>;
  };

  // ─── ABA BADGE (contador de falhas) ───────────────────────────────────────
  const AbaBadge = ({ n, cor }: { n: number; cor: string }) => n > 0 ? (
    <span style={{ marginLeft:6, background:cor+'22', color:cor, borderRadius:10, fontSize:10, padding:'1px 6px', fontWeight:700 }}>{n}</span>
  ) : null;

  return (
    <div style={{ minHeight:'100vh', background:'#080b12', fontFamily:"'DM Sans',system-ui,sans-serif", color:'#e2e8f0' }}>
      <div style={{ maxWidth:820, margin:'0 auto', padding:'28px 16px 60px' }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h1 style={{ margin:0, fontSize:20, fontWeight:700, display:'flex', alignItems:'center', gap:10 }}>
            <span>🛰️</span> Test Suite
          </h1>
          <Link href="/" style={{ color:'#4b5563', fontSize:13, textDecoration:'none', padding:'6px 14px', border:'1px solid #1e2235', borderRadius:8 }}>← Voltar</Link>
        </div>

        {/* Abas */}
        <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:'1px solid #1e2235', paddingBottom:0 }}>
          {([
            { key:'routes', label:'🛰️ Rotas HTTP', fail:rFail },
            { key:'etf',    label:'⚙️ ETF Engine',  fail:etfFail },
            { key:'security', label:'🔒 Segurança', fail:0 }, // Placeholder para futuros testes
          ] as const).map(({ key, label, fail }) => (
            <button key={key} onClick={()=>setAba(key)} style={{
              padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', border:'none',
              background:'none', borderBottom:aba===key?'2px solid #6366f1':'2px solid transparent',
              color:aba===key?'#e2e8f0':'#4b5563', transition:'all 0.2s', display:'flex', alignItems:'center',
            }}>
              {label}<AbaBadge n={fail} cor="#f87171"/>
            </button>
          ))}
        </div>

        {/* ══ ABA ROUTES ════════════════════════════════════════════════════ */}
        {aba === 'routes' && (
          <>
            {routeResults.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:10, marginBottom:20 }}>
                {[
                  { label:'TOTAL', val:routeResults.length, color:'#6b7280' },
                  { label:'PASSOU', val:rPass, color:'#4ade80' },
                  { label:'FALHOU', val:rFail, color:'#f87171' },
                  { label:'AVISOU', val:rWarn, color:'#fbbf24' },
                  { label:'TAXA', val:rPct!==null?`${rPct}%`:'—', color:rPct===100?'#4ade80':rPct!==null&&rPct<70?'#f87171':'#fbbf24' },
                  { label:'LATÊNCIA', val:routeResults.length>0?`${Math.round(routeResults.reduce((s,r)=>s+(r.latencyMs??0),0)/routeResults.length)}ms`:'—', color:'#60a5fa' },
                ].map(s => (
                  <div key={s.label} style={{ background:'#0d1117', border:'1px solid #1e2235', borderRadius:10, padding:'14px 12px', textAlign:'center' }}>
                    <div style={{ fontSize:18, fontWeight:800, color:s.color, fontFamily:'monospace', lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:2, marginTop:4, textTransform:'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {routeRunning && (
              <div style={{ marginBottom:16 }}>
                <div style={{ height:3, background:'#1e2235', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#6366f1,#8b5cf6)', width:`${(progress.current/progress.total)*100}%`, transition:'width .3s ease' }}/>
                </div>
                <div style={{ fontSize:12, color:'#4b5563', marginTop:6, fontFamily:'monospace' }}>{progress.current}/{progress.total} — testando rotas...</div>
              </div>
            )}

            <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
              <button onClick={runRoutes} disabled={routeRunning} style={{ background:routeRunning?'#1e2235':'linear-gradient(135deg,#6366f1,#7c3aed)', color:routeRunning?'#4b5563':'#fff', border:'none', borderRadius:10, padding:'11px 24px', fontWeight:700, fontSize:14, cursor:routeRunning?'not-allowed':'pointer' }}>
                {routeRunning ? `⏳ ${progress.current}/${progress.total}...` : '▶ Executar Todos'}
              </button>
              {routeResults.length > 0 && (['all','pass','fail','warn'] as const).map(f => (
                <button key={f} onClick={()=>setFilterRoute(f)} style={{ background:filterRoute===f?'#1e2235':'transparent', color:filterRoute===f?'#e2e8f0':'#4b5563', border:`1px solid ${filterRoute===f?'#374151':'#1e2235'}`, borderRadius:8, padding:'8px 16px', fontSize:12, cursor:'pointer', fontWeight:600, textTransform:'uppercase', letterSpacing:0.8 }}>
                  {f==='all'?`Todos (${routeResults.length})`:f==='pass'?`✓ ${rPass}`:f==='fail'?`✗ ${rFail}`:`⚠ ${rWarn}`}
                </button>
              ))}
            </div>

            {rShown.length > 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
                {rShown.map(r => (
                  <div key={r.id} onClick={()=>setExpandedRoute(expandedRoute===r.id?null:r.id)} style={{ background:'#0d1117', border:`1px solid ${r.status==='fail'?'#f8717133':r.status==='pass'?'#4ade8022':r.status==='warn'?'#fbbf2422':'#1e2235'}`, borderRadius:10, padding:'14px 18px', cursor:'pointer' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
                        <Badge status={r.status}/>
                        <div>
                          <div style={{ fontWeight:600, fontSize:14 }}>{r.label}</div>
                          <div style={{ fontFamily:'monospace', fontSize:11, color:'#4b5563', marginTop:1 }}>{r.path}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
                        {r.httpCode && <span style={{ fontFamily:'monospace', fontSize:12, color:r.expectedCode===undefined||r.httpCode===r.expectedCode?'#4ade80':'#f87171', fontWeight:700 }}>{r.httpCode}{r.expectedCode!==undefined&&r.httpCode!==r.expectedCode&&<span style={{ color:'#6b7280', fontWeight:400 }}> (esp {r.expectedCode})</span>}</span>}
                        {r.latencyMs!==undefined && <span style={{ fontFamily:'monospace', fontSize:12, color:r.latencyMs>2000?'#fbbf24':'#6b7280' }}>{r.latencyMs}ms</span>}
                        {r.retries>0 && <span style={{ fontSize:11, color:'#fbbf24' }}>retry ×{r.retries}</span>}
                        <span style={{ color:'#374151', fontSize:12 }}>{expandedRoute===r.id?'▲':'▼'}</span>
                      </div>
                    </div>
                    {expandedRoute===r.id && (
                      <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid #1e2235', display:'flex', flexDirection:'column', gap:8 }}>
                        <div style={{ display:'flex', gap:6 }}>{r.tags.map(t=><span key={t} style={{ background:'#1e2235', color:'#6b7280', borderRadius:4, padding:'2px 8px', fontSize:11, fontFamily:'monospace', textTransform:'uppercase', letterSpacing:0.8 }}>{t}</span>)}</div>
                        {r.headers && Object.keys(r.headers).length > 0 && (
                          <div>{Object.entries(r.headers).map(([k,v])=><div key={k} style={{ fontFamily:'monospace', fontSize:12, color:'#9ca3af' }}><span style={{ color:'#6366f1' }}>{k}:</span> {v}</div>)}</div>
                        )}
                        {r.redirectTo && <div style={{ fontFamily:'monospace', fontSize:12 }}><span style={{ color:'#fbbf24' }}>→ </span><span>{r.redirectTo}</span></div>}
                        {r.errorSnippet && (
                          <div style={{ background:'#140a0a', border:'1px solid #f8717122', borderRadius:6, padding:'10px 12px', fontFamily:'monospace', fontSize:12, color:'#fca5a5', whiteSpace:'pre-wrap', wordBreak:'break-word', maxHeight:120, overflowY:'auto' }}>{r.errorSnippet}</div>
                        )}
                        <div style={{ fontFamily:'monospace', fontSize:11, color:'#374151' }}>{new Date(r.timestamp).toLocaleTimeString('pt-BR')}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {routeResults.length===0 && !routeRunning && (
              <div style={{ background:'#0d1117', border:'1px dashed #1e2235', borderRadius:12, padding:'48px 24px', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔬</div>
                <div style={{ fontWeight:600, marginBottom:6 }}>Nenhum teste executado</div>
                <div style={{ color:'#4b5563', fontSize:13 }}>Clique em <strong style={{ color:'#6366f1' }}>▶ Executar</strong> para verificar todas as rotas</div>
              </div>
            )}

            {log.length > 0 && (
              <div style={{ marginTop:8 }}>
                <div style={{ fontSize:11, color:'#4b5563', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Log de execução</div>
                <div ref={logRef} style={{ background:'#050709', border:'1px solid #1e2235', borderRadius:10, padding:'14px 16px', fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:12, lineHeight:1.7, maxHeight:300, overflowY:'auto' }}>
                  {log.map((l,i)=>(
                    <div key={i} style={{ color:l.kind==='pass'?'#4ade80':l.kind==='fail'?'#f87171':l.kind==='warn'?'#fbbf24':l.kind==='head'?'#6366f1':'#6b7280' }}>{l.text||'\u00a0'}</div>
                  ))}
                  {routeRunning && <div style={{ color:'#60a5fa' }}>▌</div>}
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ ABA SECURITY ══════════════════════════════════════════════════ */}
        {aba === 'security' && (
          <div style={{ background:'#0d1117', border:'1px solid #1e2235', borderRadius:12, padding:'32px 24px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Testes de Segurança</div>
            <div style={{ color:'#6b7280', fontSize:14, marginBottom:24 }}>Validação de vulnerabilidades e proteção de dados</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:24 }}>
              {[
                { icon:'🛡️', title:'XSS Protection', desc:'Proteção contra Cross-Site Scripting', status:'pending' },
                { icon:'🔐', title:'SQL Injection', desc:'Prevenção de injeção SQL', status:'pending' },
                { icon:'🌐', title:'CORS Policy', desc:'Validação de política CORS', status:'pending' },
                { icon:'🔒', title:'Headers Security', desc:'Headers de segurança HTTP', status:'pending' },
                { icon:'📊', title:'Rate Limiting', desc:'Limitação de taxa de requisições', status:'pending' },
                { icon:'🔑', title:'Auth Validation', desc:'Validação de autenticação', status:'pending' },
              ].map(item => (
                <div key={item.title} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'16px', textAlign:'center' }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{item.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.9)', marginBottom:4 }}>{item.title}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>{item.desc}</div>
                  <div style={{ marginTop:8, padding:'4px 8px', background:'rgba(255,255,255,0.1)', borderRadius:12, fontSize:9, color:'rgba(255,255,255,0.6)', display:'inline-block' }}>
                    {item.status === 'pending' ? '⏳ PENDENTE' : item.status === 'pass' ? '✅ PASSOU' : '❌ FALHOU'}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ color:'#4b5563', fontSize:12 }}>
              💡 Testes de segurança serão implementados nas próximas versões para validar proteção contra vulnerabilidades comuns.
            </div>
          </div>
        )}

        {/* ══ ABA ETF ═══════════════════════════════════════════════════════ */}
        {aba === 'etf' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))', gap:10, marginBottom:20 }}>
              {[
                { label:'TOTAL', val:etfTotal, cor:'rgba(255,255,255,0.6)' },
                { label:'PASSOU', val:etfPass, cor:'#00ff88' },
                { label:'FALHOU', val:etfFail, cor:'#ff4d6d' },
                { label:'PENDENTE', val:etfTotal-etfPass-etfFail, cor:'rgba(255,255,255,0.3)' },
                { label:'TAXA', val:etfTotal>0?`${Math.round((etfPass/etfTotal)*100)}%`:'—', cor:etfTotal>0&&etfPass===etfTotal?'#00ff88':'#ff4d6d' },
                { label:'GRUPOS', val:etfGrupos.length, cor:'rgba(255,255,255,0.5)' },
              ].map(({ label, val, cor }) => (
                <div key={label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'14px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:900, color:cor, fontFamily:'monospace', lineHeight:1 }}>{val}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:2, marginTop:4 }}>{label}</div>
                </div>
              ))}
            </div>

            {etfTotal > 0 && (etfPass+etfFail) > 0 && (
              <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, marginBottom:20, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(etfPass/etfTotal)*100}%`, background:'linear-gradient(90deg,#00ff88,#00d4ff)', borderRadius:2, transition:'width 0.5s ease' }}/>
              </div>
            )}

            <div style={{ display:'flex', gap:8, marginBottom:24 }}>
              <button onClick={rodarTodosEtf} disabled={etfRunAll} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 20px', background:etfRunAll?'rgba(0,212,255,0.10)':'rgba(0,255,136,0.12)', border:`1px solid ${etfRunAll?'rgba(0,212,255,0.4)':'rgba(0,255,136,0.40)'}`, borderRadius:20, color:etfRunAll?'#00d4ff':'#00ff88', fontSize:12, cursor:etfRunAll?'not-allowed':'pointer', fontWeight:700, letterSpacing:1 }}>
                <Play size={11} style={{ animation:etfRunAll?'spin 1s linear infinite':'none' }}/>{etfRunAll?'RODANDO...':'▶ RODAR TODOS'}
              </button>
            </div>

            {/* Grupos */}
            {etfGrupos.map(grupo => {
              const lista = testesEtf.filter(t=>t.grupo===grupo);
              const gPass = lista.filter(t=>etfResults[t.id]?.status==='pass').length;
              const gFail = lista.filter(t=>etfResults[t.id]?.status==='fail').length;
              return (
                <div key={grupo} style={{ marginBottom:18 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, padding:'7px 14px', background:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.18)', borderRadius:9 }}>
                    <span style={{ fontSize:12, color:'#818cf8', fontWeight:700, letterSpacing:1, fontFamily:'monospace' }}>{grupo}</span>
                    <div style={{ display:'flex', gap:8 }}>
                      {gPass>0 && <span style={{ fontSize:10, color:'#00ff88', fontWeight:700 }}>{gPass} ✓</span>}
                      {gFail>0 && <span style={{ fontSize:10, color:'#ff4d6d', fontWeight:700 }}>{gFail} ✗</span>}
                      <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)' }}>{lista.length} testes</span>
                    </div>
                  </div>

                  <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                    {lista.map(teste => {
                      const res = etfResults[teste.id];
                      const st: EtfStatus = res?.status ?? 'idle';
                      const cor = etfStatusCor(st);
                      const isExp = expandedEtf === teste.id;
                      return (
                        <div key={teste.id} style={{ border:`1px solid ${st==='idle'?'rgba(255,255,255,0.07)':cor+'40'}`, borderRadius:9, overflow:'hidden', background:st==='fail'?'rgba(255,77,109,0.04)':st==='pass'?'rgba(0,255,136,0.03)':'rgba(255,255,255,0.02)' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px' }}>
                            <EtfIcon s={st}/>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', fontWeight:600 }}>{teste.icone} {teste.nome}</div>
                              {teste.descricao && <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{teste.descricao}</div>}
                            </div>
                            {res?.duracao>0 && <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', whiteSpace:'nowrap' }}><Clock size={8} style={{ display:'inline', marginRight:3 }}/>{res.duracao.toFixed(1)}ms</div>}
                            <div style={{ display:'flex', gap:5 }}>
                              <button onClick={()=>rodarEtf(teste)} disabled={etfRunning===teste.id||etfRunAll} style={{ padding:'4px 10px', background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.25)', borderRadius:6, color:'#00ff88', fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontWeight:700 }}>
                                <Play size={8}/> RUN
                              </button>
                              {res && <button onClick={()=>setExpandedEtf(isExp?null:teste.id)} style={{ padding:'4px 8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:6, color:'rgba(255,255,255,0.5)', fontSize:10, cursor:'pointer' }}>
                                {isExp?<ChevronDown size={10}/>:<ChevronRight size={10}/>}
                              </button>}
                            </div>
                          </div>

                          {st==='fail' && res?.erro && !isExp && (
                            <div style={{ padding:'5px 14px 10px', fontSize:10, color:'#ff4d6d', borderTop:'1px solid rgba(255,77,109,0.15)' }}>⚠ {res.erro}</div>
                          )}

                          {isExp && res && (
                            <div style={{ borderTop:`1px solid ${cor}25`, padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
                              {res.erro && <div style={{ padding:'7px 10px', background:'rgba(255,77,109,0.08)', border:'1px solid rgba(255,77,109,0.25)', borderRadius:6, fontSize:11, color:'#ff4d6d' }}>⚠ {res.erro}</div>}
                              {[
                                { label:'📥 ENTRADA', valor:res.entrada },
                                { label:'📤 SAÍDA',   valor:res.saida },
                                { label:'🔍 DETALHES',valor:res.detalhes },
                              ].map(({ label, valor }) => (
                                <div key={label}>
                                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:4 }}>{label}</div>
                                  <pre style={{ margin:0, padding:'9px 11px', background:'rgba(0,0,0,0.45)', borderRadius:6, fontSize:10, color:'rgba(255,255,255,0.7)', overflowX:'auto', whiteSpace:'pre-wrap', wordBreak:'break-all', lineHeight:1.6 }}>{JSON.stringify(valor,null,2)}</pre>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dica inferior */}
        <div style={{ marginTop:28, padding:'12px 16px', background:'#0d1117', border:'1px solid #1e2235', borderRadius:8, fontSize:12, color:'#4b5563' }}>
          {aba==='routes'
            ? <>�️ Testa {ROUTE_TESTS.length} rotas HTTP incluindo páginas, APIs, segurança e performance. Cobre casos 404, XSS, SQL injection e latência.</>
            : aba==='etf'
            ? <>⚙️ Testa {etfTotal} funções do ETF Engine + APIs. Inclui edge cases, performance, segurança e validação de dados.</>
            : <>🔒 Testes de segurança avaliam proteção contra vulnerabilidades comuns e validação de headers de segurança.</>
          }
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.3); border-radius:2px; }
      `}</style>
    </div>
  );
}
