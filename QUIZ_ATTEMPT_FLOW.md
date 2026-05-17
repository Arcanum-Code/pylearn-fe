# Quiz Attempt Flow — Implementation Guide

## Overview

This document describes how to implement the quiz attempt flow starting from the Material Detail page, using existing hooks and APIs.

---

## Feature Flow

```
Material Detail Page
    ↓
Fetch Quiz Levels
    ↓
Render Attempt Buttons
    ↓
User Clicks Attempt
    ↓
Create Quiz Attempt
    ↓
Navigate to Quiz Attempt Page
    ↓
Fetch Questions Without Answers
    ↓
Render Quiz
```

---

## Step 1 — Material Detail Page

**File:** `@app/(main)/materials/[id]/page.tsx`

Add a **Quiz Levels** section to the existing material detail page. This section fetches all available quiz levels for the current material and renders an "Attempt Quiz" button for each level.

```tsx
// app/(main)/materials/[id]/page.tsx

import { useFetchQuizLevels } from "@features/quizzes/hooks/useQuizLevels";
import { useCreateQuizAttempt } from "@features/quizzes/hooks/useQuizAttempts";
import { useRouter } from "next/navigation";

export default function MaterialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const materialId = params.id;
  const router = useRouter();

  const { data: quizLevels, isLoading } = useFetchQuizLevels(materialId);
  const { mutateAsync: createAttempt } = useCreateQuizAttempt();

  const handleAttemptQuiz = async (levelId: string) => {
    const attempt = await createAttempt({ materialId, levelId });
    router.push(`/quizzes/attempts/${attempt.id}`);
  };

  return (
    <div>
      {/* ... existing material detail content ... */}

      <section>
        <h2>Attempt a Quiz</h2>
        {isLoading && <p>Loading quiz levels...</p>}
        {quizLevels?.map((level) => (
          <div key={level.id}>
            <span>{level.name}</span>
            <button onClick={() => handleAttemptQuiz(level.id)}>
              Attempt Quiz
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

## Step 2 — Fetch Quiz Levels

**Hook:** `useFetchQuizLevels` from `@features/quizzes/hooks/useQuizLevels.ts`

**Purpose:** Retrieve all quiz levels (e.g. Easy, Medium, Hard) available for a given material.

**Usage:**

```ts
const { data: quizLevels, isLoading, isError } = useFetchQuizLevels(materialId);
```

**Expected UI:**

```
Easy   → [Attempt Quiz]
Medium → [Attempt Quiz]
Hard   → [Attempt Quiz]
```

---

## Step 3 — Create Quiz Attempt

**Hook:** `useCreateQuizAttempt` from `@features/quizzes/hooks/useQuizAttempts.ts`

**Purpose:** Create a new quiz attempt record when the user clicks "Attempt Quiz". This registers the attempt in the backend before navigating to the attempt page.

**Usage:**

```ts
const { mutateAsync: createAttempt } = useCreateQuizAttempt();

const attempt = await createAttempt({ materialId, levelId });
```

**Triggered by:** User clicking an "Attempt Quiz" button on the Material Detail page.

---

## Step 4 — Navigate to Quiz Attempt Page

After the attempt is created, redirect the user to the dedicated quiz attempt page, passing the new attempt ID.

```ts
router.push(`/quizzes/attempts/${attempt.id}`);
```

**New page to create:** `@app/(main)/quizzes/attempts/[attemptId]/page.tsx`

---

## Step 5 — Quiz Attempt Page

**File:** `@app/(main)/quizzes/attempts/[attemptId]/page.tsx`

This page fetches questions for the attempt (without answers) and renders the quiz UI.

```tsx
// app/(main)/quizzes/attempts/[attemptId]/page.tsx

import { useFetchQuizQuestionsForAttempt } from "@features/quizzes/hooks/useQuizQuestions";

export default function QuizAttemptPage({
  params,
}: {
  params: { attemptId: string };
}) {
  const { attemptId } = params;

  const { data: questions, isLoading } =
    useFetchQuizQuestionsForAttempt(attemptId);

  if (isLoading) return <p>Loading questions...</p>;

  return (
    <div>
      <h1>Quiz</h1>
      {questions?.map((question, index) => (
        <div key={question.id}>
          <p>
            {index + 1}. {question.questionText}
          </p>
          {question.options.map((option) => (
            <label key={option.id}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
              />
              {option.text}
            </label>
          ))}
        </div>
      ))}
      <button type="submit">Submit Quiz</button>
    </div>
  );
}
```

---

## Step 6 — Fetch Quiz Questions (Without Answers)

**Hook:** `useFetchQuizQuestionsForAttempt` from `@features/quizzes/hooks/useQuizQuestions.ts`

**Purpose:** Fetch all questions for a quiz attempt. The response must **not** include `answerText` to prevent exposing the answer key to the user.

**Usage:**

```ts
const { data: questions, isLoading } =
  useFetchQuizQuestionsForAttempt(attemptId);
```

> ⚠️ **Important:** Confirm the API endpoint used by this hook strips `answerText` from the response. This should be enforced server-side, not just on the frontend.

---

## Hooks Summary

| Hook                              | File                  | Purpose                                     |
| --------------------------------- | --------------------- | ------------------------------------------- |
| `useFetchQuizLevels`              | `useQuizLevels.ts`    | Fetch available quiz levels for a material  |
| `useCreateQuizAttempt`            | `useQuizAttempts.ts`  | Create a new quiz attempt record            |
| `useFetchQuizQuestionsForAttempt` | `useQuizQuestions.ts` | Fetch questions for an attempt (no answers) |

---

## Files to Create / Modify

| Action     | File                                               |
| ---------- | -------------------------------------------------- |
| **Modify** | `app/(main)/materials/[id]/page.tsx`               |
| **Create** | `app/(main)/quizzes/attempts/[attemptId]/page.tsx` |

---

## Notes

- Answer key (`answerText`) must be excluded from question responses — enforce this server-side.
- Handle loading and error states for all async operations.
- The quiz attempt ID returned by `useCreateQuizAttempt` is used both for navigation and for fetching the correct questions.
