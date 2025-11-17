import { useQuery } from "@tanstack/react-query";
import { GetUsersDeviceResponse } from "./schema";
import usersService from "./service";

/**
 * Hook: fetch the current user's device info.
 * Usage:
 *   const { data, isLoading, error } = useGetUserDeviceQuery();
 */
export const useGetUserDeviceQuery = () => {
  return useQuery<GetUsersDeviceResponse>({
    queryKey: ["myUserDevice"],
    queryFn: async () => {
      const data = await usersService.getMyUserDevice();
      return data;
    },
    enabled: true,
  });
};

export default useGetUserDeviceQuery;