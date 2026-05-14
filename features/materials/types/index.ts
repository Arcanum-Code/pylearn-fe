import { ApiErrorResponse } from "@/lib/types";
import { CreateMaterialRequest } from "../schemas/materialSchema";

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

export interface MaterialsResponse {
  data: Material[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
