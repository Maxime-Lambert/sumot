import {
  ColorBlindMode,
  type ColorBlindModeEnum,
} from "../../../types/enums/ColorBlindModeEnum";
import {
  KeyboardLayouts,
  type KeyboardLayoutsEnum,
} from "../../../types/enums/KeyboardLayoutsEnum";
import {
  KeyboardType,
  type KeyboardTypeEnum,
} from "../../../types/enums/KeyboardTypeEnum";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  layoutType: KeyboardLayoutsEnum;
  onLayoutChange: (layout: KeyboardLayoutsEnum) => void;
  colorblindMode: ColorBlindModeEnum;
  onColorBlindChange: (mode: ColorBlindModeEnum) => void;
  keyboardType: KeyboardTypeEnum;
  onKeyboardTypeChange: (mode: KeyboardTypeEnum) => void;
};

export default function SettingsModal(props: SettingsModalProps) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-surface border border-accent rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={props.onClose}
          className="absolute top-3 right-3 text-white text-sm border border-accent px-2 py-1 rounded hover:bg-white/10 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Paramètres</h2>

        <div className="mb-4">
          <label className="block text-white mb-1">
            Disposition du clavier
          </label>
          <select
            value={props.layoutType}
            onChange={(e) =>
              props.onLayoutChange(e.target.value as KeyboardLayoutsEnum)
            }
            className="w-full p-2 rounded bg-surface border border-accent text-white"
          >
            {Object.keys(KeyboardLayouts).map((key) => (
              <option
                key={key}
                value={KeyboardLayouts[key as keyof typeof KeyboardLayouts]}
              >
                {KeyboardLayouts[key as keyof typeof KeyboardLayouts]}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1">Mode daltonien</label>
          <select
            value={props.colorblindMode}
            onChange={(e) =>
              props.onColorBlindChange(e.target.value as ColorBlindModeEnum)
            }
            className="w-full p-2 rounded bg-surface border border-accent text-white"
          >
            {Object.keys(ColorBlindMode).map((key) => (
              <option
                key={key}
                value={ColorBlindMode[key as keyof typeof ColorBlindMode]}
              >
                {ColorBlindMode[key as keyof typeof ColorBlindMode]}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1">Type de clavier</label>
          <select
            value={props.keyboardType}
            onChange={(e) =>
              props.onKeyboardTypeChange(e.target.value as KeyboardTypeEnum)
            }
            className="w-full p-2 rounded bg-surface border border-accent text-white"
          >
            {Object.keys(KeyboardType).map((key) => (
              <option
                key={key}
                value={KeyboardType[key as keyof typeof KeyboardType]}
              >
                {KeyboardType[key as keyof typeof KeyboardType]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
