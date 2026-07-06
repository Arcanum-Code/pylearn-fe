"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@features/auth/context/AuthProvider";
import {
  fetchLecturerGroups,
  fetchGroupSummary,
  fetchGroupContentHealth,
  fetchCalendarEvents,
  fetchRecentActivity,
} from "../services/lecturer.service";
import {
  GroupData,
  GroupSummaryData,
  ContentHealthData,
  CalendarEvent,
  RecentActivity,
} from "../types";

export const lecturerDashboardKeys = {
  all: ["lecturer-dashboard"] as const,
  groups: () => [...lecturerDashboardKeys.all, "groups"] as const,
  groupSummary: (groupId: string) =>
    [...lecturerDashboardKeys.all, "summary", groupId] as const,
  groupContentHealth: (groupId: string) =>
    [...lecturerDashboardKeys.all, "content-health", groupId] as const,
  calendarEvents: (year: number, month: number, groupId?: string) =>
    [...lecturerDashboardKeys.all, "calendar", year, month, groupId || "all"] as const,
  recentActivity: (limit?: number, groupId?: string) =>
    [...lecturerDashboardKeys.all, "recent-activity", limit || 10, groupId || "all"] as const,
};

export function useFetchLecturerGroups() {
  const { user, isLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<GroupData[]>({
    queryKey: lecturerDashboardKeys.groups(),
    queryFn: fetchLecturerGroups,
    enabled: !!user && !isLoading && roleName === "dosen",
  });
}

export function useFetchGroupSummary(groupId: string) {
  const { user, isLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<GroupSummaryData>({
    queryKey: lecturerDashboardKeys.groupSummary(groupId),
    queryFn: () => fetchGroupSummary(groupId),
    enabled: !!user && !isLoading && !!groupId && groupId !== "all" && roleName === "dosen",
  });
}

export function useFetchGroupContentHealth(groupId: string) {
  const { user, isLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<ContentHealthData>({
    queryKey: lecturerDashboardKeys.groupContentHealth(groupId),
    queryFn: () => fetchGroupContentHealth(groupId),
    enabled: !!user && !isLoading && !!groupId && groupId !== "all" && roleName === "dosen",
  });
}

export function useFetchCalendarEvents(year: number, month: number, groupId?: string) {
  const { user, isLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<CalendarEvent[]>({
    queryKey: lecturerDashboardKeys.calendarEvents(year, month, groupId),
    queryFn: () => fetchCalendarEvents(year, month, groupId),
    enabled: !!user && !isLoading && roleName === "dosen",
  });
}

export function useFetchRecentActivity(limit?: number, groupId?: string) {
  const { user, isLoading } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  return useQuery<RecentActivity[]>({
    queryKey: lecturerDashboardKeys.recentActivity(limit, groupId),
    queryFn: () => fetchRecentActivity(limit, groupId),
    enabled: !!user && !isLoading && roleName === "dosen",
  });
}
