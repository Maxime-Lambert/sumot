import { LetterStates } from "@/types/enums/LetterStateEnum";
import type { Guess } from "@/types/Guess";

export const getCorrectLetterOrEmpty = (
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
