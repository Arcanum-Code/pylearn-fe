import { ApiErrorResponse, ApiResponse } from "@/lib/types";

export type { ApiErrorResponse };

export interface QuizLevel {
  id: string;
  quizId: string;
  title: string;
  levelOrder: number;
  createdAt: string;
  updatedAt: string;
  quizTitle?: string;
}

export interface Quiz {
  id: string;
  materialId: string;
  material: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  levels: QuizLevel[];
}

export interface QuizQuestion {
  id: string;
  quizLevelId: string;
  quizLevelTitle: string;
  quizId: string;
  quizTitle: string;
  questionText: string;
  answerText: string;
  maxScore: number;
  questionOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestionAttempt {
  id: string;
  quizLevelId: string;
  questionText: string;
  maxScore: number;
  questionOrder: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizLevelId?: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAnswer {
  id: string;
  quizAttemptId: string;
  quizQuestionId: string;
  questionText: string;
  answerText: string;
  isCorrect: boolean | null;
  answeredAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ApiQuizzesResponse = ApiResponse<Quiz[]>;
export type ApiQuestionsResponse = ApiResponse<QuizQuestion[]>;
export type ApiAttemptResponse = ApiResponse<QuizAttempt[]>;
export type ApiAnswerResponse = ApiResponse<QuizAnswer[]>;
export type ApiQuestionAttemptsResponse = ApiResponse<QuizQuestionAttempt[]>;
export type ApiBulkAnswersResponse = ApiResponse<QuizAnswer[]>;
