---
name: implement-issue
description: Implements the task described in issue.md by reading it thoroughly, proposing a plan for user approval, creating a new branch, then writing the code. Use when the user asks to "implement the issue", "work on the issue", "start the task in issue.md", or "implement what's in issue.md". Always stops before committing — the user reviews the code first.
user-invocable: true
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

# Implement Issue

Read `issue.md`, propose a plan, get approval, branch, then implement. Never commit — the user reviews first.

---

## Guiding Principle

The agent is a careful, senior-level implementer. It reads the issue completely before touching any code, thinks before it acts, stays strictly within the defined scope, and hands off clean work for human review. When in doubt about something not covered by the issue, it asks — it does not assume.

---

## Steps

### Step 1 — Read `issue.md` thoroughly

Read the entire file before doing anything else:

```bash
cat issue.md
```

Extract and mentally note:

- The goal (Overview)
- Which files/modules are in scope (Scope)
- The ordered tasks (Tasks)
- The pass/fail conditions (Acceptance Criteria)
- What must not be touched (Out of Scope)
- Gotchas and patterns to follow (Notes)

Do not proceed until the full file has been read.

### Step 2 — Explore the codebase

Before proposing a plan, validate the issue's context against the actual current state of the code:

```bash
# Confirm files mentioned in the issue exist
# Read relevant source files to understand current structure
# Check for existing patterns (naming, folder layout, exports)
```

This prevents proposing something that conflicts with how the codebase actually works.

### Step 3 — Propose the plan

**Stop here. Do not write any code yet.**

Present the implementation plan to the user in this format:

```
## Implementation Plan

**Branch name:** <type>/<short-slug>   (e.g. feat/add-logout-endpoint)

**Files to create:**
- path/to/new-file.ts — reason

**Files to modify:**
- path/to/existing-file.ts — what changes and why

**Approach:**
<2–4 sentences describing the implementation approach and any key decisions.>

**Open questions (if any):**
<Anything not covered by the issue that requires a decision before coding. If none, omit this section.>

---
Ready to implement. Confirm to proceed.
```

Wait for the user to explicitly confirm before moving to Step 4. If the user requests changes to the plan, revise and re-present it — do not start coding until the plan is approved.

### Step 4 — Create a new branch

Once the plan is approved, create and switch to a new branch:

```bash
# Branch name must match what was proposed in the plan
git checkout -b <type>/<short-slug>
```

Branch naming convention:
| Issue type | Prefix | Example |
| ------------- | ------------ | ------------------------------ |
| New feature | `feat/` | `feat/add-logout-endpoint` |
| Bug fix | `fix/` | `fix/session-not-clearing` |
| Refactor | `refactor/` | `refactor/auth-middleware` |
| Docs | `docs/` | `docs/update-api-reference` |
| Chore | `chore/` | `chore/upgrade-next-version` |

Never implement on `main`, `master`, or any existing feature branch.

### Step 5 — Implement the code

Follow the approved plan precisely. Implement each task from the issue in order.

Rules during implementation:

- **Stay in scope.** Only touch the files listed in the approved plan. If something unexpected requires touching an out-of-scope file, stop and ask the user.
- **Follow existing patterns.** Match the naming conventions, folder structure, import style, and code patterns already present in the codebase.
- **One task at a time.** Complete each task fully before moving to the next.
- **Write tests alongside the feature code.** For every module created or modified, write the corresponding test files in `src/__tests__/<feature>/` following the project's test conventions (`bun:test`, `beforeEach(resetDatabase)`, `getAuthToken()` for protected routes). Test files are part of the implementation — not optional.
- **Do not run any tests or build commands.** Write the files only. The user will execute them manually.
- **No cleanup commits, no drive-by refactors.** If you notice something unrelated that should be fixed, note it for the user at the end — do not fix it now.

### Step 6 — Self-review against Acceptance Criteria

Before handing off, check every acceptance criterion from `issue.md`:

```
- [ ] <criterion> → PASS / FAIL / NEEDS MANUAL VERIFICATION
```

If any criterion fails, fix it before surfacing to the user.

### Step 7 — Hand off to the user

**Do not commit anything.** Report the following:

```
## Implementation Complete

**Branch:** <branch-name>

**Files changed:**
- path/to/file.ts — what was done

**Acceptance Criteria:**
- [x] <criterion> — PASS
- [x] <criterion> — PASS

**Notes for reviewer:**
<Anything the user should pay attention to during review — edge cases handled, decisions made during implementation, or things to manually verify.>

**Unrelated observations (not implemented):**
<Anything noticed during implementation that's out of scope but worth a follow-up issue. Omit if none.>

---
Please review the changes. When ready, use the `git-ship` skill to commit, push, and open a PR.
```

---

## Safety Rules

- NEVER commit any code — that is the user's responsibility after review
- NEVER push the branch — wait for the user to trigger `git-ship`
- NEVER touch files listed under "Out of Scope" in `issue.md`
- NEVER implement without an approved plan — the plan step is mandatory, not optional
- NEVER run tests (`bun test`) or the build (`bun run build`) — write the files and let the user execute them
- NEVER modify `issue.md`, `AGENTS.md`, or anything under `.opencode/`
- If `issue.md` does not exist at the project root, stop and tell the user to run the `create-issue` skill first
