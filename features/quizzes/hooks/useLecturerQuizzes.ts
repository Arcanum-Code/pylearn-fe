import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LecturerQuizService } from "../services/lecturerQuizApi";
import { toast } from "sonner";
import { groupKeys } from "@/features/groups/hooks/useGroups";
import { CreateLecturerQuizFormData, UpdateLecturerQuizFormData, LecturerQuestionFormData, ReplaceBlanksFormData } from "../schemas/lecturerQuizSchema";

export const lecturerQuizKeys = {
  all: ["lecturerQuizzes"] as const,
  lists: (groupId: string) => [...lecturerQuizKeys.all, "list", groupId] as const,
  detail: (quizId: string) => [...lecturerQuizKeys.all, "detail", quizId] as const,
};

export const useLecturerQuizzes = (groupId: string) => {
  return useQuery({
    queryKey: lecturerQuizKeys.lists(groupId),
    queryFn: () => LecturerQuizService.getQuizzesByGroup(groupId),
    enabled: !!groupId,
  });
};

export const useLecturerQuizDetail = (quizId: string) => {
  return useQuery({
    queryKey: lecturerQuizKeys.detail(quizId),
    queryFn: () => LecturerQuizService.getQuizDetail(quizId),
    enabled: !!quizId,
  });
};

export const useCreateLecturerQuiz = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLecturerQuizFormData) => LecturerQuizService.createQuiz(groupId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.lists(groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
      toast.success(res.message || "Berhasil membuat kuis");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat kuis");
    }
  });
};

export const useUpdateLecturerQuiz = (groupId: string, quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateLecturerQuizFormData) => LecturerQuizService.updateQuiz(quizId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.lists(groupId) });
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.detail(quizId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
      toast.success(res.message || "Berhasil memperbarui kuis");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui kuis");
    }
  });
};

export const useDeleteLecturerQuiz = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quizId: string) => LecturerQuizService.deleteQuiz(quizId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.lists(groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
      toast.success(res.message || "Berhasil menghapus kuis");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus kuis");
    }
  });
};

export const usePublishLecturerQuiz = (groupId: string, quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => LecturerQuizService.publishQuiz(quizId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.lists(groupId) });
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.detail(quizId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
      toast.success(res.message || "Berhasil mempublikasikan kuis");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mempublikasikan kuis");
    }
  });
};

export const useCreateLecturerQuestion = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LecturerQuestionFormData) => LecturerQuizService.createQuestion(quizId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.detail(quizId) });
      toast.success(res.message || "Berhasil menambah pertanyaan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambah pertanyaan");
    }
  });
};

export const useUpdateLecturerQuestion = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: Partial<LecturerQuestionFormData> }) => 
      LecturerQuizService.updateQuestion(questionId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.detail(quizId) });
      toast.success(res.message || "Berhasil memperbarui pertanyaan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui pertanyaan");
    }
  });
};

export const useDeleteLecturerQuestion = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => LecturerQuizService.deleteQuestion(questionId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.detail(quizId) });
      toast.success(res.message || "Berhasil menghapus pertanyaan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus pertanyaan");
    }
  });
};

export const useReplaceLecturerBlanks = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: ReplaceBlanksFormData }) => 
      LecturerQuizService.replaceBlanks(questionId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lecturerQuizKeys.detail(quizId) });
      toast.success(res.message || "Berhasil memperbarui blanko");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui blanko");
    }
  });
};
