import { create } from 'zustand';

type AuthStore = {
    isAuthenticated: boolean;
    setAuthenticated: (value: boolean) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    setAuthenticated: (value) => set({ isAuthenticated: value }),
    logout: () => set({ isAuthenticated: false }),
}));
