export interface PatchUserRequest {
  username?: string;
  email?: string;
  lastpassword?: string;
  password?: string;
  colorblindmode?: number;
  smartkeyboardtype?: number;
  keyboardlayout?: number;
  playsWithDifficultWords?: boolean;
}
