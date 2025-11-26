import api from "../api";
import { AddUserPayload, AddUserResponse, GetUsersDeviceResponse } from "./schema";

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

  addUserDevice: async (
    data: AddUserPayload
  ): Promise<AddUserResponse> => {
    const response = await api.post("/Accounts/Create", data);
    return response.data;
  }
};

export default usersService;