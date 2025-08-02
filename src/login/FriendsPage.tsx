import { acceptFriendRequest } from "@/api/friendRequests/acceptFriendRequest/AcceptFriendRequest";
import { deleteFriendRequest } from "@/api/friendRequests/deleteFriendRequest/DeleteFriendRequest";
import {
  type FriendRequest,
  getFriendRequests,
} from "@/api/friendRequests/getFriendRequests/GetFriendRequests";
import { removeFriend } from "@/api/friendRequests/RemoveFriend/RemoveFriend";
import { sendFriendRequest } from "@/api/friendRequests/sendFriendRequest/SendFriendRequest";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FriendsPage() {
  const [accepted, setAccepted] = useState<FriendRequest[]>([]);
  const [pendingSent, setPendingSent] = useState<FriendRequest[]>([]);
  const [pendingReceived, setPendingReceived] = useState<FriendRequest[]>([]);
  const [targetUsername, setTargetUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const data = await getFriendRequests();
      setAccepted(data.accepted);
      setPendingSent(data.pending.filter((x) => x.direction === "Sent"));
      setPendingReceived(
        data.pending.filter((x) => x.direction === "Received")
      );
    } catch {
      toast.error("Erreur lors du chargement.");
    }
  }

  async function handleSendRequest() {
    if (!targetUsername.trim()) return;

    setLoading(true);
    try {
      await sendFriendRequest({ targetUsername: targetUsername.trim() });
      toast.success("Demande envoyée !");
      setTargetUsername("");
      await refresh();
    } catch {
      toast.error("Échec de l’envoi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-surface text-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4 text-center">
        Gestion des Amis
      </h1>
      <section>
        <h2 className="text-lg font-semibold mb-2">Ajouter un ami</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nom de l’utilisateur"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            disabled={loading}
          />
          <button
            className="bg-correct text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleSendRequest}
            disabled={loading}
          >
            Envoyer
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Amis</h2>
        {accepted.length === 0 ? (
          <p className="text-muted">Aucun ami.</p>
        ) : (
          <ul className="space-y-2">
            {accepted.map((f) => (
              <li
                key={f.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border p-2 rounded"
              >
                <div className="text-sm">
                  <span className="font-medium">{f.userName}</span>{" "}
                  <span className="text-muted">({f.email})</span>
                </div>
                <button
                  onClick={() =>
                    removeFriend({ targetUserId: f.userId }).then(refresh)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Demandes envoyées</h2>
        {pendingSent.length === 0 ? (
          <p className="text-muted">Aucune demande envoyée.</p>
        ) : (
          <ul className="space-y-2">
            {pendingSent.map((f) => (
              <li
                key={f.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border p-2 rounded"
              >
                <div className="text-sm">
                  <span className="font-medium">{f.userName}</span>{" "}
                  <span className="text-muted">({f.email})</span>
                </div>
                <button
                  onClick={() =>
                    deleteFriendRequest({ friendId: f.userId }).then(refresh)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Annuler
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Demandes reçues</h2>
        {pendingReceived.length === 0 ? (
          <p className="text-muted">Aucune demande reçue.</p>
        ) : (
          <ul className="space-y-2">
            {pendingReceived.map((f) => (
              <li
                key={f.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border p-2 rounded"
              >
                <div className="text-sm">
                  <span className="font-medium">{f.userName}</span>{" "}
                  <span className="text-muted">({f.email})</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      acceptFriendRequest({ friendId: f.userId }).then(refresh)
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() =>
                      deleteFriendRequest({ friendId: f.userId }).then(refresh)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
