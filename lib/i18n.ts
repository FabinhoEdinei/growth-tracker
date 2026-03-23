// lib/i18n.ts
export const LOCALES = ['pt', 'en', 'es', 'de', 'ja'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'pt';
export const COOKIE_NAME = 'gt_locale';

const LOCALE_MAP: Record<string, Locale> = {
  'pt':'pt','pt-br':'pt','pt-pt':'pt',
  'en':'en','en-us':'en','en-gb':'en','en-au':'en',
  'es':'es','es-es':'es','es-419':'es','es-mx':'es',
  'de':'de','de-de':'de','de-at':'de','de-ch':'de',
  'ja':'ja','ja-jp':'ja',
};

export function detectLocale(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const langs = acceptLanguage.split(',').map(l => l.split(';')[0].trim().toLowerCase());
  for (const lang of langs) {
    if (LOCALE_MAP[lang]) return LOCALE_MAP[lang];
    if (LOCALE_MAP[lang.split('-')[0]]) return LOCALE_MAP[lang.split('-')[0]];
  }
  return DEFAULT_LOCALE;
}

// Cookie > Accept-Language > default
export function resolveLocale(cookie?: string, acceptLang?: string): Locale {
  if (cookie && LOCALES.includes(cookie as Locale)) return cookie as Locale;
  return detectLocale(acceptLang);
}

export const LOCALE_META: Record<Locale, { flag:string; short:string; label:string }> = {
  pt:{ flag:'🇧🇷', short:'PT', label:'Português' },
  en:{ flag:'🇺🇸', short:'EN', label:'English'   },
  es:{ flag:'🇪🇸', short:'ES', label:'Español'   },
  de:{ flag:'🇩🇪', short:'DE', label:'Deutsch'   },
  ja:{ flag:'🇯🇵', short:'JA', label:'日本語'     },
};
