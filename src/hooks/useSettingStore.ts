import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ColorBlindModes,
  type ColorBlindModeEnum,
} from "@/types/enums/ColorBlindModeEnum";
import {
  KeyboardLayouts,
  type KeyboardLayoutsEnum,
} from "@/types/enums/KeyboardLayoutsEnum";
import {
  SmartKeyboardType,
  type SmartKeyboardTypeEnum,
} from "@/types/enums/KeyboardTypeEnum";

interface SettingsState {
  colorblindMode: ColorBlindModeEnum;
  keyboardLayout: KeyboardLayoutsEnum;
  keyboardType: SmartKeyboardTypeEnum;
  playsWithDifficultWords: boolean;
  userId: string;

  setColorblindMode: (mode: ColorBlindModeEnum) => void;
  setKeyboardLayout: (layout: KeyboardLayoutsEnum) => void;
  setKeyboardType: (type: SmartKeyboardTypeEnum) => void;
  setPlaysWithDifficultWords: (type: boolean) => void;
  setUserId: (userId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      colorblindMode: ColorBlindModes.None,
      keyboardLayout: KeyboardLayouts.AZERTY,
      keyboardType: SmartKeyboardType.Correct,
      playsWithDifficultWords: false,
      userId: "",

      setColorblindMode: (mode) => set({ colorblindMode: mode }),
      setKeyboardLayout: (layout) => set({ keyboardLayout: layout }),
      setKeyboardType: (type) => set({ keyboardType: type }),
      setUserId: (userId) => set({ userId }),
      setPlaysWithDifficultWords: (playsWithDifficultWords) =>
        set({ playsWithDifficultWords }),
    }),
    {
      name: "app-settings",
      partialize: (state) => ({
        colorblindMode: state.colorblindMode,
        keyboardLayout: state.keyboardLayout,
        keyboardType: state.keyboardType,
        playsWithDifficultWords: state.playsWithDifficultWords,
        userId: state.userId,
      }),
    }
  )
);
