/* -----------------------------------------------------------------------------
 * MODO FAKE DE SESSÃO (sem backend)
 * -----------------------------------------------------------------------------
 * Implementação FALSA do `sessionService` para navegar pelo template sem uma API.
 * Aceita qualquer credencial válida pelo schema, gera um token fake no
 * secure-store e um usuário derivado do e-mail. Não use em produção.
 *
 * COMO PLUGAR O BACKEND REAL:
 *   1. Apague daqui até "FIM DO MODO FAKE".
 *   2. Descomente o bloco "IMPLEMENTAÇÃO REAL" no fim do arquivo.
 *   3. Apague `fakeSession.ts` (vizinho).
 *   4. Garanta que `EXPO_PUBLIC_API_URL` aponta para o backend.
 * -------------------------------------------------------------------------- */

import type { IUser } from "@/types/user/types";

import {
  clearFakeSession,
  readFakeSession,
  writeFakeSession,
} from "./fakeSession";
import { clearSessionToken, setSessionToken } from "./sessionToken";
import type {
  ISessionResponse,
  ISignInService,
  ISignUpService,
  IValidateResponse,
} from "./types";

function deriveNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? "Usuário";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function buildUser({ name, email }: { name: string; email: string }): IUser {
  return {
    id: `fake-${email.replace(/[^a-zA-Z0-9]/g, "")}`,
    name,
    email,
    image: null,
  };
}

async function signIn({ email }: ISignInService): Promise<ISessionResponse> {
  const user = buildUser({ name: deriveNameFromEmail(email), email });
  await setSessionToken(`fake-token-${user.id}`);
  await writeFakeSession(user);
  return { user };
}

async function signUp({
  name,
  email,
}: ISignUpService): Promise<ISessionResponse> {
  const user = buildUser({ name, email });
  await setSessionToken(`fake-token-${user.id}`);
  await writeFakeSession(user);
  return { user };
}

async function signOut(): Promise<void> {
  await clearSessionToken();
  await clearFakeSession();
}

async function validate(): Promise<IValidateResponse> {
  const user = await readFakeSession();
  if (!user) {
    throw new Error("Sessão ausente.");
  }
  return { user };
}

export const sessionService = {
  signIn,
  signUp,
  signOut,
  validate,
};

/* ----------------------------- FIM DO MODO FAKE ----------------------------- */

/* -----------------------------------------------------------------------------
 * IMPLEMENTAÇÃO REAL (descomente ao plugar o backend)
 * -----------------------------------------------------------------------------
 * import { api } from "@/services/api";
 * import { clearSessionToken, setSessionToken } from "./sessionToken";
 * import type {
 *   ISessionResponse,
 *   ISignInService,
 *   ISignUpService,
 *   IValidateResponse,
 * } from "./types";
 *
 * async function signIn(data: ISignInService): Promise<ISessionResponse> {
 *   const response = await api.post<ISessionResponse & { token: string }>(
 *     "/session/login",
 *     data,
 *   );
 *   await setSessionToken(response.token);
 *   return { user: response.user };
 * }
 *
 * async function signUp(data: ISignUpService): Promise<ISessionResponse> {
 *   const response = await api.post<ISessionResponse & { token: string }>(
 *     "/session/register",
 *     data,
 *   );
 *   await setSessionToken(response.token);
 *   return { user: response.user };
 * }
 *
 * async function signOut(): Promise<void> {
 *   await api.post("/session/logout").catch(() => undefined);
 *   await clearSessionToken();
 * }
 *
 * async function validate(): Promise<IValidateResponse> {
 *   return api.get<IValidateResponse>("/users/me");
 * }
 *
 * export const sessionService = { signIn, signUp, signOut, validate };
 * -------------------------------------------------------------------------- */
