import { tv } from "tailwind-variants";
import { LETTERS } from "../utils/alphabet";

type KeyHit = "notUsed" | "wrong" | "exists" | "right";
type LetterKey = { letter: string; hit: KeyHit };

const KEYS: LetterKey[] = LETTERS.map((l) => ({ letter: l, hit: "notUsed" }));

const ROWS: LetterKey[][] = [
  KEYS.slice(0, 10),
  [...KEYS.slice(10, 19), { letter: "⌫", hit: "notUsed" }],
  [...KEYS.slice(19), { letter: "ENTER", hit: "notUsed" }],
];

const button = tv({
  base: "h-16 flex items-center justify-center text-blue-foreground font-medium text-base lg:text-xl rounded-md cursor-pointer",
  variants: {
    size: {
      letter: "w-8.5 lg:w-14",
      enter: "w-22 lg:w-36 border-primary! text-primary! font-semibold",
      backspace: "w-10 lg:w-14 text-xl font-bold",
    },
    hit: {
      notUsed: "bg-secondary-background border border-blue-foreground",
      exists: "bg-exists border border-exists text-neutral",
      wrong: "bg-wrong border border-wrong",
      right: "bg-right border border-right text-neutral",
    },
  },
  defaultVariants: {
    size: "letter",
    hit: "notUsed",
  },
});

interface KeyboardProps {
  onKey: (key: string) => void;
  keyHits?: Record<string, KeyHit>;
}

export function Keyboard({ onKey, keyHits = {} }: KeyboardProps) {
  function handleSize(key: string) {
    if (key === "ENTER") return "enter";
    if (key === "⌫") return "backspace";
    return "letter";
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 gap-1">
      {ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center justify-center flex-row gap-1"
        >
          {row.map((key) => (
            <button
              key={key.letter}
              onClick={() => onKey(key.letter ?? "")}
              className={button({
                size: handleSize(key.letter),
                hit: keyHits[key.letter] ?? key.hit,
              })}
            >
              {key.letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
