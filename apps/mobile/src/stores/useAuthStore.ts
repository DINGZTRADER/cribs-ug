import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  userId: string | null;
  role: string | null;
  setSession: (token: string, userId: string, role?: string | null) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      role: null,
      setSession: (token, userId, role = null) => set({ token, userId, role }),
      clearSession: () => set({ token: null, userId: null, role: null })
    }),
    {
      name: "auth-session-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        role: state.role
      })
    }
  )
);
