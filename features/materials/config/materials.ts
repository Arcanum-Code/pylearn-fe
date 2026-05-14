import { BookOpen, Video, FileText, Link, CheckCircle2, CircleDashed, LucideIcon } from "lucide-react";
import { MaterialType } from "../types";

export const materialsConfig = {
  pageTitleKey: "materials.pageTitle",
  descriptionKey: "materials.description",
  filters: {
    titleKey: "materials.filters.title",
    descriptionKey: "materials.filters.description",
    lecturerKey: "materials.filters.lecturer",
    typeKey: "materials.filters.type",
    statusKey: "materials.filters.status",
  },
  noResultsKey: "materials.noResults",
};

export const materialTypeIcons: Record<MaterialType, LucideIcon> = {
  text: FileText,
  file: BookOpen,
  video: Video,
  link: Link,
};

export const materialStatusConfig = {
  published: {
    labelKey: "materials.card.published",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  draft: {
    labelKey: "materials.card.draft",
    icon: CircleDashed,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
};
