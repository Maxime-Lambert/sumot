import type { AxiosResponse } from "axios";
import axios from "../../axios";
import type { CreateUserRequest } from "./CreateUserRequest";

export async function createUser(
  request: CreateUserRequest
): Promise<AxiosResponse> {
  return await axios.post(`/users`, request);
}
