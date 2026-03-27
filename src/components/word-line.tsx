import { useRef, useState } from "react";
import { tv } from "tailwind-variants";

const input = tv({
  base: "w-10 h-12 rounded-md font-bold text-center text-2xl pointer-events-none focus:outline-none caret-transparent select-none",
  variants: {
    variant: {
      active:
        "border-2 border-muted-background focus:border-b-6 pointer-events-auto",
      disabled: "bg-secondary-background border-2 border-secondary-background",
      exists: "bg-exists border-2 border-exists",
      right: "bg-right border-2 border-right",
      wrong: "bg-wrong border-2 border-wrong",
    },
  },
});

export type LetterVariant =
  | "active"
  | "disabled"
  | "exists"
  | "right"
  | "wrong";

interface WordLineProps {
  word?: string;
  letterVariants?: LetterVariant[];
  disabled?: boolean;
}

export function WordLine({ word, letterVariants, disabled }: WordLineProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [letters, setLetters] = useState<string[]>(["", "", "", "", ""]);

  function handleLetterChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const value = e.target.value.toLocaleUpperCase();
    if (value.length === 1) {
      const newLetters = [...letters];
      newLetters[index] = value;
      setLetters(newLetters);
      inputRefs.current[index + 1]?.focus();
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      if (letters[index]) {
        const newLetters = [...letters];
        newLetters[index] = "";
        setLetters(newLetters);
      } else if (index > 0) {
        const newLetters = [...letters];
        newLetters[index - 1] = "";
        setLetters(newLetters);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-row gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const letterVariant = letterVariants?.[index];
        const isDisabled = disabled ? true : letterVariant !== "active";
        return (
          <input
            type="text"
            value={
              word
                ? (word[index].toLocaleUpperCase() ?? "")
                : (letters[index] ?? "")
            }
            className={input({
              variant: letterVariant ?? "disabled",
            })}
            key={index}
            maxLength={1}
            disabled={isDisabled}
            onChange={(e) => handleLetterChange(e, index)}
            tabIndex={-1}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            onFocus={(e) => e.target.setSelectionRange(0, 0)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        );
      })}
    </form>
  );
}
