"use client";

import {
  useFetchGroupSummary,
  useFetchGroupContentHealth,
} from "../hooks/useLecturerDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TerminalTile } from "@/components/ui/terminal-tile";
import { Users, BookOpen, Percent, AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface GroupDashboardViewProps {
  groupId: string;
}

export function GroupDashboardView({ groupId }: GroupDashboardViewProps) {
  const { data: summary, isLoading: isSummaryLoading } = useFetchGroupSummary(groupId);
  const { data: health, isLoading: isHealthLoading } = useFetchGroupContentHealth(groupId);

  const isLoading = isSummaryLoading || isHealthLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[120px] rounded-2xl" />
        <Skeleton className="h-[120px] rounded-2xl" />
        <Skeleton className="h-[300px] md:col-span-2 rounded-2xl" />
      </div>
    );
  }

  // Render delta indicator helper
  const renderTrend = (delta?: number) => {
    if (delta === undefined) return null;
    const isPositive = delta >= 0;
    return (
      <span
        className={`text-[10px] font-mono font-semibold ml-2 ${
          isPositive ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {isPositive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Total Siswa */}
        <Card className="bg-indigo-50 border border-indigo-100/80 rounded-2xl shadow-[0_8px_30px_rgba(99,102,241,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700/80">
                Total Siswa
              </p>
              <p className="text-3xl font-extrabold font-mono text-indigo-950 mt-1">
                {summary?.total_students ?? 0}
              </p>
              <p className="text-xs text-indigo-600/70 mt-1 font-medium">
                Siswa terdaftar dalam kelas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Rata-rata Bacaan */}
        <Card className="bg-emerald-50 border border-emerald-100/80 rounded-2xl shadow-[0_8px_30px_rgba(16,185,129,0.04)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700/80">
                Rata-rata Bacaan
              </p>
              <p className="text-3xl font-extrabold font-mono text-emerald-950 mt-1">
                {summary?.avg_materials_read ?? 0}
                <span className="text-lg text-emerald-700/60 font-normal">
                  {" "}
                  / {summary?.total_materials ?? 0}
                </span>
              </p>
              <p className="text-xs text-emerald-600/70 mt-1 font-medium">
                Materi diselesaikan per siswa
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Health Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Table: Quiz Performance Health */}
        <Card className="md:col-span-2 bg-white border border-gray-150/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <CardHeader className="border-b border-gray-100 py-4 px-6">
            <CardTitle className="text-lg font-bold text-neutral-900">
              Status Performa Kuis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-neutral-50/50 text-left font-semibold text-muted-foreground">
                    <th className="py-3 px-6">Judul Kuis</th>
                    <th className="py-3 px-4 text-center">Level</th>
                    <th className="py-3 px-4 text-center">Kelulusan Pertama</th>
                    <th className="py-3 px-4 text-center">Rata-rata Upaya</th>
                    <th className="py-3 px-6 text-right">Status Kesehatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {health?.quizzes.map((quiz) => {
                    const isHighFailure = quiz.flag === "high_failure_rate";
                    return (
                      <tr
                        key={quiz.quiz_id}
                        className="group hover:bg-neutral-50/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-neutral-800">
                          {quiz.title}
                        </td>
                        <td className="py-4 px-4 text-center font-mono text-neutral-600">
                          {quiz.level}
                        </td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-neutral-800">
                          {quiz.first_attempt_pass_rate.toFixed(1)}%
                        </td>
                        <td className="py-4 px-4 text-center font-mono text-neutral-600">
                          {quiz.avg_attempts_to_pass.toFixed(1)}x
                        </td>
                        <td className="py-4 px-6 text-right">
                          {isHighFailure ? (
                            <Badge className="bg-red-50 text-red-600 border border-red-100/50 rounded-md font-semibold text-[11px] gap-1 inline-flex items-center">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Tingkat Gagal Tinggi
                            </Badge>
                          ) : quiz.flag ? (
                            <Badge className="bg-amber-50 text-amber-600 border border-amber-100/50 rounded-md font-semibold text-[11px] gap-1 inline-flex items-center">
                              <Info className="h-3.5 w-3.5" />
                              {quiz.flag.replace("_", " ")}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-md font-semibold text-[11px] gap-1 inline-flex items-center">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Sehat
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {(!health?.quizzes || health.quizzes.length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-muted-foreground italic"
                      >
                        Tidak ada kuis aktif ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
