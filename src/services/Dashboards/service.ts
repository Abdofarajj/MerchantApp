import api from "../api";
import {
    GetReceiptChargeByStateResponse,
    GetReceiptReChargeByStateResponse,
} from "./schema";

// TODO: INJECT API_URL FROM Config.API_URL

export const dashboardsService = {
  // Get Receipt Charge by State
  getReceiptChargeByState: async (
    id: number
  ): Promise<GetReceiptChargeByStateResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Dashboards/GetReceiptChargeByState/{id}' 
    const response = await api.get(`/Dashboards/GetReceiptChargeByState/${id}`); // id = 1 returns approved , if id = 2 not approved | giving money
    return response.data;
  },

  // Get Receipt Re-Charge by State
  getReceiptReChargeByState: async (
    id: number
  ): Promise<GetReceiptReChargeByStateResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Dashboards/GetReceiptReChargeByState/{id}'
    const response = await api.get(`/Dashboards/GetReceiptReChargeByState/${id}`); // id = 1 returns approved , if id = 2 not approved | youre collecting money
    return response.data;
  },
};
