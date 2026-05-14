"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Material } from "../types";
import { materialTypeIcons } from "../config/materials";
import { Calendar, User, icons } from "lucide-react";

interface MaterialCardProps {
  material: Material;
}

export function MaterialCard({ material }: MaterialCardProps) {
  const t = useTranslations();
  const TypeIcon =
    materialTypeIcons[material.materialType] || materialTypeIcons.text;

  // Dynamically resolve the icon from lucide-react using the name stored in DB (e.g., "GraduationCap")
  // Note: Storing PascalCase strings like "GraduationCap" is correct for this mapping.
  const DynamicIcon = material.iconName
    ? (icons[material.iconName as keyof typeof icons] as React.ElementType)
    : null;

  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-md group overflow-hidden">
      <div className="relative aspect-video bg-muted flex items-center justify-center p-6 border-b">
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-background/80 backdrop-blur shadow-sm border">
            {TypeIcon && <TypeIcon className="h-4 w-4 text-branding-dark" />}
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] h-5 px-1.5 font-medium uppercase tracking-wider"
          >
            {t(`materials.types.${material.materialType}`)}
          </Badge>
        </div>

        {/* Center Icon Section */}
        <div className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:scale-110">
          <div className="w-16 h-16 rounded-2xl bg-branding-dark flex items-center justify-center shadow-lg shadow-branding-dark/20">
            {DynamicIcon ? (
              <DynamicIcon className="h-8 w-8 text-white" />
            ) : (
              <span className="text-2xl font-bold text-white uppercase">
                {material.title.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      <CardContent className="flex-1 pt-4 pb-2">
        <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2 group-hover:text-branding-dark transition-colors">
          {material.title}
        </h3>
        {material.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
            {material.description}
          </p>
        )}
      </CardContent>

      <div className="px-6 pb-4 pt-0 space-y-3 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center border">
              <User className="h-3 w-3" />
            </div>
            <span className="truncate max-w-[120px]">
              {material.lecturerName || "Instructor"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(material.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
