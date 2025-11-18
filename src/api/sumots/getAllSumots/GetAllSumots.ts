import axios from "../../axios";
import type { Sumot } from "../../../types/Sumot";
import type { SumotResponse } from "./SumotResponse";
import { getItem, setItem } from "@/services/Storage";
import { addVisit } from "../addVisit/AddVisit";

const STORAGE_SUMOTS_KEY = "sumots:all";
const STORAGE_UPDATE_DATE_KEY = "sumots:lastUpdate";

export async function fetchInitialSumots(): Promise<Sumot[]> {
  const response = await axios.get<SumotResponse>("/sumots");
  const sumots = Array.isArray(response.data?.sumots)
    ? response.data.sumots
    : [];

  await setItem(STORAGE_SUMOTS_KEY, JSON.stringify(sumots));
  if (sumots.length > 0) {
    await setItem(STORAGE_UPDATE_DATE_KEY, new Date().toISOString());
    await setItem("sumots:version", String(response.data.version));
  }
  return sumots;
}

export async function updateSumotsFromDate(): Promise<Sumot[]> {
  const lastUpdate = (await getItem(STORAGE_UPDATE_DATE_KEY)) as string;
  if (!lastUpdate) return [];
  const version = await getItem("sumots:version");

  const response = await axios.get<SumotResponse>("/sumots", {
    params: { day: lastUpdate.split("T")[0] },
  });
  const distantVersion = String(response.data?.version);
  if (version !== distantVersion) {
    return await fetchInitialSumots();
  }

  const updates = response.data?.sumots ?? [];
  const stored = JSON.parse(
    (await getItem(STORAGE_SUMOTS_KEY)) || "[]"
  ) as Sumot[];

  const updated = stored.map((sumot) => {
    const match = updates.find((u) => u.id === sumot.id);
    return match ?? sumot;
  });

  const missing = updates.filter((u) => !updated.some((s) => s.id === u.id));
  const newList = [...updated, ...missing];

  await setItem(STORAGE_SUMOTS_KEY, JSON.stringify(newList));
  if (updates.length > 0) {
    await addVisit({ isMobile: false });
    await setItem(STORAGE_UPDATE_DATE_KEY, new Date().toISOString());
  }

  return newList;
}
