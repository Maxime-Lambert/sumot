import { useGameStore } from "@/hooks/useGameStore";
import {
  LetterStates,
  type LetterStateEnum,
} from "@/types/enums/LetterStateEnum";
import clsx from "clsx";

type LetterCellBaseProps = {
  letter: string;
  letterState: LetterStateEnum;
  isActive?: boolean;
  error?: boolean;
  preview?: boolean;
  column?: number;
};

export function LetterCellBase({
  letter,
  letterState,
  isActive = false,
  error = false,
  preview = false,
  column,
}: LetterCellBaseProps) {
  const { setActiveColIndex } = useGameStore();
  const getColorState = () => {
    if (preview) {
      return "bg-cell-background-preview text-cell-foreground-preview";
    }

    switch (letterState) {
      case LetterStates.CORRECT:
        return "bg-cell-background-correct text-cell-foreground-correct";
      case LetterStates.PRESENT:
        return "bg-cell-background-almost text-cell-foreground-almost";
      case LetterStates.MISSING:
        return "bg-cell-background-missing text-cell-foreground-missing";
      default:
        return "bg-cell-background-default text-cell-foreground-default";
    }
  };

  return (
    <div
      translate="no"
      className={clsx(
        "select-none flex items-center justify-center rounded border text-2xl font-bold aspect-square",
        getColorState(),
        isActive && "border-cell-border-select",
        error && "border-cell-border-error animate-shake",
        !isActive && "border-cell-border-default"
      )}
      onClick={() => {
        if (column !== undefined) {
          setActiveColIndex(column);
        }
      }}
    >
      {letter}
    </div>
  );
}
