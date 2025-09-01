import axios from "../../axios";

export interface AcceptFriendRequestRequest {
  targetUserId: string;
}

export type AcceptFriendRequestResponse = void;

export async function acceptFriendRequest(
  request: AcceptFriendRequestRequest
): Promise<AcceptFriendRequestResponse> {
  await axios.post("/friendrequests/accept", request);
}
