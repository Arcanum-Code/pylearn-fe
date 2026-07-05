"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteMaterial } from "../hooks/useMaterials";
import { Material } from "../types";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle } from "lucide-react";

interface DeleteMaterialDialogProps {
  material: { id: string; title: string };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteMaterialDialog({
  material,
  isOpen,
  onOpenChange,
}: DeleteMaterialDialogProps) {
  const t = useTranslations();
  const { mutate: deleteMaterial, isPending } = useDeleteMaterial();

  const onConfirm = () => {
    deleteMaterial(material.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl">
              {t("materials.dialog.delete.title")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm">
            {t("materials.dialog.delete.description", { title: material.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isPending}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {t("common.delete")}
              </>
            ) : (
              t("common.delete")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
