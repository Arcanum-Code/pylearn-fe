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

