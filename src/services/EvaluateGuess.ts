import {
  LetterStates,
  type LetterStateEnum,
} from "../types/enums/LetterStateEnum";

export function evaluateGuess(
  guess: string,
  solution: string
): LetterStateEnum[] {
  const result: LetterStateEnum[] = Array(guess.length).fill(
    LetterStates.MISSING
  );
  const solutionChars = solution.split("");
  const guessChars = guess.split("");
  const matched = Array(solution.length).fill(false);

  for (let i = 0; i < guess.length; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = LetterStates.CORRECT;
      matched[i] = true;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === LetterStates.CORRECT) continue;

    const index = solutionChars.findIndex(
      (c, j) => c === guessChars[i] && !matched[j]
    );
    if (index !== -1) {
      result[i] = LetterStates.PRESENT;
      matched[index] = true;
    }
  }

  return result;
}
