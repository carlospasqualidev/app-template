import type { IUser } from "@/types/user/types";

/**
 * Referência mutável e isolada do usuário autenticado.
 *
 * Existe para quebrar o ciclo de imports entre `errorHandlers` (que precisa do
 * usuário ao reportar erros) e o store de sessão (que importa serviços que, por
 * sua vez, dependem de `errorHandlers`).
 *
 * O store de sessão mantém esta referência sincronizada via `set`.
 */
let currentUser: IUser | null = null;

export const sessionUserRef = {
  set(user: IUser | null) {
    currentUser = user;
  },
  get(): IUser | null {
    return currentUser;
  },
};
