export const AttemptedWordState = {
  Active: "active",
  Disabled: "disabled",
  Submitted: "submitted",
} as const;

export type AttemptedWordState =
  (typeof AttemptedWordState)[keyof typeof AttemptedWordState];
