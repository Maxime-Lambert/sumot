import axios from "../../axios";
import type { PatchUserRequest } from "./PatchUserRequest";

export async function patchUser(
  patchUserRequest: PatchUserRequest
): Promise<void> {
  await axios.patch(`/users`, {
    UserName: patchUserRequest.username,
    Email: patchUserRequest.email,
    Password: patchUserRequest.password,
    ColorblindMode: patchUserRequest.colorblindmode,
    SmartKeyboardType: patchUserRequest.smartkeyboardtype,
    KeyboardLayout: patchUserRequest.keyboardlayout,
    PlaysWithDifficultWords: patchUserRequest.playsWithDifficultWords,
    FrontEndName: 0,
  });
}
