import { z } from "zod";

// TODO: ADD ZOD SCHEMA BASED ON API RESPONSE
export const DeviceMerchantSchema = z.object({
  id: z.string(),
  deviceId: z.string(),
  // TODO: ADD ZOD SCHEMA BASED ON API RESPONSE
});

export type DeviceMerchant = z.infer<typeof DeviceMerchantSchema>;
