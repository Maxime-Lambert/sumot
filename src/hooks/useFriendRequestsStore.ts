import { create } from "zustand";
import {
  getFriendRequests,
  type FriendRequest,
} from "@/api/friendRequests/getFriendRequests/GetFriendRequests";
import { showToast } from "@/services/ToastService";

interface FriendRequestsState {
  receivedCount: number;
  acceptedFriends: FriendRequest[];
  pendingSent: FriendRequest[];
  pendingReceived: FriendRequest[];

  fetchFriendRequests: (userId: string, skipToast?: boolean) => Promise<void>;
}

export const useFriendRequestsStore = create<FriendRequestsState>(
  (set, get) => ({
    receivedCount: 0,
    acceptedFriends: [],
    pendingSent: [],
    pendingReceived: [],

    fetchFriendRequests: async (userId: string, skipToast = false) => {
      const { acceptedFriends } = get();
      if (!userId) return;

      const data = await getFriendRequests();

      const received = data.pending.filter((x) => x.direction === "Received");
      const sent = data.pending.filter((x) => x.direction === "Sent");

      const prevAcceptedIds = acceptedFriends.map((f) => f.id);
      const newAccepted = data.accepted.filter(
        (f) => !prevAcceptedIds.includes(f.id)
      );

      if (!skipToast && newAccepted.length > 0) {
        newAccepted.forEach((f) =>
          showToast(`${f.userName} est maintenant ton ami 🎉`, "success")
        );
      }

      set({
        receivedCount: received.length,
        pendingReceived: received,
        pendingSent: sent,
        acceptedFriends: data.accepted,
      });
    },
  })
);
