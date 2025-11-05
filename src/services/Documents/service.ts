// Documents service
import api from "../api";

export const documentsService = {
  // TODO: ADD ENDPOINT HERE — e.g. '/Documents/Get'
  // TODO: INJECT API_URL FROM Config.API_URL
  getDocuments: async () => {
    const response = await api.get("/Documents/Get");
    return response.data;
  },
};
