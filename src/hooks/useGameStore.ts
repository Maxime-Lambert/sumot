import { create } from "zustand";
import { GameStates, type GameStatesEnum } from "@/types/enums/GameStateEnum";
import type { Guess } from "@/types/Guess";
import type { Sumot } from "@/types/Sumot";
import { evaluateGuess } from "@/services/EvaluateGuess";
import { handleGameOver } from "@/services/SumotHistoryStorage";
import { getCorrectLetterOrEmpty } from "@/services/GetCorrectLetterOrEmpty";

interface GameState {
  guesses: Guess[];
  currentGuess: string;
  activeColIndex: number;
  status: GameStatesEnum;
  solution?: Sumot;
  maxAttempts: number;
  letterAnimationDelay: number;
  letterAnimationTime: number;

  setSolution: (s: Sumot) => void;
  setGuesses: (g: Guess[]) => void;
  setActiveColIndex: (i: number) => void;
  setStatus: (s: GameStatesEnum) => void;
  reset: (solution: Sumot) => void;
  inputKey: (rawKey: string, sumots: string[], infiniteMode: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  guesses: [],
  currentGuess: "",
  activeColIndex: 0,
  solution: undefined,
  status: GameStates.LOADING,
  maxAttempts: 6,
  letterAnimationDelay: 150,
  letterAnimationTime: 300,

  setSolution: (s) => set({ solution: s }),
  setGuesses: (g) => set({ guesses: g }),
  setActiveColIndex: (i) => set({ activeColIndex: i }),
  setStatus: (s) => set({ status: s }),

  reset: (solution) =>
    set({
      guesses: [],
      currentGuess: "",
      activeColIndex: 0,
      solution,
    }),

  inputKey: (rawKey: string, sumots: string[], infiniteMode: boolean) => {
    const {
      currentGuess,
      guesses,
      activeColIndex,
      solution,
      status,
      maxAttempts,
      letterAnimationDelay,
      letterAnimationTime,
    } = get();
    if (!solution) return;

    if (
      !(
        [GameStates.PLAYING, GameStates.INVALID_GUESS] as GameStatesEnum[]
      ).includes(status)
    )
      return;

    const key = rawKey.length === 1 ? rawKey.toUpperCase() : rawKey;

    if (key === "Enter") {
      const guessOk =
        currentGuess.length === solution.word.length &&
        sumots.some((s) => s === currentGuess);
      let usedGuess = currentGuess;

      if (!guessOk) {
        const previewGuess = currentGuess
          .split("")
          .map((c, i) =>
            c === " " ? getCorrectLetterOrEmpty(guesses, guesses.length, i) : c
          )
          .join("");
        const previewGuessOk =
          previewGuess.length === solution.word.length &&
          sumots.some((s) => s === previewGuess);
        if (!previewGuessOk) {
          set({
            status: GameStates.INVALID_GUESS,
          });
          setTimeout(() => set({ status: GameStates.PLAYING }), 500);
          return;
        } else {
          usedGuess = previewGuess;
        }
      }

      const result = evaluateGuess(usedGuess, solution.word);
      const newGuesses = [...guesses, { word: usedGuess, result }];

      set({
        guesses: newGuesses,
        currentGuess: "",
        status: GameStates.REVEALING,
      });

      const lastGuess = newGuesses.at(-1)!;

      if (!infiniteMode) {
        handleGameOver(
          solution.word,
          newGuesses.map((g) => g.word),
          lastGuess.word === solution.word
        );
      }

      setTimeout(() => {
        if (lastGuess.word === solution.word) {
          set({ status: GameStates.WON });
        } else if (newGuesses.length >= maxAttempts) {
          set({ status: GameStates.LOST });
        } else {
          set({ status: GameStates.PLAYING, activeColIndex: 0 });
        }
      }, solution.word.length * (letterAnimationDelay + letterAnimationTime));
      return;
    }

    if (key === "Backspace") {
      const padded = currentGuess.padEnd(solution.word.length, " ");
      const chars = padded.split("");
      if (chars[activeColIndex] === " " && activeColIndex > 0) {
        chars[activeColIndex - 1] = " ";
        set({
          currentGuess: chars.join(""),
          activeColIndex: activeColIndex - 1,
        });
      } else {
        chars[activeColIndex] = " ";
        set({ currentGuess: chars.join("") });
      }
      return;
    }

    if (key === "ArrowLeft") {
      set({ activeColIndex: Math.max(activeColIndex - 1, 0) });
      return;
    }

    if (key === "ArrowRight") {
      set({
        activeColIndex: Math.min(activeColIndex + 1, solution.word.length - 1),
      });
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      const padded = currentGuess.padEnd(solution.word.length, " ");
      const chars = padded.split("");
      chars[activeColIndex] = key;
      set({
        currentGuess: chars.join(""),
        activeColIndex: Math.min(activeColIndex + 1, solution.word.length - 1),
      });
      return;
    }
  },
}));
