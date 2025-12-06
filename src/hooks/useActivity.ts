import { useEffect, useMemo, useState } from "react";
import { useGetChargeOrdersByMerchantQuery } from "../services/ChargeOrders";
import {
  useGetAllReceiptCharge,
  useGetAllReceiptReCharge,
} from "../services/Documents";

export type ActivityTab = "الكل" | "شحن" | "تسديد" | "تصفية";

export const useActivity = (activeTab: ActivityTab) => {
  const [rechargePage, setRechargePage] = useState(1);
  const [payPage, setPayPage] = useState(1);
  const [collectPage, setCollectPage] = useState(1);

  const [rechargeItems, setRechargeItems] = useState<any[]>([]);
  const [payItems, setPayItems] = useState<any[]>([]);
  const [collectItems, setCollectItems] = useState<any[]>([]);
  // API hooks - only enabled based on activeTab
  const needsRecharge = activeTab === "الكل" || activeTab === "شحن";
  const needsPay = activeTab === "الكل" || activeTab === "تسديد";
  const needsCollect = activeTab === "الكل" || activeTab === "تصفية";

  const {
    data: rechargeData,
    isLoading: rechargeLoading,
    error: rechargeError,
    refetch: refetchRecharge,
  } = useGetChargeOrdersByMerchantQuery(
    {
      pageSize: 5,
      pageNumber: rechargePage,
    },
    {
      enabled: needsRecharge,
    }
  );

  const {
    data: payData,
    isLoading: payLoading,
    error: payError,
    refetch: refetchPay,
  } = useGetAllReceiptCharge(
    {
      pageSize: 5,
      pageNumber: payPage,
    },
    {
      enabled: needsPay,
    }
  );

  const {
    data: collectData,
    isLoading: collectLoading,
    error: collectError,
    refetch: refetchCollect,
  } = useGetAllReceiptReCharge(
    {
      pageSize: 5,
      pageNumber: collectPage,
    },
    {
      enabled: needsCollect,
    }
  );

  // Accumulate items
  useEffect(() => {
    if (rechargeData?.items) {
      setRechargeItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = rechargeData.items.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [rechargeData]);

  useEffect(() => {
    if (payData?.items) {
      setPayItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = payData.items.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [payData]);

  useEffect(() => {
    if (collectData?.items) {
      setCollectItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = collectData.items.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [collectData]);

  // Combined data based on active tab
  const combinedData = useMemo(() => {
    let items: any[] = [];

    switch (activeTab) {
      case "الكل":
        items = [
          ...rechargeItems.map((item) => ({
            ...item,
            type: "recharge",
          })),
          ...payItems.map((item) => ({ ...item, type: "pay" })),
          ...collectItems.map((item) => ({
            ...item,
            type: "collect",
          })),
        ];
        break;
      case "شحن":
        items = rechargeItems.map((item) => ({
          ...item,
          type: "recharge",
        }));
        break;
      case "تسديد":
        items = payItems.map((item) => ({
          ...item,
          type: "pay",
        }));
        break;
      case "تصفية":
        items = collectItems.map((item) => ({
          ...item,
          type: "collect",
        }));
        break;
    }

    // Group by date
    const grouped = items.reduce(
      (acc, item) => {
        const dateObj = item.chargeDate
          ? new Date(item.chargeDate)
          : new Date(item.insertDate);
        const dateKey = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      },
      {} as Record<string, any[]>
    );

    // Sort groups by date descending
    const sortedGroups = Object.keys(grouped).sort((a, b) =>
      b.localeCompare(a)
    );

    // Create sections
    const sections = sortedGroups.map((dateKey) => {
      return {
        title: dateKey,
        data: grouped[dateKey],
      };
    });

    return sections;
  }, [activeTab, rechargeItems, payItems, collectItems]);

  const isLoading = rechargeLoading || payLoading || collectLoading;
  const error = rechargeError || payError || collectError;

  const refetchAll = async () => {
    await Promise.all([refetchRecharge(), refetchPay(), refetchCollect()]);
  };

  const loadMore = () => {
    if (activeTab === "الكل") {
      if (rechargeData?.hasNextPage) setRechargePage((p) => p + 1);
      else if (payData?.hasNextPage) setPayPage((p) => p + 1);
      else if (collectData?.hasNextPage) setCollectPage((p) => p + 1);
    } else if (activeTab === "شحن" && rechargeData?.hasNextPage) {
      setRechargePage((p) => p + 1);
    } else if (activeTab === "تسديد" && payData?.hasNextPage) {
      setPayPage((p) => p + 1);
    } else if (activeTab === "تصفية" && collectData?.hasNextPage) {
      setCollectPage((p) => p + 1);
    }
  };

  return {
    combinedData,
    isLoading,
    error,
    refetchAll,
    loadMore,
  };
};
