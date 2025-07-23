export const KeyboardLayouts = {
  AZERTY: "AZERTY",
  QWERTY: "QWERTY",
  QWERTZ: "QWERTZ",
} as const;

export type KeyboardLayoutsEnum =
  (typeof KeyboardLayouts)[keyof typeof KeyboardLayouts];
