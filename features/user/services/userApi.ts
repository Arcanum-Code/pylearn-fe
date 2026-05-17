import {
  User,
  UsersResponse,
  DeleteResponse,
  UserFilters,
  ApiUsersResponse,
  ApiUserResponse,
  ApiDeleteResponse,
  ApiRolesResponse,
} from "../types";
import { UserFormData } from "../schema/userFormSchema";
import { ApiAxios } from "@utils/axios";

export async function fetchUsers(
  filters: Partial<UserFilters>,
): Promise<UsersResponse> {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;
  if (filters.role && filters.role !== "all") params.role = filters.role;

  const { data } = await ApiAxios.get<ApiUsersResponse>("/users", { params });

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

export async function fetchUserById(id: string): Promise<User> {
  const { data } = await ApiAxios.get<ApiUserResponse>(`/users/${id}`);
  return data.data;
}

export async function deleteUser(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const { data } = await ApiAxios.delete<ApiDeleteResponse>(`/users/${id}`);

  return {
    success: !data.error,
    message: data.message,
  };
}

export async function createUser(
  data: UserFormData,
): Promise<{ user: User; message: string }> {
  const { data: result } = await ApiAxios.post<ApiUserResponse>("/users", {
    name: data.name,
    email: data.email,
    password: data.password,
    roleId: data.roleId,
    userId: data.userId,
    isActive: data.status === "active",
  });

  return {
    user: result.data,
    message: result.message,
  };
}

export async function updateUser(
  id: string,
  data: UserFormData,
): Promise<{ user: User; message: string }> {
  const payload: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    roleId: data.roleId,
    isActive: data.status === "active",
  };

  if (data.password) {
    payload.password = data.password;
  }

  // Jika data form membawa userId, sertakan ke dalam payload PATCH ke server
  if (data.userId) {
    payload.userId = data.userId;
  }

  const { data: result } = await ApiAxios.patch<ApiUserResponse>(
    `/users/${id}`,
    payload,
  );

  return {
    user: result.data,
    message: result.message,
  };
}

export async function fetchRoles(): Promise<ApiRolesResponse> {
  const { data } = await ApiAxios.get<ApiRolesResponse>("/rbac/roles/options");
  return data;
}
