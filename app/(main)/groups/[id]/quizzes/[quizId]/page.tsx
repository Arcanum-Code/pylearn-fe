import { LecturerQuizDetail } from "@/features/quizzes";

interface QuizManagementPageProps {
  params: Promise<{ id: string; quizId: string }>;
}

export default async function QuizManagementPage({ params }: QuizManagementPageProps) {
  const { id, quizId } = await params;
  return <LecturerQuizDetail groupId={id} quizId={quizId} />;
}
