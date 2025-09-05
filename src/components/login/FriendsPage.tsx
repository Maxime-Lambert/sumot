import { useState } from "react";
import { Plus } from "lucide-react";
import ThemedInput from "../ui/themed/input";
import FriendTabs from "./FriendTabs";
import FriendCardGrid from "./FriendCardGrid";
import { showToast } from "@/services/ToastService";
import { sendFriendRequest } from "@/api/friendRequests/sendFriendRequest/SendFriendRequest";
import { acceptFriendRequest } from "@/api/friendRequests/acceptFriendRequest/AcceptFriendRequest";
import { deleteFriendRequest } from "@/api/friendRequests/deleteFriendRequest/DeleteFriendRequest";
import { removeFriend } from "@/api/friendRequests/RemoveFriend/RemoveFriend";
import { useFriendRequestsStore } from "@/hooks/useFriendRequestsStore";
import { useSettingsStore } from "@/hooks/useSettingStore";

export default function FriendsPage() {
  const { acceptedFriends, pendingSent, pendingReceived, fetchFriendRequests } =
    useFriendRequestsStore();
  const { userId } = useSettingsStore();
  const [targetUserName, setTargetUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "sent" | "received">(
    "friends"
  );

  const tabs = [
    { key: "friends", label: "Amis", count: acceptedFriends.length },
    { key: "sent", label: "Demandes envoyées", count: pendingSent.length },
    {
      key: "received",
      label: "Demandes reçues",
      count: pendingReceived.length,
    },
  ];

  async function handleSendRequest() {
    if (!targetUserName.trim()) return;
    setLoading(true);
    try {
      await sendFriendRequest({ targetUserName: targetUserName.trim() });
      showToast("Demande envoyée !", "success");
      setTargetUserName("");
      await fetchFriendRequests(userId, true);
    } catch {
      showToast("Échec de l’envoi de la demande.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(f: { userId: string }) {
    setLoading(true);
    try {
      await removeFriend({ targetUserId: f.userId });
      showToast("Ami supprimé.", "success");
      await fetchFriendRequests(userId, true);
    } catch {
      showToast("Échec lors de la suppression.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelRequest(f: { userId: string }) {
    setLoading(true);
    try {
      await deleteFriendRequest({ targetId: f.userId });
      showToast("Demande annulée.", "success");
      await fetchFriendRequests(userId, true);
    } catch {
      showToast("Échec lors de l'annulation.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRejectRequest(f: { userId: string }) {
    setLoading(true);
    try {
      await deleteFriendRequest({ targetId: f.userId });
      showToast("Demande refusée.", "success");
      await fetchFriendRequests(userId, true);
    } catch {
      showToast("Échec lors de l'annulation.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptRequest(f: { userId: string }) {
    setLoading(true);
    try {
      await acceptFriendRequest({ targetUserId: f.userId });
      showToast("Demande acceptée.", "success");
      await fetchFriendRequests(userId, true);
    } catch {
      showToast("Échec lors de l'acceptation.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-full sm:max-w-3xl lg:max-w-3xl mx-auto my-6 p-4 sm:p-6 bg-primary-container border border-primary-container-border rounded-xl shadow text-foreground">
      <h1 className="text-2xl font-bold mb-6 text-center">Gestion des amis</h1>

      <div className="mb-6 flex justify-center">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <ThemedInput
            type="text"
            placeholder="JohnDoe38"
            label="Nom d’utilisateur"
            value={targetUserName}
            onChange={(e) => setTargetUserName(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="btn btn-primary flex items-center justify-center"
          >
            <Plus size={18} />
            <span className="ml-1 sm:hidden">Ajouter</span>
          </button>
        </div>
      </div>

      <FriendTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as "friends" | "sent" | "received")}
      />

      {activeTab === "friends" && (
        <FriendCardGrid
          friends={acceptedFriends}
          type="friends"
          onRemove={handleRemove}
        />
      )}
      {activeTab === "sent" && (
        <FriendCardGrid
          friends={pendingSent}
          type="sent"
          onRemove={handleCancelRequest}
        />
      )}
      {activeTab === "received" && (
        <FriendCardGrid
          friends={pendingReceived}
          type="received"
          onRemove={handleRejectRequest}
          onAccept={handleAcceptRequest}
        />
      )}
    </div>
  );
}
