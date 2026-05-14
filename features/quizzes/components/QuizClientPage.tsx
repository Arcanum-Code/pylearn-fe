"use client";

import { useState } from "react"; // 1. Import useState
import { useFetchQuizzes } from "@/features/quizzes/hooks/useQuizzes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BookOpen, Eye, HelpCircle, ArrowLeft } from "lucide-react";
import { Quiz } from "@/features/quizzes/types";
import Link from "next/link";
import QuizCard from "./QuizCard";
import QuizQuestionDashboard from "./QuizQuestionDashboard";
import CreateQuizForm from "./CreateQuizForm"; // 2. Import the form directly

// 3. Import Shadcn Dialog Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface QuizClientPageProps {
  materialId: string;
  materialTitle?: string;
}

function QuizClientPage({ materialId, materialTitle }: QuizClientPageProps) {
  const [isOpen, setIsOpen] = useState(false); // 4. Track dialog open state
  const { data: quizzes, isLoading: areQuizzesLoading } =
    useFetchQuizzes(materialId);
  const router = useRouter();

  const hasQuiz = quizzes && quizzes.length > 0;
  const decodedTitle = materialTitle?.trim() || "Detail Materi";

  // Callback to close modal when form submission succeeds
  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      {/* Kembali Button */}
      <div className="flex pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <BookOpen className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              Modul Pembelajaran
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-card-foreground">
            Materi: {decodedTitle}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Atur parameter, kelola batas lini waktu pengerjaan, dan tambahkan
            tingkatan (levels) pertanyaan esai adaptif untuk modul pembelajaran
            saat ini.
          </p>
        </div>

        {/* 5. DIALOG IMPLEMENTATION FOR CREATE QUIZ */}
        {!areQuizzesLoading && !hasQuiz && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-sm font-medium shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Buat Kuis Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Buat Kuis Baru</DialogTitle>
                <DialogDescription>
                  Materi:{" "}
                  <span className="font-semibold text-foreground">
                    {decodedTitle}
                  </span>
                </DialogDescription>
              </DialogHeader>

              {/* Render the form inside the Modal directly */}
              <div className="pt-4">
                <CreateQuizForm
                  materialId={materialId}
                  onSuccess={handleSuccess}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Konten Utama Dashboard */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Konfigurasi Evaluasi Aktif
          </h2>
        </div>

        {areQuizzesLoading ? (
          <div className="grid gap-4 grid-cols-1">
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : hasQuiz ? (
          <div className="space-y-10">
            {quizzes.map((quiz: Quiz) => (
              <div key={quiz.id} className="space-y-10">
                <QuizCard quiz={quiz} materialId={materialId} />
                <div className="border-t pt-6">
                  <QuizQuestionDashboard
                    materialId={materialId}
                    materialTitle={materialTitle}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-dashed bg-muted/20 py-12">
            <CardContent className="flex flex-col items-center justify-center space-y-3 text-center">
              <Eye className="h-10 w-10 text-muted-foreground/60 stroke-[1.5]" />
              <div className="space-y-1">
                <p className="font-semibold text-muted-foreground">
                  Evaluasi Belum Dibuat
                </p>
                <p className="text-sm text-muted-foreground/70 max-w-sm">
                  Silakan buat kuis terlebih dahulu untuk mengaktifkan sesi
                  evaluasi berjenjang pada materi ini.
                </p>
              </div>

              {/* Optional: Add a trigger inside the empty state placeholder as well */}
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Mulai Buat Kuis
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Buat Kuis Baru</DialogTitle>
                    <DialogDescription>
                      Materi:{" "}
                      <span className="font-semibold text-foreground">
                        {decodedTitle}
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="pt-4">
                    <CreateQuizForm
                      materialId={materialId}
                      onSuccess={handleSuccess}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default QuizClientPage;
