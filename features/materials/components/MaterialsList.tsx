"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { MaterialCard } from "./MaterialCard";
import { Material } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface MaterialsListProps {
  data: Material[];
  isLoading: boolean;
}

const MaterialSkeleton = () => (
  <Card className="flex flex-col h-full">
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  </Card>
);

export function MaterialsList({ data, isLoading }: MaterialsListProps) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <MaterialSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
          {t("materials.noResults")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((material) => (
        <MaterialCard key={material.id} material={material} readOnly={true} />
      ))}
    </div>
  );
}
