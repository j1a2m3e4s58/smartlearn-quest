import type { ProgressionView, UserProfileView } from "@/types";
import { create } from "zustand";

interface UserState {
  profile: UserProfileView | null;
  progression: ProgressionView | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UserActions {
  setProfile: (profile: UserProfileView | null) => void;
  setProgression: (progression: ProgressionView | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  profile: null,
  progression: null,
  isAuthenticated: false,
  isLoading: false,

  setProfile: (profile) => set({ profile }),
  setProgression: (progression) => set({ progression }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () =>
    set({ profile: null, progression: null, isAuthenticated: false }),
}));
