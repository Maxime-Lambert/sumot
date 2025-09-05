import axios from "../../axios";

export interface SendFriendRequestRequest {
  targetUserName: string;
}

export type SendFriendRequestResponse = void;

export async function sendFriendRequest(
  request: SendFriendRequestRequest
): Promise<SendFriendRequestResponse> {
  await axios.post("/friendrequests", request);
}
