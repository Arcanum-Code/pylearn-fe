"use client";

import { useState } from "react";
import { useGroups, useDeleteGroup } from "../hooks/useGroups";
import { GroupFormDialog } from "./GroupFormDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Group } from "../types";
import {
  Trash,
  Edit,
  Plus,
  FolderKanban,
  Sprout,
  Compass,
  Rocket,
  Users,
  BookOpen,
  HelpCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

const levelConfig = {
  BASIC: {
    label: "Dasar",
    borderColor: "border-t-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    icon: Sprout,
  },
  INTERMEDIATE: {
    label: "Menengah",
    borderColor: "border-t-amber-500",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200/50",
    icon: Compass,
  },
  ADVANCED: {
    label: "Lanjut",
    borderColor: "border-t-rose-500",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200/50",
    icon: Rocket,
  },
};

export function GroupList() {
  const { data: groups, isLoading } = useGroups();
  const deleteMutation = useDeleteGroup();
  const { confirm } = useConfirm();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const handleEdit = (e: React.MouseEvent, group: Group) => {
    e.preventDefault();
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const isConfirmed = await confirm({
      title: "Hapus Kelas?",
      description: "Apakah Anda yakin ingin menghapus kelas ini?",
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "destructive",
    });

    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-24 bg-[#F7F8FA] min-h-screen">
        <Spinner className="w-10 h-10 text-[#6366F1]" />
      </div>
    );
  }

  return (
    <div className="sm:p-2 md:p-4 max-w-7xl mx-auto space-y-8 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-gray-150/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#6366F1]/10 text-[#6366F1] rounded-xl">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1C1E]">
              Kelola Kelas
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Atur kelas, materi, dan kuis yang ditugaskan kepada siswa.
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingGroup(null);
            setIsDialogOpen(true);
          }}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl shadow-md font-mono font-medium text-sm flex items-center gap-2 py-2 px-4 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Buat Kelas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.length === 0 && (
          <div className="bg-white col-span-full border border-dashed border-gray-200 rounded-2xl p-16 text-center">
            <p className="text-gray-400 font-mono text-sm">Belum ada kelas.</p>
          </div>
        )}

        {groups?.map((group) => {
          const level = group.level || "BASIC";
          const config = levelConfig[level];
          const LevelIcon = config.icon;

          const handleCopyId = (e: React.MouseEvent, id: string) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(id);
            toast.success("ID Kelas disalin!");
          };

          return (
            <Link
              href={`/groups/${group.id}`}
              key={group.id}
              className="block group/item focus:outline-none"
            >
              <div
                className={`rounded-2xl shadow-xs border border-gray-150/60 bg-white text-[#1A1C1E] transition-all duration-200 group-hover/item:-translate-y-1 group-hover/item:shadow-md h-full flex flex-col justify-between border-t-4 ${config.borderColor}`}
              >
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${config.badgeClass}`}
                      >
                        <LevelIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                      <button
                        onClick={(e) => handleCopyId(e, group.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                        title="Salin ID Kelas"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight group-hover/item:text-[#6366F1] transition-colors text-[#1A1C1E]">
                      {group.name}
                    </h3>
                  </div>

                  {/* Metrics Section */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100/50">
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                      <Users className="w-4.5 h-4.5 text-gray-400 mb-1" />
                      <span className="text-sm font-bold text-gray-700">
                        {group._count?.users ?? 0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                        Siswa
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                      <BookOpen className="w-4.5 h-4.5 text-gray-400 mb-1" />
                      <span className="text-sm font-bold text-gray-700">
                        {group._count?.materials ?? 0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                        Materi
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                      <HelpCircle className="w-4.5 h-4.5 text-gray-400 mb-1" />
                      <span className="text-sm font-bold text-gray-700">
                        {group._count?.quizzes ?? 0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                        Kuis
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions Divider & Buttons */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-150/40 flex justify-end gap-2 bg-gray-50/30 rounded-b-2xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleEdit(e, group)}
                    className="h-9 w-9 rounded-lg text-gray-400 hover:text-[#6366F1] hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-4.5 h-4.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, group.id)}
                    className="h-9 w-9 rounded-lg text-gray-400 hover:text-[#EF4444] hover:bg-gray-100 transition-colors"
                  >
                    <Trash className="w-4.5 h-4.5" />
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <GroupFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        group={editingGroup}
      />
    </div>
  );
}
