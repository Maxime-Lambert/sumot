import axios from "../../axios";

export interface RemoveFriendRequest {
  targetUserId: string;
}

export type RemoveFriendResponse = void;

export async function removeFriend(
  request: RemoveFriendRequest
): Promise<RemoveFriendResponse> {
  await axios.post("/friendrequests/removefriend", request);
}
