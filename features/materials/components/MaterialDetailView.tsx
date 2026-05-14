"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { useFetchMaterialById } from "../hooks/useMaterials";
import { HtmlRenderer } from "./HtmlRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { materialTypeIcons } from "../config/materials";
import { icons, ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";

interface MaterialDetailViewProps {
  id: string;
}

export function MaterialDetailView({ id }: MaterialDetailViewProps) {
  const t = useTranslations();
  const { data: material, isLoading } = useFetchMaterialById(id);

  const TypeIcon = material?.materialType
    ? materialTypeIcons[material.materialType] || materialTypeIcons.text
    : null;

  const DynamicIcon = material?.iconName
    ? (icons[material.iconName as keyof typeof icons] as React.ElementType)
    : null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">{t("materials.detail.notFound")}</p>
        <Button variant="outline" asChild>
          <Link href="/materials">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("materials.detail.backToList")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" className="w-fit pl-0" asChild>
        <Link href="/materials">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("materials.detail.backToList")}
        </Link>
      </Button>

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-branding-dark flex items-center justify-center shadow-lg shadow-branding-dark/20 flex-shrink-0">
            {DynamicIcon ? (
              <DynamicIcon className="h-7 w-7 text-white" />
            ) : (
              <span className="text-xl font-bold text-white uppercase" suppressHydrationWarning>
                {material.title.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-tight">
              {material.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {TypeIcon && (
                <div className="p-1 rounded-md bg-muted">
                  <TypeIcon className="h-4 w-4 text-branding-dark" />
                </div>
              )}
              <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                {t(`materials.types.${material.materialType}`)}
              </Badge>
              <Badge variant={material.isPublished ? "default" : "outline"} className="text-xs">
                {material.isPublished
                  ? t("materials.status.published")
                  : t("materials.status.draft")}
              </Badge>
            </div>
          </div>
        </div>

        {material.description && (
          <p className="text-muted-foreground">{material.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border">
              <User className="h-3 w-3" />
            </div>
            <span>{material.lecturerName || "Instructor"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span suppressHydrationWarning>
              {new Date(material.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {material.content ? (
            <HtmlRenderer content={material.content} />
          ) : (
            <p className="text-muted-foreground italic">
              {t("materials.detail.noContent")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}