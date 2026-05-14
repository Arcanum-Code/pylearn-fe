import { ApiAxios } from "@utils/axios";
import { CreateMaterialRequest, UpdateMaterialRequest, Material } from "../types";
import { MaterialFilters, MaterialsResponse, ApiMaterialsResponse } from "../types";

export async function fetchMaterials(
  filters: Partial<MaterialFilters>
): Promise<MaterialsResponse> {
  const params: Record<string, string | number | boolean> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.lecturerId) params.lecturerId = filters.lecturerId;
  if (filters.materialType) params.materialType = filters.materialType;
  if (filters.isPublished !== undefined) params.isPublished = filters.isPublished;

  const { data } = await ApiAxios.get<ApiMaterialsResponse>("/materials", {
    params,
  });

  return {
    data: data.data,
    pagination: {
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    },
  };
}

export async function fetchMaterialById(id: string): Promise<Material> {
  const { data } = await ApiAxios.get<{
    data: Material;
    message: string;
  }>(`/materials/${id}`);
  return data.data;
}

export async function createMaterial(
  data: CreateMaterialRequest,
): Promise<{ material: Material; message: string }> {
  const { data: result } = await ApiAxios.post<{
    data: Material;
    message: string;
  }>("/materials/me", {
    title: data.title,
    description: data.description,
    materialType: data.materialType,
    content: data.content,
    sourceUrl: data.sourceUrl,
    iconName: data.iconName,
    isPublished: data.isPublished,
  });

  return {
    material: result.data,
    message: result.message,
  };
}

export async function updateMaterial(
  id: string,
  data: UpdateMaterialRequest,
): Promise<{ material: Material; message: string }> {
  const payload: Record<string, unknown> = {};
  if (data.lecturerId !== undefined) payload.lecturerId = data.lecturerId;
  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.content !== undefined) payload.content = data.content;
  if (data.sourceUrl !== undefined) payload.sourceUrl = data.sourceUrl;
  if (data.iconName !== undefined) payload.iconName = data.iconName;
  if (data.isPublished !== undefined) payload.isPublished = data.isPublished;

  const { data: result } = await ApiAxios.patch<{
    data: Material;
    message: string;
  }>(`/materials/${id}`, payload);

  return {
    material: result.data,
    message: result.message,
  };
}

export async function deleteMaterial(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const { data } = await ApiAxios.delete<{
    error: boolean;
    message: string;
  }>(`/materials/${id}`);

  return {
    success: !data.error,
    message: data.message,
  };
}