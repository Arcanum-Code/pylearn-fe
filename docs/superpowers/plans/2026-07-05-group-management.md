# Group Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a Group Management feature with a listing view, detail view, and CRUD capabilities. The user interface will use hardcoded Bahasa Indonesia labels.

**Architecture:** We will create a new `groups` feature module under `features/`. The module will include custom React Query hooks for fetching, Axios services for API calls, and Next.js proxy routes in `app/api/groups`. UI components will follow a bento-grid layout with specific accent colors and monospace typography highlights. (i18n is intentionally skipped as per spec).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, React Query, React Hook Form + Zod, Axios.

**Design System Constants:**
- **Layout:** Bento-grid, moderate rounded corners (12-16px), subtle border + soft shadow, generous gutter.
- **Colors:** Background `#F7F8FA`, Text `#1A1C1E`, Primary Interactive `#6366F1`, Success `#10B981`, Warning `#F59E0B`, Error `#EF4444`.
- **Typography:** Sans-serif (Inter/Manrope) for body, Monospace (JetBrains Mono/Fira Code) for numbers, tags, labels, and the terminal dark card.
- **Dark Accent Tile:** One tile per screen will use `#1E1E2E` with light mono text.

---

### Task 1: Create API Endpoints and Types

**Files:**
- Create: `features/groups/types/index.ts`
- Modify: `app/api/api.ts`
- Create: `app/api/groups/route.ts`
- Create: `app/api/groups/[id]/route.ts`

- [ ] **Step 1: Define Types**
Create `features/groups/types/index.ts`:
```typescript
export interface Group {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  materials?: GroupMaterial[];
  quizzes?: GroupQuiz[];
}

export interface GroupMaterial {
  id: string;
  title: string;
  isPublished: boolean;
}

export interface GroupQuiz {
  id: string;
  title: string;
  levelNumber: number;
  isPublished: boolean;
}
```

- [ ] **Step 2: Update API URLs**
Modify `app/api/api.ts` to add `GROUPS` endpoints:
```typescript
  GROUPS: {
    LIST: `${API_URL}/groups/`,
    CREATE: `${API_URL}/groups/`,
    DETAIL: (id: string) => `${API_URL}/groups/${id}`,
    UPDATE: (id: string) => `${API_URL}/groups/${id}`,
    DELETE: (id: string) => `${API_URL}/groups/${id}`,
  },
```

- [ ] **Step 3: Create Next.js proxy route for listing/creating**
Create `app/api/groups/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/api/api";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const lang = req.headers.get("accept-language");
    const response = await axios.get(API_ENDPOINTS.GROUPS.LIST, {
      headers: { Authorization: token, "accept-language": lang },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { success: false, message: "Error" }, { status: error.response?.status || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.headers.get("authorization");
    const lang = req.headers.get("accept-language");
    const response = await axios.post(API_ENDPOINTS.GROUPS.CREATE, body, {
      headers: { Authorization: token, "accept-language": lang },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { success: false, message: "Error" }, { status: error.response?.status || 500 });
  }
}
```

- [ ] **Step 4: Create Next.js proxy route for details/updates**
Create `app/api/groups/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/api/api";
import axios from "axios";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization");
    const lang = req.headers.get("accept-language");
    const response = await axios.get(API_ENDPOINTS.GROUPS.DETAIL(params.id), {
      headers: { Authorization: token, "accept-language": lang },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { success: false, message: "Error" }, { status: error.response?.status || 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const token = req.headers.get("authorization");
    const lang = req.headers.get("accept-language");
    const response = await axios.patch(API_ENDPOINTS.GROUPS.UPDATE(params.id), body, {
      headers: { Authorization: token, "accept-language": lang },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { success: false, message: "Error" }, { status: error.response?.status || 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization");
    const lang = req.headers.get("accept-language");
    const response = await axios.delete(API_ENDPOINTS.GROUPS.DELETE(params.id), {
      headers: { Authorization: token, "accept-language": lang },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { success: false, message: "Error" }, { status: error.response?.status || 500 });
  }
}
```

---

### Task 2: Create Services, Schemas, and Hooks

**Files:**
- Create: `features/groups/services/group.service.ts`
- Create: `features/groups/schemas/group.schema.ts`
- Create: `features/groups/hooks/useGroups.ts`

- [ ] **Step 1: Create Axios Service**
Create `features/groups/services/group.service.ts`:
```typescript
import axios from "@/app/utils/axios";
import { Group } from "../types";

export const GroupService = {
  getGroups: async (): Promise<Group[]> => {
    const { data } = await axios.get("/api/groups");
    return data.data;
  },
  getGroup: async (id: string): Promise<Group> => {
    const { data } = await axios.get(`/api/groups/${id}`);
    return data.data;
  },
  createGroup: async (payload: { name: string; description?: string }) => {
    const { data } = await axios.post("/api/groups", payload);
    return data;
  },
  updateGroup: async (id: string, payload: { name?: string; description?: string }) => {
    const { data } = await axios.patch(`/api/groups/${id}`, payload);
    return data;
  },
  deleteGroup: async (id: string) => {
    const { data } = await axios.delete(`/api/groups/${id}`);
    return data;
  }
};
```

- [ ] **Step 2: Create Validation Schema**
Create `features/groups/schemas/group.schema.ts`:
```typescript
import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().min(1, "Nama kelas diperlukan"),
  description: z.string().optional().nullable(),
});

export type GroupFormData = z.infer<typeof groupSchema>;
```

- [ ] **Step 3: Create React Query Hooks**
Create `features/groups/hooks/useGroups.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupService } from "../services/group.service";
import { toast } from "sonner";

export const groupKeys = {
  all: ["groups"] as const,
  lists: () => [...groupKeys.all, "list"] as const,
  detail: (id: string) => [...groupKeys.all, "detail", id] as const,
};

export const useGroups = () => {
  return useQuery({
    queryKey: groupKeys.lists(),
    queryFn: GroupService.getGroups,
  });
};

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => GroupService.getGroup(id),
    enabled: !!id,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GroupService.createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      toast.success(data.message || "Berhasil membuat kelas");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat kelas");
    }
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) => GroupService.updateGroup(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
      toast.success(data.message || "Berhasil memperbarui kelas");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui kelas");
    }
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GroupService.deleteGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      toast.success(data.message || "Berhasil menghapus kelas");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus kelas");
    }
  });
};
```

---

### Task 3: Create UI Components (Form Dialog)

**Files:**
- Create: `features/groups/components/GroupFormDialog.tsx`

- [ ] **Step 1: Implement Form Dialog**
Create `features/groups/components/GroupFormDialog.tsx`:
```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupFormData, groupSchema } from "../schemas/group.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateGroup, useUpdateGroup } from "../hooks/useGroups";
import { Group } from "../types";
import { useEffect } from "react";

interface GroupFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group?: Group | null;
}

export function GroupFormDialog({ isOpen, onClose, group }: GroupFormDialogProps) {
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: "", description: "" }
  });

  useEffect(() => {
    if (group) {
      reset({ name: group.name, description: group.description || "" });
    } else {
      reset({ name: "", description: "" });
    }
  }, [group, reset]);

  const onSubmit = (data: GroupFormData) => {
    if (group) {
      updateMutation.mutate({ id: group.id, data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#F7F8FA] rounded-2xl border-none shadow-xl text-[#1A1C1E]">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl font-sans">
            {group ? "Ubah Kelas" : "Buat Kelas"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
          <div>
            <label className="text-sm font-semibold">Nama Kelas</label>
            <Input 
              {...register("name")} 
              className="mt-1 border-gray-300 rounded-xl focus:ring-[#6366F1]" 
            />
            {errors.name && <span className="text-[#EF4444] text-sm mt-1">{errors.name.message}</span>}
          </div>
          <div>
            <label className="text-sm font-semibold">Deskripsi</label>
            <Input 
              {...register("description")} 
              className="mt-1 border-gray-300 rounded-xl focus:ring-[#6366F1]" 
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-mono text-sm">
              Batal
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-sm shadow-md">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Task 4: Create List View and App Route (Bento Grid)

**Files:**
- Create: `features/groups/components/GroupList.tsx`
- Create: `app/(main)/groups/page.tsx`

- [ ] **Step 1: Implement List View**
Create `features/groups/components/GroupList.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useGroups, useDeleteGroup } from "../hooks/useGroups";
import { GroupFormDialog } from "./GroupFormDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Group } from "../types";
import { Trash, Edit } from "lucide-react";

export function GroupList() {
  const { data: groups, isLoading } = useGroups();
  const deleteMutation = useDeleteGroup();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const handleEdit = (e: React.MouseEvent, group: Group) => {
    e.preventDefault();
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if(confirm("Apakah Anda yakin?")) deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-8 h-8 text-[#6366F1]" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight">Kelas</h1>
        <Button 
          onClick={() => { setEditingGroup(null); setIsDialogOpen(true); }}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl shadow-md font-mono font-medium"
        >
          + Buat Kelas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.length === 0 && <p className="text-gray-500 col-span-full font-mono">Belum ada kelas.</p>}
        {groups?.map((group, i) => (
          <Link href={`/groups/${group.id}`} key={group.id} className="block group">
            <div className={`p-6 rounded-2xl shadow-sm border transition-all duration-200 hover:-translate-y-1 hover:shadow-md h-full flex flex-col justify-between ${
                i % 4 === 0 ? "bg-[#1E1E2E] text-gray-200 border-gray-800" : "bg-white text-[#1A1C1E] border-gray-100"
              }`}>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${i % 4 === 0 ? "text-white" : "text-[#1A1C1E]"}`}>{group.name}</h3>
                <p className={`text-sm mb-4 ${i % 4 === 0 ? "text-gray-400" : "text-gray-500"}`}>{group.description || "Tidak ada deskripsi"}</p>
                <div className="inline-block px-3 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] font-mono text-xs font-semibold">
                  ID: {group.id.slice(0, 8)}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" size="icon" onClick={(e) => handleEdit(e, group)} className={i % 4 === 0 ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-[#6366F1]"}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => handleDelete(e, group.id)} className={i % 4 === 0 ? "text-gray-400 hover:text-[#EF4444] hover:bg-gray-800" : "text-gray-400 hover:text-[#EF4444]"}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <GroupFormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} group={editingGroup} />
    </div>
  );
}
```

- [ ] **Step 2: Create Main Route**
Create `app/(main)/groups/page.tsx`:
```tsx
import { GroupList } from "@/features/groups/components/GroupList";

export default function GroupsPage() {
  return <GroupList />;
}
```

---

### Task 5: Create Detail View and App Route

**Files:**
- Create: `features/groups/components/GroupDetail.tsx`
- Create: `app/(main)/groups/[id]/page.tsx`

- [ ] **Step 1: Implement Detail View**
Create `features/groups/components/GroupDetail.tsx`:
```tsx
"use client";

import { useGroup } from "../hooks/useGroups";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";

export function GroupDetail({ id }: { id: string }) {
  const { data: group, isLoading } = useGroup(id);

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-8 h-8 text-[#6366F1]" /></div>;
  if (!group) return <div className="p-8 text-center font-mono">Kelas tidak ditemukan</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
      <Link href="/groups" className="inline-flex items-center text-[#6366F1] font-mono hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Kelas
      </Link>
      
      {/* Dark Terminal Header Tile */}
      <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl shadow-lg border border-gray-800">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{group.name}</h1>
        <p className="text-gray-400 font-mono text-sm mb-4">ID: {group.id}</p>
        <p className="text-gray-300 max-w-2xl">{group.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materials Tile */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#6366F1]/10 text-[#6366F1] rounded-xl"><BookOpen className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold">Materi</h2>
          </div>
          <div className="space-y-3 flex-1">
            {group.materials?.length === 0 && <p className="text-gray-500 font-mono text-sm">Belum ada materi untuk kelas ini.</p>}
            {group.materials?.map(m => (
              <div key={m.id} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="font-semibold">{m.title}</span>
                <span className={`font-mono text-xs px-2 py-1 rounded-md ${m.isPublished ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                  {m.isPublished ? 'Dipublikasikan' : 'Draf'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes Tile */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#10B981]/10 text-[#10B981] rounded-xl"><CheckCircle className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold">Kuis</h2>
          </div>
          <div className="space-y-3 flex-1">
            {group.quizzes?.length === 0 && <p className="text-gray-500 font-mono text-sm">Belum ada kuis untuk kelas ini.</p>}
            {group.quizzes?.map(q => (
              <div key={q.id} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="font-semibold block">{q.title}</span>
                  <span className="text-xs text-gray-500 font-mono">Level {q.levelNumber}</span>
                </div>
                <span className={`font-mono text-xs px-2 py-1 rounded-md ${q.isPublished ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                  {q.isPublished ? 'Aktif' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Details Route**
Create `app/(main)/groups/[id]/page.tsx`:
```tsx
import { GroupDetail } from "@/features/groups/components/GroupDetail";

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  return <GroupDetail id={params.id} />;
}
```

---

### Task 6: Integrate with Dashboard

**Files:**
- Modify: `features/dashboard/components/LecturerDashboardContainer.tsx`

- [ ] **Step 1: Add link to the Group Management page**
Modify `features/dashboard/components/LecturerDashboardContainer.tsx`. At the top of the file, add:
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
```
Then, inside the main `div className="space-y-6"`, insert a new tile/button next to the Selector Header Bar:
```tsx
// Find this block:
      {/* Selector Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-xs">
// Change the outer div to this to add the new button nicely:
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {selectedGroupId === "all"
              ? "Ringkasan Umum"
              : groups?.find((g) => g.id === selectedGroupId)?.name || "Detail Kelas"}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selectedGroupId === "all"
              ? "Analisis seluruh materi dan pengerjaan kuis siswa"
              : "Analisis khusus perkembangan kuis dan materi pada kelas ini"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link href="/groups">
            <Button variant="outline" className="rounded-xl border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10 font-mono text-sm">
              <Users className="w-4 h-4 mr-2" />
              Kelola Kelas (Groups)
            </Button>
          </Link>

          <div className="flex items-center gap-3 border-l pl-3 ml-1">
            <span className="text-sm font-medium text-muted-foreground">Kelas:</span>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
// ...rest remains exactly the same...
```

---

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files created/modified are committed together.

```bash
git add .
git commit -m "feat: implement complete group management feature with bento grid design"
```
