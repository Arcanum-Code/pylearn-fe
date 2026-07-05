# Login Page UX Refinement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute precision UX improvements on the login page: boost contrast in the terminal, align form headers to the left, soften the background grid, improve input borders/focus states, and adjust floating button margins.

**Architecture:** 
- Contrast fixes go into `LoginBranding.tsx`.
- Alignment fixes go into `LoginForm.tsx`.
- Grid opacity and input borders are managed globally via CSS tokens in `app/globals.css` and `app/design-tokens.css`.
- The floating bottom-left button (if custom) gets positioned with standard Tailwind absolute utilities in `page.tsx`.

---

### Task 1: Left Panel Contrast & Terminal Readability

**Files:**
- Modify: `features/auth/components/LoginBranding.tsx`

- [ ] **Step 1: Brighten tagline and terminal output**

In `features/auth/components/LoginBranding.tsx`:
1. Find the tagline `<p className="text-sm text-terminal-muted mt-1">` and change it to `<p className="text-sm text-zinc-300 mt-1">`.
2. Find the terminal output line `<p className="text-terminal-accent animate-pulse">` and change it to `<p className="text-emerald-400 animate-pulse drop-shadow-sm">`.

### Task 2: Right Panel Alignment

**Files:**
- Modify: `features/auth/components/LoginForm.tsx`

- [ ] **Step 1: Left-align the login card header**

In `features/auth/components/LoginForm.tsx`, find the `div` wrapping the user icon and welcome text:
```tsx
<div className="mb-6 flex flex-col items-center">
```
Change it to align left and add a bit more breathing room:
```tsx
<div className="mb-8 flex flex-col items-start">
```

### Task 3: Background Grid & Input States

**Files:**
- Modify: `app/globals.css`
- Modify: `app/design-tokens.css`

- [ ] **Step 1: Soften the background grid**

In `app/globals.css`, locate `.bg-grid` and replace the `var(--border)` references with a faint black opacity:
```css
  .bg-grid {
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.04) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
    background-size: 64px 64px;
  }
```

- [ ] **Step 2: Darken default input borders**

In `app/design-tokens.css`, locate `--input: #E5E7EB;` in the `:root` block and change it to:
```css
  --input: #D1D5DB; /* Darker gray for clear hit-area boundaries */
```

### Task 4: Floating Button Margins

**Files:**
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Add a floating Language Switcher with proper margins**

Since the login page currently lacks the language switcher, we will add it to the bottom-left of the screen with ample breathing room. In `app/(auth)/login/page.tsx`, import `LanguageSwitcher` and add it absolutely positioned:

```tsx
import { LoginForm, LoginBranding } from "@/features/auth";
import { LanguageSwitcher } from "@/features/layout/components/LanguageSwitcher";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen relative">
      {/* Left Pane: Developer Terminal Branding */}
      <div className="hidden md:flex flex-1 relative items-center justify-center bg-[#0F0F17] overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full w-[120%] h-[120%] -left-[10%] -top-[10%] pointer-events-none" />
        <LoginBranding />
      </div>
      
      {/* Right Pane: Login Form */}
      <div className="flex-1 flex items-center justify-center bg-grid px-4 py-12">
        <LoginForm />
      </div>

      {/* Floating Bottom-Left Action Button */}
      <div className="absolute bottom-8 left-8 z-50">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
```

### Task Final: Commit all plan changes

- [ ] **Step 1: Run Build and Commit**

Run `npm run build` to verify, then commit the fixes:

```bash
git add app/globals.css app/design-tokens.css app/(auth)/login/page.tsx features/auth/components/LoginBranding.tsx features/auth/components/LoginForm.tsx
git commit -m "style(login): refine contrast, alignment, and grid intensity based on design feedback"
```
