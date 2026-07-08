# Lecturer Group Students Activity & Progress Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Mahasiswa" (Student Activity & Progress) tab to the lecturer class page (`/groups/[groupId]`) featuring smart status segment pills (`Perlu Perhatian`, `Kurang Aktif`, `Selesai & Aktif`, `Semua`), a progress table/matrix, and a slide-out drawer (`Sheet`) for granular student quiz/reading timelines.

**Architecture:** Encapsulated strictly within `features/groups/` (`types`, `services`, `hooks`, `components`, and `config/locales`), consuming the two newly implemented backend endpoints via `app/api/api.ts` and `TanStack React Query`.

**Tech Stack:** Next.js App Router, TypeScript, Bun, Tailwind CSS, shadcn/ui (`Tabs`, `Sheet`, `Table`, `Badge`, `Input`), TanStack React Query (`@tanstack/react-query`).

---

## Task 1: API Endpoints & TypeScript Interfaces

**Files:**
- Modify: `app/api/api.ts:50-63`
- Modify: `features/groups/types/index.ts:50-65`

- [ ] **Step 1: Add API endpoints to `app/api/api.ts`**

In `app/api/api.ts`, under `LECTURER: {`, add `GROUP_STUDENTS_ACTIVITY` and `GROUP_STUDENT_ACTIVITY_DETAIL`:

```typescript
    GROUP_STUDENTS_ACTIVITY: (groupId: string) =>
      `${API_URL}/lecturer/groups/${groupId}/students-activity`,
    GROUP_STUDENT_ACTIVITY_DETAIL: (groupId: string, studentId: string) =>
      `${API_URL}/lecturer/groups/${groupId}/students/${studentId}/activity`,
```

- [ ] **Step 2: Add interfaces to `features/groups/types/index.ts`**

Append the exact backend response types to `features/groups/types/index.ts`:

```typescript
export interface GroupStudentsSummary {
  total_students: number;
  at_risk_count: number;
  inactive_count: number;
  on_track_count: number;
  avg_class_progress: number;
  avg_class_quiz_score: number;
}

export interface GroupColumnMaterial {
  id: string;
  title: string;
  order: number;
}

export interface GroupColumnQuiz {
  id: string;
  title: string;
  level_number: number;
}

export interface StudentMaterialProgressItem {
  material_id: string;
  status: string;
  scroll_percentage: number;
  last_read_at: string | null;
}

export interface StudentQuizProgressItem {
  quiz_id: string;
  status: string;
  best_score: number | null;
  attempts_count: number;
  last_attempt_at: string | null;
}

export interface GroupStudentActivityItem {
  student_id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  status: "AT_RISK" | "INACTIVE" | "ON_TRACK" | string;
  status_reasons: string[];
  overall_progress_percentage: number;
  avg_quiz_score: number | null;
  last_active_at: string | null;
  materials_progress: StudentMaterialProgressItem[];
  quizzes_progress: StudentQuizProgressItem[];
}

export interface GroupStudentsActivityData {
  summary: GroupStudentsSummary;
  columns: {
    materials: GroupColumnMaterial[];
    quizzes: GroupColumnQuiz[];
  };
  students: GroupStudentActivityItem[];
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
}

export interface StudentMaterialReadingTimelineItem {
  material_id: string;
  material_title: string;
  status: string;
  scroll_percentage: number;
  first_opened_at: string | null;
  completed_at: string | null;
}

export interface GroupStudentActivityDetailData {
  student: {
    student_id: string;
    name: string;
    email: string;
    enrolled_at: string | null;
  };
  quiz_attempts_history: StudentQuizAttemptHistoryItem[];
  material_reading_timeline: StudentMaterialReadingTimelineItem[];
}
```

---

## Task 2: Service Layer & React Query Hooks

**Files:**
- Modify: `features/groups/services/group.service.ts`
- Modify: `features/groups/hooks/useGroups.ts`

- [ ] **Step 1: Implement API service methods in `features/groups/services/group.service.ts`**

Update `GroupService` in `features/groups/services/group.service.ts` to include `getGroupStudentsActivity` and `getGroupStudentActivityDetail`:

```typescript
import {
  Group,
  StudentGroupDetail,
  GroupStudentsActivityData,
  GroupStudentActivityDetailData,
} from "../types";
import { API_ENDPOINTS } from "@/app/api/api";
```

Inside `export const GroupService = {`:
```typescript
  getGroupStudentsActivity: async (groupId: string): Promise<GroupStudentsActivityData> => {
    const { data } = await ApiAxios.get(API_ENDPOINTS.LECTURER.GROUP_STUDENTS_ACTIVITY(groupId));
    return data.data;
  },
  getGroupStudentActivityDetail: async (
    groupId: string,
    studentId: string
  ): Promise<GroupStudentActivityDetailData> => {
    const { data } = await ApiAxios.get(
      API_ENDPOINTS.LECTURER.GROUP_STUDENT_ACTIVITY_DETAIL(groupId, studentId)
    );
    return data.data;
  },
```

- [ ] **Step 2: Add query keys and custom hooks in `features/groups/hooks/useGroups.ts`**

Add query key definitions inside `groupKeys`:
```typescript
  studentsActivity: (groupId: string) => [...groupKeys.detail(groupId), "students-activity"] as const,
  studentActivityDetail: (groupId: string, studentId: string) =>
    [...groupKeys.detail(groupId), "student-activity-detail", studentId] as const,
```

Export query hooks:
```typescript
export const useGroupStudentsActivity = (groupId: string, enabled = true) => {
  return useQuery({
    queryKey: groupKeys.studentsActivity(groupId),
    queryFn: () => GroupService.getGroupStudentsActivity(groupId),
    enabled: !!groupId && enabled,
  });
};

export const useGroupStudentActivityDetail = (
  groupId: string,
  studentId: string | null,
  enabled = true
) => {
  return useQuery({
    queryKey: groupKeys.studentActivityDetail(groupId, studentId || ""),
    queryFn: () => GroupService.getGroupStudentActivityDetail(groupId, studentId!),
    enabled: !!groupId && !!studentId && enabled,
  });
};
```

---

## Task 3: i18n Translation Files & Registration

**Files:**
- Create: `features/groups/config/locales/id.json`
- Create: `features/groups/config/locales/en.json`
- Create: `features/groups/config/locales/es.json`
- Modify: `app/providers/I18nProvider.tsx`

- [ ] **Step 1: Create `features/groups/config/locales/id.json`**

```json
{
  "tabs": {
    "overview": "Overview",
    "content": "Materi & Kuis",
    "students": "Mahasiswa"
  },
  "students": {
    "title": "Aktivitas & Progress Mahasiswa",
    "subtitle": "Pantau bacaan materi, nilai kuis, serta keaktifan mahasiswa di kelas ini.",
    "searchPlaceholder": "Cari nama atau email mahasiswa...",
    "sortBy": "Urutkan berdasarkan",
    "sortOptions": {
      "name": "Nama (A-Z)",
      "progress": "Progress Terendah",
      "score": "Nilai Kuis Terendah",
      "lastActive": "Terakhir Aktif"
    },
    "buckets": {
      "all": "Semua Mahasiswa",
      "atRisk": "Perlu Perhatian",
      "inactive": "Kurang Aktif",
      "onTrack": "Selesai & Aktif"
    },
    "table": {
      "student": "Mahasiswa",
      "status": "Status",
      "progress": "Progress Materi",
      "quizScore": "Rata-rata Kuis",
      "lastActive": "Terakhir Aktif",
      "actions": "Aksi"
    },
    "statusLabels": {
      "AT_RISK": "Perlu Perhatian",
      "INACTIVE": "Kurang Aktif",
      "ON_TRACK": "Aktif & Lancar"
    },
    "drawer": {
      "title": "Detail Aktivitas Mahasiswa",
      "enrolledAt": "Bergabung pada",
      "quizHistory": "Riwayat Pengerjaan Kuis",
      "readingTimeline": "Aktivitas Baca Materi",
      "noQuizHistory": "Belum ada riwayat pengerjaan kuis.",
      "noReadingTimeline": "Belum ada aktivitas membaca materi.",
      "attempt": "Percobaan #{number}",
      "score": "Nilai: {score} pt",
      "duration": "{minutes}m {seconds}d"
    }
  }
}
```

- [ ] **Step 2: Create `features/groups/config/locales/en.json`**

```json
{
  "tabs": {
    "overview": "Overview",
    "content": "Materials & Quizzes",
    "students": "Students"
  },
  "students": {
    "title": "Student Activity & Progress",
    "subtitle": "Monitor material reading, quiz scores, and engagement in this class.",
    "searchPlaceholder": "Search by student name or email...",
    "sortBy": "Sort by",
    "sortOptions": {
      "name": "Name (A-Z)",
      "progress": "Lowest Progress",
      "score": "Lowest Quiz Score",
      "lastActive": "Last Active"
    },
    "buckets": {
      "all": "All Students",
      "atRisk": "Needs Attention",
      "inactive": "Inactive",
      "onTrack": "On Track"
    },
    "table": {
      "student": "Student",
      "status": "Status",
      "progress": "Material Progress",
      "quizScore": "Avg Quiz Score",
      "lastActive": "Last Active",
      "actions": "Actions"
    },
    "statusLabels": {
      "AT_RISK": "Needs Attention",
      "INACTIVE": "Inactive",
      "ON_TRACK": "On Track"
    },
    "drawer": {
      "title": "Student Activity Detail",
      "enrolledAt": "Enrolled on",
      "quizHistory": "Quiz Attempt History",
      "readingTimeline": "Material Reading Timeline",
      "noQuizHistory": "No quiz attempt history yet.",
      "noReadingTimeline": "No material reading timeline yet.",
      "attempt": "Attempt #{number}",
      "score": "Score: {score} pt",
      "duration": "{minutes}m {seconds}s"
    }
  }
}
```

- [ ] **Step 3: Create `features/groups/config/locales/es.json`**

```json
{
  "tabs": {
    "overview": "Resumen",
    "content": "Materiales y Cuestionarios",
    "students": "Estudiantes"
  },
  "students": {
    "title": "Actividad y Progreso de Estudiantes",
    "subtitle": "Monitorea la lectura de materiales, puntajes de cuestionarios y participación en esta clase.",
    "searchPlaceholder": "Buscar por nombre o correo...",
    "sortBy": "Ordenar por",
    "sortOptions": {
      "name": "Nombre (A-Z)",
      "progress": "Menor Progreso",
      "score": "Menor Puntaje",
      "lastActive": "Última Actividad"
    },
    "buckets": {
      "all": "Todos",
      "atRisk": "Requiere Atención",
      "inactive": "Inactivos",
      "onTrack": "En Marcha"
    },
    "table": {
      "student": "Estudiante",
      "status": "Estado",
      "progress": "Progreso de Materiales",
      "quizScore": "Puntaje Promedio",
      "lastActive": "Última Actividad",
      "actions": "Acciones"
    },
    "statusLabels": {
      "AT_RISK": "Requiere Atención",
      "INACTIVE": "Inactivo",
      "ON_TRACK": "En Marcha"
    },
    "drawer": {
      "title": "Detalle de Actividad del Estudiante",
      "enrolledAt": "Inscrito en",
      "quizHistory": "Historial de Intentos",
      "readingTimeline": "Cronología de Lectura",
      "noQuizHistory": "Sin historial de intentos aún.",
      "noReadingTimeline": "Sin actividad de lectura aún.",
      "attempt": "Intento #{number}",
      "score": "Puntaje: {score} pt",
      "duration": "{minutes}m {seconds}s"
    }
  }
}
```

- [ ] **Step 4: Register `groups` feature inside `app/providers/I18nProvider.tsx`**

In `app/providers/I18nProvider.tsx`:
```typescript
import groupsEn from "@/features/groups/config/locales/en.json";
import groupsEs from "@/features/groups/config/locales/es.json";
import groupsId from "@/features/groups/config/locales/id.json";
```

Add `groups: groupsEn`, `groups: groupsEs`, `groups: groupsId` inside `const messages = {`:
```typescript
const messages = {
  en: {
    ...
    materials: materialsEn,
    groups: groupsEn,
  },
  es: {
    ...
    materials: materialsEs,
    groups: groupsEs,
  },
  id: {
    ...
    materials: materialsId,
    groups: groupsId,
  },
};
```

---

## Task 4: Student Activity Detail Slide-out Sheet Component

**Files:**
- Create: `features/groups/components/GroupStudentActivityDetailSheet.tsx`

- [ ] **Step 1: Create `features/groups/components/GroupStudentActivityDetailSheet.tsx`**

```tsx
"use client";

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
import { useTranslations } from "@/lib/i18n/useTranslation";
import { BookOpen, CheckCircle, Clock, Award, AlertCircle } from "lucide-react";

interface GroupStudentActivityDetailSheetProps {
  groupId: string;
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GroupStudentActivityDetailSheet({
  groupId,
  studentId,
  isOpen,
  onClose,
}: GroupStudentActivityDetailSheetProps) {
  const { t, locale } = useTranslations("groups.students.drawer");
  const { data, isLoading } = useGroupStudentActivityDetail(groupId, studentId, isOpen);

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
            {t("title")}
          </SheetTitle>
          {data?.student && (
            <SheetDescription className="text-sm text-gray-500 font-mono">
              {data.student.name} • {data.student.email}
            </SheetDescription>
          )}
        </SheetHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="w-8 h-8 text-[#6366F1]" />
          </div>
        ) : !data ? (
          <div className="py-12 text-center text-gray-400 font-mono text-sm">
            Data tidak ditemukan
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quiz Attempts Section */}
            <div>
              <h3 className="font-semibold text-sm text-[#1A1C1E] flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-[#6366F1]" /> {t("quizHistory")}
              </h3>
              {data.quiz_attempts_history.length === 0 ? (
                <p className="text-xs text-gray-400 font-mono py-4 bg-[#F7F8FA] rounded-xl text-center border border-gray-150">
                  {t("noQuizHistory")}
                </p>
              ) : (
                <div className="space-y-3">
                  {data.quiz_attempts_history.map((attempt) => {
                    const isPassed = attempt.status?.toLowerCase() === "passed" || attempt.score >= 60;
                    return (
                      <div
                        key={attempt.attempt_id}
                        className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/60 flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-[#1A1C1E]">
                            {attempt.quiz_title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                            <span>Percobaan #{attempt.attempt_number}</span>
                            <span>•</span>
                            <span>{formatDate(attempt.submitted_at)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatDuration(attempt.time_spent_seconds || 0)}
                            </span>
                          </div>
                        </div>
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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Material Reading Timeline Section */}
            <div>
              <h3 className="font-semibold text-sm text-[#1A1C1E] flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#6366F1]" /> {t("readingTimeline")}
              </h3>
              {data.material_reading_timeline.length === 0 ? (
                <p className="text-xs text-gray-400 font-mono py-4 bg-[#F7F8FA] rounded-xl text-center border border-gray-150">
                  {t("noReadingTimeline")}
                </p>
              ) : (
                <div className="space-y-3">
                  {data.material_reading_timeline.map((item) => {
                    const isCompleted = item.status?.toLowerCase() === "completed" || item.scroll_percentage >= 100;
                    return (
                      <div
                        key={item.material_id}
                        className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/60 flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-[#1A1C1E]">
                            {item.material_title}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
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

---

## Task 5: Group Students List & Activity Matrix Component

**Files:**
- Create: `features/groups/components/GroupStudentList.tsx`

- [ ] **Step 1: Create `features/groups/components/GroupStudentList.tsx`**

```tsx
"use client";

import { useState, useMemo } from "react";
import { useGroupStudentsActivity } from "../hooks/useGroups";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { Search, AlertTriangle, UserCheck, UserMinus, Users, ChevronRight } from "lucide-react";
import { GroupStudentActivityDetailSheet } from "./GroupStudentActivityDetailSheet";

interface GroupStudentListProps {
  groupId: string;
}

type BucketFilter = "ALL" | "AT_RISK" | "INACTIVE" | "ON_TRACK";
type SortOption = "name" | "progress" | "score" | "lastActive";

export function GroupStudentList({ groupId }: GroupStudentListProps) {
  const { t, locale } = useTranslations("groups.students");
  const { data, isLoading } = useGroupStudentsActivity(groupId);
  const [bucket, setBucket] = useState<BucketFilter>("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];

    return data.students
      .filter((s) => {
        if (bucket !== "ALL" && s.status?.toUpperCase() !== bucket) return false;
        if (search.trim() !== "") {
          const q = search.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "progress") return a.overall_progress_percentage - b.overall_progress_percentage;
        if (sortBy === "score") return (a.avg_quiz_score || 0) - (b.avg_quiz_score || 0);
        if (sortBy === "lastActive") {
          const timeA = a.last_active_at ? new Date(a.last_active_at).getTime() : 0;
          const timeB = b.last_active_at ? new Date(b.last_active_at).getTime() : 0;
          return timeA - timeB;
        }
        return 0;
      });
  }, [data?.students, bucket, search, sortBy]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const getStatusBadge = (status?: string, statusReasons?: string[]) => {
    const st = status?.toUpperCase();
    if (st === "AT_RISK") {
      return (
        <Badge
          variant="outline"
          className="bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 font-mono text-[10px] px-2 py-0.5"
          title={statusReasons?.join(", ")}
        >
          <AlertTriangle className="w-3 h-3 mr-1 inline" /> {t("statusLabels.AT_RISK")}
        </Badge>
      );
    }
    if (st === "INACTIVE") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-mono text-[10px] px-2 py-0.5"
          title={statusReasons?.join(", ")}
        >
          <UserMinus className="w-3 h-3 mr-1 inline" /> {t("statusLabels.INACTIVE")}
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 font-mono text-[10px] px-2 py-0.5"
      >
        <UserCheck className="w-3 h-3 mr-1 inline" /> {t("statusLabels.ON_TRACK")}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-gray-150/60 shadow-xs">
        <Spinner className="w-8 h-8 text-[#6366F1]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-gray-400 font-mono bg-white rounded-2xl border border-gray-150/60 shadow-xs">
        Data aktivitas mahasiswa tidak tersedia
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-6">
      {/* Smart Status Buckets Bento Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setBucket("ALL")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            bucket === "ALL"
              ? "bg-[#6366F1]/10 border-[#6366F1] ring-2 ring-[#6366F1]/20"
              : "bg-white border-gray-150/60 hover:border-gray-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("buckets.all")}
            </span>
            <Users className="w-4 h-4 text-[#6366F1]" />
          </div>
          <p className="text-2xl font-bold text-[#1A1C1E] font-mono">
            {summary.total_students || 0}
          </p>
        </button>

        <button
          onClick={() => setBucket("AT_RISK")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            bucket === "AT_RISK"
              ? "bg-[#EF4444]/10 border-[#EF4444] ring-2 ring-[#EF4444]/20"
              : "bg-white border-gray-150/60 hover:border-gray-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-semibold text-[#EF4444] uppercase tracking-wider">
              {t("buckets.atRisk")}
            </span>
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <p className="text-2xl font-bold text-[#1A1C1E] font-mono">
            {summary.at_risk_count || 0}
          </p>
        </button>

        <button
          onClick={() => setBucket("INACTIVE")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            bucket === "INACTIVE"
              ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20"
              : "bg-white border-gray-150/60 hover:border-gray-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-semibold text-amber-600 uppercase tracking-wider">
              {t("buckets.inactive")}
            </span>
            <UserMinus className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A1C1E] font-mono">
            {summary.inactive_count || 0}
          </p>
        </button>

        <button
          onClick={() => setBucket("ON_TRACK")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            bucket === "ON_TRACK"
              ? "bg-[#10B981]/10 border-[#10B981] ring-2 ring-[#10B981]/20"
              : "bg-white border-gray-150/60 hover:border-gray-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-semibold text-[#10B981] uppercase tracking-wider">
              {t("buckets.onTrack")}
            </span>
            <UserCheck className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-bold text-[#1A1C1E] font-mono">
            {summary.on_track_count || 0}
          </p>
        </button>
      </div>

      {/* Search and Sort Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-150/60 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#F7F8FA] border-gray-200 focus:bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-mono text-gray-500 whitespace-nowrap">
            {t("sortBy")}:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[#F7F8FA] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-[#1A1C1E] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          >
            <option value="name">{t("sortOptions.name")}</option>
            <option value="progress">{t("sortOptions.progress")}</option>
            <option value="score">{t("sortOptions.score")}</option>
            <option value="lastActive">{t("sortOptions.lastActive")}</option>
          </select>
        </div>
      </div>

      {/* Students Activity Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-150/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-gray-150 font-mono text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">{t("table.student")}</th>
                <th className="py-4 px-4">{t("table.status")}</th>
                <th className="py-4 px-4">{t("table.progress")}</th>
                <th className="py-4 px-4">{t("table.quizScore")}</th>
                <th className="py-4 px-4">{t("table.lastActive")}</th>
                <th className="py-4 px-6 text-right">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150/60 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-mono">
                    Tidak ada mahasiswa yang sesuai dengan filter
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr
                    key={s.student_id}
                    onClick={() => setSelectedStudentId(s.student_id)}
                    className="hover:bg-[#F7F8FA]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#1A1C1E] group-hover:text-[#6366F1] transition-colors">
                        {s.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {s.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(s.status, s.status_reasons)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#6366F1] h-full rounded-full transition-all"
                            style={{ width: `${s.overall_progress_percentage || 0}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-gray-600 font-semibold">
                          {Math.round(s.overall_progress_percentage || 0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold">
                      {s.avg_quiz_score !== null && s.avg_quiz_score !== undefined ? (
                        <span
                          className={
                            s.avg_quiz_score >= 60
                              ? "text-[#10B981]"
                              : "text-[#EF4444]"
                          }
                        >
                          {Math.round(s.avg_quiz_score)} pt
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-gray-500">
                      {formatDate(s.last_active_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudentId(s.student_id);
                        }}
                        className="h-8 rounded-xl font-mono text-xs text-[#6366F1] hover:bg-[#6366F1]/10"
                      >
                        Detail <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Sheet for Granular Detail */}
      {selectedStudentId && (
        <GroupStudentActivityDetailSheet
          groupId={groupId}
          studentId={selectedStudentId}
          isOpen={!!selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
}
```

---

## Task 6: Tab Integration inside `GroupDetail.tsx`

**Files:**
- Modify: `features/groups/components/GroupDetail.tsx:20-25, 360-385`

- [ ] **Step 1: Import `GroupStudentList` into `GroupDetail.tsx`**

In `features/groups/components/GroupDetail.tsx`, add the import:
```tsx
import { GroupStudentList } from "./GroupStudentList";
```

- [ ] **Step 2: Add the `students` Tab to `<TabsList>` and `<TabsContent>`**

In `GroupDetail.tsx` (around lines 363-381 where `<Tabs>` is rendered):

Replace:
```tsx
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-150/60 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg font-mono text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="rounded-lg font-mono text-sm">
              Materi & Kuis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 outline-none">
            <GroupDashboardView groupId={group.id} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6 outline-none">
            {contentGrid}
          </TabsContent>
        </Tabs>
```

With:
```tsx
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-150/60 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg font-mono text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="rounded-lg font-mono text-sm">
              Materi & Kuis
            </TabsTrigger>
            <TabsTrigger value="students" className="rounded-lg font-mono text-sm">
              Mahasiswa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 outline-none">
            <GroupDashboardView groupId={group.id} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6 outline-none">
            {contentGrid}
          </TabsContent>

          <TabsContent value="students" className="space-y-6 outline-none">
            <GroupStudentList groupId={group.id} />
          </TabsContent>
        </Tabs>
```

---

## Task 7: Verification & Quality Check

**Files:**
- Test by running bun commands (`bun run lint`, `bun run build`)

- [ ] **Step 1: Run TypeScript check & Linter**

Run:
```bash
bun run lint
```
Expected: Pass without errors.

- [ ] **Step 2: Run build test to verify zero type mismatches**

Run:
```bash
bun run build
```
Expected: Next.js build succeeds without TypeScript compile errors.

---

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

```bash
git add .
git commit -m "feat(groups): add student activity and progress monitoring tab to lecturer group page"
```
