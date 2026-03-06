import { DailyReportGenerator } from '@/app/utils/daily-report-generator';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const generator = new DailyReportGenerator();
    const relatorio = generator.gerarRelatorioDodia();
    return NextResponse.json(relatorio);
  } catch (error) {
    console.error('Erro ao gerar relatório diário:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório diário' },
      { status: 500 }
    );
  }
}
