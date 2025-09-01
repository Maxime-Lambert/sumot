import axios from "@/api/axios";

export interface ForgotUsernamedRequest {
  email: string;
  frontEndName: number;
}

export type ForgotUsernameResponse = void;

export async function forgotUsername(
  request: ForgotUsernamedRequest
): Promise<ForgotUsernameResponse> {
  await axios.post("/users/forgotusername", request);
}
