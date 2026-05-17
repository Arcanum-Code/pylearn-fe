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
    DOSEN: () => `${API_URL}/dashboard/dosen`,
    MAHASISWA: () => `${API_URL}/dashboard/mahasiswa`,
  },
  MATERIALS: {
    LIST: `${API_URL}/materials`,
    GET_BY_ID: (id: string) => `${API_URL}/materials/${id}`,
    CREATE: `${API_URL}/materials/me`,
    UPDATE: (id: string) => `${API_URL}/materials/${id}`,
    DELETE: (id: string) => `${API_URL}/materials/${id}`,
    LEVELS: (id: string) => `${API_URL}/materials/${id}/levels`,
  },
  QUIZZES: {
    LIST: (materialId: string) => `${API_URL}/quizzes?materialId=${materialId}`,
    CREATE: () => `${API_URL}/quizzes`,
    DETAIL: (id: string) => `${API_URL}/quizzes/${id}`,
    UPDATE: (id: string) => `${API_URL}/quizzes/${id}`,
    DELETE: (id: string) => `${API_URL}/quizzes/${id}`,

    LEVELS: (quizId: string) => `${API_URL}/quizzes/levels/?quizId=${quizId}`,
    CREATE_LEVEL: () => `${API_URL}/quizzes/levels`,
    GET_LEVEL: (id: string) => `${API_URL}/quizzes/levels/${id}`,
    UPDATE_LEVEL: (id: string) => `${API_URL}/quizzes/levels/${id}`,
    DELETE_LEVEL: (id: string) => `${API_URL}/quizzes/levels/${id}`,

    QUESTIONS: (quizLevelId: string) =>
      `${API_URL}/quizzes/questions/?quizLevelId=${quizLevelId}`,
    GET_QUESTIONS_FOR_ATTEMPT: (quizLevelId: string) =>
      `${API_URL}/quizzes/questions/attempt?quizLevelId=${quizLevelId}`,
    CREATE_QUESTION: () => `${API_URL}/quizzes/questions`,
    UPDATE_QUESTION: (id: string) => `${API_URL}/quizzes/questions/${id}`,
    DELETE_QUESTION: (id: string) => `${API_URL}/quizzes/questions/${id}`,

    ATTEMPTS: () => `${API_URL}/quizzes/attempts/`,
    CREATE_ATTEMPT: () => `${API_URL}/quizzes/attempts`,
    GET_ATTEMPT: (id: string) => `${API_URL}/quizzes/attempts/${id}`,
    SUBMIT_ATTEMPT: (id: string) => `${API_URL}/quizzes/attempts/${id}/submit`,
    SUBMIT_BULK_ANSWERS: () => `${API_URL}/quizzes/answers/bulk`,
    GET_MY_QUIZ_STATUS: () => `${API_URL}/quizzes/attempts/status/me`,
  },
};
