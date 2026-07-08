export type GroupLevel = "BASIC" | "INTERMEDIATE" | "ADVANCED";

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  level?: GroupLevel | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    materials: number;
    quizzes: number;
  };
  materials?: GroupMaterial[];
  quizzes?: GroupQuiz[];
}

export interface GroupMaterial {
  id: string;
  title: string;
  isPublished: boolean;
  publishedAt?: string | null;
}

export interface GroupQuiz {
  id: string;
  title: string;
  levelNumber: number;
  isPublished: boolean;
}
export interface StudentGroupDetail {
  groupId: string;
  groupName: string;
  description: string;
  lecturerName: string;
  progress: {
    materialsCompleted: number;
    materialsTotal: number;
    percentage: number;
  };
  items: TimelineItem[];
}

export type TimelineItemType = "material" | "quiz";

export interface TimelineItem {
  type: TimelineItemType;
  id: string;
  title: string;
  description?: string | null;
  status: "completed" | "in_progress" | "not_started";
  scrollPercentage?: number | null;
  deadline?: string | null;
  bestScore?: number | null;
  order: number;
  levelNumber?: number;
}

export interface GroupStudentsSummary {
  total_students: number;
  at_risk_count: number;
  inactive_count: number;
  on_track_count: number;
  avg_class_progress: number;
  avg_class_quiz_score: number;
}

export interface GroupColumnMaterial {
  id: string;
  title: string;
  order: number;
}

export interface GroupColumnQuiz {
  id: string;
  title: string;
  level_number: number;
}

export interface StudentMaterialProgressItem {
  material_id: string;
  status: string;
  scroll_percentage: number;
  last_read_at: string | null;
}

export interface StudentQuizProgressItem {
  quiz_id: string;
  status: string;
  best_score: number | null;
  attempts_count: number;
  last_attempt_at: string | null;
}

export interface GroupStudentActivityItem {
  student_id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  status: "AT_RISK" | "INACTIVE" | "ON_TRACK" | string;
  status_reasons: string[];
  overall_progress_percentage: number;
  avg_quiz_score: number | null;
  last_active_at: string | null;
  materials_progress: StudentMaterialProgressItem[];
  quizzes_progress: StudentQuizProgressItem[];
}

export interface GroupStudentsActivityData {
  summary: GroupStudentsSummary;
  columns: {
    materials: GroupColumnMaterial[];
    quizzes: GroupColumnQuiz[];
  };
  students: GroupStudentActivityItem[];
}

export interface StudentQuizAttemptQuestionItem {
  question_id: string;
  question_text: string;
  question_type?: string | null;
  student_answer: string | null;
  correct_answer: string | null;
  is_correct: boolean;
  points_earned: number;
  points_possible: number;
  explanation?: string | null;
}

export interface StudentQuizAttemptHistoryItem {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  attempt_number: number;
  score: number;
  status: string;
  started_at: string;
  submitted_at: string;
  time_spent_seconds: number;
  questions?: StudentQuizAttemptQuestionItem[];
}

export interface StudentMaterialReadingTimelineItem {
  material_id: string;
  material_title: string;
  status: string;
  scroll_percentage: number;
  first_opened_at: string | null;
  completed_at: string | null;
}

export interface GroupStudentActivityDetailData {
  student: {
    student_id: string;
    name: string;
    email: string;
    enrolled_at: string | null;
  };
  quiz_attempts_history: StudentQuizAttemptHistoryItem[];
  material_reading_timeline: StudentMaterialReadingTimelineItem[];
}
