"use client";

import { useState } from "react";
import { useFetchQuizAttemptDetail } from "../../hooks/useQuizAttempts";
import {
  useSubmitQuizAttempt,
  useSubmitBulkStudentAnswers,
} from "../../hooks/useQuizAttempts";
import { useFetchQuizLevels } from "../../hooks/useQuizLevels";
import { useFetchQuizQuestionsForAttempt } from "../../hooks/useQuizQuestions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, CheckCircle, Clock, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizAttemptClientProps {
  attemptId: string;
}

export function QuizAttemptClient({ attemptId }: QuizAttemptClientProps) {
  const router = useRouter();
  const { data: attempt, isLoading: isAttemptLoading } =
    useFetchQuizAttemptDetail(attemptId);

  const quizId = attempt?.quizId;
  const { data: quizLevels } = useFetchQuizLevels(quizId || "");
  const quizLevelId = attempt?.quizLevelId || quizLevels?.[0]?.id;

  const { data: questions, isLoading: isQuestionsLoading } =
    useFetchQuizQuestionsForAttempt(quizLevelId || "");

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const submitAttempt = useSubmitQuizAttempt(attemptId);
  const submitBulkAnswers = useSubmitBulkStudentAnswers(attemptId);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSaveProgress = async () => {
    if (!quizId || !quizLevelId) return;

    // Convert Record<string, string> to array format
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answerText]) => ({
        quizQuestionId: questionId,
        answerText,
      }),
    );

    if (formattedAnswers.length === 0) return;

    try {
      await submitBulkAnswers.mutateAsync({
        quizAttemptId: attemptId,
        quizId,
        quizLevelId,
        answers: formattedAnswers,
      });
    } catch (error) {
      console.error("Failed to save answers in bulk:", error);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      // First save all progress
      await handleSaveProgress();
      // Then submit the attempt
      await submitAttempt.mutateAsync();
      router.push("/materials");
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  if (isAttemptLoading || isQuestionsLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Attempt not found</p>
        <Button variant="outline" onClick={() => router.push("/materials")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>
      </div>
    );
  }

  const isSubmitted = !!attempt.submittedAt;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit pl-0"
        onClick={() => router.push(`/materials`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Materi
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{attempt.quizTitle}</CardTitle>
            {isSubmitted ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Submitted</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span className="text-sm">In Progress</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Started: {new Date(attempt.startedAt).toLocaleString()}
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {questions?.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {/* Nomor Pertanyaan */}
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </span>

                  <div
                    className="prose prose-sm max-w-none text-foreground font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: question.questionText,
                    }}
                  />
                </div>

                <Textarea
                  placeholder="Tulis jawaban Anda di sini..."
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  disabled={isSubmitted}
                  className="min-h-[100px]"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Max Score: {question.maxScore}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isSubmitted && questions && questions.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSaveProgress}
            disabled={submitBulkAnswers.isPending || submitAttempt.isPending}
          >
            {submitBulkAnswers.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Progres
          </Button>

          <Button
            size="lg"
            onClick={handleSubmitQuiz}
            disabled={submitAttempt.isPending || submitBulkAnswers.isPending}
          >
            {submitAttempt.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Kumpulkan Kuis
          </Button>
        </div>
      )}
    </div>
  );
}

