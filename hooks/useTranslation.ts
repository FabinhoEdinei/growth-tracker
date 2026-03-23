// hooks/useTranslation.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { LOCALES, DEFAULT_LOCALE, COOKIE_NAME, resolveLocale, type Locale } from '@/lib/i18n';
import { messages, type Messages } from '@/messages/translations';

// ── Client hook ───────────────────────────────────────────────────────────────
export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready,  setReady]       = useState(false);

  useEffect(() => {
    // Lê cookie gt_locale
    const cookie = document.cookie.split(';')
      .map(c => c.trim()).find(c => c.startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1];
    const detected = resolveLocale(cookie, navigator.language);
    setLocaleState(detected);
    setReady(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    // Salva como cookie — 1 ano, path raiz — servidor lê em toda requisição
    document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  return { locale, setLocale, t: messages[locale], ready };
}

// ── Server helper — importar em Server Components e page.tsx ──────────────────
// Uso: const t = await getT();
export async function getT(): Promise<Messages> {
  const { cookies, headers } = await import('next/headers');
  const jar   = await cookies();
  const hdrs  = await headers();
  const cookie = jar.get(COOKIE_NAME)?.value;
  const accept = hdrs.get('accept-language') ?? '';
  const locale = resolveLocale(cookie, accept);
  return messages[locale];
}

// Versão síncrona para layout.tsx (sem await)
export function getTSync(cookieValue?: string, acceptLang?: string): Messages {
  const locale = resolveLocale(cookieValue, acceptLang);
  return messages[locale];
}
