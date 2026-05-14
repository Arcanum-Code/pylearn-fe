import { ApiAxios } from "@utils/axios";
import { ApiLevelsResponse, ApiQuizzesResponse, Level } from "../types";

export async function fetchLevels(materialId: string): Promise<Level[]> {
  const { data } = await ApiAxios.get<ApiLevelsResponse>(
    `/materials/${materialId}/levels`
  );
  return data.data;
}

export async function createLevel(
  materialId: string
): Promise<{ level: Level; message: string }> {
  const { data: result } = await ApiAxios.post<{
    data: Level;
    message: string;
  }>(`/materials/${materialId}/levels`, { title: "" });

  return {
    level: result.data,
    message: result.message,
  };
}

export async function fetchQuizzesByLevel(levelId: string) {
  const { data } = await ApiAxios.get<ApiQuizzesResponse>("/quizzes", {
    params: { levelId },
  });
  return data.data;
}
