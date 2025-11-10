import { updateSumotHistories } from "@/api/sumots/addSumotHistories/UpdateSumotHistories";

export interface LocalSumotHistory {
  word: string;
  tries: string[];
  won: boolean;
}

const STORAGE_KEY = "sumot_histories_buffer";

export function getBufferedSumotHistories(): LocalSumotHistory[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function upsertBufferedSumotHistory(entry: LocalSumotHistory): void {
  const current = getBufferedSumotHistories().filter(
    (h) => h.word !== entry.word
  );

  current.push(entry);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function clearBufferedSumotHistories(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveBufferedSumotHistories(
  histories: LocalSumotHistory[]
): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(histories));
}

export function getBufferedSumotHistoryByWord(
  word: string
): LocalSumotHistory | undefined {
  const current = getBufferedSumotHistories();
  return current.find((h) => h.word === word);
}

export function updateBufferedSumotHistory(entry: LocalSumotHistory): void {
  const current = getBufferedSumotHistories();
  const index = current.findIndex((h) => h.word === entry.word);

  if (index !== -1) {
    current[index] = entry;
  } else {
    current.push(entry);
  }

  saveBufferedSumotHistories(current);
}

export async function handleGuessHistory(
  word: string,
  tries: string[],
  won: boolean
) {
  const token = localStorage.getItem("access_token");

  const history = { word, tries, won };

  if (token) {
    await updateSumotHistories({ histories: [history] });
  } else {
    upsertBufferedSumotHistory(history);
  }
}

export async function flushBufferedHistoriesIfAny() {
  const buffered = getBufferedSumotHistories();
  if (buffered.length === 0) return;

  await updateSumotHistories({ histories: buffered });
  clearBufferedSumotHistories();
}
