import { z } from "zod";

// Charge Order Item Schema
export const chargeOrderItemSchema = z.object({
  id: z.number(),
  insertDate: z.string().datetime(),
  merchantId: z.number(),
  merchantName: z.string(),
  distrputerId: z.number(),
  distrputerName: z.string(),
  appUserId: z.string(),
  appUserName: z.string(),
  amount: z.number(),
  isApproved: z.boolean(),
  chargeDocumentId: z.number(),
  chargeDate: z.string().datetime(),
  updateToken: z.string().uuid(),
});

// Get Charge Orders by Merchant Request Schema
export const getChargeOrdersByMerchantRequestSchema = z.object({
  pageSize: z.number(),
  pageNumber: z.number(),
});

// Get Charge Orders by Merchant Response Schema
export const getChargeOrdersByMerchantResponseSchema = z.object({
  items: z.array(chargeOrderItemSchema),
  pageIndex: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  pageSize: z.number(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

// Get Charge Order by ID Response Schema
export const getChargeOrderByIdResponseSchema = chargeOrderItemSchema;

// Create Charge Order Request Schema
export const createChargeOrderRequestSchema = z.object({
  amount: z.number(),
});

// Create Charge Order Response Schema
export const createChargeOrderResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

// Delete Charge Order Request Schema
export const deleteChargeOrderRequestSchema = z.object({
  id: z.number(),
  updateToken: z.string().uuid(),
});

// Delete Charge Order Response Schema
export const deleteChargeOrderResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

// Type exports
export type ChargeOrderItem = z.infer<typeof chargeOrderItemSchema>;
export type GetChargeOrdersByMerchantRequest = z.infer<
  typeof getChargeOrdersByMerchantRequestSchema
>;
export type GetChargeOrdersByMerchantResponse = z.infer<
  typeof getChargeOrdersByMerchantResponseSchema
>;
export type GetChargeOrderByIdResponse = z.infer<
  typeof getChargeOrderByIdResponseSchema
>;
export type CreateChargeOrderRequest = z.infer<
  typeof createChargeOrderRequestSchema
>;
export type CreateChargeOrderResponse = z.infer<
  typeof createChargeOrderResponseSchema
>;
export type DeleteChargeOrderRequest = z.infer<
  typeof deleteChargeOrderRequestSchema
>;
export type DeleteChargeOrderResponse = z.infer<
  typeof deleteChargeOrderResponseSchema
>;
