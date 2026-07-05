"use client";

import * as React from "react";
import { useFetchLecturerGroups } from "../hooks/useLecturerDashboard";
import { useFetchLecturerDashboard } from "../hooks/useDashboard";
import { LecturerDashboardView } from "./LecturerDashboardView";
import { GroupDashboardView } from "./GroupDashboardView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export function LecturerDashboardContainer() {
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>("all");

  const { data: groups, isLoading: isGroupsLoading } = useFetchLecturerGroups();
  const overviewQuery = useFetchLecturerDashboard();

  if (isGroupsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {selectedGroupId === "all"
              ? "Ringkasan Umum"
              : groups?.find((g) => g.id === selectedGroupId)?.name || "Detail Kelas"}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selectedGroupId === "all"
              ? "Analisis seluruh materi dan pengerjaan kuis siswa"
              : "Analisis khusus perkembangan kuis dan materi pada kelas ini"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Kelas:</span>
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Ringkasan Umum</SelectItem>
              {groups?.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main View rendering */}
      {selectedGroupId === "all" ? (
        <LecturerDashboardView data={overviewQuery.data} />
      ) : (
        <GroupDashboardView groupId={selectedGroupId} />
      )}
    </div>
  );
}
