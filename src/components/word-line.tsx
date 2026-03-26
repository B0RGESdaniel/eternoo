import { tv } from "tailwind-variants";

const input = tv({
  base: "w-10 h-12 rounded-md font-bold text-center text-2xl pointer-events-none focus:outline-none caret-transparent",
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
  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const isDisabled = letterVariants?.[index] === "disabled";
        const letterVariant = letterVariants?.[index];
        return (
          <input
            type="text"
            value={word?.charAt(index).toLocaleUpperCase() ?? ""}
            className={input({
              variant: letterVariant ?? "disabled",
            })}
            key={index}
            maxLength={1}
            disabled={isDisabled}
          />
        );
      })}
    </div>
  );
}
