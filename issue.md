# Implement Create Quiz Form Page

> **For the implementer:** This issue is self-contained. Read it fully before starting. If anything is unclear, re-read the Notes section before asking.

---

## Overview

Implement a dedicated page for creating a new quiz within a material. This page will feature a structured form called "Pengaturan Kuis" (Quiz Settings) where lecturers can define the quiz's basic information, target level, and availability window.

---

## Scope

This affects the `features/quizzes/` module (adding schemas, components, and updating services/hooks) and adds a new route at `app/(main)/materials/[id]/quiz/create/page.tsx`. It also involves adding a navigation button to the existing quiz list page.

---

## Tasks

1. **Define Schema & Types:**
   - Create `features/quizzes/schemas/quizSchema.ts` using Zod. Fields: `title` (string), `levelId` (string), `description` (string, optional), `startTime` (date string), `endTime` (date string).
   - Update `features/quizzes/types/index.ts` to include `CreateQuizRequest` and updated `Quiz` interfaces.
2. **Update API & Hooks:**
   - Add `createQuiz` function to `features/quizzes/services/quizApi.ts` (`POST /quizzes`).
   - Add `useCreateQuiz` hook to `features/quizzes/hooks/useQuiz.ts`.
3. **Implement Form Component:**
   - Create `features/quizzes/components/CreateQuizForm.tsx` using `react-hook-form`.
   - The form should be wrapped in a `Card` titled "Pengaturan Kuis".
   - Include fields: Title (Input), Level (Select - populated from `useFetchLevels`), Description (Textarea), Start Time (DateTime Input), End Time (DateTime Input).
4. **Create Page Route:**
   - Create `app/(main)/materials/[id]/quiz/create/page.tsx`.
   - Display a large header "Buat Kuis Baru".
   - Below the header, display "Materi: {name_materi}" (passed via searchParams as `title`).
   - Render the `CreateQuizForm`.
5. **Add Navigation Entry:**
   - Add a "Create New Quiz" button to `features/quizzes/components/QuizClientPage.tsx` that links to the new create page.

---

## Acceptance Criteria

- [ ] New route `/materials/[id]/quiz/create` is accessible and displays the correct material title.
- [ ] The "Pengaturan Kuis" card contains all requested fields with proper validation.
- [ ] The Level select dropdown is correctly populated with levels associated with the material.
- [ ] Submitting the form successfully calls the backend API with the correct payload.
- [ ] Users can navigate to this page from the main quiz list page.
- [ ] Form follows the project's styling conventions (shadcn/ui, Tailwind).

---

## Out of Scope

- Implementing the question/item editor within this form.
- Complex date/time validation (e.g., checking if start is before end) beyond basic Zod types, unless simple to add.
- Localization of the form (use English/Indonesian as requested for now).

---

## Notes

- Use `input type="datetime-local"` for the start/end time fields as no specific date picker is currently in `components/ui`.
- Use the `Badge` or `Card` styling for the "Materi: {name_materi}" label to make it look polished.
- Ensure `params` and `searchParams` are handled as Promises in the new page route, following the established Next.js 16 pattern.
