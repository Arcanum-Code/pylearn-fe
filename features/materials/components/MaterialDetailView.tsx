"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useFetchMaterialById } from "@/features/materials/hooks/useMaterials"; // Sesuaikan path import Anda
import { useFetchQuizLevelsByMaterialId } from "@/features/quizzes/hooks/useQuizLevels";
import {
  useCreateQuizAttempt,
  useFetchMyQuizStatus,
} from "@/features/quizzes/hooks/useQuizAttempts"; // Impor useFetchMyQuizStatus & useCreateQuizAttempt standar

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Loader2,
  GraduationCap,
  User,
  Calendar,
  Play,
  ArrowRight,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(
  () => import("./PdfViewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />,
  },
);

// Mocking component jika belum diimport
const HtmlRenderer = ({ content }: { content: string }) => (
  <div
    className="prose max-w-none"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

interface MaterialDetailViewProps {
  id: string;
}

export function MaterialDetailView({ id }: MaterialDetailViewProps) {
  const router = useRouter();

  // 1. Fetch data materi dan tingkatan level kuis
  const { data: material, isLoading } = useFetchMaterialById(id);

  const { data: quizLevels, isLoading: isLevelsLoading } =
    useFetchQuizLevelsByMaterialId(id);

  // Ambil quizId dari relasi level kuis yang ada di materi ini
  const currentQuizId = quizLevels?.[0]?.quizId;

  // 2. Fetch status kuis secara reliabel (level-by-level)
  const { data: quizStatus, isLoading: isStatusLoading } = useFetchMyQuizStatus(
    currentQuizId || "",
  );

  // 3. Gunakan hook useCreateQuizAttempt
  const { mutateAsync: createAttempt, isPending: isCreatingAttempt } =
    useCreateQuizAttempt();

  // Resolve PDF URL
  const pdfUrl =
    material?.materialType === "file"
      ? material.sourceUrl || material.content
      : null;

  // We use relative URLs here because we've added a rewrite in next.config.ts
  // that proxies /storage/* requests to the backend.
  const absolutePdfUrl =
    pdfUrl && !pdfUrl.startsWith("http")
      ? `${pdfUrl.startsWith("/") ? "" : "/"}${pdfUrl}`
      : pdfUrl;

  // Handler dinamis untuk tombol kuis
  const handleQuizAction = async (
    quizId: string,
    levelId: string,
    existingAttemptId?: string | null,
  ) => {
    // A. Jika sudah ada attempt aktif (IN_PROGRESS atau COMPLETED), langsung arahkan ke halaman pengerjaan/hasil
    if (existingAttemptId) {
      router.push(`/quizzes/attempts/${existingAttemptId}`);
      return;
    }

    // B. Jika belum ada (NOT_STARTED), buat attempt baru untuk level tersebut
    try {
      const result = await createAttempt({ quizLevelId: levelId });
      router.push(`/quizzes/attempts/${result.attempt.id}`);
    } catch (error) {
      console.error("Failed to handle quiz action:", error);
    }
  };

  if (isLoading || isLevelsLoading || isStatusLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Materi tidak ditemukan</p>
        <Button variant="outline" asChild>
          <Link href="/materials">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="w-fit pl-0" asChild>
          <Link href="/materials">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Link>
        </Button>

        {absolutePdfUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={absolutePdfUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Browser
            </a>
          </Button>
        )}
      </div>

      {/* HEADER PANEL MATERI */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-xl font-bold text-white uppercase">
              {material.title.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-tight">
              {material.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className="text-xs uppercase tracking-wider"
              >
                {material.materialType}
              </Badge>
              <Badge
                variant={material.isPublished ? "default" : "outline"}
                className="text-xs"
              >
                {material.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        {material.description && (
          <p className="text-muted-foreground">{material.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{material.lecturerName || "Instructor"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(material.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* ISI KONTEN MATERI MODUL */}
      <Card>
        <CardContent className="p-6">
          {absolutePdfUrl ? (
            <PdfViewer url={absolutePdfUrl} />
          ) : material.content ? (
            <HtmlRenderer content={material.content} />
          ) : (
            <p className="text-muted-foreground italic">Konten kosong</p>
          )}
        </CardContent>
      </Card>

      {/* SEGMEN TINGKATAN KUIS ADAPTIF */}
      {quizStatus?.levels && quizStatus.levels.length > 0 && (
        <Card className="border-t-4 border-t-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Tingkat Kuis Tersedia</h2>
            </div>

            <div className="space-y-3">
              {quizStatus.levels.map((level) => {
                const isCompleted = level.status === "COMPLETED";
                const isInProgress = level.status === "IN_PROGRESS";

                return (
                  <div
                    key={level.levelId}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground">
                        {level.title}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        Status Kuis:{" "}
                        {isCompleted
                          ? "✅ Selesai"
                          : isInProgress
                            ? "🟡 Sedang Dikerjakan"
                            : "🟢 Siap Dimulai"}
                      </span>
                    </div>

                    <Button
                      onClick={() =>
                        handleQuizAction(
                          quizStatus.quizId,
                          level.levelId,
                          level.currentAttemptId,
                        )
                      }
                      disabled={isCreatingAttempt}
                      size="sm"
                      variant={isInProgress ? "secondary" : "default"}
                      className="font-medium shadow-sm"
                    >
                      {isCreatingAttempt ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      ) : isInProgress ? (
                        <ArrowRight className="mr-1.5 h-4 w-4 text-primary animate-pulse" />
                      ) : isCompleted ? (
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                      ) : (
                        <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                      )}
                      {isInProgress
                        ? "Lanjutkan"
                        : isCompleted
                          ? "Lihat Hasil"
                          : "Mulai Kuis"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
