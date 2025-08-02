import axios from "../../axios";
import type { LoginUserRequest } from "./LoginUserRequest";
import type { LoginUserResponse } from "./LoginUserResponse";

export async function loginUser(
  loginUserRequest: LoginUserRequest
): Promise<void> {
  const res = await axios.post<LoginUserResponse>("/users/login", {
    userName: loginUserRequest.username,
    password: loginUserRequest.password,
    ipAddress: loginUserRequest.ipAdress,
  });

  localStorage.setItem("access_token", res.data.token);
  localStorage.setItem("refresh_token", res.data.refreshToken);
}
