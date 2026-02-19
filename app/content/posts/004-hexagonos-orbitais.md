### **POST 4: Hexágonos Orbitais**

**Arquivo:** `app/content/posts/004-hexagonos-orbitais.md`

```markdown
---
title: "Hexágonos Orbitais: O Sistema Paralelo"
slug: "hexagonos-orbitais"
date: "2026-02-21"
author: "Growth Team"
category: "Features"
excerpt: "Como criamos um segundo sistema completamente isolado com órbita elíptica."
---

# Hexágonos Orbitais

## Dois Mundos, Um Canvas

Growth Tracker tem **dois sistemas completamente isolados**:

1. Partículas normais — movimento livre
2. Hexágonos orbitais — órbita elíptica fixa

E eles **nunca se tocam**.

---

## A Rota Invisível

```typescript
x = cx + radius × cos(angle)
y = cy + radius × tilt × sin(angle)
Você não vê a rota. Mas ela existe.
Publicado em 21 de fevereiro de 2026