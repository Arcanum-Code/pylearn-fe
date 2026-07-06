"use client";

import { LecturerDashboardData } from "../types";
import { BookOpen, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LecturerDashboardViewProps {
  data?: LecturerDashboardData;
}

export function LecturerDashboardView({ data }: LecturerDashboardViewProps) {
  const statsData = data?.overview;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tile 1: Total Materi (Light Bento Card) */}
      <Card className="bg-indigo-50 border border-indigo-100/80 rounded-2xl shadow-[0_8px_30px_rgba(99,102,241,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700/80">
              Total Materi
            </p>
            <p className="text-3xl font-extrabold font-mono text-indigo-950 mt-1">
              {statsData?.totalMaterials ?? "-"}
            </p>
            <p className="text-xs text-indigo-600/70 mt-1 font-medium">
              Materi pembelajaran aktif
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tile 2: Total Kuis (Light Bento Card) */}
      <Card className="bg-emerald-50 border border-emerald-100/80 rounded-2xl shadow-[0_8px_30px_rgba(16,185,129,0.04)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700/80">
              Total Kuis
            </p>
            <p className="text-3xl font-extrabold font-mono text-emerald-950 mt-1">
              {statsData?.totalQuizzes ?? "-"}
            </p>
            <p className="text-xs text-emerald-600/70 mt-1 font-medium">
              Kuis penilaian terbit
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tile 4: Analisis Materi (Full Width Table Bento Tile) */}
      <Card className="md:col-span-2 bg-white border border-gray-150/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
        <CardHeader className="border-b border-gray-100 py-4 px-6">
          <CardTitle className="text-lg font-bold text-neutral-900">
            Analisis Materi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-neutral-50/50 text-left font-semibold text-muted-foreground">
                  <th className="py-3 px-6">Judul Materi</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4 text-center">Kuis</th>
                  <th className="py-3 px-4 text-center">Level</th>
                  <th className="py-3 px-6 text-right">Siswa Terlibat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.materialBreakdown.map((item) => (
                  <tr
                    key={item.materialId}
                    className="group hover:bg-neutral-50/30 transition-colors"
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

    </div>
  );
}
