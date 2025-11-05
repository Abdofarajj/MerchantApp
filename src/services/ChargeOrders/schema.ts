import { z } from "zod";

// TODO: ADD ZOD SCHEMA BASED ON API RESPONSE
export const ChargeOrderSchema = z.object({
  id: z.string(),
  amount: z.number(),
  // TODO: ADD ZOD SCHEMA BASED ON API RESPONSE
});

export type ChargeOrder = z.infer<typeof ChargeOrderSchema>;
