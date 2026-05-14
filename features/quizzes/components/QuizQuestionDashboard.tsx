"use client";

import { useFetchQuizzes } from "../hooks/useQuizzes";
import { Skeleton } from "@/components/ui/skeleton";
import QuizLevelSection from "./QuizLevelSection";

interface QuizQuestionDashboardProps {
  materialId: string;
  materialTitle?: string;
}

export default function QuizQuestionDashboard({
  materialId,
}: QuizQuestionDashboardProps) {
  // Kita tetap fetch kuis di sini untuk mendapatkan array `levels` terbaru secara reaktif
  const { data: quizzes, isLoading } = useFetchQuizzes(materialId);
  const activeQuiz = quizzes && quizzes.length > 0 ? quizzes[0] : null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (!activeQuiz) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-10">
        {activeQuiz.levels && activeQuiz.levels.length > 0 ? (
          activeQuiz.levels.map((level, index) => (
            <QuizLevelSection
              key={level.id}
              levelId={level.id}
              levelTitle={level.title}
              levelOrder={index + 1}
              materialId={materialId}
            />
          ))
        ) : (
          <div className="text-center py-10 border border-dashed rounded-xl bg-muted/20 text-sm text-muted-foreground">
            <p className="font-semibold">Struktur Level Belum Tersedia</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Silakan klik tombol &quot;Tambah Level&quot; di atas untuk mulai
              memetakan soal esai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
