import { MaterialQuizResultsClient } from "@/features/quizzes/components/results/MaterialQuizResultsClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ levelId?: string }>;
}

export default async function MaterialQuizResultsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { levelId } = await searchParams;

  return <MaterialQuizResultsClient materialId={id} levelId={levelId} />;
}
