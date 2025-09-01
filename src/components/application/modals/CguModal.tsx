import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalCguProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CguModal({ isOpen, onClose }: ModalCguProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-primary-container text-primary-container-foreground rounded-lg border border-primary-container-border">
        <DialogHeader>
          <DialogTitle className="text-center">
            Conditions générales d'utilisation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-justify">
          <p>
            En utilisant Sumot, vous acceptez de respecter les présentes
            conditions générales d’utilisation.
          </p>

          <p>
            Sumot est un jeu gratuit en ligne vous proposant chaque jour un mot
            à deviner. La création de compte est facultative, mais permet
            d’enregistrer votre progression, vos paramètres et vos amis.
          </p>

          <p>
            Toute tentative de triche, d’accès non autorisé ou d’utilisation
            abusive pourra entraîner la suppression de votre compte.
          </p>

          <p>
            L’équipe de Sumot se réserve le droit de modifier ou suspendre le
            service à tout moment, sans préavis.
          </p>

          <p>
            En cas de suppression volontaire ou automatique (inactivité de 2
            ans), vos données seront définitivement effacées.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
