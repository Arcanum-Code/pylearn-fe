"use client";

import { useState } from "react";
import { DashboardStats } from "./DashboardStats";
import { StudentDashboardData } from "../types";
import {
  useFetchStudentCalendarEvents,
  useFetchStudentRecentActivity,
} from "../hooks/useDashboard";
import { 
  ClipboardCheck, 
  GraduationCap, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  FileText,
  HelpCircle,
  AlertCircle,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface StudentDashboardViewProps {
  data?: StudentDashboardData;
  isLoading?: boolean;
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  } catch {
    return isoString;
  }
}

function getDotColor(type: string): string {
  switch (type) {
    case "quiz_close":
      return "bg-red-500";
    case "quiz_open":
      return "bg-blue-500";
    case "material_release":
      return "bg-emerald-500";
    default:
      return "bg-neutral-500";
  }
}

function StudentRightPanel() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 7)); // Default to July 7, 2026
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-07");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-indexed for the API

  const { data: calendarEvents = [], isLoading: isEventsLoading } = useFetchStudentCalendarEvents(
    year,
    month
  );

  const { data: recentActivities = [], isLoading: isActivityLoading } = useFetchStudentRecentActivity(
    10
  );

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  const formatDateString = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const getDays = () => {
    const days: (Date | null)[] = [];
    const firstDay = new Date(year, currentDate.getMonth(), 1);
    const startDayOfWeek = firstDay.getDay();

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    const lastDay = new Date(year, currentDate.getMonth() + 1, 0);
    const numDays = lastDay.getDate();

    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, currentDate.getMonth(), i));
    }

    return days;
  };

  const calendarDays = getDays();
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const selectedDateEvents = calendarEvents.filter((e) => e.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-gray-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-neutral-800 font-bold">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <span className="text-sm">
              {monthNames[currentDate.getMonth()]} {year}
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900"
              onClick={handleNextMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-neutral-400 mb-2 font-mono">
          <span>Min</span>
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
        </div>

        {/* Calendar Grid */}
        {isEventsLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner className="h-6 w-6 text-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-9" />;

              const dateStr = formatDateString(day);
              const isSelected = dateStr === selectedDate;
              const dateEvents = calendarEvents.filter((e) => e.date === dateStr);
              const hasEvents = dateEvents.length > 0;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-9 w-full flex flex-col items-center justify-between py-1 rounded-xl text-xs font-semibold font-mono relative transition-colors focus:outline-none ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span>{day.getDate()}</span>
                  <div className="flex gap-0.5 justify-center h-1.5 w-full">
                    {hasEvents &&
                      dateEvents.slice(0, 3).map((e, eIdx) => (
                        <span
                          key={eIdx}
                          className={`h-1 w-1 rounded-full ${
                            isSelected ? "bg-white" : getDotColor(e.type)
                          }`}
                        />
                      ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Agenda Section */}
      <div className="bg-white rounded-2xl border border-gray-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-5">
        <h4 className="text-sm font-bold text-neutral-800 mb-3 flex items-center justify-between">
          <span>Agenda Kelas</span>
          <span className="text-[10px] font-semibold text-neutral-400 font-mono">
            {selectedDate.split("-").reverse().join("/")}
          </span>
        </h4>

        {isEventsLoading ? (
          <div className="flex h-16 items-center justify-center">
            <Spinner className="h-5 w-5 text-indigo-600" />
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
            {selectedDateEvents.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono py-2 text-center">
                Tidak ada agenda pada tanggal ini.
              </p>
            ) : (
              selectedDateEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-50/50 border border-neutral-100/50"
                >
                  <div className="mt-0.5">
                    {event.type === "quiz_close" && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {event.type === "quiz_open" && (
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                    )}
                    {event.type === "material_release" && (
                      <FileText className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-700 leading-normal">
                      {event.title}
                    </p>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                      Jam {event.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Recent Activity Widget */}
      <div className="bg-white rounded-2xl border border-gray-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-5">
        <h4 className="text-sm font-bold text-neutral-800 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-500" />
            Aktivitas Terkini
          </span>
          <span className="flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200/50">
            {recentActivities.length} Terbaru
          </span>
        </h4>

        {isActivityLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner className="h-6 w-6 text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono py-6 text-center">
                Belum ada aktivitas pengerjaan.
              </p>
            ) : (
              recentActivities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 hover:border-indigo-100 bg-white hover:bg-indigo-50/10 transition-all duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-neutral-700 truncate">
                      {item.taskName}
                    </p>
                    <p className="text-[9px] text-neutral-450 font-mono mt-0.5 truncate">
                      Telah diselesaikan
                    </p>
                  </div>
                  <div className="text-right ml-2 flex flex-col items-end shrink-0">
                    <span className="text-[9px] text-neutral-400 font-mono">
                      {formatRelativeTime(item.submittedAt)}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-[10px] font-bold font-mono ${item.score >= 80 ? 'text-emerald-600' : item.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        Skor: {item.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function StudentDashboardView({ data, isLoading }: StudentDashboardViewProps) {
  const statsConfig = [
    {
      titleKey: "Total Percobaan",
      dataKey: "totalAttempts",
      icon: ClipboardCheck,
      color: "orange" as const,
      descriptionKey: "Jumlah kuis yang Anda ikuti",
    },
    {
      titleKey: "Kuis Selesai",
      dataKey: "quizzesCompleted",
      icon: GraduationCap,
      color: "green" as const,
      descriptionKey: "Kuis yang telah Anda selesaikan",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-36" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-36" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Three Column Grid for Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Classes & Learning Progress */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3.5 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statsData = data?.overview;

  return (
    <div className="space-y-6">
      <DashboardStats data={statsData} config={statsConfig} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Area (2/3 width) - Active Quizzes and Recent Results */}
        <div className="xl:col-span-2 space-y-6">
          {/* In Progress Quizzes */}
          <Card className="border border-gray-150/60 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Sedang Dikerjakan
              </CardTitle>
              <CardDescription>Kuis yang telah Anda mulai tapi belum dikumpulkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.inProgress.map((item) => (
                  <div key={item.attemptId} className="flex items-center justify-between p-4 rounded-lg border border-gray-150 bg-muted/30">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.quizTitle}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Dimulai: {new Date(item.startedAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Button size="sm" asChild className="ml-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white">
                      <Link href={`/quizzes/attempts/${item.attemptId}`}>
                        Lanjutkan <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
                {(!data?.inProgress || data.inProgress.length === 0) && (
                  <div className="text-center py-8 text-sm text-muted-foreground italic border border-dashed rounded-lg bg-gray-50/50">
                    Tidak ada kuis yang sedang dikerjakan.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card className="border border-gray-150/60 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
                Hasil Terbaru
              </CardTitle>
              <CardDescription>Riwayat pengerjaan kuis terakhir Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentResults.map((item) => (
                  <div key={item.attemptId} className="flex items-center justify-between p-4 rounded-lg border border-gray-150">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.quizTitle}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Selesai: {new Date(item.submittedAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="ml-4 border-gray-250 hover:bg-gray-50">
                      <Link href={`/quizzes/attempts/${item.attemptId}`}>
                        Lihat Hasil
                      </Link>
                    </Button>
                  </div>
                ))}
                {(!data?.recentResults || data.recentResults.length === 0) && (
                  <div className="text-center py-8 text-sm text-muted-foreground italic border border-dashed rounded-lg bg-gray-50/50">
                    Belum ada riwayat hasil kuis.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Area (1/3 width) - Interactive Calendar Schedule and Recent Activity Logs */}
        <div className="xl:col-span-1">
          <StudentRightPanel />
        </div>
      </div>

      {/* Enrolled Classes & Learning Progress */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-[#1A1C1E] flex items-center gap-2 pt-2">
          <GraduationCap className="h-5 w-5 text-[#6366F1]" />
          Progress Belajar Kelas
        </h2>
        
        {data?.enrolledGroups && data.enrolledGroups.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {data.enrolledGroups.map((group) => {
              const percentage = group.materialsTotal > 0 
                ? Math.round((group.materialsCompleted / group.materialsTotal) * 100)
                : 0;
              return (
                <Card key={group.groupId} className="overflow-hidden border border-gray-150/80 shadow-xs hover:shadow-sm transition-all duration-200">
                  <CardHeader className="bg-gray-50/40 pb-4 border-b border-gray-150/60">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">{group.groupName}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {group.materialsCompleted} dari {group.materialsTotal} materi selesai
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-sm font-semibold text-[#6366F1]">{percentage}% Selesai</span>
                        <div className="w-full md:w-32 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-[#6366F1] h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.materials.map((material) => {
                        let statusBadge = null;
                        let statusIcon = null;
                        let statusClass = "";

                        if (material.status === "completed") {
                          statusBadge = <Badge className="bg-green-100 hover:bg-green-100 text-green-800 border-green-200 text-[10px]">Selesai</Badge>;
                          statusIcon = <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />;
                          statusClass = "border-green-100 bg-green-50/10";
                        } else if (material.status === "in_progress") {
                          const scroll = material.scrollPercentage !== null ? `${material.scrollPercentage}%` : "0%";
                          statusBadge = <Badge className="bg-orange-100 hover:bg-orange-100 text-orange-800 border-orange-250 text-[10px]">Dibaca ({scroll})</Badge>;
                          statusIcon = <BookOpen className="h-4 w-4 text-orange-500 flex-shrink-0" />;
                          statusClass = "border-orange-100 bg-orange-50/10";
                        } else {
                          statusBadge = <Badge variant="outline" className="text-gray-400 border-gray-200 text-[10px] bg-white">Belum Mulai</Badge>;
                          statusIcon = <BookOpen className="h-4 w-4 text-gray-300 flex-shrink-0" />;
                          statusClass = "border-gray-100 bg-gray-50/5";
                        }

                        return (
                          <Link 
                            key={material.materialId} 
                            href={`/materials/${material.materialId}`}
                            className={`flex items-start justify-between p-3.5 rounded-xl border hover:border-[#6366F1]/30 transition-all hover:shadow-xs group cursor-pointer ${statusClass}`}
                          >
                            <div className="flex items-start gap-3 min-w-0 mr-2">
                              {statusIcon}
                              <div className="min-w-0">
                                <p className="font-semibold text-sm group-hover:text-[#6366F1] transition-colors truncate">{material.title}</p>
                                <div className="mt-1 flex items-center gap-1.5">
                                  {statusBadge}
                                </div>
                              </div>
                            </div>
                            <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-gray-250 rounded-xl p-10 text-center bg-gray-50/50">
            <p className="text-sm text-muted-foreground italic">Anda belum terdaftar di kelas manapun.</p>
          </div>
        )}
      </div>
    </div>
  );
}
