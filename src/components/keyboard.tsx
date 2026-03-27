import { tv } from "tailwind-variants";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "⌫"],
  ["Z", "X", "C", "V", "B", "N", "M", "ENTER"],
];

const button = tv({
  base: "h-10 flex items-center justify-center text-blue-foreground text-sm font-medium rounded-md cursor-pointer",
  variants: {
    size: {
      letter: "w-8",
      enter: "w-24",
      backspace: "w-10",
    },
    hit: {
      notUsed: "bg-secondary-background border border-blue-foreground",
      exists: "bg-exists border border-exists",
      wrong: "bg-wrong border border-wrong",
      right: "bg-right border border-right",
    },
  },
  defaultVariants: {
    size: "letter",
    hit: "notUsed",
  },
});

interface KeyboardProps {
  onKey?: (key: string) => void;
  letterHits: string[];
}

export function Keyboard({ onKey }: KeyboardProps) {
  function handleSize(key: string) {
    if (key === "ENTER") return "enter";
    if (key === "⌫") return "backspace";
    return "letter";
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row gap-1">
          {row.map((key) => (
            <button
              key={key}
              // onClick={() => onKey(key)}
              className={button({ size: handleSize(key), hit: "notUsed" })}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
