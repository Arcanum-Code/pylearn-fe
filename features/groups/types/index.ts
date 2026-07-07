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
