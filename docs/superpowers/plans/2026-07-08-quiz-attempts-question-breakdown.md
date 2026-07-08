# Quiz Attempts Question Breakdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add detailed question-by-question answer and failure breakdown to quiz attempts inside the lecturer's student activity drawer, featuring an interactive accordion and a "Hanya Salah" (Only Incorrect) filter toggle.

**Architecture:** We will extend the existing `StudentQuizAttemptHistoryItem` TypeScript interface with an optional `questions` array matching the newly designed backend schema. We will add localization keys across Indonesian (`id`), English (`en`), and Spanish (`es`) locales. Finally, inside `GroupStudentActivityDetailSheet.tsx`, we will encapsulate each quiz attempt card into an interactive expandable sub-component (`QuizAttemptCardWithQuestions`) that renders the question list with high-contrast styling for failed questions (`!is_correct`) and includes a toggle pill filter between all questions (`Semua Soal`) and only incorrect questions (`Hanya Salah`).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React icons, shadcn/ui.

---

### Task 1: TypeScript Interfaces Update

**Files:**
- Modify: `features/groups/types/index.ts:119-130`

- [ ] **Step 1: Write the updated TypeScript interface definition in `features/groups/types/index.ts`**

In `features/groups/types/index.ts`, locate the `StudentQuizAttemptHistoryItem` definition around lines 119-130. Insert `StudentQuizAttemptQuestionItem` just before it, and add the optional `questions?: StudentQuizAttemptQuestionItem[];` property to `StudentQuizAttemptHistoryItem`.

Replace lines 119-130:
```typescript
export interface StudentQuizAttemptHistoryItem {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  attempt_number: number;
  score: number;
  status: string;
  started_at: string;
  submitted_at: string;
  time_spent_seconds: number;
}
```

With exactly the following code:
```typescript
export interface StudentQuizAttemptQuestionItem {
  question_id: string;
  question_text: string;
  question_type?: string | null;
  student_answer: string | null;
  correct_answer: string | null;
  is_correct: boolean;
  points_earned: number;
  points_possible: number;
  explanation?: string | null;
}

export interface StudentQuizAttemptHistoryItem {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  attempt_number: number;
  score: number;
  status: string;
  started_at: string;
  submitted_at: string;
  time_spent_seconds: number;
  questions?: StudentQuizAttemptQuestionItem[];
}
```

- [ ] **Step 2: Run typecheck/build to verify TypeScript compiles cleanly**

Run: `bun run build`
Expected: Passes compile step without any interface or type definition errors.

---

### Task 2: i18n Translation Keys Update

**Files:**
- Modify: `features/groups/config/locales/id.json:37-47`
- Modify: `features/groups/config/locales/en.json:37-47`
- Modify: `features/groups/config/locales/es.json:37-47`

- [ ] **Step 1: Update Indonesian locale (`features/groups/config/locales/id.json`)**

Locate the `drawer` object in `features/groups/config/locales/id.json` around line 37 and add the new question breakdown keys:

```json
    "drawer": {
      "title": "Detail Aktivitas Mahasiswa",
      "enrolledAt": "Bergabung pada",
      "quizHistory": "Riwayat Pengerjaan Kuis",
      "readingTimeline": "Aktivitas Baca Materi",
      "noQuizHistory": "Belum ada riwayat pengerjaan kuis.",
      "noReadingTimeline": "Belum ada aktivitas membaca materi.",
      "attempt": "Percobaan #{number}",
      "score": "Nilai: {score} pt",
      "duration": "{minutes}m {seconds}d",
      "viewQuestions": "Lihat Soal & Jawaban",
      "hideQuestions": "Sembunyikan Soal",
      "filterAll": "Semua Soal ({count})",
      "filterIncorrect": "Hanya Salah ({count})",
      "studentAnswer": "Jawaban Mahasiswa:",
      "correctAnswer": "Jawaban Benar:",
      "points": "Poin: {earned} / {possible} pt",
      "noQuestionsData": "Belum ada detail soal untuk percobaan ini.",
      "noIncorrectQuestions": "Tidak ada soal yang salah pada percobaan ini.",
      "unanswered": "Kosong / Tidak dijawab"
    }
```

- [ ] **Step 2: Update English locale (`features/groups/config/locales/en.json`)**

Locate the `drawer` object in `features/groups/config/locales/en.json` around line 37 and add the new question breakdown keys:

```json
    "drawer": {
      "title": "Student Activity Detail",
      "enrolledAt": "Enrolled on",
      "quizHistory": "Quiz Attempt History",
      "readingTimeline": "Material Reading Timeline",
      "noQuizHistory": "No quiz attempt history yet.",
      "noReadingTimeline": "No material reading timeline yet.",
      "attempt": "Attempt #{number}",
      "score": "Score: {score} pt",
      "duration": "{minutes}m {seconds}s",
      "viewQuestions": "View Questions & Answers",
      "hideQuestions": "Hide Questions",
      "filterAll": "All Questions ({count})",
      "filterIncorrect": "Only Incorrect ({count})",
      "studentAnswer": "Student Answer:",
      "correctAnswer": "Correct Answer:",
      "points": "Points: {earned} / {possible} pt",
      "noQuestionsData": "No question details available for this attempt.",
      "noIncorrectQuestions": "No incorrect questions found in this attempt.",
      "unanswered": "Empty / Not answered"
    }
```

- [ ] **Step 3: Update Spanish locale (`features/groups/config/locales/es.json`)**

Locate the `drawer` object in `features/groups/config/locales/es.json` around line 37 and add the new question breakdown keys:

```json
    "drawer": {
      "title": "Detalle de Actividad del Estudiante",
      "enrolledAt": "Inscrito en",
      "quizHistory": "Historial de Intentos",
      "readingTimeline": "Cronología de Lectura",
      "noQuizHistory": "Sin historial de intentos aún.",
      "noReadingTimeline": "Sin actividad de lectura aún.",
      "attempt": "Intento #{number}",
      "score": "Puntaje: {score} pt",
      "duration": "{minutes}m {seconds}s",
      "viewQuestions": "Ver Preguntas y Respuestas",
      "hideQuestions": "Ocultar Preguntas",
      "filterAll": "Todas las Preguntas ({count})",
      "filterIncorrect": "Solo Incorrectas ({count})",
      "studentAnswer": "Respuesta del Estudiante:",
      "correctAnswer": "Respuesta Correcta:",
      "points": "Puntos: {earned} / {possible} pt",
      "noQuestionsData": "No hay detalles de preguntas para este intento.",
      "noIncorrectQuestions": "No se encontraron preguntas incorrectas en este intento.",
      "unanswered": "Vacío / No respondido"
    }
```

- [ ] **Step 4: Run linting to verify valid JSON formatting across all locale files**

Run: `bun run lint`
Expected: No ESLint or JSON formatting errors reported.

---

### Task 3: Quiz Attempt Questions Accordion UI Implementation

**Files:**
- Modify: `features/groups/components/GroupStudentActivityDetailSheet.tsx`

- [ ] **Step 1: Replace `GroupStudentActivityDetailSheet.tsx` with the accordion and filter implementation**

Replace the entire content of `features/groups/components/GroupStudentActivityDetailSheet.tsx` with the complete implementation below. This introduces a clean `QuizAttemptCardWithQuestions` component that manages expand/collapse state (`isExpanded`) and filter selection (`filterMode: "all" | "incorrect"`), highlighting wrong questions (`!is_correct`) with high contrast:

```tsx
"use client";

import { useState } from "react";
import { useGroupStudentActivityDetail } from "../hooks/useGroups";
import { Spinner } from "@/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "@/lib/i18n/useTranslation";
import {
  BookOpen,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { StudentQuizAttemptHistoryItem } from "../types";

interface GroupStudentActivityDetailSheetProps {
  groupId: string;
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface QuizAttemptCardWithQuestionsProps {
  attempt: StudentQuizAttemptHistoryItem;
  formatDate: (dateStr?: string | null) => string;
  formatDuration: (seconds: number) => string;
}

function QuizAttemptCardWithQuestions({
  attempt,
  formatDate,
  formatDuration,
}: QuizAttemptCardWithQuestionsProps) {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "incorrect">("all");

  const isPassed = attempt.status?.toLowerCase() === "passed" || attempt.score >= 60;
  const questions = attempt.questions || [];
  const incorrectCount = questions.filter((q) => !q.is_correct).length;

  const displayedQuestions =
    filterMode === "incorrect"
      ? questions.filter((q) => !q.is_correct)
      : questions;

  return (
    <div className="rounded-xl bg-[#F7F8FA] border border-gray-150/60 overflow-hidden transition-all duration-200">
      {/* Header Summary Card */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100/60 transition-colors"
      >
        <div className="space-y-1">
          <p className="font-semibold text-sm text-[#1A1C1E]">
            {attempt.quiz_title}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-sans">
            <span>
              {t("groups.students.drawer.attempt", {
                number: attempt.attempt_number,
              })}
            </span>
            <span>•</span>
            <span>{formatDate(attempt.submitted_at)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />{" "}
              {formatDuration(attempt.time_spent_seconds || 0)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`font-mono text-xs px-2.5 py-1 ${
              isPassed
                ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
            }`}
          >
            {attempt.score} pt
          </Badge>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-sans text-gray-600 hover:text-[#6366F1] px-2 py-1 rounded-md hover:bg-white/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <span>
              {isExpanded
                ? t("groups.students.drawer.hideQuestions")
                : t("groups.students.drawer.viewQuestions")}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#6366F1]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Question Breakdown Section */}
      {isExpanded && (
        <div className="border-t border-gray-200/80 p-4 space-y-4 bg-white/60">
          {questions.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400 font-sans bg-white rounded-xl border border-gray-150">
              <HelpCircle className="w-5 h-5 text-gray-300 mx-auto mb-1.5" />
              {t("groups.students.drawer.noQuestionsData")}
            </div>
          ) : (
            <>
              {/* Filter Pills */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterMode("all")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-sans transition-all duration-150 ${
                    filterMode === "all"
                      ? "bg-[#1A1C1E] text-white font-medium shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {t("groups.students.drawer.filterAll", {
                    count: questions.length,
                  })}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode("incorrect")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-sans transition-all duration-150 flex items-center gap-1.5 ${
                    filterMode === "incorrect"
                      ? "bg-[#EF4444] text-white font-medium shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <AlertCircle
                    className={`w-3.5 h-3.5 ${
                      filterMode === "incorrect" ? "text-white" : "text-[#EF4444]"
                    }`}
                  />
                  {t("groups.students.drawer.filterIncorrect", {
                    count: incorrectCount,
                  })}
                </button>
              </div>

              {/* Questions List */}
              {displayedQuestions.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400 font-sans bg-white rounded-xl border border-gray-150">
                  {t("groups.students.drawer.noIncorrectQuestions")}
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedQuestions.map((q, idx) => {
                    const isCorrect = q.is_correct;
                    return (
                      <div
                        key={q.question_id || `q-${idx}`}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isCorrect
                            ? "bg-white border-gray-200/80"
                            : "bg-[#EF4444]/[0.04] border-[#EF4444]/30"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3 mb-2.5">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                              )}
                            </div>
                            <p className="text-xs font-semibold text-[#1A1C1E] leading-relaxed">
                              {q.question_text}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`font-mono text-[11px] px-2 py-0.5 shrink-0 ${
                              isCorrect
                                ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                                : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                            }`}
                          >
                            {t("groups.students.drawer.points", {
                              earned: q.points_earned,
                              possible: q.points_possible,
                            })}
                          </Badge>
                        </div>

                        {/* Answers Comparison */}
                        <div className="pl-6 space-y-1.5 text-xs font-sans">
                          <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="text-gray-500 font-medium">
                              {t("groups.students.drawer.studentAnswer")}
                            </span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded text-[11px] ${
                                isCorrect
                                  ? "bg-[#10B981]/10 text-[#10B981] font-semibold"
                                  : "bg-[#EF4444]/15 text-[#EF4444] font-semibold line-through"
                              }`}
                            >
                              {q.student_answer ||
                                t("groups.students.drawer.unanswered")}
                            </span>
                          </div>

                          {!isCorrect && q.correct_answer && (
                            <div className="flex flex-wrap items-baseline gap-1.5">
                              <span className="text-gray-500 font-medium">
                                {t("groups.students.drawer.correctAnswer")}
                              </span>
                              <span className="font-mono bg-[#10B981]/15 text-[#10B981] font-semibold px-2 py-0.5 rounded text-[11px]">
                                {q.correct_answer}
                              </span>
                            </div>
                          )}

                          {q.explanation && (
                            <div className="mt-2 text-[11px] text-gray-600 bg-gray-100/80 p-2 rounded-lg border border-gray-200/60 font-sans">
                              <span className="font-semibold text-[#1A1C1E]">
                                Penjelasan:{" "}
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function GroupStudentActivityDetailSheet({
  groupId,
  studentId,
  isOpen,
  onClose,
}: GroupStudentActivityDetailSheetProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { data, isLoading } = useGroupStudentActivityDetail(
    groupId,
    studentId,
    isOpen
  );

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white p-6 space-y-6">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-[#1A1C1E]">
            {t("groups.students.drawer.title")}
          </SheetTitle>
          {data?.student && (
            <SheetDescription className="text-sm text-gray-500 font-sans">
              {data.student.name} • {data.student.email}
            </SheetDescription>
          )}
        </SheetHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="w-8 h-8 text-[#6366F1]" />
          </div>
        ) : !data ? (
          <div className="py-12 text-center text-gray-400 font-sans text-sm">
            Data tidak ditemukan
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quiz Attempts Section */}
            <div>
              <h3 className="font-semibold text-sm text-[#1A1C1E] flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-[#6366F1]" />{" "}
                {t("groups.students.drawer.quizHistory")}
              </h3>
              {data.quiz_attempts_history.length === 0 ? (
                <p className="text-xs text-gray-400 font-sans py-4 bg-[#F7F8FA] rounded-xl text-center border border-gray-150">
                  {t("groups.students.drawer.noQuizHistory")}
                </p>
              ) : (
                <div className="space-y-3">
                  {data.quiz_attempts_history.map((attempt) => (
                    <QuizAttemptCardWithQuestions
                      key={attempt.attempt_id}
                      attempt={attempt}
                      formatDate={formatDate}
                      formatDuration={formatDuration}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Material Reading Timeline Section */}
            <div>
              <h3 className="font-semibold text-sm text-[#1A1C1E] flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#6366F1]" />{" "}
                {t("groups.students.drawer.readingTimeline")}
              </h3>
              {data.material_reading_timeline.length === 0 ? (
                <p className="text-xs text-gray-400 font-sans py-4 bg-[#F7F8FA] rounded-xl text-center border border-gray-150">
                  {t("groups.students.drawer.noReadingTimeline")}
                </p>
              ) : (
                <div className="space-y-3">
                  {data.material_reading_timeline.map((item) => {
                    const isCompleted =
                      item.status?.toLowerCase() === "completed" ||
                      item.scroll_percentage >= 100;
                    return (
                      <div
                        key={item.material_id}
                        className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/60 flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-[#1A1C1E]">
                            {item.material_title}
                          </p>
                          <p className="text-xs text-gray-500 font-sans">
                            {item.completed_at
                              ? `Selesai: ${formatDate(item.completed_at)}`
                              : item.first_opened_at
                              ? `Dibuka: ${formatDate(item.first_opened_at)}`
                              : "Belum dibuka"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs px-2.5 py-1 ${
                            isCompleted
                              ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                              : item.scroll_percentage > 0
                              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                              : "bg-gray-200 text-gray-500 border-gray-300"
                          }`}
                        >
                          {item.scroll_percentage}%
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 2: Run verification build and lint checks**

Run: `bun run build && bun run lint`
Expected: Next.js builds successfully without type errors, and ESLint passes cleanly.

---

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add .
git commit -m "feat: add quiz attempt question breakdown with accordion and incorrect filter"
```
