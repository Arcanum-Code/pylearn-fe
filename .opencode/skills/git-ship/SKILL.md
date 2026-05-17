---
name: git-ship
description: 'Execute the full ship flow: conventional commit → push → Pull Request. Use when user asks to commit changes, ship a feature, create a git commit, or mentions "/commit" or "/ship". Supports: (1) Auto-detecting type and scope from changes, (2) Generating conventional commit messages from diff, (3) Interactive commit with optional type/scope/description overrides, (4) Intelligent file staging for logical grouping, (5) Auto-push to remote branch, (6) PR creation via GitHub CLI (gh)'
license: MIT
allowed-tools: Bash
---

# git-ship: Commit → Push → Pull Request

## Overview

Create standardized, semantic git commits using the Conventional Commits specification, push the branch to the remote, and open a Pull Request — all in one flow.

---

## Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type       | Purpose                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Breaking Changes

```
# Exclamation mark after type/scope
feat!: remove deprecated endpoint

# BREAKING CHANGE footer
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

---

## Full Workflow

### Step 1 — Analyze Diff

```bash
# If files are staged, use staged diff
git diff --staged

# If nothing staged, use working tree diff
git diff

# Check overall status
git status --porcelain
```

### Step 2 — Stage Files (if needed)

Group related changes logically before committing.

```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage by pattern
git add *.test.*
git add src/components/*

# Interactive staging
git add -p
```

> **Never stage secrets** — `.env`, `credentials.json`, private keys, or any file with plaintext tokens/passwords.

> **Always exclude these files** — even if they appear in `git status` or the working tree diff, **never stage or commit**:
>
> - `AGENTS.md`
> - `issue.md`
> - Anything inside the `.opencode/` directory (e.g. `.opencode/*`)
>
> These are agent/tooling config files and must be left untouched in every commit.

### Step 3 — Generate Commit Message

Analyze the diff to determine:

- **Type**: What kind of change is this?
- **Scope**: What area/module is affected?
- **Description**: One-line summary (present tense, imperative mood, <72 chars)

### Step 4 — Execute Commit

```bash
# Single line
git commit -m "<type>[scope]: <description>"

# Multi-line with body/footer
git commit -m "$(cat <<'EOF'
<type>[scope]: <description>

<optional body explaining why, not what>

<optional footer, e.g. Closes #123>
EOF
)"
```

### Step 5 — Push Branch to Remote

After a successful commit, push the current branch:

```bash
# Detect current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Push (set upstream on first push)
git push --set-upstream origin "$BRANCH"
```

- If push is rejected due to diverged history, **stop and report to the user** — never force-push without explicit instruction.
- Never force-push to `main` or `master`.

### Step 6 — Create Pull Request

After a successful push, always use the **`gh` CLI** to create the PR. No other tool should be used.

```bash
gh pr create \
  --title "<type>[scope]: <description>" \
  --body "$(cat <<'EOF'
## Summary
<what this PR does and why>

## Changes
<bullet list of key changes>

## Related Issues
Closes #<issue_number>
EOF
)" \
  --base "$DEFAULT_BRANCH" \
  --head "$BRANCH"
```

- The PR title must match the commit message subject exactly.
- Always auto-detect the default branch — do not hardcode `main` or `master`.
- If `gh` is not installed or not authenticated, **stop and inform the user**. Do not fall back to any other method. Provide the manual URL for reference only:
  `https://github.com/<org>/<repo>/compare/<BRANCH>?expand=1`

#### PR Body Template

Use this as the default PR description body:

```markdown
## Summary

<!-- What does this PR do and why? -->

## Changes

-

## Related Issues

<!-- Closes #123 | Refs #456 -->

## Testing

<!-- How was this tested? -->
```

---

## Best Practices

- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Keep description under 72 characters
- PR title should match (or closely follow) the commit message subject
- Reference issues in the PR body: `Closes #123`, `Refs #456`

---

## Git Safety Protocol

- NEVER stage or commit `AGENTS.md`, `issue.md`, or any file under `.opencode/` — skip them silently every time
- NEVER update git config
- NEVER run destructive commands (`--force`, hard reset) without explicit user request
- NEVER skip hooks (`--no-verify`) unless user explicitly asks
- NEVER force-push to `main` or `master`
- If commit fails due to hooks, fix the issue and create a **new** commit — never amend a pushed commit
- If push is rejected, report divergence to the user and wait for instructions
- ALWAYS use `gh` CLI for PR creation — never manual API calls, never any other tool
