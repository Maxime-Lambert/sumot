import clsx from "clsx";
import { analyzeGuesses } from "../../services/AnalyzeGuesses";
import type { KeyboardLayoutsEnum } from "../../types/enums/KeyboardLayoutsEnum";
import { GameStates } from "../../types/enums/GameStateEnum";
import { Delete, CornerDownLeft } from "lucide-react";
import { SmartKeyboardType } from "../../types/enums/KeyboardTypeEnum";
import { useSettingsStore } from "@/hooks/useSettingStore";
import { useGameStore } from "@/hooks/useGameStore";
import type { Sumot } from "@/types/Sumot";
import { useSearchParams } from "react-router-dom";

const LAYOUTS: Record<KeyboardLayoutsEnum, string[][]> = {
  AZERTY: [
    "A Z E R T Y U I O P".split(" "),
    [..."Q S D F G H J K".split(" "), "Backspace"],
    [..."L M W X C V B N".split(" "), "Enter"],
  ],
  QWERTY: [
    "Q W E R T Y U I O P".split(" "),
    [..."A S D F G H J K".split(" "), "Backspace"],
    [..."L Z X C V B N M".split(" "), "Enter"],
  ],
  QWERTZ: [
    "Q W E R T Z U I O P".split(" "),
    [..."A S D F G H J K".split(" "), "Backspace"],
    [..." L Y X C V B N M".split(" "), "Enter"],
  ],
  Hidden: [],
};

interface KeyboardProps {
  sumots: Sumot[];
}

export default function Keyboard({ sumots }: KeyboardProps) {
  const { keyboardLayout, keyboardType } = useSettingsStore();
  const { status, activeColIndex, guesses, inputKey } = useGameStore();
  const analyze = analyzeGuesses(guesses, keyboardType);
  const KEYS = LAYOUTS[keyboardLayout];
  const [searchParams] = useSearchParams();
  const infiniteParam = searchParams.get("infinite");

  const handleClick = (
    key: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.currentTarget.blur();
    const k =
      key === "Backspace"
        ? "Backspace"
        : key === "Enter"
        ? "Enter"
        : key.toUpperCase();
    inputKey(
      k,
      sumots?.map((s) => s.word),
      infiniteParam !== null
    );
  };

  const getClassName = (key: string): string => {
    const isPlaying = status === GameStates.PLAYING;

    const base = "text-xs sm:text-sm font-semibold uppercase rounded border";

    if (!isPlaying || keyboardType === SmartKeyboardType.None) {
      return clsx(
        base,
        "bg-cell-background-default text-cell-foreground-default border-cell-border-default"
      );
    }

    if (keyboardType === SmartKeyboardType.Simple) {
      if (analyze.missing.has(key)) {
        return clsx(
          base,
          "bg-cell-background-missing text-cell-foreground-missing border-cell-border-default"
        );
      }
      return clsx(
        base,
        "bg-cell-background-default text-cell-foreground-default border-cell-border-default"
      );
    }

    if (keyboardType === SmartKeyboardType.Correct) {
      const isCorrect =
        analyze.correct.get(activeColIndex) === key &&
        analyze.correct.has(activeColIndex);

      if (isCorrect) {
        return clsx(
          base,
          "bg-cell-background-correct text-cell-foreground-correct border-cell-border-default"
        );
      }

      if (analyze.missing.has(key)) {
        return clsx(
          base,
          "bg-cell-background-missing text-cell-foreground-missing border-cell-border-default"
        );
      }

      return clsx(
        base,
        "bg-cell-background-default text-cell-foreground-default border-cell-border-default"
      );
    }

    return clsx(
      base,
      "bg-cell-background-default text-cell-foreground-default border-cell-border-default"
    );
  };

  return (
    <div
      className="flex flex-col gap-[0.5rem] w-full max-w-[680px]
                 items-center justify-center mx-auto select-none"
    >
      {KEYS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid w-full gap-[0.4rem]"
          style={{
            gridTemplateColumns: row.map(() => "1fr").join(" "),
          }}
        >
          {row.map((key) => {
            return (
              <button
                type="button"
                translate="no"
                key={key}
                onClick={(e) => handleClick(key, e)}
                className={clsx(
                  getClassName(key),
                  "flex flex-col items-center justify-center rounded border font-bold text-lg sm:text-xl select-none transition-colors duration-150 ease-in-out",
                  "py-1 sm:py-3"
                )}
              >
                {key === "Backspace" ? (
                  <>
                    <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="text-[0.625rem] sm:text-xs font-normal">
                      Suppr
                    </p>
                  </>
                ) : key === "Enter" ? (
                  <>
                    <CornerDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="text-[0.625rem] sm:text-xs font-normal">
                      Entrée
                    </p>
                  </>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
