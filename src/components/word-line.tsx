import { tv, cn } from "tailwind-variants";
import { AttemptedWordState } from "../types/attempted-word-state";

const cell = tv({
  base: "w-15 lg:w-16 h-16 lg:h-17 rounded-md font-bold text-center text-2xl lg:text-4xl select-none flex items-center justify-center",
  variants: {
    variant: {
      active: "border-2 border-muted-background",
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
  currentFocusIndex: number;
  setCurrentFocusIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function WordLine({
  word,
  letterVariants,
  state,
  wordArrayValue,
  currentFocusIndex,
  setCurrentFocusIndex,
}: WordLineProps) {
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
        return (
          <div
            key={index}
            onClick={() => setCurrentFocusIndex(index)}
            className={cn(
              cell({ variant: handleWordState(letterVariant) }),
              state === AttemptedWordState.Active &&
                index === currentFocusIndex &&
                "border-b-8",
            )}
          >
            {handleValue(index)}
          </div>
        );
      })}
    </div>
  );
}
