import { z } from "zod";

// Base response schema
export const BaseResponseSchema = z.object({
  messageName: z.string(),
  isError: z.boolean(),
});

export type BaseResponse = z.infer<typeof BaseResponseSchema>;

// Receipt charge/recharge request schema
export const ReceiptChargeRequestSchema = z.object({
  distrputerId: z.number(),
  payed: z.number(),
});

export type ReceiptChargeRequest = z.infer<typeof ReceiptChargeRequestSchema>;

// Document item schema
export const DocumentItemSchema = z.object({
  id: z.number(),
  documentId: z.number(),
  merchantName: z.string(),
  deviceMerchantName: z.string(),
  cardTypeId: z.number(),
  logoCardType: z.string(),
  cardTypeName: z.string(),
  cardName: z.string(),
  qrCode: z.string(),
  serialNo: z.string(),
  secureNo: z.string(),
  inserDate: z.string(),
  phoneNumber: z.string(),
});

export type DocumentItem = z.infer<typeof DocumentItemSchema>;

// Paginated response schema
export const PaginatedResponseSchema = z.object({
  items: z.array(DocumentItemSchema),
  pageIndex: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  pageSize: z.number(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;

// Pagination request schema
export const PaginationRequestSchema = z.object({
  pageSize: z.number(),
  pageNumber: z.number(),
});

export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;

// Get by account request schema
export const GetByAccountRequestSchema = PaginationRequestSchema.extend({
  deviceId: z.number(),
});

export type GetByAccountRequest = z.infer<typeof GetByAccountRequestSchema>;

// Receipt document schema
export const ReceiptDocumentSchema = z.object({
  id: z.number(),
  insertDate: z.string(),
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

export type ReceiptDocument = z.infer<typeof ReceiptDocumentSchema>;

// Paginated receipt response schema
export const PaginatedReceiptResponseSchema = z.object({
  items: z.array(ReceiptDocumentSchema),
  pageIndex: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  pageSize: z.number(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

export type PaginatedReceiptResponse = z.infer<
  typeof PaginatedReceiptResponseSchema
>;
