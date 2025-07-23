import type { LetterStateEnum } from "./enums/LetterStateEnum";

export type Guess = {
  word: string;
  result: LetterStateEnum[];
};
