import { useQuery } from "@tanstack/react-query";
import { dashboardsService } from "./service";

// Get Receipt Charge by State
export const useGetReceiptChargeByStateQuery = (id: number) => {
  return useQuery({
    queryKey: ["receiptChargeByState", id],
    queryFn: () => dashboardsService.getReceiptChargeByState(id),
    enabled: !!id,
  });
};

// Get Receipt Re-Charge by State
export const useGetReceiptReChargeByStateQuery = (id: number) => {
  return useQuery({
    queryKey: ["receiptReChargeByState", id],
    queryFn: () => dashboardsService.getReceiptReChargeByState(id),
    enabled: !!id,
  });
};
