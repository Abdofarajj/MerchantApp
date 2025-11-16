import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../../store/authStore";
import { accountsService } from "../Accounts/service";
import api from "../api";

// TODO: ADD ENDPOINT HERE — e.g. '/auth/login'
// NOTE: refresh() must update tokens in authStore

export const handleLoginSuccess = async () => {
  const { setUserInfo } = useAuthStore.getState();
  try {
    const data = await accountsService.getUserInfo();
    setUserInfo(data);
    return data;
  } catch (error) {
    console.warn("Failed to fetch user info:", error);
    return null;
  }
};

export const login = async (
  username: string,
  password: string,
  rememberMe: boolean = false,
  signal?: AbortSignal
) => {
  const response = await api.post(
    "/Accounts/Login",
    {
      userName: username,
      password,
      isRemmeber: rememberMe,
    },
    { signal }
  );

  // Update store with tokens
  useAuthStore.getState().setToken(response.data.accessToken);
  useAuthStore.getState().setRefreshToken(response.data.refreshToken);
  useAuthStore.getState().setSignedIn(true);
  useAuthStore.getState().setRememberMe(rememberMe);

  // Store refresh token securely if remember me is enabled
  if (rememberMe) {
    try {
      await SecureStore.setItemAsync(
        "refreshToken",
        response.data.refreshToken
      );
    } catch (error) {
      console.warn("Failed to store refresh token:", error);
    }
  }

  // Fetch and set user info after successful login
  const userInfo = await handleLoginSuccess();

  // Store userId securely if remember me is enabled
  if (rememberMe && userInfo?.id) {
    try {
      await SecureStore.setItemAsync("userId", userInfo.id.toString());
    } catch (error) {
      console.warn("Failed to store userId:", error);
    }
  }

  return { ...response.data, userInfo };
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
  await useAuthStore.getState().logout();
};
