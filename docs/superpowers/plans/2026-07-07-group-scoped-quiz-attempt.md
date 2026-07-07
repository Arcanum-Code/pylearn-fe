# Group-Scoped Quiz Attempt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the student quiz attempt flow from `/quizzes/attempts/[attemptId]` to be nested under groups at `/groups/[id]/quizzes/attempts/[attemptId]`, matching the material reading pattern.

**Architecture:** Copy the existing group-scoped material detail page pattern (`groups/[id]/materials/[materialId]`) for quiz attempts. Create a new Next.js route, extend `QuizAttemptClient` to accept `groupId`, update navigation links in `StudentGroupDetail` to use the new route, and update redirects to return to the group page after submission. No changes needed to API services, hooks, or types — only routing and navigation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, React Query

---

### File Structure

```
Files to CREATE:
  app/(main)/groups/[id]/quizzes/attempts/[attemptId]/page.tsx

Files to MODIFY:
  features/quizzes/components/attempts/QuizAttemptClient.tsx   (add groupId prop, update nav)
  features/groups/components/StudentGroupDetail.tsx            (update navigation URL)
```

No new services, hooks, types, or API changes needed. The data layer is already group-agnostic — we're only changing where the UI lives and where it navigates.

---

### Task 1: Create group-scoped quiz attempt route page

**Files:**
- Create: `app/(main)/groups/[id]/quizzes/attempts/[attemptId]/page.tsx`

- [ ] **Step 1: Create the route page**

Follow the exact same pattern as `app/(main)/groups/[id]/materials/[materialId]/page.tsx`. This is a thin server component that unwraps params and renders the client component with both `groupId` and `attemptId`.

```tsx
import { QuizAttemptClient } from "@/features/quizzes/components/attempts/QuizAttemptClient";

interface PageProps {
  params: Promise<{ id: string; attemptId: string }>;
}

export default async function GroupQuizAttemptPage({ params }: PageProps) {
  const { id, attemptId } = await params;

  return <QuizAttemptClient groupId={id} attemptId={attemptId} />;
}
```

The route is already covered by the middleware matcher (`/groups/:path*`), so no middleware changes needed. No locale registration needed since quizzes feature has no locale files.

---

### Task 2: Add `groupId` prop to QuizAttemptClient and update navigation

**Files:**
- Modify: `features/quizzes/components/attempts/QuizAttemptClient.tsx`

- [ ] **Step 1: Update the interface to accept `groupId`**

Change the prop interface:

```tsx
interface QuizAttemptClientProps {
  groupId: string;
  attemptId: string;
}
```

Update the function signature:

```tsx
export function QuizAttemptClient({ groupId, attemptId }: QuizAttemptClientProps) {
```

- [ ] **Step 2: Update the "Kembali ke Hasil Kuis" back button**

Change line 183 from `onClick={() => router.back()}` to navigate back to the group detail page:

```tsx
      <Button
        variant="ghost"
        size="sm"
        className="w-fit pl-0"
        onClick={() => router.push(`/groups/${groupId}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Detail Kelas
      </Button>
```

- [ ] **Step 3: Update the "Back to Materials" fallback for missing attempt**

Change line 168 from `router.push("/materials")` to navigate to the group page:

```tsx
        <Button variant="outline" onClick={() => router.push(`/groups/${groupId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Detail Kelas
        </Button>
```

- [ ] **Step 4: Update the submit redirect**

Change line 147 from `router.push("/materials")` to redirect back to the group page:

```tsx
      router.push(`/groups/${groupId}`);
```

---

### Task 3: Update StudentGroupDetail navigation URLs

**Files:**
- Modify: `features/groups/components/StudentGroupDetail.tsx`

- [ ] **Step 1: Update `handleQuizAction` navigation to use group-scoped route**

Three locations in the `handleQuizAction` function (lines 41, 47, 54) currently push to `/quizzes/attempts/${...}`. Change all three to `/groups/${id}/quizzes/attempts/${...}`:

Line 41 (`completed` status):
```tsx
router.push(`/groups/${id}/quizzes/attempts/${completedAttempt.id}`);
```

Line 47 (`in_progress` status):
```tsx
router.push(`/groups/${id}/quizzes/attempts/${activeAttempt.id}`);
```

Line 54 (start new attempt):
```tsx
router.push(`/groups/${id}/quizzes/attempts/${attempt.id}`);
```

Note: The `id` variable is the component's prop — it's in scope from `{ id }` in the function parameter. No additional imports needed.

---

### Task 4: Verify the changes

- [ ] **Step 1: Run the linter**

```bash
bun run lint
```
Expected: No errors.

- [ ] **Step 2: Build the project**

```bash
bun run build
```
Expected: Build succeeds.

- [ ] **Step 3: Manual verification checklist**

1. Start at `/groups/{{id}}` as a student — quizzes are listed in the right column.
2. Click "Kerjakan Kuis" on an available quiz — navigates to `/groups/{{id}}/quizzes/attempts/{{attemptId}}`.
3. The back button says "Kembali ke Detail Kelas" and goes to `/groups/{{id}}`.
4. Click "Kumpulkan Kuis" — after submission, redirects to `/groups/{{id}}`.
5. Click "Lihat Hasil" on a completed quiz — navigates to `/groups/{{id}}/quizzes/attempts/{{attemptId}}`.
6. Click "Lanjutkan Kuis" on an in-progress quiz — navigates to `/groups/{{id}}/quizzes/attempts/{{attemptId}}`.
7. The old `/quizzes/attempts/{{attemptId}}` route still works for any external or bookmarked links (backward compatible).

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

```bash
git add .
git commit -m "feat: scope student quiz attempt route under groups"
```
