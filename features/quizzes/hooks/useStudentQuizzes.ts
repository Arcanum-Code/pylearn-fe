"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getStudentQuizAttempts,
  getStudentQuizAttemptById,
  createStudentQuizAttempt,
  submitStudentQuizAttempt,
  getStudentQuizProgress,
  getStudentQuizQuestionsForAttempt,
  getStudentQuizAnswers,
  submitStudentQuizAnswer,
  updateStudentQuizAnswer,
  submitBulkStudentQuizAnswers,
  getStudentQuizResultsSummary,
  getStudentQuizDetailedResult,
} from "../services/studentQuizApi";

export const studentQuizKeys = {
  all: ["student-quizzes"] as const,
  lists: () => [...studentQuizKeys.all, "list"] as const,
  list: (filters: { quizId?: string }) => [...studentQuizKeys.lists(), filters] as const,
  details: () => [...studentQuizKeys.all, "detail"] as const,
  detail: (id: string) => [...studentQuizKeys.details(), id] as const,
  status: (quizId: string) => [...studentQuizKeys.all, "status", quizId] as const,
  questions: (quizId: string) => [...studentQuizKeys.all, "questions", quizId] as const,
  answers: (attemptId: string) => [...studentQuizKeys.all, "answers", attemptId] as const,
  results: (attemptId: string) => [...studentQuizKeys.all, "results", attemptId] as const,
  summaryResults: (filters: { quizId?: string; studentId?: string }) => 
    [...studentQuizKeys.all, "summary-results", filters] as const,
};

// 1. Fetch Quiz Attempts
export function useFetchStudentQuizAttempts(filters?: { quizId?: string }) {
  return useQuery({
    queryKey: studentQuizKeys.list(filters || {}),
    queryFn: () => getStudentQuizAttempts(filters),
    enabled: !!filters?.quizId,
  });
}

// 2. Fetch Quiz Attempt Detail
export function useFetchStudentQuizAttemptDetail(id: string) {
  return useQuery({
    queryKey: studentQuizKeys.detail(id),
    queryFn: () => getStudentQuizAttemptById(id),
    enabled: !!id,
  });
}

// 3. Create Quiz Attempt Mutation
export function useCreateStudentQuizAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudentQuizAttempt,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.all,
      });
      toast.success("Sesi kuis berhasil dimulai. Selamat mengerjakan!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Gagal memulai sesi kuis baru.",
      );
    },
  });
}

// 4. Submit Quiz Attempt Mutation
export function useSubmitStudentQuizAttempt(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => submitStudentQuizAttempt(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.all,
      });
      toast.success(
        response.message || "Jawaban kuis Anda berhasil dikumpulkan!",
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Gagal mengumpulkan lembar jawaban kuis.",
      );
    },
  });
}

// 5. Fetch Student Quiz Progress
export function useFetchStudentQuizProgress(quizId: string) {
  return useQuery({
    queryKey: studentQuizKeys.status(quizId),
    queryFn: () => getStudentQuizProgress(quizId),
    enabled: !!quizId,
  });
}

// 6. Fetch Quiz Questions for Attempt
export function useFetchStudentQuizQuestionsForAttempt(quizId: string) {
  return useQuery({
    queryKey: studentQuizKeys.questions(quizId),
    queryFn: () => getStudentQuizQuestionsForAttempt(quizId),
    enabled: !!quizId,
  });
}

// 7. Fetch Quiz Answers for an Attempt
export function useFetchStudentQuizAnswers(quizAttemptId: string) {
  return useQuery({
    queryKey: studentQuizKeys.answers(quizAttemptId),
    queryFn: () => getStudentQuizAnswers(quizAttemptId),
    enabled: !!quizAttemptId,
  });
}

// 8. Submit Single Quiz Answer Mutation
export function useSubmitStudentQuizAnswer(attemptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitStudentQuizAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.detail(attemptId),
      });
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.answers(attemptId),
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Gagal menyimpan jawaban pertanyaan ini.",
      );
    },
  });
}

// 9. Update Single Quiz Answer Mutation
export function useUpdateStudentQuizAnswer(attemptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        answerText?: string;
        items?: { keywordId: string; answerText: string }[];
      };
    }) => updateStudentQuizAnswer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.detail(attemptId),
      });
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.answers(attemptId),
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Gagal memperbarui jawaban pertanyaan ini.",
      );
    },
  });
}

// 10. Submit Bulk Quiz Answers Mutation
export function useSubmitBulkStudentQuizAnswers(attemptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitBulkStudentQuizAnswers,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.detail(attemptId),
      });
      queryClient.invalidateQueries({
        queryKey: studentQuizKeys.answers(attemptId),
      });
      toast.success(
        response.message || "Progres jawaban Anda berhasil disimpan.",
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Gagal menyimpan kumpulan jawaban Anda.",
      );
    },
  });
}

// 11. Fetch All Attempts Summary Results
export function useFetchStudentQuizResultsSummary(filters?: {
  quizId?: string;
  studentId?: string;
}) {
  return useQuery({
    queryKey: studentQuizKeys.summaryResults(filters || {}),
    queryFn: () => getStudentQuizResultsSummary(filters),
  });
}

// 12. Fetch Detailed Quiz Attempt Result
export function useFetchStudentQuizDetailedResult(attemptId: string) {
  return useQuery({
    queryKey: studentQuizKeys.results(attemptId),
    queryFn: () => getStudentQuizDetailedResult(attemptId),
    enabled: !!attemptId,
  });
}
