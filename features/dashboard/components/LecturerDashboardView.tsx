"use client";

import { LecturerDashboardData } from "../types";
import { BookOpen, ClipboardList, Database, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TerminalTile } from "@/components/ui/terminal-tile";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LecturerDashboardViewProps {
  data?: LecturerDashboardData;
}

export function LecturerDashboardView({ data }: LecturerDashboardViewProps) {
  const statsData = data?.overview;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tile 1: Total Materi (Light Bento Card) */}
      <Card className="bg-white border-border rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Materi
            </p>
            <p className="text-3xl font-extrabold font-mono text-neutral-900 mt-1">
              {statsData?.totalMaterials ?? "-"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Materi pembelajaran aktif
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tile 2: Total Kuis (Light Bento Card) */}
      <Card className="bg-white border-border rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Kuis
            </p>
            <p className="text-3xl font-extrabold font-mono text-neutral-900 mt-1">
              {statsData?.totalQuizzes ?? "-"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Kuis penilaian terbit
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tile 3: Total Pengerjaan (Dark Accent Terminal Card) */}
      <TerminalTile
        title="attempts_status.py"
        className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-4 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">
              Total Pengerjaan
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-terminal-muted font-mono text-sm">$</span>
              <p className="text-3xl font-extrabold font-mono text-emerald-400">
                {statsData?.totalStudentAttempts ?? "-"}
              </p>
            </div>
            <p className="text-[10px] text-terminal-muted font-mono mt-1">
              stdout: SUCCESS_OK
            </p>
          </div>
        </div>
      </TerminalTile>

      {/* Tile 4: Analisis Materi (Full Width Table Bento Tile) */}
      <Card className="md:col-span-3 bg-white border-border rounded-xl shadow-sm">
        <CardHeader className="border-b border-border/50 py-4 px-6">
          <CardTitle className="text-lg font-bold text-neutral-900">
            Analisis Materi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-neutral-50 text-left font-semibold text-muted-foreground">
                  <th className="py-3 px-6">Judul Materi</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4 text-center">Kuis</th>
                  <th className="py-3 px-4 text-center">Level</th>
                  <th className="py-3 px-6 text-right">Siswa Terlibat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data?.materialBreakdown.map((item) => (
                  <tr
                    key={item.materialId}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-neutral-800">
                      {item.title}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="secondary"
                        className="capitalize font-semibold text-[11px] rounded-md bg-indigo-50 text-indigo-600 border-indigo-100/50"
                      >
                        {item.materialType.toLowerCase().replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-neutral-600">
                      {item.quizCount}
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-neutral-600">
                      {item.levelCount}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-indigo-600">
                      {item.uniqueStudentsEngaged}
                    </td>
                  </tr>
                ))}
                {(!data?.materialBreakdown ||
                  data.materialBreakdown.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground italic"
                    >
                      Belum ada data materi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Daftar Kelas (Groups) */}
      <Card className="md:col-span-3 bg-white border-border rounded-xl shadow-sm">
        <CardHeader className="border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-neutral-900">
            Daftar Kelas (Groups)
          </CardTitle>
          <Link href="/groups">
            <Button variant="outline" size="sm" className="font-mono text-xs border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10">
              <Users className="w-3 h-3 mr-2" />
              Kelola Semua Kelas
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-neutral-50 text-left font-semibold text-muted-foreground">
                  <th className="py-3 px-6">Nama Kelas</th>
                  <th className="py-3 px-6 text-center">Total Siswa</th>
                  <th className="py-3 px-6 text-center">Rata-rata Lulus</th>
                  <th className="py-3 px-6 text-center">Total Pengerjaan</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data?.groupsOverview?.map((group) => (
                  <tr
                    key={group.groupId}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-neutral-800">
                      {group.groupName}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-neutral-600">
                      {group.totalStudents}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge
                        variant="secondary"
                        className={`font-mono text-xs ${
                          group.avgPassRate >= 80
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : group.avgPassRate >= 60
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-red-50 text-red-600 border-red-100"
                        }`}
                      >
                        {group.avgPassRate}%
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-neutral-600">
                      {group.totalStudentAttempts}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/groups/${group.groupId}`}>
                        <Button variant="ghost" size="sm" className="font-mono text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          Lihat Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {(!data?.groupsOverview || data.groupsOverview.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground italic"
                    >
                      Belum ada kelas atau data belum tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
