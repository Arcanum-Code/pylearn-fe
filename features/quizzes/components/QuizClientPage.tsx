"use client";

import { useState } from "react";
import {
  useCreateLevel,
  useFetchLevels,
  useFetchQuizzesByLevel,
} from "@/features/quizzes/hooks/useQuiz";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Level, Quiz } from "@/features/quizzes/types";

interface QuizClientPageProps {
  materialId: string;
  materialTitle?: string;
}

function QuizClientPage({ materialId, materialTitle }: QuizClientPageProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);

  const { data: levels, isLoading: areLevelsLoading } =
    useFetchLevels(materialId);

  const { mutate: createLevel, isPending: isCreatingLevel } =
    useCreateLevel(materialId);

  const { data: quizzes, isLoading: areQuizzesLoading } =
    useFetchQuizzesByLevel(selectedLevelId);

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevelId(levelId === selectedLevelId ? null : levelId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz for: {materialTitle?.trim() || "Material"}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Levels</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {areLevelsLoading ? (
            <>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </>
          ) : (
            levels?.map((level: Level) => (
              <Badge
                key={level.id}
                variant={selectedLevelId === level.id ? "default" : "secondary"}
                onClick={() => handleSelectLevel(level.id)}
                className="cursor-pointer text-sm"
              >
                {level.title || `Level ${level.id.substring(0, 4)}`}
              </Badge>
            ))
          )}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => createLevel()}
            disabled={isCreatingLevel}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {isCreatingLevel ? "Generating..." : "Generate Level"}
          </Button>
        </CardContent>
      </Card>

      {selectedLevelId && (
        <Card>
          <CardHeader>
            <CardTitle>Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            {areQuizzesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : quizzes && quizzes.length > 0 ? (
              <ul className="space-y-2">
                {quizzes.map((quiz: Quiz) => (
                  <li key={quiz.id} className="p-2 border rounded-md">
                    {quiz.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                No quizzes found for this level.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default QuizClientPage;
