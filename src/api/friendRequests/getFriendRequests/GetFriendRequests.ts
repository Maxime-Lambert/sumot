import axios from "../../axios";

export type FriendRequestDirection = "Sent" | "Received";

export interface FriendRequest {
  id: number;
  direction: FriendRequestDirection;
  userId: string;
  userName: string;
  email: string;
}

export interface GetFriendRequestsResponse {
  accepted: FriendRequest[];
  pending: FriendRequest[];
}

export async function getFriendRequests(): Promise<GetFriendRequestsResponse> {
  const response = await axios.get<GetFriendRequestsResponse>(
    "/friendrequests"
  );
  return response.data;
}
