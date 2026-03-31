// app/api/manga-tv/route.ts
// Retorna as páginas do Capítulo 1 do manga como lista de srcs para a TV Empresarial

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MANGA_DIR  = path.join(process.cwd(), 'public', 'manga', 'cap-01');
const VALID_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

export async function GET() {
  try {
    if (!fs.existsSync(MANGA_DIR)) {
      return NextResponse.json({ pages: [], total: 0 });
    }

    const files = fs.readdirSync(MANGA_DIR)
      .filter(f => VALID_EXTS.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const pages = files.map((f, i) => ({
      index: i,
      src:   `/manga/cap-01/${f}`,
      label: `Página ${i + 1}`,
    }));

    return NextResponse.json({ pages, total: pages.length });
  } catch (err) {
    console.error('[manga-tv] erro ao listar páginas:', err);
    return NextResponse.json({ pages: [], total: 0 }, { status: 500 });
  }
}
