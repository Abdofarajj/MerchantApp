// ChargeOrders hook
// TODO: Install @tanstack/react-query dependency
import { useQuery } from "@tanstack/react-query";
import { chargeOrdersService } from "./service";

// TODO: define query keys and cache behavior here
export const useChargeOrders = () => {
  return useQuery({
    queryKey: ["chargeOrders"],
    queryFn: chargeOrdersService.getChargeOrders,
    // TODO: define query keys and cache behavior here
  });
};
