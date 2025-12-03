import api from "../api";
import {
  AddUserPayload,
  EditUserPayload,
  GenericResponse,
  GetUsersDeviceResponse,
  ResetUserDevicePasswordPayload,
} from "./schema";

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

  addUserDevice: async (data: AddUserPayload): Promise<GenericResponse> => {
    const response = await api.post("/Accounts/Create", data);
    return response.data;
  },

  editUserDevice: async (data: EditUserPayload): Promise<GenericResponse> => {
    const response = await api.post("/Accounts/Edit", data);
    return response.data;
  },

  deleteUserDevice: async (data: { id: string }): Promise<GenericResponse> => {
    const response = await api.delete(`/Accounts/Delete/${data.id}`);
    return response.data;
  },

  resetUserDevicePassword: async (
    data: ResetUserDevicePasswordPayload
  ): Promise<GenericResponse> => {
    const response = await api.post("/Accounts/ResetPassword", data);
    return response.data;
  },
};

export default usersService;
