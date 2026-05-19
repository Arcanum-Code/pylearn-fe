import { ApiAxios } from "@utils/axios";
import {
  Quiz,
  ApiQuizzesResponse,
  QuizLevel,
  QuizQuestion,
  QuizAttempt,
  QuizAnswer,
  QuizQuestionAttempt,
  ApiQuestionAttemptsResponse,
  ApiBulkAnswersResponse,
  ApiMyQuizStatusResponse,
  MyQuizStatusData,
  QuizAttemptResultData,
  ApiQuizAttemptResultResponse,
  QuizResultsFilters,
  StudentQuizOverviewResult,
  ApiAllQuizResultsResponse,
} from "../types";
import { ApiResponse } from "@/lib/types";
import { QuizBulkAnswersFormData } from "../schemas/quizSchema";

// # ========================================================
// # = Quiz Levels by Material
// # ========================================================

export async function getQuizLevelsByMaterialId(
  materialId: string,
): Promise<QuizLevel[]> {
  const quizzes = await getQuizzes(materialId);
  const levels: QuizLevel[] = [];

  for (const quiz of quizzes) {
    if (quiz.levels && quiz.levels.length > 0) {
      for (const level of quiz.levels) {
        levels.push({
          ...level,
          quizTitle: quiz.title,
        });
      }
    }
  }

  return levels;
}

// # ========================================================
// # = Quiz API
// # ========================================================

export async function getQuizzes(materialId: string): Promise<Quiz[]> {
  const { data: result } = await ApiAxios.get<ApiQuizzesResponse>(
    `/quizzes?materialId=${materialId}`,
  );

  return result.data;
}

export async function createQuiz(data: {
  materialId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isPublished: boolean;
}): Promise<{ quiz: Quiz; message: string }> {
  const { data: result } = await ApiAxios.post<ApiResponse<Quiz>>(
    "/quizzes",
    data,
  );

  return {
    quiz: result.data,
    message: result.message,
  };
}

export async function updateQuiz(
  id: string,
  data: {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    isPublished?: boolean;
  },
): Promise<{ quiz: Quiz; message: string }> {
  const { data: result } = await ApiAxios.patch<ApiResponse<Quiz>>(
    `/quizzes/${id}`,
    data,
  );

  return {
    quiz: result.data,
    message: result.message,
  };
}

export async function deleteQuiz(id: string): Promise<{ message: string }> {
  const { data: result } = await ApiAxios.delete<ApiResponse<any>>(
    `/quizzes/${id}`,
  );

  return {
    message: result.message,
  };
}

// # ========================================================
// # = Quiz Level API
// # ========================================================
export async function getQuizLevels(quizId: string): Promise<QuizLevel[]> {
  const { data: result } = await ApiAxios.get<ApiResponse<QuizLevel[]>>(
    `/quizzes/levels?quizId=${quizId}`,
  );

  return result.data;
}

export async function getQuizLevelById(id: string): Promise<QuizLevel> {
  const { data: result } = await ApiAxios.get<ApiResponse<QuizLevel>>(
    `/quizzes/levels/${id}`,
  );

  return result.data;
}

export async function createQuizLevel(data: {
  quizId: string;
  title: string;
  levelOrder: number;
}): Promise<{ level: QuizLevel; message: string }> {
  const { data: result } = await ApiAxios.post<ApiResponse<QuizLevel>>(
    "/quizzes/levels",
    data,
  );

  return {
    level: result.data,
    message: result.message,
  };
}

export async function updateQuizLevel(
  id: string,
  data: {
    title?: string;
    levelOrder?: number;
  },
): Promise<{ level: { id: string }; message: string }> {
  // Your PATCH response example shows it returns an object containing just the level id: { id: "string" }
  const { data: result } = await ApiAxios.patch<ApiResponse<{ id: string }>>(
    `/quizzes/levels/${id}`,
    data,
  );

  return {
    level: result.data,
    message: result.message,
  };
}

export async function deleteQuizLevel(
  id: string,
): Promise<{ message: string }> {
  const { data: result } = await ApiAxios.delete<ApiResponse<any>>(
    `/quizzes/levels/${id}`,
  );

  return {
    message: result.message,
  };
}

// # ========================================================
// # = Quiz Question API
// # ========================================================
export async function getQuizQuestions(
  quizLevelId: string,
): Promise<QuizQuestion[]> {
  console.log("GET QUIZ QUESTION: ", quizLevelId);
  const { data: result } = await ApiAxios.get<ApiResponse<QuizQuestion[]>>(
    `/quizzes/questions?quizLevelId=${quizLevelId}`,
  );

  return result.data;
}

export async function getQuizQuestionsForAttempt(
  quizLevelId: string,
): Promise<QuizQuestionAttempt[]> {
  const { data: result } = await ApiAxios.get<ApiQuestionAttemptsResponse>(
    "/quizzes/questions/attempt",
    {
      params: { quizLevelId },
    },
  );

  return result.data;
}

export async function createQuizQuestion(data: {
  quizLevelId: string;
  questionText: string;
  answerText: string;
  maxScore: number;
  questionOrder: number;
}): Promise<{ question: QuizQuestion; message: string }> {
  const { data: result } = await ApiAxios.post<ApiResponse<QuizQuestion>>(
    "/quizzes/questions",
    data,
  );

  return {
    question: result.data,
    message: result.message,
  };
}

export async function updateQuizQuestion(
  id: string,
  data: {
    questionText?: string;
    answerText?: string;
    maxScore?: number;
    questionOrder?: number;
  },
): Promise<{ question: QuizQuestion; message: string }> {
  const { data: result } = await ApiAxios.patch<ApiResponse<QuizQuestion>>(
    `/quizzes/questions/${id}`,
    data,
  );

  return {
    question: result.data,
    message: result.message,
  };
}

export async function deleteQuizQuestion(
  id: string,
): Promise<{ message: string }> {
  const { data: result } = await ApiAxios.delete<ApiResponse<any>>(
    `/quizzes/questions/${id}`,
  );

  return {
    message: result.message,
  };
}

// # ========================================================
// # = Quiz Attempt API
// # ========================================================

export async function getQuizAttempts(filters?: {
  quizId?: string;
  studentId?: string;
}): Promise<QuizAttempt[]> {
  const { data: result } = await ApiAxios.get<ApiResponse<QuizAttempt[]>>(
    "/quizzes/attempts",
    { params: filters },
  );

  return result.data;
}

export async function getQuizAttemptById(id: string): Promise<QuizAttempt> {
  const { data: result } = await ApiAxios.get<ApiResponse<QuizAttempt>>(
    `/quizzes/attempts/${id}`,
  );

  return result.data;
}

export async function createQuizAttempt(data: {
  quizLevelId: string;
}): Promise<{ attempt: QuizAttempt; message: string }> {
  const { data: result } = await ApiAxios.post<ApiResponse<QuizAttempt>>(
    "/quizzes/attempts",
    data,
  );

  return {
    attempt: result.data,
    message: result.message,
  };
}

export async function createQuizAttemptByMaterial(
  data: {
    materialId: string;
    levelId: string;
  },
  token?: string,
): Promise<{ attempt: QuizAttempt; message: string }> {
  const levels = await getQuizLevelsByMaterialId(data.materialId);
  const targetLevel = levels.find((l) => l.id === data.levelId);

  if (!targetLevel) {
    throw new Error("Level not found for this material");
  }

  const result = await createQuizAttempt({
    quizLevelId: targetLevel.id,
  });

  return result;
}

export async function submitQuizAttempt(
  id: string,
): Promise<{ attempt: QuizAttempt; message: string }> {
  const { data: result } = await ApiAxios.patch<ApiResponse<QuizAttempt>>(
    `/quizzes/attempts/${id}/submit`,
  );

  return {
    attempt: result.data,
    message: result.message,
  };
}

export async function getQuizAttemptResults(
  id: string,
): Promise<QuizAttemptResultData> {
  const { data: result } = await ApiAxios.get<ApiQuizAttemptResultResponse>(
    `/quizzes/attempts/${id}/results`,
  );

  return result.data;
}

export async function getAllQuizAttemptResults(
  filters: QuizResultsFilters,
): Promise<StudentQuizOverviewResult[]> {
  const params: Record<string, string> = {};

  // Masukkan param hanya jika nilainya terdefinisi (bukan string kosong atau undefined)
  if (filters.quizLevelId) params.quizLevelId = filters.quizLevelId;
  if (filters.studentId) params.studentId = filters.studentId;

  const { data: result } = await ApiAxios.get<ApiAllQuizResultsResponse>(
    "/quizzes/attempts/results",
    { params }, // Mengubah otomatis menjadi /quizzes/attempts/results?quizLevelId=xxx&studentId=yyy
  );

  return result.data;
}

// # ========================================================
// # = Quiz Answer API
// # ========================================================
export async function submitStudentAnswer(data: {
  quizAttemptId: string;
  quizQuestionId: string;
  answerText: string;
}): Promise<{ answer: QuizAnswer; message: string }> {
  const { data: result } = await ApiAxios.post<ApiResponse<QuizAnswer>>(
    "/quizzes/answers",
    data,
  );

  return {
    answer: result.data,
    message: result.message,
  };
}

export async function submitBulkStudentAnswers(
  data: QuizBulkAnswersFormData,
): Promise<{ answers: QuizAnswer[]; message: string }> {
  const { data: result } = await ApiAxios.post<ApiBulkAnswersResponse>(
    "/quizzes/answers/bulk",
    data,
  );

  return {
    answers: result.data,
    message: result.message,
  };
}

export async function getMyQuizStatus(
  quizId: string,
): Promise<MyQuizStatusData> {
  const { data: result } = await ApiAxios.get<ApiMyQuizStatusResponse>(
    "/quizzes/attempts/status/me",
    {
      params: { quizId },
    },
  );

  return result.data;
}
