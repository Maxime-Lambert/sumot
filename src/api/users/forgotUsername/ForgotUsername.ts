import axios from "@/api/axios";

export interface ForgotUsernameRequest {
  email: string;
  frontEndName: number;
}

export type ForgotUsernameResponse = void;

export async function forgotUsername(
  request: ForgotUsernameRequest
): Promise<ForgotUsernameResponse> {
  await axios.post("/users/forgotusername", request);
}
