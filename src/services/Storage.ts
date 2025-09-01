import localforage from "localforage";

localforage.config({
  name: "sumot-app",
  storeName: "sumots-storage",
  description: "Stockage des sumots et des historiques pour le jeu",
});

export async function setItem<T>(key: string, value: T): Promise<void> {
  await localforage.setItem<T>(key, value);
}

export async function getItem<T>(key: string): Promise<T | null> {
  return await localforage.getItem<T>(key);
}

export async function removeItem(key: string): Promise<void> {
  await localforage.removeItem(key);
}

export async function clear(): Promise<void> {
  await localforage.clear();
}

export default localforage;
