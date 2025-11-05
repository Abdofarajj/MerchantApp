// TODO: CONFIGURE PERSISTED STORAGE ADAPTER (AsyncStorage / MMKV / SecureStore)
// NOTE: Do not commit secrets; use .env and secure storage

export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    // TODO: CONFIGURE PERSISTED STORAGE ADAPTER
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    // TODO: CONFIGURE PERSISTED STORAGE ADAPTER
  },
  removeItem: async (key: string): Promise<void> => {
    // TODO: CONFIGURE PERSISTED STORAGE ADAPTER
  },
};
