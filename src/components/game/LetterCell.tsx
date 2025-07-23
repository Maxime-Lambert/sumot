import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  LetterStates,
  type LetterStateEnum,
} from "../../types/enums/LetterStateEnum";
import {
  ColorBlindMode,
  type ColorBlindModeEnum,
} from "../../types/enums/ColorBlindModeEnum";

type LetterCellProps = {
  letter: string;
  status: LetterStateEnum;
  preview: boolean;
  isActive: boolean;
  willFlip: boolean;
  delay: number;
  animationTime: number;
  colorblindMode: ColorBlindModeEnum;
  column: number;
  setActiveColIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function LetterCell(props: LetterCellProps) {
  const [flip, setFlip] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);
  const isColorblind = props.colorblindMode === ColorBlindMode.ACTIVE;

  useEffect(() => {
    if (props.willFlip) {
      const t = setTimeout(() => {
        setFlip(true);
        setTimeout(() => {
          setHasFlipped(true);
        }, props.animationTime);
      }, props.delay);

      return () => clearTimeout(t);
    }
  }, [props.willFlip, props.delay, props.animationTime]);

  const getColorState = () => {
    switch (props.status) {
      case LetterStates.CORRECT:
        return isColorblind
          ? "bg-colorblind-correct text-white"
          : "bg-correct text-white";
      case LetterStates.PRESENT:
        return isColorblind
          ? "bg-colorblind-almost text-white"
          : "bg-almost text-white";
      case LetterStates.MISSING:
        return "bg-surface text-accent";
      default:
        return "bg-primary text-white";
    }
  };

  const getColorPlaying = () => {
    return props.preview ? "bg-primary text-accent" : "bg-primary text-white";
  };

  return (
    <div className="w-16 aspect-square perspective-1000">
      <div
        className={clsx(
          "relative w-full h-full transition-transform transform-style-preserve-3d",
          flip ? "rotate-x-180" : "rotate-x-0"
        )}
        style={{
          transitionDelay: `${props.delay}ms`,
          transitionDuration: `${props.animationTime}ms`,
        }}
        onClick={() => props.setActiveColIndex(props.column)}
      >
        <div
          className={clsx(
            "absolute w-full h-full flex items-center justify-center border border-accent rounded backface-hidden",
            hasFlipped ? getColorState() : getColorPlaying(),
            props.isActive
              ? isColorblind
                ? "border border-colorblind-correct"
                : "border border-correct"
              : "",
            "text-2xl font-bold"
          )}
          style={{ transform: "rotateX(0deg)" }}
        >
          {props.letter}
        </div>
        <div
          className={clsx(
            "absolute w-full h-full flex items-center justify-center border border-accent rounded backface-hidden",
            hasFlipped ? getColorState() : getColorPlaying(),
            props.isActive
              ? isColorblind
                ? "border border-colorblind-correct"
                : "border border-correct"
              : "",
            "text-2xl font-bold"
          )}
          style={{ transform: "rotateX(180deg)" }}
        >
          {props.letter}
        </div>
      </div>
    </div>
  );
}
