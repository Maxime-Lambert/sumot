import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { evaluateGuess } from "@/services/EvaluateGuess";
import { getBufferedSumotHistoryByWord } from "@/services/SumotHistoryStorage";
import { getSumotHistories } from "@/api/sumots/getSumotHistories/GetSumotHistories";
import type { Guess } from "@/types/Guess";
import type { Sumot } from "@/types/Sumot";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Clipboard, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { formatShareMessage } from "@/services/FormatShareMessage";
import { getUsernameFromToken } from "@/services/GetUserIdFromToken";
import { ThemedButton } from "../ui/themed/button";
import { LetterCellBase } from "./LetterCellBase";
import { showToast } from "@/services/ToastService";
import LoadingScreen from "./LoadingScreen";

interface GameScorePanelProps {
  sumot?: Sumot;
  guesses?: Guess[];
}

interface ScoreEntry {
  id: number;
  username: string;
  tries: string[];
  word: string;
}

export default function GameScorePanel({
  sumot,
  guesses,
}: GameScorePanelProps) {
  const [data, setData] = useState<ScoreEntry[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const infiniteMode = searchParams.has("infinite");
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!sumot) return;
    const fetch = async () => {
      if (infiniteMode) {
        setData([
          {
            id: 0,
            username: "Moi",
            tries: guesses ? guesses.map((g) => g.word) : [],
            word: sumot.word,
          },
        ]);
        setLoading(false);
        return;
      }

      if (token) {
        setUsername(getUsernameFromToken(token));
        try {
          const histories = await getSumotHistories({
            MinDate: sumot.day!,
            MaxDate: sumot.day!,
          });

          setData(
            histories.map((h) => ({
              id: h.id,
              username: h.username,
              tries: h.tries,
              word: sumot.word,
            }))
          );
        } finally {
          setLoading(false);
        }
      } else {
        const local = getBufferedSumotHistoryByWord(sumot.word);
        if (local) {
          setData([
            {
              id: 0,
              username: "Moi",
              tries: local.tries,
              word: sumot.word,
            },
          ]);
        }
        setLoading(false);
      }
    };
    void fetch();
  }, [sumot, infiniteMode, guesses, token]);

  if (!sumot) return null;

  if (loading) {
    return <LoadingScreen />;
  }

  const renderTries = (tries: string[], solution: string) => (
    <div className="space-y-2 w-full">
      {tries.map((attempt, rowIndex) => {
        const statuses = evaluateGuess(attempt, solution);
        return (
          <div
            key={rowIndex}
            className="flex justify-center gap-[0.25rem] w-full"
          >
            {attempt.split("").map((char, i) => (
              <div key={i} className="w-full max-w-[2.5rem]">
                <LetterCellBase
                  letter={char}
                  letterState={statuses[i]}
                  isActive={false}
                  error={false}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <Card className="flex flex-col bg-primary-container border border-primary-container-border text-primary-container-foreground shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">
          {!token || infiniteMode ? "Historique" : "Classement des amis"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-2 overflow-y-auto max-h-[60vh]">
        {loading ? (
          <div className="flex justify-center items-center gap-2 text-primary-container-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            Chargement...
          </div>
        ) : (
          data.length > 0 && (
            <ul className="space-y-6 mb-6">
              {data.map((entry, index) => {
                const isCurrentUser = entry.username === username;
                return (
                  <li
                    key={entry.id}
                    className="flex flex-col items-center space-y-2"
                  >
                    {username && (
                      <span
                        className={clsx(
                          "text-sm",
                          isCurrentUser
                            ? "font-bold text-primary"
                            : "text-primary-container-muted"
                        )}
                      >
                        #{index + 1} - {entry.username}
                      </span>
                    )}

                    {renderTries(entry.tries, sumot.word)}
                  </li>
                );
              })}
            </ul>
          )
        )}
      </CardContent>
      <CardFooter className="flex justify-evenly mt-4">
        <ThemedButton
          onClick={() => {
            navigate(`/?infinite=${Date.now()}`);
          }}
          icon={RefreshCw}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Rejouer
        </ThemedButton>
        <ThemedButton
          onClick={() => {
            const message = formatShareMessage(
              guesses ?? [],
              sumot.word,
              sumot.day ?? ""
            );
            navigator.clipboard.writeText(message).then(() => {
              showToast("Résultat copié dans le presse-papiers !", "success");
            });
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          icon={Clipboard}
        >
          Partager
        </ThemedButton>
      </CardFooter>
    </Card>
  );
}
