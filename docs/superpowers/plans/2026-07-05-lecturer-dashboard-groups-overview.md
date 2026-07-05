# Lecturer Dashboard Groups Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Lecturer Dashboard to display group-specific statistics in the "Ringkasan Umum" view and fix the "Kelola Kelas" button conditional rendering and routing.

**Architecture:** We will extend the `LecturerDashboardData` type to support the new `groupsOverview` array from the backend. Then we will modify `LecturerDashboardContainer` to fix the button logic. Finally, we will update `LecturerDashboardView` to render a new bento card table displaying the group statistics.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Query.

---

### Task 1: Update Dashboard Types

**Files:**
- Modify: `features/dashboard/types/index.ts`

- [ ] **Step 1: Update LecturerDashboardData interface**

```typescript
export interface LecturerDashboardData {
  overview: {
    totalMaterials: number;
    totalQuizzes: number;
    totalStudentAttempts: number;
  };
  groupsOverview?: {
    groupId: string;
    groupName: string;
    totalStudents: number;
    avgPassRate: number;
    totalStudentAttempts: number;
  }[];
  materialBreakdown: {
    materialId: string;
    title: string;
    materialType: string;
    quizCount: number;
    levelCount: number;
    uniqueStudentsEngaged: number;
  }[];
}
```

- [ ] **Step 2: Run type check**

Run: `bun tsc --noEmit`
Expected: PASS or no new errors related to dashboard types.

### Task 2: Fix "Kelola Kelas" Button Logic

**Files:**
- Modify: `features/dashboard/components/LecturerDashboardContainer.tsx`

- [ ] **Step 1: Conditionally render the button and update href**

Replace the existing `<Link href="/groups"...>` button block in `features/dashboard/components/LecturerDashboardContainer.tsx` with:

```tsx
          {selectedGroupId !== "all" && (
            <Link href={`/groups/${selectedGroupId}`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10 font-mono text-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Kelola Kelas (Groups)
              </Button>
            </Link>
          )}
```

- [ ] **Step 2: Check formatting and types**

Run: `bun run lint`
Expected: PASS

### Task 3: Render Groups Overview Card

**Files:**
- Modify: `features/dashboard/components/LecturerDashboardView.tsx`

- [ ] **Step 1: Add Users icon import**

In `features/dashboard/components/LecturerDashboardView.tsx`, update the lucide-react imports to include `Users` and add `Link` and `Button` imports.

```tsx
import { BookOpen, ClipboardList, Database, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
```

- [ ] **Step 2: Add "Daftar Kelas (Groups)" Card**

Insert the new card directly below the "Analisis Materi" card (after its closing `</Card>` tag, but before the final closing `</div>`).

```tsx
      {/* Daftar Kelas (Groups) */}
      <Card className="md:col-span-3 bg-white border-border rounded-xl shadow-sm">
        <CardHeader className="border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-neutral-900">
            Daftar Kelas (Groups)
          </CardTitle>
          <Link href="/groups">
            <Button variant="outline" size="sm" className="font-mono text-xs border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10">
              <Users className="w-3 h-3 mr-2" />
              Kelola Semua Kelas
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-neutral-50 text-left font-semibold text-muted-foreground">
                  <th className="py-3 px-6">Nama Kelas</th>
                  <th className="py-3 px-6 text-center">Total Siswa</th>
                  <th className="py-3 px-6 text-center">Rata-rata Lulus</th>
                  <th className="py-3 px-6 text-center">Total Pengerjaan</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data?.groupsOverview?.map((group) => (
                  <tr
                    key={group.groupId}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-neutral-800">
                      {group.groupName}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-neutral-600">
                      {group.totalStudents}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge
                        variant="secondary"
                        className={`font-mono text-xs ${
                          group.avgPassRate >= 80
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : group.avgPassRate >= 60
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-red-50 text-red-600 border-red-100"
                        }`}
                      >
                        {group.avgPassRate}%
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-neutral-600">
                      {group.totalStudentAttempts}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/groups/${group.groupId}`}>
                        <Button variant="ghost" size="sm" className="font-mono text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          Lihat Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {(!data?.groupsOverview || data.groupsOverview.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground italic"
                    >
                      Belum ada kelas atau data belum tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
```

- [ ] **Step 3: Run project build**

Run: `bun run build`
Expected: PASS

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add features/dashboard/types/index.ts features/dashboard/components/LecturerDashboardContainer.tsx features/dashboard/components/LecturerDashboardView.tsx
git commit -m "feat: add group overview to lecturer dashboard and fix kelola kelas routing"
```
