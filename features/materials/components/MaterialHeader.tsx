"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { BookOpen } from "lucide-react";
import { materialsConfig } from "../config/materials";
import { CreateMaterialDialog } from "./CreateMaterialDialog";

export function MaterialHeader() {
  const t = useTranslations();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-branding-dark text-white">
          <BookOpen className="h-5 w-5 sm:h-7 sm:w-7" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            {t(materialsConfig.pageTitleKey)}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t(materialsConfig.descriptionKey)}
          </p>
        </div>
      </div>

      <CreateMaterialDialog />
    </div>
  );
}
