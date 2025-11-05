// DeviceMerchants service
import api from "../api";

export const deviceMerchantsService = {
  // TODO: ADD ENDPOINT HERE — e.g. '/DeviceMerchants/Get'
  // TODO: INJECT API_URL FROM Config.API_URL
  getDeviceMerchants: async () => {
    const response = await api.get("/DeviceMerchants/Get");
    return response.data;
  },
};
