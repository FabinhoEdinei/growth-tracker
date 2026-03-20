// lib/i18n.ts
// Configuração de internacionalização — detecção automática pelo browser
// Sem mudança de URL, sem roteamento por locale

export const LOCALES = ['pt', 'en', 'es', 'de', 'ja'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'pt';

// Mapa de Accept-Language para locale suportado
const LOCALE_MAP: Record<string, Locale> = {
  'pt': 'pt', 'pt-br': 'pt', 'pt-pt': 'pt',
  'en': 'en', 'en-us': 'en', 'en-gb': 'en', 'en-au': 'en',
  'es': 'es', 'es-es': 'es', 'es-419': 'es', 'es-mx': 'es',
  'de': 'de', 'de-de': 'de', 'de-at': 'de', 'de-ch': 'de',
  'ja': 'ja', 'ja-jp': 'ja',
};

export function detectLocale(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const langs = acceptLanguage
    .split(',')
    .map(l => l.split(';')[0].trim().toLowerCase());
  for (const lang of langs) {
    if (LOCALE_MAP[lang]) return LOCALE_MAP[lang];
    const base = lang.split('-')[0];
    if (LOCALE_MAP[base]) return LOCALE_MAP[base];
  }
  return DEFAULT_LOCALE;
}

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: '🇧🇷 PT',
  en: '🇺🇸 EN',
  es: '🇪🇸 ES',
  de: '🇩🇪 DE',
  ja: '🇯🇵 JA',
};
