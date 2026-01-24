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

  const [displayPage, setDisplayPage] = useState(1);
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
        return [...newItems, ...prev];
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
        return [...newItems, ...prev];
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
        return [...newItems, ...prev];
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

    // Sort items by date descending
    items.sort((a, b) => {
      const dateA = new Date(a.chargeDate || a.insertDate);
      const dateB = new Date(b.chargeDate || b.insertDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Paginate: slice to 5 items per page
    const start = (displayPage - 1) * 5;
    const end = start + 5;
    const pageItems = items.slice(start, end);

    // Group by date
    const grouped = pageItems.reduce(
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
  }, [activeTab, rechargeItems, payItems, collectItems, displayPage]);

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

  const reset = () => {
    setRechargePage(1);
    setPayPage(1);
    setCollectPage(1);
    setRechargeItems([]);
    setPayItems([]);
    setCollectItems([]);
  };

  const resetTab = (tab: ActivityTab) => {
    if (tab === "شحن" || tab === "الكل") {
      setRechargePage(1);
      setRechargeItems([]);
    }
    if (tab === "تسديد" || tab === "الكل") {
      setPayPage(1);
      setPayItems([]);
    }
    if (tab === "تصفية" || tab === "الكل") {
      setCollectPage(1);
      setCollectItems([]);
    }
    setDisplayPage(1);
  };

  // Calculate pagination props
  const getTotalItems = () => {
    switch (activeTab) {
      case "الكل":
        return rechargeItems.length + payItems.length + collectItems.length;
      case "شحن":
        return rechargeItems.length;
      case "تسديد":
        return payItems.length;
      case "تصفية":
        return collectItems.length;
      default:
        return 0;
    }
  };

  const totalItems = getTotalItems();
  const currentPage = displayPage;
  const hasNextPage = totalItems > displayPage * 5;
  const hasPreviousPage = displayPage > 1;

  const onPageChange = (page: number) => {
    setDisplayPage(page);
    // If trying to go to next page and no more items loaded, load more
    if (page > displayPage && !hasNextPage) {
      loadMore();
    }
  };

  return {
    combinedData,
    isLoading,
    error,
    refetchAll,
    refetchRecharge,
    refetchPay,
    refetchCollect,
    loadMore,
    reset,
    resetTab,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    onPageChange,
  };
};
