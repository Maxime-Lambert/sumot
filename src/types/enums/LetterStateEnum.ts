export const LetterStates = {
  NONE: "none",
  CORRECT: "correct",
  PRESENT: "present",
  MISSING: "missing",
} as const;

export type LetterStateEnum = (typeof LetterStates)[keyof typeof LetterStates];
