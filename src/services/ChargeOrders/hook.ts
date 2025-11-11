import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateChargeOrderRequest,
  DeleteChargeOrderRequest,
  GetChargeOrdersByMerchantRequest,
} from "./schema";
import { chargeOrdersService } from "./service";

// Get Charge Orders by Merchant
export const useGetChargeOrdersByMerchantQuery = (
  data: GetChargeOrdersByMerchantRequest
) => {
  return useQuery({
    queryKey: ["chargeOrdersByMerchant", data],
    queryFn: () => chargeOrdersService.getChargeOrdersByMerchant(data),
    enabled: !!data.pageSize && !!data.pageNumber,
  });
};

// Get Charge Order by ID
export const useGetChargeOrderByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["chargeOrder", id],
    queryFn: () => chargeOrdersService.getChargeOrderById(id),
    enabled: !!id,
  });
};

// Create Charge Order
export const useCreateChargeOrderMutation = () => {
  return useMutation({
    mutationFn: (data: CreateChargeOrderRequest) =>
      chargeOrdersService.createChargeOrder(data),
  });
};

// Delete Charge Order
export const useDeleteChargeOrderMutation = () => {
  return useMutation({
    mutationFn: (data: DeleteChargeOrderRequest) =>
      chargeOrdersService.deleteChargeOrder(data),
  });
};
