# i18n Indonesian Default Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the application's default fallback language from English (`en`) to Indonesian (`id`).

**Architecture:** The application's i18n relies on a custom feature-based implementation managed by `app/providers/I18nProvider.tsx`. We will modify the `getInitialLocale` function inside this provider so that when no cookie is present or the browser's requested language is unsupported, it defaults to `"id"` instead of `"en"`.

**Tech Stack:** React Context, custom i18n implementation

---

### Task 1: Update Default Locale Fallback

**Files:**
- Modify: `app/providers/I18nProvider.tsx`

- [ ] **Step 1: Write the updated `getInitialLocale` function**

In `app/providers/I18nProvider.tsx`, update the fallback language returns from `"en"` to `"id"`. Replace the existing `getInitialLocale` function with:

```tsx
const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "id";

  const cookieLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="))
    ?.split("=")[1] as Locale;

  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  return "id";
};
```

- [ ] **Step 2: Run build to verify types and syntax**

Run: `pnpm build` or `npm run build`
Expected: Passes without errors.

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add app/providers/I18nProvider.tsx
git commit -m "chore(i18n): set default locale fallback to Indonesian"
```
