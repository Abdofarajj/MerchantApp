import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChangePasswordRequest,
  CreateUserRequest,
  EditUserRequest,
  LoginRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from "./schema";
import { accountsService } from "./service";

// Login
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => accountsService.login(data),
  });
};

// Refresh Token
export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: (data: RefreshTokenRequest) =>
      accountsService.refreshToken(data),
  });
};

// Logout
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: accountsService.logout,
  });
};

// Get User Info
export const useGetUserInfoQuery = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: accountsService.getUserInfo,
  });
};

// Get My User Device
export const useGetMyUserDeviceQuery = () => {
  return useQuery({
    queryKey: ["myUserDevice"],
    queryFn: accountsService.getMyUserDevice,
  });
};

// Reset Password
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      accountsService.resetPassword(data),
  });
};

// Change Password
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      accountsService.changePassword(data),
  });
};

// Get Device User by Id
export const useGetDeviceUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["deviceUser", id],
    queryFn: () => accountsService.getDeviceUserById(id),
    enabled: !!id,
  });
};

// Create User
export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => accountsService.createUser(data),
  });
};

// Edit User
export const useEditUserMutation = () => {
  return useMutation({
    mutationFn: (data: EditUserRequest) => accountsService.editUser(data),
  });
};

// Delete User
export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: (id: string) => accountsService.deleteUser(id),
  });
};
