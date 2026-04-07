import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import GameResultPanel from "./GameResultPanel";
import type { GameStatesEnum } from "@/types/enums/GameStateEnum";
import type { Sumot } from "@/types/Sumot";

interface GameResultModalProps {
  open: boolean;
  onClose: () => void;
  solution?: Sumot;
  status: GameStatesEnum;
  isGameOver: boolean;
}

export default function GameResultModal({
  open,
  onClose,
  solution,
  status,
  isGameOver,
}: GameResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className="w-full max-w-md">
        <GameResultPanel
          solution={solution}
          status={status}
          isGameOver={isGameOver}
        />
      </DialogContent>
    </Dialog>
  );
}
