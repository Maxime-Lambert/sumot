import axios from "../../axios";

export interface DeleteFriendRequestRequest {
  friendId: string;
}

export type DeleteFriendRequestResponse = void;

export async function deleteFriendRequest(
  request: DeleteFriendRequestRequest
): Promise<DeleteFriendRequestResponse> {
  await axios.delete("/friendrequests/remove", { data: request });
}
