"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupFormData, groupSchema } from "../schemas/group.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateGroup, useUpdateGroup } from "../hooks/useGroups";
import { Group } from "../types";
import { useEffect } from "react";

interface GroupFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group?: Group | null;
}

export function GroupFormDialog({
  isOpen,
  onClose,
  group,
}: GroupFormDialogProps) {
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: "", description: "", level: "BASIC" },
  });

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        description: group.description || "",
        level: group.level || "BASIC",
      });
    } else {
      reset({ name: "", description: "", level: "BASIC" });
    }
  }, [group, reset]);

  const onSubmit = (data: GroupFormData) => {
    if (group) {
      updateMutation.mutate({ id: group.id, data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#F7F8FA] rounded-2xl border border-gray-200/50 shadow-xl text-[#1A1C1E] max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl font-sans tracking-tight">
            {group ? "Ubah Kelas" : "Buat Kelas"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#1A1C1E]">Nama Kelas</label>
            <Input
              {...register("name")}
              placeholder="Masukkan nama kelas (cth: Kelas Python Dasar A)"
              className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1] bg-white rounded-xl py-2 px-3 text-sm transition-colors"
            />
            {errors.name && (
              <span className="text-[#EF4444] text-xs font-mono block mt-1">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#1A1C1E]">Tingkat Kelas</label>
            <Select
              value={watch("level")}
              onValueChange={(value) => setValue("level", value as any)}
            >
              <SelectTrigger className="w-full border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1] bg-white rounded-xl h-10 text-left px-3 text-sm">
                <SelectValue placeholder="Pilih tingkat kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASIC">Dasar (Basic)</SelectItem>
                <SelectItem value="INTERMEDIATE">Menengah (Intermediate)</SelectItem>
                <SelectItem value="ADVANCED">Lanjut (Advanced)</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && (
              <span className="text-[#EF4444] text-xs font-mono block mt-1">
                {errors.level.message}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#1A1C1E]">Deskripsi</label>
            <Input
              {...register("description")}
              placeholder="Masukkan deskripsi kelas (opsional)"
              className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1] bg-white rounded-xl py-2 px-3 text-sm transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-mono text-sm border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-sm shadow-sm transition-colors"
            >
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

