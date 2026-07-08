import * as SecureStore from "expo-secure-store";

import type { IUser } from "@/types/user/types";

/**
 * Persistência do usuário fictício do modo fake (ver `sessionService`). Guardado
 * no secure-store para sobreviver a reinícios do app, imitando uma sessão real.
 * Deletar junto com o modo fake ao plugar o backend.
 */
const FAKE_USER_KEY = "fake-session-user";

export async function writeFakeSession(user: IUser): Promise<void> {
  await SecureStore.setItemAsync(FAKE_USER_KEY, JSON.stringify(user));
}

export async function readFakeSession(): Promise<IUser | null> {
  const raw = await SecureStore.getItemAsync(FAKE_USER_KEY);
  return raw ? (JSON.parse(raw) as IUser) : null;
}

export async function clearFakeSession(): Promise<void> {
  await SecureStore.deleteItemAsync(FAKE_USER_KEY);
}
