import { z } from "zod";

// Login
export const loginRequestSchema = z.object({
  userName: z.string(),
  password: z.string(),
  isRemmeber: z.boolean(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Refresh Token
export const refreshTokenRequestSchema = z.object({
  userId: z.string(),
  refreshToken: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Logout
export const logoutResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

// Get User Info
export const getUserInfoResponseSchema = z.object({
  id: z.string(),
  accountName: z.string(),
  displayName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  userName: z.string(),
  accountId: z.number(),
  distrputerId: z.number(),
  distrputerName: z.string(),
  cardBalance: z.number(),
  amount: z.number(),
});

// Get My User Device
export const getMyUserDeviceResponseSchema = z.array(
  z.object({
    id: z.string(),
    accountName: z.string(),
    displayName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    userName: z.string(),
    accountCode: z.string(),
    balance: z.number(),
  })
);

// Reset Password
export const resetPasswordRequestSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export const resetPasswordResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

// Change Password
export const changePasswordRequestSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

export const changePasswordResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

// Get Device User by Id
export const getDeviceUserByIdResponseSchema = z.object({
  id: z.string(),
  accountName: z.string(),
  displayName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  userName: z.string(),
  merchantId: z.number(),
  merchantName: z.string(),
});

// Create User
export const createUserRequestSchema = z.object({
  deviceMerchantId: z.number(),
  displayName: z.string(),
  userName: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export const createUserResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

// Edit User
export const editUserRequestSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  userName: z.string(),
});

export const editUserResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

// Delete User
export const deleteUserResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

// Type exports
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type GetUserInfoResponse = z.infer<typeof getUserInfoResponseSchema>;
export type GetMyUserDeviceResponse = z.infer<
  typeof getMyUserDeviceResponseSchema
>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;
export type ChangePasswordResponse = z.infer<
  typeof changePasswordResponseSchema
>;
export type GetDeviceUserByIdResponse = z.infer<
  typeof getDeviceUserByIdResponseSchema
>;
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type EditUserRequest = z.infer<typeof editUserRequestSchema>;
export type EditUserResponse = z.infer<typeof editUserResponseSchema>;
export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;
