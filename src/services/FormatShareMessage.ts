import type { LetterStateEnum } from "@/types/enums/LetterStateEnum";
import type { Guess } from "@/types/Guess";

const statusToEmoji: Record<LetterStateEnum, string> = {
  none: "",
  correct: "🟩",
  present: "🟨",
  missing: "⬛",
};

const formatDateFR = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatShareMessage = (
  tries: Guess[],
  solution: string,
  day: string
) => {
  const statusesGrid = tries.map((guess) => {
    return guess.result.map((s) => statusToEmoji[s]).join("");
  });
  const missingTries = 6 - tries.length;
  if (missingTries > 0) {
    const emptyLine = Array(solution.length).fill("⬛").join("");
    for (let i = 0; i < missingTries; i++) {
      statusesGrid.push(emptyLine);
    }
  }
  const dayFr = formatDateFR(day);

  const win =
    tries.length > 0 &&
    tries[tries.length - 1].word.toLowerCase() === solution.toLowerCase();

  const messageHeader = win
    ? `SUUUUUUUUUUUU ! – Sumot du ${dayFr} trouvé en ${tries.length} essai${
        tries.length > 1 ? "s" : ""
      } 🔥`
    : `😢 Sumot du ${dayFr} pas trouvé…`;

  return `${messageHeader}\n${statusesGrid.join(
    "\n"
  )}\nViens jouer 👉 https://www.sumot.app ou télécharge Sumot sur le Play Store`;
};
