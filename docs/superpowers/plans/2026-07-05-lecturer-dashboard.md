# Lecturer Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the new Lecturer Dashboard per API specs. It will feature a General Overview, Group-Specific Analytics, a Group Selector dropdown, and leverage the new Bento-Grid design system to display actionable content health metrics.

**Architecture:**
- **API Layer:** Expand `app/api/api.ts` and create Next.js proxy routes for the new `/api/lecturer/groups/*` endpoints.
- **Data Layer:** Create services and React Query hooks for fetching group summaries and content health.
- **UI Layer:** 
  - Create a parent container (`LecturerDashboardContainer`) to manage group selection state.
  - Refactor `LecturerDashboardView` to use the `.bento-grid` layout.
  - Create `GroupDashboardView` to display group-specific stats and flagged content health using Amber/Red tokens.

**Design Constraints (STRICT):**
- **Layout:** Use `.bento-grid` class for the main wrapper. Tiles must use `<Card>` or `<TerminalTile>` (rounded-xl/2xl, subtle shadow).
- **Typography:** Force `font-mono` on all statistic numbers (e.g., total materials, pass rates) and badge labels.
- **Colors & Flags:** Use `text-amber-500` and `text-red-500` (or our custom tokens) for content health flags.
- **Accent Tile:** Ensure exactly one tile (e.g., the Group Summary high-level stats or the overview breakdown) uses the dark `<TerminalTile>` component to break up the light canvas.

---

### Task 1: API Configuration & Next.js Proxies

**Files:**
- Modify: `app/api/api.ts`
- Create: `app/api/lecturer/groups/route.ts`
- Create: `app/api/lecturer/groups/[groupId]/dashboard/summary/route.ts`
- Create: `app/api/lecturer/groups/[groupId]/dashboard/content-health/route.ts`

- [ ] **Step 1: Add LECTURER endpoints to API registry**
In `app/api/api.ts`, add a `LECTURER` block with:
  - `GROUPS: () => \`\${API_URL}/lecturer/groups\``
  - `GROUP_SUMMARY: (groupId: string) => \`\${API_URL}/lecturer/groups/\${groupId}/dashboard/summary\``
  - `GROUP_CONTENT_HEALTH: (groupId: string) => \`\${API_URL}/lecturer/groups/\${groupId}/dashboard/content-health\``

- [ ] **Step 2: Create Next.js proxy routes**
Implement the three API route files using the standard proxy pattern (forwarding `Authorization` and `accept-language` headers).

### Task 2: Services & React Query Hooks

**Files:**
- Modify/Create: `features/dashboard/services/lecturer.service.ts`
- Modify/Create: `features/dashboard/hooks/useLecturerDashboard.ts`
- Modify/Create: `features/dashboard/types/index.ts`

- [ ] **Step 1: Define TypeScript Types**
Add interfaces for `GroupSummaryData`, `ContentHealthData`, and `GroupData` to `types/index.ts` based on the API documentation.

- [ ] **Step 2: Implement Services**
Create Axios calls in `lecturer.service.ts` for fetching the groups list, group summary, and content health.

- [ ] **Step 3: Implement React Query Hooks**
Create `useLecturerGroups`, `useGroupSummary(groupId)`, and `useGroupContentHealth(groupId)` in `useLecturerDashboard.ts`.

### Task 3: Lecturer Dashboard Container & Group Selector

**Files:**
- Create: `features/dashboard/components/LecturerDashboardContainer.tsx`
- Modify: `app/(main)/dashboard/page.tsx` (to use the new container)

- [ ] **Step 1: Build the Container**
The container should:
  1. Fetch the lecturer's groups.
  2. Maintain a `selectedGroupId` state (defaulting to `"all"` or `null` for General Overview).
  3. Render a `Select` dropdown in the header to pick a group.
  4. Conditionally render `<LecturerDashboardView>` if `"all"` is selected, or `<GroupDashboardView groupId={selectedGroupId}>` otherwise.

### Task 4: Refactor General Overview to Bento Grid

**Files:**
- Modify: `features/dashboard/components/LecturerDashboardView.tsx`

- [ ] **Step 1: Apply `.bento-grid` layout**
Wrap the stats and the material breakdown table in a `div className="bento-grid"`. Convert the material breakdown card into a stylized tile that fits the grid aesthetic.

### Task 5: Build Group-Specific Dashboard View

**Files:**
- Create: `features/dashboard/components/GroupDashboardView.tsx`

- [ ] **Step 1: Build GroupDashboardView**
Create the component that receives `groupId` as a prop.
- Fetch data using `useGroupSummary` and `useGroupContentHealth`.
- Render high-level summary metrics (pass rate, materials read) using Bento stat cards.
- Render a Content Health tile: a table/list displaying quizzes and materials. If a flag is present (e.g., `high_failure_rate`), render a prominent `<Badge variant="destructive">` (Red token) or warning badge (Amber token) to draw attention.

### Task Final: Verify and Commit

- [ ] **Step 1: Verify Build and Typechecks**
Run `npm run build` to ensure all new components and types compile successfully.

- [ ] **Step 2: Commit**
```bash
git add app/api/api.ts app/api/lecturer/ features/dashboard/ app/(main)/dashboard/page.tsx
git commit -m "feat(dashboard): implement lecturer dashboard with group-specific analytics and bento UI"
```
