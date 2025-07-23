import { RefreshCw } from "lucide-react";
import {
  ColorBlindMode,
  type ColorBlindModeEnum,
} from "../../types/enums/ColorBlindModeEnum";
import {
  type GameStatesEnum,
  GameStates,
} from "../../types/enums/GameStateEnum";
import { LetterStates } from "../../types/enums/LetterStateEnum";
import DefinitionPanel from "./DefinitionPanel";
import LetterCell from "./LetterCell";
import clsx from "clsx";

type GameResultPanelProps = {
  solution: string;
  status: GameStatesEnum;
  attempts: number;
  colorblindMode: ColorBlindModeEnum;
  onPlayAgain(): void;
  setActiveColIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function GameResultPanel(props: GameResultPanelProps) {
  const isColorblind = props.colorblindMode === ColorBlindMode.ACTIVE;
  return (
    <div className="flex flex-col items-center gap-4 bg-surface border border-accent rounded-xl p-4 w-full max-w-2xl text-white shadow-lg mx-auto">
      <div className="flex gap-2">
        {props.solution.split("").map((char, idx) => (
          <LetterCell
            key={idx}
            letter={char}
            status={LetterStates.CORRECT}
            willFlip={true}
            preview={false}
            isActive={false}
            delay={0}
            animationTime={0}
            colorblindMode={props.colorblindMode}
            column={0}
            setActiveColIndex={props.setActiveColIndex}
          />
        ))}
      </div>

      <div className="flex flex-col items-center text-center text-sm w-full px-4">
        {props.status === GameStates.WON ? (
          <>
            <p className="mb-2">
              SUUUUUUUUUUUUUUUUUU ! Mot trouvé en{" "}
              <strong>{props.attempts}</strong>{" "}
              {props.attempts === 1 ? "essai" : "essais"}.
            </p>
            <img
              src="/sumot_tranquille.png"
              alt="SUMOT Tranquille"
              className="w-4/5 h-auto object-contain my-2"
            />
          </>
        ) : (
          <>
            <p className="mb-2">
              Raté ! Le mot était <strong>{props.solution}</strong>.
            </p>
            <img
              src="/sumot_venere.png"
              alt="SUMOT Venere"
              className="w-4/5 h-auto object-contain my-2"
            />
          </>
        )}

        <DefinitionPanel word={props.solution} />
        <button
          className={clsx(
            "mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-semibold shadow hover:opacity-90 transition",
            isColorblind ? "bg-colorblind-correct" : "bg-correct"
          )}
          onClick={props.onPlayAgain}
        >
          <RefreshCw size={20} className="w-5 h-5" />
          <span className="leading-none">Rejouer</span>
        </button>
      </div>
    </div>
  );
}
