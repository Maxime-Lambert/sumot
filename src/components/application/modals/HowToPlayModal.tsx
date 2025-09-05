import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LegendSquare from "../LegendSquare";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({
  isOpen,
  onClose,
}: HowToPlayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-primary-container text-primary-container-foreground rounded-lg border border-primary-container-border">
        <DialogHeader>
          <DialogTitle className="text-center">Comment jouer ?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-justify">
          <p>
            Chaque jour, il faut trouver un mot du lexique français en 5 ou 6
            lettres.
          </p>
          <p>Le jeu suit les règles du Motus :</p>

          <ul className="list-disc list-inside space-y-1">
            <li>
              Entrez un mot en 5 ou 6 lettres avec votre clavier ou le clavier
              virtuel. Le mot doit faire partie de notre lexique français.
            </li>
            <li>Appuyez sur Entrée pour valider votre mot.</li>
            <li>
              Les couleurs vous indiquent si une lettre est correcte ou non :
            </li>
          </ul>

          <div className="flex gap-6 justify-center pt-2">
            <LegendSquare
              label="Lettre absente"
              className="bg-cell-background-missing"
            />
            <LegendSquare
              label="Bien placée"
              className="bg-cell-background-correct"
            />
            <LegendSquare
              label="Mal placée"
              className="bg-cell-background-almost"
            />
          </div>

          <DialogTitle className="text-center">Astuces</DialogTitle>
          <p>
            Il est possible de déplacer la case active en cliquant sur une
            colonne ou bien avec les flèches gauches et droites du clavier.
          </p>
          <p>
            Il est possible de valider un mot simplement en remplissant les
            cases qui n'ont pas de preview.
          </p>
          <DialogTitle className="text-center">Remerciements</DialogTitle>
          <p>
            La base de données des mots provient de : Pallier, Christophe & New,
            Boris & Jessica Bourgin (2019) Openlexicon, GitHub repository&nbsp;
            <a
              href="https://github.com/chrplr/openlexicon"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:text-primary/80"
            >
              https://github.com/chrplr/openlexicon
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
