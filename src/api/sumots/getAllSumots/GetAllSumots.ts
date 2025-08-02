import axios from "../../axios";
import type { Sumot } from "../../../types/Sumot";
import type { SumotResponse } from "./SumotResponse";

const STORAGE_SUMOTS_KEY = "sumots:all";
const STORAGE_UPDATE_DATE_KEY = "sumots:lastUpdate";

export async function fetchInitialSumots(): Promise<Sumot[]> {
  const response = await axios.get<SumotResponse>("/sumots");
  const sumots = Array.isArray(response.data?.sumots)
    ? response.data.sumots
    : [];

  localStorage.setItem(STORAGE_SUMOTS_KEY, JSON.stringify(sumots));
  localStorage.setItem(STORAGE_UPDATE_DATE_KEY, new Date().toISOString());

  return sumots;
}

export async function updateSumotsFromDate(): Promise<Sumot[]> {
  const lastUpdate = localStorage.getItem(STORAGE_UPDATE_DATE_KEY);
  if (!lastUpdate) return [];

  const response = await axios.get<SumotResponse>("/sumots", {
    params: { day: lastUpdate.split("T")[0] },
  });

  const updates = response.data?.sumots ?? [];
  const stored = JSON.parse(
    localStorage.getItem(STORAGE_SUMOTS_KEY) || "[]"
  ) as Sumot[];

  const updated = stored.map((sumot) => {
    const match = updates.find((u) => u.id === sumot.id);
    return match ?? sumot;
  });

  const missing = updates.filter((u) => !updated.some((s) => s.id === u.id));
  const newList = [...updated, ...missing];

  localStorage.setItem(STORAGE_SUMOTS_KEY, JSON.stringify(newList));
  localStorage.setItem(STORAGE_UPDATE_DATE_KEY, new Date().toISOString());

  return newList;
}
