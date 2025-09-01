import type { ColorBlindModeEnum } from "@/types/enums/ColorBlindModeEnum";
import type { KeyboardLayoutsEnum } from "@/types/enums/KeyboardLayoutsEnum";
import type { SmartKeyboardTypeEnum } from "@/types/enums/KeyboardTypeEnum";

export interface GetUserResponse {
  userName: string;
  email: string;
  emailConfirmed: boolean;
  colorblindMode: ColorBlindModeEnum;
  smartKeyboardType: SmartKeyboardTypeEnum;
  keyboardLayout: KeyboardLayoutsEnum;
}
