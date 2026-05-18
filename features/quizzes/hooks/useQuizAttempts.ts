"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getQuizAttempts,
  getQuizAttemptById,
  createQuizAttempt,
  createQuizAttemptByMaterial,
  submitQuizAttempt,
  submitStudentAnswer,
  submitBulkStudentAnswers,
  getMyQuizStatus,
  getQuizAttemptResults,
} from "../services/quizApi";
import { QuizAttempt } from "../types";
import { QuizAttemptFormData } from "../schemas/quizSchema";

export const attemptKeys = {
  all: ["quiz-attempts"] as const,
  lists: () => [...attemptKeys.all, "list"] as const,
  list: (filters: { quizId?: string; studentId?: string }) =>
    [...attemptKeys.lists(), filters] as const,
  details: () => [...attemptKeys.all, "detail"] as const,
  detail: (id: string) => [...attemptKeys.details(), id] as const,
};

export function useFetchQuizAttempts(filters?: {
  quizId?: string;
  studentId?: string;
}) {
  return useQuery({
    queryKey: attemptKeys.list(filters || {}),
    queryFn: () => getQuizAttempts(filters),
    enabled: !!filters?.quizId || !!filters?.studentId,
  });
}

export function useFetchQuizAttemptDetail(id: string) {
  return useQuery({
    queryKey: attemptKeys.detail(id),
    queryFn: () => getQuizAttemptById(id),
    enabled: !!id,
  });
}

export function useCreateQuizAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuizAttemptFormData) => createQuizAttempt(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: attemptKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: [...attemptKeys.all, "status-me"],
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

export function useCreateQuizAttemptByMaterial() {
  const queryClient = useQueryClient();

  return useMutation<
    { attempt: QuizAttempt; message: string },
    Error,
    { materialId: string; levelId: string }
  >({
    mutationFn: (data) => createQuizAttemptByMaterial(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: attemptKeys.lists(),
      });
      toast.success(
        response.message || "Sesi kuis berhasil dimulai. Selamat mengerjakan!",
      );
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

export function useSubmitQuizAttempt(
  id: string,
  filters?: { quizId?: string; studentId?: string },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => submitQuizAttempt(id),
    onSuccess: (response) => {
      // Invalidation detail token attempt yang bersangkutan
      queryClient.invalidateQueries({
        queryKey: attemptKeys.detail(id),
      });
      // Invalidation lists global agar status 'submittedAt' terdeteksi berubah
      queryClient.invalidateQueries({
        queryKey: attemptKeys.lists(),
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

export function useSubmitStudentAnswer(attemptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitStudentAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attemptKeys.detail(attemptId),
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

export function useSubmitBulkStudentAnswers(attemptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitBulkStudentAnswers,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: attemptKeys.detail(attemptId),
      });

      // 2. Berikan umpan balik visual yang nyaman bagi siswa
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

export function useFetchMyQuizStatus(quizId: string) {
  return useQuery({
    queryKey: [...attemptKeys.all, "status-me", quizId] as const,
    queryFn: () => getMyQuizStatus(quizId),
    enabled: !!quizId,
  });
}

export function useFetchQuizAttemptResults(attemptId: string) {
  return useQuery({
    queryKey: [...attemptKeys.all, "results", attemptId] as const,
    queryFn: () => getQuizAttemptResults(attemptId),
    enabled: !!attemptId,
  });
}
