import fs from 'fs';
import path from 'path';

export interface CodeStats {
  totalFiles: number;
  totalLines: number;
  byExtension: Record<string, { files: number; lines: number }>;
}

export function countLinesOfCode(startPath: string): CodeStats {
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.css'];
  const stats: CodeStats = {
    totalFiles: 0,
    totalLines: 0,
    byExtension: {},
  };

  function walkDir(dir: string) {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Ignorar node_modules e outros diretórios
          if (!['.next', 'node_modules', '.git', 'dist', 'build'].includes(file)) {
            walkDir(filePath);
          }
        } else {
          const ext = path.extname(file);
          if (extensions.includes(ext)) {
            try {
              const content = fs.readFileSync(filePath, 'utf8');
              const lines = content.split('\n').length;

              stats.totalFiles++;
              stats.totalLines += lines;

              if (!stats.byExtension[ext]) {
                stats.byExtension[ext] = { files: 0, lines: 0 };
              }
              stats.byExtension[ext].files++;
              stats.byExtension[ext].lines += lines;
            } catch (error) {
              console.error(`Erro ao ler ${filePath}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao escanear diretório ${dir}:`, error);
    }
  }

  walkDir(startPath);
  return stats;
}
