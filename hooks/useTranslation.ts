'use client';
// hooks/useTranslation.ts
// ⚠️ Client-only — não exporta getT aqui
// Para Server Components use: import { getT } from '@/lib/getT'

import { useState, useEffect, useCallback } from 'react';
import { LOCALES, DEFAULT_LOCALE, COOKIE_NAME, resolveLocale, type Locale } from '@/lib/i18n';
import { messages } from '@/messages/translations';

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready,  setReady]       = useState(false);

  useEffect(() => {
    const cookie = document.cookie.split(';')
      .map(c => c.trim())
      .find(c => c.startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1];
    setLocaleState(resolveLocale(cookie, navigator.language));
    setReady(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  return { locale, setLocale, t: messages[locale], ready };
}
