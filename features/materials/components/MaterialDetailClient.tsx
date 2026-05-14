"use client";

import { MaterialDetailView } from "@/features/materials/components/MaterialDetailView";

interface MaterialDetailClientProps {
  id: string;
}

export function MaterialDetailClient({ id }: MaterialDetailClientProps) {
  return <MaterialDetailView id={id} />;
}