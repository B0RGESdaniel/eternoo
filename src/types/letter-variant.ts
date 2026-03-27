export const LetterVariant = {
  Exists: "exists",
  Right: "right",
  Wrong: "wrong",
  Active: "active",
  Disabled: "disabled",
} as const;

export type LetterVariant = (typeof LetterVariant)[keyof typeof LetterVariant];
