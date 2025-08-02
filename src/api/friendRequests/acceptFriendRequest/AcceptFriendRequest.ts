import axios from "../../axios";

export interface AcceptFriendRequestRequest {
  friendId: string;
}

export type AcceptFriendRequestResponse = void;

export async function acceptFriendRequest(
  request: AcceptFriendRequestRequest
): Promise<AcceptFriendRequestResponse> {
  await axios.post("/friendrequests/accept", request);
}
