import { MaterialDetailClient } from "@/features/materials/components/MaterialDetailClient";

interface MaterialDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MaterialDetailPage({
  params,
}: MaterialDetailPageProps) {
  const { id } = await params;

  return <MaterialDetailClient id={id} />;
}