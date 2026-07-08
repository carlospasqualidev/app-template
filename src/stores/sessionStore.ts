import { create } from "zustand";

import { sessionUserRef } from "@/services/api/sessionUserRef";
import { sessionService } from "@/services/session/sessionService";
import type { ISignInService, ISignUpService } from "@/services/session/types";
import type { IUser } from "@/types/user/types";

type SessionStatus =
  "idle" | "validating" | "authenticated" | "unauthenticated";

interface ISessionState {
  user: IUser | null;
  status: SessionStatus;
  isAuthenticating: boolean;
  validate: () => Promise<void>;
  signIn: (data: ISignInService) => Promise<void>;
  signUp: (data: ISignUpService) => Promise<void>;
  signOut: () => Promise<void>;
}

/** Mantém o `sessionUserRef` (usado pelo log de erros) em sincronia com o store. */
function syncUser(user: IUser | null): void {
  sessionUserRef.set(user);
}

export const useSessionStore = create<ISessionState>((set) => ({
  user: null,
  status: "idle",
  isAuthenticating: false,

  validate: async () => {
    set({ status: "validating" });
    try {
      const { user } = await sessionService.validate();
      syncUser(user);
      set({ user, status: "authenticated" });
    } catch {
      syncUser(null);
      set({ user: null, status: "unauthenticated" });
    }
  },

  signIn: async (data) => {
    set({ isAuthenticating: true });
    try {
      const { user } = await sessionService.signIn(data);
      syncUser(user);
      set({ user, status: "authenticated" });
    } finally {
      set({ isAuthenticating: false });
    }
  },

  signUp: async (data) => {
    set({ isAuthenticating: true });
    try {
      const { user } = await sessionService.signUp(data);
      syncUser(user);
      set({ user, status: "authenticated" });
    } finally {
      set({ isAuthenticating: false });
    }
  },

  signOut: async () => {
    await sessionService.signOut();
    syncUser(null);
    set({ user: null, status: "unauthenticated" });
  },
}));
