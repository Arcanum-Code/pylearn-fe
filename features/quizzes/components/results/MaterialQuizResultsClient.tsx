"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchMaterialById } from "@/features/materials/hooks/useMaterials";
import { useFetchQuizLevelsByMaterialId } from "@/features/quizzes/hooks/useQuizLevels";
import { useFetchAllQuizResults } from "@/features/quizzes/hooks/useQuizAttempts";
import { QuizResultsTable } from "./QuizResultsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MaterialQuizResultsClientProps {
  materialId: string;
  levelId?: string;
}

export function MaterialQuizResultsClient({
  materialId,
  levelId: initialLevelId,
}: MaterialQuizResultsClientProps) {
  const router = useRouter();
  
  // 1. Fetch material and levels
  const { data: material, isLoading: isMaterialLoading } = useFetchMaterialById(materialId);
  const { data: levels, isLoading: isLevelsLoading } = useFetchQuizLevelsByMaterialId(materialId);

  // 2. State for active level
  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>(initialLevelId);

  // Derive active level: prop > state > first available level
  const activeLevelId = selectedLevelId || levels?.[0]?.id;

  // 3. Fetch all quiz results for the active level
  const { data: results = [], isLoading: isResultsLoading } = useFetchAllQuizResults({
    quizLevelId: activeLevelId,
  });

  if (isMaterialLoading || isLevelsLoading) {
    return (
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit pl-0"
          onClick={() => router.push(`/materials/${materialId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Detail Materi
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Hasil Kuis Mahasiswa</h1>
        <p className="text-muted-foreground">{material?.title}</p>
      </div>

      {levels && levels.length > 0 ? (
        <div className="space-y-6">
          <Tabs
            value={activeLevelId}
            onValueChange={setSelectedLevelId}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
              <TabsList className="h-10">
                {levels.map((level) => (
                  <TabsTrigger key={level.id} value={level.id} className="px-4">
                    {level.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Daftar Percobaan Mahasiswa
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Total: <span className="font-bold text-foreground">{results.length}</span> Percobaan
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <QuizResultsTable data={results} isLoading={isResultsLoading} />
              </CardContent>
            </Card>
          </Tabs>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Materi ini belum memiliki tingkatan kuis.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
