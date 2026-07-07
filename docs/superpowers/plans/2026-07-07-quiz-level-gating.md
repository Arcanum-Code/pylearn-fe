# Quiz Level Gating Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lock higher-level quizzes until all lower-level quizzes are completed — if a quiz has `order`/`levelNumber = 3`, the student must complete quizzes 1 and 2 before they can attempt it.

**Architecture:** In `StudentGroupDetail.tsx`, derive a per-quiz `isLockedByLevel` boolean by sorting quizzes by `order` and checking that all preceding quizzes have `status === "completed"`. This is computed alongside the existing `allMaterialsCompleted` gate. The button for such a locked quiz is disabled with a Tooltip explaining which prior quiz must be completed.

**Tech Stack:** Next.js 16 App Router, React 19, shadcn/ui (Tooltip, Button), TypeScript

---

### File Structure

```
Files to MODIFY:
  features/groups/components/StudentGroupDetail.tsx
  features/groups/types/index.ts
```

### Task 1: Add `levelNumber` to the `TimelineItem` type

**Files:**
- Modify: `features/groups/types/index.ts:47-57`

- [ ] **Step 1: Add optional `levelNumber` field**

```typescript
export interface TimelineItem {
  type: TimelineItemType;
  id: string;
  title: string;
  description?: string | null;
  status: "completed" | "in_progress" | "not_started";
  scrollPercentage?: number | null;
  deadline?: string | null;
  bestScore?: number | null;
  order: number;
  levelNumber?: number;
}
```

This is optional so it doesn't break existing API responses that may not include it. Falls back to `order` when computing quiz ordering.

### Task 2: Implement per-quiz level gating

**Files:**
- Modify: `features/groups/components/StudentGroupDetail.tsx`

- [ ] **Step 1: Compute `isLockedByLevel` per quiz after the existing `isLocked`**

After line 314 (`const isLocked = !allMaterialsCompleted;`), add the per-quiz level locking:

```tsx
                    // Compute level-based gating: a quiz is locked if any prior quiz (by order) is not completed
                    const sortedQuizzes = [...quizzes].sort((a, b) => a.order - b.order);
                    const currentIndex = sortedQuizzes.findIndex(q => q.id === item.id);
                    const previousIncomplete = sortedQuizzes.slice(0, currentIndex).find(q => q.status !== "completed");
                    const isLockedByLevel = !!previousIncomplete && !isLocked;
                    const lockedByQuiz = isLockedByLevel ? previousIncomplete! : null;
```

This sorts all quizzes by `order`, finds the current quiz's position, and checks if any prior quiz is not completed. The `isLockedByLevel` flag is independent of `isLocked` (materials gate).

- [ ] **Step 2: Update the locked-state condition to also check `isLockedByLevel`**

The existing `if (isLocked)` block (line 338) should become `if (isLocked || isLockedByLevel)`:

```tsx
                      if (isLocked || isLockedByLevel) {
```

- [ ] **Step 3: Update the disabled button tooltip message based on lock type**

In the locked state block, change the conditional tooltip to distinguish between materials-locked and level-locked:

```tsx
                            <TooltipContent>
                              {isLockedByLevel
                                ? `Selesaikan kuis "${lockedByQuiz?.title}" terlebih dahulu`
                                : "Selesaikan semua materi terlebih dahulu"}
                            </TooltipContent>
```

Also update the locked icon choice inside the icon area (around line 409-413) — it currently shows `Lock` icon based on `isLocked`, extend to include `isLockedByLevel`:

```tsx
                              {item.status === "completed" ? (
                                <Award className="h-5 w-5" />
                              ) : (isLocked || isLockedByLevel) ? (
                                <Lock className="h-5 w-5" />
                              ) : (
                                <HelpCircle className="h-5 w-5" />
                              )}
```

Note: The Lock icon render already uses `isLocked` — change it to `isLocked || isLockedByLevel`.

Also update the existing disabled button prop — the disabled button needs a `span` wrapper for tooltip to work with disabled buttons. Currently the locked button already uses `<span>` (line 350), so it should work as-is.

- [ ] **Step 4: Run the linter**

```bash
bun run lint
```
Expected: No errors.

- [ ] **Step 5: Build the project**

```bash
bun run build
```
Expected: Build succeeds.

### Manual verification checklist

1. Navigate to a group page with multiple quizzes at different levels.
2. Quiz level 1 — should be available (if materials are done).
3. Quiz level 2 — if level 1 is not completed, the button is disabled with tooltip "Selesaikan kuis '{level1_title}' terlebih dahulu".
4. Quiz level 3 — if levels 1 and 2 are not completed, the button is disabled with tooltip "Selesaikan kuis '{level2_title}' terlebih dahulu".
5. Complete level 1 — level 2 becomes available.
6. The existing materials-lock still works independently (all materials must be completed too).

---

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

```bash
git add .
git commit -m "feat: gate quiz attempts by level order — lower-level quizzes must be completed first"
```
