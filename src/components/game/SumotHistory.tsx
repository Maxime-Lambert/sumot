import type { Sumot } from "@/types/Sumot";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchInitialSumots,
  updateSumotsFromDate,
} from "@/api/sumots/getAllSumots/GetAllSumots";
import {
  getSumotHistories,
  type GetSumotHistoriesResponse,
} from "@/api/sumots/getSumotHistories/GetSumotHistories";
import { getBufferedSumotHistoryByWord } from "@/services/SumotHistoryStorage";
import { getItem } from "@/services/Storage";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getUsernameFromToken } from "@/services/GetUserIdFromToken";
import LoadingScreen from "./LoadingScreen";

interface PlayerHistory {
  day: string;
  status: "won" | "lost" | "started" | "notPlayed";
}

export function SumotHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Sumot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [playerHistory, setPlayerHistory] = useState<
    Record<string, PlayerHistory>
  >({});

  useEffect(() => {
    async function load() {
      const local = await getItem("sumots:all");
      const loaded: Sumot[] = local
        ? await updateSumotsFromDate()
        : await fetchInitialSumots();

      const filtered = loaded
        .filter((s) => s.day)
        .sort((a, b) => (a.day! < b.day! ? 1 : -1));

      setHistory(filtered);
      setLoading(false);
    }
    void load();
  }, []);

  useEffect(() => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const minDate = startOfMonth.toISOString().split("T")[0];
    const maxDate = endOfMonth.toISOString().split("T")[0];

    const token = localStorage.getItem("access_token");
    if (token) {
      const fetch = async () => {
        const histories = await getSumotHistories({
          MinDate: minDate,
          MaxDate: maxDate,
        });
        const username = getUsernameFromToken(token);
        const playerHistories = histories.filter(
          (h) => h.username === username
        );

        const mapped: Record<string, PlayerHistory> = {};

        playerHistories.forEach((h: GetSumotHistoriesResponse) => {
          const sumot = history.find((s) => s.word === h.word);
          if (!sumot?.day) return;

          let status: PlayerHistory["status"] = "notPlayed";
          if (h.tries.length > 0 && h.won) {
            status = "won";
          } else if (h.tries.length > 0 && !h.won) {
            status = h.tries.length >= 6 ? "lost" : "started";
          }

          mapped[sumot.day] = { day: sumot.day, status };
        });

        setPlayerHistory(mapped);
      };

      void fetch();
    } else {
      const mapped: Record<string, PlayerHistory> = {};
      history.forEach((sumot) => {
        const local = getBufferedSumotHistoryByWord(sumot.word);
        if (local) {
          let status: PlayerHistory["status"] = "notPlayed";
          if (local.tries.length > 0 && local.won) {
            status = "won";
          } else if (local.tries.length > 0 && !local.won) {
            status = local.tries.length >= 6 ? "lost" : "started";
          }
          mapped[sumot.day!] = { day: sumot.day!, status };
        }
      });
      setPlayerHistory(mapped);
    }
  }, [currentMonth, history]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (history.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500">
        Aucun historique disponible.
      </p>
    );
  }

  const formatMonthYear = (date: Date) =>
    new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    })
      .format(date)
      .replace(/^\w/, (c) => c.toUpperCase());

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  const totalDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const startDay = startOfMonth.getDay() === 0 ? 7 : startOfMonth.getDay();

  const monthHistory = history.filter((s) => {
    const d = new Date(s.day!);
    return (
      d.getMonth() === currentMonth.getMonth() &&
      d.getFullYear() === currentMonth.getFullYear()
    );
  });

  const days: (Sumot | null)[] = [];
  for (let i = 1; i < startDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      d
    );
    const dayStr = date.toLocaleDateString("fr-CA");
    const match = monthHistory.find((s) => s.day === dayStr);
    days.push(
      match ?? ({ day: dayStr, word: "", isDifficult: false } as Sumot)
    );
  }

  const getDayClass = (s: Sumot) => {
    const status = playerHistory[s.day!]?.status ?? "notPlayed";
    switch (status) {
      case "won":
        return "bg-cell-background-correct text-cell-foreground-correct border-cell-border-default";
      case "lost":
        return "bg-error text-error-foreground border-cell-border-default";
      case "started":
        return "bg-cell-background-almost text-cell-foreground-almost border-cell-border-default";
      default:
        return s.word
          ? "bg-cell-background-default text-cell-foreground-default border-cell-border-default"
          : "bg-background text-cell-foreground-missing border-cell-border-default";
    }
  };

  return (
    <div className="flex flex-col bg-primary-container border border-primary-container-border items-center w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Historique des Sumots
      </h2>

      <div className="flex justify-between items-center w-full mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h3 className="text-lg font-semibold">
          {formatMonthYear(currentMonth)}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-medium text-primary-container-foreground mb-2 w-full">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 w-full">
        {days.map((s, i) =>
          s ? (
            <button
              key={i}
              onClick={() => s.word && navigate(`/?day=${s.day}`)}
              className={`aspect-square rounded flex items-center justify-center ${getDayClass(
                s
              )}`}
            >
              {new Date(s.day!).getDate()}
            </button>
          ) : (
            <div key={i} className="aspect-square" />
          )
        )}
      </div>
    </div>
  );
}
