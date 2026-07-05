# Material Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relocate Material creation, editing, and deletion to the Group Detail page, and refactor the Materials page to be a read-only list with a group filter.

**Architecture:** We will modify the layout configuration to reorder the sidebar menu. We will add a `readOnly` prop to `MaterialCard` to control action visibility. We'll update the `CreateMaterialDialog` to accept a `groupId` so materials can be correctly mapped. `EditMaterialDialog` and `DeleteMaterialDialog` will also be rendered in the Group Detail page. The Materials page will get a new group selector dropdown filter.

**Tech Stack:** Next.js, React, Tailwind CSS, shadcn/ui, React Query, React Hook Form, Zod

---

### Task 1: Reorder Sidebar Menu

**Files:**
- Modify: `features/layout/config/sidebar.ts`

- [ ] **Step 1: Swap navigation items**

Modify `sidebarConfig` so that `navigation.groups` (Kelas) appears above `navigation.materials` (Materi).

```typescript
export const sidebarConfig: SidebarNavItem[] = [
  {
    labelKey: "navigation.dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    labelKey: "navigation.groups",
    icon: GraduationCap,
    href: "/groups",
    feature: "group_management",
  },
  {
    labelKey: "navigation.materials",
    icon: BookOpen,
    href: "/materials",
  },
  {
    labelKey: "navigation.management",
    icon: Users,
    children: [
      {
        labelKey: "navigation.users",
        icon: Users,
        href: "/management/users",
        feature: "user_management",
      },
      {
        labelKey: "navigation.roles",
        icon: Shield,
        href: "/management/roles",
        feature: "RBAC_management",
      },
    ],
  },
];
```

- [ ] **Step 2: Manual Check**
Verify via types or simple check that `sidebar.ts` exports correctly and the app compiles.

### Task 2: Refactor Dialogs to Accept groupId & Update Schema

**Files:**
- Modify: `features/materials/schemas/materialSchema.ts`
- Modify: `features/materials/components/CreateMaterialDialog.tsx`

- [ ] **Step 1: Add `groupId` to filters schema**

```typescript
export const materialFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
  lecturerId: z.string().optional(),
  groupId: z.string().optional(),
  materialType: z.enum(["text", "file", "video", "link"]).optional(),
  isPublished: z.boolean().optional(),
});
```

- [ ] **Step 2: Update `CreateMaterialDialog` to use `groupId`**

```typescript
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { MaterialForm } from "./MaterialForm";
import { useCreateMaterial } from "../hooks/useMaterials";

export function CreateMaterialDialog({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate: createMaterial, isPending } = useCreateMaterial();

  const onSubmit = (values: any) => {
    const formData = new FormData();

    formData.append("groupId", groupId);
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("materialType", values.materialType);
    formData.append("iconName", values.iconName);
    formData.append("isPublished", String(values.isPublished));

    if (values.materialType === "text") {
      formData.append("content", values.content || "");
    } else if (values.materialType === "file" && values.file) {
      formData.append("file", values.file);
    }

    createMaterial(formData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-branding-dark gap-2">
          <Plus className="h-4 w-4" />
          Buat Materi Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-branding-dark">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Tambah Materi Pembelajaran
              </DialogTitle>
              <DialogDescription>
                Isi formulir di bawah untuk membuat materi teks atau mengunggah
                file PDF.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <MaterialForm onSubmit={onSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}
```

### Task 3: Group Detail Action Integration

**Files:**
- Modify: `features/groups/components/GroupDetail.tsx`

- [ ] **Step 1: Import Dialogs and add them to GroupDetail**

Update `GroupDetail.tsx` to include `CreateMaterialDialog`, `EditMaterialDialog`, and `DeleteMaterialDialog` so materials can be fully managed here. 

```typescript
// Add these imports at the top:
import { CreateMaterialDialog } from "@/features/materials/components/CreateMaterialDialog";
import { EditMaterialDialog } from "@/features/materials/components/EditMaterialDialog";
import { DeleteMaterialDialog } from "@/features/materials/components/DeleteMaterialDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Material } from "@/features/materials/types";

// Inside the GroupDetail component definition, add state:
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [deleteMaterial, setDeleteMaterial] = useState<Material | null>(null);

/* Find the Materials Bento Tile and update its content: */
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-150/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#6366F1]/10 text-[#6366F1] rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1A1C1E]">Materi Pembelajaran</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Daftar materi yang ditugaskan ke kelas ini.</p>
                </div>
              </div>
              <CreateMaterialDialog groupId={group.id} />
            </div>
            <div className="space-y-3">
              {group.materials?.length === 0 && (
                <p className="text-gray-400 font-mono text-sm py-4">
                  Belum ada materi untuk kelas ini.
                </p>
              )}
              {group.materials?.map((m: any) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/40"
                >
                  <span className="font-semibold text-sm text-[#1A1C1E]">{m.title}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider ${
                        m.isPublished
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : "bg-[#F59E0B]/10 text-[#F59E0B]"
                      }`}
                    >
                      {m.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setEditMaterial(m)}>
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteMaterial(m)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {editMaterial && (
            <EditMaterialDialog
              material={editMaterial}
              isOpen={!!editMaterial}
              onOpenChange={(open) => !open && setEditMaterial(null)}
            />
          )}
          {deleteMaterial && (
            <DeleteMaterialDialog
              material={deleteMaterial}
              isOpen={!!deleteMaterial}
              onOpenChange={(open) => !open && setDeleteMaterial(null)}
            />
          )}
        </div>
```

### Task 4: Refactor MaterialCard and Header for Read-Only

**Files:**
- Modify: `features/materials/components/MaterialCard.tsx`
- Modify: `features/materials/components/MaterialHeader.tsx`
- Modify: `features/materials/components/MaterialsList.tsx`

- [ ] **Step 1: Add `readOnly` prop to `MaterialCard.tsx`**

```typescript
// Update MaterialCardProps interface
export interface MaterialCardProps {
  material: Material;
  index: number;
  readOnly?: boolean;
}

// Then conditionally render the DropdownMenu around line 118:
{!readOnly && (
  <DropdownMenu>
    {/* ...existing dropdown content... */}
  </DropdownMenu>
)}
```

- [ ] **Step 2: Remove `CreateMaterialDialog` from `MaterialHeader.tsx`**

```typescript
import { BookOpen } from "lucide-react";
import { useTranslations } from "@/lib/i18n/useTranslation";

export function MaterialHeader() {
  const t = useTranslations();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("materials.title") || "Materi Pembelajaran"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("materials.subtitle") ||
              "Jelajahi dan pelajari materi yang tersedia untuk Anda."}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update `MaterialsList.tsx` to pass `readOnly`**

```typescript
// Inside mapping of materials inside MaterialsList.tsx:
<MaterialCard key={material.id} material={material} index={index} readOnly={true} />
```

### Task 5: Add Group Filter to Materials Page

**Files:**
- Modify: `features/materials/components/MaterialFilters.tsx`

- [ ] **Step 1: Add select dropdown using `useGroups`**

```typescript
// Add these imports at the top
import { useGroups } from "@/features/groups/hooks/useGroups";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Inside MaterialFilters component:
export function MaterialFilters({ filters, onFilterChange }: MaterialFiltersProps) {
  const { data: groupsData } = useGroups();
  const groups = groupsData?.data || [];

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Existing Search input... */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* ...existing type filter... */}
        
        {/* Add this new group filter next to the other filters */}
        <div className="w-full sm:w-[200px]">
          <Select
            value={filters.groupId || "all"}
            onValueChange={(val) =>
              onFilterChange({ ...filters, groupId: val === "all" ? undefined : val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {groups.map((group: any) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
```

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add .
git commit -m "feat: relocate material management to group detail and make materials page read-only"
```
