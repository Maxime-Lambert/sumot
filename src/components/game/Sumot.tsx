import { useEffect, useMemo, useState } from "react";
import GameResultPanel from "@/components/game/GameResultPanel";
import GameScorePanel from "@/components/game/GameScorePanel";
import GameResultModal from "@/components/game/GameResultModal";
import LoadingScreen from "@/components/game/LoadingScreen";
import { GameStates } from "@/types/enums/GameStateEnum";
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

function getRandomInRange(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Sumot() {
  const {
    guesses,
    inputKey,
    reset,
    setGuesses,
    setStatus,
    status,
    solution,
    maxAttempts,
  } = useGameStore();
  const [searchParams] = useSearchParams();
  const [sumots, setSumots] = useState<Sumot[]>([]);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [hasTyped, setHasTyped] = useState(false);
  const { playsWithDifficultWords, keyboardLayout } = useSettingsStore();
  const navigate = useNavigate();
  const infiniteParam = searchParams.get("infinite");
  const dayParam = searchParams.get("day");

  const isValidDateParam = (param: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(param) && !isNaN(Date.parse(param));

  const orderedSumots = useMemo(
    () =>
      sumots.filter((s) => s.day).sort((a, b) => (a.day! < b.day! ? 1 : -1)),
    [sumots]
  );

  function applyGuesses(guesses: Guess[], match: string) {
    setGuesses(guesses);
    const lastGuess = guesses.at(-1);
    if (lastGuess?.word === match) setStatus(GameStates.WON);
    else if (guesses.length >= maxAttempts) setStatus(GameStates.LOST);
    else setStatus(GameStates.PLAYING);
  }

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
          return;
        }
        match = loaded.find(
          (s) => s.day?.toLowerCase() === dayParam.toLowerCase()
        );
      } else if (infiniteParam) {
        const pool = playsWithDifficultWords
          ? loaded
          : loaded.filter((l) => !l.isDifficult);
        match = pool.at(getRandomInRange(pool.length));
      } else {
        const today = new Date().toISOString().split("T")[0];
        match = loaded.find((s) => s.day === today);
      }

      if (!match) {
        navigate("/404", { replace: true });
        return;
      }

      setSumots(loaded);
      reset(match);

      if (infiniteParam) {
        setStatus(GameStates.PLAYING);
        return;
      }

      const token = localStorage.getItem("access_token");
      if (token) {
        const histories = await getSumotHistories({
          startDate: match.day!,
          endDate: match.day!,
        });
        const userName = getUsernameFromToken(token);
        const history = histories.find((h) => h.userName === userName);

        if (history) {
          const guesses: Guess[] = history.tries.map((word) => ({
            word,
            result: evaluateGuess(word, match.word),
          }));
          applyGuesses(guesses, match.word);
        } else {
          setStatus(GameStates.PLAYING);
        }
        return;
      }

      const buffered = getBufferedSumotHistoryByWord(match.word);
      if (buffered) {
        const guesses = buffered.tries.map((word) => ({
          word,
          result: evaluateGuess(word, match.word),
        }));
        applyGuesses(guesses, match.word);
      } else {
        setStatus(GameStates.PLAYING);
      }
    }

    setStatus(GameStates.LOADING);
    void load();
  }, [dayParam, infiniteParam, navigate]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) e.preventDefault();
      inputKey(
        e.key,
        sumots.map((s) => s.word),
        infiniteParam !== null
      );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inputKey, sumots, infiniteParam]);

  useEffect(() => {
    if (status === GameStates.REVEALING) {
      setHasTyped(true);
    }
  }, [status]);

  const isGameOver = status === GameStates.WON || status === GameStates.LOST;
  const isSmallScreen = window?.innerWidth < 768;

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
  const handleNavigate = (before: boolean) => {
    if (before) {
      navigate(`/?day=${orderedSumots[currentIndex + 1]?.day}`);
    } else {
      navigate(`/?day=${orderedSumots[currentIndex - 1]?.day}`);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full w-full">
      <div className="flex items-center justify-center gap-4 py-2">
        {orderedSumots[currentIndex + 1] !== undefined && !infiniteParam ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate(true)}
            aria-label="Jour précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-9 h-9" />
        )}

        <h3 className="text-base sm:text-lg font-semibold max-w-[60%] sm:max-w-none">
          {capitalizedFrenchDate}
        </h3>

        {orderedSumots[currentIndex - 1] !== undefined && !infiniteParam ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate(false)}
            aria-label="Jour suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>

      {isGameOver ? (
        <div className="flex flex-row items-center justify-center gap-4 w-full">
          <div className="sm:w-[360px]">
            <GameScorePanel
              isGameOver={isGameOver}
              guesses={guesses}
              sumot={solution}
            />
          </div>
          {!isSmallScreen && (
            <div className="sm:w-[360px]">
              <GameResultPanel solution={solution} status={status} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <p className="text-sm text-primary-container-foreground italic">
            {hasTyped
              ? ""
              : "Tape un mot puis valide avec Entrée pour commencer à jouer. Si tu souhaites comparer tes résultats, connecte-toi avant de jouer !"}
          </p>

          <div className="flex flex-col flex-1 w-[80%] max-w-[500px] mx-auto gap-2">
            <div className="flex items-center justify-center overflow-hidden">
              <Grid />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center py-2">
        {!isGameOver && keyboardLayout !== "Hidden" ? (
          <div className="w-full max-w-[650px]">
            <Keyboard sumots={sumots} />
          </div>
        ) : (
          <div className="h-[120px]" />
        )}
      </div>

      <GameResultModal
        open={showResultModal}
        onClose={() => setShowResultModal(false)}
        status={status}
        solution={solution}
      />
    </div>
  );
}
