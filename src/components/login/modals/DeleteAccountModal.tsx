import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ThemedInput from "@/components/ui/themed/input";
import { deleteUser } from "@/api/users/deleteUser/DeleteUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser({ password });
      navigate("/logout");
    } catch (err: unknown) {
      let message = "Erreur : échec de la suppression.";

      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        message = err.message;
      }

      alert(message);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-primary-container text-primary-container-foreground border border-primary-container-border rounded-lg shadow">
        <DialogHeader>
          <DialogTitle>Supprimer mon compte</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-primary-container-muted">
          Cette action est <strong>définitive</strong> et entraînera la perte de
          toutes vos données. Pour confirmer, entrez votre mot de passe.
        </p>

        <ThemedInput
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="w-full sm:w-auto bg-primary-container-error hover:bg-primary-container-error/80"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
