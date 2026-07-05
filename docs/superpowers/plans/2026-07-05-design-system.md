# PyLearn Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a cohesive design system foundation for PyLearn — new color palette, typography (Inter + JetBrains Mono), bento-grid utilities, terminal surface component, and sidebar restyle — so that every existing shadcn component auto-adopts the new palette via remapped CSS variables.

**Architecture:** Design tokens live in a dedicated `app/design-tokens.css` file (single source of truth), imported by `globals.css`. The shadcn semantic CSS variables (`--primary`, `--destructive`, `--accent`, etc.) are remapped to the new PyLearn palette so all existing shadcn components update automatically. Tailwind CSS v4's `@theme` directive is extended with custom utility classes (`bg-success`, `text-terminal-accent`, `shadow-tile`, etc.). The sidebar is restyled from a dark-branding surface to a light background with indigo active states and monospace nav labels. A reusable `TerminalTile` component provides the signature dark accent tile.

**Tech Stack:** Next.js 16, Tailwind CSS v4, shadcn/ui (new-york style), Inter + JetBrains Mono (via `next/font/google`)

---

## File Structure

**Create:**
| File | Responsibility |
|---|---|
| `app/design-tokens.css` | Single source of truth for all CSS custom properties — colors, semantic status, terminal surface, sidebar, charts, radius |
| `components/ui/terminal-tile.tsx` | Reusable dark terminal surface component (title bar with traffic lights, monospace content area) |
| `features/dashboard/components/CodeSnippetWidget.tsx` | "Code Snippet of the Day" dashboard widget using `TerminalTile` |

**Modify:**
| File | What Changes |
|---|---|
| `app/globals.css` | Import `design-tokens.css`, remove old `:root`/`.dark` blocks, update `@theme` with new utilities + fonts, add bento-grid classes, fix duplicated `@apply` lines |
| `app/layout.tsx` | Replace Geist Sans/Mono with Inter + JetBrains Mono, update metadata title |
| `features/layout/components/SidebarNav.tsx` | Swap `bg-branding-dark`/`text-branding-foreground` to `bg-sidebar`/`text-sidebar-foreground`, add indigo active state, add `font-mono` to nav labels, add `border-r` |
| `features/dashboard/index.ts` | Add `CodeSnippetWidget` export |

---

## Design Token Reference

Quick reference for the palette being implemented:

| Token | Light Value | Purpose |
|---|---|---|
| `--background` | `#F7F8FA` | Off-white canvas (page background) |
| `--foreground` | `#1A1C1E` | Near-black body text |
| `--primary` | `#6366F1` | Indigo interactive accent |
| `--card` | `#FFFFFF` | White card surfaces |
| `--success` | `#10B981` | Terminal-green for correct/pass |
| `--warning` | `#F59E0B` | Amber for in-progress/caution |
| `--error` | `#EF4444` | Red for incorrect/fail |
| `--destructive` | `#EF4444` | Same as error, shadcn alias |
| `--terminal-bg` | `#1E1E2E` | Dark code-editor surface |
| `--radius` | `0.75rem` (12px) | Rounded-xl feel |

---

### Task 1: Design Tokens Foundation

**Files:**
- Create: `app/design-tokens.css`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create `app/design-tokens.css`**

Create the file at `app/design-tokens.css` with the following complete content:

```css
/*
 * PyLearn Design System Tokens
 *
 * Single source of truth for all design tokens.
 * Imported by globals.css — do not import Tailwind here.
 *
 * Palette:
 *   Canvas: #F7F8FA    Text: #1A1C1E
 *   Primary (indigo): #6366F1
 *   Success (green):  #10B981   Warning (amber): #F59E0B   Error (red): #EF4444
 *   Terminal dark:    #1E1E2E
 *
 * Typography: Inter (sans) + JetBrains Mono (mono)
 * Border Radius: 12px base
 */

:root {
  /* ─── Base Radius ─── */
  --radius: 0.75rem; /* 12px */

  /* ─── Canvas & Core ─── */
  --canvas: #F7F8FA;
  --background: #F7F8FA;
  --foreground: #1A1C1E;

  /* ─── Surfaces ─── */
  --card: #FFFFFF;
  --card-foreground: #1A1C1E;
  --popover: #FFFFFF;
  --popover-foreground: #1A1C1E;

  /* ─── Primary (Indigo) ─── */
  --primary: #6366F1;
  --primary-foreground: #FFFFFF;

  /* ─── Secondary ─── */
  --secondary: #F1F1F4;
  --secondary-foreground: #1A1C1E;

  /* ─── Muted ─── */
  --muted: #EEEEF2;
  --muted-foreground: #6B7280;

  /* ─── Accent (Light Indigo tint) ─── */
  --accent: #EEF2FF;
  --accent-foreground: #1A1C1E;

  /* ─── Destructive ─── */
  --destructive: #EF4444;

  /* ─── Borders & Inputs ─── */
  --border: #E5E7EB;
  --input: #E5E7EB;
  --ring: #6366F1;

  /* ─── Branding (maps to Indigo) ─── */
  --branding: #818CF8;
  --branding-foreground: #FFFFFF;
  --branding-dark: #6366F1;

  /* ─── Semantic Status ─── */
  --success: #10B981;
  --success-light: #D1FAE5;
  --warning: #F59E0B;
  --warning-light: #FEF3C7;
  --error: #EF4444;
  --error-light: #FEE2E2;

  /* ─── Terminal Surface ─── */
  --terminal-bg: #1E1E2E;
  --terminal-fg: #CDD6F4;
  --terminal-accent: #10B981;
  --terminal-muted: #6C7086;

  /* ─── Chart Colors ─── */
  --chart-1: #6366F1;
  --chart-2: #10B981;
  --chart-3: #F59E0B;
  --chart-4: #EF4444;
  --chart-5: #8B5CF6;

  /* ─── Sidebar (Light) ─── */
  --sidebar: #FFFFFF;
  --sidebar-foreground: #1A1C1E;
  --sidebar-primary: #6366F1;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #EEF2FF;
  --sidebar-accent-foreground: #1A1C1E;
  --sidebar-border: #E5E7EB;
  --sidebar-ring: #6366F1;
}

/* ─── Dark Mode ─── */
.dark {
  --canvas: #0F0F17;
  --background: #0F0F17;
  --foreground: #E5E7EB;

  --card: #1A1A24;
  --card-foreground: #E5E7EB;
  --popover: #1A1A24;
  --popover-foreground: #E5E7EB;

  --primary: #818CF8;
  --primary-foreground: #FFFFFF;

  --secondary: #252530;
  --secondary-foreground: #E5E7EB;

  --muted: #252530;
  --muted-foreground: #9CA3AF;

  --accent: #252540;
  --accent-foreground: #E5E7EB;

  --destructive: #F87171;

  --border: #2D2D3A;
  --input: #2D2D3A;
  --ring: #818CF8;

  --branding: #818CF8;
  --branding-foreground: #FFFFFF;
  --branding-dark: #6366F1;

  --success: #34D399;
  --success-light: #064E3B;
  --warning: #FBBF24;
  --warning-light: #78350F;
  --error: #F87171;
  --error-light: #7F1D1D;

  --terminal-bg: #11111B;
  --terminal-fg: #CDD6F4;
  --terminal-accent: #34D399;
  --terminal-muted: #6C7086;

  --chart-1: #818CF8;
  --chart-2: #34D399;
  --chart-3: #FBBF24;
  --chart-4: #F87171;
  --chart-5: #A78BFA;

  --sidebar: #1A1A24;
  --sidebar-foreground: #E5E7EB;
  --sidebar-primary: #818CF8;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #252540;
  --sidebar-accent-foreground: #E5E7EB;
  --sidebar-border: #2D2D3A;
  --sidebar-ring: #818CF8;
}
```

- [ ] **Step 2: Replace `app/globals.css` with updated version**

Replace the entire contents of `app/globals.css` with:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "./design-tokens.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* ─── Canvas & Layout ─── */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-canvas: var(--canvas);

  /* ─── Typography ─── */
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);

  /* ─── Shadcn Semantic Colors ─── */
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* ─── Branding ─── */
  --color-branding: var(--branding);
  --color-branding-foreground: var(--branding-foreground);
  --color-branding-dark: var(--branding-dark);

  /* ─── Sidebar ─── */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* ─── Charts ─── */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* ─── Design System: Semantic Status ─── */
  --color-success: var(--success);
  --color-success-light: var(--success-light);
  --color-warning: var(--warning);
  --color-warning-light: var(--warning-light);
  --color-error: var(--error);
  --color-error-light: var(--error-light);

  /* ─── Design System: Terminal Surface ─── */
  --color-terminal-bg: var(--terminal-bg);
  --color-terminal-fg: var(--terminal-fg);
  --color-terminal-accent: var(--terminal-accent);
  --color-terminal-muted: var(--terminal-muted);

  /* ─── Radius Scale ─── */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);

  /* ─── Shadow Scale ─── */
  --shadow-tile: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  --shadow-tile-hover: 0 4px 12px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.04);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  /* ─── Background Grid Pattern ─── */
  .bg-grid {
    background-image: linear-gradient(
        to right,
        var(--border) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, var(--border) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  /* ─── Bento Grid Layout ─── */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .tile-1x1 {
    grid-column: span 1;
    grid-row: span 1;
  }
  .tile-2x1 {
    grid-column: span 2;
    grid-row: span 1;
  }
  .tile-3x1 {
    grid-column: span 3;
    grid-row: span 1;
  }
  .tile-4x1 {
    grid-column: span 4;
    grid-row: span 1;
  }
  .tile-1x2 {
    grid-column: span 1;
    grid-row: span 2;
  }
  .tile-2x2 {
    grid-column: span 2;
    grid-row: span 2;
  }

  /* Bento grid responsive breakpoints */
  @media (max-width: 1024px) {
    .bento-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .tile-3x1,
    .tile-4x1 {
      grid-column: span 2;
    }
  }

  @media (max-width: 640px) {
    .bento-grid {
      grid-template-columns: 1fr;
    }
    .tile-2x1,
    .tile-3x1,
    .tile-4x1,
    .tile-2x2 {
      grid-column: span 1;
    }
    .tile-1x2,
    .tile-2x2 {
      grid-row: span 1;
    }
  }
}

/* ─── Toast Overrides ─── */
.toaster [data-sonner-toast] {
  background-color: var(--branding-dark) !important;
  color: var(--branding-foreground) !important;
  border-color: var(--border) !important;
}

.toaster [data-sonner-toast] [data-close-button] {
  background-color: var(--branding-dark) !important;
  color: var(--branding-foreground) !important;
}

/* ─── Checkbox Overrides ─── */
[data-slot="checkbox"][data-state="checked"] {
  background-color: var(--branding-dark) !important;
  border-color: var(--branding-dark) !important;
}

[data-slot="checkbox"][data-state="checked"] [data-slot="checkbox-indicator"] {
  color: var(--branding-foreground) !important;
}
```

- [ ] **Step 3: Update `app/layout.tsx` — swap fonts**

Replace the entire contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers/AppProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyLearn",
  description: "Python learning platform with quizzes and materials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AppProviders>
          <Toaster />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify the foundation compiles**

Run: `cd /home/titanic/Projects/arcanum/pylearn/pylearn-fe && pnpm dev`

Expected: The dev server starts without CSS parsing errors or font loading errors. Stop the dev server after confirming it compiles (Ctrl+C).

---

### Task 2: Sidebar Restyle

**Files:**
- Modify: `features/layout/components/SidebarNav.tsx`

- [ ] **Step 1: Update `features/layout/components/SidebarNav.tsx`**

Make the following six targeted replacements in `features/layout/components/SidebarNav.tsx`:

**Change 1 — Collapsible parent button classes:**
Find:
```tsx
            "text-branding-foreground/80 hover:bg-branding-foreground/10 hover:text-branding-foreground",
            (isActive || hasActiveChild) && "bg-branding-foreground/15 text-branding-foreground",
```
Replace with:
```tsx
            "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            (isActive || hasActiveChild) && "bg-primary/10 text-primary",
```

**Change 2 — Collapsible parent button label span:**
Find (inside the button's wrapper `div`):
```tsx
            <span>{t(item.labelKey)}</span>
```
Replace with:
```tsx
            <span className="font-mono">{t(item.labelKey)}</span>
```

**Change 3 — Leaf nav Link classes:**
Find:
```tsx
        "text-branding-foreground/80 hover:bg-branding-foreground/10 hover:text-branding-foreground",
        isActive && "bg-branding-foreground/15 text-branding-foreground",
```
Replace with:
```tsx
        "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-primary/10 text-primary",
```

**Change 4 — Leaf nav Link label span:**
Find (inside the `<Link>` element):
```tsx
      <span>{t(item.labelKey)}</span>
```
Replace with:
```tsx
      <span className="font-mono">{t(item.labelKey)}</span>
```

**Change 5 — The `<aside>` element classes:**
Find:
```tsx
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-branding-dark text-branding-foreground transition-transform duration-300 lg:translate-x-0",
```
Replace with:
```tsx
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
```

**Change 6 — Logo and footer:**
Find:
```tsx
        <div className="flex h-16 items-center border-b border-branding-foreground/10 px-6">
          <h1 className="text-xl font-bold">
```
Replace with:
```tsx
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-xl font-bold font-mono tracking-tight">
```

Find:
```tsx
        <div className="border-t border-branding-foreground/10 px-6 py-4 pb-8 md:pb-4">
          <p className="text-sm font-medium text-branding-foreground/80">
```
Replace with:
```tsx
        <div className="border-t border-sidebar-border px-6 py-4 pb-8 md:pb-4">
          <p className="text-sm font-medium font-mono text-sidebar-foreground/60">
```

Find:
```tsx
            <p className="text-xs text-branding-foreground/50">
```
Replace with:
```tsx
            <p className="text-xs font-mono text-sidebar-foreground/40">
```

- [ ] **Step 2: Verify sidebar renders**

Run: `cd /home/titanic/Projects/arcanum/pylearn/pylearn-fe && pnpm dev`

Expected: The sidebar should now render with a white background, near-black text, light indigo hover, and indigo active state. Stop the dev server (Ctrl+C).

---

### Task 3: Terminal Tile Component

**Files:**
- Create: `components/ui/terminal-tile.tsx`
- Create: `features/dashboard/components/CodeSnippetWidget.tsx`
- Modify: `features/dashboard/index.ts`

- [ ] **Step 1: Create `components/ui/terminal-tile.tsx`**

Create the file at `components/ui/terminal-tile.tsx` with:

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A dark "terminal" surface tile component.
 * Uses the terminal design tokens: --terminal-bg, --terminal-fg, etc.
 *
 * Renders a macOS-style title bar with traffic-light dots and a monospace content area.
 * Use as a deliberate dark accent tile within the light bento grid to evoke a code editor.
 *
 * @example
 * <TerminalTile title="python3 — script.py">
 *   <p>print("Hello, World!")</p>
 * </TerminalTile>
 */

interface TerminalTileProps extends React.ComponentProps<"div"> {
  /** Text displayed in the title bar next to the traffic-light dots */
  title?: string;
}

function TerminalTile({
  title = "terminal",
  className,
  children,
  ...props
}: TerminalTileProps) {
  return (
    <div
      data-slot="terminal-tile"
      className={cn(
        "overflow-hidden rounded-xl bg-terminal-bg text-terminal-fg",
        className,
      )}
      {...props}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-error" />
          <div className="h-3 w-3 rounded-full bg-warning" />
          <div className="h-3 w-3 rounded-full bg-success" />
        </div>
        <span className="ml-2 font-mono text-xs text-terminal-muted">
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="p-4 font-mono text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export { TerminalTile };
```

- [ ] **Step 2: Create `features/dashboard/components/CodeSnippetWidget.tsx`**

Create the file at `features/dashboard/components/CodeSnippetWidget.tsx` with:

```tsx
"use client";

import { TerminalTile } from "@/components/ui/terminal-tile";

/**
 * "Code Snippet of the Day" widget for the dashboard.
 * Displays a Python code snippet inside a terminal-styled tile.
 * This is the signature dark accent tile in the bento grid.
 *
 * Syntax highlighting uses inline Tailwind arbitrary color values
 * matching a Material-style code theme:
 *   - #C792EA  → keywords (for, in, if) and variable declarations
 *   - #82AAFF  → built-in functions (print) and identifiers
 *   - #F78C6C  → numeric literals
 *   - #C3E88D  → string literals
 *
 * @example
 * <CodeSnippetWidget />
 */
export function CodeSnippetWidget() {
  return (
    <TerminalTile title="python3 — tip_of_the_day.py">
      <div className="space-y-0.5">
        {/* Prompt line */}
        <p className="text-terminal-muted">
          <span className="text-terminal-accent">$</span> python3
          tip_of_the_day.py
        </p>

        {/* Comment */}
        <p className="mt-3 text-terminal-muted">
          # 💡 List comprehension with condition
        </p>

        {/* Code: numbers = [...] */}
        <p>
          <span className="text-[#C792EA]">numbers</span>
          {" = ["}
          <span className="text-[#F78C6C]">1, 2, 3, 4, 5, 6, 7, 8, 9, 10</span>
          {"]"}
        </p>

        {/* Code: evens = [x for x in numbers if x % 2 == 0] */}
        <p>
          <span className="text-[#C792EA]">evens</span>
          {" = ["}
          <span className="text-[#82AAFF]">x</span>
          <span className="text-[#C792EA]"> for </span>
          <span className="text-[#82AAFF]">x</span>
          <span className="text-[#C792EA]"> in </span>
          <span className="text-[#82AAFF]">numbers</span>
          <span className="text-[#C792EA]"> if </span>
          <span className="text-[#82AAFF]">x</span>
          {" % "}
          <span className="text-[#F78C6C]">2</span>
          {" == "}
          <span className="text-[#F78C6C]">0</span>
          {"]"}
        </p>

        {/* Code: print(...) */}
        <p className="mt-1">
          <span className="text-[#82AAFF]">print</span>
          {"("}
          <span className="text-[#C3E88D]">
            {`f"Even numbers: {evens}"`}
          </span>
          {")"}
        </p>

        {/* Output */}
        <p className="mt-3 text-terminal-accent">
          <span className="text-terminal-muted">→</span> Even numbers: [2, 4,
          6, 8, 10]
        </p>
      </div>
    </TerminalTile>
  );
}
```

- [ ] **Step 3: Export `CodeSnippetWidget` from dashboard feature index**

Open `features/dashboard/index.ts` and add this line after the existing component exports (e.g., after the `StudentDashboardView` export):

```ts
export { CodeSnippetWidget } from "./components/CodeSnippetWidget";
```

---

### Task Final: Verify & Commit

- [ ] **Step 1: Commit all changes**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add app/design-tokens.css app/globals.css app/layout.tsx features/layout/components/SidebarNav.tsx components/ui/terminal-tile.tsx features/dashboard/components/CodeSnippetWidget.tsx features/dashboard/index.ts
git commit -m "feat: establish PyLearn design system foundation

- Add design-tokens.css with full color palette, semantic status colors,
  terminal surface tokens, and dark mode retheme
- Remap shadcn CSS variables to new palette (indigo primary, green success,
  amber warning, red error)
- Swap fonts from Geist to Inter (sans) + JetBrains Mono (mono)
- Extend Tailwind @theme with custom utilities (bg-success, text-terminal-*,
  shadow-tile, etc.)
- Add bento grid CSS utilities (.bento-grid, .tile-1x1 through .tile-2x2)
  with responsive breakpoints
- Restyle sidebar: light background, indigo active state, monospace nav labels
- Create reusable TerminalTile component (dark code-editor accent surface)
- Create CodeSnippetWidget dashboard component (Code Snippet of the Day)
- Update base radius from 10px to 12px (rounded-xl feel)"
```

---

## Post-Implementation Notes

After this plan is complete, the design system foundation is in place. Here's what comes next when you're ready to restyle individual components:

### Tailwind Utilities Available

| Utility | What It Does |
|---|---|
| `bg-canvas` | Off-white page background |
| `bg-success` / `text-success` | Green for correct/pass states |
| `bg-warning` / `text-warning` | Amber for in-progress/caution |
| `bg-error` / `text-error` | Red for incorrect/fail states |
| `bg-terminal-bg` | Dark terminal surface |
| `text-terminal-fg` | Light text on terminal surface |
| `text-terminal-accent` | Green accent on terminal (prompt, output) |
| `text-terminal-muted` | Gray text on terminal (comments) |
| `shadow-tile` | Subtle card/tile shadow |
| `shadow-tile-hover` | Elevated shadow for hover states |
| `font-mono` | JetBrains Mono — use for stat numbers, code, tags, labels |
| `bento-grid` | 4-column CSS grid with 24px gap |
| `tile-1x1` through `tile-2x2` | Grid span classes for bento tiles |

### Component Restyle Checklist (For Future PRs)

- [ ] `DashboardHeader` — remove hardcoded `bg-white`, use `shadow-tile`
- [ ] `DashboardStats` — use `shadow-tile`, `font-mono` on stat numbers
- [ ] `QuickActions` — remove hardcoded `bg-white`, use `shadow-tile`
- [ ] `StudentDashboardView` — convert to bento grid layout, add `CodeSnippetWidget` tile
- [ ] `LecturerDashboardView` — convert to bento grid layout
- [ ] `AdminDashboardView` — convert to bento grid layout
- [ ] `LoginForm` / `LoginBranding` — restyle with new palette
- [ ] `MaterialCard` — use `shadow-tile`, `font-mono` for type badges
- [ ] `ProfilePage` — use `shadow-tile`, `font-mono` for role badge
