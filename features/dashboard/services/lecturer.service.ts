import { ApiAxios } from "@utils/axios";
import {
  ApiGroupsResponse,
  ApiGroupSummaryResponse,
  ApiContentHealthResponse,
  ApiCalendarEventsResponse,
  ApiRecentActivityResponse,
  GroupData,
  GroupSummaryData,
  ContentHealthData,
  CalendarEvent,
  RecentActivity,
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

export async function fetchCalendarEvents(
  year: number,
  month: number,
  groupId?: string,
): Promise<CalendarEvent[]> {
  const query = new URLSearchParams({
    year: String(year),
    month: String(month),
  });
  if (groupId && groupId !== "all") {
    query.append("groupId", groupId);
  }
  const { data } = await ApiAxios.get<ApiCalendarEventsResponse>(
    `/lecturer/calendar/events?${query.toString()}`,
  );
  return data.data;
}

export async function fetchRecentActivity(
  limit?: number,
  groupId?: string,
): Promise<RecentActivity[]> {
  const query = new URLSearchParams();
  if (limit) {
    query.append("limit", String(limit));
  }
  if (groupId && groupId !== "all") {
    query.append("groupId", groupId);
  }
  const queryString = query.toString();
  const url = `/lecturer/dashboard/recent-activity${queryString ? `?${queryString}` : ""}`;
  const { data } = await ApiAxios.get<ApiRecentActivityResponse>(url);
  return data.data;
}
