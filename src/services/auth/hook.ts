import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
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
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
};
