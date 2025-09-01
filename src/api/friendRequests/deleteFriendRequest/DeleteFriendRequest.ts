import axios from "../../axios";

export interface DeleteFriendRequestRequest {
  targetId: string;
}

export type DeleteFriendRequestResponse = void;

export async function deleteFriendRequest(
  request: DeleteFriendRequestRequest
): Promise<DeleteFriendRequestResponse> {
  await axios.delete(`/friendrequests/${request.targetId}`);
}
