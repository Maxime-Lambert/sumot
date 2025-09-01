import { CheckCircle2, User, XCircle } from "lucide-react";
import type { FriendRequest } from "@/api/friendRequests/getFriendRequests/GetFriendRequests";
import { RemoveFriendButton } from "./RemoveFriendButton";

type FriendCardGridProps = {
  friends: FriendRequest[];
  type: "friends" | "sent" | "received";
  onRemove: (f: FriendRequest) => Promise<void>;
  onAccept?: (f: FriendRequest) => Promise<void>;
};

export default function FriendCardGrid({
  friends,
  type,
  onRemove,
  onAccept,
}: FriendCardGridProps) {
  if (friends.length === 0) {
    return (
      <div className="text-center text-muted py-6">
        {type === "friends"
          ? "Aucun ami."
          : type === "sent"
          ? "Aucune demande envoyée."
          : "Aucune demande reçue."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
      {friends.map((f) => (
        <div
          key={f.id}
          className="bg-secondary-container rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold uppercase">
            <User size={20} />
          </div>
          <div className="font-medium text-base sm:text-sm text-center break-words">
            {f.userName}
          </div>

          <div className="flex gap-2">
            {type === "friends" && (
              <RemoveFriendButton
                friend={f}
                icon={"trash"}
                onConfirm={onRemove}
              />
            )}
            {type === "sent" && (
              <button
                onClick={async () => await onRemove?.(f)}
                className="flex items-center gap-1 p-2 rounded-md bg-success text-white hover:opacity-90"
              >
                <XCircle className="w-4 h-4 text-error" />
                <span className="text-sm sm:hidden">Annuler</span>
              </button>
            )}
            {type === "received" && (
              <>
                <button
                  onClick={async () => await onAccept?.(f)}
                  className="flex items-center gap-1 p-2 rounded-md bg-success text-white hover:opacity-90"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm sm:hidden">Accepter</span>
                </button>
                <button
                  onClick={async () => await onRemove?.(f)}
                  className="flex items-center gap-1 p-2 rounded-md bg-success text-white hover:opacity-90"
                >
                  <XCircle className="w-4 h-4 text-error" />
                  <span className="text-sm sm:hidden">Refuser</span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
