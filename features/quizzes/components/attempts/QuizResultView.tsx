"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { QuizAttemptResultData, StudentQuizAttemptResultData } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatScoreOrPoints } from "@/features/groups/utils/format";

interface QuizResultViewProps {
  results: QuizAttemptResultData | StudentQuizAttemptResultData | undefined;
  isLoading: boolean;
}

const stripHtmlTags = (htmlString: string) => {
  if (!htmlString) return "";
  return htmlString.replace(/<[^>]*>/g, "");
};

export function QuizResultView({ results, isLoading }: QuizResultViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-muted-foreground">
            Hasil kuis belum tersedia atau tidak dapat dimuat.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Summary Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Ringkasan Hasil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="flex-1 space-y-2 w-full">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground text-sm">
                  Waktu Mulai:
                </span>
                <span className="font-medium text-sm">
                  {new Date(results.startedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground text-sm">
                  Waktu Selesai:
                </span>
                <span className="font-medium text-sm">
                  {new Date(results.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-background rounded-full h-32 w-32 shadow-sm border-4 border-primary/20">
              <span className="text-sm text-muted-foreground mb-1">
                Skor Akhir
              </span>
              <span className="text-4xl font-bold text-primary">
                {formatScoreOrPoints(results.score)}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Question Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 pt-2">
          Detail Jawaban
        </h3>
        {results.details.map((detail, index) => (
          <Card
            key={detail.questionId}
            className={`border-l-4 ${
              detail.isCorrect ? "border-l-green-500" : "border-l-red-500"
            }`}
          >
            <CardContent className="p-5">
              <div className="space-y-4">
                {/* Question Text */}
                <div className="flex gap-3 items-start">
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white mt-0.5 ${
                      detail.isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div
                      className="prose prose-sm max-w-none font-medium text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: detail.questionText }}
                    />
                    <div className="mt-2 flex justify-end">
                      <Badge variant="outline" className="text-xs">
                        Max Score: {formatScoreOrPoints(detail.maxScore)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* User's Answer */}
                  <div className="space-y-2 p-3 rounded-md bg-muted/50 border">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      Jawaban Anda:
                    </div>
                    <div className="text-sm min-h-[40px] whitespace-pre-wrap">
                      {detail.userAnswer || (
                        <span className="italic text-muted-foreground">
                          Tidak dijawab
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end pt-1">
                      {detail.isCorrect ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Benar
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Salah
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="space-y-2 p-3 rounded-md border border-green-200 bg-green-50/50">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                      Jawaban yang Benar:
                    </div>
                    <div className="text-sm min-h-[40px] whitespace-pre-wrap">
                      {stripHtmlTags(detail.correctAnswer)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
