// ChargeOrders service
import api from "../api";

export const chargeOrdersService = {
  // TODO: ADD ENDPOINT HERE — e.g. '/ChargeOrders/Get'
  // TODO: INJECT API_URL FROM Config.API_URL
  getChargeOrders: async () => {
    const response = await api.get("/ChargeOrders/Get");
    return response.data;
  },
};
