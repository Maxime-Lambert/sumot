import clsx from "clsx";
import {
  ColorBlindMode,
  type ColorBlindModeEnum,
} from "../../../types/enums/ColorBlindModeEnum";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorblindMode: ColorBlindModeEnum;
}

export default function HowToPlayModal(props: HowToPlayModalProps) {
  const isColorblind = props.colorblindMode === ColorBlindMode.ACTIVE;
  return (
    <>
      {props.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-surface text-white p-6 rounded-2xl shadow-xl max-w-2xl w-full relative">
            <button
              onClick={() => props.onClose()}
              className="absolute top-3 right-3 text-white text-base border border-accent rounded-full px-2 hover:bg-white/10 transition"
              aria-label="Fermer"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              Comment jouer ?
            </h2>

            <div className="text-justify space-y-4">
              <p>
                Chaque jour, il faut trouver un mot du dictionnaire français en
                5 lettres.
              </p>
              <p>Le jeu suit les règles du Motus :</p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  Entrez un mot en 5 lettres avec votre clavier ou le clavier
                  virtuel.
                </li>
                <li>
                  Appuyez sur <strong>Entrée</strong> pour valider votre mot.
                </li>
                <li>
                  Les couleurs vous indiquent si une lettre est correcte ou non
                  :
                </li>
              </ul>

              <div className="flex gap-6 justify-center pt-2">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded bg-surface border border-accent" />
                  <span className="text-sm mt-2 text-center">
                    Lettre absente
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded border border-accent",
                      isColorblind ? "bg-colorblind-correct" : "bg-correct"
                    )}
                  />
                  <span className="text-sm mt-2 text-center">Bien placée</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded border border-accent",
                      isColorblind ? "bg-colorblind-almost" : "bg-almost"
                    )}
                  />
                  <span className="text-sm mt-2 text-center">Mal placée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
