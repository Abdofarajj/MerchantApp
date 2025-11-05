import { create } from "zustand";

interface UserInfo {
  id: string;
  accountName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  accountId: number;
  distrputerId: number;
  distrputerName: string;
  cardBalance: number;
  amount: number;
}

interface AuthState {
  isSignedIn: boolean;
  username: string;
  token: string;
  refreshToken: string;
  userId: string; // Add userId for refresh token
  userInfo: UserInfo | null;
  setSignedIn: (signedIn: boolean) => void;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUserId: (userId: string) => void;
  setUserInfo: (info: UserInfo | null) => void;
  login: (username: string, password: string) => Promise<void>; // Deprecated
  logout: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isSignedIn: false,
  username: "",
  token: "",
  refreshToken: "",
  userId: "",
  userInfo: null,

  setSignedIn: (signedIn: boolean) => {
    set({ isSignedIn: signedIn });
    console.log("AuthStore: isSignedIn set to", signedIn);
  },

  setUsername: (username: string) => {
    set({ username });
  },

  setToken: (token: string) => {
    set({ token });
  },

  setRefreshToken: (refreshToken: string) => {
    set({ refreshToken });
  },

  setUserId: (userId: string) => {
    set({ userId });
  },

  setUserInfo: (info: UserInfo | null) => {
    set({ userInfo: info });
  },

  login: async (username: string, password: string) => {
    // This method is now deprecated - use the Accounts service directly
    // Keeping for backward compatibility but it should not be used
    throw new Error("Use Accounts service login instead");
  },

  logout: () => {
    set({
      isSignedIn: false,
      username: "",
      token: "",
      refreshToken: "",
      userId: "",
      userInfo: null,
    });
    console.log("AuthStore: User logged out");
  },

  signOut: () => {
    get().logout(); // TODO: IMPORTANT: ensure this store is hydrated before api requests
  },
}));
