export interface PatchUserRequest {
  userName?: string;
  email?: string;
  lastPassword?: string;
  newPassword?: string;
  colorblindmode?: number;
  smartkeyboardtype?: number;
  keyboardlayout?: number;
  playsWithDifficultWords?: boolean;
}
