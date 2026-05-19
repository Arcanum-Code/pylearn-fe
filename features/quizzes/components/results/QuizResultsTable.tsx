"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentQuizOverviewResult } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, User, Mail, Calendar } from "lucide-react";
import Link from "next/link";

interface QuizResultsTableProps {
  data: StudentQuizOverviewResult[];
  isLoading: boolean;
}

export function QuizResultsTable({ data, isLoading }: QuizResultsTableProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Belum ada mahasiswa yang mengerjakan kuis pada tingkat ini.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[80px] text-center">No</TableHead>
          <TableHead>Mahasiswa</TableHead>
          <TableHead className="text-center">Skor</TableHead>
          <TableHead className="text-center">Waktu Pengerjaan</TableHead>
          <TableHead className="text-right pr-6">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((result, index) => (
          <TableRow key={result.attemptId} className="hover:bg-muted/30 transition-colors">
            <TableCell className="text-center font-medium">
              {index + 1}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <User className="h-3.5 w-3.5 text-primary" />
                  {result.studentName}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Mail className="h-3 w-3" />
                  {result.studentEmail}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex flex-col items-center gap-1">
                <Badge 
                  variant={result.score >= 70 ? "default" : "destructive"} 
                  className="font-bold text-sm px-2.5 py-0.5"
                >
                  {result.score}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {result.totalQuestions} Soal
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {new Date(result.submittedAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Pukul {new Date(result.submittedAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right pr-6">
              <Button variant="outline" size="sm" asChild className="h-8 gap-1.5">
                <Link href={`/quizzes/attempts/${result.attemptId}`}>
                  <Eye className="h-3.5 w-3.5" />
                  Detail Jawaban
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
