import { LetterVariant } from "../types/letter-variant";

export function getHitmap(streak: number, attempts: LetterVariant[][]) {
  const emojiArray = attempts.map((attempt) => {
    return attempt.map((letter) => {
      if (letter === "exists") return "🟨";
      if (letter === "right") return "🟩";
      if (letter === "wrong") return "⬛️";
    });
  });

  const emojiString = emojiArray.map((attempt) => attempt.join("")).join("\n");

  return `
  Eternoo 🔥${streak}\n
  ${attempts.length}/6 tentativas\n
  \n${emojiString}
  `;
}
