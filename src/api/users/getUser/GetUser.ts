import axios from "../../axios";
import type { GetUserResponse } from "./GetUserResponse";

export async function getUser(userId: string): Promise<GetUserResponse> {
  const result = await axios.get<GetUserResponse>(`/users/${userId}`);
  return result.data;
}
