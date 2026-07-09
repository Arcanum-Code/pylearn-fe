"use client";

import {
  AdminDashboardView,
  LecturerDashboardContainer,
  StudentDashboardView,
} from "@features/dashboard";
import {
  useFetchDashboard,
  useFetchStudentDashboard,
} from "@features/dashboard/hooks/useDashboard";
import { useAuth } from "@features/auth/context/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();
  const roleName = user?.roleName?.toLowerCase();

  const adminQuery = useFetchDashboard();
  const studentQuery = useFetchStudentDashboard();

  const renderDashboard = () => {
    switch (roleName) {
      case "dosen":
        return <LecturerDashboardContainer />;
      case "mahasiswa":
        return (
          <StudentDashboardView
            data={studentQuery.data}
            isLoading={studentQuery.isLoading}
          />
        );
      default:
        return <AdminDashboardView data={adminQuery.data} />;
    }
  };

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div>
        {renderDashboard()}
      </div>
    </div>
  );
}

