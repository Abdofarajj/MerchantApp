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
export const getReceiptChargeByStateResponseSchema = z.array(receiptChargeItemSchema);

// Get Receipt Re-Charge by State Response Schema
export const getReceiptReChargeByStateResponseSchema = z.array(receiptChargeItemSchema);

// Type exports
export type ReceiptChargeItem = z.infer<typeof receiptChargeItemSchema>;
export type GetReceiptChargeByStateResponse = z.infer<typeof getReceiptChargeByStateResponseSchema>;
export type GetReceiptReChargeByStateResponse = z.infer<typeof getReceiptReChargeByStateResponseSchema>;
