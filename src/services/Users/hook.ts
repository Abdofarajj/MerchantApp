import { useMutation, useQuery } from "@tanstack/react-query";
import { AddUserPayload, GetUsersDeviceResponse } from "./schema";
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
    }
  });
}
