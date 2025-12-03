import api from "../api";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserResponse,
  EditUserRequest,
  EditUserResponse,
  GetDeviceUserByIdResponse,
  GetMyUserDeviceResponse,
  GetUserInfoResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse
} from "./schema";

// TODO: INJECT API_URL FROM Config.API_URL

export const accountsService = {
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/Login'
    const response = await api.post("/Accounts/Login", data);
    return response.data;
  },

  // Refresh Token
  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/RefreshToken'
    const response = await api.post("/Accounts/RefreshToken", data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<LogoutResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/Logout'
    const response = await api.post("/Accounts/Logout");
    return response.data;
  },

  // Get User Info
  getUserInfo: async (): Promise<GetUserInfoResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/GetUserInfo'
    const response = await api.get("/Accounts/GetUserInfo");
    return response.data;
  },

  // Get My User Device
  getMyUserDevice: async (): Promise<GetMyUserDeviceResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/GetMyUserDevice'
    const response = await api.get("/Accounts/GetMyUserDevice");
    return response.data;
  },
  // Change Password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/ChangePassword'
    const response = await api.post("/Accounts/ChangePassword", data);
    return response.data;
  },

  // Get Device User by Id
  getDeviceUserById: async (id: string): Promise<GetDeviceUserByIdResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/GetDeviceUserById/{id}'
    const response = await api.get(`/Accounts/GetDeviceUserById/${id}`);
    return response.data;
  },

  // Create User
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/Create'
    const response = await api.post("/Accounts/Create", data);
    return response.data;
  },

  // Edit User
  editUser: async (data: EditUserRequest): Promise<EditUserResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/Edit'
    const response = await api.post("/Accounts/Edit", data);
    return response.data;
  },

  // Delete User
  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    // TODO: ADD ENDPOINT HERE — e.g. '/Accounts/Delete/{id}'
    const response = await api.delete(`/Accounts/Delete/${id}`);
    return response.data;
  },
};
