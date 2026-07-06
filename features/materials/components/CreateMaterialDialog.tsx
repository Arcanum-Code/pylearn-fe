"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { MaterialForm } from "./MaterialForm";
import { useCreateMaterial } from "../hooks/useMaterials";

export function CreateMaterialDialog({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate: createMaterial, isPending } = useCreateMaterial();

  const onSubmit = (values: any) => {
    const formData = new FormData();

    formData.append("groupId", groupId);
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("materialType", "file");

    if (values.publishImmediately) {
      formData.append("publishedAt", new Date().toISOString());
    } else if (values.publishedAt) {
      formData.append("publishedAt", values.publishedAt.toISOString());
    }

    if (values.file) {
      formData.append("file", values.file);
    }

    createMaterial(formData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-branding-dark gap-2">
          <Plus className="h-4 w-4" />
          Buat Materi Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-branding-dark">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Tambah Materi Pembelajaran
              </DialogTitle>
              <DialogDescription>
                Isi formulir di bawah untuk mengunggah file PDF materi pembelajaran.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* The MaterialForm now receives this updated onSubmit */}
        <MaterialForm onSubmit={onSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}
