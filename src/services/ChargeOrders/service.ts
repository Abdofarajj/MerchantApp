import { logger } from "../../utils/logger";
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
    logger.log("ChargeOrdersService: getChargeOrdersByMerchant request", data);
    try {
      const response = await api.post("/ChargeOrders/GetByMerchant", data);
      logger.log("ChargeOrdersService: getChargeOrdersByMerchant response", response.data);
      return response.data;
    } catch (error) {
      logger.error("ChargeOrdersService: getChargeOrdersByMerchant error", error);
      throw error;
    }
  },

  // Get Charge Order by ID
  getChargeOrderById: async (id: number): Promise<GetChargeOrderByIdResponse> => {
    logger.log("ChargeOrdersService: getChargeOrderById request", { id });
    try {
      const response = await api.get(`/ChargeOrders/GetById/${id}`);
      logger.log("ChargeOrdersService: getChargeOrderById response", response.data);
      return response.data;
    } catch (error) {
      logger.error("ChargeOrdersService: getChargeOrderById error", error);
      throw error;
    }
  },

  // Create Charge Order
  createChargeOrder: async (
    data: CreateChargeOrderRequest
  ): Promise<CreateChargeOrderResponse> => {
    logger.log("ChargeOrdersService: createChargeOrder request", data);
    try {
      const response = await api.post("/ChargeOrders/Create", data);
      logger.log("ChargeOrdersService: createChargeOrder response", response.data);
      return response.data;
    } catch (error) {
      logger.error("ChargeOrdersService: createChargeOrder error", error);
      throw error;
    }
  },

  // Delete Charge Order
  deleteChargeOrder: async (
    data: DeleteChargeOrderRequest
  ): Promise<DeleteChargeOrderResponse> => {
    logger.log("ChargeOrdersService: deleteChargeOrder request", data);
    try {
      const response = await api.post("/ChargeOrders/Delete", data);
      logger.log("ChargeOrdersService: deleteChargeOrder response", response.data);
      return response.data;
    } catch (error) {
      logger.error("ChargeOrdersService: deleteChargeOrder error", error);
      throw error;
    }
  },
};
