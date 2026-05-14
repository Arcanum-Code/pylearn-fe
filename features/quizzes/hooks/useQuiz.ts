"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createLevel as apiCreateLevel,
  fetchLevels,
  fetchQuizzesByLevel,
} from "../services/quizApi";

export const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (levelId: string) => [...quizKeys.lists(), { levelId }] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
};

export const levelKeys = {
  all: (materialId: string) => ["materials", materialId, "levels"] as const,
};

export function useFetchLevels(materialId: string) {
  return useQuery({
    queryKey: levelKeys.all(materialId),
    queryFn: () => fetchLevels(materialId),
  });
}

export function useCreateLevel(materialId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiCreateLevel(materialId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: levelKeys.all(materialId),
      });
      toast.success(response.message || "Level generated successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate level.");
    },
  });
}

export function useFetchQuizzesByLevel(levelId: string | null) {
  return useQuery({
    queryKey: quizKeys.list(levelId || ""),
    queryFn: () => fetchQuizzesByLevel(levelId!),
    enabled: !!levelId,
  });
}
