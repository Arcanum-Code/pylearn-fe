"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@features/auth/context/AuthProvider";
import { 
  fetchDashboard,
  getLecturerDashboard,
  getStudentDashboard,
  getStudentCalendarEvents,
  getStudentRecentActivity,
} from "../services/dashboardApi";
import { 
  DashboardData, 
  LecturerDashboardData, 
  StudentDashboardData,
  CalendarEvent,
  RecentActivity,
} from "../types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  detail: () => [...dashboardKeys.all, "detail"] as const,
  lecturer: () => [...dashboardKeys.all, "lecturer"] as const,
  student: () => [...dashboardKeys.all, "student"] as const,
  studentCalendar: (year: number, month: number, groupId?: string) =>
    [...dashboardKeys.student(), "calendar", year, month, groupId || ""] as const,
  studentRecentActivity: (limit: number, groupId?: string) =>
    [...dashboardKeys.student(), "recent-activity", limit, groupId || ""] as const,
};

export function useFetchDashboard() {
  const { user, isLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<DashboardData>({
    queryKey: dashboardKeys.detail(),
    queryFn: fetchDashboard,
    enabled: !!user && !isLoading && roleName !== "dosen" && roleName !== "mahasiswa",
  });
}

export function useFetchLecturerDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<LecturerDashboardData>({
    queryKey: dashboardKeys.lecturer(),
    queryFn: getLecturerDashboard,
    enabled: !!user && !isAuthLoading && roleName === "dosen",
  });
}

export function useFetchStudentDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<StudentDashboardData>({
    queryKey: dashboardKeys.student(),
    queryFn: getStudentDashboard,
    enabled: !!user && !isAuthLoading && roleName === "mahasiswa",
  });
}

export function useFetchStudentCalendarEvents(
  year: number,
  month: number,
  groupId?: string,
) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<CalendarEvent[]>({
    queryKey: dashboardKeys.studentCalendar(year, month, groupId),
    queryFn: () => getStudentCalendarEvents(year, month, groupId),
    enabled: !!user && !isAuthLoading && roleName === "mahasiswa",
  });
}

export function useFetchStudentRecentActivity(
  limit: number,
  groupId?: string,
) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<RecentActivity[]>({
    queryKey: dashboardKeys.studentRecentActivity(limit, groupId),
    queryFn: () => getStudentRecentActivity(limit, groupId),
    enabled: !!user && !isAuthLoading && roleName === "mahasiswa",
  });
}
