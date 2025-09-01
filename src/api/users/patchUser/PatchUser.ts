import axios from "../../axios";
import type { PatchUserRequest } from "./PatchUserRequest";

export async function patchUser(
  patchUserRequest: PatchUserRequest,
  userId: string
): Promise<void> {
  await axios.patch(`/users/${userId}`, {
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
