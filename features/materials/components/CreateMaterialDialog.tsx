"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n/useTranslation";
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
import { CreateMaterialRequest } from "../types";

export function CreateMaterialDialog() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const { mutate: createMaterial, isPending } = useCreateMaterial();

  const onSubmit = (data: CreateMaterialRequest) => {
    createMaterial(data, {
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
          {t("materials.header.create")}
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
                {t("materials.dialog.create.title")}
              </DialogTitle>
              <DialogDescription>
                {t("materials.dialog.create.description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <MaterialForm onSubmit={onSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}
