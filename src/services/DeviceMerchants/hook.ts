// DeviceMerchants hook
// TODO: Install @tanstack/react-query dependency
import { useQuery } from "@tanstack/react-query";
import { deviceMerchantsService } from "./service";

// TODO: define query keys and cache behavior here
export const useDeviceMerchants = () => {
  return useQuery({
    queryKey: ["deviceMerchants"],
    queryFn: deviceMerchantsService.getDeviceMerchants,
    // TODO: define query keys and cache behavior here
  });
};
