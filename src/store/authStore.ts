import { create } from "zustand";

interface AuthState {
  isSignedIn: boolean;
  username: string;
  setSignedIn: (signedIn: boolean) => void;
  setUsername: (username: string) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isSignedIn: false,
  username: "",

  setSignedIn: (signedIn: boolean) => {
    set({ isSignedIn: signedIn });
    console.log("AuthStore: isSignedIn set to", signedIn);
  },

  setUsername: (username: string) => {
    set({ username });
  },

  login: async (username: string, password: string) => {
    // Mock login - replace with actual API call
    if (username && password) {
      set({ username, isSignedIn: true });
      console.log("AuthStore: Login successful for user:", username);
    } else {
      throw new Error("Username and password are required");
    }
  },

  logout: () => {
    set({ isSignedIn: false, username: "" });
    console.log("AuthStore: User logged out");
  },
}));
