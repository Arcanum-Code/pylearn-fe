import { ApiAxios } from "@utils/axios";
import { API_ENDPOINTS } from "@/app/api/api";
import { LecturerQuizDetail, LecturerQuizListItem } from "../types/lecturer-quiz";
import { CreateLecturerQuizFormData, UpdateLecturerQuizFormData, LecturerQuestionFormData, ReplaceBlanksFormData } from "../schemas/lecturerQuizSchema";

export const LecturerQuizService = {
  getQuizzesByGroup: async (groupId: string): Promise<LecturerQuizListItem[]> => {
    const { data } = await ApiAxios.get<{ success: boolean; data: { quizzes: LecturerQuizListItem[] } }>(
      API_ENDPOINTS.LECTURER_QUIZZES.LIST_BY_GROUP(groupId)
    );
    return data.data.quizzes;
  },
  
  getQuizDetail: async (quizId: string): Promise<LecturerQuizDetail> => {
    const { data } = await ApiAxios.get<{ success: boolean; data: LecturerQuizDetail }>(
      API_ENDPOINTS.LECTURER_QUIZZES.DETAIL(quizId)
    );
    return data.data;
  },

  createQuiz: async (groupId: string, payload: CreateLecturerQuizFormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.LECTURER_QUIZZES.CREATE(groupId),
      payload
    );
    return data;
  },

  updateQuiz: async (quizId: string, payload: UpdateLecturerQuizFormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.patch<{ success: boolean; message: string }>(
      API_ENDPOINTS.LECTURER_QUIZZES.UPDATE(quizId),
      payload
    );
    return data;
  },

  deleteQuiz: async (quizId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.LECTURER_QUIZZES.DELETE(quizId)
    );
    return data;
  },

  publishQuiz: async (quizId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.LECTURER_QUIZZES.PUBLISH(quizId)
    );
    return data;
  },

  createQuestion: async (quizId: string, payload: LecturerQuestionFormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.LECTURER_QUIZZES.CREATE_QUESTION(quizId),
      payload
    );
    return data;
  },

  updateQuestion: async (questionId: string, payload: Partial<LecturerQuestionFormData>): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.patch<{ success: boolean; message: string }>(
      API_ENDPOINTS.LECTURER_QUIZZES.UPDATE_QUESTION(questionId),
      payload
    );
    return data;
  },

  deleteQuestion: async (questionId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.LECTURER_QUIZZES.DELETE_QUESTION(questionId)
    );
    return data;
  },

  replaceBlanks: async (questionId: string, payload: ReplaceBlanksFormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await ApiAxios.put<{ success: boolean; message: string }>(
      API_ENDPOINTS.LECTURER_QUIZZES.REPLACE_BLANKS(questionId),
      payload
    );
    return data;
  }
};
