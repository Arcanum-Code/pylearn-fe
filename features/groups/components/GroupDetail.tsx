"use client";

import { useGroup, useDeleteGroup } from "../hooks/useGroups";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Edit,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GroupFormDialog } from "./GroupFormDialog";
import { Button } from "@/components/ui/button";
import {
  CreateMaterialDialog,
  EditMaterialDialog,
  DeleteMaterialDialog,
  usePublishMaterial,
} from "@/features/materials";
import { CreateLecturerQuizDialog } from "@/features/quizzes";
import { useAuth } from "@/features/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupDashboardView } from "@/features/dashboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConfirm } from "@/hooks/use-confirm";
import { StudentGroupDetail } from "./StudentGroupDetail";
import { GroupStudentList } from "./GroupStudentList";
import { useTranslations } from "@/lib/i18n/useTranslation";

export function GroupDetail({ id }: { id: string }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const isMahasiswa = user?.roleName?.toLowerCase() === "mahasiswa";
  const { data: group, isLoading } = useGroup(
    id,
    !isMahasiswa && !isAuthLoading,
  );
  const [editMaterialId, setEditMaterialId] = useState<string | null>(null);
  const [deleteMaterial, setDeleteMaterial] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const { mutate: publishMaterial, isPending: isPublishingMaterial } =
    usePublishMaterial(id);
  const router = useRouter();
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const deleteGroupMutation = useDeleteGroup();
  const { confirm } = useConfirm();
  const t = useTranslations();

  const handleDeleteClass = async () => {
    const isConfirmed = await confirm({
      title: "Hapus Kelas?",
      description: "Apakah Anda yakin ingin menghapus kelas ini?",
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "destructive",
    });

    if (isConfirmed && group) {
      deleteGroupMutation.mutate(group.id, {
        onSuccess: () => {
          router.push("/dashboard");
        },
      });
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center p-24 bg-[#F7F8FA] min-h-screen">
        <Spinner className="w-10 h-10 text-[#6366F1]" />
      </div>
    );
  }

  if (isMahasiswa) {
    return <StudentGroupDetail id={id} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-24 bg-[#F7F8FA] min-h-screen">
        <Spinner className="w-10 h-10 text-[#6366F1]" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-8 text-center font-mono bg-[#F7F8FA] min-h-screen">
        Kelas tidak ditemukan
      </div>
    );
  }

  const formatScheduledTime = (dateStr: string) => {
    return (
      new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(dateStr)) + " WIB"
    );
  };

  const contentGrid = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {/* Materials Bento Tile */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-150/60 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#6366F1]/10 text-[#6366F1] rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A1C1E]">
                  Materi Pembelajaran
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daftar materi yang ditugaskan ke kelas ini.
                </p>
              </div>
            </div>
            {!isMahasiswa && <CreateMaterialDialog groupId={group.id} />}
          </div>
          <div className="space-y-3">
            {group.materials?.length === 0 && (
              <p className="text-gray-400 font-mono text-sm py-4">
                Belum ada materi untuk kelas ini.
              </p>
            )}
            {group.materials?.map((m) => {
              const isScheduled =
                m.publishedAt && new Date(m.publishedAt) > new Date();
              const isPublished =
                m.isPublished ||
                (m.publishedAt && new Date(m.publishedAt) <= new Date());

              return (
                <div
                  key={m.id}
                  className="flex justify-between items-center p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/40"
                >
                  <span className="font-semibold text-sm text-[#1A1C1E]">
                    {m.title}
                  </span>
                  <div className="flex items-center gap-1">
                    {isScheduled ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider mr-1 bg-[#F59E0B]/10 text-[#F59E0B] cursor-help">
                            SCHEDULED
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          Akan diterbitkan otomatis pada{" "}
                          {formatScheduledTime(m.publishedAt!)}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider mr-1 ${
                          isPublished
                            ? "bg-[#10B981]/10 text-[#10B981]"
                            : "bg-neutral-500/10 text-neutral-500"
                        }`}
                      >
                        {isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-branding-dark hover:bg-branding-dark/90"
                          asChild
                        >
                          <Link href={`/materials/${m.id}`}>
                            <Eye className="w-4 h-4 text-white" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Lihat Detail</TooltipContent>
                    </Tooltip>

                    {!isMahasiswa && (
                      <>
                        {!isPublished && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600"
                                onClick={() => publishMaterial(m.id)}
                                disabled={isPublishingMaterial}
                                title="Publish Materi"
                              >
                                <CheckCircle className="w-4 h-4 text-white" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Terbitkan Sekarang</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-orange-500 hover:bg-orange-600"
                              onClick={() => setEditMaterialId(m.id)}
                            >
                              <Edit className="w-4 h-4 text-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Materi</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-destructive hover:bg-destructive/90"
                              onClick={() =>
                                setDeleteMaterial({ id: m.id, title: m.title })
                              }
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Hapus Materi</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {editMaterialId && (
          <EditMaterialDialog
            materialId={editMaterialId}
            isOpen={!!editMaterialId}
            onOpenChange={(open) => !open && setEditMaterialId(null)}
          />
        )}

        {deleteMaterial && (
          <DeleteMaterialDialog
            material={deleteMaterial}
            isOpen={!!deleteMaterial}
            onOpenChange={(open) => !open && setDeleteMaterial(null)}
          />
        )}
      </div>

      {/* Quizzes Bento Tile */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-150/60 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#10B981]/10 text-[#10B981] rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A1C1E]">Kuis Kelas</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daftar latihan kuis yang ditugaskan ke kelas ini.
                </p>
              </div>
            </div>
            {!isMahasiswa && <CreateLecturerQuizDialog groupId={group.id} />}
          </div>
          <div className="space-y-3">
            {group.quizzes?.length === 0 && (
              <p className="text-gray-400 font-mono text-sm py-4">
                Belum ada kuis untuk kelas ini.
              </p>
            )}
            {group.quizzes?.map((q) => (
              <div
                key={q.id}
                className="flex justify-between items-center p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/40"
              >
                <div>
                  {!isMahasiswa ? (
                    <Link
                      href={`/groups/${group.id}/quizzes/${q.id}`}
                      className="font-semibold text-sm text-[#6366F1] hover:underline block"
                    >
                      {q.title}
                    </Link>
                  ) : (
                    <span className="font-semibold text-sm text-[#1A1C1E] block">
                      {q.title}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-500 font-mono">
                    Level: {q.levelNumber}
                  </span>
                </div>
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider ${
                    q.isPublished
                      ? "bg-[#10B981]/10 text-[#10B981]"
                      : "bg-[#EF4444]/10 text-[#EF4444]"
                  }`}
                >
                  {q.isPublished ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="sm:p-2 md:p-4 max-w-7xl mx-auto space-y-6 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#6366F1] font-mono text-sm hover:underline mb-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
        </Link>

        {/* Dark Editor Accent Tile for Header */}
        <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl shadow-lg border border-gray-800 relative overflow-hidden">
          <div className="absolute right-8 top-8 opacity-5 text-gray-400">
            <GraduationCap className="w-36 h-36" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {group.name}
              </h1>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/40 border border-gray-800 font-mono text-xs text-[#10B981]">
                <span>uuid:</span>
                <span>{group.id}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(group.id);
                    toast.success("ID Kelas disalin!");
                  }}
                  className="text-[#10B981] hover:text-[#10B981]/80 ml-1 transition-colors cursor-pointer"
                  title="Salin ID Kelas"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-gray-300 max-w-3xl leading-relaxed text-sm">
                {group.description || "Tidak ada deskripsi untuk kelas ini."}
              </p>
            </div>

            {!isMahasiswa && (
              <div className="flex gap-2 shrink-0 md:mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditClassOpen(true)}
                  className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-1.5" /> Edit Kelas
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteClass}
                  className="bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl border-none font-mono text-xs cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> Hapus Kelas
                </Button>
              </div>
            )}
          </div>
        </div>

        {isMahasiswa ? (
          contentGrid
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white border border-gray-150/60 p-1 rounded-xl">
              <TabsTrigger
                value="overview"
                className="rounded-lg font-mono text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                {t("groups.tabs.overview")}
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="rounded-lg font-mono text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                {t("groups.tabs.content")}
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="rounded-lg font-mono text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                {t("groups.tabs.students")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 outline-none">
              <GroupDashboardView groupId={group.id} />
            </TabsContent>

            <TabsContent value="content" className="space-y-6 outline-none">
              {contentGrid}
            </TabsContent>

            <TabsContent value="students" className="space-y-6 outline-none">
              <GroupStudentList groupId={group.id} />
            </TabsContent>
          </Tabs>
        )}

        {!isMahasiswa && (
          <GroupFormDialog
            isOpen={isEditClassOpen}
            onClose={() => setIsEditClassOpen(false)}
            group={group}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
