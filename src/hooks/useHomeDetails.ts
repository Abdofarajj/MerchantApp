import { useEffect, useState } from "react";
import { accountsService } from "../services/Accounts/service";
import { GetChargeOrdersResponse } from "../services/Dashboards/schema";
import { dashboardsService } from "../services/Dashboards/service";
import { createSignalRConnection } from "../services/SignalR";
import { useAuthStore } from "../store/authStore";
import { useSignalRStore } from "../store/signalR.store";

export interface DashboardData {
  balance: number;
  currency: string;
}

export const useHomeDetails = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [chargeOrders, setChargeOrders] =
    useState<GetChargeOrdersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const signalRBalance = useSignalRStore((state) => state.balance);
  const signalRConnected = useSignalRStore((state) => state.connected);
  const { userInfo, setUserInfo, token } = useAuthStore();

  useEffect(() => {
    if (!userInfo && token) {
      (async () => {
        try {
          const data = await accountsService.getUserInfo();
          setUserInfo(data);
        } catch (e) {
          console.warn("Unable to load user info", e);
        }
      })();
    }
  }, [token, userInfo, setUserInfo]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Start SignalR connection
        try {
          await createSignalRConnection();
        } catch (signalRError) {
          console.warn("Failed to start SignalR connection:", signalRError);
          // Don't fail the whole dashboard load if SignalR fails
        }

        // Fetch charge orders
        try {
          const chargeOrdersData = await dashboardsService.getChargeOrders();
          setChargeOrders(chargeOrdersData);
        } catch (chargeOrdersError) {
          console.warn("Failed to fetch charge orders:", chargeOrdersError);
          // Don't fail the whole dashboard load if charge orders fail
        }

        // Wait for userInfo to be available
        if (userInfo) {
          const realData: DashboardData = {
            balance: userInfo.cardBalance,
            currency: "د.ل",
          };
          setData(realData);
        } else {
          setError("معلومات المستخدم غير متوفرة");
        }
      } catch {
        setError("فشل في جلب البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo) {
      fetchDashboard();
    }
  }, [userInfo]);

  return {
    data,
    isLoading,
    error,
    signalRBalance,
    signalRConnected,
    chargeOrders,
  };
};
