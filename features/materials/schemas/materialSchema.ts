import { z } from "zod";

export const materialFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
  lecturerId: z.string().optional(),
  groupId: z.string().optional(),
  materialType: z.enum(["text", "file", "video", "link"]).optional(),
  isPublished: z.boolean().optional(),
});

export type MaterialFiltersData = z.infer<typeof materialFiltersSchema>;

export const createMaterialSchema = z.object({
  title: z.string().min(1, "Judul materi wajib diisi").max(200, "Judul maksimal 200 karakter"),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional().or(z.literal("")),
  materialType: z.literal("file").default("file"),
  publishedAt: z.date().nullable().optional(),
  file: z.any().refine((file) => file instanceof File, "File PDF wajib diunggah"),
});

export type CreateMaterialRequest = z.infer<typeof createMaterialSchema>;

export const updateMaterialSchema = z.object({
  title: z.string().min(1, "Judul materi wajib diisi").max(200, "Judul maksimal 200 karakter").optional(),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional().or(z.literal("")),
  materialType: z.literal("file").default("file"),
  publishedAt: z.date().nullable().optional(),
  file: z.any().optional(),
});

export type UpdateMaterialRequest = z.infer<typeof updateMaterialSchema>;
