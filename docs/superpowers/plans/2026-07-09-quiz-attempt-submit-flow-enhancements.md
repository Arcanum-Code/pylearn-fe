# Quiz Attempt Submit Flow Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the quiz submission workflow by keeping the user on the attempt results screen (`/groups/[groupId]/quizzes/attempts/[attemptId]`), removing the "Simpan Progres" button, eliminating double toast notifications, and adding a confirmation dialog before final submission.

**Architecture:** 
1. Modify `useSubmitBulkStudentAnswers` in `features/quizzes/hooks/useQuizAttempts.ts` to accept an options object or `silent?: boolean` flag so we can skip the `"Progres jawaban Anda berhasil disimpan."` toast when auto-saving right before final submission.
2. Update `QuizAttemptClient.tsx` (`features/quizzes/components/attempts/QuizAttemptClient.tsx`):
   - Remove the **Simpan Progres** button.
   - Introduce an `AlertDialog` confirmation modal before final submission (`handleSubmitQuiz`).
   - Remove `router.push(...)` from `handleSubmitQuiz()` so the page remains on `/groups/[groupId]/quizzes/attempts/[attemptId]` and renders `<QuizResultView />`.

**Tech Stack:** React 19, Tailwind CSS v4, shadcn/ui (`AlertDialog`).

---

### Task 1: Add Silent Mode to `useSubmitBulkStudentAnswers` Mutation Hook

**Files:**
- Modify: `features/quizzes/hooks/useQuizAttempts.ts`

- [ ] **Step 1: Update `useSubmitBulkStudentAnswers` to accept options for silent toast**

In `features/quizzes/hooks/useQuizAttempts.ts`, locate this exact block around line 152:

```ts
export function useSubmitBulkStudentAnswers(attemptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitBulkStudentAnswers,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: attemptKeys.detail(attemptId),
      });

      // 2. Berikan umpan balik visual yang nyaman bagi siswa
      toast.success(
        response.message || "Progres jawaban Anda berhasil disimpan.",
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Gagal menyimpan kumpulan jawaban Anda.",
      );
    },
  });
}
```

Replace it with:

```ts
export function useSubmitBulkStudentAnswers(
  attemptId: string,
  options?: { silent?: boolean },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitBulkStudentAnswers,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: attemptKeys.detail(attemptId),
      });

      // Berikan umpan balik visual yang nyaman bagi siswa jika tidak dalam mode silent
      if (!options?.silent) {
        toast.success(
          response.message || "Progres jawaban Anda berhasil disimpan.",
        );
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Gagal menyimpan kumpulan jawaban Anda.",
      );
    },
  });
}
```

---

### Task 2: Refactor `QuizAttemptClient` Submission Flow & UI

**Files:**
- Modify: `features/quizzes/components/attempts/QuizAttemptClient.tsx`

- [ ] **Step 1: Import `AlertDialog` components and `useState` state**

In `features/quizzes/components/attempts/QuizAttemptClient.tsx`, find this exact block around line 8:

```tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, Clock, HelpCircle, Save, Award } from "lucide-react";
```

Replace it with:

```tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Clock, HelpCircle, Award, AlertCircle } from "lucide-react";
```

- [ ] **Step 2: Initialize confirmation dialog state and pass silent flag to `useSubmitBulkStudentAnswers`**

In `features/quizzes/components/attempts/QuizAttemptClient.tsx`, find this exact block around lines 55-60:

```tsx
  const submitAnswer = useSubmitStudentAnswer(attemptId);
  const submitBulkAnswers = useSubmitBulkStudentAnswers(attemptId);
  const submitAttempt = useSubmitQuizAttempt(attemptId);
```

Replace it with:

```tsx
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const submitAnswer = useSubmitStudentAnswer(attemptId);
  const submitBulkAnswers = useSubmitBulkStudentAnswers(attemptId, {
    silent: true,
  });
  const submitAttempt = useSubmitQuizAttempt(attemptId);
```

- [ ] **Step 3: Update `handleSubmitQuiz` to remove redirect (`router.push`) and close dialog**

In `features/quizzes/components/attempts/QuizAttemptClient.tsx`, find this exact block around lines 167-177:

```tsx
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
```

Replace it with:

```tsx
  const handleSubmitQuiz = async () => {
    try {
      // First save all progress silently
      await handleSaveProgress();
      // Then submit the attempt (which displays the single success toast)
      await submitAttempt.mutateAsync();
      setIsConfirmSubmitOpen(false);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };
```

- [ ] **Step 4: Remove "Simpan Progres" button, trigger confirm dialog on "Kumpulkan Jawaban", and render `AlertDialog`**

In `features/quizzes/components/attempts/QuizAttemptClient.tsx`, find this exact block around lines 428-456:

```tsx
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
              Kumpulkan Jawaban
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
```

Replace it with:

```tsx
        {!isSubmitted && questions && questions.length > 0 && (
          <div className="flex justify-end gap-3">
            <Button
              size="lg"
              onClick={() => setIsConfirmSubmitOpen(true)}
              disabled={submitAttempt.isPending || submitBulkAnswers.isPending}
            >
              {(submitAttempt.isPending || submitBulkAnswers.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Kumpulkan Jawaban
            </Button>
          </div>
        )}

        <AlertDialog
          open={isConfirmSubmitOpen}
          onOpenChange={setIsConfirmSubmitOpen}
        >
          <AlertDialogContent className="sm:max-w-[420px]">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <AlertDialogTitle className="text-xl">
                  Konfirmasi Pengumpulan
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin mengumpulkan jawaban kuis ini? Jawaban
                yang sudah dikumpulkan tidak dapat diubah kembali.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel
                disabled={submitAttempt.isPending || submitBulkAnswers.isPending}
              >
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmitQuiz();
                }}
                disabled={submitAttempt.isPending || submitBulkAnswers.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {(submitAttempt.isPending || submitBulkAnswers.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Ya, Kumpulkan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
```

---

### Task 3: Verification & Commit

- [ ] **Step 1: Run ESLint to verify no compilation or syntax errors**

```bash
bun x eslint features/quizzes/hooks/useQuizAttempts.ts features/quizzes/components/attempts/QuizAttemptClient.tsx
```
Expected: PASS with 0 errors.

- [ ] **Step 2: Commit all changes**

```bash
git add features/quizzes/hooks/useQuizAttempts.ts features/quizzes/components/attempts/QuizAttemptClient.tsx docs/superpowers/plans/2026-07-09-quiz-attempt-submit-flow-enhancements.md
git commit -m "feat(quizzes): enhance quiz submission flow with confirmation dialog, silent auto-save, and inline result view transition"
```
