export const KeyboardLayouts = {
  AZERTY: "AZERTY",
  QWERTY: "QWERTY",
  QWERTZ: "QWERTZ",
  Hidden: "Hidden",
} as const;

export type KeyboardLayoutsEnum =
  (typeof KeyboardLayouts)[keyof typeof KeyboardLayouts];

export const KeyboardLayoutsLabels: Record<KeyboardLayoutsEnum, string> = {
  [KeyboardLayouts.AZERTY]: "AZERTY",
  [KeyboardLayouts.QWERTY]: "QWERTY",
  [KeyboardLayouts.QWERTZ]: "QWERTZ",
  [KeyboardLayouts.Hidden]: "Masqué (version web uniquement)",
};

export const KeyboardLayoutsApiMap: Record<KeyboardLayoutsEnum, number> = {
  [KeyboardLayouts.AZERTY]: 0,
  [KeyboardLayouts.QWERTY]: 1,
  [KeyboardLayouts.QWERTZ]: 2,
  [KeyboardLayouts.Hidden]: 3,
};
