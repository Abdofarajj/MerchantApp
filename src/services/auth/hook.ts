import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { accountsService } from "../Accounts/service";
import api from "../api";
import { login, logout, refresh } from "./service";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({
      username,
      password,
      rememberMe,
    }: {
      username: string;
      password: string;
      rememberMe?: boolean;
    }) => login(username, password, rememberMe),
  });
};

export const useRefresh = () => {
  return useMutation({
    mutationFn: refresh,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useAutoLogin = () => {
  const { setTokens, setUserInfo, setSignedIn, setLoading, logout } = useAuthStore();

  const autoLogin = async () => {
    try {
      setLoading(true);
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const userId = await SecureStore.getItemAsync("userId");

      if (!refreshToken || !userId) {
        setLoading(false);
        return;
      }

      // Call API to refresh access token
      const response = await api.post("/Accounts/RefreshToken", {
        userId,
        refreshToken,
      });

      if (response.data?.accessToken && response.data?.refreshToken) {
        // Update Zustand store
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        // Fetch user info
        const userInfo = await accountsService.getUserInfo();
        setUserInfo(userInfo);

        // Mark as signed in
        setSignedIn(true);
        console.log("Auto-login successful");
      }
    } catch (error) {
      console.log("Auto-login failed:", error);
      // Clear invalid tokens
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userId");
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return { autoLogin };
};
