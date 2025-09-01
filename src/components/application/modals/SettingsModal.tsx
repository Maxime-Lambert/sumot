import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectValue } from "@/components/ui/select";
import ThemedSelectContent from "@/components/ui/themed/content";
import ThemedSelectItem from "@/components/ui/themed/item";
import ThemedSelectTrigger from "@/components/ui/themed/trigger";

import {
  ColorBlindModes,
  type ColorBlindModeEnum,
  ColorBlindModeApiMap,
  ColorBlindModeLabels,
} from "@/types/enums/ColorBlindModeEnum";
import {
  KeyboardLayouts,
  type KeyboardLayoutsEnum,
  KeyboardLayoutsApiMap,
  KeyboardLayoutsLabels,
} from "@/types/enums/KeyboardLayoutsEnum";
import {
  SmartKeyboardType,
  type SmartKeyboardTypeEnum,
  SmartKeyboardTypeApiMap,
  SmartKeyboardTypeLabels,
} from "@/types/enums/KeyboardTypeEnum";

import { useSettingsStore } from "@/hooks/useSettingStore";
import { patchUser } from "@/api/users/patchUser/PatchUser";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    colorblindMode,
    keyboardLayout,
    keyboardType,
    playsWithDifficultWords,
    userId,
    setColorblindMode,
    setKeyboardLayout,
    setKeyboardType,
    setPlaysWithDifficultWords,
  } = useSettingsStore();

  async function updateSetting<T extends string>(
    storeSetter: (v: T) => void,
    apiField: keyof Parameters<typeof patchUser>[0],
    value: T,
    map: Record<T, number>
  ) {
    storeSetter(value);
    if (!userId) return;
    await patchUser({ [apiField]: map[value] }, userId);
  }

  async function updateDifficulty(value: boolean) {
    setPlaysWithDifficultWords(value);
    if (!userId) return;
    await patchUser({ playsWithDifficultWords: value }, userId);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-primary-container text-primary-container-foreground border border-primary-container-border">
        <DialogHeader>
          <DialogTitle className="text-center">Paramètres</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex flex-col gap-1">
            <Label>Mode daltonien</Label>
            <Select
              value={colorblindMode}
              onValueChange={(v) =>
                updateSetting(
                  setColorblindMode,
                  "colorblindmode",
                  v as ColorBlindModeEnum,
                  ColorBlindModeApiMap
                )
              }
            >
              <ThemedSelectTrigger>
                <SelectValue />
              </ThemedSelectTrigger>
              <ThemedSelectContent>
                {Object.values(ColorBlindModes).map((mode) => (
                  <ThemedSelectItem key={mode} value={mode}>
                    {ColorBlindModeLabels[mode]}
                  </ThemedSelectItem>
                ))}
              </ThemedSelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Disposition du clavier</Label>
            <Select
              value={keyboardLayout}
              onValueChange={(v) =>
                updateSetting(
                  setKeyboardLayout,
                  "keyboardlayout",
                  v as KeyboardLayoutsEnum,
                  KeyboardLayoutsApiMap
                )
              }
            >
              <ThemedSelectTrigger>
                <SelectValue />
              </ThemedSelectTrigger>
              <ThemedSelectContent>
                {Object.values(KeyboardLayouts).map((layout) => (
                  <ThemedSelectItem key={layout} value={layout}>
                    {KeyboardLayoutsLabels[layout]}
                  </ThemedSelectItem>
                ))}
              </ThemedSelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Indications du clavier pour le mot en cours</Label>
            <Select
              value={keyboardType}
              onValueChange={(v) =>
                updateSetting(
                  setKeyboardType,
                  "smartkeyboardtype",
                  v as SmartKeyboardTypeEnum,
                  SmartKeyboardTypeApiMap
                )
              }
            >
              <ThemedSelectTrigger>
                <SelectValue />
              </ThemedSelectTrigger>
              <ThemedSelectContent>
                {Object.values(SmartKeyboardType).map((type) => (
                  <ThemedSelectItem key={type} value={type}>
                    {SmartKeyboardTypeLabels[type]}
                  </ThemedSelectItem>
                ))}
              </ThemedSelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Difficulté des mots en mode infini</Label>
            <Select
              value={String(playsWithDifficultWords)}
              onValueChange={(v) => updateDifficulty(v === "true")}
            >
              <ThemedSelectTrigger>
                <SelectValue />
              </ThemedSelectTrigger>
              <ThemedSelectContent>
                <ThemedSelectItem value="true">
                  Standard + Difficiles (conjugaisons, mots rares...)
                </ThemedSelectItem>
                <ThemedSelectItem value="false">Standard</ThemedSelectItem>
              </ThemedSelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
