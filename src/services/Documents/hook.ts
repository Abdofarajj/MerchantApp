// Documents hook
// TODO: Install @tanstack/react-query dependency
import { useQuery } from "@tanstack/react-query";
import { documentsService } from "./service";

// TODO: define query keys and cache behavior here
export const useDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: documentsService.getDocuments,
    // TODO: define query keys and cache behavior here
  });
};
