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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[300px] md:col-span-2 rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
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
          isPositive ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {isPositive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Siswa */}
        <Card className="bg-white border-border rounded-xl shadow-sm">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Siswa
              </p>
              <p className="text-3xl font-extrabold font-mono text-neutral-900 mt-1">
                {summary?.total_students ?? 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Siswa terdaftar dalam kelas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Materi Dibaca */}
        <Card className="bg-white border-border rounded-xl shadow-sm">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rata-rata Bacaan
              </p>
              <p className="text-3xl font-extrabold font-mono text-neutral-900 mt-1">
                {summary?.avg_materials_read ?? 0}
                <span className="text-lg text-muted-foreground font-normal">
                  {" "}
                  / {summary?.total_materials ?? 0}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Materi diselesaikan per siswa
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Rata-rata Kelulusan (Dark Terminal Accent) */}
        <TerminalTile title="group_pass_rate.sh">
          <div className="flex items-center gap-4 py-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">
                Rata-rata Kelulusan
              </p>
              <div className="flex items-center mt-1">
                <p className="text-3xl font-extrabold font-mono text-emerald-400">
                  {summary?.avg_pass_rate?.toFixed(1) ?? "0.0"}%
                </p>
                {renderTrend(summary?.pass_rate_trend?.delta)}
              </div>
              <p className="text-[10px] text-terminal-muted font-mono mt-1">
                status: EXCELLENT_PROGRESS
              </p>
            </div>
          </div>
        </TerminalTile>
      </div>

      {/* Content Health Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Table: Quiz Performance Health */}
        <Card className="md:col-span-2 bg-white border-border rounded-xl shadow-sm">
          <CardHeader className="border-b border-border/50 py-4 px-6">
            <CardTitle className="text-lg font-bold text-neutral-900">
              Status Performa Kuis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-neutral-50 text-left font-semibold text-muted-foreground">
                    <th className="py-3 px-6">Judul Kuis</th>
                    <th className="py-3 px-4 text-center">Level</th>
                    <th className="py-3 px-4 text-center">Kelulusan Pertama</th>
                    <th className="py-3 px-4 text-center">Rata-rata Upaya</th>
                    <th className="py-3 px-6 text-right">Status Kesehatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {health?.quizzes.map((quiz) => {
                    const isHighFailure = quiz.flag === "high_failure_rate";
                    return (
                      <tr
                        key={quiz.quiz_id}
                        className="group hover:bg-neutral-50/50 transition-colors"
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

        {/* List: Materials Read Rates */}
        <Card className="bg-white border-border rounded-xl shadow-sm">
          <CardHeader className="border-b border-border/50 py-4 px-6">
            <CardTitle className="text-lg font-bold text-neutral-900">
              Keterlibatan Materi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {health?.materials.map((mat) => {
                const isLowRead = mat.read_rate < 60;
                return (
                  <div
                    key={mat.material_id}
                    className="p-4 hover:bg-neutral-50/50 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-800 truncate text-sm">
                        {mat.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tingkat penyelesaian:{" "}
                        <span className="font-bold font-mono text-neutral-700">
                          {mat.read_rate.toFixed(1)}%
                        </span>
                      </p>
                    </div>

                    <div>
                      {isLowRead ? (
                        <Badge className="bg-amber-50 text-amber-600 border border-amber-100/50 rounded-md font-semibold text-[10px] whitespace-nowrap">
                          Keterlibatan Rendah
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-md font-semibold text-[10px] whitespace-nowrap">
                          Aktif
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
              {(!health?.materials || health.materials.length === 0) && (
                <div className="py-12 text-center text-muted-foreground italic text-sm">
                  Tidak ada materi aktif ditemukan.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
