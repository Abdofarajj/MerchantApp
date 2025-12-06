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

// Get Charge Orders
export const useGetChargeOrdersQuery = () => {
  return useQuery({
    queryKey: ["chargeOrders"],
    queryFn: () => dashboardsService.getChargeOrders(),
  });
};

// Get Reference Device by State
export const useGetReferenceDeviceByStateQuery = (id: number) => {
  return useQuery({
    queryKey: ["referenceDeviceByState", id],
    queryFn: () => dashboardsService.getReferenceDeviceByState(id),
    enabled: !!id,
  });
};
