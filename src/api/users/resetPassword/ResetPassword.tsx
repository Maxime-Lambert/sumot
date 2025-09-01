import axios from "@/api/axios";

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export type ResetPasswordResponse = void;

export async function resetPassword(
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  await axios.post("/users/resetpassword", request);
}
