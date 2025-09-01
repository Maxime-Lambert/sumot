import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DefinitionPanel from "./DefinitionPanel";
import type { Sumot } from "@/types/Sumot";
import { type GameStatesEnum, GameStates } from "@/types/enums/GameStateEnum";
import { LetterStates } from "@/types/enums/LetterStateEnum";
import { LetterCellBase } from "./LetterCellBase";

interface GameResultPanelProps {
  solution?: Sumot;
  status: GameStatesEnum;
}

export default function GameResultPanel({
  solution,
  status,
}: GameResultPanelProps) {
  const isWin = status === GameStates.WON;
  const [defReady, setDefReady] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const allReady = defReady && imgReady;

  useEffect(() => {
    setDefReady(false);
    setImgReady(false);
  }, [solution?.word, status]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) {
      setImgReady(true);
      return;
    }
    const ok = () => setImgReady(true);
    const ko = () => setImgReady(true);
    el.addEventListener("load", ok, { once: true });
    el.addEventListener("error", ko, { once: true });
    return () => {
      el.removeEventListener("load", ok);
      el.removeEventListener("error", ko);
    };
  }, [solution?.word, isWin]);

  if (!solution) return null;

  return (
    <Card className="relative flex flex-col min-h-0 bg-primary-container border border-primary-container-border text-primary-container-foreground shadow-md">
      {!allReady && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-xl bg-background/60 backdrop-blur-sm">
          <p className="text-sm text-primary-container-muted">
            Chargement du résultat…
          </p>
        </div>
      )}

      <CardContent className="flex flex-col items-center gap-4 p-6 flex-1 min-h-0 overflow-y-auto">
        <div className="flex justify-center gap-[0.5rem] w-full">
          {solution.word.split("").map((char, idx) => (
            <div key={idx} className="w-full max-w-[3.5rem]">
              <LetterCellBase
                letter={char}
                letterState={LetterStates.CORRECT}
                isActive={false}
                error={false}
                preview={false}
              />
            </div>
          ))}
        </div>

        <Separator className="my-2 bg-primary-container-border" />

        <div className="text-center space-y-2 w-full">
          <p className="text-sm font-semibold">
            {isWin ? "SUUUUUUUUUUUUUUUUUU !" : "Raté !"}
          </p>
          <img
            ref={imgRef}
            src={isWin ? "/sumot_tranquille.png" : "/sumot_venere.png"}
            alt={isWin ? "SUMOT Tranquille" : "SUMOT Vénère"}
            className="w-1/2 mx-auto h-auto object-contain"
          />
        </div>

        <DefinitionPanel
          key={solution.word}
          solution={solution}
          onReady={() => setDefReady(true)}
        />
      </CardContent>
    </Card>
  );
}
