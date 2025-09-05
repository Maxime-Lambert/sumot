import type { AxiosResponse } from "axios";
import axios from "../../axios";
import type { LoginUserRequest } from "./LoginUserRequest";
import type { LoginUserResponse } from "./LoginUserResponse";

export async function loginUser(
  loginUserRequest: LoginUserRequest
): Promise<AxiosResponse> {
  const response = await axios.post<LoginUserResponse>("/users/login", {
    userName: loginUserRequest.userName,
    password: loginUserRequest.password,
    ipAddress: loginUserRequest.ipAdress,
  });
  localStorage.setItem("access_token", response.data.token);
  return response;
}
