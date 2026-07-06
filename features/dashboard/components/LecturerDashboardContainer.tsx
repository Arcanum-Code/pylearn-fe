"use client";

import * as React from "react";
import { useFetchLecturerGroups } from "../hooks/useLecturerDashboard";
import { useFetchLecturerDashboard } from "../hooks/useDashboard";
import { LecturerDashboardView } from "./LecturerDashboardView";
import { GroupDashboardView } from "./GroupDashboardView";
import { LecturerRightPanel } from "./LecturerRightPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
      {/* Column 2: Main Content Area (3 cols wide on xl, 2 cols on lg) */}
      <div className="lg:col-span-2 xl:col-span-3 space-y-6">
        {/* Selector Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-150/60 shadow-xs">
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {selectedGroupId === "all" ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* Wrapper div catches hover events since disabled button swallows them */}
                    <div className="w-full sm:w-auto" tabIndex={0}>
                      <Button
                        variant="outline"
                        disabled
                        className="w-full sm:w-auto rounded-xl border-[#6366F1] text-[#6366F1] font-mono text-sm disabled:opacity-50"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Kelola Kelas
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[250px] text-center">
                    <p>Pilih kelas spesifik pada dropdown untuk mengelola data kelas tersebut.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link href={`/groups/${selectedGroupId}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10 font-mono text-sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Kelola Kelas
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Kelas:</span>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className="w-[200px] bg-background rounded-xl">
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
        </div>

        {/* Main View rendering */}
        {selectedGroupId === "all" ? (
          <LecturerDashboardView data={overviewQuery.data} />
        ) : (
          <GroupDashboardView groupId={selectedGroupId} />
        )}
      </div>

      {/* Column 3: Contextual Action Panel */}
      <div className="lg:col-span-1 space-y-6">
        <LecturerRightPanel groupId={selectedGroupId} />
      </div>
    </div>
  );
}
