import axios from "@/api/axios";

export interface ForgotPasswordRequest {
  email: string;
  frontEndName: number;
}

export type ForgotPasswordResponse = void;

export async function forgotPassword(
  request: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  await axios.post("/users/forgotpassword", request);
}
