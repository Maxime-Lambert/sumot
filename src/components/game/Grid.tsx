import { GameStates } from "../../types/enums/GameStateEnum";
import type { Guess } from "../../types/Guess";
import { LetterStates } from "../../types/enums/LetterStateEnum";
import { LetterCellAnimated } from "./LetterCellAnimated";
import { LetterCellBase } from "./LetterCellBase";
import { useGameStore } from "@/hooks/useGameStore";

const getCorrectLetterOrEmpty = (
  guesses: Guess[],
  row: number,
  col: number
) => {
  for (let i = 0; i < row; i++) {
    const guess = guesses[i];
    if (guess.result[col] === LetterStates.CORRECT) {
      return guess.word[col];
    }
  }
  return "";
};

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
            error={status === GameStates.INVALID_GUESS}
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
      className="grid w-full h-full gap-[0.4rem] p-2 sm:p-4"
      style={{
        gridTemplateColumns: `repeat(${solution?.word.length}, 1fr)`,
        gridTemplateRows: `repeat(${maxAttempts}, 1fr)`,
      }}
    >
      {cells}
    </div>
  );
}
