import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

/** Armazenamento de preferências (NÃO-sensível). Token de sessão vai em expo-secure-store. */
export const preferencesStorage = createMMKV({ id: "preferences" });

/** Adaptador do MMKV para o middleware `persist` do Zustand. */
export const zustandStorage: StateStorage = {
  getItem: (name) => preferencesStorage.getString(name) ?? null,
  setItem: (name, value) => preferencesStorage.set(name, value),
  removeItem: (name) => preferencesStorage.remove(name),
};
