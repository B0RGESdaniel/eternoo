import { useEffect, useRef } from "react";
import { tv } from "tailwind-variants";
import { AttemptedWordState } from "../types/attempted-word-state";

const input = tv({
  base: "w-15 lg:w-18 h-16 lg:h-19 rounded-md font-bold text-center text-3xl lg:text-4xl pointer-events-none focus:outline-none caret-transparent select-none",
  variants: {
    variant: {
      active:
        "border-2 border-muted-background focus:border-b-10 pointer-events-auto",
      disabled: "bg-secondary-background border-2 border-secondary-background",
      exists: "bg-exists border-2 border-exists",
      right: "bg-right border-2 border-right",
      wrong: "bg-wrong border-2 border-wrong text-blue-foreground",
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
  state: AttemptedWordState;
  wordArrayValue: string[];
  setWordArrayValue: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit?: () => void;
}

export function WordLine({
  word,
  letterVariants,
  state,
  wordArrayValue,
  setWordArrayValue,
  onSubmit,
}: WordLineProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (state === AttemptedWordState.Active) {
      inputRefs.current[0]?.focus();
    }
  }, [state]);

  function handleLetterChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const value = e.target.value.toLocaleUpperCase();
    if (value.length === 1) {
      const newLetters = [...wordArrayValue];
      newLetters[index] = value;
      setWordArrayValue(newLetters);
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
    if (e.key === "Enter") {
      onSubmit?.();
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      if (wordArrayValue[index]) {
        const newLetters = [...wordArrayValue];
        newLetters[index] = "";
        setWordArrayValue(newLetters);
      } else if (index > 0) {
        const newLetters = [...wordArrayValue];
        newLetters[index - 1] = "";
        setWordArrayValue(newLetters);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  function handleValue(index: number): string {
    if (state === AttemptedWordState.Active) {
      return wordArrayValue[index] ?? "";
    }
    if (word) {
      return word.split("")[index];
    }
    return "";
  }

  function handleWordState(letterVariant: LetterVariant | undefined) {
    if (state === AttemptedWordState.Submitted) {
      return letterVariant;
    }
    return state;
  }

  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const letterVariant = letterVariants?.[index];
        const isDisabled = state !== AttemptedWordState.Active;
        return (
          <input
            type="text"
            value={handleValue(index)}
            className={input({
              variant: handleWordState(letterVariant),
            })}
            key={index}
            maxLength={1}
            disabled={isDisabled}
            autoFocus={index === 0 && state === AttemptedWordState.Active}
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
    </div>
  );
}
