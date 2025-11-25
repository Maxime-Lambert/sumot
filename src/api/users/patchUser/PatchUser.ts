import axios from "../../axios";
import type { PatchUserRequest } from "./PatchUserRequest";

export async function patchUser(
  patchUserRequest: PatchUserRequest
): Promise<void> {
  await axios.patch(`/users`, {
    UserName: patchUserRequest.userName,
    Email: patchUserRequest.email,
    LastPassword: patchUserRequest.lastPassword,
    NewPassword: patchUserRequest.newPassword,
    ColorblindMode: patchUserRequest.colorblindmode,
    SmartKeyboardType: patchUserRequest.smartkeyboardtype,
    KeyboardLayout: patchUserRequest.keyboardlayout,
    PlaysWithDifficultWords: patchUserRequest.playsWithDifficultWords,
    FrontEndName: 0,
  });
}
