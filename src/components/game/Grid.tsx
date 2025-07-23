import LetterCell from "./LetterCell";
import {
  GameStates,
  type GameStatesEnum,
} from "../../types/enums/GameStateEnum";
import type { Guess } from "../../types/Guess";
import { LetterStates } from "../../types/enums/LetterStateEnum";
import type { ColorBlindModeEnum } from "../../types/enums/ColorBlindModeEnum";

type GridProps = {
  guesses: Guess[];
  currentGuess: string;
  wordLength: number;
  maxAttempts: number;
  activeColIndex: number;
  gamestate: GameStatesEnum;
  letterAnimationDelay: number;
  letterAnimationTime: number;
  colorblindMode: ColorBlindModeEnum;
  setActiveColIndex: React.Dispatch<React.SetStateAction<number>>;
};

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

export default function Grid(props: GridProps) {
  const rows = [];

  for (let rowIndex = 0; rowIndex < props.maxAttempts; rowIndex++) {
    const isPastRow = rowIndex < props.guesses.length;
    const isCurrentRow =
      props.gamestate === GameStates.PLAYING &&
      rowIndex === props.guesses.length;

    const cells = [];
    if (isPastRow) {
      const guess = props.guesses[rowIndex];
      for (let col = 0; col < props.wordLength; col++) {
        cells.push(
          <LetterCell
            key={`${rowIndex}-${col}-${guess.word[col]}`}
            letter={guess.word[col]}
            status={guess.result[col]}
            preview={false}
            isActive={false}
            willFlip={props.gamestate === GameStates.REVEALING}
            delay={props.letterAnimationDelay * col}
            animationTime={props.letterAnimationTime}
            colorblindMode={props.colorblindMode}
            column={col}
            setActiveColIndex={props.setActiveColIndex}
          />
        );
      }
    } else if (isCurrentRow) {
      const paddedGuess = props.currentGuess.padEnd(props.wordLength, " ");

      for (let col = 0; col < props.wordLength; col++) {
        const char = paddedGuess[col];

        cells.push(
          <LetterCell
            key={`${rowIndex}-${col}-${props.gamestate}`}
            letter={
              char === " "
                ? getCorrectLetterOrEmpty(props.guesses, rowIndex, col)
                : char
            }
            status={LetterStates.NONE}
            preview={char === " "}
            isActive={col === props.activeColIndex}
            willFlip={false}
            delay={props.letterAnimationDelay * col}
            animationTime={props.letterAnimationTime}
            colorblindMode={props.colorblindMode}
            column={col}
            setActiveColIndex={props.setActiveColIndex}
          />
        );
      }
    } else {
      for (let col = 0; col < props.wordLength; col++) {
        cells.push(
          <LetterCell
            key={`${rowIndex}-${col}-${props.gamestate}`}
            letter=""
            preview={false}
            status={LetterStates.NONE}
            isActive={false}
            willFlip={false}
            delay={props.letterAnimationDelay * col}
            animationTime={props.letterAnimationTime}
            colorblindMode={props.colorblindMode}
            column={col}
            setActiveColIndex={props.setActiveColIndex}
          />
        );
      }
    }

    rows.push(
      <div key={rowIndex} className="flex gap-2 w-full max-w-xs mx-auto">
        {cells}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center p-4 bg-background">
      {rows}
    </div>
  );
}
