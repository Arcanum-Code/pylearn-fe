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
  title: z.string(),
  description: z.string().optional(),
  materialType: z.enum(["text", "file", "video", "link"]),
  content: z.string().optional(),
  sourceUrl: z.string().optional(),
  iconName: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export type CreateMaterialRequest = z.infer<typeof createMaterialSchema>;

export const updateMaterialSchema = z.object({
  lecturerId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  sourceUrl: z.string().optional(),
  iconName: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateMaterialRequest = z.infer<typeof updateMaterialSchema>;
