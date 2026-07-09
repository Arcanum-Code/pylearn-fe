# Student Quiz Passing Status and Score Formatting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Format `bestScore` display using `formatScoreOrPoints` on the `/groups/[groupId]` student detail page, propose API contract updates for passing status (`isPassed` and `passThreshold`), implement UI handling for failed/passed quiz states (including two action buttons "Ulangi Kuis" and "Lihat Hasil" for failed quizzes), and enforce strict passing checks for sequential quiz level gating.

**Architecture:** We will update the `GET /groups/mahasiswa/:groupId` API contract documentation and TypeScript domain interface (`TimelineItem`) to include `passThreshold` and `isPassed`. In `StudentGroupDetail.tsx`, we will apply `formatScoreOrPoints` when rendering any quiz score, introduce a dedicated badge and dual action buttons for failed completed quizzes (`status === "completed"` with `isPassed === false`), and update the quiz gating logic so subsequent quizzes require `!q.isPassed` to be false on preceding quizzes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Bun.

---

### Task 1: API Documentation & TypeScript Interface Update

**Files:**
- Modify: `docs/frontend/student-material-api.md` (diff)
- Modify: `features/groups/types/index.ts` (diff)

- [ ] **Step 1: Update `GET /groups/mahasiswa/:groupId` API documentation**

In `docs/frontend/student-material-api.md`, find this exact block:

```markdown
      {
        "type": "quiz",
        "id": "quiz_1",
        "title": "Kuis Dasar Python",
        "description": "Uji pemahaman Anda tentang variabel dan tipe data.",
        "status": "not_started",
        "deadline": "2026-07-20T23:59:59.000Z",
        "bestScore": null,
        "order": 3
      }
```

Replace it with:

```markdown
      {
        "type": "quiz",
        "id": "quiz_1",
        "title": "Kuis Dasar Python",
        "description": "Uji pemahaman Anda tentang variabel dan tipe data.",
        "status": "not_started",
        "deadline": "2026-07-20T23:59:59.000Z",
        "bestScore": null,
        "passThreshold": 70,
        "isPassed": null,
        "order": 3
      }
```

- [ ] **Step 2: Add `passThreshold` and `isPassed` to `TimelineItem` in TypeScript definitions**

In `features/groups/types/index.ts`, find this exact block:

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

Replace it with:

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
  passThreshold?: number | null;
  isPassed?: boolean | null;
  order: number;
  levelNumber?: number;
}
```

---

### Task 2: Unit Test for Score Formatting Helper

**Files:**
- Create: `features/groups/utils/__tests__/format.test.ts`

- [ ] **Step 1: Write unit tests verifying `formatScoreOrPoints` with long decimals and integers**

Create `features/groups/utils/__tests__/format.test.ts` with the following contents:

```typescript
import { describe, expect, it } from "bun:test";
import { formatScoreOrPoints } from "../format";

describe("formatScoreOrPoints", () => {
  it("should return integer strings without trailing decimals", () => {
    expect(formatScoreOrPoints(96)).toBe("96");
    expect(formatScoreOrPoints("100")).toBe("100");
  });

  it("should round long decimal numbers to 1 decimal place", () => {
    expect(formatScoreOrPoints(96.66666666666666)).toBe("96.7");
    expect(formatScoreOrPoints("85.333333")).toBe("85.3");
  });

  it("should strip .0 from rounded decimals", () => {
    expect(formatScoreOrPoints(95.00000001)).toBe("95");
  });

  it("should handle null and undefined gracefully", () => {
    expect(formatScoreOrPoints(null)).toBe("0");
    expect(formatScoreOrPoints(undefined)).toBe("0");
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `bun test features/groups/utils/__tests__/format.test.ts`
Expected: `1 pass` (or 4 passes inside 1 test file).

---

### Task 3: UI Updates on `/groups/[groupId]` Student Detail Page

**Files:**
- Modify: `features/groups/components/StudentGroupDetail.tsx` (diff)

- [ ] **Step 1: Import `formatScoreOrPoints` helper and add `handleRetakeQuiz` handler**

In `features/groups/components/StudentGroupDetail.tsx`, find this exact block:

```typescript
import {
  getStudentQuizAttempts,
  createStudentQuizAttempt,
} from "@/features/quizzes";

export function StudentGroupDetail({ id }: { id: string }) {
```

Replace it with:

```typescript
import {
  getStudentQuizAttempts,
  createStudentQuizAttempt,
} from "@/features/quizzes";
import { formatScoreOrPoints } from "../utils/format";

export function StudentGroupDetail({ id }: { id: string }) {
```

And inside `StudentGroupDetail`, find this exact block:

```typescript
      // If not started or no attempt found, start a new one directly using quizId
      const { attempt } = await createStudentQuizAttempt({ quizId: item.id });
      router.push(`/groups/${id}/quizzes/attempts/${attempt.id}`);
    } catch (error: any) {
      console.error("Quiz action error:", error);
      toast.error(
        error?.response?.data?.message || "Gagal memproses pengerjaan kuis.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };
```

Replace it with:

```typescript
      // If not started or no attempt found, start a new one directly using quizId
      const { attempt } = await createStudentQuizAttempt({ quizId: item.id });
      router.push(`/groups/${id}/quizzes/attempts/${attempt.id}`);
    } catch (error: any) {
      console.error("Quiz action error:", error);
      toast.error(
        error?.response?.data?.message || "Gagal memproses pengerjaan kuis.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRetakeQuiz = async (item: TimelineItem) => {
    setActionLoadingId(`${item.id}_retake`);
    try {
      const attempts = await getStudentQuizAttempts({ quizId: item.id });
      const activeAttempt = attempts.find((a) => !a.submittedAt);
      if (activeAttempt) {
        router.push(`/groups/${id}/quizzes/attempts/${activeAttempt.id}`);
        return;
      }
      const { attempt } = await createStudentQuizAttempt({ quizId: item.id });
      router.push(`/groups/${id}/quizzes/attempts/${attempt.id}`);
    } catch (error: any) {
      console.error("Retake quiz error:", error);
      toast.error(
        error?.response?.data?.message || "Gagal memulai ulang kuis.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };
```

- [ ] **Step 2: Update quiz level gating check to require `isPassed` alongside `completed`**

In `features/groups/components/StudentGroupDetail.tsx`, find this exact block:

```typescript
                    const currentIndex = sortedQuizzes.findIndex(
                      (q) => q.id === item.id,
                    );
                    const previousIncomplete = sortedQuizzes
                      .slice(0, currentIndex)
                      .find((q) => q.status !== "completed");
                    const isLockedByLevel = !!previousIncomplete && !isLocked;
                    const lockedByQuiz = isLockedByLevel
                      ? previousIncomplete!
                      : null;
```

Replace it with:

```typescript
                    const currentIndex = sortedQuizzes.findIndex(
                      (q) => q.id === item.id,
                    );
                    const previousIncomplete = sortedQuizzes
                      .slice(0, currentIndex)
                      .find((q) => q.status !== "completed" || q.isPassed === false);
                    const isLockedByLevel = !!previousIncomplete && !isLocked;
                    const lockedByQuiz = isLockedByLevel
                      ? previousIncomplete!
                      : null;
```

- [ ] **Step 3: Update quiz card status badge, score formatting, and dual action buttons for `status === "completed"`**

In `features/groups/components/StudentGroupDetail.tsx`, find this exact block:

```typescript
                    if (item.status === "completed") {
                      cardClass =
                        "bg-white border-green-100 hover:border-green-200";
                      iconBgClass = "bg-green-50 text-green-500";
                      statusBadge = (
                        <Badge className="bg-green-50 hover:bg-green-50 text-green-700 border border-green-200 font-medium flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Selesai{" "}
                          {item.bestScore !== null
                            ? `(Skor Terbaik: ${item.bestScore})`
                            : ""}
                        </Badge>
                      );

                      actionButton = (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === item.id}
                          onClick={() => handleQuizAction(item)}
                          className="border-green-250 text-green-700 hover:bg-green-50 font-semibold cursor-pointer"
                        >
                          {actionLoadingId === item.id ? (
                            <Spinner className="h-4 w-4 text-green-700" />
                          ) : (
                            "Lihat Hasil"
                          )}
                        </Button>
                      );
                    } else {
```

Replace it with:

```typescript
                    if (item.status === "completed") {
                      if (item.isPassed === false) {
                        cardClass =
                          "bg-white border-red-100 hover:border-red-200";
                        iconBgClass = "bg-red-50 text-red-500";
                        statusBadge = (
                          <Badge className="bg-red-50 hover:bg-red-50 text-red-700 border border-red-200 font-medium flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Belum Lulus (Skor: {formatScoreOrPoints(item.bestScore)} / Min: {item.passThreshold ?? 70})
                          </Badge>
                        );

                        actionButton = (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoadingId === item.id || actionLoadingId === `${item.id}_retake`}
                              onClick={() => handleQuizAction(item)}
                              className="border-gray-250 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
                            >
                              {actionLoadingId === item.id ? (
                                <Spinner className="h-4 w-4 text-gray-700" />
                              ) : (
                                "Lihat Hasil"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              disabled={actionLoadingId === item.id || actionLoadingId === `${item.id}_retake`}
                              onClick={() => handleRetakeQuiz(item)}
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
                            >
                              {actionLoadingId === `${item.id}_retake` ? (
                                <Spinner className="h-4 w-4 text-white" />
                              ) : (
                                "Ulangi Kuis"
                              )}
                            </Button>
                          </div>
                        );
                      } else {
                        cardClass =
                          "bg-white border-green-100 hover:border-green-200";
                        iconBgClass = "bg-green-50 text-green-500";
                        statusBadge = (
                          <Badge className="bg-green-50 hover:bg-green-50 text-green-700 border border-green-200 font-medium flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Selesai{" "}
                            {item.bestScore !== null && item.bestScore !== undefined
                              ? `(Skor Terbaik: ${formatScoreOrPoints(item.bestScore)})`
                              : ""}
                          </Badge>
                        );

                        actionButton = (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleQuizAction(item)}
                            className="border-green-250 text-green-700 hover:bg-green-50 font-semibold cursor-pointer"
                          >
                            {actionLoadingId === item.id ? (
                              <Spinner className="h-4 w-4 text-green-700" />
                            ) : (
                              "Lihat Hasil"
                            )}
                          </Button>
                        );
                      }
                    } else {
```

- [ ] **Step 4: Update tooltip text for locked quiz cards when blocked by an unpassed quiz level**

In `features/groups/components/StudentGroupDetail.tsx`, find this exact block:

```typescript
                            <TooltipContent>
                              {isLockedByLevel
                                ? `Selesaikan kuis "${lockedByQuiz?.title}" terlebih dahulu`
                                : "Selesaikan semua materi terlebih dahulu"}
                            </TooltipContent>
```

Replace it with:

```typescript
                            <TooltipContent>
                              {isLockedByLevel
                                ? lockedByQuiz?.isPassed === false
                                  ? `Anda harus lulus kuis "${lockedByQuiz?.title}" terlebih dahulu`
                                  : `Selesaikan kuis "${lockedByQuiz?.title}" terlebih dahulu`
                                : "Selesaikan semua materi terlebih dahulu"}
                            </TooltipContent>
```

- [ ] **Step 5: Verify build & lint checks**

Run: `bun run lint`
Expected: PASS with 0 lint errors.

---

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

```bash
git add docs/frontend/student-material-api.md features/groups/types/index.ts features/groups/utils/__tests__/format.test.ts features/groups/components/StudentGroupDetail.tsx
git commit -m "feat(groups): add quiz pass status, format best score, and support failed quiz retake actions"
```
