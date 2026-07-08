import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupService } from "../services/group.service";
import { toast } from "sonner";

export const groupKeys = {
  all: ["groups"] as const,
  lists: () => [...groupKeys.all, "list"] as const,
  detail: (id: string) => [...groupKeys.all, "detail", id] as const,
  studentsActivity: (groupId: string) => [...groupKeys.detail(groupId), "students-activity"] as const,
  studentActivityDetail: (groupId: string, studentId: string) =>
    [...groupKeys.detail(groupId), "student-activity-detail", studentId] as const,
};

export const useGroups = () => {
  return useQuery({
    queryKey: groupKeys.lists(),
    queryFn: GroupService.getGroups,
  });
};

export const useGroup = (id: string, enabled = true) => {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => GroupService.getGroup(id),
    enabled: !!id && enabled,
  });
};

export const useStudentGroup = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [...groupKeys.detail(id), "student"],
    queryFn: () => GroupService.getStudentGroupDetail(id),
    enabled: !!id && enabled,
  });
};

export const useGroupStudentsActivity = (groupId: string, enabled = true) => {
  return useQuery({
    queryKey: groupKeys.studentsActivity(groupId),
    queryFn: () => GroupService.getGroupStudentsActivity(groupId),
    enabled: !!groupId && enabled,
  });
};

export const useGroupStudentActivityDetail = (
  groupId: string,
  studentId: string | null,
  enabled = true
) => {
  return useQuery({
    queryKey: groupKeys.studentActivityDetail(groupId, studentId || ""),
    queryFn: () => GroupService.getGroupStudentActivityDetail(groupId, studentId!),
    enabled: !!groupId && !!studentId && enabled,
  });
};



export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GroupService.createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["lecturer-dashboard"] });
      toast.success(data.message || "Berhasil membuat kelas");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat kelas");
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string | null };
    }) => GroupService.updateGroup(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["lecturer-dashboard"] });
      toast.success(data.message || "Berhasil memperbarui kelas");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui kelas");
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GroupService.deleteGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["lecturer-dashboard"] });
      toast.success(data.message || "Berhasil menghapus kelas");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus kelas");
    },
  });
};
