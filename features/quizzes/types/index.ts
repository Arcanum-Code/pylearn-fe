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
  quizLevelId: string;
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

export type QuizLevelStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface MyQuizLevelStatus {
  levelId: string;
  title: string;
  levelOrder: number;
  status: QuizLevelStatus;
  currentAttemptId: string | null;
  totalQuestions: number;
}

export interface MyQuizAttemptHistory {
  id: string;
  submittedAt: string | null;
  createdAt: string;
}

export interface MyQuizStatusData {
  quizId: string;
  levels: MyQuizLevelStatus[];
  attemptHistory: MyQuizAttemptHistory[];
}

export interface QuizAttemptResultBlank {
  keywordId: string;
  blankOrder: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizAttemptResultDetail {
  questionId: string;
  questionText: string;
  maxScore: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  blanks?: QuizAttemptResultBlank[];
}

export interface QuizAttemptResultData {
  attemptId: string;
  quizLevelId: string;
  quizTitle: string;
  levelTitle: string;
  score: number;
  startedAt: string;
  submittedAt: string;
  details: QuizAttemptResultDetail[];
}

export interface StudentQuizOverviewResult {
  attemptId: string;
  quizLevelId: string;
  quizTitle: string;
  levelTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  startedAt: string;
  submittedAt: string;
}

// Parameter penayangan filter di UI / React Query Keys
export interface QuizResultsFilters {
  quizLevelId?: string;
  studentId?: string;
}

export type ApiQuizzesResponse = ApiResponse<Quiz[]>;
export type ApiQuestionsResponse = ApiResponse<QuizQuestion[]>;
export type ApiAttemptResponse = ApiResponse<QuizAttempt[]>;
export type ApiAnswerResponse = ApiResponse<QuizAnswer[]>;
export type ApiQuestionAttemptsResponse = ApiResponse<QuizQuestionAttempt[]>;
export type ApiBulkAnswersResponse = ApiResponse<QuizAnswer[]>;
export type ApiMyQuizStatusResponse = ApiResponse<MyQuizStatusData>;
export type ApiQuizAttemptResultResponse = ApiResponse<QuizAttemptResultData>;
export type ApiAllQuizResultsResponse = ApiResponse<
  StudentQuizOverviewResult[]
>;

export * from "./lecturer-quiz";
export * from "./student-quiz";

