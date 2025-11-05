// DeviceMerchants hook
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivationRequest } from "./schema";
import { deviceMerchantsService } from "./service";

export const useDeviceMerchants = () => {
  return useQuery({
    queryKey: ["deviceMerchants"],
    queryFn: deviceMerchantsService.getDeviceMerchants,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeviceMerchantById = (id: number) => {
  return useQuery({
    queryKey: ["deviceMerchant", id],
    queryFn: () => deviceMerchantsService.getDeviceMerchantById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActivateDeviceMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivationRequest) =>
      deviceMerchantsService.activateDeviceMerchant(data),
    onSuccess: () => {
      // Invalidate and refetch device merchants
      queryClient.invalidateQueries({ queryKey: ["deviceMerchants"] });
    },
  });
};

export const useDeactivateDeviceMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivationRequest) =>
      deviceMerchantsService.deactivateDeviceMerchant(data),
    onSuccess: () => {
      // Invalidate and refetch device merchants
      queryClient.invalidateQueries({ queryKey: ["deviceMerchants"] });
    },
  });
};
