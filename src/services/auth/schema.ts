import { z } from "zod";

// TODO: ADD ZOD SCHEMA BASED ON API RESPONSE

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    username: z.string(),
  }),
});

export const RefreshRequestSchema = z.object({
  refreshToken: z.string(),
});

export const RefreshResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});
