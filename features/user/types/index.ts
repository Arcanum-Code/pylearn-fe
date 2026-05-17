import { ApiErrorResponse } from "@/lib/types";

export type { ApiErrorResponse };

export interface ApiUser {
  id: string;
  email: string;
  userId: string;
  name: string;
  isActive: boolean;
  roleId: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiUsersResponse extends ApiErrorResponse {
  data: ApiUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiUserResponse extends ApiErrorResponse {
  data: ApiUser;
}

export interface ApiDeleteResponse extends ApiErrorResponse {
  data: ApiUser;
}

export interface Role {
  id: string;
  name: string;
}

export interface ApiRolesResponse extends ApiErrorResponse {
  data: Role[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type User = ApiUser;

export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface UserFilters {
  search: string;
  role: string;
  page: number;
  limit: number;
}

export type UserDialogMode = "add" | "edit" | "view";

export interface UserDialogState {
  isOpen: boolean;
  mode: UserDialogMode;
  selectedUser: User | null;
}
