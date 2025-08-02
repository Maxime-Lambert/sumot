export const SmartKeyboardType = {
  NONE: "Basique",
  SIMPLE: "Lettres manquantes indiquées",
  CORRECTION: "Lettres manquantes + correctes indiquées",
} as const;

export type SmartKeyboardTypeEnum =
  (typeof SmartKeyboardType)[keyof typeof SmartKeyboardType];
