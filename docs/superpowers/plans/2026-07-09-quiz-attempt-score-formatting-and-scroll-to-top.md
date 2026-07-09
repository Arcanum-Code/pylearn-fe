# Quiz Attempt Score Formatting and Scroll to Top Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Format all quiz scores and points across student attempt views and lecturer result tables using `formatScoreOrPoints`, and ensure the browser smoothly scrolls back to the top of the page when a quiz is submitted or results are displayed.

**Architecture:**
1. Import `formatScoreOrPoints` from `@/features/groups/utils/format` into:
   - `features/quizzes/components/attempts/QuizResultView.tsx`
   - `features/quizzes/components/attempts/QuizAttemptClient.tsx`
   - `features/quizzes/components/results/QuizResultsTable.tsx`
2. Apply `formatScoreOrPoints(...)` around raw numbers (`results.score`, `detail.maxScore`, `question.maxScore`, `result.score`).
3. Add `window.scrollTo({ top: 0, behavior: "smooth" })` to `handleSubmitQuiz()` (`QuizAttemptClient.tsx`) and to a mount `useEffect` in `QuizResultView.tsx`.

**Tech Stack:** React 19, Next.js, Tailwind CSS v4.

---

### Task 1: Format Scores & Add Scroll to Top in `QuizResultView`

**Files:**
- Modify: `features/quizzes/components/attempts/QuizResultView.tsx`

- [ ] **Step 1: Add imports (`useEffect` from React and `formatScoreOrPoints`)**

In `features/quizzes/components/attempts/QuizResultView.tsx`, find lines 1-8:

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { QuizAttemptResultData, StudentQuizAttemptResultData } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
```

Replace with:

```tsx
"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { QuizAttemptResultData, StudentQuizAttemptResultData } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatScoreOrPoints } from "@/features/groups/utils/format";
```

- [ ] **Step 2: Add mount `useEffect` for smooth scrolling right inside `QuizResultView`**

In `features/quizzes/components/attempts/QuizResultView.tsx`, find line 19 (`export function QuizResultView({ results, isLoading }: QuizResultViewProps) {`):

```tsx
export function QuizResultView({ results, isLoading }: QuizResultViewProps) {
  if (isLoading) {
```

Replace with:

```tsx
export function QuizResultView({ results, isLoading }: QuizResultViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
```

- [ ] **Step 3: Format `results.score` and `detail.maxScore`**

In `features/quizzes/components/attempts/QuizResultView.tsx`, find line 78 (`{results.score}` inside the final score block):

```tsx
              <span className="text-4xl font-bold text-primary">
                {results.score}
              </span>
```

Replace with:

```tsx
              <span className="text-4xl font-bold text-primary">
                {formatScoreOrPoints(results.score)}
              </span>
```

And find line 116 (`Max Score: {detail.maxScore}` inside the details map):

```tsx
                    <div className="mt-2 flex justify-end">
                      <Badge variant="outline" className="text-xs">
                        Max Score: {detail.maxScore}
                      </Badge>
                    </div>
```

Replace with:

```tsx
                    <div className="mt-2 flex justify-end">
                      <Badge variant="outline" className="text-xs">
                        Max Score: {formatScoreOrPoints(detail.maxScore)}
                      </Badge>
                    </div>
```

---

### Task 2: Add Scroll to Top and Format Max Score in `QuizAttemptClient`

**Files:**
- Modify: `features/quizzes/components/attempts/QuizAttemptClient.tsx`

- [ ] **Step 1: Import `formatScoreOrPoints`**

In `features/quizzes/components/attempts/QuizAttemptClient.tsx`, locate the imports near the top around line 24 (`import { QuizResultView } from "./QuizResultView";`):

```tsx
import { useRouter } from "next/navigation";
import { QuizResultView } from "./QuizResultView";
import { TooltipProvider } from "@/components/ui/tooltip";
```

Replace with:

```tsx
import { useRouter } from "next/navigation";
import { QuizResultView } from "./QuizResultView";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatScoreOrPoints } from "@/features/groups/utils/format";
```

- [ ] **Step 2: Add smooth scrolling right after `submitAttempt.mutateAsync()` completes**

In `features/quizzes/components/attempts/QuizAttemptClient.tsx`, locate `handleSubmitQuiz` around line 174:

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

Replace with:

```tsx
  const handleSubmitQuiz = async () => {
    try {
      // First save all progress silently
      await handleSaveProgress();
      // Then submit the attempt (which displays the single success toast)
      await submitAttempt.mutateAsync();
      setIsConfirmSubmitOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };
```

- [ ] **Step 3: Format `question.maxScore`**

In `features/quizzes/components/attempts/QuizAttemptClient.tsx`, locate `Max Score: {question.maxScore}` around line 440:

```tsx
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Max Score: {question.maxScore}
                      </span>
                    </div>
```

Replace with:

```tsx
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Max Score: {formatScoreOrPoints(question.maxScore)}
                      </span>
                    </div>
```

---

### Task 3: Format Scores in `QuizResultsTable` (Lecturer View)

**Files:**
- Modify: `features/quizzes/components/results/QuizResultsTable.tsx`

- [ ] **Step 1: Import `formatScoreOrPoints`**

In `features/quizzes/components/results/QuizResultsTable.tsx`, locate imports around line 13 (`import { Badge } from "@/components/ui/badge";`):

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
```

Replace with:

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatScoreOrPoints } from "@/features/groups/utils/format";
```

- [ ] **Step 2: Format `result.score` inside the table cell**

In `features/quizzes/components/results/QuizResultsTable.tsx`, locate line 77 (`{result.score}` inside the `<Badge>`):

```tsx
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
```

Replace with:

```tsx
            <TableCell className="text-center">
              <div className="flex flex-col items-center gap-1">
                <Badge 
                  variant={result.score >= 70 ? "default" : "destructive"} 
                  className="font-bold text-sm px-2.5 py-0.5"
                >
                  {formatScoreOrPoints(result.score)}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {result.totalQuestions} Soal
                </span>
              </div>
            </TableCell>
```

---

### Task 4: Verification & Commit

- [ ] **Step 1: Run ESLint to verify no syntax or compilation errors**

```bash
bun x eslint features/quizzes/components/attempts/QuizResultView.tsx features/quizzes/components/attempts/QuizAttemptClient.tsx features/quizzes/components/results/QuizResultsTable.tsx
```
Expected: PASS with 0 errors.

- [ ] **Step 2: Commit all changes**

```bash
git add features/quizzes/components/attempts/QuizResultView.tsx features/quizzes/components/attempts/QuizAttemptClient.tsx features/quizzes/components/results/QuizResultsTable.tsx docs/superpowers/plans/2026-07-09-quiz-attempt-score-formatting-and-scroll-to-top.md
git commit -m "feat(quizzes): format quiz scores using formatScoreOrPoints and add smooth scroll-to-top on attempt completion"
```
