import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalPolitiqueProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  isOpen,
  onClose,
}: ModalPolitiqueProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-primary-container text-primary-container-foreground rounded-lg border border-primary-container-border">
        <DialogHeader>
          <DialogTitle className="text-center">
            Politique de confidentialité
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-justify">
          <p>
            Sumot respecte le Règlement Général sur la Protection des Données
            (RGPD). Seules les données strictement nécessaires sont collectées.
          </p>

          <p>Les données stockées sont :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Nom d’utilisateur</li>
            <li>Mot de passe (chiffré, jamais en clair)</li>
            <li>Email (facultatif)</li>
            <li>Paramètres de jeu</li>
            <li>Historique des Sumots réalisés</li>
            <li>Liste d’amis</li>
          </ul>

          <p>
            Ces données sont utilisées uniquement pour assurer le bon
            fonctionnement du service. Elles ne sont jamais revendues ni
            partagées avec des tiers.
          </p>

          <p>
            Les comptes inactifs depuis 2 ans sont automatiquement supprimés
            ainsi que l’ensemble des données associées.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
