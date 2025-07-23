export const ColorBlindMode = {
  NONE: "Désactivé",
  ACTIVE: "Activé",
} as const;

export type ColorBlindModeEnum =
  (typeof ColorBlindMode)[keyof typeof ColorBlindMode];
