import QuizClientPage from "@/features/quizzes/components/QuizClientPage";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    title?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ id }, { title }] = await Promise.all([params, searchParams]);

  if (!id) {
    return (
      <div className="p-4 text-red-500">
        Error: Material ID is missing from the URL.
      </div>
    );
  }

  return <QuizClientPage materialId={id} materialTitle={title} />;
}
