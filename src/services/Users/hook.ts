import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../reactQuery";
import { AddUserPayload, EditUserPayload, GetUsersDeviceResponse, ResetPasswordPayload } from "./schema";
import usersService from "./service";

/**
 * Hook: fetch the current user's device info.
 * Usage:
 *   const { data, isLoading, error } = useGetUserDeviceQuery();
 */
export const useGetUserDeviceQuery = () => {
  return useQuery<GetUsersDeviceResponse>({
    queryKey: ["myUserDevice"],
    queryFn: () => {
      const data = usersService.getMyUserDevice();
      return data;
    },
    enabled: true,
  });
};

/**
 * Mutation: add a new user device.
 * Usage:
 *  
 */
export const useAddUserDeviceMutation = () => {
  return useMutation({
    mutationFn: (payload: AddUserPayload) =>{
    const data = usersService.addUserDevice(payload);
    return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myUserDevice"] });
    },
  });
}

/**
 * Mutation: edit an existing user device.
 * Usage:
 * useEditUserDeviceMutation({userId, displayName, userName})
 */
export const useEditUserDeviceMutation = () => {
  return useMutation({
    mutationFn: (payload: EditUserPayload) =>{
    const data = usersService.editUserDevice(payload);
    console.log("[API response]: ",data)
    return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myUserDevice"] });
    },
  });
}

export const usedeleteUserDeviceMutation = () => {
  return useMutation({
    mutationFn: (payload: {id: string}) =>{
    const data = usersService.deleteUserDevice(payload);
    return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myUserDevice"] });
    },
  })
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => {
      const data = usersService.resetUserDevicePassword(payload)
      return data
    }
  })
}