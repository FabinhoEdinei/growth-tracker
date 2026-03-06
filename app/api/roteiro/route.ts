import { RoteiroGenerator } from '@/app/utils/roteiro-generator';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const generator = new RoteiroGenerator();
    const roteiro = generator.gerarRoteiroDoDia();
    return NextResponse.json(roteiro);
  } catch (error) {
    console.error('Erro ao gerar roteiro:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar roteiro' },
      { status: 500 }
    );
  }
}
