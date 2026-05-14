export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    LOGIN_ID: `${API_URL}/auth/login-id`,
    LOGOUT: `${API_URL}/auth/logout`,
    ME: `${API_URL}/auth/me`,
    REFRESH: `${API_URL}/auth/refresh`,
    LOGOUT_ALL: `${API_URL}/auth/logout/all`,
  },
  USERS: {
    LIST: `${API_URL}/users`,
    CREATE: `${API_URL}/users`,
    GET_BY_ID: (id: string) => `${API_URL}/users/${id}`,
    UPDATE: (id: string) => `${API_URL}/users/${id}`,
    DELETE: (id: string) => `${API_URL}/users/${id}`,
  },
  RBAC: {
    ROLES_OPTIONS: `${API_URL}/rbac/roles/options`,
    ROLES_LIST: `${API_URL}/rbac/roles`,
    ROLES_GET_BY_ID: (id: string) => `${API_URL}/rbac/roles/${id}`,
    ROLES_CREATE: `${API_URL}/rbac/roles`,
    ROLES_UPDATE: (id: string) => `${API_URL}/rbac/roles/${id}`,
    ROLES_DELETE: (id: string) => `${API_URL}/rbac/roles/${id}`,
    ROLES_ME: `${API_URL}/rbac/roles/me`,
    FEATURES: `${API_URL}/rbac/features`,
  },
  DASHBOARD: {
    LIST: `${API_URL}/dashboard`,
  },
  MATERIALS: {
    LIST: `${API_URL}/materials`,
    GET_BY_ID: (id: string) => `${API_URL}/materials/${id}`,
    CREATE: `${API_URL}/materials/me`,
    UPDATE: (id: string) => `${API_URL}/materials/${id}`,
    DELETE: (id: string) => `${API_URL}/materials/${id}`,
  },
};
