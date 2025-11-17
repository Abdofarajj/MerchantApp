import api from "../api";
import { GetUsersDeviceResponse } from "./schema";

/**
 * Users API service
 */
export const usersService = {
  /**
   * Get current user's device info
   * Endpoint: GET /Accounts/GetMyUserDevice
   */
  getMyUserDevice: async (): Promise<GetUsersDeviceResponse> => {
    const response = await api.get("/Accounts/GetMyUserDevice");
    return response.data;
  },
};

export default usersService;