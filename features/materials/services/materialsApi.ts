import { ApiAxios } from "@utils/axios";
import { CreateMaterialRequest, Material } from "../types";
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
    iconName: data.iconName,
    isPublished: data.isPublished,
  });

  return {
    material: result.data,
    message: result.message,
  };
}