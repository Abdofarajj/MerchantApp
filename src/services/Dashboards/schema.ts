import { z } from "zod";

// Receipt Charge Item Schema
export const receiptChargeItemSchema = z.object({
  id: z.number(),
  insertDate: z.string().datetime(),
  appUserId: z.string(),
  appUserName: z.string(),
  fromAccountId: z.number(),
  fromAccountName: z.string(),
  toAccountId: z.number(),
  toAccountName: z.string(),
  amount: z.number(),
  financialItemId: z.number(),
  financialItemName: z.string(),
  branchId: z.number(),
  branchName: z.string(),
  isApproved: z.boolean(),
});

// Get Receipt Charge by State Response Schema
export const getReceiptChargeByStateResponseSchema = z.array(
  receiptChargeItemSchema
);

// Get Receipt Re-Charge by State Response Schema
export const getReceiptReChargeByStateResponseSchema = z.array(
  receiptChargeItemSchema
);

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

// Get Charge Orders Response Schema
export const getChargeOrdersResponseSchema = z.array(chargeOrderItemSchema);

// Get Reference Device by State Response Schema
export const getReferenceDeviceByStateResponseSchema = z.array(
  receiptChargeItemSchema
);

// Type exports
export type ReceiptChargeItem = z.infer<typeof receiptChargeItemSchema>;
export type GetReceiptChargeByStateResponse = z.infer<
  typeof getReceiptChargeByStateResponseSchema
>;
export type GetReceiptReChargeByStateResponse = z.infer<
  typeof getReceiptReChargeByStateResponseSchema
>;
export type ChargeOrderItem = z.infer<typeof chargeOrderItemSchema>;
export type GetChargeOrdersResponse = z.infer<
  typeof getChargeOrdersResponseSchema
>;
export type GetReferenceDeviceByStateResponse = z.infer<
  typeof getReferenceDeviceByStateResponseSchema
>;
