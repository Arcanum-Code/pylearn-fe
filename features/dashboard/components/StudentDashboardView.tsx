"use client";

import { DashboardStats } from "./DashboardStats";
import { StudentDashboardData } from "../types";
import { 
  ClipboardCheck, 
  GraduationCap, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface StudentDashboardViewProps {
  data?: StudentDashboardData;
  isLoading?: boolean;
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

        {/* Active & Recent Quizzes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
