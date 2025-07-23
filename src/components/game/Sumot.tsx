import { useState, useEffect, useMemo } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import type { Guess } from "../../types/Guess";
import { type KeyboardLayoutsEnum } from "../../types/enums/KeyboardLayoutsEnum";
import {
  fetchInitialSumots,
  updateSumotsFromDate,
} from "../../api/getAllSumots/GetAllSumots";
import type { Sumot } from "../../api/getAllSumots/Sumot";
import {
  GameStates,
  type GameStatesEnum,
} from "../../types/enums/GameStateEnum";
import type { ColorBlindModeEnum } from "../../types/enums/ColorBlindModeEnum";
import GameResultPanel from "./GameResultPanel";
import { evaluateGuess } from "../../services/EvaluateGuess";
import type { KeyboardTypeEnum } from "../../types/enums/KeyboardTypeEnum";

interface SumotProps {
  layoutType: KeyboardLayoutsEnum;
  colorblindMode: ColorBlindModeEnum;
  keyboardType: KeyboardTypeEnum;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Sumot(props: SumotProps) {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatesEnum>(GameStates.LOADING);
  const [sumots, setSumots] = useState<Sumot[]>([]);
  const [solution, setSolution] = useState<string>("");
  const [activeColIndex, setActiveColIndex] = useState<number>(0);

  const onPlayAgain = () => {
    setActiveColIndex(0);
    setGuesses([]);
    setStatus(GameStates.PLAYING);
    setSolution(sumots.at(getRandomInt(sumots.length))!.word);
  };

  const MAX_ATTEMPTS = 6;
  const FLIP_ANIMATION_DURATION = 400;
  const FLIP_DELAY_BETWEEN_LETTERS = 200;
  const totalRevealTime = useMemo(() => {
    return (
      (solution.length - 1) *
      (FLIP_DELAY_BETWEEN_LETTERS + FLIP_ANIMATION_DURATION)
    );
  }, [solution.length, FLIP_DELAY_BETWEEN_LETTERS, FLIP_ANIMATION_DURATION]);

  useEffect(() => {
    async function load() {
      try {
        const local = localStorage.getItem("sumots:all");
        let loaded: Sumot[] = [];
        if (!local) {
          loaded = await fetchInitialSumots();
        } else {
          loaded = await updateSumotsFromDate();
        }

        setSumots(loaded);
        const today = new Date().toISOString().split("T")[0];
        const match = loaded.find((s) => s.day === today);
        setSolution(match!.word);
      } catch (err) {
        console.error("Erreur lors du chargement des sumots", err);
      } finally {
        setStatus(GameStates.PLAYING);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== GameStates.PLAYING) return;
      if (e.key === "Enter") {
        if (
          currentGuess.length !== solution.length ||
          !sumots.some(
            (s) => s.word.toUpperCase() === currentGuess.toUpperCase()
          )
        ) {
          return;
        }

        const guessSnapshot = currentGuess;
        const evaluation = evaluateGuess(guessSnapshot, solution);
        const newAttempt = { word: guessSnapshot, result: evaluation };
        const newGuesses = [...guesses, newAttempt];
        setGuesses(newGuesses);
        setCurrentGuess("");
        setStatus(GameStates.REVEALING);

        setTimeout(() => {
          if (guessSnapshot === solution) {
            setStatus(GameStates.WON);
          } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setStatus(GameStates.LOST);
          } else {
            setStatus(GameStates.PLAYING);
            setActiveColIndex(0);
          }
        }, totalRevealTime);
      } else if (e.key === "Backspace") {
        setCurrentGuess((prev) => {
          if (activeColIndex > 0) {
            if (activeColIndex === 4 && currentGuess[activeColIndex] !== " ") {
              return prev.slice(0, activeColIndex) + " ";
            } else {
              const updated =
                prev.slice(0, activeColIndex - 1) +
                " " +
                prev.slice(activeColIndex);
              setActiveColIndex(activeColIndex - 1);
              return updated;
            }
          }
          return prev;
        });
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        const paddedGuess = currentGuess.padEnd(solution.length, " ");
        const isLetterEditable = activeColIndex < solution.length;

        if (isLetterEditable) {
          const updated =
            paddedGuess.slice(0, activeColIndex) +
            e.key.toUpperCase() +
            paddedGuess.slice(activeColIndex + 1);

          setCurrentGuess(updated);
          setActiveColIndex((prev) => Math.min(prev + 1, solution.length - 1));
        }
      } else if (e.key === "ArrowLeft") {
        setActiveColIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowRight") {
        setActiveColIndex((prev) => Math.min(prev + 1, solution.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentGuess,
    guesses,
    status,
    solution,
    sumots,
    totalRevealTime,
    activeColIndex,
  ]);

  if (status === GameStates.LOADING) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Chargement du jeu...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-8 items-start">
        {solution !== "" && (
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            wordLength={solution.length}
            maxAttempts={MAX_ATTEMPTS}
            gamestate={status}
            letterAnimationDelay={FLIP_DELAY_BETWEEN_LETTERS}
            letterAnimationTime={FLIP_ANIMATION_DURATION}
            colorblindMode={props.colorblindMode}
            activeColIndex={activeColIndex}
            setActiveColIndex={setActiveColIndex}
          />
        )}

        {(status === GameStates.WON || status === GameStates.LOST) && (
          <GameResultPanel
            solution={solution}
            status={status}
            attempts={guesses.length}
            colorblindMode={props.colorblindMode}
            onPlayAgain={onPlayAgain}
            setActiveColIndex={setActiveColIndex}
          />
        )}
      </div>

      <Keyboard
        guesses={guesses}
        activeColIndex={activeColIndex}
        layoutType={props.layoutType}
        gamestate={status}
        colorblindMode={props.colorblindMode}
        keyboardType={props.keyboardType}
      />
    </div>
  );
}
