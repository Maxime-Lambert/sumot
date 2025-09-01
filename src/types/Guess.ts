import type { LetterStateEnum } from "./enums/LetterStateEnum";

export interface Guess {
  word: string;
  result: LetterStateEnum[];
}
