# Quiz Publish Guard and Confirmation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Disable the "Add Question" button when a quiz is published (with tooltip explanation) and add a confirmation dialog before publishing a quiz.

**Architecture:** Two independent changes to `LecturerQuizDetail.tsx`: (1) conditionally disable the "Tambah Soal" button based on `quiz.status === "published"` and wrap it in a Tooltip explaining why, reuse the existing `TooltipProvider` that should wrap the page; (2) add an async `confirm()` call before `publishQuiz()` using the existing `useConfirm` hook with `warning` variant, matching the delete confirmation pattern already used in the same file.

**Tech Stack:** Next.js 16 App Router, React 19, shadcn/ui (Tooltip, Button), useConfirm hook

---

### File Structure

```
Files to MODIFY:
  features/quizzes/components/LecturerQuizDetail.tsx
```

No new files. The `Tooltip` components and `useConfirm` hook already exist in the project.

---

### Task 1: Disable "Add Question" button when quiz is published with tooltip

**Files:**
- Modify: `features/quizzes/components/LecturerQuizDetail.tsx:136-161`

- [ ] **Step 1: Import Tooltip components**

Add to the existing imports at the top of the file (line 6):

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
```

- [ ] **Step 2: Wrap the page in TooltipProvider**

The page currently has no TooltipProvider. Wrap the entire return contents (starting at line 70) with `TooltipProvider>` ... `</TooltipProvider>`.

Before:
```tsx
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 ...">
```

After:
```tsx
  return (
    <TooltipProvider>
      <div className="p-8 max-w-7xl mx-auto space-y-6 ...">
```

And close `</TooltipProvider>` after the closing `</div>` at the end (line 260/261).

- [ ] **Step 3: Wrap "Tambah Soal" button with Tooltip, disable when published**

Replace the current "Tambah Soal" button (lines 144-160) with a conditionally disabled button wrapped in a Tooltip:

```tsx
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button
                      onClick={() =>
                        setQuestionModal({
                          isOpen: true,
                          mode: "create",
                          initialData: {
                            question_text: "",
                            key_answer_text: "",
                            sequence_order: (quiz.questions?.length || 0) + 1,
                          },
                        })
                      }
                      size="sm"
                      disabled={quiz.status === "published"}
                      className="bg-[#6366F1] hover:bg-[#6366F1]/90"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Soal
                    </Button>
                  </span>
                </TooltipTrigger>
                {quiz.status === "published" && (
                  <TooltipContent>
                    Kuis yang sudah dipublikasikan tidak dapat ditambahkan soal baru.
                  </TooltipContent>
                )}
              </Tooltip>
```

Key changes:
- `disabled={quiz.status === "published"}` — disables the button when published
- Wrapped with `Tooltip > TooltipTrigger asChild > span` (span needed because disabled buttons don't fire hover events — the span wrapper preserves tooltip behavior)
- `TooltipContent` only renders when `quiz.status === "published"` showing the explanation
- Remove the old `title` attribute on the publish button's wrapper div (it was a native tooltip) and replace with proper Tooltip component (handled in Task 2)

---

### Task 2: Add confirmation dialog before publishing

**Files:**
- Modify: `features/quizzes/components/LecturerQuizDetail.tsx:107-122`

- [ ] **Step 1: Replace direct `publishQuiz()` call with async confirm**

Change the publish button's `onClick` from direct mutation to an async confirmation handler.

First, add a handler function after `handleDelete` (after line 67):

```tsx
  const handlePublish = async () => {
    const isConfirmed = await confirm({
      title: "Publikasikan Kuis?",
      description: "Kuis yang sudah dipublikasikan tidak dapat diedit lagi. Apakah Anda yakin ingin mempublikasikan kuis ini?",
      confirmText: "Publikasikan",
      cancelText: "Batal",
      variant: "warning",
    });

    if (isConfirmed) {
      publishQuiz();
    }
  };
```

- [ ] **Step 2: Update the publish button to use `handlePublish` and replace native tooltip**

Replace the publish button block (lines 107-123) with:

```tsx
          {quiz.status === "draft" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing || quiz.can_publish === false}
                    className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold"
                  >
                    {isPublishing ? "Publishing..." : "Publish Kuis"}
                  </Button>
                </span>
              </TooltipTrigger>
              {quiz.can_publish === false && (
                <TooltipContent>
                  Grup ini belum memiliki materi yang dipublikasikan, sehingga kuis ini tidak dapat dikunci.
                </TooltipContent>
              )}
            </Tooltip>
          )}
```

Key changes:
- `onClick` changed from `() => publishQuiz()` to `handlePublish`
- Replaced native `title` attribute on wrapping `div` with proper `Tooltip` component
- Tooltip shows explanation when `can_publish === false`

---

### Task 3: Verify the changes

- [ ] **Step 1: Run the linter**

```bash
bun run lint
```
Expected: No errors (pre-existing warnings only).

- [ ] **Step 2: Build the project**

```bash
bun run build
```
Expected: Build succeeds.

### Manual verification checklist

1. Navigate to a draft quiz at `/groups/{groupId}/quizzes/{quizId}`.
2. "Tambah Soal" is enabled and clickable — opens the question form dialog.
3. "Publish Kuis" button is enabled — clicking shows a confirmation dialog with title "Publikasikan Kuis?".
4. Cancel the confirmation — quiz stays as draft, no API call made.
5. Confirm the dialog — quiz publishes, toast shows success.
6. After publish, the page refreshes (via query invalidation).
7. "Tambah Soal" is now disabled with a tooltip "Kuis yang sudah dipublikasikan tidak dapat ditambahkan soal baru." on hover.
8. "Publish Kuis" button is gone (it only renders for draft status).
9. If `can_publish` is false, the publish button is disabled with tooltip explanation.

---

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

```bash
git add .
git commit -m "feat: disable add question when quiz published, add publish confirmation dialog"
```
