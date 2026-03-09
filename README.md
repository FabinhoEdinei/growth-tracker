# 🧠 Neural Growth System

> **Um sistema visual impresso com interativo de rastreamento de crescimento neural.**

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

---

## 🚀 Sobre o Projeto

O **Neural Growth System** é uma experiência visual imersiva desenvolvida com **Next.js** e **Canvas API**. Ele simula um campo neural dinâmico onde partículas interagem em tempo real, reagindo a inputs do usuário e gerando efeitos visuais complexos, como relâmpagos e brilhos dinâmicos.

O foco do projeto é unir performance gráfica com uma estética futurista, criando uma interface que responde fluidamente em tempo atuais.

https://growth-tracker-lilac.vercel.app/

## ✨ Funcionalidades

-   **🌌 Soft Neural Field:** Renderização de partículas em tempo real usando HTML5 Canvas.
-   **⚡ Efeitos Dinâmicos:** Sistema de "Lightning Effect" que conecta partículas e gera brilhos no cabeçalho.
-   **📱 Responsivo e Otimizado:** Detecção automática de "Device Tier" (Baixo/Alto) para ajustar a performance (FPS) sem travar o navegador.
-   **🖱️ Interativo:** Clique nas partículas para revelar detalhes em modais flutuantes.
-   **🎨 UI Moderna:** Design escuro com neon, utilizando Tailwind CSS para estilização rápida e consistente.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
| :--- | :--- |
| **Next.js 13** | Framework React para produção com App Router. |
| **TypeScript** | Tipagem estática para garantir código robusto. |
| **Canvas API** | Para renderização de alta performance das partículas. |
| **Tailwind CSS** | Estilização utilitária para layout e animações. |
| **Vercel** | Hospedagem e CI/CD automático. |

## 📦 Instalação e Rodando Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

1.  **Clone o repositório:**
```bash
    git clone https://github.com/FabinhoEdinei/growth-tracker.git
    cd growth-tracker
```

2.  **Instale as dependências:**
```bash
    npm install
    # ou
    yarn install
```

3.  **Inicie o servidor de desenvolvimento:**
```bash
    npm run dev
```

4.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📂 Estrutura do Projeto

```text
app/
├── components/
│   ├── SoftNeuralField.tsx       # Componente principal (Canvas)
│   ├── particleManager.ts        # Lógica de física e movimento
│   ├── particleRenderer.ts       # Desenho no Canvas
│   ├── lightningEffect.ts        # Efeitos de relâmpago
│   ├── NeuralHeader.tsx          # Cabeçalho com brilho dinâmico
│   └── ParticleModal.tsx         # Modal de informações
├── page.tsx                      # Página principal
└── globals.css                   # Estilos globais
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1.  Faça um Fork do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`).
3.  Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`).
4.  Push para a branch (`git push origin feature/AmazingFeature`).
5.  Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Desenvolvido por <strong>FabinhoEdinei</strong> 💜</p>
  <a href="https://github.com/FabinhoEdinei">
    <img src="https://img.shields.io/badge/GitHub-Profile-black?logo=github" alt="GitHub Profile">
  </a>
</div>