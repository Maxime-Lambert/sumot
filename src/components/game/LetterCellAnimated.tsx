import {
  type LetterStateEnum,
  LetterStates,
} from "@/types/enums/LetterStateEnum";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { LetterCellBase } from "./LetterCellBase";
import { useGameStore } from "@/hooks/useGameStore";

type LetterCellAnimatedProps = {
  letter: string;
  letterState: LetterStateEnum;
  willFlip: boolean;
  delay: number;
  column: number;
};

export function LetterCellAnimated({
  letter,
  letterState,
  willFlip,
  delay,
  column,
}: LetterCellAnimatedProps) {
  const { letterAnimationTime } = useGameStore();
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (!willFlip) {
      setFlip(true);
      return;
    }
    const timeout = setTimeout(() => {
      setFlip(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [willFlip, delay]);

  return (
    <div className="aspect-square perspective-1000">
      <div
        className={clsx(
          "relative w-full h-full transition-transform transform-style-preserve-3d",
          flip ? "rotate-x-180" : "rotate-x-0"
        )}
        style={{
          transitionDelay: `${delay}ms`,
          transitionDuration: `${letterAnimationTime}ms`,
        }}
      >
        <div className="absolute w-full h-full backface-hidden">
          <LetterCellBase
            letter={letter}
            letterState={LetterStates.NONE}
            column={column}
          />
        </div>

        <div
          className="absolute w-full h-full backface-hidden"
          style={{ transform: "rotateX(180deg)" }}
        >
          <LetterCellBase
            letter={letter}
            letterState={letterState}
            column={column}
          />
        </div>
      </div>
    </div>
  );
}
