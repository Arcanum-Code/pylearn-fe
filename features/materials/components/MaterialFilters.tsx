"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Filter, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { materialsConfig } from "../config/materials";
import { MaterialType } from "../types";

import { useGroups } from "@/features/groups/hooks/useGroups";

interface MaterialFiltersProps {
  materialType: MaterialType | "";
  isPublished: boolean | undefined;
  groupId: string;
  onTypeChange: (value: MaterialType | "") => void;
  onStatusChange: (value: boolean | undefined) => void;
  onGroupChange: (value: string) => void;
}

export function MaterialFilters({
  materialType,
  isPublished,
  groupId,
  onTypeChange,
  onStatusChange,
  onGroupChange,
}: MaterialFiltersProps) {
  const t = useTranslations();
  const { data: groups } = useGroups();

  const typeLabel = materialType
    ? t(`materials.types.${materialType}`)
    : t("materials.filters.allTypes");

  const selectedGroup = groups?.find((g) => g.id === groupId);
  const groupLabel = selectedGroup ? selectedGroup.name : "Semua Kelas";

  return (
    <Card>
      <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm md:text-base">
              {t(materialsConfig.filters.titleKey)}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t(materialsConfig.filters.descriptionKey)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3">
                <span className="text-muted-foreground mr-1">
                  {t(materialsConfig.filters.typeKey)}:
                </span>
                {typeLabel}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onTypeChange("")}>
                {t("materials.filters.allTypes")}
              </DropdownMenuItem>
              {(["text", "file", "video", "link"] as const).map((type) => (
                <DropdownMenuItem key={type} onClick={() => onTypeChange(type)}>
                  {t(`materials.types.${type}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Group Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3">
                <span className="text-muted-foreground mr-1">
                  Kelas:
                </span>
                {groupLabel}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onGroupChange("")}>
                Semua Kelas
              </DropdownMenuItem>
              {groups?.map((group) => (
                <DropdownMenuItem key={group.id} onClick={() => onGroupChange(group.id)}>
                  {group.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange(undefined)}>
                {t("materials.filters.allStatus")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(true)}>
                {t("materials.filters.published")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(false)}>
                {t("materials.filters.draft")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
