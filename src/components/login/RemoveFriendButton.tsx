import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import type { FriendRequest } from "@/api/friendRequests/getFriendRequests/GetFriendRequests";

type RemoveFriendButtonProps = {
  friend: FriendRequest;
  icon?: "trash" | "x";
  onConfirm: (f: FriendRequest) => Promise<void>;
};

export function RemoveFriendButton({
  friend,
  icon = "trash",
  onConfirm,
}: RemoveFriendButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm(friend);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 p-2 rounded-md bg-success text-white hover:opacity-90"
        >
          {icon === "trash" ? (
            <Trash2 className="w-4 h-4 text-error" />
          ) : (
            <XCircle className="w-4 h-4 text-error" />
          )}
          <span className="text-sm sm:hidden">Supprimer</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cet ami ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. {friend.userName} sera retiré de ta
            liste d’amis et vous ne pourrez plus voir vos scores mutuels.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
