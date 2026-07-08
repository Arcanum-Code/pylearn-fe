"use client";

import { useGroupStudentActivityDetail } from "../hooks/useGroups";
import { Spinner } from "@/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "@/lib/i18n/useTranslation";
import { BookOpen, Clock, Award } from "lucide-react";

interface GroupStudentActivityDetailSheetProps {
  groupId: string;
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GroupStudentActivityDetailSheet({
  groupId,
  studentId,
  isOpen,
  onClose,
}: GroupStudentActivityDetailSheetProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { data, isLoading } = useGroupStudentActivityDetail(groupId, studentId, isOpen);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white p-6 space-y-6">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-[#1A1C1E]">
            {t("groups.students.drawer.title")}
          </SheetTitle>
          {data?.student && (
            <SheetDescription className="text-sm text-gray-500 font-sans">
              {data.student.name} • {data.student.email}
            </SheetDescription>
          )}
        </SheetHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="w-8 h-8 text-[#6366F1]" />
          </div>
        ) : !data ? (
          <div className="py-12 text-center text-gray-400 font-sans text-sm">
            Data tidak ditemukan
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quiz Attempts Section */}
            <div>
              <h3 className="font-semibold text-sm text-[#1A1C1E] flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-[#6366F1]" /> {t("groups.students.drawer.quizHistory")}
              </h3>
              {data.quiz_attempts_history.length === 0 ? (
                <p className="text-xs text-gray-400 font-sans py-4 bg-[#F7F8FA] rounded-xl text-center border border-gray-150">
                  {t("groups.students.drawer.noQuizHistory")}
                </p>
              ) : (
                <div className="space-y-3">
                  {data.quiz_attempts_history.map((attempt) => {
                    const isPassed = attempt.status?.toLowerCase() === "passed" || attempt.score >= 60;
                    return (
                      <div
                        key={attempt.attempt_id}
                        className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/60 flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-[#1A1C1E]">
                            {attempt.quiz_title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                            <span>Percobaan #{attempt.attempt_number}</span>
                            <span>•</span>
                            <span>{formatDate(attempt.submitted_at)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatDuration(attempt.time_spent_seconds || 0)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs px-2.5 py-1 ${
                            isPassed
                              ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                              : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                          }`}
                        >
                          {attempt.score} pt
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Material Reading Timeline Section */}
            <div>
              <h3 className="font-semibold text-sm text-[#1A1C1E] flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#6366F1]" /> {t("groups.students.drawer.readingTimeline")}
              </h3>
              {data.material_reading_timeline.length === 0 ? (
                <p className="text-xs text-gray-400 font-sans py-4 bg-[#F7F8FA] rounded-xl text-center border border-gray-150">
                  {t("groups.students.drawer.noReadingTimeline")}
                </p>
              ) : (
                <div className="space-y-3">
                  {data.material_reading_timeline.map((item) => {
                    const isCompleted = item.status?.toLowerCase() === "completed" || item.scroll_percentage >= 100;
                    return (
                      <div
                        key={item.material_id}
                        className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/60 flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-[#1A1C1E]">
                            {item.material_title}
                          </p>
                          <p className="text-xs text-gray-500 font-sans">
                            {item.completed_at
                              ? `Selesai: ${formatDate(item.completed_at)}`
                              : item.first_opened_at
                              ? `Dibuka: ${formatDate(item.first_opened_at)}`
                              : "Belum dibuka"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs px-2.5 py-1 ${
                            isCompleted
                              ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                              : item.scroll_percentage > 0
                              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                              : "bg-gray-200 text-gray-500 border-gray-300"
                          }`}
                        >
                          {item.scroll_percentage}%
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
