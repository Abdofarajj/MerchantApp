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

export const GetUsersResponseSchema = UsersSchema;

export type GetUsersDeviceResponse = z.infer<typeof GetUsersResponseSchema>;
