"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@features/auth/context/AuthProvider";
import {
  fetchLecturerGroups,
  fetchGroupSummary,
  fetchGroupContentHealth,
} from "../services/lecturer.service";
import { GroupData, GroupSummaryData, ContentHealthData } from "../types";

export const lecturerDashboardKeys = {
  all: ["lecturer-dashboard"] as const,
  groups: () => [...lecturerDashboardKeys.all, "groups"] as const,
  groupSummary: (groupId: string) =>
    [...lecturerDashboardKeys.all, "summary", groupId] as const,
  groupContentHealth: (groupId: string) =>
    [...lecturerDashboardKeys.all, "content-health", groupId] as const,
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
