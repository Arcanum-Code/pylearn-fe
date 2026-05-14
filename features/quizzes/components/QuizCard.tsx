"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Layers, Loader2, Plus, X } from "lucide-react";
import { Quiz } from "@/features/quizzes/types";
import {
  useCreateQuizLevel,
  useDeleteQuizLevel,
} from "@/features/quizzes/hooks/useQuizLevels";

interface QuizCardProps {
  quiz: Quiz;
  materialId: string;
}

export default function QuizCard({ quiz, materialId }: QuizCardProps) {
  const { mutate: createLevel, isPending: isCreatingLevel } =
    useCreateQuizLevel(quiz.id, materialId);
  const { mutate: deleteLevel, isPending: isDeletingLevel } =
    useDeleteQuizLevel(quiz.id, materialId);

  // Menghitung jumlah total level saat ini
  const totalLevels = quiz.levels ? quiz.levels.length : 0;
  const nextLevelOrder = totalLevels + 1;

  const handleAutoCreateLevel = () => {
    createLevel({
      quizId: quiz.id,
      title: `Level ${nextLevelOrder}`,
      levelOrder: nextLevelOrder,
    });
  };

  // Handler langsung panggil service tanpa window.confirm alert lagi
  const handleDeleteLevel = (e: React.MouseEvent, levelId: string) => {
    e.stopPropagation();
    deleteLevel(levelId);
  };

  const formatTanggal = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Card className="overflow-hidden border-2 shadow-sm transition-all duration-200">
      <div
        className={`h-1.5 w-full ${quiz.isPublished ? "bg-primary" : "bg-muted-foreground/40"}`}
      />

      <div className="p-6 space-y-6">
        {/* Judul & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-primary">
              {quiz.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {quiz.description ||
                "Tidak ada deskripsi tambahan untuk kuis ini."}
            </CardDescription>
          </div>
        </div>

        {/* Metadata Jadwal Waktu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl text-sm border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground/70">
                Waktu Mulai
              </p>
              <p className="font-semibold text-foreground/90">
                {formatTanggal(quiz.startTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-destructive shrink-0">
            <Calendar className="h-4 w-4 text-destructive shrink-0" />
            <div>
              <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground/70">
                Waktu Selesai
              </p>
              <p className="font-semibold text-foreground/90">
                {formatTanggal(quiz.endTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Section Tingkatan / Levels */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
            <Layers className="h-4 w-4 text-primary" />
            <span>Struktur Tingkatan Soal ({totalLevels} Level)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-3 bg-background border rounded-lg">
            {quiz.levels && quiz.levels.length > 0 && (
              <>
                {quiz.levels.map((level, index) => {
                  // Cek apakah level ini adalah urutan paling terakhir di array
                  const isLatestLevel = index === totalLevels - 1;

                  return (
                    <Badge
                      key={level.id}
                      variant="outline"
                      className="px-3 py-1 text-xs font-medium bg-secondary/30 text-secondary-foreground flex items-center gap-1.5 border"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{level.title}</span>

                      {/* Hanya munculkan tombol X jika ini merupakan level paling baru/terakhir */}
                      {isLatestLevel && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteLevel(e, level.id)}
                          disabled={isDeletingLevel}
                          className="ml-1 p-0.5 rounded-full text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  );
                })}
              </>
            )}

            {/* Tombol Badge Instan Otomatis */}
            <button
              type="button"
              onClick={handleAutoCreateLevel}
              disabled={isCreatingLevel || isDeletingLevel}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border border-dashed border-primary bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingLevel ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              {isCreatingLevel ? "Membuat..." : "Tambah Level"}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
