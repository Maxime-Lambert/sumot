import clsx from "clsx";
import { analyzeGuesses } from "../../services/AnalyzeGuesses";
import type { Guess } from "../../types/Guess";
import type { KeyboardLayoutsEnum } from "../../types/enums/KeyboardLayoutsEnum";
import {
  GameStates,
  type GameStatesEnum,
} from "../../types/enums/GameStateEnum";
import { Delete, CornerDownLeft } from "lucide-react";
import {
  type ColorBlindModeEnum,
  ColorBlindMode,
} from "../../types/enums/ColorBlindModeEnum";
import {
  SmartKeyboardType,
  type SmartKeyboardTypeEnum,
} from "../../types/enums/KeyboardTypeEnum";

type KeyboardProps = {
  guesses: Guess[];
  layoutType: KeyboardLayoutsEnum;
  activeColIndex: number;
  gamestate: GameStatesEnum;
  colorblindMode: ColorBlindModeEnum;
  keyboardType: SmartKeyboardTypeEnum;
};

const LAYOUTS: Record<KeyboardLayoutsEnum, string[][]> = {
  AZERTY: [
    "A Z E R T Y U I O P".split(" "),
    "Q S D F G H J K L M".split(" "),
    ["Enter", ..."W X C V B N".split(" "), "Backspace"],
  ],
  QWERTY: [
    "Q W E R T Y U I O P".split(" "),
    "A S D F G H J K L".split(" "),
    ["Enter", ..."Z X C V B N M".split(" "), "Backspace"],
  ],
  QWERTZ: [
    "Q W E R T Z U I O P".split(" "),
    "A S D F G H J K L".split(" "),
    ["Enter", ..."Y X C V B N M".split(" "), "Backspace"],
  ],
};

export default function Keyboard(props: KeyboardProps) {
  const analyze = analyzeGuesses(props.guesses, props.keyboardType);
  const KEYS = LAYOUTS[props.layoutType];
  const isColorblind = props.colorblindMode === ColorBlindMode.ACTIVE;

  const handleClick = (key: string) => {
    const keyEvent = new KeyboardEvent("keydown", {
      key:
        key === "Backspace"
          ? "Backspace"
          : key === "Enter"
          ? "Enter"
          : key.toLowerCase(),
    });
    window.dispatchEvent(keyEvent);
  };

  const getClassName = (key: string) => {
    if (props.gamestate !== GameStates.PLAYING) return "bg-primary text-white";
    switch (props.keyboardType) {
      case SmartKeyboardType.NONE:
        return "bg-primary text-white";
      case SmartKeyboardType.SIMPLE:
        if (analyze.missing.has(key)) {
          return "bg-surface text-accent";
        }

        return "bg-primary text-white";
      case SmartKeyboardType.CORRECTION:
        if (
          analyze.correct.has(props.activeColIndex) &&
          analyze.correct.get(props.activeColIndex) === key
        ) {
          return isColorblind
            ? "bg-colorblind-correct text-white"
            : "bg-correct text-white";
        }

        if (analyze.missing.has(key)) {
          return "bg-surface text-accent";
        }

        return "bg-primary text-white";
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      {KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.map((key) => (
            <button
              key={key}
              className={clsx(
                "h-16 min-w-[4rem] rounded text-sm font-semibold uppercase border border-accent",
                key === "Enter" || key === "Backspace" ? "flex-1" : "flex-2",
                getClassName(key)
              )}
              onClick={() => handleClick(key)}
            >
              {key === "Backspace" ? (
                <Delete className="mx-auto" size={16} />
              ) : key === "Enter" ? (
                <CornerDownLeft className="mx-auto" size={16} />
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
