# Login Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the login page's left panel to feature a "Developer Terminal" aesthetic — replacing the solid blue background and generic "P" logo with a sleek dark canvas, a custom `>_` logo, and a large glassmorphic terminal tile displaying a Python authentication sequence.

**Architecture:** 
1. `app/(auth)/login/page.tsx` will be updated to replace the flat `bg-branding-dark` background on the left pane with a deep dark canvas (`bg-[#0F0F17]`) and an absolute positioned radial glow for depth.
2. `features/auth/components/LoginBranding.tsx` will be completely overhauled. It will use the newly created `TerminalTile` to display syntax-highlighted Python code. The logo will be replaced with a modern monospace `>_` badge.

**Tech Stack:** Tailwind CSS, React, custom `TerminalTile`

---

### Task 1: Update Login Layout Pane

**Files:**
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Overhaul the left pane wrapper**

Update the container classes in `app/(auth)/login/page.tsx` to use a deep dark background with a glowing orb effect behind the branding component. Replace the entire file content with:

```tsx
import { LoginForm, LoginBranding } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Pane: Developer Terminal Branding */}
      <div className="hidden md:flex flex-1 relative items-center justify-center bg-[#0F0F17] overflow-hidden">
        {/* Subtle radial glow for depth */}
        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full w-[120%] h-[120%] -left-[10%] -top-[10%] pointer-events-none" />
        
        <LoginBranding />
      </div>
      
      {/* Right Pane: Login Form */}
      <div className="flex-1 flex items-center justify-center bg-grid px-4 py-12">
        <LoginForm />
      </div>
    </div>
  );
}
```

### Task 2: Implement Developer Terminal Branding

**Files:**
- Modify: `features/auth/components/LoginBranding.tsx`

- [ ] **Step 1: Rewrite LoginBranding**

Replace the existing `P` logo and centered text with a modern `>_` logo badge and a `TerminalTile` showcasing a Python authentication script. Replace the entire file content with:

```tsx
"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { authConfig } from "@/features/auth/config/auth";
import { TerminalTile } from "@/components/ui/terminal-tile";

export function LoginBranding() {
  const t = useTranslations();

  return (
    <div className="relative z-10 w-full max-w-lg px-8">
      {/* Modern Logo & Title */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-tile">
          <span className="text-xl font-bold font-mono text-white">
            {`>_`}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t(authConfig.systemNameKey)}
          </h1>
          <p className="text-sm text-terminal-muted mt-1">
            {t(authConfig.systemDescriptionKey)}
          </p>
        </div>
      </div>

      {/* Hero Terminal Window */}
      <TerminalTile
        title="python3 — authenticate.py"
        className="shadow-2xl border border-white/10"
      >
        <div className="space-y-1 sm:text-sm text-xs">
          <p className="text-terminal-muted">
            # 🚀 Initialize Learning Environment
          </p>
          <p>
            <span className="text-[#C792EA]">import</span>{" "}
            <span className="text-[#82AAFF]">pylearn</span>
          </p>
          <br />
          <p>
            <span className="text-[#82AAFF]">session</span> = pylearn.
            <span className="text-[#82AAFF]">authenticate</span>()
          </p>
          <p>
            <span className="text-[#C792EA]">if</span> session.is_ready:
          </p>
          <p className="pl-4">
            <span className="text-[#82AAFF]">print</span>(
            <span className="text-[#C3E88D]">
              f"Welcome back, {`{session.user.name}`}!"
            </span>
            )
          </p>
          <p className="pl-4">
            session.<span className="text-[#82AAFF]">start_learning</span>()
          </p>
          <br />
          <p className="text-terminal-accent animate-pulse">
            <span className="text-terminal-muted">→</span> Awaiting
            authentication payload...
          </p>
        </div>
      </TerminalTile>
    </div>
  );
}
```

- [ ] **Step 2: Verify Build**

Run: `npm run build`
Expected: Passes without errors.

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add app/(auth)/login/page.tsx features/auth/components/LoginBranding.tsx
git commit -m "feat(auth): redesign login page with developer terminal aesthetic"
```
