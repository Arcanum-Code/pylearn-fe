"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentGroup } from "../hooks/useGroups";
import { TimelineItem } from "../types";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  GraduationCap, 
  ArrowRight, 
  HelpCircle, 
  Clock, 
  Play, 
  Award,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getQuizAttempts, createQuizAttempt, getQuizLevels } from "@/features/quizzes/services/quizApi";

export function StudentGroupDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: detail, isLoading } = useStudentGroup(id);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleQuizAction = async (item: TimelineItem) => {
    setActionLoadingId(item.id);
    try {
      // Fetch attempts for this quiz
      const attempts = await getQuizAttempts({ quizId: item.id });
      
      if (item.status === "completed") {
        const completedAttempt = attempts.find(a => !!a.submittedAt);
        if (completedAttempt) {
          router.push(`/quizzes/attempts/${completedAttempt.id}`);
          return;
        }
      } else if (item.status === "in_progress") {
        const activeAttempt = attempts.find(a => !a.submittedAt);
        if (activeAttempt) {
          router.push(`/quizzes/attempts/${activeAttempt.id}`);
          return;
        }
      }
      
      // If not started or no attempt found, start a new one
      const levels = await getQuizLevels(item.id);
      if (levels && levels.length > 0) {
        // Sort levels by levelOrder and take the first one
        const sortedLevels = [...levels].sort((a, b) => a.levelOrder - b.levelOrder);
        const firstLevel = sortedLevels[0];
        
        const { attempt } = await createQuizAttempt({ quizLevelId: firstLevel.id });
        router.push(`/quizzes/attempts/${attempt.id}`);
      } else {
        toast.error("Kuis ini belum memiliki level pertanyaan.");
      }
    } catch (error: any) {
      console.error("Quiz action error:", error);
      toast.error(error?.response?.data?.message || "Gagal memproses pengerjaan kuis.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDeadline = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(dateStr)) + " WIB";
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-8 text-center font-mono bg-[#F7F8FA] min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-gray-600 font-semibold">Kelas tidak ditemukan</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-8 max-w-5xl mx-auto space-y-8 bg-[#F7F8FA] min-h-screen text-[#1A1C1E]">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#6366F1] font-mono text-sm hover:underline mb-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
        </Link>

        {/* Hero Card */}
        <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl shadow-lg border border-gray-800 relative overflow-hidden">
          <div className="absolute right-8 top-8 opacity-5 text-gray-400">
            <GraduationCap className="w-36 h-36" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {detail.groupName}
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                Dosen Pengampu: <span className="text-white font-semibold">{detail.lecturerName || "Instructor"}</span>
              </p>
              <p className="text-gray-300 max-w-3xl leading-relaxed text-sm">
                {detail.description || "Tidak ada deskripsi untuk kelas ini."}
              </p>
            </div>

            {/* Progress Circle/Bar */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shrink-0 w-full md:w-64 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">Progress Belajar</span>
                <span className="text-[#10B981] font-bold">{detail.progress.percentage}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#10B981] to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${detail.progress.percentage}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-400 text-center">
                {detail.progress.materialsCompleted} dari {detail.progress.materialsTotal} materi selesai dibaca
              </p>
            </div>
          </div>
        </div>

        {/* Learning Journey / Timeline */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#6366F1]" />
            Alur Pembelajaran
          </h2>

          <div className="relative pl-6 border-l-2 border-gray-200 ml-4 space-y-8">
            {detail.items.length === 0 ? (
              <p className="text-muted-foreground italic text-sm py-4">Belum ada materi atau kuis di kelas ini.</p>
            ) : (
              detail.items.map((item, index) => {
                const isMaterial = item.type === "material";
                
                // Styling parameters based on status and type
                let cardClass = "bg-white border-gray-150/60";
                let iconBgClass = "";
                let iconColorClass = "";
                let statusBadge = null;
                let actionButton = null;

                if (isMaterial) {
                  iconBgClass = "bg-blue-50 text-blue-500";
                  if (item.status === "completed") {
                    cardClass = "bg-white border-green-100";
                    iconBgClass = "bg-green-50 text-green-500";
                    statusBadge = <Badge className="bg-green-50 hover:bg-green-50 text-green-700 border border-green-200 font-medium">Selesai</Badge>;
                    actionButton = (
                      <Button size="sm" variant="outline" className="border-gray-250 text-gray-700 font-semibold" asChild>
                        <Link href={`/materials/${item.id}`}>Baca Ulang</Link>
                      </Button>
                    );
                  } else if (item.status === "in_progress") {
                    cardClass = "bg-white border-orange-100";
                    iconBgClass = "bg-orange-50 text-orange-500";
                    statusBadge = <Badge className="bg-orange-50 hover:bg-orange-50 text-orange-700 border border-orange-200 font-medium">Sedang Dibaca ({item.scrollPercentage}%)</Badge>;
                    actionButton = (
                      <Button size="sm" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold" asChild>
                        <Link href={`/materials/${item.id}`}>Lanjutkan</Link>
                      </Button>
                    );
                  } else {
                    statusBadge = <Badge variant="outline" className="text-gray-400 border-gray-200 bg-white">Belum Mulai</Badge>;
                    actionButton = (
                      <Button size="sm" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold" asChild>
                        <Link href={`/materials/${item.id}`}>Mulai Belajar</Link>
                      </Button>
                    );
                  }
                } else {
                  // Quiz Item
                  iconBgClass = "bg-purple-50 text-purple-500";
                  if (item.status === "completed") {
                    cardClass = "bg-white border-green-100";
                    iconBgClass = "bg-green-50 text-green-500";
                    statusBadge = (
                      <Badge className="bg-green-50 hover:bg-green-50 text-green-700 border border-green-200 font-medium flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Selesai {item.bestScore !== null ? `(Skor Terbaik: ${item.bestScore})` : ""}
                      </Badge>
                    );
                    actionButton = (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={actionLoadingId === item.id}
                        onClick={() => handleQuizAction(item)}
                        className="border-green-200 text-green-700 hover:bg-green-50 font-semibold"
                      >
                        {actionLoadingId === item.id ? <Spinner className="h-4 w-4 text-green-700" /> : "Lihat Hasil"}
                      </Button>
                    );
                  } else if (item.status === "in_progress") {
                    cardClass = "bg-white border-orange-100";
                    iconBgClass = "bg-orange-50 text-orange-500";
                    statusBadge = <Badge className="bg-orange-50 hover:bg-orange-50 text-orange-700 border border-orange-250 font-medium">Sedang Dikerjakan</Badge>;
                    actionButton = (
                      <Button 
                        size="sm" 
                        disabled={actionLoadingId === item.id}
                        onClick={() => handleQuizAction(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                      >
                        {actionLoadingId === item.id ? <Spinner className="h-4 w-4 text-white" /> : "Lanjutkan Kuis"}
                      </Button>
                    );
                  } else {
                    statusBadge = <Badge className="bg-purple-50 hover:bg-purple-50 text-purple-700 border border-purple-200 font-medium">Tersedia</Badge>;
                    actionButton = (
                      <Button 
                        size="sm" 
                        disabled={actionLoadingId === item.id}
                        onClick={() => handleQuizAction(item)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                      >
                        {actionLoadingId === item.id ? <Spinner className="h-4 w-4 text-white" /> : "Kerjakan Kuis"}
                      </Button>
                    );
                  }
                }

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node dot */}
                    <span className={`absolute -left-[33px] top-4 flex items-center justify-center w-5 h-5 rounded-full ring-4 ring-[#F7F8FA] z-10 ${
                      item.status === "completed" ? "bg-green-500" : item.status === "in_progress" ? "bg-orange-400" : "bg-gray-300"
                    }`}>
                      {item.status === "completed" && <CheckCircle className="h-3 w-3 text-white" />}
                    </span>

                    {/* Step Card */}
                    <Card className={`border shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden ${cardClass}`}>
                      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className={`p-3 rounded-xl flex-shrink-0 ${iconBgClass}`}>
                            {isMaterial ? <BookOpen className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
                          </div>
                          
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">
                                {isMaterial ? "Materi Pembelajaran" : "Evaluasi Kuis"}
                              </span>
                              {statusBadge}
                            </div>
                            
                            <h3 className="font-bold text-sm md:text-base truncate text-gray-800">{item.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                              {item.description || "Tidak ada deskripsi tambahan."}
                            </p>

                            {!isMaterial && item.deadline && (
                              <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-medium">
                                <Clock className="h-3 w-3" />
                                <span>Batas Waktu: {formatDeadline(item.deadline)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="w-full sm:w-auto shrink-0 flex justify-end">
                          {actionButton}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
