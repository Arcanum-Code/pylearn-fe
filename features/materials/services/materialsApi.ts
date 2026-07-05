import { ApiAxios } from "@utils/axios";
import { Material } from "../types";
import {
  MaterialFilters,
  MaterialsResponse,
  ApiMaterialsResponse,
} from "../types";
import {
  CreateMaterialRequest,
  UpdateMaterialRequest,
} from "../schemas/materialSchema";

export async function fetchMaterials(
  filters: Partial<MaterialFilters>,
): Promise<MaterialsResponse> {
  const params: Record<string, string | number | boolean> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.lecturerId) params.lecturerId = filters.lecturerId;
  if (filters.groupId) params.groupId = filters.groupId;
  if (filters.materialType) params.materialType = filters.materialType;
  if (filters.isPublished !== undefined)
    params.isPublished = filters.isPublished;

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
  data: CreateMaterialRequest | FormData,
): Promise<{ material: Material; message: string }> {
  const { data: result } = await ApiAxios.post<{
    data: Material;
    message: string;
  }>("/materials/me", data, {
    headers: {
      ...(data instanceof FormData && {
        "Content-Type": "multipart/form-data",
      }),
    },
  });

  return {
    material: result.data,
    message: result.message,
  };
}

export async function updateMaterial(
  id: string,
  data: UpdateMaterialRequest | FormData,
): Promise<{ material: Material; message: string }> {
  let payload: unknown;

  if (data instanceof FormData) {
    payload = data;
  } else {
    // Jika data berupa objek JSON biasa, lakukan mapping properti seperti semula
    const cleanPayload: Record<string, unknown> = {};
    if (data.lecturerId !== undefined)
      cleanPayload.lecturerId = data.lecturerId;
    if (data.title !== undefined) cleanPayload.title = data.title;
    if (data.description !== undefined)
      cleanPayload.description = data.description;
    if (data.content !== undefined) cleanPayload.content = data.content;
    if (data.sourceUrl !== undefined) cleanPayload.sourceUrl = data.sourceUrl;
    if (data.iconName !== undefined) cleanPayload.iconName = data.iconName;
    if (data.isPublished !== undefined)
      cleanPayload.isPublished = data.isPublished;

    payload = cleanPayload;
  }

  // 2. Eksekusi PATCH request dengan header dinamis jika mendeteksi FormData
  const { data: result } = await ApiAxios.patch<{
    data: Material;
    message: string;
  }>(`/materials/${id}`, payload, {
    headers: {
      ...(data instanceof FormData && {
        "Content-Type": "multipart/form-data",
      }),
    },
  });

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
