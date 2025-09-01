import axios from "../../axios";
import type { GetUserResponse } from "./GetUserResponse";

export async function getUser(): Promise<GetUserResponse> {
  const result = await axios.get<GetUserResponse>(`/users`);
  return result.data;
}
