import api from "../api";
import {
  CreateChargeOrderRequest,
  CreateChargeOrderResponse,
  DeleteChargeOrderRequest,
  DeleteChargeOrderResponse,
  GetChargeOrderByIdResponse,
  GetChargeOrdersByMerchantRequest,
  GetChargeOrdersByMerchantResponse,
} from "./schema";

// TODO: INJECT API_URL FROM Config.API_URL

export const chargeOrdersService = {
  // Get Charge Orders by Merchant
  getChargeOrdersByMerchant: async (
    data: GetChargeOrdersByMerchantRequest
  ): Promise<GetChargeOrdersByMerchantResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/ChargeOrders/GetByMerchant'
    const response = await api.post("/ChargeOrders/GetByMerchant", data);
    return response.data;
  },

  // Get Charge Order by ID
  getChargeOrderById: async (
    id: number
  ): Promise<GetChargeOrderByIdResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/ChargeOrders/GetById/{id}'
    const response = await api.get(`/ChargeOrders/GetById/${id}`);
    return response.data;
  },

  // Create Charge Order
  createChargeOrder: async (
    data: CreateChargeOrderRequest
  ): Promise<CreateChargeOrderResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/ChargeOrders/Create'
    const response = await api.post("/ChargeOrders/Create", data);
    return response.data;
  },

  // Delete Charge Order
  deleteChargeOrder: async (
    data: DeleteChargeOrderRequest
  ): Promise<DeleteChargeOrderResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/ChargeOrders/Delete'
    const response = await api.post("/ChargeOrders/Delete", data);
    return response.data;
  },
};
