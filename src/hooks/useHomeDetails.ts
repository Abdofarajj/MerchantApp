import { useEffect, useState } from "react";
import { accountsService } from "../services/Accounts/service";
import { useDeviceMerchants } from "../services/DeviceMerchants/hook";
import { DeviceMerchant } from "../services/DeviceMerchants/schema";
import { createSignalRConnection } from "../services/SignalR";
import { useAuthStore } from "../store/authStore";
import { useSignalRStore } from "../store/signalR.store";

export interface DashboardData {
  balance: number;
  currency: string;
  pendingRequests: number;
  devices: DeviceMerchant[];
}

export const useHomeDetails = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const signalRBalance = useSignalRStore((state) => state.balance);
  const signalRConnected = useSignalRStore((state) => state.connected);
  const { userInfo, setUserInfo, token } = useAuthStore();

  // Fetch device merchants data
  const {
    data: deviceMerchants,
    isLoading: devicesLoading,
    error: devicesError,
  } = useDeviceMerchants();

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

        // Mock API call for other data - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data - devices will be populated from API
        const mockData: DashboardData = {
          balance: 1500, // Mock balance value
          currency: "$",
          pendingRequests: 12,
          devices: [],
        };

        setData(mockData);
      } catch {
        setError("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Update devices when deviceMerchants data is available
  useEffect(() => {
    if (deviceMerchants && data && deviceMerchants.length > 0) {
      setData((prevData) => ({
        ...prevData!,
        devices: deviceMerchants,
      }));
    }
  }, [deviceMerchants]);

  return { data, isLoading, error, signalRBalance, signalRConnected };
};
