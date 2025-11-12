import { useQuery } from "@tanstack/react-query";
import { DeviceMerchantArray } from "../services/DeviceMerchants/schema";
import { deviceMerchantsService } from "../services/DeviceMerchants/service";

/**
 * Custom hook to fetch POS device details
 * Makes a GET request to /DeviceMerchants/GetByMerchant
 *
 * @returns Query result with device merchant data, loading state, and error handling
 */
export const usePosDetails = () => {
  const query = useQuery<DeviceMerchantArray>({
    queryKey: ["posDetails"],
    queryFn: () => {
      console.log("🔍 usePosDetails: Fetching POS device data...");
      return deviceMerchantsService.getDeviceMerchants();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Log query state changes
  console.log("📊 usePosDetails: Query state:", {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isSuccess: query.isSuccess,
    isError: query.isError,
  });

  return query;
};
