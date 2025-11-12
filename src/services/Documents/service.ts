// Documents service
import api from "../api";
import {
  BaseResponse,
  DocumentItem,
  GetByAccountRequest,
  PaginatedReceiptResponse,
  PaginatedResponse,
  PaginationRequest,
  ReceiptChargeRequest,
  ReceiptDocument,
} from "./schema";

export const documentsService = {
  // POST /Documents/ReceiptCharge
  receiptCharge: async (data: ReceiptChargeRequest): Promise<BaseResponse> => {
    const response = await api.post("/Documents/ReceiptCharge", data);
    return response.data;
  },

  // POST /Documents/ReceiptReCharge
  receiptReCharge: async (
    data: ReceiptChargeRequest
  ): Promise<BaseResponse> => {
    const response = await api.post("/Documents/ReceiptReCharge", data);
    return response.data;
  },

  // GET /Documents/ReferenceDevice/{id}
  referenceDevice: async (id: number): Promise<BaseResponse> => {
    const response = await api.get(`/Documents/ReferenceDevice/${id}`);
    return response.data;
  },

  // GET /Documents/GetByDocument/{id}
  getByDocument: async (id: number): Promise<DocumentItem[]> => {
    const response = await api.get(`/Documents/GetByDocument/${id}`);
    return response.data;
  },

  // POST /Documents/GetByAccount
  getByAccount: async (
    data: GetByAccountRequest
  ): Promise<PaginatedResponse> => {
    const response = await api.post("/Documents/GetByAccount", data);
    return response.data;
  },

  // POST /Documents/GetAllReceiptCharge
  getAllReceiptCharge: async (
    data: PaginationRequest
  ): Promise<PaginatedReceiptResponse> => {
    const response = await api.post("/Documents/GetAllReceiptCharge", data);
    return response.data;
  },

  // POST /Documents/GetAllReceiptReCharge
  getAllReceiptReCharge: async (
    data: PaginationRequest
  ): Promise<PaginatedReceiptResponse> => {
    const response = await api.post("/Documents/GetAllReceiptReCharge", data);
    return response.data;
  },

  // POST /Documents/GetAllReferenceDevice
  getAllReferenceDevice: async (
    data: PaginationRequest
  ): Promise<PaginatedReceiptResponse> => {
    const response = await api.post("/Documents/GetAllReferenceDevice", data);
    return response.data;
  },

  // GET /Documents/GetReceiptDocumentById/{id}
  getReceiptDocumentById: async (id: number): Promise<ReceiptDocument> => {
    const response = await api.get(`/Documents/GetReceiptDocumentById/${id}`);
    return response.data;
  },
};
