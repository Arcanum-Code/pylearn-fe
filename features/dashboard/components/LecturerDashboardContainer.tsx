"use client";

import * as React from "react";
import { useFetchLecturerDashboard } from "../hooks/useDashboard";
import { LecturerDashboardView } from "./LecturerDashboardView";
import { LecturerRightPanel } from "./LecturerRightPanel";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { GroupFormDialog } from "@/features/groups/components/GroupFormDialog";

export function LecturerDashboardContainer() {
  const overviewQuery = useFetchLecturerDashboard();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
        {/* Column 2: Main Content Area (3 cols wide on xl, 2 cols on lg) */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Selector Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-150/60 shadow-xs">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Ringkasan Umum
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Analisis seluruh materi dan pengerjaan kuis siswa
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="w-full sm:w-auto rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md font-mono font-medium text-sm flex items-center gap-2 py-2 px-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Buat Kelas
              </Button>
            </div>
          </div>

          {/* Main View rendering */}
          <LecturerDashboardView data={overviewQuery.data} />
        </div>

        {/* Column 3: Contextual Action Panel */}
        <div className="lg:col-span-1 space-y-6">
          <LecturerRightPanel />
        </div>
      </div>
      <GroupFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}

