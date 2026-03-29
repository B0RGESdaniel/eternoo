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
  base: "h-10 flex items-center justify-center text-blue-foreground text-sm font-medium rounded-md cursor-pointer font-medium",
  variants: {
    size: {
      letter: "w-8",
      enter: "w-24 border-primary! text-primary!",
      backspace: "w-10",
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
    <div className="flex flex-col items-center justify-center gap-1 mt-4">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row gap-1">
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
