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
            Merci d’utiliser SUMOT. Nous accordons une grande importance à la
            confidentialité de nos utilisateurs. Cette politique explique
            comment nous gérons les données collectées dans l’application.
          </p>

          <p>1. Données collectées</p>
          <p>
            Sumot respecte le Règlement Général sur la Protection des Données
            (RGPD). Seules les données strictement nécessaires sont collectées.
          </p>
          <p>Les informations que nous recueillons sont les suivantes :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Le nom d'utilisateur</li>
            <li>Le mot de passe(chiffré, jamais en clair)</li>
            <li>L'email (facultatif)</li>
            <li>Les paramètres de jeu</li>
            <li>L'historique des Sumots réalisés</li>
            <li>La liste d'amis</li>
          </ul>

          <p>
            Ces données sont utilisées uniquement pour assurer le bon
            fonctionnement du service. Elles ne sont jamais revendues ni
            partagées avec des tiers.
          </p>

          <p>
            Il est possible de consulter ses données dans la page de profil.\nIl
            est aussi possible de supprimer son compte (et par conséquent les
            données stockées) dans la page de profil. Tout compte inactif de
            plus de 2 ans sera supprimé.
          </p>
          <p>2. Publicité et services tiers</p>
          <p>L’application ne contient aucune publicité.</p>
          <p>
            Nous n’utilisons aucun service tiers pour collecter ou analyser vos
            données.
          </p>
          <p>3. Contact</p>
          <p>
            Si vous avez des questions, vous pouvez nous contacter à :
            contact@sumot.app
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
