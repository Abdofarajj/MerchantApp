// TODO: Install @tanstack/react-query dependency
import { useMutation } from "@tanstack/react-query";
import { login, logout, refresh } from "./service";

// TODO: define query keys and cache behavior here

export const useLogin = () => {
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => login(username, password),
    // TODO: define query keys and cache behavior here
  });
};

export const useRefresh = () => {
  return useMutation({
    mutationFn: refresh,
    // TODO: define query keys and cache behavior here
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    // TODO: define query keys and cache behavior here
  });
};
