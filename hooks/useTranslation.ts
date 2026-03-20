// hooks/useTranslation.ts
// Hook client-side — detecta idioma do browser, sem mudar URL
// Persiste escolha do usuário no localStorage
'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Locale, LOCALES, DEFAULT_LOCALE, detectLocale } from '@/lib/i18n';
import { messages, type Messages } from '@/messages/translations';

const LS_KEY = 'gt_locale';

// ─────────────────────────────────────────────────────────────────────────────
export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready,  setReady]       = useState(false);

  useEffect(() => {
    // 1. Verifica preferência salva pelo usuário
    const saved = localStorage.getItem(LS_KEY) as Locale | null;
    if (saved && LOCALES.includes(saved)) {
      setLocaleState(saved);
      setReady(true);
      return;
    }
    // 2. Detecta pelo browser
    const detected = detectLocale(navigator.language);
    setLocaleState(detected);
    setReady(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LS_KEY, l);
  }, []);

  const t: Messages = messages[locale];

  return { locale, setLocale, t, ready };
}

// ─────────────────────────────────────────────────────────────────────────────
// Versão server-side — lê Accept-Language do header
// Usar em Server Components e page.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function getServerLocale(acceptLanguage?: string): Locale {
  const saved = null; // servidor não tem localStorage
  if (saved) return saved as Locale;
  return detectLocale(acceptLanguage);
}

export function getServerTranslations(acceptLanguage?: string): Messages {
  const locale = getServerLocale(acceptLanguage);
  return messages[locale];
}
