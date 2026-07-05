export interface Group {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  materials?: GroupMaterial[];
  quizzes?: GroupQuiz[];
}

export interface GroupMaterial {
  id: string;
  title: string;
  isPublished: boolean;
}

export interface GroupQuiz {
  id: string;
  title: string;
  levelNumber: number;
  isPublished: boolean;
}
