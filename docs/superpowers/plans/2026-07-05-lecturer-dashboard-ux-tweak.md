# Lecturer Dashboard UX Tweak Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve UX of the "Kelola Kelas" action in the lecturer dashboard by introducing a Tooltip for disabled state and removing redundant bilingual labels ("Groups").

**Architecture:** We will leverage `shadcn/ui` Tooltip components to wrap a disabled button when the "Ringkasan Umum" view is selected. We will also clean up labels to strictly use "Kelas".

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui.

---

### Task 1: Update "Kelola Kelas" Logic with Tooltip

**Files:**
- Modify: `features/dashboard/components/LecturerDashboardContainer.tsx`

- [ ] **Step 1: Import Tooltip components**

At the top of `LecturerDashboardContainer.tsx`, add the tooltip imports:

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
```

- [ ] **Step 2: Replace conditional rendering logic**

Find the section that conditionally renders the "Kelola Kelas" link (`{selectedGroupId !== "all" && ...}`). Replace that entire block with the new conditional Tooltip layout:

```tsx
          {selectedGroupId === "all" ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* Wrapper div catches hover events since disabled button swallows them */}
                  <div className="w-full sm:w-auto" tabIndex={0}>
                    <Button
                      variant="outline"
                      disabled
                      className="w-full sm:w-auto rounded-xl border-[#6366F1] text-[#6366F1] font-mono text-sm disabled:opacity-50"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Kelola Kelas
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[250px] text-center">
                  <p>Pilih kelas spesifik pada dropdown untuk mengelola data kelas tersebut.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link href={`/groups/${selectedGroupId}`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10 font-mono text-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Kelola Kelas
              </Button>
            </Link>
          )}
```

- [ ] **Step 3: Check formatting and types**

Run: `bun run lint`
Expected: Only the 112 existing warnings/errors (none related to this file).

### Task 2: Clean up UI Labels in Dashboard View

**Files:**
- Modify: `features/dashboard/components/LecturerDashboardView.tsx`

- [ ] **Step 1: Remove "Groups" terminology**

In `LecturerDashboardView.tsx`, locate the "Daftar Kelas (Groups)" section.
Modify the `CardTitle` to only say "Daftar Kelas":

```tsx
        <CardHeader className="border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-neutral-900">
            Daftar Kelas
          </CardTitle>
          <Link href="/groups">
```

- [ ] **Step 2: Build project**

Run: `bun run build`
Expected: PASS

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add features/dashboard/components/LecturerDashboardContainer.tsx features/dashboard/components/LecturerDashboardView.tsx
git commit -m "feat(ui): add tooltip to kelola kelas button and remove groups phrasing"
```
