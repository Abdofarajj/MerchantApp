import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  accountName: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  userName: z.string(),
  accountCode: z.string(),
  balance: z.number(),
});

export const UsersSchema = z.array(UserSchema);

export const AddUserSchema = z.object({
  deviceMerchantId: z.number(),
  displayName: z.string(),
  userName: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export const EditUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  userName: z.string(),
});

export const ResetUserDevicePasswordSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export const GetUsersResponseSchema = UsersSchema;

export const ResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

export type UserDevice = z.infer<typeof UserSchema>;
export type GetUsersDeviceResponse = z.infer<typeof GetUsersResponseSchema>;
export type AddUserPayload = z.infer<typeof AddUserSchema>;
export type GenericResponse = z.infer<typeof ResponseSchema>;
export type EditUserPayload = z.infer<typeof EditUserSchema>;
export type ResetUserDevicePasswordPayload = z.infer<typeof ResetUserDevicePasswordSchema>;
