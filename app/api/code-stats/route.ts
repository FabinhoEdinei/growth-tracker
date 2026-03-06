import { NextResponse } from 'next/server';
import { countLinesOfCode } from '@/app/lib/codeStats';

export async function GET() {
  try {
    const stats = countLinesOfCode(process.cwd());
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao contar linhas de código:', error);
    return NextResponse.json(
      { error: 'Erro ao contar linhas de código' },
      { status: 500 }
    );
  }
}
