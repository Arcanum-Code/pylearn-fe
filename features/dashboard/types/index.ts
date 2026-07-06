import { ApiResponse } from "@/lib/types";

export interface DashboardUserDistribution {
  roleName: string;
  count: number;
}

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
  totalFeatures: number;
  userDistribution: DashboardUserDistribution[];
}

export interface DashboardResponse {
  data: DashboardData;
}

export interface ApiDashboardResponse {
  error: boolean;
  code: number;
  message: string;
  data: DashboardData;
}

export interface LecturerDashboardData {
  overview: {
    totalMaterials: number;
    totalQuizzes: number;
    totalStudentAttempts: number;
  };
  groupsOverview?: {
    groupId: string;
    groupName: string;
    totalStudents: number;
    avgPassRate: number;
    totalStudentAttempts: number;
  }[];
  materialBreakdown: {
    materialId: string;
    title: string;
    materialType: string;
    quizCount: number;
    levelCount: number;
    uniqueStudentsEngaged: number;
  }[];
}

export interface StudentDashboardData {
  overview: {
    totalAttempts: number;
    quizzesCompleted: number;
  };
  inProgress: {
    attemptId: string;
    quizId: string;
    quizTitle: string;
    startedAt: string;
  }[];
  recentResults: {
    attemptId: string;
    quizId: string;
    quizTitle: string;
    submittedAt: string;
  }[];
}

export type UserDistributionData = DashboardUserDistribution;
export type ApiLecturerDashboardResponse = ApiResponse<LecturerDashboardData>;
export type ApiStudentDashboardResponse = ApiResponse<StudentDashboardData>;

export interface GroupData {
  id: string;
  name: string;
  description?: string;
}

export interface GroupSummaryData {
  group_id: string;
  total_students: number;
  avg_materials_read: number;
  total_materials: number;
  avg_pass_rate: number;
  pass_rate_trend: {
    current_week: number;
    previous_week: number;
    delta: number;
  };
  generated_at: string;
}

export interface QuizHealthData {
  quiz_id: string;
  level: number;
  title: string;
  first_attempt_pass_rate: number;
  avg_attempts_to_pass: number;
  flag: string | null;
}

export interface MaterialHealthData {
  material_id: string;
  title: string;
  read_rate: number;
  flag: string | null;
}

export interface ContentHealthData {
  quizzes: QuizHealthData[];
  materials: MaterialHealthData[];
}

export type ApiGroupsResponse = ApiResponse<GroupData[]>;
export type ApiGroupSummaryResponse = ApiResponse<GroupSummaryData>;
export type ApiContentHealthResponse = ApiResponse<ContentHealthData>;

export interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  type: "quiz_open" | "quiz_close" | "material_release";
  title: string;
  targetId: string;
  groupId: string;
}

export interface RecentActivity {
  id: string;
  studentName: string;
  taskName: string;
  submittedAt: string;
  score: number;
  groupId: string;
}

export type ApiCalendarEventsResponse = ApiResponse<CalendarEvent[]>;
export type ApiRecentActivityResponse = ApiResponse<RecentActivity[]>;
