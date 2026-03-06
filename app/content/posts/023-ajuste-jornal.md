---
title: "Ajuste Crítico no Sistema de Jornal"
slug: "023-ajuste-jornal"
date: "2026-03-06"
author: "Equipe Growth Tracker"
category: "Engenharia"
excerpt: "Resolução do erro 404 no jornal e otimização da arquitetura de busca de posts. Uma jornada pela correção de um bug que impedia a leitura de histórias antigas."
image: "/image/blog/jornal-fix.jpg"
---

## 📰 O Problema do Jornal Perdido

Era uma terça-feira quando os primeiros relatos chegaram: **os posts do jornal não estavam abrindo**. Ao clicar em qualquer história, o servidor retornava aquele temido erro 404 — "Página não encontrada". 

Não era um erro aleatório. Era algo sistemático. Cada clique em um post no jornal levava ao vazio digital.

## 🔍 A Investigação

A primeira coisa que fizemos foi seguir o caminho dos cliques:

1. **Componente NewspaperCard** passa o slug corretamente via `router.push`
2. **Página dinâmica** recebe o slug como parâmetro
3. **Função getPostBySlug()** procura pelo arquivo...

E é aqui que as coisas desmoronavam.

### O Culpado: Lógica Fraca de Busca

```typescript
// ❌ ANTES (Lógica quebrada)
const mdFile = filenames.find(
  (filename) => filename.replace('.md', '') === slug || filename.includes(slug)
);
```

Essa abordagem tinha problemas graves:

1. **Comparação de nome de arquivo**: Se o arquivo era `02-fabio-destaque.md` e o slug era `02-fabio-destaque`, funcionava por acaso
2. **Sem validação de frontmatter**: Ignorava completamente o campo `slug` definido no YAML do post
3. **Lógica incompleta**: Se o slug não correspondia exatamente ao nome do arquivo, estava perdido

E a realidade era: nossos arquivos tinham slugs personalizados no frontmatter!

```markdown
---
slug: "02-fabio-destaque"    # ← Aqui estava a verdade
title: "Fabio Derrota Bug Lendário"
type: "fabio"
---
```

## ✨ A Solução: Arquitetura Client-Server

Refatoramos completamente a abordagem, dividindo responsabilidades:

### 1️⃣ API Route (Servidor)

Criamos `/app/api/jornal/[slug]/route.ts`:

```typescript
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const jornalDirectory = path.join(process.cwd(), 'app/content/jornal');
    const filenames = fs.readdirSync(jornalDirectory);

    // Itera sobre todos os arquivos
    let mdFile: string | undefined;

    for (const filename of filenames) {
      if (!filename.endsWith('.md')) continue;

      const filePath = path.join(jornalDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      // ✅ Compara com o slug do frontmatter
      const fileSlug = data.slug || filename.replace('.md', '');

      if (fileSlug === slug) {
        mdFile = filename;
        break;
      }
    }

    if (!mdFile) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Lê e processa o arquivo encontrado
    const filePath = path.join(jornalDirectory, mdFile);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const post = {
      slug: data.slug || slug,
      title: data.title || '',
      type: data.type || 'fatos',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      character: data.character,
      content: await marked(content),
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error loading post:', error);
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
}
```

### 2️⃣ Página Cliente (Component)

Criamos `/app/jornal/[slug]/page.tsx` como **Client Component**:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<JornalPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/jornal/${params.slug}`);
        if (!response.ok) {
          setNotFound(true);
          return;
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Erro ao carregar post:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  // Renderiza baseado no estado...
}
```

## 🎯 Por Que Isso Funciona Agora

### ✅ Separação de Responsabilidades
- **API Route**: Trata lógica de file system (I/O é operação de servidor)
- **Página Cliente**: Renderiza UI e gerencia estado

### ✅ Busca Confiável
- Lê todos os arquivos `.md`
- Extrai o frontmatter com `gray-matter`
- Compara o slug com o valor real do post

### ✅ Tratamento de Erros
- 404 quando post não existe
- Loading state enquanto busca
- Fallback visual quando não encontra

### ✅ Sem Styled-JSX em Server Components
- Client Component pode usar `<style jsx>{}` legalmente
- Sem conflito com imports de servidor (`fs`, `path`)

## 📊 Impacto nos Números

Antes:
```
❌ Error 404: Todos os posts do jornal inacessíveis
⚠️ Styled-jsx em Server Component
❌ Types `any` desnecessários
```

Depois:
```
✅ Todos os posts acessíveis via slug correto
✅ Client Component com styled-jsx funcionando
✅ TypeScript rigorosamente tipado
✅ Build sem erros
```

## 🔧 Detalhes Técnicos

### Fluxo de Requisição

```
1. Usuário clica em NewspaerCard
   └─→ router.push(`/jornal/${post.slug}`)

2. Next.js navega para /jornal/[slug]
   └─→ Renderiza componente com { params }

3. useEffect dispara fetch
   └─→ GET /api/jornal/[slug]

4. API Route processa
   └─→ Busca por slug no frontmatter
   └─→ Retorna JSON com conteúdo parsed

5. Página atualiza estado
   └─→ Renderiza post com estilos vintage
```

### Tipação TypeScript

```typescript
interface JornalPost {
  slug: string;
  title: string;
  type: string;
  date: string;
  excerpt: string;
  character?: string;
  content: string;
}

interface TypeStyle {
  background: string;
  accentColor: string;
  icon: string;
  label: string;
}
```

## 🚀 Lições Aprendidas

1. **Frontmatter é Verdade**: Nem sempre o nome do arquivo reflete o conteúdo
2. **Separação de Responsabilidades**: Servidor para I/O, Cliente para UI
3. **Type Safety**: TypeScript salva da morte de mil bugs
4. **Styled-JSX tem Regras**: Deve estar em Client Components
5. **Testes são Vitais**: Uma simples verificação teria encontrado isso

## 🎉 Resultado Final

Agora o jornal funciona perfeitamente. Cada história pode ser lida, cada aventura de Fabio pode ser acessada, cada anúncio pode ser visto. A plataforma está de volta à normalidade.

Mas a lição permanece: **a maior parte dos bugs não é complexa, apenas bem escondida**.

---

> *"Todo bug é um professor disfarçado. Você só precisa estar disposto a aprender."* — Uma reflexão durante 3 horas de debugging
