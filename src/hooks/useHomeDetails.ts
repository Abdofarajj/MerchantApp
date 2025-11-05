import { useEffect, useState } from "react";
import { accountsService } from "../services/Accounts/service";
import { createSignalRConnection } from "../services/SignalR";
import { useAuthStore } from "../store/authStore";
import { useSignalRStore } from "../store/signalR.store";

export interface DashboardData {
  balance: number;
  currency: string;
  pendingRequests: number;
  devices: POSDevice[];
}

export interface POSDevice {
  id: string;
  serialNumber: string;
  model: string;
  addressName?: string;
  status: "active" | "inactive" | "maintenance" | "offline";
}

export const useHomeDetails = () => {
  const [data, setData] = useState<DashboardData | null>(null);
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

        // Mock API call for other data - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockData: DashboardData = {
          balance: 1500, // Mock balance value
          currency: "$",
          pendingRequests: 12,
          devices: [
            {
              id: "POS-001",
              serialNumber: "SN123456789",
              model: "A75 Pro",
              addressName: "Store #5, Downtown",
              status: "active",
            },
            {
              id: "POS-002",
              serialNumber: "SN987654321",
              model: "C500",
              addressName: "Store #12, Mall",
              status: "active",
            },
            {
              id: "POS-003",
              serialNumber: "SN555666777",
              model: "A75 Pro",
              addressName: "Store #8, Uptown",
              status: "active",
            },
            {
              id: "POS-004",
              serialNumber: "SN111222333",
              model: "C500",
              addressName: "Store #8, Uptown",
              status: "inactive",
            },
          ],
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

  return { data, isLoading, error, signalRBalance, signalRConnected };
};
