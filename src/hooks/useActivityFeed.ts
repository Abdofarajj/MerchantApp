import { useInfiniteQuery } from "@tanstack/react-query";
import { chargeOrdersService } from "../services/ChargeOrders/service";
import { documentsService } from "../services/Documents/service";

export type ActivityType = 'RECHARGE' | 'PAY' | 'COLLECT';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  date: string;
  amount: number;
  isApproved: boolean;
  merchantName?: string;
  distributorName?: string;
  fromAccountName?: string;
  toAccountName?: string;
  financialItemName?: string;
  branchName?: string;
  raw: any;
}

export type ActivityTab = "الكل" | "شحن" | "تسديد" | "تصفية";

// Adapter functions
function mapChargeOrdersToActivities(items: any[]): ActivityItem[] {
  return items.map(item => ({
    id: `RECHARGE-${item.id}`,
    type: 'RECHARGE' as ActivityType,
    date: item.chargeDate || item.insertDate,
    amount: item.amount,
    isApproved: item.isApproved,
    merchantName: item.merchantName,
    distributorName: item.distrputerName,
    raw: item,
  }));
}

function mapReceiptChargesToActivities(items: any[]): ActivityItem[] {
  return items.map(item => ({
    id: `PAY-${item.id}`,
    type: 'PAY' as ActivityType,
    date: item.insertDate,
    amount: item.amount,
    isApproved: item.isApproved,
    fromAccountName: item.fromAccountName,
    toAccountName: item.toAccountName,
    financialItemName: item.financialItemName,
    branchName: item.branchName,
    raw: item,
  }));
}

function mapReceiptReChargesToActivities(items: any[]): ActivityItem[] {
  return items.map(item => ({
    id: `COLLECT-${item.id}`,
    type: 'COLLECT' as ActivityType,
    date: item.insertDate,
    amount: item.amount,
    isApproved: item.isApproved,
    fromAccountName: item.fromAccountName,
    toAccountName: item.toAccountName,
    financialItemName: item.financialItemName,
    branchName: item.branchName,
    raw: item,
  }));
}

export function useActivityFeed(activeTab: ActivityTab) {
  const pageSize = 5;

  const options = (() => {
    if (activeTab === "الكل") {
      return {
        queryKey: ["activityFeed", "all"] as const,
        queryFn: async ({ pageParam }: { pageParam: number }) => {
          const [recharge, pay, collect] = await Promise.all([
            chargeOrdersService.getChargeOrdersByMerchant({ pageSize, pageNumber: pageParam }),
            documentsService.getAllReceiptCharge({ pageSize, pageNumber: pageParam }),
            documentsService.getAllReceiptReCharge({ pageSize, pageNumber: pageParam }),
          ]);

          const allItems = [
            ...mapChargeOrdersToActivities(recharge.items),
            ...mapReceiptChargesToActivities(pay.items),
            ...mapReceiptReChargesToActivities(collect.items),
          ];

          allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const pageItems = allItems.slice(0, 5);

          return {
            items: pageItems,
            hasNextPage: (recharge.hasNextPage || pay.hasNextPage || collect.hasNextPage) && allItems.length >= 5,
            pageParam,
          };
        },
        initialPageParam: 1 as number,
        getNextPageParam: (lastPage: { items: ActivityItem[]; hasNextPage: boolean; pageParam: number }) =>
          lastPage.hasNextPage ? lastPage.pageParam + 1 : undefined,
        select: (data: any) => ({
          pages: data.pages.flatMap((page: any) => page.items),
          pageParams: data.pageParams,
        }),
      };
    }

    if (activeTab === "شحن") {
      return {
        queryKey: ["activityFeed", "recharge"] as const,
        queryFn: async ({ pageParam }: { pageParam: number }) =>
          chargeOrdersService.getChargeOrdersByMerchant({ pageSize, pageNumber: pageParam }),
        initialPageParam: 1 as number,
        getNextPageParam: (lastPage: any) => lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined,
        select: (data: any) => ({
          pages: data.pages.flatMap((page: any) => mapChargeOrdersToActivities(page.items)),
          pageParams: data.pageParams,
        }),
      };
    }

    if (activeTab === "تسديد") {
      return {
        queryKey: ["activityFeed", "pay"] as const,
        queryFn: async ({ pageParam }: { pageParam: number }) =>
          documentsService.getAllReceiptCharge({ pageSize, pageNumber: pageParam }),
        initialPageParam: 1 as number,
        getNextPageParam: (lastPage: any) => lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined,
        select: (data: any) => ({
          pages: data.pages.flatMap((page: any) => mapReceiptChargesToActivities(page.items)),
          pageParams: data.pageParams,
        }),
      };
    }

    if (activeTab === "تصفية") {
      return {
        queryKey: ["activityFeed", "collect"] as const,
        queryFn: async ({ pageParam }: { pageParam: number }) =>
          documentsService.getAllReceiptReCharge({ pageSize, pageNumber: pageParam }),
        initialPageParam: 1 as number,
        getNextPageParam: (lastPage: any) => lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined,
        select: (data: any) => ({
          pages: data.pages.flatMap((page: any) => mapReceiptReChargesToActivities(page.items)),
          pageParams: data.pageParams,
        }),
      };
    }

    throw new Error("Invalid tab");
  })();

  return useInfiniteQuery(options as any);
}