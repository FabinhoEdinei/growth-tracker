// File: app/api/manga/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export interface MangaPage {
  index: number;
  src: string;
}

export interface MangaCapitulo {
  id: string; // 'cap-01'
  numero: number; // 1
  titulo: string; // 'Capítulo 1' ou título do arquivo info.json
  cover: string; // src da primeira página
  total: number; // total de páginas
  pages: MangaPage[];
}

const IMG_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

function isImage(f: string) {
  return IMG_EXT.some(ext => f.toLowerCase().endsWith(ext));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const capId = searchParams.get('cap');

  const mangaRoot = path.join(process.cwd(), 'public', 'manga');

  if (!fs.existsSync(mangaRoot)) {
    return NextResponse.json({
      capitulos: [], 
      total: 0, 
      aviso: 'Pasta public/manga/ não encontrada'
    });
  }

  try {
    const dirs = fs.readdirSync(mangaRoot)
      .filter(d => {
        const fullPath = path.join(mangaRoot, d);
        return fs.statSync(fullPath).isDirectory();
      })
      .sort(); // ordem alfabética cap-01, cap-02...

    const capitulos: MangaCapitulo[] = dirs.map((dir, i) => {
      const dirPath = path.join(mangaRoot, dir);

      let titulo = `Capítulo ${i + 1}`;
      const infoPath = path.join(dirPath, 'info.json');
      if (fs.existsSync(infoPath)) {
        try {
          const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
          if (info.titulo) titulo = info.titulo;
        } catch (e) {}
      }

      const arquivos = fs.readdirSync(dirPath)
        .filter(isImage)
        .sort();

      const pages: MangaPage[] = arquivos.map((f, idx) => ({
        index: idx,
        src: `/manga/${dir}/${f}`
      }));

      return {
        id: dir,
        numero: i + 1,
        titulo,
        cover: pages[0]?.src ?? '',
        total: pages.length,
        pages,
      };
    });

    // Filtro por capítulo específico
    if (capId) {
      const cap = capitulos.find(c => c.id === capId);
      if (!cap) return NextResponse.json({ erro: 'Capítulo não encontrado' }, { status: 404 });
      return NextResponse.json(cap);
    }

    return NextResponse.json({
      capitulos, 
      total: capitulos.length
    });

  } catch (err) {
    console.error('[manga API]', err);
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}