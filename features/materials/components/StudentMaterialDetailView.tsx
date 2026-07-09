"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useFetchStudentMaterialById,
  useUpdateMaterialProgress,
} from "@/features/materials/hooks/useMaterials";
import { useStudentGroup } from "@/features/groups/hooks/useGroups";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  User,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { API_ENDPOINTS } from "@/app/api/api";
import { toast } from "sonner";

const PdfViewer = dynamic(
  () => import("./PdfViewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />,
  },
);

const HtmlRenderer = ({ content }: { content: string }) => (
  <div
    className="prose max-w-none text-gray-800 leading-relaxed font-sans"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

interface StudentMaterialDetailViewProps {
  groupId: string;
  materialId: string;
}

export function StudentMaterialDetailView({
  groupId,
  materialId,
}: StudentMaterialDetailViewProps) {
  const router = useRouter();

  // 1. Fetch material details
  const { data: material, isLoading } = useFetchStudentMaterialById(materialId);
  // Fetch group detail (to get group name for the hero header)
  const { data: group } = useStudentGroup(groupId);

  // 2. Setup progress update mutation
  const updateProgressMutation = useUpdateMaterialProgress(groupId);

  // 3. Local progress tracking
  const [maxProgress, setMaxProgress] = useState(0);
  const maxProgressRef = useRef(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safely extract API properties supporting both camelCase and snake_case
  const scrollPercentage = material
    ? material.scrollPercentage !== undefined
      ? material.scrollPercentage
      : (material as any).scroll_percentage
    : 0;

  const currentStatus = material ? material.status : "not_started";

  const prevMaterialId = material?.navigation
    ? material.navigation.prevMaterialId !== undefined
      ? material.navigation.prevMaterialId
      : (material.navigation as any).prev_material_id
    : null;

  const nextMaterialId = material?.navigation
    ? material.navigation.nextMaterialId !== undefined
      ? material.navigation.nextMaterialId
      : (material.navigation as any).next_material_id
    : null;

  // Initialize progress from fetched data
  useEffect(() => {
    if (scrollPercentage) {
      setMaxProgress(scrollPercentage);
      maxProgressRef.current = scrollPercentage;
    }
  }, [scrollPercentage]);

  // Debounced scroll progress update
  const triggerProgressUpdate = (
    status: "in_progress" | "completed",
    pct: number,
  ) => {
    console.log("triggerProgressUpdate called:", { status, pct });
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      console.log("Debounce timeout finished, executing progress mutation:", {
        materialId,
        status,
        scrollPercentage: pct,
      });
      updateProgressMutation.mutate({
        materialId,
        status,
        scrollPercentage: pct,
      });
    }, 2000); // 2s debounce
  };

  // Scroll event listener for HTML materials
  useEffect(() => {
    if (
      !material ||
      currentStatus === "completed" ||
      material.materialType === "file"
    )
      return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScrollableHeight = scrollHeight - clientHeight;

      if (totalScrollableHeight <= 0) return;

      const percentage = Math.min(
        100,
        Math.max(0, Math.round((scrollTop / totalScrollableHeight) * 100)),
      );

      if (percentage > maxProgressRef.current) {
        maxProgressRef.current = percentage;
        setMaxProgress(percentage);

        // Auto-complete if reading reaches 95%
        if (percentage >= 95) {
          triggerProgressUpdate("completed", 100);
        } else {
          triggerProgressUpdate("in_progress", percentage);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [material, currentStatus, materialId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Handle scroll events inside PDF Viewer
  const handlePdfScroll = (percentage: number) => {
    console.log(
      "handlePdfScroll received percentage:",
      percentage,
      "currentStatus:",
      currentStatus,
      "maxProgressRef:",
      maxProgressRef.current,
    );
    if (currentStatus === "completed") return;
    if (percentage > maxProgressRef.current) {
      maxProgressRef.current = percentage;
      setMaxProgress(percentage);

      // Auto-complete if reading reaches 95%
      if (percentage >= 95) {
        triggerProgressUpdate("completed", 100);
      } else {
        triggerProgressUpdate("in_progress", percentage);
      }
    }
  };

  // Handler to manually mark as completed
  const handleMarkAsCompleted = () => {
    maxProgressRef.current = 100;
    setMaxProgress(100);
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateProgressMutation.mutate(
      {
        materialId,
        status: "completed",
        scrollPercentage: 100,
      },
      {
        onSuccess: () => {
          toast.success("Materi berhasil diselesaikan!");
        },
      },
    );
  };

  const attachmentUrl = material
    ? material.attachmentUrl !== undefined
      ? material.attachmentUrl
      : (material as any).attachment_url
    : null;

  // Resolve PDF URL if attachmentUrl exists or if content ends with .pdf
  const pdfUrl =
    attachmentUrl ||
    (material?.content && material.content.endsWith(".pdf")
      ? material.content
      : null);

  const absolutePdfUrl =
    pdfUrl && !pdfUrl.startsWith("http")
      ? API_ENDPOINTS.STORAGE(pdfUrl)
      : pdfUrl;

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-screen text-center bg-[#F7F8FA]">
        <p className="text-muted-foreground font-semibold">
          Materi tidak ditemukan
        </p>
        <Button variant="outline" asChild>
          <Link href={`/groups/${groupId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Kelas
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="sm:p-2 md:p-4 max-w-7xl mx-auto space-y-6 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
        {/* Breadcrumb Back Link */}
        <Link
          href={`/groups/${groupId}`}
          className="inline-flex items-center text-[#6366F1] font-mono text-sm hover:underline mb-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Kelas
        </Link>

        {/* Scoped Premium Hero Header */}
        <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl shadow-lg border border-gray-800 relative overflow-hidden">
          <div className="absolute right-8 top-8 opacity-5 text-gray-400">
            <BookOpen className="w-36 h-36" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 flex-1">
              {group?.groupName && (
                <div className="text-[#6366F1] font-mono text-xs uppercase tracking-wider font-semibold">
                  {group.groupName}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {material.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{material.lecturerName || "Instructor"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(material.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border-none uppercase text-[10px] tracking-wider"
                >
                  {material.materialType}
                </Badge>
              </div>
            </div>

            {/* Reading progress metrics */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shrink-0 w-full md:w-64 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">
                  Progress Membaca
                </span>
                <span className="text-[#10B981] font-bold">
                  {currentStatus === "completed"
                    ? 100
                    : Math.round(maxProgress)}
                  %
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#10B981] to-emerald-400 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${currentStatus === "completed" ? 100 : maxProgress}%`,
                  }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-400 text-center">
                {currentStatus === "completed" ? (
                  <span className="text-[#10B981] font-bold flex items-center justify-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Materi Selesai
                  </span>
                ) : (
                  <span>Gulir ke bawah untuk menyelesaikan materi</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Material Content Area */}
        <Card className="border border-gray-150/60 shadow-xs overflow-hidden">
          <CardContent
            className={
              absolutePdfUrl ? "p-1 sm:p-6 md:p-8" : "p-4 sm:p-8 md:p-12"
            }
          >
            {absolutePdfUrl ? (
              <div className="space-y-4">
                <div className="flex justify-end px-2 sm:px-0 pt-2 sm:pt-0">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={absolutePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buka PDF di Tab Baru
                    </a>
                  </Button>
                </div>
                <PdfViewer
                  url={absolutePdfUrl}
                  onScroll={handlePdfScroll}
                  initialScrollPercentage={scrollPercentage}
                  currentStatus={currentStatus}
                />
              </div>
            ) : material.content ? (
              <HtmlRenderer content={material.content} />
            ) : (
              <p className="text-muted-foreground italic text-center py-12">
                Konten materi kosong.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Bottom Panel (Mark as Finished & Navigation) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-gray-150/60 shadow-xs">
          {/* Previous Material Button */}
          <div className="w-full sm:w-auto">
            {prevMaterialId ? (
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-200 text-gray-700 font-semibold"
                asChild
              >
                <Link href={`/groups/${groupId}/materials/${prevMaterialId}`}>
                  <ChevronLeft className="h-4 w-4 mr-1.5" />
                  Materi Sebelumnya
                </Link>
              </Button>
            ) : (
              <div className="w-0 sm:w-28" />
            )}
          </div>

          {/* Center: Mark as Finished Button */}
          <div className="w-full sm:w-auto flex justify-center">
            {currentStatus === "completed" ? (
              <Button
                disabled
                className="w-full sm:w-auto bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 font-bold px-8 py-5 h-auto rounded-xl flex items-center gap-2 cursor-not-allowed"
              >
                <CheckCircle className="h-5 w-5 text-green-600" />
                Selesai Dibaca
              </Button>
            ) : (
              <Button
                onClick={handleMarkAsCompleted}
                disabled={updateProgressMutation.isPending}
                className="w-full sm:w-auto bg-[#10B981] hover:bg-[#0D9488] text-white font-bold px-8 py-5 h-auto rounded-xl shadow-md transition-all cursor-pointer"
              >
                {updateProgressMutation.isPending ? (
                  <Spinner className="h-5 w-5 text-white mr-2" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                Tandai Selesai
              </Button>
            )}
          </div>

          {/* Next Material Button */}
          <div className="w-full sm:w-auto text-right">
            {nextMaterialId ? (
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-200 text-gray-700 font-semibold"
                asChild
              >
                <Link href={`/groups/${groupId}/materials/${nextMaterialId}`}>
                  Materi Selanjutnya
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-200 text-[#6366F1] font-semibold"
                asChild
              >
                <Link href={`/groups/${groupId}`}>
                  Kembali ke Kelas
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
