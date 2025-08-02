import Sumot from "./components/game/Sumot";
import { type KeyboardLayoutsEnum } from "./types/enums/KeyboardLayoutsEnum";
import { type ColorBlindModeEnum } from "./types/enums/ColorBlindModeEnum";
import { type SmartKeyboardTypeEnum } from "./types/enums/KeyboardTypeEnum";

interface Props {
  layoutType: KeyboardLayoutsEnum;
  colorblindMode: ColorBlindModeEnum;
  keyboardType: SmartKeyboardTypeEnum;
}

export default function App({
  layoutType,
  colorblindMode,
  keyboardType,
}: Props) {
  return (
    <Sumot
      colorblindMode={colorblindMode}
      layoutType={layoutType}
      keyboardType={keyboardType}
    />
  );
}
