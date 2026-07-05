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
    // 1. Create a new FormData instance
    const formData = new FormData();

    // 2. Append standard text fields
    formData.append("groupId", groupId);
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("materialType", values.materialType);
    formData.append("iconName", values.iconName);
    formData.append("isPublished", String(values.isPublished));

    // 3. Logic to handle Text vs PDF file
    if (values.materialType === "text") {
      formData.append("content", values.content || "");
    } else if (values.materialType === "file" && values.file) {
      // This specifically triggers the multipart/form-data encoding
      formData.append("file", values.file);
    }

    // 4. Pass the FormData object to the mutation
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
                Isi formulir di bawah untuk membuat materi teks atau mengunggah
                file PDF.
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
