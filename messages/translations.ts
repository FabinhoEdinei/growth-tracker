// messages/translations.ts
// Todas as strings traduzíveis do Growth Tracker
// Organizado por módulo: nav, jornal, blog, tv, comum

import type { Locale } from '@/lib/i18n';

export interface Messages {
  comum: {
    voltar:   string; home:      string; ler:       string;
    editar:   string; salvo:     string; resetar:   string;
    carregando: string; semDados: string; pagina:   string;
    de:       string; edicoes:   string; proximo:   string;
    anterior: string; gratuito: string;
  };
  nav: {
    jornal:    string; blog:      string; tv:        string;
    manga:     string; perfil:    string; testes:    string;
    pentaculos:string;
  };
  jornal: {
    titulo:    string; subtitulo: string; cronologia: string;
    edicaoNum: string; lerCompleto: string;
    semEdicoes:string; continuacao: string; arquivo:  string;
    tipoFatos: string; tipoOpiniao:string; tipoLugares:string;
    tipoCultura:string; tipoTecnologia:string;
  };
  blog: {
    titulo:    string; lerMais:   string; minLeitura: string;
    publicadoEm: string; categorias: string; buscar:  string;
    semPosts:  string; verTodos:  string;
  };
  tv: {
    aoVivo:    string; pausado:   string; retomar:   string;
    canais:    string; editar:    string; carregando:string;
    nomeRede:  string; dirEsq:    string; dirDir:    string;
    nenhumAtivo:string; abrirEditor:string;
    // Canais
    canalGT:   string; canalRH:   string; canalQA:  string;
    canalENG:  string; canalPCP:  string; canalSEG: string;
    canalGG:   string;
    // Slides RH
    rhRotina:  string; rhBeneficios:string; rhTreinamentos:string; rhVagas:string;
    // Slides QA
    qaIndicadores:string; qaNaoConformidades:string; qaAuditorias:string;
    // Slides ENG
    engNovosItens:string; engProjetos:string; engAlteracoes:string;
    // Slides PCP
    pcpProducao:string; pcpSequencia:string; pcpEstoque:string;
    // Slides SEG
    segDDS:    string; segIndicadores:string; segEPI:  string;
    // Slides GG
    ggKPIs:    string; ggMetas:    string; ggComunicados:string;
  };
  manga: {
    capitulos: string; pagina:    string; fimCapitulo:string;
    verCapitulos:string; carregando:string; semImagens:string;
    rpgContinuar:string; rpgProxPagina:string;
  };
  datas: {
    locale:    string; // locale para Intl.DateTimeFormat
  };
}

// ─────────────────────────────────────────────────────────────────────────────
const pt: Messages = {
  comum: {
    voltar:'← Voltar', home:'⌂ Home', ler:'Ler →',
    editar:'✏️ Editar', salvo:'✓ Salvo', resetar:'↺ Resetar',
    carregando:'Carregando...', semDados:'Sem dados', pagina:'Pág.',
    de:'de', edicoes:'edições', proximo:'Próxima ▶', anterior:'◀ Anterior', gratuito:'GRATUITO',
  },
  nav: {
    jornal:'Jornal', blog:'Blog', tv:'TV', manga:'Manga',
    perfil:'Perfil', testes:'Testes', pentaculos:'Pentáculos',
  },
  jornal: {
    titulo:'GROWTH TRACKER GAZETTE', subtitulo:'Crônicas do Sul Digital',
    cronologia:'quarta-feira', edicaoNum:'EDIÇÃO Nº.',
    lerCompleto:'LER HISTÓRIA COMPLETA →', semEdicoes:'◆ SEM EDIÇÕES PUBLICADAS ◆',
    continuacao:'CONTINUAÇÃO', arquivo:'EDIÇÕES NO ARQUIVO',
    tipoFatos:'FATOS DO DIA', tipoOpiniao:'OPINIÃO', tipoLugares:'TERRAS EXPLORADAS',
    tipoCultura:'CULTURA', tipoTecnologia:'TECNOLOGIA',
  },
  blog: {
    titulo:'Blog', lerMais:'Ler mais →', minLeitura:'min de leitura',
    publicadoEm:'Publicado em', categorias:'Categorias', buscar:'Buscar...',
    semPosts:'Nenhum post encontrado.', verTodos:'Ver todos',
  },
  tv: {
    aoVivo:'● AO VIVO', pausado:'PAUSADO', retomar:'TOQUE PARA RETOMAR',
    canais:'⚙️ CANAIS', editar:'✏️ EDITAR', carregando:'CARREGANDO CANAIS...',
    nomeRede:'GT NETWORK', dirEsq:'← ESQUERDA', dirDir:'→ DIREITA',
    nenhumAtivo:'NENHUM SLIDE ATIVO', abrirEditor:'⚙️ ABRIR EDITOR',
    canalGT:'GT Network', canalRH:'RH · Recursos Humanos', canalQA:'Qualidade',
    canalENG:'Engenharia', canalPCP:'PCP · Planejamento', canalSEG:'Segurança', canalGG:'Gestão Geral',
    rhRotina:'Rotina do Time', rhBeneficios:'Benefícios', rhTreinamentos:'Treinamentos', rhVagas:'Vagas Internas',
    qaIndicadores:'Indicadores', qaNaoConformidades:'Não Conformidades', qaAuditorias:'Auditorias',
    engNovosItens:'Novos Itens', engProjetos:'Projetos', engAlteracoes:'Alterações',
    pcpProducao:'Produção do Dia', pcpSequencia:'Sequência', pcpEstoque:'Estoque',
    segDDS:'DDS', segIndicadores:'Indicadores', segEPI:'EPIs',
    ggKPIs:'KPIs', ggMetas:'Metas', ggComunicados:'Comunicados',
  },
  manga: {
    capitulos:'capítulos', pagina:'Página', fimCapitulo:'FIM DO CAPÍTULO',
    verCapitulos:'VER CAPÍTULOS', carregando:'CARREGANDO...',
    semImagens:'Nenhum capítulo encontrado.',
    rpgContinuar:'CONTINUAR', rpgProxPagina:'PRÓX. PÁGINA',
  },
  datas: { locale:'pt-BR' },
};

// ─────────────────────────────────────────────────────────────────────────────
const en: Messages = {
  comum: {
    voltar:'← Back', home:'⌂ Home', ler:'Read →',
    editar:'✏️ Edit', salvo:'✓ Saved', resetar:'↺ Reset',
    carregando:'Loading...', semDados:'No data', pagina:'Page',
    de:'of', edicoes:'editions', proximo:'Next ▶', anterior:'◀ Previous', gratuito:'FREE',
  },
  nav: {
    jornal:'Journal', blog:'Blog', tv:'TV', manga:'Manga',
    perfil:'Profile', testes:'Tests', pentaculos:'Pentacles',
  },
  jornal: {
    titulo:'GROWTH TRACKER GAZETTE', subtitulo:'Chronicles of the Digital South',
    cronologia:'Wednesday', edicaoNum:'EDITION No.',
    lerCompleto:'READ FULL STORY →', semEdicoes:'◆ NO EDITIONS PUBLISHED ◆',
    continuacao:'CONTINUED', arquivo:'EDITIONS IN ARCHIVE',
    tipoFatos:'NEWS OF THE DAY', tipoOpiniao:'OPINION', tipoLugares:'EXPLORED LANDS',
    tipoCultura:'CULTURE', tipoTecnologia:'TECHNOLOGY',
  },
  blog: {
    titulo:'Blog', lerMais:'Read more →', minLeitura:'min read',
    publicadoEm:'Published on', categorias:'Categories', buscar:'Search...',
    semPosts:'No posts found.', verTodos:'View all',
  },
  tv: {
    aoVivo:'● LIVE', pausado:'PAUSED', retomar:'TAP TO RESUME',
    canais:'⚙️ CHANNELS', editar:'✏️ EDIT', carregando:'LOADING CHANNELS...',
    nomeRede:'GT NETWORK', dirEsq:'← LEFT', dirDir:'→ RIGHT',
    nenhumAtivo:'NO ACTIVE SLIDES', abrirEditor:'⚙️ OPEN EDITOR',
    canalGT:'GT Network', canalRH:'HR · Human Resources', canalQA:'Quality',
    canalENG:'Engineering', canalPCP:'PCP · Planning', canalSEG:'Safety', canalGG:'General Management',
    rhRotina:'Team Routine', rhBeneficios:'Benefits', rhTreinamentos:'Training', rhVagas:'Internal Jobs',
    qaIndicadores:'Indicators', qaNaoConformidades:'Non-Conformances', qaAuditorias:'Audits',
    engNovosItens:'New Items', engProjetos:'Projects', engAlteracoes:'Changes',
    pcpProducao:"Today's Production", pcpSequencia:'Schedule', pcpEstoque:'Stock',
    segDDS:'Safety Talk', segIndicadores:'Indicators', segEPI:'PPE',
    ggKPIs:'KPIs', ggMetas:'Targets', ggComunicados:'Announcements',
  },
  manga: {
    capitulos:'chapters', pagina:'Page', fimCapitulo:'END OF CHAPTER',
    verCapitulos:'VIEW CHAPTERS', carregando:'LOADING...',
    semImagens:'No chapters found.',
    rpgContinuar:'CONTINUE', rpgProxPagina:'NEXT PAGE',
  },
  datas: { locale:'en-US' },
};

// ─────────────────────────────────────────────────────────────────────────────
const es: Messages = {
  comum: {
    voltar:'← Volver', home:'⌂ Inicio', ler:'Leer →',
    editar:'✏️ Editar', salvo:'✓ Guardado', resetar:'↺ Restablecer',
    carregando:'Cargando...', semDados:'Sin datos', pagina:'Pág.',
    de:'de', edicoes:'ediciones', proximo:'Siguiente ▶', anterior:'◀ Anterior', gratuito:'GRATIS',
  },
  nav: {
    jornal:'Diario', blog:'Blog', tv:'TV', manga:'Manga',
    perfil:'Perfil', testes:'Pruebas', pentaculos:'Pentáculos',
  },
  jornal: {
    titulo:'GROWTH TRACKER GAZETTE', subtitulo:'Crónicas del Sur Digital',
    cronologia:'miércoles', edicaoNum:'EDICIÓN Nº.',
    lerCompleto:'LEER HISTORIA COMPLETA →', semEdicoes:'◆ SIN EDICIONES PUBLICADAS ◆',
    continuacao:'CONTINUACIÓN', arquivo:'EDICIONES EN ARCHIVO',
    tipoFatos:'NOTICIAS DEL DÍA', tipoOpiniao:'OPINIÓN', tipoLugares:'TIERRAS EXPLORADAS',
    tipoCultura:'CULTURA', tipoTecnologia:'TECNOLOGÍA',
  },
  blog: {
    titulo:'Blog', lerMais:'Leer más →', minLeitura:'min de lectura',
    publicadoEm:'Publicado el', categorias:'Categorías', buscar:'Buscar...',
    semPosts:'No se encontraron publicaciones.', verTodos:'Ver todos',
  },
  tv: {
    aoVivo:'● EN VIVO', pausado:'PAUSADO', retomar:'TOCA PARA CONTINUAR',
    canais:'⚙️ CANALES', editar:'✏️ EDITAR', carregando:'CARGANDO CANALES...',
    nomeRede:'GT NETWORK', dirEsq:'← IZQUIERDA', dirDir:'→ DERECHA',
    nenhumAtivo:'SIN DIAPOSITIVAS ACTIVAS', abrirEditor:'⚙️ ABRIR EDITOR',
    canalGT:'GT Network', canalRH:'RRHH · Recursos Humanos', canalQA:'Calidad',
    canalENG:'Ingeniería', canalPCP:'PCP · Planificación', canalSEG:'Seguridad', canalGG:'Gestión General',
    rhRotina:'Rutina del Equipo', rhBeneficios:'Beneficios', rhTreinamentos:'Capacitaciones', rhVagas:'Vacantes Internas',
    qaIndicadores:'Indicadores', qaNaoConformidades:'No Conformidades', qaAuditorias:'Auditorías',
    engNovosItens:'Nuevos Ítems', engProjetos:'Proyectos', engAlteracoes:'Cambios',
    pcpProducao:'Producción del Día', pcpSequencia:'Secuencia', pcpEstoque:'Inventario',
    segDDS:'Charla de Seguridad', segIndicadores:'Indicadores', segEPI:'EPP',
    ggKPIs:'KPIs', ggMetas:'Metas', ggComunicados:'Comunicados',
  },
  manga: {
    capitulos:'capítulos', pagina:'Página', fimCapitulo:'FIN DEL CAPÍTULO',
    verCapitulos:'VER CAPÍTULOS', carregando:'CARGANDO...',
    semImagens:'No se encontraron capítulos.',
    rpgContinuar:'CONTINUAR', rpgProxPagina:'SIG. PÁGINA',
  },
  datas: { locale:'es-ES' },
};

// ─────────────────────────────────────────────────────────────────────────────
const de: Messages = {
  comum: {
    voltar:'← Zurück', home:'⌂ Startseite', ler:'Lesen →',
    editar:'✏️ Bearbeiten', salvo:'✓ Gespeichert', resetar:'↺ Zurücksetzen',
    carregando:'Laden...', semDados:'Keine Daten', pagina:'Seite',
    de:'von', edicoes:'Ausgaben', proximo:'Weiter ▶', anterior:'◀ Zurück', gratuito:'KOSTENLOS',
  },
  nav: {
    jornal:'Zeitung', blog:'Blog', tv:'TV', manga:'Manga',
    perfil:'Profil', testes:'Tests', pentaculos:'Pentakel',
  },
  jornal: {
    titulo:'GROWTH TRACKER GAZETTE', subtitulo:'Chroniken des Digitalen Südens',
    cronologia:'Mittwoch', edicaoNum:'AUSGABE Nr.',
    lerCompleto:'VOLLSTÄNDIGEN ARTIKEL LESEN →', semEdicoes:'◆ KEINE AUSGABEN VERÖFFENTLICHT ◆',
    continuacao:'FORTSETZUNG', arquivo:'AUSGABEN IM ARCHIV',
    tipoFatos:'NACHRICHTEN DES TAGES', tipoOpiniao:'MEINUNG', tipoLugares:'ERKUNDETE LÄNDER',
    tipoCultura:'KULTUR', tipoTecnologia:'TECHNOLOGIE',
  },
  blog: {
    titulo:'Blog', lerMais:'Mehr lesen →', minLeitura:'Min. Lesezeit',
    publicadoEm:'Veröffentlicht am', categorias:'Kategorien', buscar:'Suchen...',
    semPosts:'Keine Beiträge gefunden.', verTodos:'Alle anzeigen',
  },
  tv: {
    aoVivo:'● LIVE', pausado:'PAUSIERT', retomar:'TIPPEN ZUM FORTFAHREN',
    canais:'⚙️ KANÄLE', editar:'✏️ BEARBEITEN', carregando:'KANÄLE LADEN...',
    nomeRede:'GT NETZWERK', dirEsq:'← LINKS', dirDir:'→ RECHTS',
    nenhumAtivo:'KEINE AKTIVEN FOLIEN', abrirEditor:'⚙️ EDITOR ÖFFNEN',
    canalGT:'GT Netzwerk', canalRH:'Personal · HR', canalQA:'Qualität',
    canalENG:'Technik', canalPCP:'PCP · Planung', canalSEG:'Sicherheit', canalGG:'Gesamtleitung',
    rhRotina:'Team-Routine', rhBeneficios:'Leistungen', rhTreinamentos:'Schulungen', rhVagas:'Interne Stellen',
    qaIndicadores:'Kennzahlen', qaNaoConformidades:'Abweichungen', qaAuditorias:'Audits',
    engNovosItens:'Neue Artikel', engProjetos:'Projekte', engAlteracoes:'Änderungen',
    pcpProducao:'Tagesproduktion', pcpSequencia:'Ablauf', pcpEstoque:'Lagerbestand',
    segDDS:'Sicherheitsgespräch', segIndicadores:'Kennzahlen', segEPI:'PSA',
    ggKPIs:'KPIs', ggMetas:'Ziele', ggComunicados:'Mitteilungen',
  },
  manga: {
    capitulos:'Kapitel', pagina:'Seite', fimCapitulo:'KAPITEL ENDE',
    verCapitulos:'KAPITEL ANZEIGEN', carregando:'LADEN...',
    semImagens:'Keine Kapitel gefunden.',
    rpgContinuar:'WEITER', rpgProxPagina:'NÄCHSTE SEITE',
  },
  datas: { locale:'de-DE' },
};

// ─────────────────────────────────────────────────────────────────────────────
const ja: Messages = {
  comum: {
    voltar:'← 戻る', home:'⌂ ホーム', ler:'読む →',
    editar:'✏️ 編集', salvo:'✓ 保存済み', resetar:'↺ リセット',
    carregando:'読み込み中...', semDados:'データなし', pagina:'ページ',
    de:'/', edicoes:'版', proximo:'次へ ▶', anterior:'◀ 前へ', gratuito:'無料',
  },
  nav: {
    jornal:'新聞', blog:'ブログ', tv:'テレビ', manga:'マンガ',
    perfil:'プロフィール', testes:'テスト', pentaculos:'ペンタクル',
  },
  jornal: {
    titulo:'グロース・トラッカー・ガゼット', subtitulo:'デジタル南部の年代記',
    cronologia:'水曜日', edicaoNum:'第', lerCompleto:'全文を読む →',
    semEdicoes:'◆ 記事未掲載 ◆', continuacao:'続き', arquivo:'アーカイブ',
    tipoFatos:'今日のニュース', tipoOpiniao:'意見', tipoLugares:'探索された土地',
    tipoCultura:'文化', tipoTecnologia:'テクノロジー',
  },
  blog: {
    titulo:'ブログ', lerMais:'続きを読む →', minLeitura:'分で読める',
    publicadoEm:'公開日:', categorias:'カテゴリー', buscar:'検索...',
    semPosts:'投稿が見つかりません。', verTodos:'すべて見る',
  },
  tv: {
    aoVivo:'● 生放送', pausado:'一時停止', retomar:'タップして再開',
    canais:'⚙️ チャンネル', editar:'✏️ 編集', carregando:'チャンネル読み込み中...',
    nomeRede:'GTネットワーク', dirEsq:'← 左', dirDir:'→ 右',
    nenhumAtivo:'アクティブなスライドなし', abrirEditor:'⚙️ エディターを開く',
    canalGT:'GTネットワーク', canalRH:'人事', canalQA:'品質',
    canalENG:'エンジニアリング', canalPCP:'生産計画', canalSEG:'安全', canalGG:'総合管理',
    rhRotina:'チームルーティン', rhBeneficios:'福利厚生', rhTreinamentos:'研修', rhVagas:'社内求人',
    qaIndicadores:'指標', qaNaoConformidades:'不適合', qaAuditorias:'監査',
    engNovosItens:'新規アイテム', engProjetos:'プロジェクト', engAlteracoes:'変更',
    pcpProducao:'本日の生産', pcpSequencia:'スケジュール', pcpEstoque:'在庫',
    segDDS:'安全ミーティング', segIndicadores:'指標', segEPI:'保護具',
    ggKPIs:'KPI', ggMetas:'目標', ggComunicados:'お知らせ',
  },
  manga: {
    capitulos:'話', pagina:'ページ', fimCapitulo:'第〇話終わり',
    verCapitulos:'話一覧', carregando:'読み込み中...',
    semImagens:'チャプターが見つかりません。',
    rpgContinuar:'続ける', rpgProxPagina:'次のページ',
  },
  datas: { locale:'ja-JP' },
};

// ─────────────────────────────────────────────────────────────────────────────
export const messages: Record<Locale, Messages> = { pt, en, es, de, ja };
