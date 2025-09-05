import { getCorrectLetterOrEmpty } from "@/services/GetCorrectLetterOrEmpty";
import { GameStates } from "../../types/enums/GameStateEnum";
import { LetterStates } from "../../types/enums/LetterStateEnum";
import { LetterCellAnimated } from "./LetterCellAnimated";
import { LetterCellBase } from "./LetterCellBase";
import { useGameStore } from "@/hooks/useGameStore";

export default function Grid() {
  const cells = [];
  const {
    guesses,
    currentGuess,
    activeColIndex,
    maxAttempts,
    status,
    solution,
    letterAnimationDelay,
  } = useGameStore();

  if (!solution) return null;

  for (let rowIndex = 0; rowIndex < maxAttempts; rowIndex++) {
    const isPastRow = rowIndex < guesses.length;
    const isCurrentRow = rowIndex === guesses.length;

    for (let col = 0; col < solution?.word.length; col++) {
      let cell;

      if (isPastRow) {
        const guess = guesses[rowIndex];
        const shouldAnimate =
          status === GameStates.REVEALING && rowIndex === guesses.length - 1;

        cell = (
          <LetterCellAnimated
            key={`${rowIndex}-${col}`}
            letter={guess.word[col]}
            letterState={guess.result[col]}
            delay={letterAnimationDelay * col}
            willFlip={shouldAnimate}
            column={col}
          />
        );
      } else if (isCurrentRow) {
        const paddedGuess = currentGuess.padEnd(solution?.word.length, " ");
        const char = paddedGuess[col];
        const letter =
          char === " " && status === GameStates.PLAYING
            ? getCorrectLetterOrEmpty(guesses, rowIndex, col)
            : char;

        cell = (
          <LetterCellBase
            key={`${rowIndex}-${col}`}
            letter={letter}
            letterState={LetterStates.NONE}
            isActive={col === activeColIndex && status === GameStates.PLAYING}
            error={
              status === GameStates.INVALID_GUESS &&
              (char === " " || currentGuess.indexOf(" ") === -1)
            }
            preview={char === " "}
            column={col}
          />
        );
      } else {
        cell = (
          <LetterCellBase
            key={`${rowIndex}-${col}`}
            letter=""
            letterState={LetterStates.NONE}
            column={col}
          />
        );
      }

      cells.push(cell);
    }
  }

  return (
    <div
      className="grid w-full h-full gap-1 sm:gap-2 p-1 sm:p-2 justify-around content-center"
      style={{
        gridTemplateColumns: `repeat(${solution?.word.length}, 1fr)`,
        gridTemplateRows: `repeat(${maxAttempts}, 1fr)`,
      }}
    >
      {cells}
    </div>
  );
}
