# 🌱 Growth Tracker

Um app de autoconhecimento com interface cyberpunk inspirada em *Tales of Arise*. Acompanhe seus indicadores de **Força**, **Determinação**, **Saúde Mental** e **Comprometimento**.

![Preview](https://i.imgur.com/fake-preview.png) <!-- substitua por print real depois -->

## 🛠 Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- Canvas API (gráfico radar)

## ▶️ Como rodar

1. Clone o repositório:
```bash
   git clone https://github.com/SEU_USUARIO/growth-tracker.git
   cd growth-tracker
```

2. Instale dependências:
```bash
   npm install
```

3. Gere o cliente Prisma:
```bash
   npx prisma generate
```

4. Inicie o app:
```bash
   npm run dev
```

Acesse: http://localhost:3000

## 🧪 Dados de teste

Popule o banco com dados iniciais:
```bash
npx ts-node scripts/test-db.ts
```

## 📂 Estrutura

- `/src/app` → páginas e rotas de API
- `/src/hooks/useUserData.ts` → lógica de dados
- `/src/components/RadarChart.tsx` → gráfico animado
- `prisma/schema.prisma` → modelo de dados

## 📸 Telas

1. **Home** – Introdução
2. **Dashboard** – Visão geral dos indicadores
3. **Perfil** – Edite seu nome e meta
4. **Treino** – Registre sessões e aumente indicadores
5. **Status** – Gráfico radar estilo *Tales of Arise*

---

Feito com 💙 para quem busca evoluir todos os dias.