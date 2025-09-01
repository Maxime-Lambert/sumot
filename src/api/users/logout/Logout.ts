import axios from "../../axios";

export async function logoutUser(): Promise<void> {
  await axios.post("/users/logout");
  localStorage.removeItem("access_token");
}
