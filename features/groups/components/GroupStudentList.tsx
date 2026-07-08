"use client";

import { useState, useMemo } from "react";
import { useGroupStudentsActivity } from "../hooks/useGroups";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "@/lib/i18n/useTranslation";
import { Search, AlertTriangle, UserCheck, UserMinus, Users, ChevronRight } from "lucide-react";
import { GroupStudentActivityDetailSheet } from "./GroupStudentActivityDetailSheet";

interface GroupStudentListProps {
  groupId: string;
}

type BucketFilter = "ALL" | "AT_RISK" | "INACTIVE" | "ON_TRACK";
type SortOption = "name" | "progress" | "score" | "lastActive";

export function GroupStudentList({ groupId }: GroupStudentListProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { data, isLoading } = useGroupStudentsActivity(groupId);
  const [bucket, setBucket] = useState<BucketFilter>("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const students = data?.students;

  const filteredStudents = useMemo(() => {
    if (!students) return [];

    return students
      .filter((s) => {
        if (bucket !== "ALL" && s.status?.toUpperCase() !== bucket) return false;
        if (search.trim() !== "") {
          const q = search.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "progress") return a.overall_progress_percentage - b.overall_progress_percentage;
        if (sortBy === "score") return (a.avg_quiz_score || 0) - (b.avg_quiz_score || 0);
        if (sortBy === "lastActive") {
          const timeA = a.last_active_at ? new Date(a.last_active_at).getTime() : 0;
          const timeB = b.last_active_at ? new Date(b.last_active_at).getTime() : 0;
          return timeA - timeB;
        }
        return 0;
      });
  }, [students, bucket, search, sortBy]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const getStatusBadge = (status?: string, statusReasons?: string[]) => {
    const st = status?.toUpperCase();
    if (st === "AT_RISK") {
      return (
        <Badge
          variant="outline"
          className="bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 font-sans text-[10px] px-2 py-0.5"
          title={statusReasons?.join(", ")}
        >
          <AlertTriangle className="w-3.5 h-3.5 mr-1 inline" /> {t("groups.students.statusLabels.AT_RISK")}
        </Badge>
      );
    }
    if (st === "INACTIVE") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-sans text-[10px] px-2 py-0.5"
          title={statusReasons?.join(", ")}
        >
          <UserMinus className="w-3.5 h-3.5 mr-1 inline" /> {t("groups.students.statusLabels.INACTIVE")}
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 font-sans text-[10px] px-2 py-0.5"
      >
        <UserCheck className="w-3.5 h-3.5 mr-1 inline" /> {t("groups.students.statusLabels.ON_TRACK")}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-gray-150/60 shadow-xs">
        <Spinner className="w-8 h-8 text-[#6366F1]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-gray-400 font-sans bg-white rounded-2xl border border-gray-150/60 shadow-xs">
        Data aktivitas mahasiswa tidak tersedia
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-6 font-sans">
      {/* Smart Status Buckets Bento Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: All Students */}
        <button
          onClick={() => setBucket("ALL")}
          className={`flex items-center gap-4 p-6 rounded-2xl border text-left transition-all cursor-pointer hover:-translate-y-0.5 ${
            bucket === "ALL"
              ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
              : "bg-indigo-50/20 border-indigo-100/60 shadow-[0_8px_30px_rgba(99,102,241,0.01)] hover:border-indigo-200/80 hover:bg-indigo-50/40"
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-700/80 uppercase tracking-wider">
              {t("groups.students.buckets.all")}
            </span>
            <p className="text-3xl font-extrabold font-mono text-indigo-950 mt-1">
              {summary.total_students || 0}
            </p>
          </div>
        </button>

        {/* Card 2: At Risk */}
        <button
          onClick={() => setBucket("AT_RISK")}
          className={`flex items-center gap-4 p-6 rounded-2xl border text-left transition-all cursor-pointer hover:-translate-y-0.5 ${
            bucket === "AT_RISK"
              ? "bg-red-50 border-red-500 ring-2 ring-red-500/20 shadow-[0_8px_30px_rgba(239,68,68,0.06)]"
              : "bg-red-50/20 border-red-100/60 shadow-[0_8px_30px_rgba(239,68,68,0.01)] hover:border-red-200/80 hover:bg-red-50/40"
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-red-700/80 uppercase tracking-wider">
              {t("groups.students.buckets.atRisk")}
            </span>
            <p className="text-3xl font-extrabold font-mono text-red-950 mt-1">
              {summary.at_risk_count || 0}
            </p>
          </div>
        </button>

        {/* Card 3: Inactive */}
        <button
          onClick={() => setBucket("INACTIVE")}
          className={`flex items-center gap-4 p-6 rounded-2xl border text-left transition-all cursor-pointer hover:-translate-y-0.5 ${
            bucket === "INACTIVE"
              ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-[0_8px_30px_rgba(245,158,11,0.06)]"
              : "bg-amber-50/20 border-amber-100/60 shadow-[0_8px_30px_rgba(245,158,11,0.01)] hover:border-amber-200/80 hover:bg-amber-50/40"
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
            <UserMinus className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wider">
              {t("groups.students.buckets.inactive")}
            </span>
            <p className="text-3xl font-extrabold font-mono text-amber-950 mt-1">
              {summary.inactive_count || 0}
            </p>
          </div>
        </button>

        {/* Card 4: On Track */}
        <button
          onClick={() => setBucket("ON_TRACK")}
          className={`flex items-center gap-4 p-6 rounded-2xl border text-left transition-all cursor-pointer hover:-translate-y-0.5 ${
            bucket === "ON_TRACK"
              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-[0_8px_30px_rgba(16,185,129,0.06)]"
              : "bg-emerald-50/20 border-emerald-100/60 shadow-[0_8px_30px_rgba(16,185,129,0.01)] hover:border-emerald-200/80 hover:bg-emerald-50/40"
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-wider">
              {t("groups.students.buckets.onTrack")}
            </span>
            <p className="text-3xl font-extrabold font-mono text-emerald-950 mt-1">
              {summary.on_track_count || 0}
            </p>
          </div>
        </button>
      </div>

      {/* Search and Sort Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-150/60 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            type="text"
            placeholder={t("groups.students.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#F7F8FA] border-gray-200 focus:bg-white text-sm font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-sans text-gray-500 whitespace-nowrap">
            {t("groups.students.sortBy")}:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[#F7F8FA] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-sans text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          >
            <option value="name">{t("groups.students.sortOptions.name")}</option>
            <option value="progress">{t("groups.students.sortOptions.progress")}</option>
            <option value="score">{t("groups.students.sortOptions.score")}</option>
            <option value="lastActive">{t("groups.students.sortOptions.lastActive")}</option>
          </select>
        </div>
      </div>

      {/* Students Activity Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-150/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-gray-150 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">{t("groups.students.table.student")}</th>
                <th className="py-4 px-4">{t("groups.students.table.status")}</th>
                <th className="py-4 px-4">{t("groups.students.table.progress")}</th>
                <th className="py-4 px-4">{t("groups.students.table.quizScore")}</th>
                <th className="py-4 px-4">{t("groups.students.table.lastActive")}</th>
                <th className="py-4 px-6 text-right">{t("groups.students.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150/60 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-sans">
                    Tidak ada mahasiswa yang sesuai dengan filter
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr
                    key={s.student_id}
                    onClick={() => setSelectedStudentId(s.student_id)}
                    className="hover:bg-[#F7F8FA]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#1A1C1E] group-hover:text-[#6366F1] transition-colors">
                        {s.name}
                      </div>
                      <div className="text-xs text-gray-400 font-sans mt-0.5">
                        {s.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(s.status, s.status_reasons)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#6366F1] h-full rounded-full transition-all"
                            style={{ width: `${s.overall_progress_percentage || 0}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-gray-600 font-semibold">
                          {Math.round(s.overall_progress_percentage || 0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold">
                      {s.avg_quiz_score !== null && s.avg_quiz_score !== undefined ? (
                        <span
                          className={
                            s.avg_quiz_score >= 60
                              ? "text-[#10B981]"
                              : "text-[#EF4444]"
                          }
                        >
                          {Math.round(s.avg_quiz_score)} pt
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500 font-sans">
                      {formatDate(s.last_active_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudentId(s.student_id);
                        }}
                        className="h-8 rounded-xl font-sans text-xs text-[#6366F1] hover:bg-[#6366F1]/10"
                      >
                        Detail <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Sheet for Granular Detail */}
      {selectedStudentId && (
        <GroupStudentActivityDetailSheet
          groupId={groupId}
          studentId={selectedStudentId}
          isOpen={!!selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
}
