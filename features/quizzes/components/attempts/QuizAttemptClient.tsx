"use client";

import { useState, useMemo } from "react";
import {
  useFetchStudentQuizAttemptDetail,
  useSubmitStudentQuizAttempt,
  useSubmitBulkStudentQuizAnswers,
  useFetchStudentQuizQuestionsForAttempt,
  useFetchStudentQuizDetailedResult,
  useFetchStudentQuizAnswers,
} from "@/features/quizzes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, CheckCircle, Clock, Save, HelpCircle, Award, PenTool } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizResultView } from "./QuizResultView";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuizAttemptClientProps {
  groupId?: string;
  attemptId: string;
}

export function QuizAttemptClient({ groupId, attemptId }: QuizAttemptClientProps) {
  const router = useRouter();
  const { data: attempt, isLoading: isAttemptLoading } =
    useFetchStudentQuizAttemptDetail(attemptId);

  const isSubmitted = !!attempt?.submittedAt;
  const quizId = attempt?.quizId;

  // Only fetch questions if not submitted
  const { data: questions, isLoading: isQuestionsLoading } =
    useFetchStudentQuizQuestionsForAttempt(!isSubmitted && quizId ? quizId : "");

  // Fetch existing answers if continuing an attempt
  const { data: existingAnswers } = useFetchStudentQuizAnswers(
    !isSubmitted ? attemptId : "",
  );

  // Only fetch results if submitted
  const { data: results, isLoading: isResultsLoading } =
    useFetchStudentQuizDetailedResult(isSubmitted ? attemptId : "");

  const serverStandardAnswers = useMemo(() => {
    const map: Record<string, string> = {};
    if (existingAnswers) {
      existingAnswers.forEach((ans) => {
        if (!ans.items || ans.items.length === 0) {
          if (ans.answerText) map[ans.quizQuestionId] = ans.answerText;
        }
      });
    }
    return map;
  }, [existingAnswers]);

  const serverBlankAnswers = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    if (existingAnswers) {
      existingAnswers.forEach((ans) => {
        if (ans.items && ans.items.length > 0) {
          map[ans.quizQuestionId] = {};
          ans.items.forEach((item) => {
            map[ans.quizQuestionId][item.keywordId] = item.answerText;
          });
        }
      });
    }
    return map;
  }, [existingAnswers]);

  const [standardAnswers, setStandardAnswers] = useState<Record<string, string>>(
    {},
  );
  const [blankAnswers, setBlankAnswers] = useState<
    Record<string, Record<string, string>>
  >({});

  const submitAttempt = useSubmitStudentQuizAttempt(attemptId);
  const submitBulkAnswers = useSubmitBulkStudentQuizAnswers(attemptId);

  const getInputWidth = (correctAnswerLength: number): string => {
    const ch = Math.max(correctAnswerLength + 2, 4);
    return `${Math.min(ch, 32)}ch`;
  };

  const handleStandardAnswerChange = (questionId: string, answer: string) => {
    setStandardAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleBlankAnswerChange = (
    questionId: string,
    keywordId: string,
    answer: string,
  ) => {
    setBlankAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [keywordId]: answer,
      },
    }));
  };

  const handleSaveProgress = async () => {
    if (!quizId || !questions || questions.length === 0) return;

    const formattedAnswers = questions.map((question) => {
      if (question.blanks && question.blanks.length > 0) {
        return {
          quizQuestionId: question.id,
          items: question.blanks.map((b) => ({
            keywordId: b.keywordId,
            answerText:
              blankAnswers[question.id]?.[b.keywordId] !== undefined
                ? blankAnswers[question.id][b.keywordId]
                : serverBlankAnswers[question.id]?.[b.keywordId] || "",
          })),
        };
      }
      return {
        quizQuestionId: question.id,
        answerText:
          standardAnswers[question.id] !== undefined
            ? standardAnswers[question.id]
            : serverStandardAnswers[question.id] || "",
      };
    });

    if (formattedAnswers.length === 0) return;

    try {
      await submitBulkAnswers.mutateAsync({
        quizAttemptId: attemptId,
        quizId,
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
      router.push(groupId ? `/groups/${groupId}` : "/materials");
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  if (isAttemptLoading || (!isSubmitted && isQuestionsLoading)) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Attempt not found</p>
        <Button variant="outline" onClick={() => router.push(groupId ? `/groups/${groupId}` : "/materials")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {groupId ? "Kembali ke Detail Kelas" : "Back to Materials"}
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-8 max-w-7xl mx-auto space-y-6 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
        {/* Back Link */}
        <button
          onClick={() => router.push(groupId ? `/groups/${groupId}` : "/materials")}
          className="inline-flex items-center text-[#6366F1] font-mono text-sm hover:underline mb-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> {groupId ? "Kembali ke Detail Kelas" : "Kembali ke Hasil Kuis"}
        </button>

        {/* Dark Hero Header */}
        <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl shadow-lg border border-gray-800 relative overflow-hidden">
          <div className="absolute right-8 top-8 opacity-5 text-gray-400">
            <HelpCircle className="w-36 h-36" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {attempt.quizTitle}
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                {isSubmitted ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-semibold">Submitted</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>In Progress</span>
                  </span>
                )}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shrink-0 w-full md:w-64 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">Waktu Mulai</span>
              </div>
              <p className="text-white text-sm font-semibold">
                {new Date(attempt.startedAt).toLocaleString()}
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                {isSubmitted ? (
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <Award className="h-4 w-4" />
                    <span>Telah dikumpulkan</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400 text-xs">
                    <Clock className="h-4 w-4" />
                    <span>Belum dikumpulkan</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isSubmitted ? (
          <QuizResultView results={results} isLoading={isResultsLoading} />
        ) : (
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
                        className="prose prose-sm max-w-none text-foreground font-medium leading-relaxed flex-1"
                        dangerouslySetInnerHTML={{
                          __html: question.questionText,
                        }}
                      />
                    </div>

                    {question.blanks &&
                    question.blanks.length > 0 &&
                    question.blankQuestionText ? (
                      <div className="space-y-4 pt-2">
                        <div className="p-5 rounded-lg bg-muted/40 border border-border/60 font-mono text-base leading-relaxed text-foreground whitespace-pre-wrap">
                          {question.blankQuestionText
                            .split(/(\[blank_\d+\])/g)
                            .map((part, i) => {
                              const match = part.match(/^\[blank_(\d+)\]$/);
                              if (match) {
                                const order = parseInt(match[1], 10);
                                const blank = question.blanks?.find(
                                  (b) => b.blankOrder === order,
                                );
                                if (!blank) return part;
                                return (
                                  <span
                                    key={i}
                                    className="inline-flex items-center mx-1 align-middle"
                                  >
                                    <input
                                      type="text"
                                      disabled={isSubmitted}
                                      value={
                                        blankAnswers[question.id]?.[
                                          blank.keywordId
                                        ] !== undefined
                                          ? blankAnswers[question.id][
                                              blank.keywordId
                                            ]
                                          : serverBlankAnswers[question.id]?.[
                                              blank.keywordId
                                            ] || ""
                                      }
                                      onChange={(e) =>
                                        handleBlankAnswerChange(
                                          question.id,
                                          blank.keywordId,
                                          e.target.value,
                                        )
                                      }
                                      placeholder={`#${order}`}
                                      style={{ width: getInputWidth(blank.correctAnswerLength) }}
                                      className="h-8 px-2 py-1 text-sm font-sans font-semibold rounded border border-primary/40 bg-background text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-center placeholder:font-normal placeholder:text-muted-foreground"
                                    />
                                  </span>
                                );
                              }
                              return <span key={i}>{part}</span>;
                            })}
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/40">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                            Daftar Kolom Jawaban:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {question.blanks
                              .slice()
                              .sort((a, b) => a.blankOrder - b.blankOrder)
                              .map((blank) => (
                                <div
                                  key={blank.keywordId}
                                  className="flex items-center gap-2 bg-background p-2 rounded-md border border-border/80 shadow-2xs"
                                >
                                  <input
                                    type="text"
                                    disabled={isSubmitted}
                                    value={
                                      blankAnswers[question.id]?.[
                                        blank.keywordId
                                      ] !== undefined
                                        ? blankAnswers[question.id][
                                            blank.keywordId
                                          ]
                                        : serverBlankAnswers[question.id]?.[
                                            blank.keywordId
                                          ] || ""
                                    }
                                    onChange={(e) =>
                                      handleBlankAnswerChange(
                                        question.id,
                                        blank.keywordId,
                                        e.target.value,
                                      )
                                    }
                                    placeholder={`#${blank.blankOrder}`}
                                    style={{ minWidth: getInputWidth(blank.correctAnswerLength) }}
                                    className="flex-1 h-8 px-2 text-sm rounded border-0 bg-transparent focus:outline-none focus:ring-0 font-medium text-foreground"
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        placeholder="Tulis jawaban Anda di sini..."
                        value={
                          standardAnswers[question.id] !== undefined
                            ? standardAnswers[question.id]
                            : serverStandardAnswers[question.id] || ""
                        }
                        onChange={(e) =>
                          handleStandardAnswerChange(question.id, e.target.value)
                        }
                        disabled={isSubmitted}
                        className="min-h-[100px]"
                      />
                    )}

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
        )}

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
    </TooltipProvider>
  );
}
