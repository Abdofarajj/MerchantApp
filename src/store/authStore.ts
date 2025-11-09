import * as SecureStore from "expo-secure-store";
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
    // Clear stored refresh token if it exists
    try {
      await SecureStore.deleteItemAsync("refreshToken");
    } catch (error) {
      console.warn("Failed to clear stored refresh token:", error);
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
      if (storedRefreshToken) {
        // Attempt to refresh the token
        const response = await fetch("/Accounts/RefreshToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: get().userId || "",
            refreshToken: storedRefreshToken,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          set({
            token: data.accessToken,
            refreshToken: data.refreshToken,
            isSignedIn: true,
            rememberMe: true,
          });
          console.log("AuthStore: Auto-login successful");
        } else {
          // Token refresh failed, clear stored token
          await SecureStore.deleteItemAsync("refreshToken");
          console.log("AuthStore: Auto-login failed, clearing stored token");
        }
      }
    } catch (error) {
      console.warn("AuthStore: Failed to initialize auth:", error);
    }
  },
}));
