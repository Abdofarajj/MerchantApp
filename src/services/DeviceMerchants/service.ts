// DeviceMerchants service
import api from "../api";
import {
  ActivationRequest,
  ActivationResponse,
  DeviceMerchant,
  DeviceMerchantArray,
} from "./schema";

export const deviceMerchantsService = {
  // GET /DeviceMerchants/GetByMerchant
  getDeviceMerchants: async (): Promise<DeviceMerchantArray> => {
    const response = await api.get("/DeviceMerchants/GetByMerchant");
    return response.data;
  },

  // GET /DeviceMerchants/GetById/{id}
  getDeviceMerchantById: async (id: number): Promise<DeviceMerchant> => {
    const response = await api.get(`/DeviceMerchants/GetById/${id}`);
    return response.data;
  },

  // POST /DeviceMerchants/Active
  activateDeviceMerchant: async (
    data: ActivationRequest
  ): Promise<ActivationResponse> => {
    const response = await api.post("/DeviceMerchants/Active", data);
    return response.data;
  },

  // POST /DeviceMerchants/DisActive
  deactivateDeviceMerchant: async (
    data: ActivationRequest
  ): Promise<ActivationResponse> => {
    const response = await api.post("/DeviceMerchants/DisActive", data);
    return response.data;
  },
};
