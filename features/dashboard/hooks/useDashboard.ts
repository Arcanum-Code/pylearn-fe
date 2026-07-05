"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@features/auth/context/AuthProvider";
import { fetchDashboard } from "../services/dashboardApi";
import { DashboardData } from "../types";
import {
  getLecturerDashboard,
  getStudentDashboard,
} from "../services/dashboardApi";
import { LecturerDashboardData, StudentDashboardData } from "../types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  detail: () => [...dashboardKeys.all, "detail"] as const,
  lecturer: () => [...dashboardKeys.all, "lecturer"] as const,
  student: () => [...dashboardKeys.all, "student"] as const,
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
