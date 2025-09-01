import { useEffect, useState } from "react";
import GameResultPanel from "@/components/game/GameResultPanel";
import GameScorePanel from "@/components/game/GameScorePanel";
import GameResultModal from "@/components/game/GameResultModal";
import LoadingScreen from "@/components/game/LoadingScreen";
import { GameStates, type GameStatesEnum } from "@/types/enums/GameStateEnum";
import { useGameStore } from "@/hooks/useGameStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSettingsStore } from "@/hooks/useSettingStore";
import type { Sumot } from "@/types/Sumot";
import { getItem } from "@/services/Storage";
import {
  fetchInitialSumots,
  updateSumotsFromDate,
} from "@/api/sumots/getAllSumots/GetAllSumots";
import { getSumotHistories } from "@/api/sumots/getSumotHistories/GetSumotHistories";
import { getUsernameFromToken } from "@/services/GetUserIdFromToken";
import type { Guess } from "@/types/Guess";
import { evaluateGuess } from "@/services/EvaluateGuess";
import { getBufferedSumotHistoryByWord } from "@/services/SumotHistoryStorage";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getRandomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Sumot() {
  const {
    guesses,
    inputKey,
    reset,
    setGuesses,
    setSolution,
    setStatus,
    status,
    solution,
    maxAttempts,
  } = useGameStore();
  const [searchParams] = useSearchParams();
  const [sumots, setSumots] = useState<Sumot[]>([]);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const { playsWithDifficultWords } = useSettingsStore();
  const navigate = useNavigate();
  const infiniteParam = searchParams.has("infinite");
  const dayParam = searchParams.get("day");

  const isValidDateParam = (param: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // format YYYY-MM-DD
    if (!regex.test(param)) return false;

    const d = new Date(param);
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === param;
  };

  const orderedSumots = sumots
    .filter((s) => s.day !== null)
    .sort((a, b) => (a.day! < b.day! ? 1 : -1));

  useEffect(() => {
    async function load() {
      const local = await getItem("sumots:all");
      const loaded = local
        ? await updateSumotsFromDate()
        : await fetchInitialSumots();

      let match: Sumot | undefined;

      if (dayParam) {
        if (!isValidDateParam(dayParam)) {
          navigate("/404", { replace: true });
        }
        match = loaded.find(
          (s) => s.day?.toLowerCase() === dayParam.toLowerCase()
        );
      } else if (infiniteParam) {
        if (playsWithDifficultWords) {
          match = loaded.at(getRandomInRange(0, loaded.length));
        } else {
          const normalWords = loaded.filter((l) => !l.isDifficult);
          match = normalWords.at(getRandomInRange(0, normalWords.length));
        }
      } else {
        const today = new Date().toISOString().split("T")[0];
        match = loaded.find((s) => s.day === today);
      }

      if (match) {
        setSumots(loaded);
        setSolution(match);
      } else {
        navigate("/404", { replace: true });
      }
    }

    void load();
  }, [searchParams, setSolution]);

  useEffect(() => {
    if (!solution) return;
    reset(solution);
    if (infiniteParam) return;
    const token = localStorage.getItem("access_token");
    if (token) {
      const fetch = async () => {
        const histories = await getSumotHistories({
          MinDate: solution.day!,
          MaxDate: solution.day!,
        });
        const username = getUsernameFromToken(token);
        const history = histories.find((h) => h.username === username);
        if (history) {
          const guesses: Guess[] = history.tries.map((tryWord: string) => {
            const letterStates = evaluateGuess(tryWord, solution.word);
            return {
              word: tryWord,
              result: letterStates,
            };
          });

          setGuesses(guesses);
          const lastGuess = guesses.at(-1);
          if (lastGuess?.word === solution.word) {
            setStatus(GameStates.WON);
          } else if (guesses.length >= maxAttempts) {
            setStatus(GameStates.LOST);
          } else {
            setStatus(GameStates.PLAYING);
          }
        }
      };
      void fetch();
    } else {
      const buffered = getBufferedSumotHistoryByWord(solution.word);
      if (buffered) {
        const loadedGuesses = buffered.tries.map((word) => ({
          word,
          result: evaluateGuess(word, solution.word),
        }));

        setGuesses(loadedGuesses);

        const lastGuess = loadedGuesses.at(-1);
        if (lastGuess?.word === solution.word) {
          setStatus(GameStates.WON);
        } else if (loadedGuesses.length >= maxAttempts) {
          setStatus(GameStates.LOST);
        } else {
          setStatus(GameStates.PLAYING);
        }
      }
    }
  }, [solution, reset, setGuesses, setStatus, maxAttempts]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      inputKey(
        e.key,
        sumots.map((s) => s.word)
      );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inputKey, sumots]);

  const isGameOver = (
    [GameStates.WON, GameStates.LOST] as GameStatesEnum[]
  ).includes(status);
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (isSmallScreen && isGameOver) {
      setShowResultModal(true);
    }
  }, [isGameOver, isSmallScreen]);

  const capitalizedFrenchDate = infiniteParam
    ? "Mode infini"
    : new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
        .format(solution?.day ? new Date(solution.day) : new Date())
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

  if (!solution || status === GameStates.LOADING) {
    return <LoadingScreen />;
  }

  const currentIndex = orderedSumots.findIndex((s) => s.day === solution.day);
  console.log({ currentIndex, orderedSumots, solution });
  const handleNavigate = (before: boolean) => {
    if (before) {
      navigate(`/?day=${orderedSumots[currentIndex + 1]?.day}`);
    } else {
      navigate(`/?day=${orderedSumots[currentIndex - 1]?.day}`);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-center flex-[0.5] mb-4 sm:mb-6 gap-4">
        {orderedSumots[currentIndex + 1] !== undefined && !infiniteParam ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-9 h-9" />
        )}

        <h3 className="text-lg font-semibold">{capitalizedFrenchDate}</h3>

        {orderedSumots[currentIndex - 1] !== undefined && !infiniteParam ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>

      <div className="flex-[8] flex flex-col sm:flex-row gap-4 w-full justify-center items-stretch">
        {isGameOver ? (
          <>
            <div className="w-full sm:w-[360px]">
              <GameScorePanel guesses={guesses} sumot={solution} />
            </div>
            {!isSmallScreen && (
              <div className="w-full sm:w-[360px]">
                <GameResultPanel solution={solution} status={status} />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col flex-1 w-full max-w-[500px] mx-auto gap-2 mt-2">
            <div className="flex-[8] flex items-center justify-center overflow-hidden">
              <Grid />
            </div>

            <div className="flex-[2] flex justify-center items-center w-full">
              <Keyboard sumots={sumots} />
            </div>
          </div>
        )}
      </div>
      <GameResultModal
        open={showResultModal}
        onClose={() => {
          setShowResultModal(false);
        }}
        status={status}
        solution={solution}
      />
    </div>
  );
}
