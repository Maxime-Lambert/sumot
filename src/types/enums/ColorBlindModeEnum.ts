export const ColorBlindModes = {
  None: "None",
  Active: "Active",
} as const;

export type ColorBlindModeEnum =
  (typeof ColorBlindModes)[keyof typeof ColorBlindModes];

export const ColorBlindModeLabels: Record<ColorBlindModeEnum, string> = {
  [ColorBlindModes.None]: "Désactivé",
  [ColorBlindModes.Active]: "Activé",
};

export const ColorBlindModeApiMap: Record<ColorBlindModeEnum, number> = {
  [ColorBlindModes.None]: 0,
  [ColorBlindModes.Active]: 1,
};
