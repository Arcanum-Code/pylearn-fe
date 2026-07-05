"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import { MaterialForm } from "./MaterialForm";
import { useUpdateMaterial, useFetchMaterialById } from "../hooks/useMaterials";
import { UpdateMaterialRequest } from "../types";
import { Spinner } from "@/components/ui/spinner";

interface EditMaterialDialogProps {
  materialId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMaterialDialog({
  materialId,
  isOpen,
  onOpenChange,
}: EditMaterialDialogProps) {
  const t = useTranslations();
  const { data: material, isLoading } = useFetchMaterialById(isOpen ? materialId : null);
  const { mutate: updateMaterial, isPending } = useUpdateMaterial();

  const onSubmit = (values: any) => {
    if (!material) return;
    const formData = new FormData();

    // 1. Amankan nilai materialType (Pastikan mengekstrak string murni)
    const rawMaterialType =
      typeof values.materialType === "object"
        ? values.materialType?.value // Jika berbentuk objek select option
        : values.materialType; // Jika sudah berbentuk string murni

    // Saring agar jika kosong, gunakan tipe bawaan materi asli sebagai fallback
    const finalMaterialType = rawMaterialType || material.materialType;

    // 2. Append ke FormData
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("materialType", finalMaterialType); // Menggunakan nilai yang sudah aman
    formData.append("iconName", values.iconName);
    formData.append("isPublished", String(values.isPublished));

    // 3. Kondisional Penanganan Isi Materi
    if (finalMaterialType === "text") {
      formData.append("content", values.content || "");
    } else if (finalMaterialType === "file") {
      if (values.file instanceof File) {
        formData.append("file", values.file);
      }
    }

    // 4. Jalankan Mutasi
    updateMaterial(
      { id: material.id, data: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const initialValues: UpdateMaterialRequest | undefined = material
    ? {
        title: material.title,
        description: material.description,
        content: material.content,
        iconName: material.iconName,
        isPublished: material.isPublished,
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-branding-dark">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {t("materials.dialog.edit.title") || "Edit Learning Material"}
              </DialogTitle>
              <DialogDescription>
                {t("materials.dialog.edit.description") ||
                  "Update the details of your learning material."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading || !material ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : (
          <MaterialForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            isLoading={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
