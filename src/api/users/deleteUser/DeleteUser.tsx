import axios from "@/api/axios";

export interface DeleteUserRequest {
  password: string;
}

export type DeleteUserResponse = void;

export async function deleteUser(
  request: DeleteUserRequest
): Promise<DeleteUserResponse> {
  await axios.delete("/users", { data: request });
}
