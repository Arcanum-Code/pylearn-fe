---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Commit once per plan.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** If working in an isolated worktree, it should have been created via the `superpowers:using-git-worktrees` skill at execution time.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

- (User preferences for plan location override this default)

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**

- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step

**Commits happen once per plan**, not per task. The final task of the plan should contain a single commit step that groups all changes made during the entire plan execution.

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Choosing Diff vs. Full-File for Each Edit Step

**This is the single biggest lever on plan cost. Decide it deliberately per-step, not by default.**

Every code-editing step must fall into exactly one of these two shapes. Pick the cheapest shape that still leaves zero ambiguity for the executor.

### Shape A — Full file (write the whole thing)

Use **only** when one of these is true:

- The file is being **created** (doesn't exist yet).
- The edit changes **more than ~60% of the file's lines**, or restructures control flow enough that a diff would be harder to follow than the final result.
- The file is short (roughly under ~40 lines) — at that size a diff saves nothing.

### Shape B — Anchored diff (old → new, unchanged code omitted)

Use for everything else — this should be the **default** for edits to existing files. This covers: adding a field to an interface, adding keys to a JSON/locale object, inserting a new function/component near an existing one, adding a single call/import, wrapping an existing block in a new condition, etc.

**Format for a diff step:**

````markdown
- [ ] **Step N: [description]**

In `path/to/file.ts`, find this exact block (do not search by line number — the file may have drifted):

```typescript
// unique anchor: enough surrounding context to locate unambiguously,
// but only the lines actually needed to disambiguate
export interface StudentQuizAttemptHistoryItem {
  attempt_id: string;
  ...
  time_spent_seconds: number;
}
```

Replace it with:

```typescript
export interface StudentQuizAttemptQuestionItem {
  question_id: string;
  ...
}

export interface StudentQuizAttemptHistoryItem {
  attempt_id: string;
  ...
  time_spent_seconds: number;
  questions?: StudentQuizAttemptQuestionItem[];
}
```
````

Rules for diff steps:

- **Anchor on unique surrounding text**, never on line numbers alone. Line numbers may be mentioned as a hint ("around line 120") but the match must be findable by content, since the file may have shifted since the plan was written.
- The "find this block" snippet must be **copied verbatim** from the actual current file content the planner read — never reconstructed from memory or assumption.
- Only include the minimum surrounding lines needed to make the match unique in the file. Don't paste 50 lines of context to locate a 2-line change.
- If insertion (not replacement) is all that's needed — e.g. adding one new JSX element into an existing list, or one new function above an existing one — say so explicitly: "Insert the following immediately above `export function GroupStudentActivityDetailSheet`:" followed by only the new code. Don't reprint what comes after it.
- If the same kind of edit repeats across near-identical files (e.g. three locale JSON files), give the full pattern once, then for the remaining files give only the specific new keys/values with an instruction like "apply the same key set, translated, to `es.json`'s `drawer` object" — don't re-paste the entire unchanged object three times if it wasn't going to change.

**When in doubt between A and B, pick B.** An executor with the anchor text and the new code has everything needed; reprinting unchanged surrounding code adds tokens without adding certainty.

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**

- Create: `src/modules/feature/feature.service.ts`
- Modify: `src/index.ts` (diff)
- Test: `src/__tests__/integration/feature.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, it } from "bun:test";
import { featureService } from "../../modules/feature/feature.service";

describe("FeatureService", () => {
  it("should return specific expected value", () => {
    const result = featureService.doSomething("input");
    expect(result).toBe("expected");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/__tests__/integration/feature.test.ts`
Expected: FAIL with "Cannot find module" or similar

- [ ] **Step 3: Write minimal implementation** _(new file → Shape A, full file)_

```typescript
export const featureService = {
  doSomething: (input: string): string => {
    return "expected";
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/__tests__/integration/feature.test.ts`
Expected: PASS

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add .
git commit -m "feat: complete implementation of specific feature"
```
````

Note in the `**Files:**` list which modifications are diffs vs. full rewrites (as shown above) — this lets a reviewer spot-check the riskiest (Shape A) steps first.

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:

- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (without either the diff or a copy-pasteable full block — see Shape B for how to do this cheaply instead of repeating everything)
- Steps that describe what to do without showing how (code required — as a diff per the section above, or a full file for Shape A cases)
- References to types, functions, or methods not defined in any task

**Note:** "No placeholders" means no ambiguity — it does not mean "always reprint the whole file." A precise, anchored diff has zero placeholders and is exactly as unambiguous as a full-file block. Reprinting unchanged code is not more rigorous, it's just more tokens.

## Remember

- Exact file paths always
- Complete, unambiguous code in every step — full file (Shape A) only when justified above, anchored diff (Shape B) otherwise
- Exact commands with expected output
- DRY, YAGNI, TDD, commit once at the end of the plan

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it. This is a checklist you run yourself — not a subagent dispatch.

**1. Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.

**2. Placeholder scan:** Search your plan for red flags — any of the patterns from the "No Placeholders" section above. Fix them.

**3. Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.

**4. Diff/full-file audit:** For every code-editing step, confirm it's using the cheaper shape (Shape B) unless it genuinely qualifies for Shape A (new file, >~60% of file changing, or a file under ~40 lines). Any full-file block that doesn't meet those criteria should be converted to an anchored diff. This is usually the single largest token reduction available in a self-review pass.

If you find issues, fix them inline. No need to re-review — just fix and move on. If you find a spec requirement with no task, add the task.

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/superpowers/plans/<filename>.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?"**

**If Subagent-Driven chosen:**

- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Fresh subagent per task + two-stage review

**If Inline Execution chosen:**

- **REQUIRED SUB-SKILL:** Use superpowers:executing-plans
- Batch execution with checkpoints for review
