import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { refresh } from "../services/auth/service";

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
  isLoading: boolean;
  username: string;
  token: string;
  refreshToken: string;
  userId: string; // Add userId for refresh token
  userInfo: UserInfo | null;
  rememberMe: boolean;
  setSignedIn: (signedIn: boolean) => void;
  setLoading: (loading: boolean) => void;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUserId: (userId: string) => void;
  setUserInfo: (info: UserInfo | null) => void;
  setRememberMe: (remember: boolean) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  login: (username: string, password: string) => Promise<void>; // Deprecated
  logout: () => void;
  signOut: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isSignedIn: false,
  isLoading: false,
  username: "",
  token: "",
  refreshToken: "",
  userId: "",
  userInfo: null,
  rememberMe: false,

  setSignedIn: (signedIn: boolean) => {
    set({ isSignedIn: signedIn });
    console.log("AuthStore: isSignedIn set to", signedIn);
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
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

  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    set({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  },

  setUserInfo: (info: UserInfo | null) => {
    set({ userInfo: info });
  },

  setRememberMe: (remember: boolean) => {
    set({ rememberMe: remember });
  },

  login: async (username: string, password: string) => {
    // This method is now deprecated - use the Accounts service directly
    // Keeping for backward compatibility but it should not be used
    throw new Error("Use Accounts service login instead");
  },

  logout: async () => {
    // Clear stored tokens if they exist
    try {
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userId");
    } catch (error) {
      console.warn("Failed to clear stored tokens:", error);
    }

    set({
      isSignedIn: false,
      username: "",
      token: "",
      refreshToken: "",
      userId: "",
      userInfo: null,
      rememberMe: false,
    });
    console.log("AuthStore: User logged out");
  },

  signOut: () => {
    get().logout(); // TODO: IMPORTANT: ensure this store is hydrated before api requests
  },

  initializeAuth: async () => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (storedRefreshToken && storedUserId) {
        // Set the stored values in the store temporarily for refresh
        set({
          refreshToken: storedRefreshToken,
          userId: storedUserId,
        });

        try {
          // Attempt to refresh the token
          const data = await refresh();
          set({
            token: data.accessToken,
            refreshToken: data.refreshToken,
            isSignedIn: true,
            rememberMe: true,
          });
          console.log("AuthStore: Auto-login successful");
        } catch (error) {
          // Token refresh failed, clear stored tokens
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("userId");
          set({
            refreshToken: "",
            userId: "",
          });
          console.log("AuthStore: Auto-login failed, clearing stored tokens");
        }
      }
    } catch {
      console.warn("AuthStore: Failed to initialize auth");
    }
  },
}));
