import { ApiAxios } from "@/app/utils/axios";
import {
  Group,
  StudentGroupDetail,
  GroupStudentsActivityData,
  GroupStudentActivityDetailData,
} from "../types";

export const GroupService = {
  getGroups: async (): Promise<Group[]> => {
    const { data } = await ApiAxios.get("/groups");
    return data.data;
  },
  getGroup: async (id: string): Promise<Group> => {
    const { data } = await ApiAxios.get(`/groups/${id}`);
    return data.data;
  },
  createGroup: async (payload: { name: string; description?: string | null }) => {
    const { data } = await ApiAxios.post("/groups", payload);
    return data;
  },
  updateGroup: async (
    id: string,
    payload: { name?: string; description?: string | null }
  ) => {
    const { data } = await ApiAxios.patch(`/groups/${id}`, payload);
    return data;
  },
  deleteGroup: async (id: string) => {
    const { data } = await ApiAxios.delete(`/groups/${id}`);
    return data;
  },
  getStudentGroupDetail: async (id: string): Promise<StudentGroupDetail> => {
    const { data } = await ApiAxios.get(`/groups/mahasiswa/${id}`);
    return data.data;
  },
  getGroupStudentsActivity: async (groupId: string): Promise<GroupStudentsActivityData> => {
    const { data } = await ApiAxios.get(`/lecturer/groups/${groupId}/students-activity`);
    return data.data;
  },
  getGroupStudentActivityDetail: async (
    groupId: string,
    studentId: string
  ): Promise<GroupStudentActivityDetailData> => {
    const { data } = await ApiAxios.get(
      `/lecturer/groups/${groupId}/students/${studentId}/activity`
    );
    return data.data;
  },
};

