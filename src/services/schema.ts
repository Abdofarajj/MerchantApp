import { z } from "zod";

// TODO: Add shared validators (User, Pagination, CommonResponse)

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export const CommonResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
});
