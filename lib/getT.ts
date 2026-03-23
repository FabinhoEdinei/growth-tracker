// lib/getT.ts
// Server-only — sem 'use client'
// Usar em Server Components e page.tsx assíncronos

import { cookies, headers } from 'next/headers';
import { resolveLocale } from '@/lib/i18n';
import { messages, type Messages } from '@/messages/translations';

// Uso: const t = await getT();
export async function getT(): Promise<Messages> {
  const jar    = await cookies();
  const hdrs   = await headers();
  const cookie = jar.get('gt_locale')?.value;
  const accept = hdrs.get('accept-language') ?? '';
  return messages[resolveLocale(cookie, accept)];
}
