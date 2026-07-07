const isServer = typeof window === "undefined";

/**
 * On the server, we prefer an internal API URL if provided (e.g., http://backend:4000 in Docker).
 * On the client, we must use the public API URL.
 * Locally, if API_URL is not set, it falls back to NEXT_PUBLIC_API_URL.
 */
export const API_URL = isServer
  ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
  : process.env.NEXT_PUBLIC_API_URL;

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
    MAHASISWA_CALENDAR_EVENTS: (
      year: number,
      month: number,
      groupId?: string,
    ) =>
      `${API_URL}/dashboard/mahasiswa/calendar/events?year=${year}&month=${month}${groupId ? `&groupId=${groupId}` : ""}`,
    MAHASISWA_RECENT_ACTIVITY: (limit: number, groupId?: string) =>
      `${API_URL}/dashboard/mahasiswa/recent-activity?limit=${limit}${groupId ? `&groupId=${groupId}` : ""}`,
  },
  LECTURER: {
    GROUPS: `${API_URL}/groups/`,
    GROUP_SUMMARY: (groupId: string) =>
      `${API_URL}/lecturer/groups/${groupId}/dashboard/summary`,
    GROUP_CONTENT_HEALTH: (groupId: string) =>
      `${API_URL}/lecturer/groups/${groupId}/dashboard/content-health`,
    CALENDAR_EVENTS: (year: number, month: number, groupId?: string) =>
      `${API_URL}/lecturer/calendar/events?year=${year}&month=${month}${groupId ? `&groupId=${groupId}` : ""}`,
    RECENT_ACTIVITY: (limit?: number, groupId?: string) =>
      `${API_URL}/lecturer/dashboard/recent-activity?${limit ? `limit=${limit}` : ""}${groupId ? `&groupId=${groupId}` : ""}`,
  },
  GROUPS: {
    LIST: `${API_URL}/groups/`,
    CREATE: `${API_URL}/groups/`,
    DETAIL: (id: string) => `${API_URL}/groups/${id}`,
    UPDATE: (id: string) => `${API_URL}/groups/${id}`,
    DELETE: (id: string) => `${API_URL}/groups/${id}`,
    STUDENT_DETAIL: (id: string) => `${API_URL}/student/groups/mahasiswa/${id}`,
  },
  MATERIALS: {
    LIST: `${API_URL}/materials`,
    GET_BY_ID: (id: string) => `${API_URL}/materials/${id}`,
    CREATE: `${API_URL}/materials/me`,
    UPDATE: (id: string) => `${API_URL}/materials/${id}`,
    DELETE: (id: string) => `${API_URL}/materials/${id}`,
    PUBLISH: (id: string) => `${API_URL}/materials/${id}/publish`,
    LEVELS: (id: string) => `${API_URL}/materials/${id}/levels`,
    STUDENT_LIST: (groupId: string) => `${API_URL}/groups/${groupId}/materials`,
    STUDENT_DETAIL: (id: string) => `${API_URL}/student/materials/${id}`,
    STUDENT_PROGRESS: (id: string) => `${API_URL}/student/materials/${id}/progress`,
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
    GET_ATTEMPT_RESULTS: (id: string) =>
      `${API_URL}/quizzes/attempts/${id}/results`,
    GET_ALL_ATTEMPT_RESULTS: () => `${API_URL}/quizzes/attempts/results`,
  },
  LECTURER_QUIZZES: {
    LIST_BY_GROUP: (groupId: string) =>
      `${API_URL}/lecturer/groups/${groupId}/quizzes`,
    DETAIL: (quizId: string) => `${API_URL}/lecturer/quizzes/${quizId}`,
    CREATE: (groupId: string) =>
      `${API_URL}/lecturer/groups/${groupId}/quizzes`,
    UPDATE: (quizId: string) => `${API_URL}/lecturer/quizzes/${quizId}`,
    DELETE: (quizId: string) => `${API_URL}/lecturer/quizzes/${quizId}`,
    PUBLISH: (quizId: string) =>
      `${API_URL}/lecturer/quizzes/${quizId}/publish`,
    CREATE_QUESTION: (quizId: string) =>
      `${API_URL}/lecturer/quizzes/${quizId}/questions`,
    UPDATE_QUESTION: (questionId: string) =>
      `${API_URL}/lecturer/questions/${questionId}`,
    DELETE_QUESTION: (questionId: string) =>
      `${API_URL}/lecturer/questions/${questionId}`,
    REPLACE_BLANKS: (questionId: string) =>
      `${API_URL}/lecturer/questions/${questionId}/blanks`,
  },
  STORAGE: (path: string) => `/api${path.startsWith("/") ? "" : "/"}${path}`,
};
