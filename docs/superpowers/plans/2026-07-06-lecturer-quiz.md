# Lecturer Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Lecturer Quiz APIs (CRUD for quizzes, questions, and blanks) and the corresponding UI for lecturers to manage them within the Group Details context.

**Architecture:** We will extend the existing `quizzes` feature by adding dedicated types, schemas, services, and hooks for the lecturer APIs. We will update `GroupDetail` to allow creating quizzes, and add a new Next.js route for the detailed Quiz Management page where questions and fill-in-the-blank configurations are managed.

**Tech Stack:** Next.js (App Router), `pnpm`, React Query, Axios, `react-hook-form`, `zod`, `shadcn/ui`, Tailwind CSS.

---

### Task 1: API Configuration & Types

**Files:**

- Modify: `app/api/api.ts`
- Create: `features/quizzes/types/lecturer-quiz.ts`

- [ ] **Step 1: Add LECTURER_QUIZZES to API_ENDPOINTS**

Modify `app/api/api.ts` to include the new endpoints. Add this before the `STORAGE` key:

```typescript
  LECTURER_QUIZZES: {
    LIST_BY_GROUP: (groupId: string) => `${API_URL}/groups/${groupId}/quizzes`,
    DETAIL: (quizId: string) => `${API_URL}/quizzes/${quizId}`,
    CREATE: (groupId: string) => `${API_URL}/groups/${groupId}/quizzes`,
    UPDATE: (quizId: string) => `${API_URL}/quizzes/${quizId}`,
    DELETE: (quizId: string) => `${API_URL}/quizzes/${quizId}`,
    PUBLISH: (quizId: string) => `${API_URL}/quizzes/${quizId}/publish`,
    CREATE_QUESTION: (quizId: string) => `${API_URL}/quizzes/${quizId}/questions`,
    UPDATE_QUESTION: (questionId: string) => `${API_URL}/questions/${questionId}`,
    DELETE_QUESTION: (questionId: string) => `${API_URL}/questions/${questionId}`,
    REPLACE_BLANKS: (questionId: string) => `${API_URL}/questions/${questionId}/blanks`,
  },
```

- [ ] **Step 2: Define Lecturer Quiz Types**

Create `features/quizzes/types/lecturer-quiz.ts`:

```typescript
export interface LecturerQuizBlank {
  blank_id: string;
  keyword: string;
  start_index: number;
  end_index: number;
}

export interface LecturerQuizQuestion {
  question_id: string;
  question_text: string;
  key_answer_text: string;
  sequence_order: number;
  blanks: LecturerQuizBlank[];
}

export interface LecturerGatingMaterial {
  material_id: string;
  title: string;
  sequence: number;
}

export interface LecturerQuizDetail {
  quiz_id: string;
  group_id: string;
  level: number;
  title: string;
  status: "draft" | "published";
  pass_threshold: number;
  questions: LecturerQuizQuestion[];
  gating_materials: LecturerGatingMaterial[];
}

export interface LecturerQuizListItem {
  quiz_id: string;
  level: number;
  title: string;
  status: "draft" | "published";
  question_count: number;
}
```

### Task 2: Validation Schemas

**Files:**

- Create: `features/quizzes/schemas/lecturerQuizSchema.ts`

- [ ] **Step 1: Write Zod schemas for the forms**

Create `features/quizzes/schemas/lecturerQuizSchema.ts`:

```typescript
import { z } from "zod";

export const createLecturerQuizSchema = z.object({
  level: z.number().int().min(1, "Level minimal 1"),
  title: z.string().min(1, "Judul kuis wajib diisi"),
  pass_threshold: z.number().int().min(0).max(100).default(70),
});

export type CreateLecturerQuizFormData = z.infer<
  typeof createLecturerQuizSchema
>;

export const updateLecturerQuizSchema = createLecturerQuizSchema.partial();
export type UpdateLecturerQuizFormData = z.infer<
  typeof updateLecturerQuizSchema
>;

export const lecturerQuestionSchema = z.object({
  question_text: z.string().min(1, "Pertanyaan wajib diisi"),
  key_answer_text: z.string().min(1, "Kunci jawaban wajib diisi"),
  sequence_order: z.number().int().min(1),
});

export type LecturerQuestionFormData = z.infer<typeof lecturerQuestionSchema>;

export const lecturerBlankSchema = z.object({
  keyword: z.string().min(1),
  start_index: z.number().int().min(0),
  end_index: z.number().int().min(1),
});

export const replaceBlanksSchema = z.object({
  blanks: z.array(lecturerBlankSchema),
});

export type ReplaceBlanksFormData = z.infer<typeof replaceBlanksSchema>;
```

### Task 3: Services & Hooks for Quiz Management

**Files:**

- Create: `features/quizzes/services/lecturerQuizApi.ts`
- Create: `features/quizzes/hooks/useLecturerQuizzes.ts`

- [ ] **Step 1: Implement Lecturer Quiz API Service**

Create `features/quizzes/services/lecturerQuizApi.ts`:

```typescript
import { ApiAxios } from "@utils/axios";
import { API_ENDPOINTS } from "@/app/api/api";
import {
  LecturerQuizDetail,
  LecturerQuizListItem,
} from "../types/lecturer-quiz";
import {
  CreateLecturerQuizFormData,
  UpdateLecturerQuizFormData,
  LecturerQuestionFormData,
  ReplaceBlanksFormData,
} from "../schemas/lecturerQuizSchema";

export const LecturerQuizService = {
  getQuizzesByGroup: async (groupId: string) => {
    const { data } = await ApiAxios.get<{
      success: boolean;
      data: { quizzes: LecturerQuizListItem[] };
    }>(API_ENDPOINTS.LECTURER_QUIZZES.LIST_BY_GROUP(groupId));
    return data.data.quizzes;
  },

  getQuizDetail: async (quizId: string) => {
    const { data } = await ApiAxios.get<{
      success: boolean;
      data: LecturerQuizDetail;
    }>(API_ENDPOINTS.LECTURER_QUIZZES.DETAIL(quizId));
    return data.data;
  },

  createQuiz: async (groupId: string, payload: CreateLecturerQuizFormData) => {
    const { data } = await ApiAxios.post(
      API_ENDPOINTS.LECTURER_QUIZZES.CREATE(groupId),
      payload,
    );
    return data;
  },

  updateQuiz: async (quizId: string, payload: UpdateLecturerQuizFormData) => {
    const { data } = await ApiAxios.patch(
      API_ENDPOINTS.LECTURER_QUIZZES.UPDATE(quizId),
      payload,
    );
    return data;
  },

  deleteQuiz: async (quizId: string) => {
    const { data } = await ApiAxios.delete(
      API_ENDPOINTS.LECTURER_QUIZZES.DELETE(quizId),
    );
    return data;
  },

  publishQuiz: async (quizId: string) => {
    const { data } = await ApiAxios.post(
      API_ENDPOINTS.LECTURER_QUIZZES.PUBLISH(quizId),
    );
    return data;
  },

  createQuestion: async (quizId: string, payload: LecturerQuestionFormData) => {
    const { data } = await ApiAxios.post(
      API_ENDPOINTS.LECTURER_QUIZZES.CREATE_QUESTION(quizId),
      payload,
    );
    return data;
  },

  updateQuestion: async (
    questionId: string,
    payload: Partial<LecturerQuestionFormData>,
  ) => {
    const { data } = await ApiAxios.patch(
      API_ENDPOINTS.LECTURER_QUIZZES.UPDATE_QUESTION(questionId),
      payload,
    );
    return data;
  },

  deleteQuestion: async (questionId: string) => {
    const { data } = await ApiAxios.delete(
      API_ENDPOINTS.LECTURER_QUIZZES.DELETE_QUESTION(questionId),
    );
    return data;
  },

  replaceBlanks: async (questionId: string, payload: ReplaceBlanksFormData) => {
    const { data } = await ApiAxios.put(
      API_ENDPOINTS.LECTURER_QUIZZES.REPLACE_BLANKS(questionId),
      payload,
    );
    return data;
  },
};
```

- [ ] **Step 2: Implement React Query Hooks**

Create `features/quizzes/hooks/useLecturerQuizzes.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LecturerQuizService } from "../services/lecturerQuizApi";
import { toast } from "sonner";
import { groupKeys } from "@/features/groups/hooks/useGroups";

export const lecturerQuizKeys = {
  all: ["lecturerQuizzes"] as const,
  lists: (groupId: string) =>
    [...lecturerQuizKeys.all, "list", groupId] as const,
  detail: (quizId: string) =>
    [...lecturerQuizKeys.all, "detail", quizId] as const,
};

export const useLecturerQuizzes = (groupId: string) => {
  return useQuery({
    queryKey: lecturerQuizKeys.lists(groupId),
    queryFn: () => LecturerQuizService.getQuizzesByGroup(groupId),
    enabled: !!groupId,
  });
};

export const useLecturerQuizDetail = (quizId: string) => {
  return useQuery({
    queryKey: lecturerQuizKeys.detail(quizId),
    queryFn: () => LecturerQuizService.getQuizDetail(quizId),
    enabled: !!quizId,
  });
};

export const useCreateLecturerQuiz = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof LecturerQuizService.createQuiz>[1]) =>
      LecturerQuizService.createQuiz(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lecturerQuizKeys.lists(groupId),
      });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
      toast.success("Berhasil membuat kuis");
    },
    onError: () => toast.error("Gagal membuat kuis"),
  });
};

// Implement similar mutations for update, delete, publish, and question management...
```

### Task 4: UI - Create Quiz Dialog

**Files:**

- Create: `features/quizzes/components/CreateLecturerQuizDialog.tsx`
- Modify: `features/quizzes/index.ts`

- [ ] **Step 1: Create Dialog Component**

Create `features/quizzes/components/CreateLecturerQuizDialog.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLecturerQuiz } from "../hooks/useLecturerQuizzes";
import {
  CreateLecturerQuizFormData,
  createLecturerQuizSchema,
} from "../schemas/lecturerQuizSchema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function CreateLecturerQuizDialog({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateLecturerQuiz(groupId);

  // Implementation of form using react-hook-form (Form, FormControl, FormField, FormItem, FormLabel, FormMessage)
  // ...

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" /> Buat Kuis
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Kuis Baru</DialogTitle>
        </DialogHeader>
        {/* Form implementation here */}
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Export from index**

Modify `features/quizzes/index.ts` to export `CreateLecturerQuizDialog`.

### Task 5: Integration - Group Detail Page

**Files:**

- Modify: `features/groups/components/GroupDetail.tsx`

- [ ] **Step 1: Add Dialog to Quizzes Tile**

In `GroupDetail.tsx`, find the `Quizzes Bento Tile`. Update it to use `CreateLecturerQuizDialog`:

```tsx
import { CreateLecturerQuizDialog } from "@/features/quizzes";

// Inside the component:
<div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-3">
    <div className="p-3 bg-[#10B981]/10 text-[#10B981] rounded-xl">
      <CheckCircle className="w-6 h-6" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-[#1A1C1E]">Kuis Kelas</h2>
      <p className="text-xs text-gray-500 mt-0.5">
        Daftar latihan kuis yang ditugaskan ke kelas ini.
      </p>
    </div>
  </div>
  {!isMahasiswa && <CreateLecturerQuizDialog groupId={group.id} />}
</div>;
```

- [ ] **Step 2: Add Links to Quiz Management**

Wrap the quiz title in a `<Link>` tag directing to `/groups/${group.id}/quizzes/${q.id}` if the user is not a Mahasiswa.

### Task 6: UI - Quiz Management Page

**Files:**

- Create: `app/(main)/groups/[id]/quizzes/[quizId]/page.tsx`
- Create: `features/quizzes/components/LecturerQuizDetail.tsx`

- [ ] **Step 1: Create Route**

Create `app/(main)/groups/[id]/quizzes/[quizId]/page.tsx`:

```tsx
import { LecturerQuizDetail } from "@/features/quizzes/components/LecturerQuizDetail";

export default async function QuizManagementPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id, quizId } = await params;
  return <LecturerQuizDetail groupId={id} quizId={quizId} />;
}
```

- [ ] **Step 2: Create Detail Component**

Create `features/quizzes/components/LecturerQuizDetail.tsx`. This component fetches the quiz details via `useLecturerQuizDetail`, displays metadata, and maps over the questions.

### Task 7: UI - Question Management (The Fill-in-the-Blanks UX)

**Files:**

- Create: `features/quizzes/components/LecturerQuestionForm.tsx`

- [ ] **Step 1: Implement the text selection logic**

Create a component where the lecturer types the `key_answer_text`. Below it, display the text as clickable tokens (split by spaces). When a token is clicked, register its `start_index` and `end_index` and mark it as a blank. Use `replaceBlanks` API mutation to save.

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add .
git commit -m "feat: implement lecturer quiz API integration and management UI"
```
