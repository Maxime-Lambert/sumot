import axios from "@/api/axios";

export interface ResendConfirmationRequest {
  email: string;
  frontEndName: number;
}

export type ResendConfirmationResponse = void;

export async function resendConfirmation(
  request: ResendConfirmationRequest
): Promise<ResendConfirmationResponse> {
  await axios.post("/users/resendConfirmation", request);
}
