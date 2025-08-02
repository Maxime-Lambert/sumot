import type { GuessesStateSummary } from "../types/GuessesStateSummary";
import type { Guess } from "../types/Guess";
import { LetterStates } from "../types/enums/LetterStateEnum";
import {
  SmartKeyboardType,
  type SmartKeyboardTypeEnum,
} from "../types/enums/KeyboardTypeEnum";

export function analyzeGuesses(
  guesses: Guess[],
  keyboardType: SmartKeyboardTypeEnum
): GuessesStateSummary {
  const missing = new Set<string>();
  const correct = new Map<number, string>();

  for (let row = 0; row < guesses.length; row++) {
    const guess = guesses[row];
    for (let col = 0; col < guess.word.length; col++) {
      const letter = guess.word[col];
      const state = guess.result[col];

      switch (state) {
        case LetterStates.MISSING: {
          let isAlsoPresent = false;
          for (let i = 0; i < guess.word.length; i++) {
            if (
              i !== col &&
              guess.word[i] === letter &&
              (guess.result[i] === LetterStates.PRESENT ||
                (keyboardType === SmartKeyboardType.SIMPLE &&
                  guess.result[i] === LetterStates.CORRECT))
            ) {
              isAlsoPresent = true;
              break;
            }
          }
          if (!isAlsoPresent) {
            missing.add(letter);
          }
          break;
        }
        case LetterStates.CORRECT:
          correct.set(col, letter);
          break;
      }
    }
  }

  return { missing, correct };
}
