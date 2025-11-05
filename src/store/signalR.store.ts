import { create } from "zustand";

interface SignalRState {
  connected: boolean;
  lastPayload: any | null;
  balance: number | null;
  setConnected: (connected: boolean) => void;
  setLastPayload: (payload: any) => void;
  setBalance: (balance: number | null) => void;
  reset: () => void;
}

export const useSignalRStore = create<SignalRState>((set) => ({
  connected: false,
  lastPayload: null,
  balance: null,

  setConnected: (connected: boolean) => {
    set({ connected });
  },

  setLastPayload: (payload: any) => {
    set({ lastPayload: payload });
  },

  setBalance: (balance: number | null) => {
    set({ balance });
  },

  reset: () => {
    set({
      connected: false,
      lastPayload: null,
      balance: null,
    });
  },
}));
