import { StudentMaterialDetailView } from "@/features/materials";

interface MaterialDetailPageProps {
  params: Promise<{ id: string; materialId: string }>;
}

export default async function MaterialDetailPage({
  params,
}: MaterialDetailPageProps) {
  const { id, materialId } = await params;

  return <StudentMaterialDetailView groupId={id} materialId={materialId} />;
}
