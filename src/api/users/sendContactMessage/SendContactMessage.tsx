import axios from "@/api/axios";

export interface SendContactMessageRequest {
  email: string;
  name: string;
  message: string;
  frontEndName: number;
}

export type SendContactMessageResponse = void;

export async function sendContactMessage(
  request: SendContactMessageRequest
): Promise<SendContactMessageResponse> {
  await axios.post("/users/sendmail", request);
}
