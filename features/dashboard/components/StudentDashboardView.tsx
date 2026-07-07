"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardStats } from "./DashboardStats";
import { StudentDashboardData } from "../types";
import {
  useFetchStudentCalendarEvents,
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
  ChevronDown,
  CalendarDays,
  FileText,
  HelpCircle,
  AlertCircle
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
    </div>
  );
}

export function StudentDashboardView({ data, isLoading }: StudentDashboardViewProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data?.enrolledGroups && data.enrolledGroups.length > 0 && Object.keys(expandedGroups).length === 0) {
      // Expand the first group by default
      const initial: Record<string, boolean> = {};
      initial[data.enrolledGroups[0].groupId] = true;
      setExpandedGroups(initial);
    }
  }, [data, expandedGroups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

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
        {/* Main Content Loading */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Classes progress skeleton */}
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

            {/* Quizzes skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="xl:col-span-1">
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
      </div>
    );
  }

  const statsData = data?.overview;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Area (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Section 1: Progress Belajar Kelas (Action Prioritized at the Top) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-[#1A1C1E] flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#6366F1]" />
              Progress Belajar Kelas
            </h2>
            
            {data?.enrolledGroups && data.enrolledGroups.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {data.enrolledGroups.map((group) => {
                  const percentage = group.materialsTotal > 0 
                    ? Math.round((group.materialsCompleted / group.materialsTotal) * 100)
                    : 0;
                  const isExpanded = !!expandedGroups[group.groupId];

                  return (
                    <Card 
                      key={group.groupId} 
                      onClick={() => toggleGroup(group.groupId)}
                      className="overflow-hidden border border-gray-150/85 shadow-xs hover:shadow-sm cursor-pointer transition-all duration-200 bg-white"
                    >
                      <CardHeader className={`bg-gray-50/40 pb-4 transition-all duration-300 ${isExpanded ? "border-b border-gray-150/60" : ""}`}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-[#6366F1]/10 text-[#6366F1] transition-all duration-300">
                              <GraduationCap className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-sm md:text-base font-bold truncate">{group.groupName}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {group.materialsCompleted} dari {group.materialsTotal} materi selesai
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="hidden md:flex items-center gap-3">
                              <span className="text-xs font-semibold text-[#6366F1]">{percentage}% Selesai</span>
                              <div className="w-24 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                <div 
                                  className="bg-gradient-to-r from-[#6366F1] to-indigo-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                                  style={{ width: mounted ? `${percentage}%` : "0%" }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/groups/${group.groupId}`);
                                }}
                                className="text-xs text-[#6366F1] hover:text-[#4F46E5] hover:bg-[#6366F1]/10 font-semibold h-8 py-0 px-2.5 rounded-lg flex items-center gap-1"
                              >
                                Detail Kelas
                                <ArrowRight className="h-3 w-3" />
                              </Button>

                              <div className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="pt-6 bg-white transition-all duration-300">
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
                                  href={`/groups/${group.groupId}/materials/${material.materialId}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`flex items-start justify-between p-3.5 rounded-xl border hover:border-[#6366F1]/30 transition-all hover:shadow-xs group/item cursor-pointer ${statusClass}`}
                                >
                                  <div className="flex items-start gap-3 min-w-0 mr-2">
                                    {statusIcon}
                                    <div className="min-w-0">
                                      <p className="font-semibold text-xs group-hover/item:text-[#6366F1] transition-colors truncate">{material.title}</p>
                                      <div className="mt-1 flex items-center gap-1.5">
                                        {statusBadge}
                                      </div>
                                    </div>
                                  </div>
                                  <ArrowUpRight className="h-3 w-3 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                                </Link>
                              );
                            })}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Supercharged Empty State for Classes */
              <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-2xl bg-white text-center shadow-xs">
                <div className="p-4 bg-indigo-50 text-[#6366F1] rounded-full mb-4">
                  <BookOpen className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="font-bold text-gray-800 text-base">Belum Ada Kelas Terdaftar</h3>
                <p className="text-xs text-muted-foreground mt-1.5 mb-5 max-w-sm">
                  Kamu belum terdaftar di kelas manapun. Yuk, mulai belajar pemrograman Python dengan mendaftar di kelas pertamamu sekarang!
                </p>
                <Button asChild className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6">
                  <Link href="/groups">Eksplorasi Kelas Pertama Anda</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Section 2: Quizzes (In Progress and Recent Results stacked) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* In Progress Quizzes */}
            <Card className="border border-gray-150/60 shadow-xs bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Sedang Dikerjakan
                </CardTitle>
                <CardDescription className="text-xs">Kuis aktif yang belum kamu submit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.inProgress && data.inProgress.length > 0 ? (
                    data.inProgress.map((item) => (
                      <div key={item.attemptId} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-muted/20">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs truncate">{item.quizTitle}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Mulai: {new Date(item.startedAt).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <Button size="sm" asChild className="ml-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white">
                          <Link href={`/quizzes/attempts/${item.attemptId}`}>
                            Lanjutkan <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    /* Supercharged Empty State for In Progress */
                    <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 text-center">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-full mb-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">Tidak ada kuis aktif</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 mb-4">Kamu telah menyelesaikan semua pengerjaan kuis.</p>
                      <Button size="sm" asChild className="bg-orange-500 hover:bg-orange-600 text-white text-xs shadow-sm">
                        <Link href="/groups">Cari Kuis Baru</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card className="border border-gray-150/60 shadow-xs bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  Hasil Terbaru
                </CardTitle>
                <CardDescription className="text-xs">Riwayat pengerjaan kuis terakhir Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.recentResults && data.recentResults.length > 0 ? (
                    data.recentResults.map((item) => (
                      <div key={item.attemptId} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs truncate">{item.quizTitle}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Selesai: {new Date(item.submittedAt).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="ml-4 border-gray-250 hover:bg-gray-50 text-xs">
                          <Link href={`/quizzes/attempts/${item.attemptId}`}>
                            Lihat Hasil
                          </Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    /* Supercharged Empty State for Recent Results */
                    <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 text-center">
                      <div className="p-2 bg-green-50 text-green-500 rounded-full mb-3">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">Belum ada riwayat kuis</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 mb-4">Selesaikan kuis pertamamu untuk melacak hasil di sini.</p>
                      <Button size="sm" asChild className="bg-green-600 hover:bg-green-700 text-white text-xs shadow-sm">
                        <Link href="/groups">Buka Kelas & Belajar</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Area (1/3 width) - Strict "My Schedule" containing Calendar & Agenda Only */}
        <div className="xl:col-span-1">
          <StudentRightPanel />
        </div>
      </div>

      {/* Section 3: Metric Cards (Moved to the bottom, made compact and secondary) */}
      <div className="border-t border-gray-200 pt-6 mt-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Statistik Capaian Kuis</h3>
        <DashboardStats data={statsData} config={statsConfig} />
      </div>
    </div>
  );
}
