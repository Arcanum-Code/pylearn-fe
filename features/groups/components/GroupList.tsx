"use client";

import { useState } from "react";
import { useGroups, useDeleteGroup } from "../hooks/useGroups";
import { GroupFormDialog } from "./GroupFormDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Group } from "../types";
import { Trash, Edit, Plus, FolderKanban } from "lucide-react";

export function GroupList() {
  const { data: groups, isLoading } = useGroups();
  const deleteMutation = useDeleteGroup();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const handleEdit = (e: React.MouseEvent, group: Group) => {
    e.preventDefault();
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
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
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
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

        {groups?.map((group, i) => {
          const isDarkTile = i % 4 === 0;
          return (
            <Link
              href={`/groups/${group.id}`}
              key={group.id}
              className="block group/item focus:outline-none"
            >
              <div
                className={`p-6 rounded-2xl shadow-xs border transition-all duration-200 group-hover/item:-translate-y-1 group-hover/item:shadow-md h-full flex flex-col justify-between ${
                  isDarkTile
                    ? "bg-[#1E1E2E] text-gray-200 border-gray-800"
                    : "bg-white text-[#1A1C1E] border-gray-150/60"
                }`}
              >
                <div>
                  <h3
                    className={`text-xl font-bold mb-2 tracking-tight group-hover/item:text-[#6366F1] transition-colors ${
                      isDarkTile ? "text-white" : "text-[#1A1C1E]"
                    }`}
                  >
                    {group.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 leading-relaxed line-clamp-3 ${
                      isDarkTile ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {group.description || "Tidak ada deskripsi"}
                  </p>
                  <div
                    className={`inline-block px-3 py-1 rounded-md font-mono text-xs font-semibold ${
                      isDarkTile
                        ? "bg-[#10B981]/20 text-[#10B981]"
                        : "bg-[#10B981]/10 text-[#10B981]"
                    }`}
                  >
                    ID: {group.id.slice(0, 8)}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-150/20">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleEdit(e, group)}
                    className={`h-9 w-9 rounded-lg transition-colors ${
                      isDarkTile
                        ? "text-gray-400 hover:text-white hover:bg-gray-800"
                        : "text-gray-400 hover:text-[#6366F1] hover:bg-gray-50"
                    }`}
                  >
                    <Edit className="w-4.5 h-4.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, group.id)}
                    className={`h-9 w-9 rounded-lg transition-colors ${
                      isDarkTile
                        ? "text-gray-400 hover:text-[#EF4444] hover:bg-gray-800"
                        : "text-gray-400 hover:text-[#EF4444] hover:bg-gray-50"
                    }`}
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
