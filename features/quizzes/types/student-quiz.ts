export interface StudentQuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentQuizBlank {
  keywordId: string;
  blankOrder: number;
  correctAnswerLength: number;
}

export interface StudentQuizQuestionAttempt {
  id: string;
  quizId: string;
  questionText: string;
  blankQuestionText?: string;
  maxScore: number;
  questionOrder: number;
  blanks?: StudentQuizBlank[];
}

export interface StudentQuizAnswerItem {
  id: string;
  keywordId: string;
  answerText: string;
  isCorrect: boolean | null;
}

export interface StudentQuizAnswer {
  id: string;
  quizAttemptId: string;
  quizQuestionId: string;
  questionText: string;
  answerText: string;
  isCorrect: boolean | null;
  answeredAt: string;
  createdAt: string;
  updatedAt: string;
  items?: StudentQuizAnswerItem[];
}

export type StudentQuizProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface StudentQuizProgress {
  quizId: string;
  title: string;
  levelNumber: number;
  status: StudentQuizProgressStatus;
  currentAttemptId: string | null;
  totalQuestions: number;
}

export interface StudentQuizAttemptHistory {
  id: string;
  submittedAt: string | null;
  createdAt: string;
}

export interface StudentQuizStatusData {
  groupId: string;
  progress: StudentQuizProgress[];
  attemptHistory: StudentQuizAttemptHistory[];
}

export interface StudentQuizAttemptResultBlank {
  keywordId: string;
  blankOrder: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface StudentQuizAttemptResultDetail {
  questionId: string;
  questionText: string;
  maxScore: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  blanks?: StudentQuizAttemptResultBlank[];
}

export interface StudentQuizAttemptResultData {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  levelNumber: number;
  score: number;
  startedAt: string;
  submittedAt: string;
  details: StudentQuizAttemptResultDetail[];
}

export interface StudentQuizOverviewResult {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  levelNumber: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  startedAt: string;
  submittedAt: string;
}
