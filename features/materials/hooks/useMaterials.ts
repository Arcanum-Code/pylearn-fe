import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMaterials, createMaterial } from "../services/materialsApi";
import { MaterialFilters, MaterialsResponse, CreateMaterialRequest } from "../types";
import { toast } from "sonner";

export const materialKeys = {
  all: ["materials"] as const,
  lists: () => [...materialKeys.all, "list"] as const,
  list: (filters: Partial<MaterialFilters>) =>
    [...materialKeys.lists(), filters] as const,
};

export function useFetchMaterials(filters: Partial<MaterialFilters>) {
  return useQuery<MaterialsResponse>({
    queryKey: materialKeys.list(filters),
    queryFn: () => fetchMaterials(filters),
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialRequest) => createMaterial(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
      toast.success(data.message || "Material created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create material");
    },
  });
}
