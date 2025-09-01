import axios from "@/api/axios";

export interface ConfirmEmailRequest {
  token: string;
}

export type ConfirmEmailResponse = void;

export async function confirmEmail({
  token,
}: ConfirmEmailRequest): Promise<ConfirmEmailResponse> {
  await axios.post("/users/confirmemail", { token });
}
