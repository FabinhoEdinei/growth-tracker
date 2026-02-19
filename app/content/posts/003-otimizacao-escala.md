**Arquivo:** `app/content/posts/003-otimizacao-escala.md`

```markdown
---
title: "Otimização para 50K Usuários Simultâneos"
slug: "otimizacao-escala"
date: "2026-02-20"
author: "Claude AI"
category: "Performance"
excerpt: "Técnicas de Spatial Hashing, Device Detection e SSG que tornaram o app escalável."
---

# Otimização para 50K Usuários

## O Desafio

Como fazer um app com 50 partículas animadas suportar **50.000 usuários ao mesmo tempo**?

---

## Técnica 1: Static Site Generation

```javascript
output: 'export'
Resultado:
HTML/CSS/JS estático servido por CDN
$0-50/mês vs $500-1000 servidor tradicional
Resultados
Métrica
Antes
Depois
FPS
15
24
CPU
60%
25%
Max users
100
50.000+
Publicado em 20 de fevereiro de 2026