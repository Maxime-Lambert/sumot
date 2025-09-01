export const SmartKeyboardType = {
  None: "None",
  Simple: "Simple",
  Correct: "Correct",
} as const;

export type SmartKeyboardTypeEnum =
  (typeof SmartKeyboardType)[keyof typeof SmartKeyboardType];

export const SmartKeyboardTypeLabels: Record<SmartKeyboardTypeEnum, string> = {
  [SmartKeyboardType.None]: "Aucune indication",
  [SmartKeyboardType.Simple]: "Seuls les lettres absentes indiquées",
  [SmartKeyboardType.Correct]:
    "Lettres absentes et bien placées (par colonne) indiquées",
};

export const SmartKeyboardTypeApiMap: Record<SmartKeyboardTypeEnum, number> = {
  [SmartKeyboardType.None]: 0,
  [SmartKeyboardType.Simple]: 1,
  [SmartKeyboardType.Correct]: 2,
};
