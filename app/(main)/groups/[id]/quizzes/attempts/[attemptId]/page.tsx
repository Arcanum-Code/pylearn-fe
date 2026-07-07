import { QuizAttemptClient } from "@/features/quizzes/components/attempts/QuizAttemptClient";

interface PageProps {
  params: Promise<{ id: string; attemptId: string }>;
}

export default async function GroupQuizAttemptPage({ params }: PageProps) {
  const { id, attemptId } = await params;

  return <QuizAttemptClient groupId={id} attemptId={attemptId} />;
}
