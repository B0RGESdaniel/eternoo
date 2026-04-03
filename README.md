# Eternoo

Eternoo é um jogo no estilo Wordle em português — com uma diferença: você pode jogar quantas vezes quiser, sem esperar o dia seguinte.

## Como jogar

O objetivo é descobrir a palavra secreta de **5 letras** em até **6 tentativas**.

A cada tentativa, as letras recebem cores indicando o quão perto você chegou:

| Cor | Significado |
|-----|-------------|
| Verde | A letra está na posição correta |
| Amarelo | A letra existe na palavra, mas está na posição errada |
| Cinza | A letra não existe na palavra |

Use as dicas das tentativas anteriores para chegar à palavra correta.

## Funcionalidades

- **Jogue à vontade** — sem limite diário, uma nova palavra a qualquer momento
- **Sequência de vitórias** — seu streak é salvo entre sessões
- **Teclado virtual** — as teclas ficam coloridas conforme suas tentativas
- **Teclado físico** — suporte completo ao teclado do computador, incluindo setas para navegar entre as letras
- **Compartilhar resultado** — copie o grid de emojis com o resultado da sua partida
- **Desafiar alguém** — gere um link com a palavra atual para outra pessoa resolver

## Tecnologias

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Build de produção

```bash
npm run build
npm run preview
```
