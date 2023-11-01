import { create } from 'zustand';

type AuthStore = {
    isAuthenticated: boolean;
    tokenJWT: string;
    setToken: (value: string) => void;
    setAuthenticated: (value: boolean) => void;
    logout: () => void;
};

export const AuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    tokenJWT: '',
    setAuthenticated: (value) => set({ isAuthenticated: value }),
    setToken: (value) => set({ tokenJWT: value }),
    logout: () => set({ isAuthenticated: false }),
}));
