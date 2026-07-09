# Quiz Card Mobile Layout Bugfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the layout overlap bug on `/groups/[groupId]` for quizzes with two buttons by updating the card breakpoint to `lg:flex-row` and stretching buttons to full width on mobile/tablet screens.

**Architecture:** Change card layouts from `flex-col sm:flex-row` to `flex-col lg:flex-row`. Update action buttons container and buttons inside `StudentGroupDetail.tsx` to expand (`w-full`, `flex-1`) on mobile/tablet, while retaining their compact, right-aligned style (`lg:w-auto`, `lg:flex-initial`) on desktop.

**Tech Stack:** React 19, Tailwind CSS v4, shadcn/ui.

---

### Task 1: UI Layout Refactoring in StudentGroupDetail

**Files:**
- Modify: `features/groups/components/StudentGroupDetail.tsx` (diff)

- [ ] **Step 1: Update Materials Card layout and buttons wrapper to use `lg:` breakpoint**

In `features/groups/components/StudentGroupDetail.tsx`, find this exact block:

```tsx
                    return (
                      <Card
                        key={item.id}
                        className={`border shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden ${cardClass}`}
                      >
                        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
```

Replace it with:

```tsx
                    return (
                      <Card
                        key={item.id}
                        className={`border shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden ${cardClass}`}
                      >
                        <div className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
```

And find this exact block for materials action button:

```tsx
                          <div className="w-full sm:w-auto shrink-0 flex justify-end">
                            {actionButton}
                          </div>
```

Replace it with:

```tsx
                          <div className="w-full lg:w-auto shrink-0 flex justify-end mt-2 lg:mt-0">
                            {actionButton}
                          </div>
```

- [ ] **Step 2: Update Quizzes Card layout and buttons wrapper to use `lg:` breakpoint**

In `features/groups/components/StudentGroupDetail.tsx`, find this exact block (near the end of quizzes mapping):

```tsx
                    return (
                      <Card
                        key={item.id}
                        className={`border shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden ${cardClass}`}
                      >
                        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
```

Replace it with:

```tsx
                    return (
                      <Card
                        key={item.id}
                        className={`border shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden ${cardClass}`}
                      >
                        <div className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
```

And find this exact block for quizzes action button:

```tsx
                          <div className="w-full sm:w-auto shrink-0 flex justify-end">
                            {actionButton}
                          </div>
```

Replace it with:

```tsx
                          <div className="w-full lg:w-auto shrink-0 flex justify-end mt-2 lg:mt-0">
                            {actionButton}
                          </div>
```

- [ ] **Step 3: Update Materials action buttons to stretch to full width on mobile/tablet**

In `features/groups/components/StudentGroupDetail.tsx`, find this exact block:

```tsx
                      actionButton = (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
                          asChild
                        >
                          <Link href={`/groups/${id}/materials/${item.id}`}>
                            Baca Ulang
                          </Link>
                        </Button>
                      );
```

Replace it with:

```tsx
                      actionButton = (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full lg:w-auto border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
                          asChild
                        >
                          <Link href={`/groups/${id}/materials/${item.id}`}>
                            Baca Ulang
                          </Link>
                        </Button>
                      );
```

And find this exact block:

```tsx
                      actionButton = (
                        <Button
                          size="sm"
                          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold shadow-xs cursor-pointer"
                          asChild
                        >
                          <Link href={`/groups/${id}/materials/${item.id}`}>
                            Lanjutkan
                          </Link>
                        </Button>
                      );
```

Replace it with:

```tsx
                      actionButton = (
                        <Button
                          size="sm"
                          className="w-full lg:w-auto bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold shadow-xs cursor-pointer"
                          asChild
                        >
                          <Link href={`/groups/${id}/materials/${item.id}`}>
                            Lanjutkan
                          </Link>
                        </Button>
                      );
```

And find this exact block:

```tsx
                      actionButton = (
                        <Button
                          size="sm"
                          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold shadow-xs cursor-pointer"
                          asChild
                        >
                          <Link href={`/groups/${id}/materials/${item.id}`}>
                            Mulai Belajar
                          </Link>
                        </Button>
                      );
```

Replace it with:

```tsx
                      actionButton = (
                        <Button
                          size="sm"
                          className="w-full lg:w-auto bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold shadow-xs cursor-pointer"
                          asChild
                        >
                          <Link href={`/groups/${id}/materials/${item.id}`}>
                            Mulai Belajar
                          </Link>
                        </Button>
                      );
```

- [ ] **Step 4: Update Quizzes action buttons to stretch to full width on mobile/tablet**

In `features/groups/components/StudentGroupDetail.tsx`, find this exact block:

```tsx
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
```

Replace it with:

```tsx
                        actionButton = (
                          <div className="flex items-center gap-2 w-full lg:w-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoadingId === item.id || actionLoadingId === `${item.id}_retake`}
                              onClick={() => handleQuizAction(item)}
                              className="flex-1 lg:flex-initial border-gray-250 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
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
                              className="flex-1 lg:flex-initial bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
                            >
                              {actionLoadingId === `${item.id}_retake` ? (
                                <Spinner className="h-4 w-4 text-white" />
                              ) : (
                                "Ulangi Kuis"
                              )}
                            </Button>
                          </div>
                        );
```

And find this exact block:

```tsx
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
```

Replace it with:

```tsx
                        actionButton = (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleQuizAction(item)}
                            className="w-full lg:w-auto border-green-250 text-green-700 hover:bg-green-50 font-semibold cursor-pointer"
                          >
                            {actionLoadingId === item.id ? (
                              <Spinner className="h-4 w-4 text-green-700" />
                            ) : (
                              "Lihat Hasil"
                            )}
                          </Button>
                        );
```

And find this exact block:

```tsx
                        actionButton = (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Button
                                  size="sm"
                                  disabled={true}
                                  className="bg-gray-200 text-gray-400 font-semibold cursor-not-allowed"
                                >
                                  Kerjakan Kuis
                                </Button>
                              </span>
                            </TooltipTrigger>
```

Replace it with:

```tsx
                        actionButton = (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="w-full lg:w-auto">
                                <Button
                                  size="sm"
                                  disabled={true}
                                  className="w-full lg:w-auto bg-gray-200 text-gray-400 font-semibold cursor-not-allowed"
                                >
                                  Kerjakan Kuis
                                </Button>
                              </span>
                            </TooltipTrigger>
```

And find this exact block:

```tsx
                        actionButton = (
                          <Button
                            size="sm"
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleQuizAction(item)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold cursor-pointer"
                          >
                            {actionLoadingId === item.id ? (
                              <Spinner className="h-4 w-4 text-white" />
                            ) : (
                              "Lanjutkan Kuis"
                            )}
                          </Button>
                        );
```

Replace it with:

```tsx
                        actionButton = (
                          <Button
                            size="sm"
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleQuizAction(item)}
                            className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold cursor-pointer"
                          >
                            {actionLoadingId === item.id ? (
                              <Spinner className="h-4 w-4 text-white" />
                            ) : (
                              "Lanjutkan Kuis"
                            )}
                          </Button>
                        );
```

And find this exact block:

```tsx
                        actionButton = (
                          <Button
                            size="sm"
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleQuizAction(item)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer"
                          >
                            {actionLoadingId === item.id ? (
                              <Spinner className="h-4 w-4 text-white" />
                            ) : (
                              "Kerjakan Kuis"
                            )}
                          </Button>
                        );
```

Replace it with:

```tsx
                        actionButton = (
                          <Button
                            size="sm"
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleQuizAction(item)}
                            className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer"
                          >
                            {actionLoadingId === item.id ? (
                              <Spinner className="h-4 w-4 text-white" />
                            ) : (
                              "Kerjakan Kuis"
                            )}
                          </Button>
                        );
```

- [ ] **Step 5: Verify build & lint checks**

Run: `bun run lint`
Expected: PASS with 0 new lint errors.

---

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

```bash
git add features/groups/components/StudentGroupDetail.tsx docs/superpowers/plans/2026-07-09-quiz-card-mobile-layout-bugfix.md
git commit -m "fix(groups): resolve quiz card layout overlap by switching card breakpoint to lg and making buttons full width on mobile/tablet"
```
