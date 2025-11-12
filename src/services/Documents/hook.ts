// Documents hook
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetByAccountRequest,
  PaginationRequest,
  ReceiptChargeRequest,
} from "./schema";
import { documentsService } from "./service";

// Query hooks
export const useGetByDocument = (id: number) => {
  return useQuery({
    queryKey: ["documents", "byDocument", id],
    queryFn: () => documentsService.getByDocument(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetByAccount = (data: GetByAccountRequest) => {
  return useQuery({
    queryKey: ["documents", "byAccount", data],
    queryFn: () => documentsService.getByAccount(data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAllReceiptCharge = (data: PaginationRequest) => {
  return useQuery({
    queryKey: ["documents", "receiptCharge", data],
    queryFn: () => documentsService.getAllReceiptCharge(data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAllReceiptReCharge = (data: PaginationRequest) => {
  return useQuery({
    queryKey: ["documents", "receiptReCharge", data],
    queryFn: () => documentsService.getAllReceiptReCharge(data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAllReferenceDevice = (data: PaginationRequest) => {
  return useQuery({
    queryKey: ["documents", "referenceDevice", data],
    queryFn: () => documentsService.getAllReferenceDevice(data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetReceiptDocumentById = (id: number) => {
  return useQuery({
    queryKey: ["documents", "receiptDocument", id],
    queryFn: () => documentsService.getReceiptDocumentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useReceiptCharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReceiptChargeRequest) =>
      documentsService.receiptCharge(data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useReceiptReCharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReceiptChargeRequest) =>
      documentsService.receiptReCharge(data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useReferenceDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => documentsService.referenceDevice(id),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};
