import { ApiAxios } from "@utils/axios";
import { LecturerQuizDetail, LecturerQuizListItem } from "../types/lecturer-quiz";
import { CreateLecturerQuizFormData, UpdateLecturerQuizFormData, LecturerQuestionFormData, ReplaceBlanksFormData } from "../schemas/lecturerQuizSchema";

export const LecturerQuizService = {
  getQuizzesByGroup: async (groupId: string): Promise<LecturerQuizListItem[]> => {
    const { data } = await ApiAxios.get<{ success: boolean; data: { quizzes: LecturerQuizListItem[] } }>(
      `/lecturer/groups/${groupId}/quizzes`
    );
    return data.data.quizzes;
  },
  
  getQuizDetail: async (quizId: string): Promise<LecturerQuizDetail> => {
    const { data } = await ApiAxios.get<{ success: boolean; data: LecturerQuizDetail }>(
      `/lecturer/quizzes/${quizId}`
    );
    return data.data;
  },

  createQuiz: async (groupId: string, payload: CreateLecturerQuizFormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.post<{ success: boolean; message: string }>(
      `/lecturer/groups/${groupId}/quizzes`,
      payload
    );
    return data;
  },

  updateQuiz: async (quizId: string, payload: UpdateLecturerQuizFormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.patch<{ success: boolean; message: string }>(
      `/lecturer/quizzes/${quizId}`,
      payload
    );
    return data;
  },

  deleteQuiz: async (quizId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.delete<{ success: boolean; message: string }>(
      `/lecturer/quizzes/${quizId}`
    );
    return data;
  },

  publishQuiz: async (quizId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.post<{ success: boolean; message: string }>(
      `/lecturer/quizzes/${quizId}/publish`
    );
    return data;
  },

  createQuestion: async (quizId: string, payload: LecturerQuestionFormData): Promise<{ success: boolean; message: string; data?: any }> => {
    const { data } = await ApiAxios.post<{ success: boolean; message: string; data?: any }>(
      `/lecturer/quizzes/${quizId}/questions`,
      payload
    );
    return data;
  },

  updateQuestion: async (questionId: string, payload: Partial<LecturerQuestionFormData>): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.patch<{ success: boolean; message: string }>(
      `/lecturer/questions/${questionId}`,
      payload
    );
    return data;
  },

  deleteQuestion: async (questionId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.delete<{ success: boolean; message: string }>(
      `/lecturer/questions/${questionId}`
    );
    return data;
  },

  replaceBlanks: async (questionId: string, payload: ReplaceBlanksFormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.put<{ success: boolean; message: string }>(
      `/lecturer/questions/${questionId}/blanks`,
      payload
    );
    return data;
  }
};
