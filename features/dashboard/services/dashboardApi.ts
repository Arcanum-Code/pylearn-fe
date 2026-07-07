import { ApiAxios } from "@utils/axios";
import {
  ApiDashboardResponse,
  ApiLecturerDashboardResponse,
  ApiStudentDashboardResponse,
  ApiCalendarEventsResponse,
  ApiRecentActivityResponse,
  DashboardData,
  LecturerDashboardData,
  StudentDashboardData,
  CalendarEvent,
  RecentActivity,
} from "../types";

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await ApiAxios.get<ApiDashboardResponse>("/dashboard");
  return data.data;
}

export async function getLecturerDashboard(): Promise<LecturerDashboardData> {
  const { data: result } =
    await ApiAxios.get<ApiLecturerDashboardResponse>("/dashboard/dosen");

  return result.data;
}

export async function getStudentDashboard(): Promise<StudentDashboardData> {
  const { data: result } = await ApiAxios.get<ApiStudentDashboardResponse>(
    "/dashboard/mahasiswa",
  );

  return result.data;
}

export async function getStudentCalendarEvents(
  year: number,
  month: number,
  groupId?: string,
): Promise<CalendarEvent[]> {
  const { data } = await ApiAxios.get<ApiCalendarEventsResponse>(
    "/dashboard/mahasiswa/calendar/events",
    {
      params: { year, month, ...(groupId && { groupId }) },
    },
  );
  return data.data;
}

export async function getStudentRecentActivity(
  limit: number,
  groupId?: string,
): Promise<RecentActivity[]> {
  const { data } = await ApiAxios.get<ApiRecentActivityResponse>(
    "/dashboard/mahasiswa/recent-activity",
    {
      params: { limit, ...(groupId && { groupId }) },
    },
  );
  return data.data;
}
