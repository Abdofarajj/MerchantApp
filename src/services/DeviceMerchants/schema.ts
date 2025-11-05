import { z } from "zod";

export const DeviceMerchantSchema = z.object({
  id: z.number(),
  merchantId: z.number(),
  merchantName: z.string(),
  deviceId: z.number(),
  deviceName: z.string(),
  serialNumber: z.string(),
  accountCode: z.string(),
  amount: z.number(),
  addressId: z.number(),
  addressName: z.string(),
  cityId: z.number(),
  cityName: z.string(),
  countryId: z.number(),
  countryName: z.string(),
  longtude: z.string(),
  linthtude: z.string(),
  amountTax: z.number(),
  deptAmountTax: z.number(),
  isActive: z.boolean(),
  updateToken: z.string(),
});

export const DeviceMerchantArraySchema = z.array(DeviceMerchantSchema);

export const ActivationRequestSchema = z.object({
  id: z.number(),
  updateToken: z.string(),
});

export const ActivationResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

export type DeviceMerchant = z.infer<typeof DeviceMerchantSchema>;
export type DeviceMerchantArray = z.infer<typeof DeviceMerchantArraySchema>;
export type ActivationRequest = z.infer<typeof ActivationRequestSchema>;
export type ActivationResponse = z.infer<typeof ActivationResponseSchema>;
