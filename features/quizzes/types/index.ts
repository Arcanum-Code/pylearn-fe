import { ApiErrorResponse } from "@/lib/types";

export type { ApiErrorResponse };

export interface Level {
  id: string;
  title: string;
  materialId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  levelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiLevelsResponse extends ApiErrorResponse {
  data: Level[];
}

export interface ApiQuizzesResponse extends ApiErrorResponse {
  data: Quiz[];
}
