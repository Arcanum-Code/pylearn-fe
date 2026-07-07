import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMaterials,
  fetchMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  publishMaterial,
  updateMaterialProgress,
  fetchStudentMaterialById,
} from "../services/materialsApi";
import {
  MaterialFilters,
  MaterialsResponse,
  Material,
} from "../types";
import {
  CreateMaterialRequest,
  UpdateMaterialRequest,
} from "../schemas/materialSchema";
import { toast } from "sonner";

export const materialKeys = {
  all: ["materials"] as const,
  lists: () => [...materialKeys.all, "list"] as const,
  list: (filters: Partial<MaterialFilters>) =>
    [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, "detail"] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
};

export function useFetchMaterials(filters: Partial<MaterialFilters>) {
  return useQuery<MaterialsResponse>({
    queryKey: materialKeys.list(filters),
    queryFn: () => fetchMaterials(filters),
  });
}

export function useFetchMaterialById(id: string | null) {
  return useQuery<Material>({
    queryKey: materialKeys.detail(id || ""),
    queryFn: () => fetchMaterialById(id!),
    enabled: !!id,
  });
}

export function useFetchStudentMaterialById(id: string | null) {
  return useQuery<Material>({
    queryKey: materialKeys.detail(id || ""),
    queryFn: () => fetchStudentMaterialById(id!),
    enabled: !!id,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialRequest | FormData) =>
      createMaterial(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Materi berhasil dibuat");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat materi");
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMaterialRequest | FormData;
    }) => updateMaterial(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success(data.message || "Material updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update material");
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMaterial(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success(data.message || "Material deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete material");
    },
  });
}

export function usePublishMaterial(groupId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishMaterial(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
      // If we are in a group, we might want to invalidate the group's query too
      // The group's query key is typically ["groups", "detail", groupId]
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ["groups", "detail", groupId] });
      }
      toast.success(data.message || "Material published successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to publish material");
    },
  });
}

export function useUpdateMaterialProgress(groupId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      materialId,
      status,
      scrollPercentage,
    }: {
      materialId: string;
      status: "in_progress" | "completed";
      scrollPercentage: number;
    }) => updateMaterialProgress(materialId, { status, scrollPercentage }),
    onSuccess: (data, variables) => {
      // Invalidate material query so progress indicator is updated
      queryClient.invalidateQueries({
        queryKey: materialKeys.detail(variables.materialId),
      });
      // Invalidate student-group details query so progress percentages are updated
      if (groupId) {
        queryClient.invalidateQueries({
          queryKey: ["groups", "detail", groupId, "student"],
        });
      }
    },
  });
}

