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


export const addUserSchema = z.object({
  deviceMerchantId: z.number(),
  displayName: z.string(),
  userName: z.string(),
  password:  z.string(),
  confirmPassword:  z.string(),
})

export const addUserResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});


export const UsersSchema = z.array(UserSchema);

export const GetUsersResponseSchema = UsersSchema;

export type GetUsersDeviceResponse = z.infer<typeof GetUsersResponseSchema>;
export type AddUserPayload = z.infer<typeof addUserSchema>;
export type AddUserResponse = z.infer<typeof addUserResponseSchema>;