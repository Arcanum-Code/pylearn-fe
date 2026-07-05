import { ApiErrorResponse } from "@/lib/types";

export type { ApiErrorResponse };

export type MaterialType = "text" | "file" | "video" | "link";

export interface Material {
  id: string;
  title: string;
  description?: string;
  materialType: MaterialType;
  content?: string;
  sourceUrl?: string;
  iconName?: string;
  lecturerId: string;
  lecturerName?: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialFilters {
  page: number;
  limit: number;
  lecturerId?: string;
  groupId?: string;
  materialType?: MaterialType;
  isPublished?: boolean;
}

export interface ApiMaterialsResponse extends ApiErrorResponse {
  data: Material[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateMaterialRequest {
  title: string;
  description?: string;
  materialType: MaterialType;
  content?: string;
  sourceUrl?: string;
  iconName?: string;
  isPublished: boolean;
  file?: File; // For PDF uploads
}

export type UpdateMaterialRequest = Partial<CreateMaterialRequest>;

export interface MaterialsResponse {
  data: Material[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
