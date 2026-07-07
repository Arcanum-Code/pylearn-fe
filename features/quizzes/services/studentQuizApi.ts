import { ApiAxios } from "@utils/axios";
import { ApiResponse } from "@/lib/types";
import {
  StudentQuizAttempt,
  StudentQuizQuestionAttempt,
  StudentQuizAnswer,
  StudentQuizStatusData,
  StudentQuizAttemptResultData,
  StudentQuizOverviewResult,
} from "../types";

// 1. List Quiz Attempts
export async function getStudentQuizAttempts(filters?: {
  quizId?: string;
}): Promise<StudentQuizAttempt[]> {
  const { data: result } = await ApiAxios.get<ApiResponse<StudentQuizAttempt[]>>(
    "/student/quizzes/attempts",
    { params: filters }
  );
  return result.data;
}

// 2. Get Quiz Attempt Details
export async function getStudentQuizAttemptById(id: string): Promise<StudentQuizAttempt> {
  const { data: result } = await ApiAxios.get<ApiResponse<StudentQuizAttempt>>(
    `/student/quizzes/attempts/${id}`
  );
  return result.data;
}

// 3. Create Quiz Attempt
export async function createStudentQuizAttempt(data: {
  quizId: string;
}): Promise<{ attempt: StudentQuizAttempt; message: string }> {
  const { data: result } = await ApiAxios.post<ApiResponse<StudentQuizAttempt>>(
    "/student/quizzes/attempts",
    data
  );
  return {
    attempt: result.data,
    message: result.message,
  };
}

// 4. Submit Quiz Attempt
export async function submitStudentQuizAttempt(
  id: string
): Promise<{ attempt: StudentQuizAttempt; message: string }> {
  const { data: result } = await ApiAxios.patch<ApiResponse<StudentQuizAttempt>>(
    `/student/quizzes/attempts/${id}/submit`
  );
  return {
    attempt: result.data,
    message: result.message,
  };
}

// 5. Get Student Quiz Progress
export async function getStudentQuizProgress(
  quizId: string
): Promise<StudentQuizStatusData> {
  const { data: result } = await ApiAxios.get<ApiResponse<StudentQuizStatusData>>(
    "/student/quizzes/attempts/status/me",
    { params: { quizId } }
  );
  return result.data;
}

// 6. Get Quiz Questions for Attempt
export async function getStudentQuizQuestionsForAttempt(
  quizId: string
): Promise<StudentQuizQuestionAttempt[]> {
  const { data: result } = await ApiAxios.get<ApiResponse<StudentQuizQuestionAttempt[]>>(
    "/student/quizzes/questions/attempt",
    { params: { quizId } }
  );
  return result.data;
}

// 7. Get Quiz Answers for an Attempt
export async function getStudentQuizAnswers(
  quizAttemptId: string
): Promise<StudentQuizAnswer[]> {
  const { data: result } = await ApiAxios.get<ApiResponse<StudentQuizAnswer[]>>(
    "/student/quizzes/answers",
    { params: { quizAttemptId } }
  );
  return result.data;
}

// 8. Submit Single Quiz Answer
export async function submitStudentQuizAnswer(data: {
  quizAttemptId: string;
  quizQuestionId: string;
  answerText?: string;
  items?: { keywordId: string; answerText: string }[];
}): Promise<{ answer: StudentQuizAnswer; message: string }> {
  const { data: result } = await ApiAxios.post<ApiResponse<StudentQuizAnswer>>(
    "/student/quizzes/answers",
    data
  );
  return {
    answer: result.data,
    message: result.message,
  };
}

// 9. Update Single Quiz Answer
export async function updateStudentQuizAnswer(
  id: string,
  data: {
    answerText?: string;
    items?: { keywordId: string; answerText: string }[];
  }
): Promise<{ answer: StudentQuizAnswer; message: string }> {
  const { data: result } = await ApiAxios.patch<ApiResponse<StudentQuizAnswer>>(
    `/student/quizzes/answers/${id}`,
    data
  );
  return {
    answer: result.data,
    message: result.message,
  };
}

// 10. Submit Bulk Quiz Answers
export async function submitBulkStudentQuizAnswers(data: {
  quizId: string;
  quizAttemptId: string;
  answers: {
    quizQuestionId: string;
    answerText?: string;
    items?: { keywordId: string; answerText: string }[];
  }[];
}): Promise<{ answers: StudentQuizAnswer[]; message: string }> {
  const { data: result } = await ApiAxios.post<ApiResponse<StudentQuizAnswer[]>>(
    "/student/quizzes/answers/bulk",
    data
  );
  return {
    answers: result.data,
    message: result.message,
  };
}

// 11. Get All Attempts Summary Results
export async function getStudentQuizResultsSummary(filters?: {
  quizId?: string;
  studentId?: string;
}): Promise<StudentQuizOverviewResult[]> {
  const { data: result } = await ApiAxios.get<ApiResponse<StudentQuizOverviewResult[]>>(
    "/student/quizzes/attempts/results",
    { params: filters }
  );
  return result.data;
}

// 12. Get Detailed Quiz Attempt Result
export async function getStudentQuizDetailedResult(
  id: string
): Promise<StudentQuizAttemptResultData> {
  const { data: result } = await ApiAxios.get<ApiResponse<StudentQuizAttemptResultData>>(
    `/student/quizzes/attempts/${id}/results`
  );
  return result.data;
}
