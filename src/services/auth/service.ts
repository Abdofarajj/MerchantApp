import { useAuthStore } from "../../store/authStore";
import api from "../api";
import { accountsService } from "../Accounts/service";

// TODO: ADD ENDPOINT HERE — e.g. '/auth/login'
// NOTE: refresh() must update tokens in authStore

export const handleLoginSuccess = async () => {
  const { setUserInfo } = useAuthStore.getState();
  try {
    const data = await accountsService.getUserInfo();
    setUserInfo(data);
  } catch (error) {
    console.warn("Failed to fetch user info:", error);
  }
};

export const login = async (username: string, password: string) => {
  const response = await api.post("/Accounts/Login", {
    userName: username,
    password,
    isRemmeber: true,
  });
  // Update store with tokens
  useAuthStore.getState().setToken(response.data.accessToken);
  useAuthStore.getState().setRefreshToken(response.data.refreshToken);
  useAuthStore.getState().setSignedIn(true);

  // Fetch and set user info after successful login
  await handleLoginSuccess();

  return response.data;
};

export const refresh = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  const userId = useAuthStore.getState().userId;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await api.post("/Accounts/RefreshToken", {
    userId: userId || "", // Use stored userId or empty string
    refreshToken,
  });

  // Update tokens in authStore
  useAuthStore.getState().setToken(response.data.accessToken);
  useAuthStore.getState().setRefreshToken(response.data.refreshToken);
  return response.data;
};

export const logout = async () => {
  await api.post("/Accounts/Logout");
  // Clear store on logout
  useAuthStore.getState().logout();
};
