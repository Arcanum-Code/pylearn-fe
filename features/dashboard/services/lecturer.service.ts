import { ApiAxios } from "@utils/axios";
import {
  ApiGroupsResponse,
  ApiGroupSummaryResponse,
  ApiContentHealthResponse,
  GroupData,
  GroupSummaryData,
  ContentHealthData,
} from "../types";

export async function fetchLecturerGroups(): Promise<GroupData[]> {
  const { data } = await ApiAxios.get<ApiGroupsResponse>("/lecturer/groups");
  return data.data;
}

export async function fetchGroupSummary(
  groupId: string,
): Promise<GroupSummaryData> {
  const { data } = await ApiAxios.get<ApiGroupSummaryResponse>(
    `/lecturer/groups/${groupId}/dashboard/summary`,
  );
  return data.data;
}

export async function fetchGroupContentHealth(
  groupId: string,
): Promise<ContentHealthData> {
  const { data } = await ApiAxios.get<ApiContentHealthResponse>(
    `/lecturer/groups/${groupId}/dashboard/content-health`,
  );
  return data.data;
}
