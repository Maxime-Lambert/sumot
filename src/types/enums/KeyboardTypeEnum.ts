export const KeyboardType = {
  NONE: "Basique",
  SIMPLE: "Lettres manquantes indiquées",
  CORRECTION: "Lettres manquantes + correctes indiquées",
} as const;

export type KeyboardTypeEnum = (typeof KeyboardType)[keyof typeof KeyboardType];
