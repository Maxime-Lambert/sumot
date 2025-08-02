import { useState, useEffect, useMemo } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import type { Guess } from "../../types/Guess";
import { type KeyboardLayoutsEnum } from "../../types/enums/KeyboardLayoutsEnum";
import {
  GameStates,
  type GameStatesEnum,
} from "../../types/enums/GameStateEnum";
import type { ColorBlindModeEnum } from "../../types/enums/ColorBlindModeEnum";
import GameResultPanel from "./GameResultPanel";
import type { Sumot } from "../../types/Sumot";
import { evaluateGuess } from "../../services/EvaluateGuess";
import type { SmartKeyboardTypeEnum } from "../../types/enums/KeyboardTypeEnum";
import {
  fetchInitialSumots,
  updateSumotsFromDate,
} from "../../api/sumots/getAllSumots/GetAllSumots";

interface SumotProps {
  layoutType: KeyboardLayoutsEnum;
  colorblindMode: ColorBlindModeEnum;
  keyboardType: SmartKeyboardTypeEnum;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Sumot(props: SumotProps) {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatesEnum>(GameStates.LOADING);
  const [sumots, setSumots] = useState<Sumot[]>([]);
  const [solution, setSolution] = useState<Sumot>();
  const [activeColIndex, setActiveColIndex] = useState<number>(0);

  const onPlayAgain = () => {
    setActiveColIndex(0);
    setGuesses([]);
    setStatus(GameStates.PLAYING);
    setSolution(sumots.at(getRandomInt(sumots.length))!);
  };

  const MAX_ATTEMPTS = 6;
  const FLIP_ANIMATION_DURATION = 400;
  const FLIP_DELAY_BETWEEN_LETTERS = 200;
  const totalRevealTime = useMemo(() => {
    return solution
      ? (solution.word.length - 1) *
          (FLIP_DELAY_BETWEEN_LETTERS + FLIP_ANIMATION_DURATION)
      : 0;
  }, [solution, FLIP_DELAY_BETWEEN_LETTERS, FLIP_ANIMATION_DURATION]);

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
        setSolution(match);
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
          currentGuess.length !== solution!.word.length ||
          !sumots.some(
            (s) => s.word.toUpperCase() === currentGuess.toUpperCase()
          )
        ) {
          setStatus(GameStates.INVALID_GUESS);
          setTimeout(() => setStatus(GameStates.PLAYING), 500);
          return;
        }

        const guessSnapshot = currentGuess;
        const evaluation = evaluateGuess(guessSnapshot, solution!.word);
        const newAttempt = { word: guessSnapshot, result: evaluation };
        const newGuesses = [...guesses, newAttempt];
        setGuesses(newGuesses);
        setCurrentGuess("");
        setStatus(GameStates.REVEALING);

        setTimeout(() => {
          if (guessSnapshot === solution!.word) {
            setStatus(GameStates.WON);
          } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setStatus(GameStates.LOST);
          } else {
            setStatus(GameStates.PLAYING);
            setActiveColIndex(0);
          }
        }, totalRevealTime);
      } else if (e.key === "Backspace") {
        if (currentGuess[activeColIndex] === " ") {
          setCurrentGuess((prev) => {
            if (activeColIndex > 0) {
              if (
                activeColIndex === 4 &&
                currentGuess[activeColIndex] !== " "
              ) {
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
        } else {
          setCurrentGuess((prev) => {
            const updated =
              prev.slice(0, activeColIndex) +
              " " +
              prev.slice(activeColIndex + 1);
            return updated;
          });
        }
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        const paddedGuess = currentGuess.padEnd(solution!.word.length, " ");
        const isLetterEditable = activeColIndex < solution!.word.length;

        if (isLetterEditable) {
          const updated =
            paddedGuess.slice(0, activeColIndex) +
            e.key.toUpperCase() +
            paddedGuess.slice(activeColIndex + 1);

          setCurrentGuess(updated);
          setActiveColIndex((prev) =>
            Math.min(prev + 1, solution!.word.length - 1)
          );
        }
      } else if (e.key === "ArrowLeft") {
        setActiveColIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowRight") {
        setActiveColIndex((prev) =>
          Math.min(prev + 1, solution!.word.length - 1)
        );
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

  const date = new Date();
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const capitalizedFrenchDate = formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  console.log("Sumot", solution?.id, "Date:", solution?.day);

  if (status === GameStates.LOADING) {
    return (
      <>
        <h1 className="text-xl font-semibold mb-4 text-center">
          {capitalizedFrenchDate}
        </h1>
        <div className="flex justify-center items-center h-screen text-white">
          Chargement du jeu...
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-4 text-center">
        {capitalizedFrenchDate}
      </h1>
      <div className="flex gap-8 items-start">
        {solution && (
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            wordLength={solution?.word.length}
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
